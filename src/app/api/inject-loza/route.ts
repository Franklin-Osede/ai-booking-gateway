import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const wpText = "\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si te dicen que ya tienen WhatsApp: 'Doctor, la web acaba de nacer. Con 74 visitas al mes (solo de gente que ya te busca), no te puedes permitir ni un despiste. Si esa persona pulsa el icono de WhatsApp, el móvil le abre la app, pero si justo en ese momento le salta una notificación del banco o de su familia, ya no te escribe. Has perdido a un paciente que te venía recomendado. Mi sistema ancla al paciente en la web: la IA le saluda en el acto, responde preguntas sobre cualquiera de tus 20 tratamientos (Botox, capilar, hilos) y te manda la cita cerrada a la agenda. Cero fisuras.'";

  const seoMetrics = {
    summary: "Arquetipo: 'El Diamante en Bruto'. Una clínica estética y capilar que parece haber acaba de lanzar su web (cero visitas hasta hace un mes, y ahora 74). Tienen un catálogo enorme de servicios pero Google aún no los ha indexado con fuerza (Autoridad 1).",
    traffic: "Solo 74 visitas mensuales, todas ellas provenientes de búsquedas ultra-específicas de su marca ('clinica doctor loza').",
    cost: "El catálogo de servicios de esta clínica es brutal (Rinomodelación, código de barras, hilos tensores, injertos, etc). Sin embargo, orgánicamente no existen para esas palabras. Todo el que entra en la web debe de venir de su Instagram o el boca a boca offline.",
    socialTraffic: "No tienen peso externo (1 enlace). Viven 100% de la fuerza presencial del Doctor Loza o de su publicidad en redes.",
    topPages: "El 90% del tráfico aterriza en la Home. Las páginas detalladas de los tratamientos (que son muchísimas) están cogiendo polvo virtual porque nadie llega a ellas desde Google.",
    competitors: "Ahora mismo sus competidores en SEO ni saben que existen. Loza está en la posición 74 o superior para términos calientes como 'clínica capilar en sevilla'.",
    insights: "PITCH DIRECTO AL OWNER (Foco en Rentabilizar el Boca a Boca y Cubrir todos los Tratamientos):\n'Se nota a leguas que Clínica Doctor Loza acaba de encender los motores digitales. La gráfica de tráfico estaba plana hasta hace nada y ahora habéis captado vuestras primeras 70 visitas. Tenéis Autoridad 1 y casi cero enlaces. \n\nPero tenéis algo tremendo: un menú de servicios brutal. Hilos tensores, bótox, rinomodelación, injertos... El problema es que en Google sois invisibles para todos ellos (posición 74). Esas 70 visitas que tenéis son 100% pacientes que ya os conocen, que os han visto en redes o recomendados por amigos.\n\nCuando una web está naciendo, perder a una sola de esas 70 visitas duele en el alma. Además, al ofrecer tanta variedad (estética y capilar), el paciente a veces llega a la web y se marea sin saber qué tratamiento necesita. \n\nInstalando al Asistente Inteligente hoy mismo logramos algo crítico: actúa como un Asesor Estético Médico 24/7. Resuelve cualquier duda de vuestros 20 servicios al segundo, da confianza y les cierra la cita bloqueando la hora. Retenemos al 100% del tráfico de recomendación.\n\nY luego viene la artillería: con el dinero que atrape la IA, inyectamos SEO técnico para cada una de vuestras páginas (bótox, capilar, etc.) y empezáis a robar tráfico de gente que hoy por hoy busca esos tratamientos en Sevilla y se van a otras clínicas porque ni saben que estáis ahí.'" + wpText
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: "clinicadoctorloza" }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics: seoMetrics }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Doctor Loza",
          slug: "clinicadoctorloza",
          industry: "Medical Aesthetics",
          location: "Sevilla",
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://clinicadoctorloza.es/" }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Clinica Doctor Loza inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
