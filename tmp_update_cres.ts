import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «El Monstruo Informacional / Tráfico Desviado».\n\nRealidad Granular: Clínicas Cres tiene unos números masivos (Casi 10.000 visitas al mes y DA 37). Sin embargo, un análisis de sus keywords revela que el 90% de ese tráfico es de bajísima intención de compra: ranquean top 3 por 'qué es la kombucha', 'funcionamiento de los músculos' o 'agua de mar'. Tienen un blog de salud enorme que atrae a estudiantes y curiosos, inflando las métricas de vanidad pero diluyendo el enfoque clínico.";
  const cost = "Fuga Crítica: La Fricción por Tráfico Basura. Con 10.000 visitantes mensuales, el equipo de ventas o el sistema de reservas colapsa o pierde eficiencia intentando filtrar al estudiante que hace un trabajo sobre el 'estrógeno' del verdadero paciente dispuesto a pagar un tratamiento biológico de artrosis o criolipólisis. El lead real de alto ticket se pierde en el ruido de una web enciclopédica.";
  const insights = "Equipo directivo de Clínicas Cres. Vuestro SEO es un cañón absoluto (10.000 visitas/mes, casi 3.000 keywords). Es un activo invaluable. Sin embargo, estáis sufriendo el 'Síndrome de Wikipedia'. Miles de personas entran al mes buscando 'propiedades de la kombucha' o 'caldo de huesos'. \n\nEsto significa que los leads de alto ticket que buscan 'Medicina regenerativa artrosis' se pierden en una web que parece más una revista de salud que un embudo quirúrgico.\n\nNuestro Widget de IA actúa como un 'Filtro Quirúrgico de Conversión'. Ignora al curioso que busca recetas, pero *salta al cuello* del usuario que entra a la sección de test genéticos o medicina articular: «Hola, veo que te interesa frenar la artrosis degenerativa con medicina regenerativa. Es la especialidad de la clínica, ¿te agendo una teleconsulta de triaje médico?». \n\nSeparamos la paja del oro, blindando el tiempo de vuestro equipo y subiendo el ticket medio del paciente agendado.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "clinicascres"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "Alto: 9.816 visitas/mes. DA 37 (Excelente). Curva de tráfico con pico pasado de 30k, estabilizandose en 10k.",
    topPages: "Top Tráfico (Baja intención): 'propiedades de la kombucha', 'cómo funcionan los músculos', 'estrógenos'. Fugas puras.",
    competitors: "Tienen autoridad para dominar el mercado, pero su propio contenido despista al algoritmo de conversión.",
    socialTraffic: "Generan mucho contenido, pero el reto es transformar al seguidor/lector en paciente de tratamientos biológicos/estéticos."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated clinicascres");
  } else {
    await prisma.clinic.create({
      data: {
        name: "Clínicas CRES",
        slug: "clinicascres",
        industry: "Medicina Regenerativa y Estética",
        seoMetrics: metrics,
        websites: { create: { url: "http://clinicascres.com/" } }
      }
    });
    console.log("Created clinicascres");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));
