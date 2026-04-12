import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicajuvent'
      }
    });

    const seoMetricsData = {
      summary: 'El Imperio en Decadencia (Derrumbe Histórico y Tráfico Informacional de Baja Intención)',
      traffic: 'Alto (3,000+ visitas/mes), pero en una caída drástica y prolongada (desde las 8,000+ visitas).',
      cost: 'Lead Value: Diluido. Gran volumen de tráfico pero captando búsquedas muy poco transaccionales («opiniones», «a qué hora no quema el sol»).',
      topPages: '1. Home\n2. Mitos y verdades Ultherapy (Atrae búsquedas de dudas)\n3. Mejor horario para tomar el sol (Tráfico basura para facturación)',
      competitors: 'Están perdiendo cuota de mercado progresivamente frente a competidores más agresivos en la ciudad de Sevilla.',
      socialTraffic: '',
      insights: 'Hola equipo de Clínica Juvent. Hemos inyectado vuestro dominio en nuestro Sistema de Inteligencia Comercial y el diagnóstico es complejo. Estáis sufriendo el síndrome del «Imperio en Decadencia».\n\nA nivel positivo, tenéis volumen (más de 3,000 visitas al mes). A nivel crítico, vuestra gráfica histórica muestra una sangría constante: habéis caído desde picos de 8,000 visitas a vuestros mínimos actuales. Sevilla es una plaza hiper-competitiva y estáis cediendo terreno orgánico mes a mes.\n\nPero la verdadera Fuga de Capital está oculta en vuestras palabras clave. De esas 3,000 visitas, una gran parte entra por búsquedas informacionales que no sacan la tarjeta de crédito: «a partir de que hora no quema el sol», «ultherapy opiniones reales», o incluso búsquedas de miedo como «ultherapy arruino mi cara».\n\nAtraéis a miles de personas que están en fase de «duda» o «miedo» (Top of Funnel), leen el artículo de vuestro blog y, como no hay un mecanismo para forzar su confianza in situ, se marchan a seguir leyendo a otra parte.\n\nResolver esa caída histórica de SEO os llevará meses, pero podéis blindar la facturación HOY exigiéndole conversiones al tráfico que aún conserváis usando un «Filtro Digital de Alta Conversión».\n\nInstalamos la IA. Cuando ese usuario entra con miedo a leer sobre «opiniones de Ultherapy», el texto se detiene y la Recepcionista Digital interviene: «Hola. Veo que estás investigando sobre los resultados y la seguridad del Ultherapy. Es normal tener dudas. Soy la asistente del equipo médico de Juvent. ¿Quieres que te reserve una consulta gratuita sin compromiso para que el Doctor evalúe tu piel y te dé garantías reales?»\n\nSi vuestro volumen cae, vuestra obligación empresarial es exprimir la tasa de conversión del tráfico restante. Conviertamos a los "lectores con dudas" en "pacientes con cita médica".'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicajuvent.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica Juvent',
          slug: 'clinicajuvent',
          industry: 'Clínica de Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicajuvent.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica Juvent inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Clínica Juvent:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
