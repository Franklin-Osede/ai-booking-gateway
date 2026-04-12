import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'Dependencia del Boca a Boca / Tráfico 100% de Marca'. Sanlúcar Hair Clinic tiene un DA bajo (9) y unas 121 visitas mensuales. Al observar sus keywords, nos damos cuenta de que todo su tráfico proviene de búsquedas directas de marca ('hairclinic'). No existen en Google para el paciente que busca soluciones. Viven de los referidos.",
    traffic: "121 visitas al mes. Tráfico escaso pero de alta temperatura: son personas que ya les conocen por recomendación offline o redes sociales y buscan su nombre exacto en Google.",
    cost: "El coste de oportunidad es el 'Techo de Cristal'. Como no crecen por SEO genérico, su única vía de crecimiento orgánico es que el 100% de los referidos que entran a su web se conviertan en pacientes. Si la web tiene fricción (hay que rellenar un email, no hay botón rápido), están perdiendo a los únicos leads hiper-cualificados que tienen.",
    topPages: "Dependencia absoluta de la Home. No tienen capilaridad en otras páginas o artículos.",
    competitors: "Cualquier clínica de Cádiz o Sevilla que puje por la palabra clave 'injerto capilar Cadiz' se lleva al paciente que ellos no logran captar (rondan la posición 41 para eso).",
    socialTraffic: "Asumimos que sobreviven del boca a boca local (Sanlúcar, provincia de Cádiz) y de Instagram/Facebook. Tráfico de mucha confianza pero poco escalable.",
    insights: "PITCH CONSULTIVO: EL EMBUDO PARA REFERIDOS\n\n'Hola [Nombre], he dado un repaso completo a los datos digitales de Sanlúcar Hair Clinic. Tenéis unas 120 visitas orgánicas que son literalmente oro molido: todo vuestro tráfico proviene de gente que busca vuestro nombre exacto en Google. Es decir, vivís del boca a boca y del trabajo bien hecho offline.\n\nEsa es la parte buena. La mala es que dependéis 100% de que ese 'referido' no se os caiga. Cuando alguien al que le han hablado maravillas de vosotros entra a vuestra web desde el móvil en Sanlúcar, quiere inmediatez. Si tiene que buscar un formulario, escribir un email, o esperar al lunes para llamar, la fricción puede matarle las ganas.\n\nNosotros instalamos un Asistente Médico de IA. No para generaros más tráfico, sino para blindar a los referidos que ya tenéis. En cuanto ese paciente entra a vuestra web buscando vuestro nombre, el Asistente le abre un canal directo: 'Hola, somos la clínica de Sanlúcar. ¿Vienes recomendado por algún paciente o quieres que miremos tu caso por WhatsApp?'.\n\nBlindamos vuestro activo más valioso: el tráfico de marca. Hacemos que cada persona que os busque en Google termine irremediablemente agendada en vuestra consulta.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: "sanlucarhairclinic" },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: {
            create: { url: "http://sanlucarhairclinic.es/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Sanlúcar Hair Clinic",
          slug: "sanlucar",
          industry: "Clínica Capilar",
          location: "Sanlúcar de Barrameda",
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://sanlucarhairclinic.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Sanlúcar Hairclinic inyectada en el dashboard." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
