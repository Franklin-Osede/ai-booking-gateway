import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicapitarch'
      }
    });

    const seoMetricsData = {
      summary: 'Diógenes Digital / Tráfico Cero (Web completamente aislada del mercado, 3 visitas mensuales)',
      traffic: 'Extremo Críico (3 visitas/mes). La web es un fantasma en internet. Históricamente plano sin ningún tipo de tracción.',
      cost: 'Lead Value: Desconocido. No hay suficiente tráfico orgánico para valorar. Todo el negocio depende 100% del entorno offline y de redes sociales (boca a boca / Instagram).',
      topPages: '1. Blog: ¿Láser alejandrita o diodo? - 3 visitas.\n2. Home - 0 visitas orgánicas puras.\nEl 100% de la web es invisible en buscadores.',
      competitors: 'Las grandes clínicas de Valencia se están repartiendo todo el espectro de búsquedas de estética. Clínica Pitarch no compite hoy por hoy en el mercado digital de buscadores.',
      socialTraffic: 'Modo Supervivencia. En este escenario, la clínica vive exclusivamente de las recomendaciones y del tráfico que consigáis desviar desde Instagram o publicidad de pago.',
      insights: 'Hola equipo de Clínica Pitarch. Hemos intentado hacer un análisis SEO de clinicapitarch.es, y el diagnóstico es de "Diógenes Digital" o Muerte SEO.\n\nOs traemos la máxima honestidad: tenéis exactamente 3 visitas mensuales en Google. Y esas tres personas llegan a un artículo del blog leyendo sobre la diferencia entre láser alejandrita y diodo. A nivel orgánico en buscadores, la clínica no existe. O nadie busca vuestro nombre en Google, o no aparecéis ni cuando os buscan.\n\nEsto tiene una Alerta Comercial Gravísima: Significa que dependéis de forma crítica de lo que estéis haciendo en Instagram o del boca a boca físico. Pero incluso con ese tráfico físico/social, el problema persiste. Si lográis que alguien vaya de Instagram a la web... la persona entra a una plataforma que no incita a reservar de forma moderna.\n\nComo no tenéis tráfico orgánico, nuestra Inteligencia Artificial no viene a "cerrar leads de Google" porque no los hay. Viene a instalarse como el «Socorrista de Redes Sociales».\n\nCuando enviáis pacientes calentados por vuestras fotos de Instagram a la web, nosotros interceptamos antes de que se aburran: «Hola, bienvenida desde nuestras redes. La web tiene mucha información, pero si quieres ir al grano, dime qué tratamiento te gusta y cerramos una cita hoy mismo con nosotros».\n\nDado que la web no os está generando dinero por sí misma, usamos la IA como un puente ultra-rápido para recoger el esfuerzo que hacéis en redes sociales y convertirlo en WhatsApps en vuestra recepción.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://clinicapitarch.es' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica Pitarch',
          slug: 'clinicapitarch',
          industry: 'Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://clinicapitarch.es' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica Pitarch inyectada correctamente.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
