import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Rey Local Incontestable'. Son los líderes absolutos de Valencia a nivel SEO transaccional. Tienen casi 1.000 visitas al mes (968) y están en Top 1 para 'clinica capilar valencia' e 'implantes capilares valencia'. Tienen el trono, todo el tráfico de la ciudad pasa por ellos.",
    traffic: "968 visitas orgánicas de extrema calidad. Trafico 'Bottom of the Funnel' (listos para comprar). También fuerte intención de nicho en 'alopecia femenina'.",
    cost: "El Coste de la Fuga. Cuando eres el Nº1 absoluto, la mayor tragedia es que un paciente entre, mire, y se vaya sin dejar el teléfono. Su problema no es de captación, es de 'Agujeros en la Red'.",
    topPages: "Home absorbe el 90% del tráfico (916 visitas) por búsquedas genéricas transaccionales.",
    competitors: "Están por encima de todos orgánicamente en Valencia puros. Su competencia real son los monstruos nacionales (Insparya/Freitas) robándoles pacientes en la fase de comparación.",
    socialTraffic: "Indiferente, el orgánico les proporciona todo el 'deal flow' necesario.",
    insights: "PITCH CONSULTIVO: BLINDAJE DEL LIDERAZGO LOCAL Y ALOPECIA FEMENINA\n\n'Hola equipo del Dr. Devesa. Vuestros datos son una genialidad. Sois el Rey de Valencia en Google. Top 1 absoluto para 'clinica capilar valencia' y similares. Tenéis a mil personas al mes entrando a vuestra web con la tarjeta preparada para operarse.\n\nCuando estás en la cima, el problema ya no es el SEO, es la retención. De esos 1.000 valencianos que os visitan buscando injertos... ¿A cuántos cerráis? Porque si entran a vuestra web líder y se encuentran un formulario de contacto tardío, se enfrían, entran a comparar con las clínicas franquicia (Insparya, Freitas) y acaban operándose con ellos por agresividad comercial.\n\nOs propongo blindar vuestro liderazgo con un 'Recepcionista IA de Cierre Rápido'. El paciente entra y la IA le dice: «Hola, estás en la clínica Nº1 de Valencia. Para evaluar tu caso de injerto capilar, ¿podrías facilitarme por aquí una foto de tu estado actual para que el Dr. Devesa te haga una pre-valoración inmediata?».\nLa IA captura el contacto, la foto y le corta el paso a la competencia. Además, sois de las pocas clínicas posicionando para 'Alopecia Femenina'. La caída del cabello en mujeres es un tema súper sensible y reacio a formularios públicos; una IA privada y empática dispara la conversión en ese nicho específico por pura privacidad.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "devesa" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://clinicadevesavalencia.com/" } }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Devesa",
          slug: "clinicadevesavalencia",
          industry: "Clínica Médica Capilar",
          location: "Valencia (Líder SEO Local)",
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://clinicadevesavalencia.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Clínica Devesa inyectada correctamente." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
