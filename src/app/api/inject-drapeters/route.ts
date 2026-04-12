import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'drapeters'
      }
    });

    const seoMetricsData = {
      summary: 'El Fantasma Ecommerce (Caída a 0 visitas y estructura indexada como tienda de cremas)',
      traffic: 'Crítico (3 visitas/mes). La gráfica histórica muestra una caída masiva en 2024 (desde las 3.500 visitas) quedando en un electroencefalograma plano actualmente.',
      cost: 'Lead Value: Inexistente en orgánico. Google ha dejado de mandar pacientes viables.',
      topPages: '1. Producto: LIPO H (60 cápsulas)\n2. Producto: ENDOCARE Hyaluboost Serum\n3. Producto: Crema Cuello y Escote',
      competitors: 'La competencia local se está quedando con el 100% de la cuota de mercado en búsquedas de tratamientos estéticos.',
      socialTraffic: 'Dependencia 100%. Si no reciben pacientes por boca a boca o redes sociales, el negocio digital no existe.',
      insights: 'Hola equipo de Dra. Peters. Hemos auditado la presencia digital de drapeters.com y el diagnóstico es de «Desierto Digital con Síndrome de Ecommerce».\n\nEn la actualidad tenéis un tráfico de 3 visitas mensuales. Un electroencefalograma digital plano tras sufrir una severa penalización o caída en 2024. Pero el verdadero problema no es la falta de tráfico, sino cómo os percibe ahora Google. \n\nLas minúsculas búsquedas por las que se os puede encontrar son nombres de productos (Endocare, Lipo H, Coralip). Para el buscador de Google, sois un pequeño ecommerce de cosmética, no una clínica médica de alto valor.\n\nCero personas os están encontrando orgánicamente interesadas en medicina estética.\n\nEsto significa que la supervivencia actual de captación online del negocio depende 100% de Redes Sociales (Instagram) o campañas de Ads.\n\nEl problema es el "Efecto Rebote". Cuando una seguidora ve un post en Instagram, se interesa por un tratamiento, hace clic en el enlace de la Bio y llega a una web sin tráfico y estructurada como tienda de cremas... se frustra y se marcha. Todo el esfuerzo en RRSS se tira a la basura en la web.\n\nNuestra Inteligencia Artificial no hace magia SEO, actúa como un "Conserje de Rescate" para ese tráfico social.\n\nCuando esa seguidora de Instagram aterriza perdida en la web, la IA emerge inmediatamente: «Hola, bienvenida a la clínica Dra Peters. Si vienes a raíz del tratamiento de hidratación labial que hemos publicado en nuestras redes, puedo darte un presupuesto aproximado ahora mismo o revisarte la agenda de la Doctora para darte cita de valoración esta misma semana».\n\nDejáis de perder el tráfico que tanto os cuesta ganar en redes sociales, y la IA lo transforma instantáneamente en citas reales, blindando vuestra tasa de conversión mientras la web carece de SEO.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://drapeters.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Dra Peters',
          slug: 'drapeters',
          industry: 'Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://drapeters.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Dra. Peters inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Dra Peters:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
