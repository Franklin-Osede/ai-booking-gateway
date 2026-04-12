import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Micro-Nicho Estancado / Tráfico a Cuentagotas'. Un dominio de coincidencia exacta (injertocapilarfuejerez.com) que lucha por existir a nivel local. Autoridad de dominio casi inexistente (DA 3) y apenas 2 visitas orgánicas al mes. Cada visitante que entra a la web vale su peso en oro.",
    traffic: "2 visitas orgánicas mensuales. La definición de un goteo mínimo. Sobreviven de las pocas personas que bajan hasta la posición 6 buscando su clínica en Jerez.",
    cost: "El coste de oportunidad es la pura supervivencia online. Si recibes 2 visitas al mes y esas 2 personas se van sin llamar porque la página no interactúa con ellas, tu canal digital está 100% muerto. Si pagan Ads locales para compensarlo, cada clic les cuesta un dineral.",
    topPages: "Inexistente. Únicamente la Home posiciona mínimamente para 'clinica capilar jerez'.",
    competitors: "Cualquier clínica con una reseña de Google My Business en Jerez o Cádiz les pasa por encima.",
    socialTraffic: "Asumimos que sobreviven del tráfico social local (grupos de Facebook de Cádiz, anuncios en Meta) y el boca a boca.",
    insights: "PITCH CONSULTIVO: EL EXPRIMIDOR DE TRÁFICO (NO PERDER LA ÚNICA GOTA DE AGUA)\n\n'Hola [Nombre], he visto los datos de posicionamiento de vuestra clínica en Jerez. Vamos a ser realistas: tenéis el dominio perfecto (injertocapilarfuejerez) pero Google solo os está mandando unas 2 visitas al mes orgánicamente.\n\nVivís en lo que nosotros llamamos el tráfico a cuentagotas. Me imagino que os estáis sosteniendo con recomendación de pacientes anteriores y quizás con anuncios de Facebook o Google Ads locales.\n\nCuando tu web recibe 2.000 visitas, perder a 10 no importa. Pero cuando tu web recibe 2 o 5 visitas reales al mes, si esa persona entra, mira la web y se va sin dejar su contacto porque le da pereza llamar... es una tragedia. Habéis perdido el mes.\n\nVenimos a blindar vuestra captación. No somos una agencia SEO, no os prometo la luna. Instalamos un Asistente Médico de IA hiper-localizado. Cuando entra vuestra única visita del día desde Jerez, el Asistente le salta de inmediato: 'Hola, somos los especialistas capilares de Jerez. ¿Te gustaría que evaluemos tu caso gratuitamente para dejar de viajar a Turquía o a Madrid?'.\n\nEl Asistente interactúa, le saca el número de WhatsApp y os lo manda. Nos aseguramos de exprimir hasta la última gota de vuestro escaso tráfico para que, quien entre en vuestra web, acabe sentado en vuestra consulta.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "jerez", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics,
          websites: {
            create: { url: "http://injertocapilarfuejerez.com/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Capilar Jerez",
          slug: "jerez",
          industry: "Clínica Capilar",
          location: "Jerez de la Frontera",
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics,
          websites: { create: { url: "http://injertocapilarfuejerez.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Clínica Capilar Jerez inyectada en el dashboard." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
