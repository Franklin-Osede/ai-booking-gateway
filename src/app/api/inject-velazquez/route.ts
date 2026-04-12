import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'La Enciclopedia Gratuita'. Tienen un músculo de captación brutal enfocado en términos informativos y médicos hiper-cualificados ('minoxidil en espuma', 'efectos secundarios finasteride', 'foliculitis'). Atraen a perfiles con problemas reales de alopecia, pero el riesgo principal es que los usuarios devoren el contenido y se vayan sin dejar sus datos. Sufren de alta fuga de 'Lectores Fantasma'.",
    traffic: "Excelente volumen orgánico. Tráfico sostenido propulsado por artículos de divulgación e información puramente médica de gran valor para el usuario.",
    cost: "Sufren de un altísimo 'Costo de Oportunidad'. Hacen el trabajo duro (educar al visitante y calmar sus miedos), pero a la hora de la búsqueda transaccional puramente de venta ('clínicas capilares madrid' o 'injerto pelo madrid') rozan la página 2. Otra clínica se lleva el cierre de un cliente que Clínica Velázquez ha educado.",
    topPages: "Dominio absoluto en divulgación con artículos muy traficados sobre Minoxidil (mujeres y opciones en espuma), PRP, Finasteride y tratamientos para alopecia femenina y masculina.",
    competitors: "Se posicionan altísimo frente a foros médicos y artículos de divulgación, pero pierden fuelle transaccional contra macro-clínicas que pujan muy fuerte por la intención de reserva inmediata.",
    socialTraffic: "Demuestran excelente reputación ('clinica capilar velazquez' reporta cientos de hits directos). Confianza altísima por parte del usuario recurrente.",
    insights: "PITCH CONSULTIVO: CAPITALIZAR A TUS 'LECTORES FANTASMA'\n\n'Hola [Nombre], tras evaluar en detalle vuestra presencia técnica en internet, quiero daros la enhorabuena por la autoridad que habéis construido. Vuestro dominio atrae un flujo constante y masivo de personas buscando información vital: miedos sobre los efectos cruzados del Finasteride, las diferencias del Minoxidil en espuma, PRP capilar. Tenéis exactamente al público que toda clínica desearía.\n\nPero hay una fuga crítica de capital a la que prestamos mucha atención. Ahora mismo, funcionáis como la 'Enciclopedia' de vuestra competencia. Estáis educando a esos visitantes, tranquilizando sus miedos médicos... y una vez que asumen su problema y están listos, a menudo cambian de pestaña y no cierran cita, cayendo más tarde en embudos agresivos de la competencia. Estáis haciendo el trabajo difícil y otro se lleva la facturación.\n\nNo vengo a hablaros de tráfico web, de eso andáis genial. Nuestro sistema propone una Red de Captura. Si un usuario entra un jueves por la noche a leer sobre foliculitis, actualmente lee y se marcha. Con nuestro Asistente Médico de IA activo e inyectado en vuestra web, el asistente interviene estratégicamente: \"Hola, veo que te estás informando sobre el cuero cabelludo. Nuestros especialistas en Velázquez pueden estudiar tu caso particular de caída o sensibilidad. ¿Te agendo una valoración rápida?\". \n\nInstalamos esto en 5 minutos en vuestra web actual. Su única función es exprimir cada céntimo del tráfico informativo inmenso que YA tenéis, cualificar en caliente la madurez del paciente y convertir vuestros artículos gratuitos en una máquina de agendar consultas sin aumentar vuestro presupuesto comercial.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dudan sobre si una IA es apropiada en un entorno médico tan serio: 'Al revés. Precisamente porque el usuario confía en vuestro tono médico para leer sobre Finasterida, la IA entra en un tono puramente administrativo y profiláctico. Su rol principal es el triaje clínico asistencial en horarios donde vuestro equipo tiene que (y debe) estar durmiendo.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "velazquez", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics,
          websites: {
            create: { url: "http://clinicacapilarvelazquez.es/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Capilar Velázquez",
          slug: "velazquez",
          industry: "Clínica Capilar",
          location: "Madrid",
          seoMetrics,
          websites: { create: { url: "http://clinicacapilarvelazquez.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Clínica Capilar Velázquez inyectada en el dashboard." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
