import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Espejismo de Tráfico / Curiosos Sin Intención'. Dr. Panno tiene un Dominio Sano (DA 25) y un tráfico orgánico respetable (373/mes). Pero al hacer radiografía a ese tráfico, vemos que sufren el síndrome de la clínica curiosa: la gente entra buscando 'qué significa soñar que se te cae el pelo' o 'secador vs plancha'. Es tráfico basura a nivel de conversión B2C.",
    traffic: "373 visitas mensuales sostenidas, pero infladas por artículos de blog de extrema curiosidad (Top of the Funnel sin intención de compra).",
    cost: "El coste de oportunidad es la 'Falsa Sensación de Éxito SEO'. Creen que su web funciona porque entran 400 personas, pero el 95% lee su significado de los sueños y se va. Están pagando (con tiempo u oro) por ser la Wikipedia de los curiosos, no una máquina de ventas.",
    topPages: "1. Home. 2. Soñar que se te cae el pelo. 3. Foros sobre alopecia. 4. Cómo funciona el champú. 5. Molécula Ru58841.",
    competitors: "El principal competidor no es otra clínica de Marbella, sino foros y Wikipedia. Compiten por la atención, no por el lead.",
    socialTraffic: "Dado lo viral y curioso de sus artículos (sueños, moléculas experimentales), probablemente atraigan clicks desde redes sociales que botan rápido de la página.",
    insights: "PITCH CONSULTIVO: EL FILTRO CUALIFICADOR O 'ANTIESPEJISMOS'\n\n'Hola [Nombre], he estado haciendo una auditoría del tráfico de la web del Dr. Panno en Marbella. Tenéis unos datos de Autoridad muy sanos, casi 400 personas entrando al mes, lo cual está genial.\n\nPero vamos a mirar debajo del capó: El grueso de ese tráfico lo sostienen artículos curiosos. Vuestro segundo artículo más visitado es '¿Qué significa soñar que se te cae el pelo?'. Quien busca sus sueños en Google, no se va a gastar 4.000€ en un injerto capilar mañana. Tenéis un alto volumen de tráfico curioso de muy baja intención.\n\nEsto crea un Espejismo de Tráfico. Para rentabilizar esa web, no necesitáis más visitas. Necesitáis cualificar desesperadamente al 5% que SÍ tiene intención de operarse, separándolo de la paja.\n\nInstalamos un Asistente Médico Inteligente que actúa bajo el principio del Anti-Espejismo. En cuanto esos 400 visitantes entran, sean por los sueños o por el Ru58841, el Asistente interrumpe sutilmente: 'Hola, más allá de la curiosidad, ¿te gustaría que el equipo del Dr. Panno evalúe tu caso real de alopecia para darte presupuesto sin compromiso?'.\n\nEl Asistente limpia la paja. Coge a los curiosos y los convierte en leads si realmente hay intención, sacando el WhatsApp y filtrando a los que solo venían a leer y marcharse. Os ayudamos a traducir visitas literarias en ventas quirúrgicas.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "panno", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: {
            create: { url: "http://www.drpanno.com/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Dr. Panno",
          slug: "panno",
          industry: "Clínica Capilar",
          location: "Marbella",
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://www.drpanno.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Dr. Panno inyectada en el dashboard." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
