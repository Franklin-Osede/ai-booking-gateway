import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Escaparate de Precios'. Sus datos orgánicos son residuales (3 visitas/mes), pero lo fascinante es DÓNDE entran. El 100% de su tráfico orgánico entra única y exclusivamente a la URL '/tarifas' buscando las keywords 'botox valencia precios'.",
    traffic: "Prácticamente nulo (3 visitas), pero de una intención transaccional altísima y basada puramente en precio.",
    cost: "La Trampa del Catálogo. Si la única razón por la que te encuentran es por el precio, el paciente te usa para comparar. Entran, miran el tarifario, no hablan con nadie, y se van a negociar con su clínica de confianza u otra más barata.",
    topPages: "URL de /tarifas es su única fuente de vida orgánica.",
    competitors: "Cualquier clínica que oculte precios o tenga mejores ofertas. Al mostrar precios transparentes sin cualificar el valor, están a merced del mercado.",
    socialTraffic: "Desconocido, pero su SEO está anclado al precio.",
    insights: "PITCH CONSULTIVO: EL ASISTENTE DE PRESUPUESTOS (DEFENSA DEL PRECIO)\n\n'Hola equipo del Dr. Leo Lomanto. Viendo vuestras analíticas, detectamos un patrón interesantísimo y súper peligroso para vuestra rentabilidad. Todo vuestro (escaso) tráfico orgánico actual entra por una única puerta: la página de Tarifas. La gente os encuentra buscando «botox valencia precio».\n\n¿Cuál es el problema de esto? Que vuestra página actúa como un escaparate frío. El paciente entra, mira el número, decide por sí mismo si es caro o barato sin escuchar vuestra propuesta de valor, y se va a seguir comparando. Sois víctimas de los 'mirones de precio'.\n\nPara solucionar esto, no debéis regalar el precio sin pelear el valor. Os propongo incrustar un 'Asistente Táctico de Presupuestos'. Cuando el visitante busca precios, la IA le atiende en la página de tarifas: «Hola, veo que estás interesado en nuestras tarifas de Botox y Medicina Estética. Para darte un presupuesto exacto (ya que depende de zonas y viales), ¿qué zonas te gustaría tratar en concreto?».\nLa IA dialoga con él, capta sus necesidades, y le pide el contacto para enviarle el presupuesto exacto por WhatsApp. De esta forma, dejáis de ser un simple catálogo de precios para convertiros en un presupuesto personalizado cerrado.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "drleolomanto" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://www.drleolomanto.com/" } }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Dr. Leo Lomanto",
          slug: "drleolomanto",
          industry: "Medicina Estética",
          location: "Valencia (Enfoque Precio)",
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://www.drleolomanto.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Dr. Leo Lomanto inyectada correctamente." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
