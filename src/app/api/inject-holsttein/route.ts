import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'holsttein'
      }
    });

    const seoMetricsData = {
      summary: 'El Agujero Negro Informativo (Mucho Tráfico, Baja Intención de Compra)',
      traffic: 'Un auténtico titán del SEO (8,840 visitas/mes) con más de 3,100 keywords.',
      cost: 'Lead Value: Extremadamente diluido. Atracción masiva de usuarios buscando «remedios caseros» (romero, biotina), muy lejos financieramente del ticket de un injerto capilar o tratamiento clínico.',
      topPages: '1. Post: Vitaminas / Romero\n2. Home\n3. Post: Dolor cuero cabelludo\n4. Post: Biotina',
      competitors: 'Blogs de salud, farmacias online, MedlinePlus. Compiten contra la Wikipedia, no contra otras clínicas.',
      socialTraffic: '',
      insights: 'Hola equipo de Hölsttein Hair Clinic. Hemos analizado vuestra huella digital y es un auténtico Imperio de Contenido. Roscáis las 9,000 visitas orgánicas mensuales con más de 3,100 palabras clave. Sois el líder absoluto en volumen de nuestra auditoría.\n\nPero cruzando los datos, detectamos una brutal «Fuga de Intención de Compra». El 90% de vuestro tráfico aterriza buscando información transaccional muy fría o gratuita: «romero para el pelo», «biotina», «¿el secador es malo?», «dolor en el cuero cabelludo». Este usuario tiene una intención de gasto de 15€ en la farmacia, no los 4.000€+ que requiere vuestra excelencia quirúrgica (Dr. Freitas). Si a esta avalancha de tráfico frío solo le ofrecéis un botón de «Contactar para Cita Médica», el Ratio de Rebote es abismal.\n\nEl reto de Hölsttein hoy no es captar más gente, es «Elevar» (Upsell cognitivo) al usuario informacional. Necesitáis inyectar un «Asesor Educador IA» en vuestro blog. Cuando un usuario lee sobre "romero para la caída", el Asistente IA no debe intentar venderle una cirugía de impacto, debe interactuar contextualmente: «Hola, veo que buscas soluciones naturales. ¿Sabías que el romero frena la caída leve, pero si pierdes más de 100 cabellos al día necesitas estimulación a nivel dérmico (Mesoterapia)? ¿Quieres hacer nuestro test de 3 preguntas para evaluar tu grado de pérdida?». \n\nCon casi 9,000 visitas al mes, si lográis que un 1% interactúe con el test de la IA, estaréis generando 90 Leads Tibios mensuales a coste de adquisición cero.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://holsttein.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Hölsttein Spa & Hair Clinic',
          slug: 'holsttein',
          industry: 'Clínica Capilar Exclusiva',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://holsttein.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Hölsttein inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Holsttein:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
