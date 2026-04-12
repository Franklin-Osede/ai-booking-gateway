import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Desierto Digital (Delegación Fantasma)'. Datos bajísimos: 7 visitas orgánicas al mes y 7 keywords posicionadas. Al ser la sucursal de consultas en España de una clínica 'Low Cost' Turca (Estepera), es evidente que su supervivencia en Valencia no depende del SEO orgánico, sino de inyectar dinero masivamente en publicidad de pago (Ads/Social).",
    traffic: "Inexistente (7 visitas/mes). 100% dependientes del Paid Media o derivaciones de la matriz.",
    cost: "Si no tienen SEO, significa que cada persona que pisa esta web ha costado dinero de Ads. Si esa persona entra y sólo ve una 'Oficina de Consultas' estática con un formulario, la fuga de capital por coste de adquisición (CAC) es letal.",
    topPages: "Home (Sede Central Valencia) y Oficina de Consultas.",
    competitors: "Compiten por precio y destino (Turquía vs España).",
    socialTraffic: "Presumiblemente altísimo, aunque no reflejado en SEO orgánico.",
    insights: "PITCH CONSULTIVO: PROTECCIÓN DEL COSTE DE ADQUISICIÓN (PAID MEDIA)\n\n'Hola equipo de Estepera Valencia. He analizado vuestra huella digital en España y el diagnóstico es claro: vuestro SEO orgánico es prácticamente nulo (7 visitas al mes). Esto me dice una cosa: estáis comprando el 100% de vuestro tráfico mediante campañas de Meta Ads o Google Ads para llenar la oficina de consultas de Valencia.\n\nCuando dependes al 100% de tráfico pagado, cada visitante que entra a la web os ha costado dinero. Si ese visitante llega desde un anuncio de Instagram con las emociones a tope, entra a la web de Valencia y se encuentra un simple 'Formulario de Contacto', la fricción hace que se enfríe y habéis quemado esos Euros del click.\n\nLo que necesitáis urgente no es SEO, es un 'Asistente de Retorno de Inversión'. Un agente agresivo que salte instantáneamente cuando el lead de Ads aterriza: «Hola, veo que te interesa agendar una consulta gratuita en nuestra sede de Valencia. ¿Qué día de esta semana te viene mejor pasarte para que evaluemos tu caso y organicemos tu viaje?».\nNo podéis permitiros el lujo de que un lead pagado se vaya sin interactuar. La IA garantiza que el click de pago se convierta en una consulta presencial.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "estepera" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://www.trasplantecapilarestepera.com/" } }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Estepera Valencia",
          slug: "estepera",
          industry: "Turismo Capilar (Delegación)",
          location: "Valencia (Matriz Turquía)",
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://www.trasplantecapilarestepera.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Estepera inyectada correctamente." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
