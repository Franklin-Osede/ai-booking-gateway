import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Espejismo de Marca' / 'El Embudo Cautivo'. Casi el 100% del tráfico (unas 355 de 380 visitas) de esta clínica proviene de búsquedas directas de marca ('clínicas drb madrid', 'clínica drb', 'clínica benarroch'). No están captando pacientes nuevos ('cold traffic') en Google por búsquedas genéricas como 'injerto capilar'. Viven de su reputación. El peligro aquí es perder a esos referidos si la web no les convierte al instante.",
    traffic: "380 visitas orgánicas. Tendencia ligeramente al alza pero es tráfico nominal (búsquedas por el nombre del doctor).",
    cost: "No pierden coste en clics, pero pierden el 'Costo de Oportunidad de Recomendación'. Un paciente recomendado que busca la clínica tiene una intención de compra altísima. Si la web es pasiva o no atiende dudas 24/7, ese lead caliente se enfría y se va a la competencia.",
    topPages: "Home (356 visitas). Todo el tráfico entra por la puerta principal buscando al Dr. Benarroch.",
    competitors: "No compiten en tráfico frío, pero sí compiten en retención. Si su referido entra a su web y no convierte, mañana verá un anuncio de Insparya y se irá allí.",
    socialTraffic: "Dependencia total del boca a boca offline o RRSS para generar ese conocimiento de marca que se transforma en búsquedas nominales en Google.",
    insights: "PITCH CONSULTIVO: BLINDAR EL BOCA A BOCA\n'Hola [Nombre], os llamo porque al analizar a las clínicas boutique de Madrid, vuestro caso (Cirugía Capilar DRB) nos ha parecido único. Tenéis unas 380 visitas mensuales, pero la radiografía por dentro es increíble: casi el 95% de la gente que entra a vuestra web ya os conoce. Buscan 'clínica drb', 'clínica benarroch'. Esto es un indicativo brutal de vuestra reputación offline y el valor de vuestro boca a boca.\n\nPero esto es un arma de doble filo: vivís de los pacientes que ya vienen recomendados. Y aquí está el drama: si un paciente que viene hiper-recomendado por un amigo entra a vuestra web un domingo a las 11 de la noche, se calienta, mira resultados... y no hay nadie para atender su duda de última hora, se va a enfriar. Quizás a la mañana siguiente la pereza le vence o le sale un anuncio de Turquía en Instagram. Habéis perdido al paciente más barato y rentable que existe.\n\nNo os vengo a vender SEO, vuestro boca a boca llena la agenda. Nosotros instalamos un 'Torniquete de Conversión'. Un Asistente Médico-Comercial IA que hace guardia 24/7. Su única misión es: cuando ese recomendado llega tibio por la noche, la IA le coge, empatiza, resuelve su duda y le saca el teléfono. A la mañana siguiente, vuestra recepcionista tiene el teléfono caliente en la bandeja para cerrar la cita a tiro hecho.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si os dicen 'Ya estamos contentos' o 'Ya tenemos atención al paciente': 'Seguro que sí, y el paciente lo nota. Pero a las 23:30 vuestra clínica está cerrada y Google sigue abierto. La IA no compite con vuestra recepcionista, hace el turno de noche para que ella se encuentre la faena medio hecha al llegar a la clínica.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "cirugiacapilar", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetrics as any,
          websites: {
            create: { url: "http://www.cirugiacapilar.es/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Cirugía Capilar DRB",
          slug: "cirugiacapilar",
          industry: "Clínica Capilar",
          location: "Madrid",
          seoMetrics: seoMetrics as any,
          websites: { create: { url: "http://www.cirugiacapilar.es/" } }
        }
      });
    }

    // Now delete duplicates that don't have the original slug to clean up my mess
    const duplicates = await prisma.clinic.findMany({
      where: {
        slug: "cirugiacapilar",
        id: { not: clinic.id }
      }
    });

    for (const dup of duplicates) {
      await prisma.clinic.delete({ where: { id: dup.id } });
    }

    return NextResponse.json({ success: true, message: "Cirugía Capilar DRB inyectada y duplicados eliminados" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
