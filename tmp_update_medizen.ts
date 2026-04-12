import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «El Laberinto Holístico / El Gurú Enciclopédico».\n\nRealidad Granular: Clínica Medizen goza de un tráfico excelente y en crecimiento (2.789 visitas/mes, DA 23). La marca personal del Prof. Liu Zheng es de tal autoridad que atrae miles de visitas a artículos muy específicos (hongos cordyceps, rayas en las uñas, piercing para migrañas). Es un pozo de sabiduría, pero muy fragmentado.\n";
  const cost = "Fuga Crítica: El Lector Hipocondríaco. Tienen un blog fantástico, pero el riesgo de los artículos informativos ('qué significan las rayas en las uñas') es que el usuario entra, se autodiagnostica, se asusta o se calma, y cierra la pestaña. Miles de visitas que consumen ancho de banda pero no pasan por caja. Si no hay un puente activo entre la lectura holística y la camilla de la clínica, el esfuerzo SEO es en vano.";
  const insights = "Equipo de Clínica Medizen e Instituto Liu Zheng. Vuestras gráficas señalan un SEO envidiable con casi 3.000 visitas mensuales. Sois una autoridad en Medicina Tradicional China y Acupuntura en Madrid.\n\nPero sufrir de 'Tráfico Enciclopédico' es peligroso. El visitante que entra a leer sobre 'hongo tremella' o el 'daith piercing para migrañas' suele buscar un remedio rápido, lee y se va. La web actual no pellizca a ese lector para convertirlo en paciente.\n\nNuestro Widget de IA se instala como un 'Traductor de Síntomas a Citas'. Si la IA detecta que el usuario lleva 2 minutos leyendo vuestro post sobre la relación entre emociones y órganos, emerge: «Hola. Entender cómo las emociones afectan a nuestros órganos es el primer paso. En la Clínica Medizen tratamos bloqueos energéticos a diario con acupuntura y PNI. ¿Te gustaría agendar una primera valoración diagnóstica para tratar el origen de tu síntoma?»\n\nDejamos de ser una enciclopedia gratuita y pasamos a ser un embudo de captación hiper-personalizado.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "medizen"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "Excelente: 2.789 visitas/mes. Gran diversidad de palabras clave de cola larga (long-tail). DA 23.",
    topPages: "Top Tráfico (Blog y Marca): Prof. Liu Zheng, hongos (cordyceps, tremella, etc.), migrañas, uñas.",
    competitors: "Compiten contra la medicina alopática y otros gurús holísticos. Su ventaja es el prestigio académico.",
    socialTraffic: "Tráfico orgánico muy potente e informativo, pero con alto riesgo de rebote si no hay interacción."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated medizen");
  } else {
    await prisma.clinic.create({
      data: {
        name: "Clínica MEDIZEN (Prof. Liu Zheng)",
        slug: "medizen",
        industry: "Medicina Tradicional China y Acupuntura",
        seoMetrics: metrics,
        websites: { create: { url: "http://clinicamedizen.es/" } }
      }
    });
    console.log("Created medizen");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));
