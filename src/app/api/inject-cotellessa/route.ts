import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'cotellessa'
      }
    });

    const seoMetricsData = {
      summary: 'El Síndrome del Directorio (100% Tráfico de Marca, 0% Tráfico Frío)',
      traffic: 'Muy bajo (193 visitas/mes). Presenta un grave apagón en el histórico (0 visitas durante 5 meses) indicando posibles caídas de servidor o penalizaciones recientes.',
      cost: 'Lead Value: Inexistente en canal frío. Todo el tráfico es gente que ya les conoce por boca a boca o redes sociales. Competir en SEO puro desde este DA (3) requerirá meses.',
      topPages: '1. Home\n2. Book online',
      competitors: 'Ninguno orgánico. No compiten en el mercado de búsqueda abierto.',
      socialTraffic: '',
      insights: 'Hola equipo de Cotellessa Awada. Hemos analizado vuestra infraestructura SEO y los datos muestran lo que llamamos el «Síndrome del Directorio».\n\nVuestro volumen es muy bajo (apenas 190 visitas al mes) y el 100% proviene de búsquedas de vuestra propia marca. Esto significa que vuestra web no está funcionando como una máquina de captación de pacientes nuevos, sino como una simple tarjeta de visita digital para gente que ya os ha conocido por otra vía (boca a boca, Instagram, etc.). Para búsquedas reales de negocio como «micropigmentación capilar valencia» sois completamente invisibles (página 9 de Google).\n\nEn este punto de madurez (Domain Authority 3), intentar hacer la guerra SEO contra las grandes clínicas de Valencia será lento y muy costoso. La fuga de facturación crítica aquí es que los pocos pacientes recomendados que entran, se topan con una web estática.\n\nLa estrategia inmediata más rentable para vosotros es exprimir ese tráfico de marca al máximo inyectando un «Recepcionista IA». Cuando ese contacto recomendado aterriza en vuestra Home, el asistente virtual debe ser proactivo: «¡Hola! ¿Vienes recomendado por algún paciente o buscas cerrar una valoración de tu caso? Puedo cuadrarte la agenda con nuestros especialistas en 1 minuto». Hay que transformar esa web estática en un cierre de ventas conversacional inmediato.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://cotellessa-awada.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Cotellessa Awada',
          slug: 'cotellessa',
          industry: 'Clínica Capilar / Micropigmentación',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://cotellessa-awada.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Cotellessa Awada inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Cotellessa:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
