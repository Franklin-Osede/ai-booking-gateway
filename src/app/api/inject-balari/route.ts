import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const wpText = "\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si te dicen que ya lo hacen manual por WhatsApp o que son pocos leads: 'Tener 7 visitas al mes y mandarlas a un WhatsApp o un formulario es invitar al naufragio. De esos 7, a poco que tarden en contestarle, se asuste con el precio o se líe entre Jerez y Sevilla, lo has perdido, y tu tráfico del mes es 0. La IA es como poner a un francotirador médico en la puerta, que está velando armas 24/7. Agarra al único lead bueno de la semana, le resuelve las dudas al milisegundo en la propia web, y le ancla a una reserva. En vuestra etapa actual de estancamiento, vuestra prioridad obsesiva tiene que ser subir la conversión al 100% del tráfico mínimo que entra.'";

  const seoMetrics = {
    summary: "Arquetipo: 'El Desierto Sediento'. Es una web en estado casi fetal o profundamente estancada con solo 7 visitas estimadas al mes. Intentan morder de varios pasteles (Jerez Posición 5, Sevilla Posición 14, Cádiz), pero sin tracción real. Cada visita es oro y no pueden permitirse perder a nadie.",
    traffic: "Nulo. 7 visitas orgánicas. Si entra alguien cualificado a la web, es casi por un milagro, por el boca a boca o por estar buscando cosas muy exactas en Jerez.",
    cost: "El coste de oportunidad es la supervivencia digital. Con tan pocas visitas, cualquier fricción en la web (una duda, un formulario aburrido, un de WhatsApp) significa perder el escaso ROI que tienen.",
    socialTraffic: "18 enlaces a la web. Básicamente es un escaparate inactivo.",
    topPages: "Solamente tienen dos páginas moviendo ficha de forma ridícula (Home e Injerto capilar), pero atacan un triángulo estratégico muy ambicioso: Cádiz, Jerez y Sevilla.",
    competitors: "Están en la cuerda floja, en la hoja invisible de Google para el gran volumen. La posición 14 en Sevilla los hace directamente invisibles, rascan migajas del nicho concreto de Jerez.",
    insights: "PITCH DIRECTO AL OWNER (Foco en Exprimir la Escasez y Subir el ROI por Visita):\n'Os soy muy sincero: he analizado Clínica Balari a nivel digital y sois un oasis en el desierto. Traéis ahora mismo 7 estimadas orgánicas al mes.\n\nVeo además que estáis intentando una estrategia ambiciosa para ser competitivos y comerle mercado al triángulo de oro (Sevilla, Jerez, Cádiz). Estáis en posición 14 en 'Clínica capilar Sevilla' y lográis estar asomando en posición 5 para Jerez.\n\nAquí tenemos un problema de prioridades. Tener tan poco tráfico no es el fin del mundo, siempre y cuando apliquemos una regla de oro: LA EXPRESIÓN MÁXIMA DE CONVERSIÓN. Si entran 7 personas, y lográis que esas personas empiecen a navegar, si se van, no tenéis negocio digital.\n\nFase 1: No podéis depender de que alguien coja un WhatsApp a las diez de la noche. Instalamos la IA Médica Inteligente. La IA agarra por el cuello (con profesionalidad) a cada una de esas 7 visitas. Al segundo uno, le da una asesoría en vivo, da igual que vengan de Sevilla o Jerez, y ancla a ese paciente al asiento con una visita presencial cerrada o los datos guardados. Exprimimos cada gota que caiga a la web antes de invertir un duro más.\n\nFase 2: Con el goteo de ventas que generemos reteniendo todo lo que entra, le inyecto ese presupuesto a la web para tirar a cañonazos y subiros esas posiciones del fango 14 al podio del estético andaluz.'" + wpText
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "balari" } }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://www.clinicabalari.com/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Balari",
          slug: "clinicabalari",
          industry: "Hair Transplant / Medical Aesthetics",
          location: "Jerez/Sevilla",
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://www.clinicabalari.com/" }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Balari inyectado" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
