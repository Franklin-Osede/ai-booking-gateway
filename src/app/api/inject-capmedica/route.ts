import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'capmedica'
      }
    });

    const seoMetricsData = {
      summary: 'La Enciclopedia Desperdiciada (Alto Tráfico de Curiosidad)',
      traffic: 'Volumen colosal (1,937 visitas/mes). Presenta un histórico con un pico viral masivo de ~15,000 visitas en 2025, estabilizado a niveles altos.',
      cost: 'Lead Value: Extremadamente diluido. Gran parte del tráfico proviene de búsquedas "Trivia" (países con más calvos, meses de caída). Monetización compleja por baja intención de compra.',
      topPages: '1. Home (Principal motor local)\n2. Blog: Países más propensos a la calvicie (Motor de tráfico trivia)',
      competitors: 'Revistas de salud, periódicos generalistas y blogs médicos internacionales.',
      socialTraffic: '',
      insights: 'Hola equipo de CapMédica. Hemos auditado a fondo vuestro imperio digital y tenéis un ecosistema colosal: rozar las 2,000 visitas orgánicas estables es tener un dominio absoluto y una autoridad clínica envidiable.\n\nSin embargo, al someter estas 2,000 visitas a Inteligencia Artificial para medir la "Intención Transaccional", hemos detectado lo que llamamos «El Síndrome de la Enciclopedia». Gran parte de vuestro caudal de visitas no entra buscando una cirugía, entran impulsados por pura curiosidad: «cuál es el país con más calvos», «de quién se hereda la calvicie» o «en qué época cae el pelo».\nEste tipo de tráfico infla maravillosamente las métricas de vanidad, pero su rentabilidad directa es cercana a 0€. El usuario lee la curiosidad y cierra la pestaña en 15 segundos sin pasar por la página de Contacto.\n\nVuestro reto de escalado actual no es traer más tráfico (ya habéis ganado ese juego). Vuestro auténtico desafío es cómo extraer la rentabilidad a esa avalancha de lectores fríos. La solución pasa por inyectar un «Asistente IA de Diagnóstico» directo en las páginas de los artículos.\nCuando el lector esté absorto leyendo que la calvicie se hereda de la línea materna, la IA debe interrumpir educadamente con un gancho clínico: «Hola, es un dato fascinante, ¿verdad? Por cierto, si últimamente notas menor densidad en tu propio cabello, puedo hacerte un test predictivo gratuito de 3 preguntas aquí mismo para descartar alopecia genética temprana. ¿Empezamos?»\n\nCon casi 2,000 visitas mensuales paseando por el blog, si la IA logra derivar un microscópico 1% de curiosos autoconscientes de su caída, estáis generando 20 Leads ultra-cualificados todos los meses a coste cero. Tenéis el petróleo en casa, solo necesitáis la maquinaria de extracción.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://capmedica.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'CapMédica',
          slug: 'capmedica',
          industry: 'Trasplante Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://capmedica.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'CapMédica inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Capmedica:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
