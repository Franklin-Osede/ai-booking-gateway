import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicalou'
      }
    });

    const seoMetricsData = {
      summary: 'El Paciente Terminal (Muerte Clínica Digital y Dependencia Total de Ads/Boca a Boca)',
      traffic: 'Crítico: 7 visitas al mes (básicamente ustedes mismos entrando a la web y algo de ruido).',
      cost: 'Lead Value: Cero orgánico. Todo paciente actual debe estar viniendo por referidos, redes sociales o campañas de pago.',
      topPages: '1. Home (Absorbe el 100% del irrelevante tráfico orgánico).',
      competitors: 'Completamente invisibles. Relegados a la página 3 y 4 (Posición 18-27) para todas las búsquedas clave de Valencia.',
      socialTraffic: '',
      insights: 'Hola equipo de Clínica Lou. Hemos analizado vuestra huella digital en Valencia y el diagnóstico arroja el arquetipo que llamamos «Paciente Terminal». Pero tranquilos, esto no es para venderos SEO.\n\nLa realidad cruda de los datos es que, a nivel orgánico en Google, no existís. Tratar de posicionar «centro estético valencia» frente a las franquicias os llevaría años de inversión a fondo perdido.\n\nAsumimos, por tanto, que vuestro negocio se sostiene puramente por el "boca a boca" (referidos), esfuerzo en redes sociales (Instagram) o campañas de anuncios de pago (Ads).\n\nY es aquí donde entra nuestra alerta de Fuga de Capital. Si vuestro único tráfico llega porque han visto un post en Instagram o porque una amiga se lo ha recomendado, esas visitas son contadas y valiosísimas. \n\nSi un referido entra a vuestra web y ve una página plana donde tiene que buscar un formulario o un teléfono, existe un alto riesgo de que lo deje para luego... y ese «luego» nunca llega.\n\nNuestra solución de emergencia para vosotras es instalar un «Closer Digital». Se acabaron los formularios aburridos.\n\nMañana mismo, cuando alguien llegue a vuestra web desde Instagram, nuestra IA le dará la bienvenida proactivamente: «Hola, bienvenida a Clínica Lou. ¿Vienes recomendada o has visto nuestros tratamientos en redes? Te ayudo a mirar espacios en la agenda para una primera valoración sin compromiso».\n\nCuando el tráfico es un goteo mínimo, no podéis dejar escapar ni a una sola persona. Cada click cuenta. Blindemos la conversión de vuestras redes sociales y referidos hoy mismo.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicalou.es' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica Lou',
          slug: 'clinicalou',
          industry: 'Clínica Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicalou.es' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica Lou inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Clínica Lou:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
