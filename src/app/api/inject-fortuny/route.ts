import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicafortuny'
      }
    });

    const seoMetricsData = {
      summary: 'El Imperio Caído (Descenso en Caída Libre Algorítmica)',
      traffic: 'Sangría masiva documentada. Desplome orgánico de 3,500 visitas/mes a poco más de 200 visitas/mes en menos de un año.',
      cost: 'Lead Value: Urgencia Alta de Supervivencia. No pueden permitirse desperdiciar a los 200 usuarios que aún llegan.',
      topPages: '1. Múltiples urls informativas en las últimas posiciones de rankings (Bolsas sin cirugía, ácidos hialurónicos, tipos de alopecia).',
      competitors: 'Han sido devorados probablemente por actualizaciones de "Helpful Content" de Google.',
      socialTraffic: '',
      insights: 'Hola equipo de Clínica Fortuny. Hemos cruzado vuestra huella digital con nuestro motor de Inteligencia Comercial y hemos de ser directos: la gráfica es muy dura de ver. Estáis sufriendo matemáticamente lo que llamamos el «Síndrome del Imperio Caído».\n\nVuestro histórico muestra que no hace mucho erais un gigante que superaba las 3,000 visitas mensuales orgánicas. Pero desde entonces habéis entrado en una espiral de pérdida algorítmica constante y agresiva, desplomándoos hasta rozar apenas unas 200 visitas actuales. Habéis perdido más del 90% de vuestro oxígeno digital, probablemente hundidos en artículos informativos sobre «ácido hialurónico» o «alopecia areata» que ya no rankean.\n\nCualquier agencia saltará como un buitre a intentar venderos paquetes SEO de miles de euros garantizando devolveros a la cima. Sería tirar el dinero. Remontar una penalización o caída de esa envergadura lleva entre 9 y 14 meses, con una tasa altísima de fracaso.\n\nVuestra urgencia empresarial de hoy no es recuperar volumen de tráfico, es Maximizar la Tasa de Sobrevivencia: Exprimir compulsivamente al tráfico que todavía os entra. Cuando tenías 3,000 visitas al mes, si perdíais al 98% de la gente en una página aburrida de contacto no pasaba nada porque el volumen lo tapaba. Hoy, con 200 visitas al mes, perder a un usuario interesado en las «líneas de marioneta» por obligarle a buscar un teléfono en la web, es una negligencia financiera grave.\n\nNuestro plan de choque táctico se instala en 5 minutos: Inyectar una IA de Máxima Tensión Comercial. No vamos a intentar que venga más gente. Vamos a impedir físicamente (digitalmente) que los que entran se vayan sin dejar los datos. Si un usuario aterriza desde Google en vuestro artículo sobre «mesoterapia lipolítica» (que aún da algo de tráfico), la Inteligencia Artificial interceptará su pantalla los 20 segundos de lectura y le cerrará el paso empáticamente:\n\n«Hola, como expertos en remodelación corporal te aviso de que este este protocolo está agotando nuestra agenda de este mes. Pero acabo de ver que tengo el último en el calendario para este jueves. ¿Quieres que te lo bloquee en 15 segundos sin compromiso aquí mismo?».\n\nHoy toca atrincherarse y convertir el bajo tráfico en alto beneficio, no cazar fantasmas en el algoritmo de Google.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicafortuny.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica Fortuny',
          slug: 'clinicafortuny',
          industry: 'Clínica Capilar y Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicafortuny.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica Fortuny inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Clínica Fortuny:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
