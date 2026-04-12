import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Generalista (Supermercado Estético)'. Tienen 650 visitas al mes (un volumen muy respetable), pero a diferencia de la competencia pura, están atacando múltiples frentes: rinomodelación (donde son top 1), estética facial (botox/ácido) y capilar (injertos). Su Autoridad de Dominio es ínfima (DA 2).",
    traffic: "651 visitas. Tráfico muy fragmentado: unos 100 entran buscando narices, otros 50 buscando pelo, y la gran mayoría buscando la marca 'Sampayo' a la Home.",
    cost: "La Paradoja de la Elección: cuando un paciente entra buscando injerto capilar pero aterriza en una Home que le habla de labios, botox, rinomodelación y cejas, la tasa de rebote se dispara por pérdida de foco temporal.",
    topPages: "Home, Rinomodelación, Injerto Capilar, Botox.",
    competitors: "Tienen un frente abierto con clínicas capilares puras y otro frente con clínicas estéticas generalistas.",
    socialTraffic: "Cero, todo orgánico de intención mixta.",
    insights: "PITCH CONSULTIVO: EL TRIAJE MULTI-ESPECIALIDAD\n\n'Hola equipo del Dr. Sampayo. Viendo vuestras métricas, sois un caso interesantísimo. No sois una clínica 'mono-producto', sois un centro integral. Vuestro tráfico es enorme (650 visitas), pero entra muy fragmentado: unos buscan 'rinomodelación valencia' (donde sois líderes absolutos en Google), otros buscan botox, y otros buscan pelo.\n\nEl problema de tener tantas especialidades es el 'Rebote por Distracción'. Si alguien quiere pelo y ve labios, a veces se va a una clínica que 'sólo haga pelo' porque le da más confianza de especialización.\n\nLa solución es implementar un 'Recepcionista de Triaje Multi-Especialidad'. Un agente de IA que, nada más entrar el paciente a la web, le reciba: «Hola, bienvenido a la Clínica Estética del Dr. Sampayo. Para darte la mejor atención, ¿en qué especialidad te podemos ayudar hoy? 1. Armonización Facial (Botox/Labios/Rinomodelación) o 2. Restauración Capilar (Injerto/PRP)».\nEl usuario pincha su opción y *boom*, la IA se transforma en un experto capilar o en un experto facial, aislando al lead de las demás distracciones y agendándole directamente con vuestro equipo.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "sampayo" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://clinicadoctorsampayo.com/" } }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Dr. Sampayo",
          slug: "clinicadoctorsampayo",
          industry: "Medicina Estética Integral",
          location: "Valencia",
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://clinicadoctorsampayo.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Dr. Sampayo inyectada correctamente." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
