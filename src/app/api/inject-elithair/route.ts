import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Titán Transaccional' (Turismo Médico y Precio). A diferencia de otras clínicas que atraen a curiosos informativos, el SEO de Elithair es puramente comercial y de alta intención de compra. Con 6.222 visitas mensuales, su oro está en rankear número 1 en búsquedas de precios y comparativas España vs Turquía. Son un monstruo del turismo capilar.",
    traffic: "Sólido y muy bien cualificado. Mueven 6.222 visitas al mes estables, con 1.733 keywords orgánicas. Han sabido posicionarse de forma excelente en la fase final del embudo (bottom of the funnel) donde el cliente ya tiene la tarjeta en la mano.",
    cost: "El coste de oportunidad no es la falta de interés, es la 'Búsqueda por Comparación'. El usuario que busca 'cuánto cuesta un implante capilar en Turquía', abre 5 pestañas de 5 clínicas distintas al mismo tiempo. Si Elithair no le resuelve sus dudas de logística (vuelos, hotel, idioma, seguridad) en 30 segundos, el usuario cierra la pestaña y manda el lead a la competencia.",
    topPages: "Su indiscutible top 1 es la página comparativa 'Precio Madrid vs Estambul' atrayendo 2257 visitas mensuales ella sola. También lideran en tratamientos médicos como 'Dutasterida' (260v) e 'Injerto en Turquía' (383v).",
    competitors: "Compiten en la liga más encarnizada: el turismo capilar turco contra gigantes como MCAN Health, Capilclinic o Serkan Aygin. Aquí el que responda primero y de más seguridad, se lleva el paciente.",
    socialTraffic: "Su home tiene 813 compartidos en Facebook, la página '¿Por qué no me sale casi barba?' tiene 209 compartidos. Tienen una buena comunidad, pero su verdadero valor está en el SEO transaccional de Google.",
    insights: "PITCH CONSULTIVO: ASEGURANDO EL LEAD TRANSACCIONAL TURCO\n'Hola [Nombre], te llamo porque nuestro equipo ha auditado vuestro SEO respecto a vuestra competencia del sector turco y, de verdad, enhorabuena. Tenéis un perfil radicalmente distinto a la mayoría. Movéis más de 6.200 visitas al mes, pero es que además sois el número 1 absoluto en búsquedas comerciales brutales: rankeáis top 1 para «precios injertos capilares» (1.600 búsquedas/mes) y para «cuánto cuesta un implante capilar».\n\nAl estar en la fase de 'turismo médico', el problema que enfrentáis es la Comparativa Feroz. Ese usuario que busca el precio del viaje a Estambul siempre tiene 5 pestañas abiertas de vuestros competidores. Tienen dudas logísticas urgentes: ¿Cómo va el vuelo? ¿Quién me traduce en Turquía? ¿Y si algo sale mal? Si a las 10 de la noche no encuentran la respuesta inmediata en la web, no llaman, simplemente se van a la pestaña de al lado de la otra clínica.\n\nNosotros instalamos Asistentes Médicos de IA especializados en vuestro protocolo de viaje. El Asistente salta en esa página top 1 de precios y le actúa como un «Asesor de Viaje y Médico». Le explica el paquete todo incluido, le da seguridad sobre los traslados y el hotel. Aniquila sus miedos al instante, y sin darle tiempo a que se vaya a los competidores, le pide el nombre y el teléfono para que le contacte un humano y cerrar el billete.\n\nNo cambiáis nada de SEO, es blindar vuestras 6.200 visitas comerciales para que no alimenten a la competencia.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dudan o dicen que ya tienen WhatsApp: 'Un WhatsApp de noche a Turquía asusta a un paciente que todavía está comparando de forma anónima. La IA no sustituye a vuestros asesores humanos, de hecho les hace el trabajo sucio: coge a ese paciente dudoso y temeroso a las 11 de la noche, le da un trato impecable e instantáneo, le saca el número, y a la mañana siguiente vuestro equipo humano tiene un lead en bandeja listo para cerrar el viaje depositando la reserva.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "elithair", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://elithair.es/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Elithair",
          slug: "elithair",
          industry: "Turismo Capilar (Turquía)",
          location: "España/Turquía",
          seoMetrics,
          websites: { create: { url: "http://elithair.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Elithair inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
