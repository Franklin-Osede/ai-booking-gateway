import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'cemec'
      }
    });

    const seoMetricsData = {
      summary: 'Dependencia de Marca (Invisibilidad para Sangre Nueva)',
      traffic: 'Muy bajo y en declive (~109 visitas/mes).',
      cost: 'Lead Value: Peligroso. El 100% de su tráfico proviene de palabras clave de marca. Literalmente solo los encuentra quien ya los busca. Coste de captación orgánica pura: Infinito (no captan orgánico frío).',
      topPages: '1. Home\n2. Cemec English (residual)',
      competitors: 'Todas las clínicas de Valencia se llevan el tráfico general. CEMEC sobrevive del boca a boca.',
      socialTraffic: '',
      insights: 'Hola equipo de Cemec. Hemos cruzado vuestros datos digitales y detectamos lo que en el sector llamamos el «Síndrome del Escaparate Oculto». Vuestro tráfico actual (apenas ~100 visitas/mes) depende de un único hilo: vuestra marca personal. El 100% de la gente que entra a vuestra web es porque ha tecleado explícitamente «Cemec».\n\n¿El problema? Para búsquedas transaccionales de clientes nuevos como «centros capilares valencia», estáis en la página 8 de Google (Posición 79). Sois invisibles al mercado frío. Vuestra web ahora mismo no es un motor de ventas, es solo un directorio telefónico online para la gente que ya os ha sido recomendada por el viejo boca a boca.\n\nCompetir en SEO capilar os llevará meses o años. La única solución inmediata para crecer es exprimir al máximo ese goteo de pacientes recomendados. Necesitáis inyectar un «Recepcionista Clínico IA» en vuestra web que intercepte a cada visitante. Cuando ese paciente recomendado entre a buscar vuestro horario o teléfono, el asistente debe proactivamente cerrarle una agenda médica de valoración en 3 minutos. Tenéis poquísimo margen de tráfico; no podéis permitiros el lujo de tener formularios de contacto fríos.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://cemec.es' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Cemec',
          slug: 'cemec',
          industry: 'Centro Médico Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://cemec.es' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Cemec inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Cemec:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
