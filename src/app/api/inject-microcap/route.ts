import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'microcap'
      }
    });

    const seoMetricsData = {
      summary: 'El Escaparate del Cazador de Ofertas (Alta Sensibilidad al Precio)',
      traffic: 'Crecimiento sólido y constante (466 visitas/mes). Buen trabajo de posicionamiento base.',
      cost: 'Lead Value: Alta fricción. Atraen tráfico altamente enfocado en el factor precio, que suele ser volátil y propenso a rebotar si no obtiene respuestas inmediatas.',
      topPages: '1. Home (Principal motor comercial)\n2. Post: Precios de implantes capilares (Motor de tráfico frío)',
      competitors: 'Clínicas low-cost locales y el mercado de turismo capilar en Turquía.',
      socialTraffic: '',
      insights: 'Hola equipo de Microcap. Hemos auditado vuestra infraestructura de captación digital y, en primer lugar, enhorabuena. El trabajo SEO es francamente bueno: estáis en el codiciado Top 5 para «clínica capilar en valencia» y atraéis casi 500 visitas orgánicas al mes con una clara tendencia al alza.\n\nSin embargo, al cruzar el volumen de visitas con la "Intención de Búsqueda", hemos detectado una zona de fuga de conversión crítica. Estáis atrayendo muchísimo tráfico anclado a la variable coste: «cuanto vale ponerse pelo», «cuanto cuesta ponerse pelo», «implante capilar precio».\n\nEl perfil de este usuario ("El investigador de precios") es altamente volátil. Si aterriza en vuestro artículo del blog buscando un número, y al final solo se topa con un formulario estático de «Contacta para Presupuesto», la inmensa mayoría rebotará para seguir buscando en Google a alguien que le dé un rango de precios rápido (frecuentemente clínicas turcas).\n\nEl reto actual de Microcap no es invertir más en SEO (ya tenéis la maquinaria encendida), es taponar la fuga de estos compradores ansiosos. Necesitáis empotrar un «Cotizador/Cerrador IA» directamente en vuestro blog.\nCuando el usuario está leyendo sobre precios, el asistente personal debe interceptarlo dinámicamente: «Hola, veo que estás investigando costes. El precio exacto depende de tu grado de alopecia según la escala Norwood. ¿Te hago 3 preguntas por aquí y te doy una horquilla de precios orientativa en menos de un minuto?».\n\nDe esta forma, transformáis tráfico frío que se os escapaba, en perfiles telefónicos cualificados a los que vuestro equipo de ventas puede llamar al día siguiente. Pasar la conversión del 1% al 5% sobre el tráfico actual multiplicará vuestras cirugías sin gastar un euro más en Google.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicamicrocap.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica Microcap',
          slug: 'microcap',
          industry: 'Clínica e Injerto Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicamicrocap.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica Microcap inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Microcap:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
