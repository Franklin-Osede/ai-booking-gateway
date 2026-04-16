import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'gandiadentalcare'
      }
    });

    const seoMetricsData = {
      summary: 'Micro-Tráfico de Alto Ticket (El Francotirador Local)',
      traffic: 'Muy bajo volumen absoluto (Apenas 46 visitantes orgánicos/mes). Crecimiento plano. Sin embargo, traccionan tráfico híper-cualificado y de altísimo valor: «prótesis fija sobre 6 implantes precio» y «dentista gandia».',
      cost: 'El coste de oportunidad es LETAL. Con tan pocas visitas, perder a 1 solo paciente que busca «All on 6» por falta de atención inmediata significa perder miles de euros. Cada visitante de esa página es un diamante que están dejando escapar por un embudo (formulario) tradicional de bajo rendimiento.',
      topPages: '1. Dentista Gandia (Búsqueda principal)\n2. Prótesis fija sobre 6 implantes (Tráfico de Alto Ticket)\n3. All on 6',
      competitors: 'Vitaldent Gandia (Franquicia con gran presupuesto de Ads), Paula Vidal, Clínica Dental Badía.',
      socialTraffic: 'Al tener un orgánico tan bajo (Domain Authority 7), es altamente probable que dependan del boca a boca o de inyectar inversión en Meta Ads para sobrevivir.',
      insights: 'Hola Valentina / Marcela. He auditaado vuestra huella web con Inteligencia Comercial (Ubersuggest y rastreadores deep-web) y la conclusión es clara: Tenéis un volumen de tráfico muy bajito (46 visitas/mes), pero lo poco que os entra es de ALTO TICKET.\n\nEl problema no es que tengáis muchísimas visitas, el problema (o la fuga de capital) es CÓMO estáis recibiendo a las pocas que entran. Según los satélites, rankeáis en primera página para palabras clave como «prótesis fija sobre 6 implantes precio» o «All on 6».\n\nTe hago una pregunta de negocio puro, Valentina: Si una persona entra a las 9 de la noche buscando el precio de una prótesis fija de 6 implantes... y solo ve una página informativa o un formulario aburrido, ¿qué crees que hace? Exacto, cierra la pestaña y se va a otra clínica de Gandía para comparar. Acabáis de perder una facturación potencial de 6.000 a 10.000 euros en 30 segundos.\n\nEsa es la Fuga de Capital.\n\nNuestro sistema IA no os va a regalar 10.000 visitas por arte de magia. Lo que va a hacer es poner a un "Closer Médico" interceptando a todos los que lean vuestra web. Si alguien entra a la URL de All on 6, a los 10 segundos la IA abre la conversación: «Hola. Veo que estás consultando sobre las prótesis fijas sobre 6 implantes. Soy la asistente interactiva de la Dra. Marcela. ¿Tienes problemas de movilidad dental o vienes a por una segunda opinión? Te puedo agendar una valoración express para que no pierdas más tiempo navegando».\n\nPasamos a la clínica de ser una web que se lee y se olvida, a ser una máquina de captación proactiva. Y si estáis invirtiendo en publicidad (Meta/Google), este sistema es obligatorio para que los clics que estáis pagando no se quemen al llegar a la web.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://gandiadentalcare.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Gandia Dental Care',
          slug: 'gandiadentalcare',
          industry: 'Clínica Dental',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://gandiadentalcare.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Gandia Dental Care inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Gandia:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
