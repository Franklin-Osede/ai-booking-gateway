import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicaalejandria'
      }
    });

    const seoMetricsData = {
      summary: 'El Coloso Desbordado (Volumen Masivo y Saturación Administrativa)',
      traffic: 'Excelente: 2,599 visitas/mes. Mantienen un caudal constante y muy elevado.',
      cost: 'Lead Value: Extremadamente Alto. Dominan términos transaccionales clave como «mejor clinica estetica valencia» (Pos 2).',
      topPages: '1. Home (Bruto transaccional)\n2. Blog (Dudas de inyectables como "cuánto dura el ácido hialurónico")',
      competitors: 'Son el rival a batir. Lideran el Top 5 para las búsquedas más codiciadas de la ciudad.',
      socialTraffic: '',
      insights: 'Hola equipo de Clínica Alejandría. Hemos analizado a fondo vuestro posicionamiento en Valencia y, francamente, vuestro departamento de marketing merece un trofeo. Sois lo que en análisis de datos llamamos un «Coloso Desbordado».\n\nEstáis en el Top 3 de Google para búsquedas de oro como «mejor clinica estetica valencia» o «clinicas esteticas valencia». Manejáis un volumen orgánico espectacular de casi 2,600 visitas al mes.\n\nNuestro diagnóstico para vosotras no tiene nada que ver con conseguir más tráfico. Nuestro diagnóstico es sobre Eficiencia y Saturación de Recepción.\n\nAl cruzar vuestras URLs más visitadas, vemos que mezcláis pacientes de alta intención de compra («mejor clínica») con pacientes llenos de dudas («cuánto dura el ácido hialurónico en la cara», «cara hinchada tras radiesse»).\n\nCuando tienes 2,600 visitas mensuales, la web genera un volumen altísimo de contactos, WhatsApps y rondas de preguntas. Vuestro equipo de recepción probablemente esté invirtiendo el 40% de su tiempo en responder FAQs operativas o atender a «curiosos», en lugar de cerrar presupuestos premium de cirugía o dermatología.\n\nNuestra propuesta es instalar una Triage Digital Avanzado (Recepcionista de IA). No está diseñada para captar más tráfico, sino para filtrar el que ya tenéis.\n\nAl paciente que lee sobre el ácido hialurónico, la IA le resolverá automáticamente sus dudas médicas basándose en vuestros propios artículos y filtrará su nivel de interés.\nAl paciente que busca «mejor clínica», la IA le dará un trato VIP inmediato, recabará sus datos de contacto y se lo pasará en bandeja de plata a vuestra coordinadora médica para agendar la cita.\n\nDejad que la Inteligencia Artificial se encargue de las preguntas repetitivas y del triaje, y liberad a vuestro equipo humano para lo que mejor saben hacer: cerrar presupuestos y dar un trato exquisito al paciente en la clínica.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicaalejandria.es' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica Alejandría',
          slug: 'clinicaalejandria',
          industry: 'Clínica Medicina Estética y Dermatología',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicaalejandria.es' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica Alejandría inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Clínica Alejandría:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
