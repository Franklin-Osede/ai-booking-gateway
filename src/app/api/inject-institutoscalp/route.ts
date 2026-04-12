import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'institutoscalp'
      }
    });

    const seoMetricsData = {
      summary: 'El Generalista Desestabilizado (Perdido en el Mar Rojo)',
      traffic: 'Muy volátil. ~63 visitas orgánicas/mes tras sufrir caídas desde picos de 300.',
      cost: 'Lead Value: Alto pero muy fraccionado. Luchan por keywords gigantescas («scalp», «micropigmentacion capilar») desatendiendo nichos de oro (cicatrices, mujeres, pelo largo).',
      topPages: '1. Home\n2. Micropigmentación Femenina\n3. Micropigmentación cicatrices\n4. Efecto relleno',
      competitors: 'Clínicas capilares masivas y franquicias SEO.',
      socialTraffic: '',
      insights: 'Hola equipo de Instituto Scalp. Hemos analizado a fondo vuestra curva SEO. Vemos que tenéis un tráfico muy inestable (ahora mismo en ~63 visitas/mes) porque estáis compitiendo en un océano rojo contra monstruos por palabras como «micropigmentacion capilar» o «scalp».\n\nSin embargo, tenéis posiciones muy interesantes en nichos hiper-rentables y sensibles: atractivos para mujeres (micropigmentación femenina/pelo largo) y para ocultación de cicatrices. El gran problema es la conversión: cuando una mujer con problemas de densidad o un hombre con una cicatriz de un injerto previo entra a la web, un formulario de contacto clásico les parece frío. Tienen miedos muy específicos.\n\nNecesitáis un Asistente Clínico Inteligente que intercepte a la visita y segmente al instante: «¿Buscas efecto rapado, densidad para mujer, o cobertura de cicatriz FUE?». Y en base a esa elección, que la IA resuelva sus miedos específicos y le cierre una cita. Vais a duplicar el valor de las 60 visitas que tenéis si las filtráis y atacáis empáticamente en tiempo real.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://institutoscalp.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Instituto Scalp',
          slug: 'institutoscalp',
          industry: 'Clínica Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://institutoscalp.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Instituto Scalp inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Instituto Scalp:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
