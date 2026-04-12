import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Fantasma Digital' (Baja Tracción). Estenuvo (estenuvo.es) apenas tiene visibilidad orgánica relevante en Google España. Con poco más de 100 visitas al mes, la inmensa mayoría de su tráfico entra exclusivamente buscando su propio nombre (búsqueda de marca 'estenuvo').",
    traffic: "Muy Bajo (104 visitas/mes). Prácticamente es tráfico residual o directo de personas que ya conocen la marca. No están captando nueva demanda fría del mercado español.",
    cost: "El coste de oportunidad es absoluto. Si no pagas publicidad (Google Ads o Meta), literalmente no existes. Estás perdiendo el 99% de la cuota de mercado en favor de clínicas que sí posicionan para 'injerto capilar + ciudad'.",
    topPages: "Solo la Home (101v) y un artículo suelto sobre 'productos naturales' (1v). Tienen un catálogo de palabras clave indexadas mínimo (21 keywords).",
    competitors: "Casi cualquier clínica de Las Palmas o referente nacional les supera en visibilidad orgánica ahora mismo.",
    socialTraffic: "Pacientes que llegan principalmente por boca a oreja o redes sociales, e introducen su nombre en Google para buscar la web oficial.",
    insights: "PITCH CONSULTIVO Y ESTRATÉGICO:\n'Hola [Nombre], te llamo porque he estado analizando vuestra curva de visibilidad y posicionamiento. A nivel orgánico, actualmente tenéis lo que llamamos el perfil del «Fantasma Digital». Casi el 100% de vuestras 100 visitas mensuales son porque alguien busca «Estenuvo» explícitamente.\n\nEsto significa que si no estáis inyectando mucho presupuesto mensual en Google Ads o Facebook Ads, sois invisibles para el paciente que busca «clínica capilar» en vuestra zona.\n\nEl motivo de la llamada no es venderos SEO. Hacer SEO hoy en día tarda 6 meses en dar un solo lead. La propuesta es cómo maximizar agresivamente a esos pocos usuarios que SÍ os están buscando por marca. Hoy en día, de cada 10 personas que os buscan, 9 ven la web, curiosean y se van sin contactar porque ven los típicos formularios estáticos o el botón de WhatsApp genérico.\n\nLo que hacemos nosotros es instalar un Asistente Médico de IA inmediato. En cuanto alguien entra a estenuvo.es, la IA le saluda: «Hola, bienvenido a Estenuvo. ¿Considerando un rediseño capilar o vienes buscando información de tratamientos? Hoy tenemos agenda abierta para valoraciones gratuitas». \n\nNo intentamos que tengáis millones de visitas. Intentamos que de las 100 visitas de altísima calidad (buscan vuestra marca) que tenéis, saquemos el TRIPLE de leads. Exprimir el tráfico actual al 200% para compensar la falta de posicionamiento genérico.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dicen que ya tienen muy buena conversión o WhatsApp: 'Me alegra oírlo. Pero justamente el WhatsApp tiene un fallo brutal en webs de bajo tráfico: la fricción de dar el primer paso. El usuario de 2026 prefiere interactuar con un asistente virtual de forma neutra y anónima antes de exponer su número personal a un vendedor humano en WhatsApp. La IA «calienta» al usuario 24/7 y os entrega el número solo cuando el paciente ya está convencido de querer la valoración.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "estenuvo", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://estenuvo.es/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Estenuvo",
          slug: "estenuvo",
          industry: "Clínica Capilar",
          location: "España",
          seoMetrics,
          websites: { create: { url: "http://estenuvo.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Estenuvo inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
