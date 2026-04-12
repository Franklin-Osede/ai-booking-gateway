import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicacapilar'
      }
    });

    const seoMetricsData = {
      summary: 'La Franquicia Desbalanceada (Dominio Nacional, Tráfico Errático Local)',
      traffic: 'Muy bajo y altamente volátil (<100 visitas/mes). Montaña rusa histórica de picos y valles sin previsibilidad comercial.',
      cost: 'Lead Value: Alto por supervivencia. Tienen el dominio exacto genérico, pero casi todo el tráfico depende de una sola url de ubicación (Cádiz).',
      topPages: '1. /clinica-capilar-cadiz/ (Atrapa casi la totalidad de su tráfico orgánico)\n2. Home y otras sedes (Hundidas o residuales)',
      competitors: 'Rivalizan localmente en cada una de sus sedes, con éxito muy dispar.',
      socialTraffic: '',
      insights: 'Hola equipo de Clínica Capilar. Al auditar vuestro dominio con nuestra Inteligencia de Datos, hemos encontrado lo que denominamos la paradoja de «La Franquicia Desbalanceada».\n\nTécnicamente poseéis la corona del sector: el dominio exacto más genérico y premium de España (\'clinicacapilar.com\'). Sin embargo, vuestro rendimiento estadístico a nivel de tráfico no corresponde a ese dominio. Apenas superáis las 90 visitas orgánicas totales al mes, y vuestra gráfica histórica es una montaña rusa errática. No tenéis previsibilidad de captación.\n\nLa fricción profunda (fuga comercial) viene del desbalance: el 60% del tráfico total que entra, lo hace soportado por una sola ubicación: Cádiz. A pesar de intentar tener alcance en Tenerife, Las Palmas o Sevilla, esas sucursales están secas orgánicamente.\n\nCuando tienes un volumen bajo, volátil, y un dominio tan "nacional" y genérico, el paciente a menudo llega, no encuentra rápido la información de su ciudad exacta, y rebota hacia clínicas locales. \n\nVuestra urgencia no es gastar miles de euros en agencias SEO intentando levantar Sevilla. Vuestra estrategia de choque vital es exprimir militarmente lo que ya entra. Inyectar un Front-Desk Inteligente que elimine la fricción geográfica al segundo uno. \n\nSi el usuario entra, la IA salta al momento: «¡Hola! Bienvenidos a nuestra red de clínicas capilares. Me conecto a nivel nacional, dime: ¿en qué ciudad nos escribes para revisar la agenda de tu clínica más cercana?». En cuanto el usuario ponga «Cádiz» o «Tenerife», la IA le da un trato local y le cierra la cita en el chat: «Fantástico. En [Ciudad] tengo un hueco de valoración gratuita el jueves. ¿Te lo agendo ahora en 10 segundos?».\n\nHay que dejar de perder leads locales en un portal nacional. Un Asistente de Triaje asegura que todo humano que entra a vuestra web sea canalizado a una agenda local, garantizando reservas incluso con menos de 100 visitas al mes.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicacapilar.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica Capilar',
          slug: 'clinicacapilar',
          industry: 'Clínica Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicacapilar.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica Capilar inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Clínica Capilar:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
