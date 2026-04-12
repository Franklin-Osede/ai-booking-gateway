import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const wpText = "\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si te hablan de su WhatsApp: 'Sois un titán nacional, tenéis tráfico entrando a leer de Jordi Alba o de Albacete. Cuando llega alguien a la página de Sevilla buscando clínica, no podéis derivarle a una simple cola de WhatsApp porque se mezclan con curiosos. Mi inteligencia detecta en su página, le habla sobre injertos en Sevilla de forma específica, le resuelve la duda técnica y le agenda en firme en el calendario on-site. Filtramos al curioso y cerramos al comprador sevillano, blindando la agenda.'";

  const seoMetrics = {
    summary: "Arquetipo: 'El Titán Desequilibrado'. Tienen un dominio inmenso a nivel nacional (Clínicas Dr. Pelo), rankeando brutalmente por blogs de famosos (Jordi Alba) y ciudades como Albacete. Pero en su sede de Sevilla están desinflados en búsquedas genéricas (Posición 15-18).",
    traffic: "Tienen miles de visitas globales, pero la landing específica de Sevilla se lleva unas 104 visitas al mes. Es un tráfico bajísimo para la burrada de Autoridad que tiene su dominio madre.",
    cost: "El coste de oportunidad está en el despilfarro de autoridad. Tienen un 'Ferrari' de dominio, pero lo tienen en marcha en Albacete y aparcado en Sevilla. Si la landing de Sevilla estuviera optimizada, facturarían el triple en esa ciudad.",
    socialTraffic: "Muy alto. Un artículo sobre Jordi Alba les trajo cientos de compartidos (472 shares). Tienen peso.",
    topPages: "El blog manda. Las noticias de famosos o explicaciones técnicas se llevan la palma. De las sedes, Albacete (268) tira más del doble que Sevilla (104).",
    competitors: "En keywords comerciales de Sevilla ('mejor clinica capilar sevilla', 'clinica capilar sevilla') están en la página 2 (posiciones entre la 15 y la 18). Solo los encuentran quienes buscan expresamente 'dr pelo sevilla'.",
    insights: "PITCH DIRECTO AL OWNER (Foco en Exprimir la Autoridad Nacional para Sevilla):\n'Acabo de someter a vuestro dominio (Dr. Pelo) a una radiografía y es increíble la autoridad nacional que tenéis: atraéis tráfico masivo con artículos como el de Jordi Alba y vuestra sede de Albacete vuela. Sois un Titán.\n\nPero tengo que advertiros de un desequilibrio importante: en Sevilla estáis perdiendo la guerra. La landing de injerto capilar en Sevilla capta a duras penas 100 visitas, y casi todas son de gente que ya va buscando 'Dr Pelo'. En las búsquedas de dinero de verdad ('mejor clinica capilar sevilla') estáis relegados a la página 2 (Pos. 15-18). Vuestro nivel de dominio debería destrozar a esos competidores, pero no lo hace.\n\nFase 1: Filtrar la Paja y Asegurar el Oro. Al tener tanto tráfico nacional de curiosos que leen vuestro blog, corréis el riesgo de que el equipo de atención pierda tiempo. Os instalo el Asistente Médica IA en todas las landings. Si un usuario de Sevilla entra, la IA le atiende al segundo, corta el ruido, responde dudas médicas y agenda cita firme. El WhatsApp se satura, mi IA no.\n\nFase 2: Con la IA recogiendo conversiones, os re-diseño y opero el SEO de vuestra landing de Sevilla. Váis en un Ferrari, solo hay que apretar el acelerador local para poneros en el Top 3 y comerle el pastel local a Frontela y demás competidores.'" + wpText
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "drpelo" } }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://drpelo.es/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Dr. Pelo",
          slug: "drpelo",
          industry: "Hair Clinic",
          location: "Nacional (Foco Sevilla)",
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://drpelo.es/" }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Dr Pelo inyectado" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
