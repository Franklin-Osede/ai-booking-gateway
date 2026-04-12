import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'airklinic'
      }
    });

    const seoMetricsData = {
      summary: 'El Escaparate Dividido (La Maldición de la Clínica Multi-Especialidad)',
      traffic: 'Caída histórica prologanda, con leve rebote reciente (~170 visitas/mes).',
      cost: 'Lead Value: Diluido. Mucho tráfico va a tratamientos estéticos de menor ticket (Sculptra, Aqualix) en lugar de la cirugía capilar de alto valor.',
      topPages: '1. Home\n2. Post: Sculptra / Bioestimuladores\n3. Acido Hialurónico\n4. Criolipólisis',
      competitors: 'Clínicas estéticas generalistas y clínicas capilares especializadas.',
      socialTraffic: '',
      insights: 'Hola equipo de Airklinic. Hemos auditado vuestra distribución orgánica y vemos el «patrón de fricción» típico de las grandes clínicas multi-especialidad (que hacéis tanto medicina estética como cirugía capilar).\n\nVuestro tráfico actual (~170 visitas/mes) está muy fragmentado y dominado por búsquedas estéticas: «Sculptra», «Aqualix» o «Ácido Hialurónico». El problema de este «Escaparate Dividido» es comercial: el servicio que más margen os deja (el injerto capilar) queda enterrado. Cuando un paciente con capital busca operarse la cabeza, su objeción mental número 1 es buscar un cirujano hiperespecializado. Si entra a vuestra web y ve que ofrecéis injertos al lado de tratamientos con láser alejandrita o limpiezas faciales, la autoridad percibida como «centro de cirugia capilar» se desploma y el lead rebota hacia clínicas exclusivamente capilares.\n\nNecesitáis separar comercialmente vuestros embudos usando Automatización IA. Vuestro tráfico no puede aterrizar y chocar contra un menú genérico. Necesitáis inyectar un «Asistente Capilar IA» dedicado exclusivamente a defender esa vertical. Si el usuario muestra interés en capilar, el bot asume el rol de asesor quirúrgico, pide una pre-evaluación fotográfica, aísla al paciente de los tratamientos estéticos y defiende el ticket alto de la cirugía.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://airklinic.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Airklinic',
          slug: 'airklinic',
          industry: 'Clínica Medicina Estética y Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://airklinic.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Airklinic inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Airklinic:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
