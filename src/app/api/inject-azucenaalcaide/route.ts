import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'azucenaalcaide'
      }
    });

    const seoMetricsData = {
      summary: 'El Desierto Digital (Invisibilidad Absoluta y Cero Tráfico)',
      traffic: 'Inexistente. Las métricas registran 1 visita orgánica mensual. La gráfica histórica oscila entre 0 y 1 visita.',
      cost: 'Lead Value: 0€. No hay flujo de usuarios orgánicos. Compiten desde el fondo de Google (DA 4).',
      topPages: '1. Home\n2. Medicina Estética',
      competitors: 'No tienen tracción para tener competidores digitales reales.',
      socialTraffic: '',
      insights: 'Hola equipo de la Dra. Azucena Alcaide. Hemos finalizado la auditoría de vuestra estructura digital y los datos constatan que os encontráis en un «Desierto Digital».\n\nGoogle reporta apenas 1 visita orgánica al mes. Sois completamente invisibles para los pacientes de Valencia. Incluso para búsquedas de vuestra propia marca («estética alcaide») estáis cayendo a la página 2 de resultados (Posición 11). Para búsquedas comerciales críticas como «centros capilares valencia», estáis en la página 10 (Posición 95).\n\nEn esta fase (Domain Authority 4), embarcarse en una estrategia SEO tradicional sería quemar el dinero. Intentar captar tráfico orgánico para luchar contra veteranos de Valencia requerirá meses o años de inversión sin retorno inicial.\n\nTu flujo de negocio actual depende 100% del entorno offline o redes sociales. La única estrategia rentable para vosotras hoy es optimizar ese tráfico privado. Si un paciente recomendado por una amiga entra en vuestra web para buscar la dirección, y se encuentra una web estática con un simple formulario pasivo, perdéis la oportunidad del calor de esa recomendación.\n\nNecesitáis inyectar un «Closer IA» (Cerrador de Citas Virtual). Asumamos que tenéis poco tráfico; entonces el objetivo es que CADA PERSONA que pise la web, no salga sin cita. El asistente debe interactuar en segundos: «Hola, soy el asistente de la Dra. Alcaide. Si vienes recomendada para una valoración de Medicina Estética o Capilar, puedo asignarte un hueco de forma inmediata en la agenda de esta semana».\nEs más barato y rápido subir vuestra conversión al 100% sobre las 5 personas que os conocen, que intentar traer a 500 desconocidos.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://draazucenaalcaide.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Dra. Azucena Alcaide',
          slug: 'azucenaalcaide',
          industry: 'Medicina Estética y Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://draazucenaalcaide.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Dra. Azucena Alcaide inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Azucena:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
