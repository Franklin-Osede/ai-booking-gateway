import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «El Laboratorio de Biohacking / Fuga del Lector Científico».\n\nRealidad Granular: Stem Beauty opera en el ultra-nicho de la Longevidad y Medicina Regenerativa. Ranquean por términos muy inusuales ('Test DUTCH', 'molécula NAD+', 'fuerza de agarre'). Su problema radica en el volumen: apenas tienen 64 visitas al mes (unas 2 visitas diarias) y una Autoridad de Dominio 3. Están publicando contenido científico de altísimo nivel, pero su volumen de tráfico es microscópico.";
  const cost = "Fuga Crítica: El Síndrome de la Revista Científica. Sus principales páginas de captura son post de blogs hiper-técnicos (Ej. 'El NAD+: ¿Por qué medir los niveles...'). Atrapan tráfico hiper-informacional ('Biohackers' o curiosos de la longevidad). Si este lector lee un artículo complejo y no hay una intervención proactiva para aterrizarlo a la realidad clínica (hacerle ver que PUEDE comprar ese test en la clínica), cerrará la pestaña. El 99% de esas visitas se pierde por falta de un Call to Action conversacional.";
  const insights = "Equipo de Stem Beauty y Dra. Ángela Ojeda. Vuestro enfoque en Medicina Regenerativa y Longevidad (NAD+, Test Dutch) es espectacular y de altísimo ticket. Pero vuestro SEO actual (64 visitas al mes) apenas trae a 2 personas al día, y encima entran a artículos de blog muy densos.\n\nAhora mismo funcionáis como una revista científica: la gente entra, se educa sobre la molécula NAD+ y se va. \n\nNuestro Widget de IA se instala en esos artículos como un 'Asesor de Biohacking'. Si alguien lee sobre la fuerza de agarre o el NAD+, el asistente emerge: «Veo que eres consciente de la importancia del NAD+ para la longevidad celular. Nosotros realizamos estos protocolos intravenosos diarios. ¿Te gustaría agendar una valoración rápida con la Dra. Ojeda para ver si eres candidato/a?». \n\nTransformamos vuestra biblioteca de artículos en una máquina automática de reserva de pacientes premium.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "stembeauty"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "Extremadamente bajo: 64 visitas/mes (2 diarias). Autoridad de Dominio 3. Fase Semilla total.",
    topPages: "Top Fugas: Posts informativos del Blog ('El NAD+', 'Analítica Completa', 'Test de fuerza'). Tráfico que lee y rebota si no se le incita a comprar.",
    competitors: "Pioneros en nicho. Compiten más contra el desconocimiento del mercado que contra otras clínicas de estética tradicional.",
    socialTraffic: "Vital. Con este bajo volumen orgánico, si sus leads no vienen de Instagram de forma proactiva, no hay facturación online real."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated stembeauty");
  } else {
    await prisma.clinic.create({
      data: {
        name: "Stem Beauty (Dra. Ángela Ojeda)",
        slug: "stembeauty",
        industry: "Longevidad y Biohacking",
        seoMetrics: metrics,
        websites: { create: { url: "http://stembeauty.net/" } }
      }
    });
    console.log("Created stembeauty");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));
