import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Tabloide de Cotilleos / La Centralita Saturada'. Clínicas Dr. Pelo es una red multi-ciudad (Albacete, Sevilla, Badajoz) con un posicionamiento brutal (DA 28, ~1,800 visitas/mes). Sin embargo, una parte gigantesca de su tráfico es 'curiosidad pura': gente buscando el injerto de Jordi Alba, el pelo de Simeone o si funciona el champú Alpecín.",
    traffic: "Fuerte y consolidado (~1,800/mes), pero altamente 'contaminado' por búsquedas de famosos (Jordi Alba, Buenafuente, Simeone). También capturan mucho tráfico educativo sobre champús y pastillas.",
    cost: "Su coste de oportunidad es altísimo. Tienen leads muy calientes buscando 'injerto capilar albacete', mezclados con miles de curiosos que solo quieren ver fotos del pelo de Casillas. Esto satura el proceso comercial.",
    topPages: "1. Jordi Alba injerto. 2. Injerto Capilar Albacete. 3. Home. 4. Champú Alpecín. 5. Famosos con Injerto (Simeone, Casillas).",
    competitors: "Compiten en las ligas mayores de SEO orgánico y a nivel local en múltiples provincias de España.",
    socialTraffic: "Probablemente fuerte, dada la naturaleza viral de sus posts sobre famosos.",
    insights: "PITCH CONSULTIVO: EL EMBUDO CUALIFICADOR PARA FRANQUICIAS\n\n'Hola [Nombre], he analizado la infraestructura de captación de Clínicas Dr. Pelo. Tenéis un músculo SEO envidiable con casi 2.000 visitas orgánicas. Sois líderes locales en Albacete o Sevilla, pero tenéis un 'problema de éxito'.\n\nEstáis atrayendo a miles de personas mensualmente que entran exclusivamente por curiosidad: buscan el injerto de Jordi Alba, el de Simeone, o leen sobre el champú Alpecín. Es tráfico masivo, pero frío. El problema es que esas personas se mezclan en vuestra web con el paciente 'High-Ticket' que busca operarse en Badajoz mañana mismo.\n\nSi dejáis que todos dependan de llamar por teléfono o rellenar un triste formulario de contacto, vuestro equipo de recepción está perdiendo el oro entre la arena o directamente el paciente caliente se va sin contactar.\n\nAquí es donde entra nuestra Arquitectura de Triaje con IA. No os vamos a vender SEO, ya lo hacéis genial. Instalamos un Asistente Médico Inteligente que salta específicamente en esos artículos de famosos y dice: 'El resultado de Jordi Alba fue excelente. ¿Estás valorando recuperar tu densidad capilar y quieres que te hagamos una valoración rápida desde [Su Ciudad]?'.\n\nEl Asistente cualifica al usuario en 3 preguntas, filtra a los curiosos, detecta de qué provincia es (Sevilla, Albacete, etc.) y le manda a vuestro equipo comercial solo los leads que están listos para pagar, con el número de teléfono ya capturado. Convertimos vuestro tráfico de revista de cotilleos en una máquina de citas de alto valor.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "drpelo", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics,
          websites: {
            create: { url: "http://drpelo.es/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínicas Dr. Pelo",
          slug: "drpelo",
          industry: "Clínica Capilar",
          location: "España (Múltiples)",
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics,
          websites: { create: { url: "http://drpelo.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Clínicas Dr. Pelo inyectada en el dashboard." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
