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
    icons: {
      icon: "/logo.png", // Aseguramos que cargará tu logo si lo subes a public/logo.png
    },
    openGraph: {
      title: `Demo IA - Clínica ${prettyName}`,
      description: "Demostración interactiva de sistemas automatizados",
      images: [
        {
          url: "/logo.png", // Imagen para la previsualización en WhatsApp/Slack
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
  
  let customSiteUrl = "https://institutocapilar.es";
  let customColor = "#1a4b8c";
  let customIndustry = "Clínica Capilar";

  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        OR: [
          { slug: clinicSlug },
          ...(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(clinicSlug) ? [{ id: clinicSlug }] : [])
        ]
      },
      include: { websites: true, brandings: true }
    });
    
    if (clinic) {
      customSiteUrl = clinic.websites?.[0]?.url || customSiteUrl;
      customColor = clinic.brandings?.[0]?.primaryColor || customColor;
      customIndustry = clinic.industry || customIndustry;
    } else {
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
        // @ts-ignore - Handle mock database industry
        if (dbConfig.industry) customIndustry = dbConfig.industry;
      }
    }
  } catch (error) {
     console.error("Failed to load clinic in demo hub", error);
  }

  const customVideo = typeof resolvedSearchParams.video === 'string' ? resolvedSearchParams.video : undefined;

  // Por defecto usamos proxy para saltar las protecciones X-Frame-Options.
  // Solo desactivamos proxy si pasamos ?proxy=false
  const useProxy = resolvedSearchParams.proxy !== 'false';
  const finalUrl = useProxy ? `/api/v1/proxy?url=${encodeURIComponent(customSiteUrl)}` : customSiteUrl;

  const forceImageMode = resolvedSearchParams.image === 'true';

  console.log("=== DEBUG [page.tsx] ===");
  console.log("clinicSlug:", clinicSlug);
  console.log("customIndustry FINALLY:", customIndustry);
  console.log("=====================");

  return (
    <DemoOverlay 
      clinicUrl={finalUrl} 
      themeColor={customColor} 
      useImageMode={forceImageMode}
      videoPitchUrl={customVideo}
      niche={customIndustry}
    />
  );
}
