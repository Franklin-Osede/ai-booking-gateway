import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'ageless'
      }
    });

    const seoMetricsData = {
      summary: 'El Espejismo de Marca (Paciente Cautivo y Pico Viral)',
      traffic: 'Explosión anómala y brutal (casi 5,000 visitas/mes). Un salto hiper-vertical impulsado por búsquedas de marca o tendencias de nombre.',
      cost: 'Lead Value: Extremadamente alto. Son pacientes que ya conocen a la clínica (búsqueda cautiva). El ratio de cierre debería ser máximo.',
      topPages: '1. Home (Absorbe la práctica totalidad del salto de tráfico)',
      competitors: 'Efectos halo de otras marcas, pero sin competencia directa para este canal cautivo.',
      socialTraffic: '',
      insights: 'Hola equipo de Ageless. Hemos auditado vuestra huella de captación y los datos marcan una anomalía comercial espectacular. Habéis pegado un salto estratosférico rozando las 5,000 visitas orgánicas mensuales. Felicidades, es un dominio aplastante.\n\nPero el análisis fino de nuestra Inteligencia Artificial revela el verdadero motor: el 95% de ese tráfico no entra por SEO genérico, entra buscando exactamente vuestro nombre («ageless» o «angeless»). Sois un caso claro del \'Síndrome de la Marca Cautiva\'. Esto significa que esos miles de usuarios ya os conocen (quizás por un pelotazo en redes sociales, boca a boca masivo o PR). El paciente ya tiene el 80% de la decisión tomada antes de hacer clic.\n\nLa fricción trágica aquí es que vuestra web actúa como un escaparate pasivo. El paciente entra buscando a Ageless convenciado, y le dejáis solo frente a un texto corporativo esperando que él tome la iniciativa e invierta energía en buscar el botón de contacto.\n\nCon 5,000 personas buscando expresamente vuestro nombre, es un pecado mortal tener un filtro por pasividad. Necesitáis empotrar un «Closer de Ventas IA» que muerda a la primera. En cuanto el usuario "cautivo" entre a la web, el Asistente salta directo: «¡Hola! Veo que vienes directamente buscándonos a nosotros. Tengo acceso a la agenda prioritaria, ¿quieres que te asigne la cita de valoración gratuita de esta semana en menos de 1 minuto por aquí mismo?».\n\nVuestro reto de escalado es muy sencillo y letalmente rentable: no tenéis que convencer a los indecisos, solo tenéis que dejar de ponerle obstáculos pasivos a los que ya os han elegido. Una IA de recepción os duplicará el ratio de reservas sobre ese pico masivo.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://ageless.es' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Ageless Clinic',
          slug: 'ageless',
          industry: 'Clínica de Cirugía Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://ageless.es' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Ageless inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Ageless:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
