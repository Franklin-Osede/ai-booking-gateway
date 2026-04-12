import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'artsmedica'
      }
    });

    const seoMetricsData = {
      summary: 'El Síndrome de la Wikipedia (Tráfico informativo sin intención de compra local)',
      traffic: 'Tráfico de 356 visitas/mes. La gráfica es parecida a una montaña rusa, altamente inestable durante los últimos 2 años.',
      cost: 'Lead Value: Extremadamente Pobre. Posicionan para dudas genéricas como "nariz grasa" o "ampollas en los pies", no para tratamientos rentables.',
      topPages: '1. Home (marca)\n2. Blog: Piel grasa en la nariz (Tráfico informacional)\n3. Blog: Piel grasa en la frente',
      competitors: 'A nivel comercial médico están perdiendo la batalla. Otras clínicas se llevan las búsquedas transaccionales (ej. "acido hialuronico valencia").',
      socialTraffic: '',
      insights: 'Hola equipo de la Dra. Carlota Hernández y Arts Medica. Vuestro diagnóstico SEO nos revela el padecimiento del «Síndrome de la Wikipedia».\n\nCuando miráis vuestras estadísticas y veis 356 visitas mensuales, parece una buena noticia. Pero al diseccionar ese tráfico, saltan todas las alarmas comerciales. El grueso de vuestras visitas llega a través de artículos de blog respondiendo a dudas como: «Nariz grasa», «Codos secos» o «Cómo curar ampollas en los pies».\n\nLa Alerta Comercial: Estas búsquedas tienen «Intención Informativa», no «Intención de Compra». Quien busca «nariz grasosa» en Google suele ser alguien buscando un remedio casero o un jabón barato, tal vez a 8.000 kilómetros de Valencia. Están inflando vuestras estadísticas de tráfico, pero aportando exactamente cero euros a vuestra facturación de medicina estética.\n\nEsto os genera un riesgo añadido: si estos usuarios deciden usar vuestro formulario o WhatsApp para hacer consultas médicas gratuitas, estarán devorando el tiempo (y el coste) de vuestro equipo de recepción.\n\nNo necesitáis más artículos de blog. Necesitáis monetizar mediante un «Triage Inteligente por IA».\n\nAl instalar nuestro sistema en vuestra web, la IA actúa como un filtro comercial implacable. Si alguien aterriza en el famoso artículo de la «nariz grasa», la IA le saluda: «Hola, veo que te preocupa la piel de la zona T. En nuestra clínica en Valencia realizamos peelings médicos y tratamientos seborreguladores. ¿Vives cerca de Valencia y te gustaría reservar una valoración con la Doctora Hernández?»\n\nSi el usuario dice que vive lejos o busca algo gratis, la IA lo despide educadamente sin que llegue a molestar a vuestra recepción. Si está en Valencia, la IA convierte un simple lector de blog en un paciente de pago agendado.\n\nUsad la IA para limpiar vuestro tráfico, proteger el tiempo de vuestra recepción y extraer el dinero del tráfico que ya tenéis.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://artsmedica.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Arts Medica',
          slug: 'artsmedica',
          industry: 'Clínica de Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://artsmedica.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Arts Medica inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Arts Medica:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
