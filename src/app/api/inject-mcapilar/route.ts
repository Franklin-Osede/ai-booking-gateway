import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicamcapilar'
      }
    });

    const seoMetricsData = {
      summary: 'El Gigante en Expansión (Cuello de Botella en la Cualificación)',
      traffic: 'Absoluta locura. ~3,737 visitas/mes. Crecimiento explosivo y dominio brutal.',
      cost: 'Lead Value: Tienen tanto volumen que el problema no es el coste del lead, sino el coste de filtrarlo. Su equipo comercial debe estar ahogándose en "curiosos" o consultas de bajo ticket.',
      topPages: '1. Home (P1 en "clinica capilar")\n2. Oviedo\n3. Precios\n4. Zaragoza',
      competitors: 'Hospital Capilar, Insparya, corporaciones gigantes.',
      socialTraffic: '',
      insights: 'Hola equipo de MCapilar. Vuestros datos orgánicos son un espectáculo. Habéis destrozado la barrera de las 3,700 visitas mensuales con una tendencia alcista imparable y estáis consolidando un imperio clínico a nivel nacional (Madrid, Oviedo, Zaragoza, Valencia). Sois claramente el «Gigante en Expansión».\n\nPero sabemos exactamente qué ocurre a nivel de procesos cuando llegas a este volumen: la recepción y los comerciales colapsan. Estar rankeando para Keywords mastodónticas como «clinica capilar» o «precios injertos capilares» significa que recibís muchísimo tráfico «curioso». Si vuestro equipo humano tiene que dedicar horas a responder por Whatsapp a gente que solo pregunta «¿cuánto vale?» y luego desaparece, estáis perdiendo a los Leads Golden (los que quieren operarse ya).\n\nNecesitáis un «Triaje Comercial IA» de Alto Volumen. Un asistente virtual que reciba a esos casi 4,000 visitantes, responda el 100% de las dudas logísticas o de precios en milisegundos, haga un pre-diagnóstico y solo agende con vuestro equipo humano a los pacientes que ya están financieramente cualificados y listos para dar el paso. Vuestro reto actual no es captar más, es automatizar el filtrado para no morir de éxito.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicamcapilar.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'MCapilar',
          slug: 'clinicamcapilar',
          industry: 'Clínica Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicamcapilar.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'MCapilar inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting MCapilar:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
