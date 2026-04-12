import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Imperio Caído / La Corrección Local'. Dra. Raya León tuvo un pico de ~1,000 visitas al mes en verano de 2025 que se ha desplomado a apenas 102 visitas actuales. Seguramente Google ha purgado su tráfico 'nacional' informacional y le ha dejado únicamente su tráfico hiper-local (pos #1 en 'centros de estetica cadiz').",
    traffic: "102 visitas al mes. Pérdida del 90% respecto a su pico histórico. Todo el tráfico que sobrevive es 100% transaccional de Cádiz.",
    cost: "La frustración de ver los gráficos en rojo. Pueden estar invirtiendo dinero en agencias SEO intentando 'recuperar' un tráfico que en realidad era gente de Madrid buscando cuánto duele hacerse el láser. Tienen que cambiar su mentalidad de volumen a conversión.",
    topPages: "Home (acaparando casi todo el tráfico local restante).",
    competitors: "Cualquier centro de estética o clínica en Cádiz. Tienen una posición dominante local, así que su mayor enemigo es su propia tasa de rebote.",
    socialTraffic: "No especificado, pero altamente dependiente del boca a boca para mantener el volumen.",
    insights: "PITCH CONSULTIVO: EXPRIMIR LO QUE QUEDA DESPUÉS DE LA CAÍDA\n\n'Hola [Nombre], he analizado el histórico de draraya.com y veo perfectamente lo que ha pasado. Tuvisteis un desplome enorme de tráfico, pasando de casi 1,000 visitas al mes a apenas 100.\n\nSé que ver esos números duele, pero os traigo buenas noticias: ese tráfico que perdisteis era seguramente gente de fuera de Cádiz leyendo vuestro blog sobre el láser, gente que nunca iba a ir a la clínica. El tráfico que os queda hoy es el que de verdad importa: sois número 1 en 'centro de estética en Cádiz'. Son 100 personas de vuestra ciudad buscando exactamente lo que hacéis.\n\nEl problema es que, como ahora tenéis 10 veces menos visitas, no os podéis permitir el lujo de que nadie cierre la pestaña aburrido. Cada visita local vale oro.\n\nNosotros no venimos a venderos SEO para recuperar tráfico fantasma. Os instalamos un Asistente Médico de IA que aborda a esos 100 pacientes gaditanos en el momento en que entran, responde a sus dudas (precio, dolor, disponibilidad) y les agenda la cita ahí mismo. Si el tráfico baja, la conversión tiene que subir al 100% para compensar.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: "draraya" },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://www.draraya.com/" } }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Dra. Raya León Clínica Estética",
          slug: "draraya",
          industry: "Clínica Estética",
          location: "Cádiz",
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://www.draraya.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Dra. Raya inyectada correctamente." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
