import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'drveruskhagomez'
      }
    });

    const seoMetricsData = {
      summary: 'El Desierto Digital (Dependencia Absoluta de Ads y Redes Sociales)',
      traffic: 'Crítico: Tráfico orgánico nulo (0 visitas mensuales). La web no está atrayendo pacientes por sí sola a través de Google.',
      cost: 'Lead Value: Todo paciente que llega a la web actualmente cuesta dinero (Ads) o mucho tiempo (Redes Sociales).',
      topPages: '1. Home (Tráfico residual de marca)\n2. Blog Posts (Sin posicionamiento efectivo)',
      competitors: 'Totalmente asfixiados en SEO por clínicas con mayor antigüedad y estrategia de contenidos. Posiciones muy lejanas (página 5+).',
      socialTraffic: '',
      insights: 'Hola equipo de la Dra. Veruskha Gómez. Nuestro diagnóstico tras auditar vuestra presencia en Google es claro y directo: estáis en lo que llamamos «El Desierto Digital». Vuestro volumen de tráfico orgánico actualmente es cercano a cero.\n\nLejos de ser una mala noticia, esto nos da la radiografía exacta de vuestro negocio: actualmente dependéis al 100% de vuestro esfuerzo manual en Redes Sociales (Instagram/TikTok) o del presupuesto que invirtáis en Publicidad Pagada.\n\nLa Alerta Comercial (La fuga de vuestro presupuesto): Si estáis gastando dinero en Ads o tiempo en crear Reels, ¿qué pasa cuando ese usuario hace clic en el «Link en la Bio» y aterriza en vuestra web? Si se encuentra con una clínica estática y un formulario de contacto tradicional, estáis quemando literalmente vuestra inversión en marketing.\n\nEl paciente que viene de Instagram o de un Anuncio quiere inmediatez. No quiere rellenar un formulario y esperar a mañana. Quiere enviar un WhatsApp o hablar con alguien ya.\n\nNuestra inyección tecnológica no os promete SEO mágico en dos meses. Os ofrece «Conversión de Tráfico de Pago». Se trata de instalar un Recepcionista IA Activo en vuestra web para que cada euro o cada clic de Instagram sea rentable.\n\nCuando un usuario aterrice en vuestra página desde Instagram, la IA no espera. Salta inmediatamente: «Hola, bienvenida a la clínica de la Dra. Veruskha. ¿Qué te preocupa más hoy, mejorar problemas de la piel o armonización facial? Puedo darte precios orientativos o agendar una cita para que la doctora evalúe tu caso esta misma semana».\n\nDejad de perder el tráfico que os ha costado sangre o dinero conseguir. Convertid vuestra web de una simple "tarjeta de visita" en un closer comercial 24/7 de alta conversión.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://www.drveruskhagomez.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Dra. Veruskha Gómez',
          slug: 'drveruskhagomez',
          industry: 'Clínica de Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://www.drveruskhagomez.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Dra Veruskha Gómez inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Dra Veruskha Gómez:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
