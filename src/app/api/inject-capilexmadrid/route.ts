import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Embudo de Marca' (Dependencia de Búsqueda Directa). Clínica Capilex tiene un tráfico mensual de 460 visitas. Sin embargo, su SEO es un espejismo: la inmensa mayoría de este tráfico (353 visitas) provienen de gente buscando literalmente 'Capilex Madrid'. Es decir, no captan pacientes nuevos buscando soluciones en Google, sino que viven de pacientes 'pre-calentados' que ya les conocen (boca a boca o publicidad offline).",
    traffic: "460 visitas al mes. Han sufrido una caída desde las 650 visitas de mayo de 2025, estabilizándose ahora. Su SEO 'non-branded' (palabras sin su marca) es testimonial.",
    cost: "El coste de perder 'Tráfico de Marca' es el más doloroso de todos. Si alguien busca 'Capilex Madrid' en Google, significa que alguien le ha hablado maravillas de la clínica. Si esa persona entra a la web y no contacta por pereza o porque la web es fría, han perdido al lead más cualificado posible.",
    topPages: "La home se lleva prácticamente todo el tráfico orgánico, y el resto de páginas (Testimonios, PRP) apenas rascan un puñado de visitas.",
    competitors: "No compiten en las grandes ligas del SEO contra Capilclinic o Hospital Capilar. Intentan rascar algo en búsquedas locales como 'prp capilar madrid' (Posición 4).",
    socialTraffic: "No destacan por viralidad. Su tráfico es de recomendación.",
    insights: "PITCH CONSULTIVO: BLINDAR EL TRÁFICO DE MARCA\n'Hola [Nombre], te llamo porque nuestro equipo ha hecho una radiografía de vuestro patrón de tráfico en Clínica Capilex. Tenéis unas 460 visitas mensuales, lo cual está genial, pero hemos visto un patrón crítico: el 80% de estas visitas son de personas buscando literalmente vuestro nombre en Google.\n\nEsto significa que vuestro SEO no atrae a desconocidos, sino a gente a la que ya le han recomendado Capilex o que ha visto un anuncio vuestro. Y ese es el perfil de paciente más valioso del mercado. El problema es que cuando ese «paciente recomendado» busca vuestro nombre y entra en la web, se encuentra con una web normal, un formulario frío o un botón de WhatsApp que igual no contesta si es domingo a las 10 de la noche.\n\nSi alguien busca específicamente vuestro nombre y se va sin llamar, habéis perdido un paciente que ya venía medio convencido.\n\nNosotros instalamos Asistentes Médicos de IA para ponerle una «Alfombra Roja» a ese tráfico de marca. Cuando alguien busca Capilex, el bot le recibe al instante: «Hola, has llegado a Capilex, ¿vienes recomendado o buscas ver nuestros últimos casos de la técnica FUE?». \n\nNo cambiéis el SEO. Simplemente aseguraos de que, de esas 460 personas que ya os buscan por nombre, nadie cierre la pestaña sin dejar el número de teléfono.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dicen que ya tienen WhatsApp y contestan rápido: 'Claro, vuestra recepción seguro que es de 10. Pero el problema es la fricción térmica. Un paciente que entra recomendado entra 'caliente'. Si le haces pensar qué escribir en un WhatsApp, a veces lo deja para luego, y el luego es nunca. La IA le habla ELLA a él en el segundo cero, sin hacerle pensar, le resuelve el miedo o duda inicial y os saca el teléfono. Es pasar de ser una web que espera a ser un conserje de lujo 24/7.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "capilexmadrid", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://www.capilexmadrid.es/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Capilex Madrid",
          slug: "capilexmadrid",
          industry: "Clínica Capilar (Tráfico de Marca)",
          location: "Madrid",
          seoMetrics,
          websites: { create: { url: "http://www.capilexmadrid.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Clínica Capilex inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
