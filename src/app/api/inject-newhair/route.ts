import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'newhairsolutions'
      }
    });

    const seoMetricsData = {
      summary: 'El Escaparate Visual de Hiper-Nicho (Bottom of Funnel)',
      traffic: 'Muy bajo orgánico (~50 visitas/mes), pero lideran Keywords BOFU (fotos, precios, cerca de mi).',
      cost: 'Lead Value: Alto (Bajo volumen, altísima cualificación). El usuario entra a ver fotos del antes y después a modo de portfolio, y si no se le contacta en ese momento, se enfría y busca otras opciones.',
      topPages: '1. Home (Micropigmentación Capilar Valencia)\n2. Galería / Antes y Después\n3. Precios y FAQs',
      competitors: 'Micropigmentación Thay, Clínicas capilares en Valencia con sección de tatuaje.',
      socialTraffic: 'Dependencia total de RRSS (Instagram) para captar demanda visual.',
      insights: 'Hola equipo de New Hair Solutions. Hemos analizado vuestro SEO y vemos vuestra estrategia: estáis muy bien posicionados para búsquedas directas de conversión ("micropigmentación capilar valencia", "fotos micropigmentacion antes y despues").\n\nVuestro tráfico orgánico es bajo en volumen, pero es puro "Bottom Of Funnel" (listos para comprar). El problema es que una galería de fotos pasiva no cierra ventas. El cliente ve las fotos, piensa "qué bien queda", y al no tener una vía interactiva para preguntar por su caso específico (ej: alopecia areata o cicatrices), abandona la web.\n\nNecesitáis transformar vuestra galería en un Filtro interactivo de IA. Un asistente que salte y diga: «Los resultados que ves arriba dependen del grado de alopecia. ¿Quieres que te hagamos un pre-diagnóstico capilar y te demos un presupuesto estimado?». No sois un museo para que la gente mire y se vaya, cada visita a vuestra web tiene que convertirse en un Whatsapp comercial agendado.'
    };

    if (clinic) {
      // Aseguramos que tenga el website (ignorar posibles duplicados en esta fase demo)
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://newhair-solutions.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'New Hair Solutions',
          slug: 'newhairsolutions',
          industry: 'Clínica Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://newhair-solutions.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'New Hair Solutions inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting New Hair Solutions:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
