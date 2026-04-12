import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'La Clínica Boutique Ahogada por los Gigantes'. Tienen buena reputación, tratamientos consolidados (en Madrid y Santiago), pero están perdiendo tráfico gradualmente a manos de franquicias y clínicas capilares low cost. Excelente posicionamiento informativo, pero sufren de baja conversión.",
    traffic: "355 visitas orgánicas mensuales. Fuerte caída (pérdida de casi el 40% del tráfico en el último año).",
    cost: "Rozan la primera página para palabras clave muy transaccionales (posiciones #12 y #13 para 'clinica capilar madrid' y 'clínicas capilares madrid' con 2400 búsquedas cada una). El tráfico más caliente se lo están llevando Clínicas Gigantes justo por encima de ellos.",
    topPages: "Gran parte del flujo entra por artículos informativos ('tipos de calvicie', 'caída por estrés en mujeres'). El problema es que atraen al 'Lector Fantasma', se informa y se va sin dejar contacto.",
    competitors: "El tráfico caliente se escapa hacia Hospital Capilar, Insparya y otras clínicas con maquinaria fuerte de marketing. Se ven obligados a competir pasivamente.",
    socialTraffic: "Se percibe gran volumen en palabras clave branded, lo que indica que sobreviven de reputación frente a retención de tráfico frío.",
    insights: "PITCH CONSULTIVO: EL TORNIQUETE DE CONVERSIÓN\n\n'Hola [Nombre], he estado auditando la infraestructura de captación de Clínica Capilar Laura Agrelo. Veo que tenéis un trabajo excelente y mucha autoridad, pero me preocupan dos fugas de capital muy claras que he detectado en vuestras métricas orgánicas.\n\nPor un lado, habéis perdido cerca del 40% de tráfico en el último año. Por otro, estáis en la posición #12 y #13 para términos clave en Madrid. Estáis a las puertas de la página 1 para miles de búsquedas mensuales. Además, todo ese tráfico que os entra leyendo sobre (por ejemplo) caída de pelo por estrés en mujeres, es tráfico frío que lee y se va. Es el 'lector fantasma'. Las franquicias gigantes os están robando la conversión final.\n\nNo os llamo para haceros SEO, eso es harina de otro costal. Os llamo para instalar un torniquete. Hemos desarrollado un Asistente Médico de IA que se integra en vuestra web. Su trabajo no es decir 'hola, ¿en qué puedo ayudar?', su trabajo es saltar estratégicamente cuando ese visitante lee sobre alopecia por estrés, cualificar su caso de forma empática y cerrar una valoración médica en vuestras sedes de Madrid o Santiago antes de que vuelva a internet a buscar otra clínica. \n\nEs retención pura para multiplicar vuestra rentabilidad actual con el tráfico que YA tenéis, sin gastar 1 céntimo más en campañas.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si os dicen 'No queremos un chatbot, deshumaniza' o 'Preferimos el trato personal': 'Exacto, y nosotros también. Este asistente solo entra en acción cuando vosotros no podéis. Es decir, a las 23:00 de la noche un domingo, cuando alguien está leyendo vuestro blog, el asistente cualifica y le coge los datos. Al día siguiente, os encontráis el teléfono caliente para que le deis el verdadero trato personal. No os sustituye, os rellena la agenda.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "lauraagrelo", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics,
          websites: {
            create: { url: "http://clinicacapilarlauraagrelo.com/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Capilar Laura Agrelo",
          slug: "lauraagrelo",
          industry: "Clínica Capilar",
          location: "Madrid & Santiago",
          seoMetrics,
          websites: { create: { url: "http://clinicacapilarlauraagrelo.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Clínica Capilar Laura Agrelo inyectada en el dashboard." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
