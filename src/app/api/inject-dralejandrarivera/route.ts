import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'dralejandrarivera'
      }
    });

    const seoMetricsData = {
      summary: 'Secuestro de Marca Puro (100% de dependencia del nombre de la Doctora, SEO genérico nulo)',
      traffic: 'Muy Bajo (149 visitas/mes). Depende en exclusiva de gente que ya la conoce (boca a boca / redes).',
      cost: 'Lead Value: Oro puro. Al ser 100% tráfico de gente buscando "Alejandra Rivera", los visitantes llegan pre-convencidos. Perder a uno de estos usuarios por una mala web es perder una venta asegurada.',
      topPages: '1. Home - 147 visitas (Todo el tráfico de la web se estanca en la página principal).\nNo existen páginas de servicios posicionadas.',
      competitors: 'No compite en Google. Solo compite consigo misma agendando a la gente que le llega por recomendación.',
      socialTraffic: 'Dependencia Crítica. Su motor de captación no es Google, es el boca a boca y las Redes Sociales.',
      insights: 'Hola equipo de la Dra. Alejandra Rivera. Hemos auditado dralejandrarivera.com y el resultado es lo que denominamos un «Secuestro de Marca Puro».\n\nLas métricas no mienten: tenéis unas 149 visitas orgánicas mensuales. Y la estadística clave es que el 100% de ese tráfico llega porque escriben explícitamente en Google "Alejandra Rivera". \n\nA nivel de captación en buscadores, la clínica no existe para el que busca "relleno de ojeras" o "botox en Valencia". Sois una clínica sostenida por vuestro prestigio, el boca a boca y las redes sociales.\n\nLa Alerta Comercial: Esto significa que la persona que entra en vuestra web es un "Paciente Caliente". Ya os conoce, os han recomendado o viene de Instagram. Si esa persona aterriza en la web y no encuentra una forma inmediata, rápida y conversacional de agendar su problema, se va y perdéis un cliente que ya venía con la tarjeta en la mano.\n\nNuestra Inteligencia Artificial se instala no para traer tráfico (para Google ya no existís), sino para Blindar el Cierre.\n\nNuestra IA funciona como un «Comercial Privado» para esa gente que os busca: Cuando alguien entra a vuestra Home, la IA se dispara directamente: «Hola, qué alegría tenerte por aquí. ¿Te han recomendado a la Doctora Alejandra para algún tratamiento en particular? Cuéntame qué necesitas y te paso precios y los huecos que le quedan libres esta semana.»\n\nHay que dejar de tratar la web como una tarjeta de visita antigua y convertirla en una máquina de cerrar citas automáticas para ese tráfico de boca a boca.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://dralejandrarivera.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Dra Alejandra Rivera',
          slug: 'dralejandrarivera',
          industry: 'Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://dralejandrarivera.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Dra. Alejandra Rivera inyectada correctamente.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
