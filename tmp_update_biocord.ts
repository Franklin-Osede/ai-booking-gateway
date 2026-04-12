import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «El Imperio Caído / Ruina Algorítmica».\n\nRealidad Granular: Bio-Cord conserva una altísima autoridad (DA 33 y más de 12.000 backlinks), pero sus gráficas revelan un evento catastrófico reciente: una caída algorítmica masiva que ha desplomado su tráfico de varios miles a unas paupérrimas 78 visitas orgánicas al mes. Han pasado de ser líderes a buscar oxígeno.";
  const cost = "Fuga Crítica: El Coste de la Inacción en Tráfico Famélico. Cuando vendes un servicio de altísimo ticket (congelación de cordón umbilical) y tu embudo se queda vacío (78 visitas), depender de que la usuaria navegue, lea pasivamente y busque por voluntad propia un formulario de contacto es un suicidio empresarial. Cada visita que cierra la pestaña hoy duele 100 veces más que hace un año.";
  const insights = "Equipo directivo de Bio-Cord. El análisis de vuestras gráficas duele: habéis sufrido el impacto frontal de una actualización algorítmica de Google. Una caída brutal de tráfico que os ha dejado con menos de 100 visitas orgánicas al mes.\n\nCuando estás en un 'escenario de tráfico famélico' vendiendo un servicio premium y vital (preservación de células madre), no puedes permitirte el lujo de tener una web pasiva. \n\nNuestro Widget de IA se instala como un 'Protocolo de Intercepción Agresiva'. El asistente no espera a que la embarazada busque dónde contactar. En cuanto entra a leer sobre 'gelatina de wharton' o 'precios', la IA emerge de inmediato: «Hola. Preservar las células madre del cordón es una decisión crítica y de tiempo limitado (solo en el parto). ¿Te gustaría que te agende ahora mismo una llamada gratuita con un asesor médico para evaluar si nuestro servicio encaja con los plazos de tu embarazo?».\\n\nEl objetivo no es el SEO a corto plazo, es exprimir al máximo el ratio de conversión del tráfico residual que os queda para mantener la facturación a flote.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "biocord"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "Extrema Pobreza: 78 visitas al mes. (Gráfica muestra una caída vertical, penalización SEO severa). DA altísimo de 33.",
    topPages: "Top Tráfico (Residual): Gelatina de wharton, cómo vestir a un recién nacido (informacional genérico).",
    competitors: "Están perdiendo la guerra digital actual frente a bancos de células madre más proactivos o sin penalizaciones funcionales.",
    socialTraffic: "Dependen críticamente ahora del tráfico de pago o social, porque el orgánico ha muerto."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated biocord");
  } else {
    await prisma.clinic.create({
      data: {
        name: "Bio-Cord",
        slug: "biocord",
        industry: "Medicina Regenerativa (Cordón Umbilical)",
        seoMetrics: metrics,
        websites: { create: { url: "http://bio-cord.es/" } }
      }
    });
    console.log("Created biocord");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));
