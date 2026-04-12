import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'senstetic'
      }
    });

    const seoMetricsData = {
      summary: 'El Especialista de Nicho (Dependencia de Tratamiento Estrella y Alto Valor)',
      traffic: 'Volumen Bajo pero Creciente: 381 visitas orgánicas al mes. Han tenido un pico reciente muy positivo.',
      cost: 'Lead Value: Extraordinario. A pesar del bajo volumen, posicionan Top 3 para «mejor clinica estetica valencia» y Top 1 para «endolift valencia».',
      topPages: '1. Home (Tráfico transaccional premium)\n2. Tratamiento Endolift (Su gran gancho comercial)',
      competitors: 'Con tan poco volumen general, han logrado colarse entre los gigantes del sector local para términos de máxima conversión.',
      socialTraffic: '',
      insights: 'Hola equipo de Senstetic. Hemos analizado vuestra presencia digital y, francamente, estáis jugando muy eficientemente vuestras cartas. Os clasificamos como el arquetipo del «Especialista de Nicho».\n\nTener solo 381 visitas orgánicas al mes podría parecer poco para otras clínicas, pero vuestra calidad de tráfico es de cirujano: Posición 1 para «Endolift Valencia» y Posición 3 para «Mejor clínica estética Valencia». Esto es tráfico transaccional puro. Pacientes con la tarjeta de crédito en la mano.\n\nNuestro diagnóstico: Vuestra alerta roja no es la falta de tráfico, es la Dependencia y la Fuga de Alta Intención.\n\nCuando un paciente de alto poder adquisitivo busca «Endolift Valencia», abre 3 pestañas en su navegador (la vuestra y la de dos competidores). Si vuestra página ofrece un formulario de contacto frío donde tienen que esperar 24h a que alguien les llame, podéis perder un presupuesto de miles de euros a favor de la clínica que les atienda antes por WhatsApp.\n\nNo podéis permitiros una tasa de conversión tradicional (1-2%). Con 381 visitas, necesitáis exprimir cada clic de Endolift como si fuera oro.\n\nNuestra propuesta de inyección tecnológica consiste en instalar un «Closer» Digital (IA de Cierre Instantáneo). Una Inteligencia Artificial hiper-especializada en vuestros tratamientos estrella.\n\nEn el instante en que ese paciente abre vuestra página de Endolift, la IA interactúa proactivamente: «Hola, bienvenida a Senstetic. Si estás buscando información sobre Endolift facial o corporal, soy tu asistente médico. Puedo explicarte tiempos de recuperación, precios aproximados o, si lo prefieres, buscarte un hueco esta misma semana con nuestros doctores para una valoración».\n\nBlindad vuestro tráfico premium. Si posicionáis los primeros en Google para Endolift, aseguraos de ser también los más rápidos en cerrar la cita con IA.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://senstetic.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Senstetic',
          slug: 'senstetic',
          industry: 'Clínica de Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://senstetic.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Senstetic inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Senstetic:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
