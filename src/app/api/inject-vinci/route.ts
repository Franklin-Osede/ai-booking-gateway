import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Coloso Internacional / Tráfico Diluido'. Vinci Hair Clinic es un monstruo del SEO orgánico con un Autoridad de Dominio 40 y más de 21,350 visitas mensuales. Tienen presencia en múltiples países e idiomas (EN, ES). Su reto no es captar atención, es canalizar un tráfico masivo, internacional y disperso (desde 'alopecia por tracción' hasta temas virales como 'el dedo anular') hacia su red global de clínicas de forma eficiente.",
    traffic: "Masivo (+21,000 visitas/mes). Es un volumen altísimo y multilingüe, combinando búsquedas de intención de compra directa con artículos informativos genéricos o curiosos ('países más calvos').",
    cost: "Con este volumen, una caída del 1% en su ratio de conversión (CRO) significa miles y miles de euros perdidos al mes. Su coste de oportunidad al usar formularios web estáticos para todo el mundo es incalculable.",
    topPages: "1. Curiosidades ('Dedo anular', 'Países más calvos'). 2. Informacionales técnicos ('Alopecia por tracción', 'Baja porosidad'). 3. Home pages de ES y EN.",
    competitors: "Juegan a nivel internacional. Su competencia son las grandes marcas globales y el turismo médico capilar en Turquía.",
    socialTraffic: "Dado su alcance global y el tipo de artículos 'lifestyle', el tráfico social y de branding debe ser un pilar fundamental.",
    insights: "PITCH CONSULTIVO: EL CONCIERGE MULTILINGÜE Y MULTIPLICADOR DE CRO\n\n'Hola [Nombre], hemos auditado vuestra infraestructura global (vincihairclinic.com) y los números son impresionantes: más de 21,000 visitas mensuales y un DA de 40. Jugáis en la máxima categoría.\n\nSin embargo, operar a esta escala tiene un problema de dispersión enorme. Tenéis usuarios entrando desde Miami, Madrid o Londres, buscando desde curiosidades ('países más calvos') hasta problemas serios ('alopecia por tracción'). Si canalizáis estos 21,000 usuarios a través de formularios de contacto estáticos genéricos, estáis perdiendo, por pura fricción, a miles de pacientes todos los meses.\n\nNosotros no hacemos SEO, no venimos a enseñaros márketing. Venimos a instalar un multiplicador de conversión (CRO). Desplegamos un Concierge Inteligente y Multilingüe. Este sistema aborda al visitante en tiempo real, detecta en qué artículo está y qué idioma habla, interactúa con él de forma natural y lo cualifica. \n\nSi el usuario está listo, la IA captura su teléfono y lo enruta automáticamente a la base de datos de vuestra clínica más cercana (ya sea Madrid o Londres). Automatizamos el triaje internacional, subiendo vuestro porcentaje de conversión sin añadir un solo sueldo extra de recepción telefónica a vuestra plantilla global.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "vinci", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: {
            create: { url: "http://vincihairclinic.com/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Vinci Hair Clinic",
          slug: "vinci",
          industry: "Clínica Capilar",
          location: "Internacional",
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://vincihairclinic.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Vinci Hair Clinic inyectada en el dashboard." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
