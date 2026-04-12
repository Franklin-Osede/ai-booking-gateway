import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «El Páramo Digital / Cero Absoluto».\n\nRealidad Granular: Doctora Maroto presenta un escenario digital extremo. Su tráfico orgánico es literalmente cero (0 visitas al mes). Han desaparecido de Google, ranqueando solo por 1 keyword. Tienen un DA de 17, lo que indica que tuvieron vida en el pasado, pero actualmente sufren de abandono web severo o exclusión algorítmica.";
  const cost = "Fuga Crítica: Sangrado en Tráfico de Pago. Si el SEO es 0, cualquier persona que entre a esta web proviene o del boca a boca o de publicidad pagada (Ads). Si pagas decenas de euros por un lead en dermatología regenerativa y lo envías a una web fantasma con un formulario de la vieja escuela, estás tirando tu presupuesto de marketing a la basura porque el porcentaje de rebote destruirá tu ROI.";
  const insights = "Doctora Maroto. El análisis SEO muestra un escenario de 'Cero Absoluto': no recibís visitas orgánicas. Vuestra web actúa únicamente como una tarjeta de visita digital para quienes ya os conocen o para el tráfico que compráis mediante publicidad.\n\nCuando toda tu captación depende de tráfico pagado o redes sociales, cada visitante te cuesta dinero. Dejar que averigüen solos cómo contactar es un lujo prohibitivo.\n\nAquí es donde nuestra IA entra en juego como 'Retenedor de Tráfico Pagado'. No esperamos a que la usuaria navegue. Si acaba de hacer clic en tu anuncio de medicina regenerativa, la IA la recibe en la puerta: «Hola. Estás en la clínica de la Doctora Maroto. Los tratamientos de regeneración dermatológica requieren una valoración inicial precisa. Si lo deseas, puedo revisar la agenda de la doctora para bloquearte un espacio esta misma semana. ¿Qué te preocupaba de tu piel?». \n\nConvertimos la web en una máquina de agendar para amortizar el gasto en publicidad.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "doctoramaroto"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "Cero Absoluto: 0 visitas al mes en orgánico. Línea plana.",
    topPages: "Solo ranquean para 'clínica maroto'. Inexistentes para tráfico frío.",
    competitors: "Fuera de juego en la captación orgánica. Dependencia total de reputación offline o Ads.",
    socialTraffic: "Vital. Si no usan Ads o redes sociales, la web está muerta comercialmente."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated doctoramaroto");
  } else {
    await prisma.clinic.create({
      data: {
        name: "Doctora Maroto",
        slug: "doctoramaroto",
        industry: "Medicina Regenerativa Dermatológica",
        seoMetrics: metrics,
        websites: { create: { url: "http://doctoramaroto.com/" } }
      }
    });
    console.log("Created doctoramaroto");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));
