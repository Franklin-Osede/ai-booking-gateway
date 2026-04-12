import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Francotirador Oculto'. Apenas tienen 30 visitas mensuales, pero es tráfico de oro puro. Con una Autoridad pobrísima (DA 3), están logrando colarse en la Posición 9 de la primera página para 'mejores clínicas capilares madrid' (1.600 búsquedas). Cada visita vale miles de euros.",
    traffic: "Bajísimo volumen (30 visitas), pero máxima intención de compra. Literalmente sus visitantes están buscando la 'mejor clínica en madrid' y haciendo clic en ellos al final de la primera página.",
    cost: "El coste de oportunidad es letal. Un paciente de injerto capilar en Madrid ronda los 4.000€ - 6.000€. Si 30 personas entran dispuestas a comprar y la web no las convierte al instante, están perdiendo hasta 100.000€ al mes en facturación potencial.",
    socialTraffic: "Casi nulo (27 backlinks). Sobreviven de milagro en la primera página gracias al algoritmo local de Google.",
    topPages: "El 100% de su tráfico de valor va a su Home directamente bajo búsquedas comerciales en Madrid.",
    competitors: "Están codeándose de milagro al final de la página 1 con Titanes corporativos como Capilclinic o Hospital Capilar, que invierten fortunas en marketing.",
    insights: "PITCH DIRECTO AL OWNER (Foco en el Valor Extremo de cada Visita y Cierre Agresivo):\n'He revisado Clínica Arbeláez a nivel técnico y tenéis algo insólito. Vuestra web tiene un volumen de visitas bajísimo, apenas 30 al mes. Cualquiera os diría que estáis mal, pero yo os digo que tenéis oro puro entre las manos. Estáis rankeando en Posición 9 para 'injertos capilares en Madrid', que supone 1.600 búsquedas al mes de la keyword con más intención de compra de España.\n\nEl problema es que estáis compitiendo con gigantes. Si uno de esos 30 usuarios semanales hace clic en vuestra web y se encuentra con un triste 'formulario de contacto' o un botón de WhatsApp al que le respondéis 2 horas después, ese usuario cierra, se va a Hospital Capilar y acaban de volar 5.000€ de vuestra caja.\n\nFase 1: Conversión militar de esas 30 visitas. Os instalo la IA de Retención Médica. El objetivo es que las 30 personas que entran este mes no salgan vivas sin dejaros una cita. El asistente les recibe como si fuerais una clínica VIP, les explica por qué sois 'la mejor' y les cierra fecha de valoración en el mismo chat mientras los gigantes aún les mandan correos automáticos cutres.\n\nFase 2: Usar el margen de esas ventas aseguradas para inyectarlo en SEO y subiros de la posición 9 a la 1, donde en vez de 30 visitas, tendréis 300.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dicen que ya tienen recepcionista o poco volumen: 'Exactamente por eso. Porque tenéis poco volumen es por lo que no os podéis permitir el lujo de dudar. Las grandes cadenas tienen recepcionistas y call centers de 50 personas para quemar leads genéricos. Vosotros tenéis pocos y son de altísima calidad en Madrid. Mi IA responde al nanosegundo como un consultor médico experto exclusivo, cortando el proceso de indecisión del cliente. Cada clic que perdéis hacia otra web os duele mucho más a vosotros que a ellos.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "arbelaez", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://www.clinicaarbelaez.com/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Arbeláez",
          slug: "clinicaarbelaez",
          industry: "Clínica Capilar",
          location: "Madrid",
          seoMetrics,
          websites: { create: { url: "http://www.clinicaarbelaez.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Arbeláez inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
