import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'drjones'
      }
    });

    const seoMetricsData = {
      summary: 'El Techo de Cristal Capilar y la Fuga Informativa en Estética',
      traffic: 'Muy sólido (1,286 visitas/mes). Fuerte presencia en estética facial y corporal de alto ticket, pero mucho tráfico diluido en búsquedas informativas.',
      cost: 'Lead Value: Mixto. Captan búsquedas de oro (Liposucción sin cirugía, Hilos tensores), pero desperdician clics en «¿qué es el skin care?» (27,000 búsquedas globales).',
      topPages: '1. Home\n2. Cooltech (Liposucción)\n3. Neuromoduladores\n4. Post: Qué es skin care',
      competitors: 'Clínicas estéticas premium en Valencia y portales de belleza.',
      socialTraffic: '',
      insights: 'Hola equipo de la Clínica Dr. Jones. Hemos analizado vuestro ecosistema SEO y las métricas muestran una captación sólida (1,280 visitas mensuales), pero tenéis dos fugas de pérdida de facturación claras.\n\n1. El Techo de Cristal Capilar: Tenéis unidad de cirugía capilar, pero estáis atrapados en el "Valle de la Muerte" de Google (Página 2). Para la palabra clave reina «clinica capilar valencia» estáis en la posición 12. Para «implante capilar en valencia» en la 12. Sois invisibles por un margen mínimo. Pelear para pasar del Top 12 al Top 3 requerirá muchos recursos SEO.\n\n2. La Fuga Informativa en Estética: Rankeáis muy bien para servicios premium (Cooltech, Hilos tensores), pero gran parte de vuestro tráfico se va a posts 100% informativos con 0% de intención de compra (Ej: «Qué es el skin care»). La gente entra, lee qué es una crema, y se va.\n\nLa solución más rentable hoy no es inyectar miles de euros en SEO para subir del 12 al 3. La solución es inyectar un «Educador IA de Ventas» en vuestro blog.\nSi un usuario entra a leer «qué es la mesoterapia», en lugar de dejarle ir, el asistente interviene: «Hola, veo que buscas mejorar la calidad de tu piel. En Dr. Jones somos expertos en rejuvenecimiento y neuromodulación. ¿Quieres que te pase nuestra disponibilidad de esta semana para una valoración inicial sin compromiso?».\nTenéis más de mil personas pasando por la puerta de vuestra web cada mes; no dejéis que el 90% mire el escaparate y se vaya sin que nadie les atienda.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicadrjones.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica Dr. Jones',
          slug: 'drjones',
          industry: 'Medicina Estética e Injerto Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicadrjones.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Dr. Jones inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Dr. Jones:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
