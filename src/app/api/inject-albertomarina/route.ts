import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'albertomarina'
      }
    });

    const seoMetricsData = {
      summary: 'El Gigante Desangrado (Gran pérdida de tráfico y saturación por búsquedas post-operatorias gratuitas)',
      traffic: 'Muy Alto (5,179 visitas/mes). Sin embargo, han sufrido una grave caída histórica (llegaron a tener más de 14.000 visitas en 2024).',
      cost: 'Lead Value: Peligrosamente engañoso. Su página más visitada congrega búsquedas como "punto de sutura infectado", atrayendo a curiosos o pacientes de terceros que buscan soporte médico gratuito.',
      topPages: '1. Blog: Cómo saber si un punto está infectado (Top 1 absoluto)\n2. Home\n3. Blog: Presoterapia en el embarazo\n4. Evolución de pecho operado',
      competitors: 'Tienen la envergadura de un líder de mercado, pero su tráfico se está llenando de "ruido" (dudas médicas gratuitas) que la competencia clínica más transaccional está evitando.',
      socialTraffic: '',
      insights: 'Hola equipo del Dr. Alberto Marina. Al analizar vuestra presencia digital, confirmamos que sois uno de los «Gigantes» del sector en Valencia. Atraer más de 5.000 visitas mensuales os posiciona con una autoridad indiscutible.\n\nPero nuestro diagnóstico detecta un doble peligro al que llamamos «El Gigante Desangrado». Primero, una fuerte pérdida de tráfico en los últimos dos años (habéis caído desde las 14.000 visitas). Y segundo, y más crítico, de qué está compuesto el tráfico que os queda.\n\nLa Alerta Comercial: Vuestro Top 1 absoluto de visitas a la web viene derivado de búsquedas como: «Cómo saber si un punto de sutura está infectado». Esto significa que miles de personas que YA se han operado (quizás por la Seguridad Social o en clínicas de la competencia) están entrando a vuestra web buscando soporte post-operatorio gratuito.\n\nSi estas personas usan vuestro WhatsApp para mandar fotos de sus cicatrices o preguntar dudas que no les resuelve su cirujano, están devorando el tiempo, la energía y el dinero de vuestro equipo de recepción.\n\nAnte un volumen genérico tan grande, la solución no es más SEO. Es instalar un «Filtro / Triage Inteligente por IA».\n\nCuando un usuario entra al artículo de suturas infectadas, nuestra IA se despliega y hace de escudo protector: «Hola. Si eres paciente del Dr. Alberto Marina y tienes una urgencia, facilítame tu nombre para pasarte con nuestra enfermera. Si te has operado en otro centro, por protocolo médico te aconsejamos contactar con tu cirujano responsable».\n\nSin embargo, si otro usuario entra a la página de «Evolución de pecho operado», la IA despliega la alfombra roja comercial: «Hola, bienvenida a la clínica del Dr. Marina. ¿Estás valorando realizarte un aumento de pecho? Puedo darte horquillas de precios o agendarte una valoración con el equipo médico para esta semana».\n\nEscudad a vuestra recepción de los "vampiros de tiempo" de internet, y usad la IA para cerrar a los pacientes de alto valor que buscan a un especialista de vuestro calibre.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://albertomarina.es' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Dr. Alberto Marina',
          slug: 'albertomarina',
          industry: 'Cirugía Plástica y Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://albertomarina.es' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Doctor Alberto Marina inyectado correctamente.' });
  } catch (error) {
    console.error('Error injecting Alberto Marina:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
