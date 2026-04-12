import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const wpText = "\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si mencionan WhatsApp: 'Con 12 visitas al mes, no hay margen de error. De esos 12, si solo 1 pulsa el botón de WhatsApp, sale de la web, se distrae con otra app y no escribe, habéis tirado el mes entero. Mi Asistente Cognitivo convierte la web en una trampa de atención: el paciente no sale, charla ahí mismo, y cierra su cita. Agarra fuerte al poco tráfico que entra y no lo suelta.'";

  const seoMetrics = {
    summary: "Arquetipo: 'El Dominio Letárgico' (Tracción Oculta). Es un Exact Match Domain (con palabras clave puras en la URL) pero Google lo tiene bajo el radar. Apenas superan las 10-15 visitas mensuales y viven de búsquedas residuales de otras clínicas como 'Frontela'.",
    traffic: "Prácticamente nulo (aprox. 12 visitas al mes). Es una web muerta a nivel orgánico.",
    cost: "El coste de oportunidad es absoluto. De tener una web con su nombre técnico a no tener nada, casi no hay diferencia. Cada visita humana que entra vale diamantes porque es rarísimo que ocurra.",
    socialTraffic: "Inexistente. No hay comunidad apoyando este dominio.",
    topPages: "La Home y una landing de Dos Hermanas. La página que más tira lo hace con 8 visitas.",
    competitors: "No compiten. Están en la posición 20-30 para su propia palabra clave principal (clínica capilar sevilla). Curiosamente, la poca gente que entra es porque buscan a 'clínica Frontela' y logran pescar algún clic despistado (Pos 7).",
    insights: "PITCH DIRECTO AL OWNER (Foco en Supervivencia y Reanimación):\n'He auditado la URL injertocapilarfuesevilla.com y tengo que ser muy directo: a ojos de Google, la web tiene una visibilidad muy baja. Apenas entra nadie. Calculamos unas 12 visitas mensuales en total.\n\nTener un dominio con las palabras exactas ('injerto', 'capilar', 'sevilla') solía funcionar muy bien hace 10 años, pero hoy los algoritmos lo penalizan si no hay Autoridad detrás. Y estáis en la posición 20 para vuestro término estrella. Vivís de alguna visita residual que busca 'Frontela' y acaba cayendo aquí por despiste.\n\nAquí el plan es a vida o muerte (comercialmente hablando). Fase 1: Cada persona que entra (esos 12 valientes) no puede recibir un formulario frío ni un botón pasivo de WhatsApp, porque si lo pierdes, pierdes el mes. Os instalo el Asistente Inteligente hoy para que interactúe al instante con esos 12 y rasquemos al menos 1 o 2 valoraciones aseguradas cerrando cita en automático.\n\nFase 2: Intervención de SEO radical. O inyectamos SEO técnico o el dominio seguirá siendo invisible. Usamos el asistente para rentabilizar el tráfico de hoy, y con el mismo presupuesto os aplico la cirugía de posicionamiento para devolver la web a página 1 y que alcance todo su potencial oculto.'" + wpText
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: "injertocapilarfuesevilla" }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://injertocapilarfuesevilla.com/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Injerto Capilar FUE Sevilla",
          slug: "injertocapilarfuesevilla",
          industry: "Hair Clinic",
          location: "Sevilla (Dos Hermanas)",
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://injertocapilarfuesevilla.com/" }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Dominio Letargico inyectado" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
