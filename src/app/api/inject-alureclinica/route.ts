import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'alureclinica'
      }
    });

    const seoMetricsData = {
      summary: 'La Sombra del Líder (Interceptando el tráfico de Freitas)',
      traffic: 'Crítico y a la baja (~32 visitas/mes).',
      cost: 'Lead Value: Extremadamente volátil. Gran parte de su escaso tráfico entra buscando a su máxima competencia (Clínica de Freitas) y experimentan un rebote instantáneo al no encontrarlo.',
      topPages: '1. Home (Alure)\n2. Nosotros (Rankeando para Freitas!)\n3. Capilar Medicina Estética',
      competitors: 'Clínica de Freitas, Medical Hair Valencia. (Intentan parasitar sus keywords).',
      socialTraffic: '',
      insights: 'Hola equipo de Alure Clínica. Hemos mapeado vuestra huella digital y hemos detectado una anomalía SEO fascinante. Para el bajo tráfico que tenéis (~30 visitas/mes), estáis logrando muchísima visibilidad para búsquedas directas de vuestra mayor competencia: «Clínica de Freitas» o «Rafael Freitas».\n\nY lo más curioso: estas búsquedas aterrizan de lleno en vuestra página de «Nosotros». Interceptar el tráfico de un gigante local es una gran táctica, pero tiene una fuga de conversión masiva: el usuario que busca a Freitas y aterriza en Alure, sufre desconcierto y rebota instantáneamente al ver un formulario de contacto pasivo.\n\nSi queréis robar y monetizar de verdad ese tráfico, necesitáis interactuar. En esa página de Nosotros debéis inyectar un Asistente Clínico IA que ataque la objeción de frente: «Hola, veo que buscas la mejor opción en Valencia. En Alure trabajamos la élite del injerto capilar sin las listas de espera de otras clínicas masificadas. ¿Quieres que valoremos tu caso en 2 minutos?». Convertid el tráfico de la competencia en vuestra mayor ventaja comercial.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://alureclinica.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Alure Clínica Capilar',
          slug: 'alureclinica',
          industry: 'Clínica Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://alureclinica.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Alure Clinica inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Alure:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
