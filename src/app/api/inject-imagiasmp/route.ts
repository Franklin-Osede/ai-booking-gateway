import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'imagiasmp'
      }
    });

    const seoMetricsData = {
      summary: 'El Recién Nacido (Depende del Pricing Page)',
      traffic: 'Residual (~7 visitas mecánicas/mes) pero con tendencia de despegue inicial.',
      cost: 'Lead Value: Máximo. Cada visita que entra a ver precios tiene una altísima intención de compra comercial. Una página de precios sin interactividad asesina el LTV.',
      topPages: '1. Precios Micropigmentación\n2. Home\n3. Labios/Ojos',
      competitors: 'Top clínicas y estudios de micropigmentación de la zona levantina.',
      socialTraffic: '',
      insights: 'Hola equipo de Imagia SMP. Hemos analizado vuestra curva de despegue SEO y vemos un patrón vital: vuestra mayor tracción se está centrando en búsquedas de métrica transaccional pura, concretamente «precios micropigmentación capilar».\n\nTener tráfico, aunque sea de 10 visitas al mes, buscando precios es oro puro (Bottom of Funnel). Sin embargo, el riesgo de una página de precios genérica es altísimo: el usuario ve una tarifa fría, no percibe el valor clínico y rebota hacia la competencia.\n\nPara maximizar el retorno de esas pocas búsquedas, necesitáis transformar vuestra tabla de precios en un Cotizador Interactivo de IA. Es decir, que cuando el usuario entre buscando precios, vuestro asistente le aborde: «Hola, el precio de la micropigmentación depende de tus zonas despobladas. ¿Quieres que hagamos una estimación rápida de tus sesiones necesarias sin compromiso?». Retendréis al usuario, justificaréis vuestro valor y captaréis el contacto antes de que se fríe por completo.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://imagiasmp.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Imagia SMP',
          slug: 'imagiasmp',
          industry: 'Clínica Estética y Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://imagiasmp.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Imagia SMP inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Imagia SMP:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
