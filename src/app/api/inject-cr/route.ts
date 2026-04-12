import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Fantasma Digital / Escaparate Vacío'. Dominio prácticamente inactivo a nivel SEO. Autoridad de dominio mínima (DA 5) y literalmente 0 visitas orgánicas registradas. Si están facturando y cerrando pacientes, el 100% de su captación depende de recomendación offline o de inyectar dinero puro en Paid Ads (Meta/Google).",
    traffic: "0 visitas orgánicas. La gráfica de volumen refleja una inactividad total. No existen en Google de forma natural.",
    cost: "El coste por adquisición (CPA) debe ser altísimo si están pagando anuncios, ya que cada persona que entra a su web es tráfico comprado. Si la web no convierte rápido, el dinero de Ads se quema literalmente.",
    topPages: "Nulo posicionamiento. Algunos rastros en página 9 o similares por 'clinica cristiano ronaldo', pero sin generar ningún clic real.",
    competitors: "No son competencia orgánica para nadie. Las grandes marcas monopolizan el nombre.",
    socialTraffic: "Dependencia absoluta: O viven del tráfico social de pago (Ads) o de relaciones públicas externas.",
    insights: "PITCH CONSULTIVO: EL BLINDAJE DE ADS (RENTABILIZAR TRÁFICO COMPRADO)\n\n'Hola [Nombre], he estado auditando vuestra infraestructura online (clinicacr.es). Seré directo: veo que tenéis una autoridad de dominio de 5 y el tráfico orgánico es prácticamente cero. Estáis en lo que llamamos la fase del 'Escaparate Vacío'.\n\nAsumo que, para sostener la clínica, vuestra captación viene del boca a boca o estáis inyectando presupuesto en campañas de publicidad (Google/Meta Ads) para forzar ese tráfico hacia la web.\n\nEl enorme peligro de esta fase es que estáis comprando las visitas. Cada paciente que hace clic en vuestro anuncio os cuesta dinero. Si ese visitante entra a vuestra web y no encuentra una atención inmediata que le atrape, se va. Y ese dinero lo pierde la clínica directamente.\n\nNosotros no hacemos ni SEO ni Ads. Venimos a blindar vuestra inversión. Hemos desarrollado un Asistente Médico de IA que hace guardia 24/7 en vuestra página. Su objetivo es muy sencillo: si habéis pagado 3€ para que un visitante entre en vuestra web desde Instagram, el Asistente se asegura de interactuar con él al instante, resolver su duda clínica pre-cita y sacarle el número de teléfono para que vuestro comercial le llame al día siguiente.\n\nNo podéis permitiros el lujo de perder tráfico cuando os está costando dinero. El asistente de IA actúa como una red de seguridad debajo de vuestras campañas de márketing.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si os dicen 'Nuestra agencia ya nos hace el márketing': 'Fabuloso, pero la agencia os trae las visitas, no os cierra las ventas nocturnas. Nosotros no quitamos el trabajo a vuestra agencia, le ponemos esteroides. Aseguramos que el tráfico caro que ellos consiguen no rebote cuando vuestra recepción está saturada o cerrada.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "clinicacr", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics,
          websites: {
            create: { url: "http://www.clinicacr.es/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica CR",
          slug: "clinicacr",
          industry: "Clínica Capilar",
          location: "Madrid",
          seoMetrics,
          websites: { create: { url: "http://www.clinicacr.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Clínica CR inyectada en el dashboard." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
