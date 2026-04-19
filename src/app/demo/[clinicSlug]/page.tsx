import { DemoOverlay } from "../../../presentation/components/demo/DemoOverlay";
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // Desactiva la caché agresiva de Next.js 15 para esta ruta

type DemoProps = {
  params: Promise<{ clinicSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Generar metadata dinámica para la pestaña del navegador
export async function generateMetadata({ params }: DemoProps): Promise<Metadata> {
  const { clinicSlug } = await params;
  const prettyName = clinicSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `Demo IA - Clínica ${prettyName}`,
    description: "Demostración interactiva de sistemas automatizados",
    openGraph: {
      title: `Demo IA - Clínica ${prettyName}`,
      description: "Demostración interactiva de sistemas automatizados",
      images: [
        {
          url: "/icon.svg", // Imagen para la previsualización en WhatsApp/Slack
          width: 512,
          height: 512,
          alt: "Logo",
        },
      ],
    },
  };
}

import { prisma } from "@/lib/prisma";

export default async function DemoPage({ params, searchParams }: DemoProps) {
  const { clinicSlug } = await params;
  const resolvedSearchParams = await searchParams;
  let customSiteUrl = "";
  let customColor = "#1a4b8c";
  let customIndustry = "Clínica Capilar";
  let detectedLang = "es";
  let customVideo = typeof resolvedSearchParams.video === 'string' ? resolvedSearchParams.video : undefined;
  let customWidgetPosition = "right";

  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        OR: [
          { slug: clinicSlug },
          ...(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(clinicSlug) ? [{ id: clinicSlug }] : [])
        ]
      },
      include: {
        runtimeConfig: true
      }
    });
    
    if (clinic) {
      if (clinic.runtimeConfig) {
        customSiteUrl = clinic.runtimeConfig.publishedWebsiteUrl || "";
        customColor = clinic.runtimeConfig.publishedBrandColor || customColor;
        customIndustry = clinic.runtimeConfig.publishedNiche || clinic.industry || customIndustry;
        detectedLang = clinic.runtimeConfig.publishedLocale || "es-ES";
        
        if (clinic.runtimeConfig.fallbackMode === 'neutral') {
            customSiteUrl = ""; // empty url triggers neutral mode in DemoOverlay
        }
      } else {
        // Fallback for clinics that haven't published yet
        console.warn(`[Demo Hub] Warning: Clinic ${clinicSlug} has no runtimeConfig. Triggering neutral fallback.`);
        customSiteUrl = "";
      }

      if (clinic.videoUrl) customVideo = clinic.videoUrl;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((clinic as any).widgetPosition) customWidgetPosition = (clinic as any).widgetPosition;
    } else {
      // Legacy Mock Databases fallback if clinic wasn't in DB at all
      const mockDatabase: Record<string, { url: string, color: string, industry?: string }> = {
        "instituto-capilar": { url: "https://institutocapilar.es", color: "#1a4b8c", industry: "Clínica Capilar" },
        "clinica-arbelaez": { url: "https://www.clinicaarbelaez.com/", color: "#ededed", industry: "Clínica Capilar" },
        "info-mncapilar": { url: "https://info.mncapilar.com/", color: "#1a4b8c", industry: "Clínica Capilar" },
        "clinicaciro": { url: "https://www.clinicaciro.es/", color: "#1a4b8c", industry: "Clínica Dental" }
      };
      
      let clinicsDb: Record<string, { url: string, color: string }> = {};
      try {
        const dbPath = path.join(process.cwd(), 'src/app/demo/clinics_db.json');
        if (fs.existsSync(dbPath)) {
          clinicsDb = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        }
      } catch { }

      const dbConfig = clinicsDb[clinicSlug] || mockDatabase[clinicSlug];
      if (dbConfig) {
        customSiteUrl = dbConfig.url;
        customColor = dbConfig.color;
        // @ts-expect-error - Handle mock database industry
        if (dbConfig.industry) customIndustry = dbConfig.industry;
      }
    }
  } catch (error) {
     console.error("Failed to load clinic in demo hub", error);
  }

  const customColorMatch = customColor?.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
  if (customColorMatch) customColor = customColorMatch[0];

  // Por defecto usamos proxy para saltar las protecciones X-Frame-Options.
  // Solo desactivamos proxy si pasamos ?proxy=false
  const useProxy = resolvedSearchParams.proxy !== 'false';
  const finalUrl = (!customSiteUrl || customSiteUrl.trim() === "") 
     ? "" 
     : (useProxy ? `/api/v1/proxy?url=${encodeURIComponent(customSiteUrl)}` : customSiteUrl);

  const forceImageMode = resolvedSearchParams.image === 'true';
  const forceLang = resolvedSearchParams.lang as string;
  if (forceLang) detectedLang = forceLang;

  console.log("=== DEBUG [page.tsx] ===");
  console.log("clinicSlug:", clinicSlug);
  console.log("customIndustry FINALLY:", customIndustry);
  console.log("detectedLang:", detectedLang);
  console.log("=====================");

  return (
    <DemoOverlay 
      clinicUrl={finalUrl} 
      themeColor={customColor} 
      useImageMode={forceImageMode}
      videoPitchUrl={customVideo}
      niche={customIndustry}
      lang={detectedLang}
      widgetPosition={customWidgetPosition}
    />
  );
}
