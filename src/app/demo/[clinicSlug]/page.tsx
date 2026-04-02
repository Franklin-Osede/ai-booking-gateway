import { DemoOverlay } from "../../../presentation/components/demo/DemoOverlay";
import { Metadata } from 'next';

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

export default async function DemoPage({ params, searchParams }: DemoProps) {
  const { clinicSlug } = await params;
  const resolvedSearchParams = await searchParams;
  
  // MOCK DATA TEMPORAL
  const mockDatabase: Record<string, { url: string, color: string }> = {
    "instituto-capilar": {
      url: "https://institutocapilar.es",
      color: "#1a4b8c"
    },
    "clinica-arbelaez": {
      url: "https://www.clinicaarbelaez.com/",
      color: "#ededed" // Color solicitado
    },
    // Fallback genérico para que no salga 'Example Domain' si escribes mal
    "default": {
       url: "https://drsanmartin.com/", // Web real capilar que permite Iframes
       color: "#8c1a1a" // Granate
    }
  };

  const dbConfig = mockDatabase[clinicSlug] || mockDatabase["default"];
  
  // TRUCO MÁGICO: Si pasas por parámetros ?site=LA-WEB-DE-LA-CLINICA , pisará a la base de datos
  const customSiteUrl = typeof resolvedSearchParams.site === 'string' ? resolvedSearchParams.site : dbConfig.url;
  const customColor = typeof resolvedSearchParams.color === 'string' ? `#${resolvedSearchParams.color}` : dbConfig.color;

  const customVideo = typeof resolvedSearchParams.video === 'string' ? resolvedSearchParams.video : undefined;

  // Por defecto NO usamos proxy porque rompe algunas webs como Squarespace.
  // Solo usar proxy si pasamos ?proxy=true
  const useProxy = resolvedSearchParams.proxy === 'true';
  const finalUrl = useProxy ? `/api/v1/proxy?url=${encodeURIComponent(customSiteUrl)}` : customSiteUrl;

  return (
    <DemoOverlay 
      clinicUrl={finalUrl} 
      themeColor={customColor} 
      videoPitchUrl={customVideo}
    />
  );
}
