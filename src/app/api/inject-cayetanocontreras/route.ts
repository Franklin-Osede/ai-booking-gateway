import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'cayetanocontreras'
      }
    });

    const seoMetricsData = {
      summary: 'El Líder Local (Fuga de Autoridad en Tráfico Informacional)',
      traffic: 'Muy sano y estable (~600 visitas/mes). Top 1 en Valencia.',
      cost: 'Lead Value: Alto volumen para local, pero mucho tráfico diluido en posts informativos (Escala Norwood, remedios).',
      topPages: '1. Home (P1 en Valencia)\n2. Centro Micropigmentacion\n3. Post: Escala Norwood\n4. Post: Precios',
      competitors: 'Micropigmentación Thay, otras clínicas de élite valencianas.',
      socialTraffic: '',
      insights: 'Hola Cayetano y equipo. Hemos analizado vuestra presencia digital y, primero que nada: enhorabuena. Sois el Líder Local indiscutible, aguantando el Top 1 para «micropigmentación capilar valencia» con casi 600 visitas al mes.\n\nPero detectamos una enorme «Fuga de Autoridad» en vuestro panel. Una gran parte de vuestro tráfico entra por artículos como la «Escala Norwood» o «Remedios para la alopecia». El usuario entra, descubre que es un Norwood 4, se asusta, y al no tener una vía interactiva para resolver su miedo... cierra la pestaña y se va a pensar.\n\nTener 600 visitas es un privilegio, pero dejar que lean y se vayan es un desperdicio financiero. Vuestra autoridad merece un Cierre Automático. Necesitáis un Asistente Clínico IA (entrenado con la voz y expertise de Cayetano) que salte en ese artículo exacto: «Veo que estás evaluando tu grado de alopecia. Como especialistas en Valencia, ¿quieres que hagamos un pre-diagnóstico de tu caso ahora mismo y veamos si la micropigmentación es viable para ti?». Convertid lectores asustados en pacientes agendados.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://www.cayetanocontreras.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Cayetano Contreras',
          slug: 'cayetanocontreras',
          industry: 'Clínica Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://www.cayetanocontreras.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Cayetano Contreras inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Cayetano Contreras:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
