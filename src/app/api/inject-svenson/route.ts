import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Goliat Institucional / Hemorragia a Escala'. Svenson es el monstruo del mercado (35,000 visitas al mes, picos de 70k, ranking #1 en 'implante capilar'). Su tamaño es su mayor ventaja y su mayor debilidad. Con ese volumen de tráfico, cualquier ineficiencia en su embudo de conversión significa miles de leads perdidos cada mes.",
    traffic: "35,884 visitas mensuales con un Dominio de Autoridad 47. Es tráfico industrial.",
    cost: "Al mover 35k visitas, su call center o recepciones deben estar colapsados filtrando curiosos frente a compradores reales. El 'coste' aquí es el coste de oportunidad: si tienen un 97% de rebote, pierden a 34,000 personas al mes. Un micro-ajuste de conversión (0.5%) supone cientos de pacientes nuevos.",
    topPages: "Educacionales masivas ('10 Consejos para evitar la caída', 'Alopecia en mujeres') y transaccionales ('implante capilar', 'clinicas capilares cerca de mi').",
    competitors: "Compiten a nivel nacional contra Insparya y Clínicas de Turquía. Su enemigo es la industrialización que hace que el paciente se sienta 'un número más'.",
    socialTraffic: "Inversión masiva en Ads y marca.",
    insights: "PITCH CONSULTIVO: EL EMBUDO INDUSTRIAL\n\n'Hola equipo de Svenson. Movéis casi 36,000 visitas puras al mes y sois los líderes indiscutibles del sector. El problema de jugar en esta liga es el volumen de fuga de capital.\n\nSi asumimos una conversión estándar, tenéis probablemente a más de 30,000 personas entrando en vuestra web que se van sin dejar la tarjeta, abrumadas por la cantidad de información (consejos, escalas de alopecia, minoxidil) o porque el chat clásico no resuelve sus dudas de forma humana.\n\nCuando tenéis este nivel de tráfico, el juego ya no es captar más. Es que el embudo no sangre. Nosotros integramos un Asistente Clínico Inteligente que atiende a cada uno de esos 35,000 visitantes a la vez, con un trato hiper-personalizado, filtrando a los curiosos del blog y agendando directamente en vuestros centros (Madrid, BCN, Valencia, etc.) a los que de verdad quieren operarse. Os ayudamos a absorber vuestro propio tamaño.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: "svenson" },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://www.svenson.es/" } }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Svenson Clínica Capilar",
          slug: "svenson",
          industry: "Clínica Capilar",
          location: "Nacional (España)",
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://www.svenson.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Svenson inyectada correctamente." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
