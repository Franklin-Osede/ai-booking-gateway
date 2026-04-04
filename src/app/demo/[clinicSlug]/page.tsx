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
    description: "Demostración interactiva de Inteligencia Artificial Capilar",
  };
}

import { prisma } from "@/lib/prisma";

export default async function DemoPage({ params, searchParams }: DemoProps) {
  const { clinicSlug } = await params;
  const resolvedSearchParams = await searchParams;
  
  let customSiteUrl = "https://drsanmartin.com/";
  let customColor = "#8c1a1a";

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
    } else {
      // Legacy Mock Fallback
      const mockDatabase: Record<string, { url: string, color: string }> = {
        "instituto-capilar": { url: "https://institutocapilar.es", color: "#1a4b8c" },
        "clinica-arbelaez": { url: "https://www.clinicaarbelaez.com/", color: "#ededed" },
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
      }
    }
  } catch (error) {
     console.error("Failed to load clinic in demo hub", error);
  }

  const customVideo = typeof resolvedSearchParams.video === 'string' ? resolvedSearchParams.video : undefined;

  // Por defecto NO usamos proxy porque rompe algunas webs como Squarespace.
  // Solo usar proxy si pasamos ?proxy=true
  const useProxy = resolvedSearchParams.proxy === 'true';
  const finalUrl = useProxy ? `/api/v1/proxy?url=${encodeURIComponent(customSiteUrl)}` : customSiteUrl;

  const forceImageMode = resolvedSearchParams.image === 'true';

  return (
    <DemoOverlay 
      clinicUrl={finalUrl} 
      themeColor={customColor} 
      useImageMode={forceImageMode}
      videoPitchUrl={customVideo}
    />
  );
}
