import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Imán de Curiosos / Autoridad Desviada'. Tienen un tráfico espectacular (casi 3.000 visitas/mes) reteniendo posiciones Top 10 para dudas muy específicas (evolución injerto día a día, minoxidil antes y después, dolor de cuero cabelludo).",
    traffic: "2,755 visitas orgánicas mensuales. Gráfica consolidada y fuerte.",
    cost: "Al funcionar como la 'Wikipedia' capilar, miles de usuarios leen y se van gratis con la duda resuelta. Si un 4% de esas 2.700 personas interactuaran con un asesor, serían más de 100 leads al mes.",
    topPages: "Home, blog de minoxidil, blog de evolución injerto capilar y blog sobre dolor de cuero cabelludo.",
    competitors: "Tienen fuerza local en Valencia pero su SEO atrae tráfico nacional de investigación médica.",
    socialTraffic: "Bajo a nivel orgánico, alto peso en Google.",
    insights: "PITCH CONSULTIVO: DE ENCICLOPEDIA A CLÍNICA\n\n'Hola equipo de ZIRA. He revisado vuestros números y el SEO lo estáis reventando: casi 3.000 visitas puras mensuales. Os habéis convertido en una referencia resolviendo dudas clave (minoxidil, dutasteride, dolor de cabeza, evolución día a día).\n\nPero aquí está la hemorragia: sois una clínica, no Wikipedia. Miles de personas entran a consultar 'qué pastillas son mejores' y se van a comprarlas a la farmacia sin dejar ni un euro en ZIRA. Ese volumen de tráfico de investigación es valiosísimo si se sabe interceptar.\n\nLo que os propongo es poner un 'Peaje Asistencial'. Un Asistente de IA implementado en vuestros blogs que detecte qué están leyendo y les ofrezca una consulta. Si leen sobre Minoxidil, la IA dice: «Veo que te informas sobre tratamientos médicos. ¿Te gustaría agendar una valoración dermatológica gratuita en nuestra clínica de Valencia para ver tu caso específico?». Transformamos la curiosidad en facturación.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "zira" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://zira.clinic/" } }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica ZIRA",
          slug: "ziraclinic",
          industry: "Clínica Capilar",
          location: "Valencia",
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://zira.clinic/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "ZIRA inyectada correctamente." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
