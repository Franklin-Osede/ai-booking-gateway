import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'La Marca Personal Hiper-Dependiente'. Crecimiento vertical reciente (815 visitas orgánicas) traccionado casi enteramente por la búsqueda de la marca 'Marco Romagnoli'. Están en fase de expansión (Madrid, Alicante, Valencia) pero su Autoridad de Dominio (DA 6) es sorprendentemente baja frente a su tráfico real.",
    traffic: "815 visitas mensuales. Curva de crecimiento en pico desde finales de 2024, señal inequívoca de notoriedad offline (prensa, boca a boca, o recomendación de influencers).",
    cost: "La gente entra a la web con la tarjeta en la mano buscando al Dr. Romagnoli. Si en ese momento la web se percibe como un currículum estático en lugar de una pasarela rápida de reservas para sus 3 sedes, el 'momentum' se enfría y aplazan la llamada.",
    topPages: "Home, Sede Madrid, Sede Alicante y Parafarmacia.",
    competitors: "Compiten desde la figura del Doctor Autoridad, no desde la guerra fría de las keywords genéricas.",
    socialTraffic: "Tracción directa fortísima disfrazada de tráfico orgánico.",
    insights: "PITCH CONSULTIVO: CAPITALIZACIÓN DE LA MARCA PERSONAL\n\n'Hola equipo de MR Grupo Clínico. Viendo vuestros datos de inteligencia capilar, hay un patrón clarísimo: tenéis un DA (Autoridad de Dominio) muy bajito para Google pero un tráfico buenísimo de 800 pacientes al mes. ¿Por qué ocurre esto? Porque la gente no busca 'ponerme pelo', la gente busca literalmente 'Marco Romagnoli'. El doctor tiene tracción de estrella.\n\nAhora bien, cuando ese paciente con tantísima intención de compra busca al doctor y llega a la web... ¿cómo se le recibe? Si sólo hay un formulario de contacto frío, estáis perdiendo la conversión por impulso.\n\nLo que os propongo es instalar el 'Asistente Médico del Dr. Romagnoli'. Alguien busca la marca, entra, y una IA le saluda: «Hola, soy el asistente virtual del Dr. Marco Romagnoli y su equipo. Veo que nos visitas. ¿En qué sede te gustaría agendar tu valoración: Madrid, Valencia o Alicante?».\nEl usuario siente que está interactuando con la estructura del doctor de inmediato y hacéis el enrutamiento perfecto a cada sede en piloto automático.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "mrgrupoclinico" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://mrgrupoclinico.com/" } }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "MR Grupo Clínico",
          slug: "mrgrupoclinico",
          industry: "Clínica Capilar",
          location: "Valencia (y Sedes)",
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://mrgrupoclinico.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "MR Grupo Clínico inyectada correctamente." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
