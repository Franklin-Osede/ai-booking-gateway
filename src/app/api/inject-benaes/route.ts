import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'benaes'
      }
    });

    const seoMetricsData = {
      summary: 'El Mago de Oz (Tráfico Astronómico pero Irrelevante/Informativo)',
      traffic: 'Astronómico: 24,135 visitas orgánicas/mes. El pico más alto visto hasta ahora.',
      cost: 'Lead Value: Extremadamente Bajo (Diluido). Generan muchísimo tráfico por términos genéricos (cremas, dietas) que no atraen al paciente local de Valencia.',
      topPages: '1. Blog: Cremas manchas (2,964 visitas)\n2. Blog: Alimentos perder grasa (2,152 visitas)\n3. Blog: Sérums (1,678 visitas)\n4. Blog: Mounjaro (1,434 visitas)... La Home está en 5º lugar (882).',
      competitors: 'A nivel local compiten bien, pero a nivel SEO están compitiendo (innecesariamente) con revistas de belleza y portales de salud mundiales.',
      socialTraffic: '',
      insights: 'Hola equipo de Benaes. Hemos auditado vuestra huella digital y tenemos que decirlo: los números brutos son de locura. ¡Más de 24,000 visitas al mes! A nivel SEO tenéis un alcance de nivel nacional/internacional.\n\nSin embargo, nuestro diagnóstico no es un aplauso, es una «Alerta de Espejismo» (Métricas Vanidosas).\n\nAl cruzar los datos, descubrimos que vuestro inmenso volumen no va a parar a vuestros tratamientos en Valencia. El 90% de vuestro tráfico aterriza en artículos divulgativos como «mejores cremas para manchas», «alimentos para perder grasa abdominal» u «opiniones Mounjaro».\n\n¿Cuál es el peligro? Este es el temido Síndrome del Lector Internacional. Estáis atrayendo a miles de lectores de toda España (o Latinoamérica) que leen el artículo y se van, o peor aún, saturan vuestra clínica con formualrios preguntando que dónde pueden comprar la crema o si hacéis envíos de Mounjaro.\n\nTenéis a 24,000 desconocidos paseando por la clínica médica, pero casi ninguno pasa por caja.\n\nNuestra propuesta es quirúrgica e inteligente: Instalar nuestra Inteligencia Artificial de Conversión para «Exprimir al Lector».\n\nCuando un lector aterrice en el artículo de Mounjaro, la IA lo interceptará proactivamente: «Hola, veo que te interesa la pérdida de peso con Mounjaro. ¿Eres de Valencia o alrededores? Tenemos un programa médico supervisado. ¿Te reservo una cita de valoración gratuita?».\n\nSi el visitante es de fuera o solo busca información gratuita, la IA le responde amablemente y lo descarta sin molestar a vuestro equipo de recepción.\nSi es local e interesado, lo convierte en paciente.\n\nTenéis un caudal de agua gigantesco. Dejad que la IA sea la red que filtre las pepitas de oro locales y deje pasar la morralla, protegiendo así el tiempo de vuestras recepcionistas.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://benaes.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica Benaes',
          slug: 'benaes',
          industry: 'Clínica de Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://benaes.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Benaes inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Benaes:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
