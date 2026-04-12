import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «La Autoridad de Nicho / El Paciente Analítico».\n\nRealidad Granular: ITRT muestra un SEO ascendente y envidiable. Aunque el volumen parece modesto (641 visitas/mes), es oro puro. Atráen búsquedas exactas sobre patologías dolorosas complejas: 'cómo regenerar tendón rotuliano', 'células madre artrosis' o 'pseudoartrosis'. Es un paciente que padece un fuerte dolor y busca, por encima de todo, evitar el quirófano.";
  const cost = "Fuga Crítica: Parálisis por Exceso de Análisis. El perfil de vuestro paciente lee vuestros artículos médicos intentando entender si tiene solución. Si la web es puramente enciclopédica y clínica, el paciente lee, se satura de información densa sobre 'células mesenquimales', y se va a 'pensárselo'. Cada visitante que se va por miedo o duda es un tratamiento de miles de euros perdido en el momento de mayor esperanza del paciente.";
  const insights = "Equipo de ITRT. Vuestra gráfica muestra un crecimiento SEO muy sano, captando a decenas de pacientes cualificados cada día. Las búsquedas que interceptáis ('regeneración de isquiotibiales', 'artrosis rodilla') reflejan a pacientes en dolor continuo que buscan alternativas a la prótesis o la cirugía tradicional.\n\nEste es el típico paciente analítico. Lee mucho antes de contactar.\n\nAquí entra la IA. La configuramos como un 'Asistente de Triaje Empático'. Si detecta que un paciente lleva varios minutos leyendo sobre la pseudoartrosis o las ventajas del PRP, la IA da el paso: «Hola. Entiendo que sufrir dolores articulares es limitante y buscar alternativas a la cirugía es difícil. Revisamos diariamente historiales similares con excelentes resultados biológicos. ¿Te gustaría que agenciemos una cita para que nuestros doctores valoren directamente tus pruebas por imagen?». \n\nConvertimos la indecisión del paciente analítico en una consulta clínica cerrada.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "itrt"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "Sano y Creciente: 641 visitas/mes. Gráfica en ascenso histórico sostenido. DA 14.",
    topPages: "Top Tráfico (Intención Crítica): 'Regenerar tendón rotuliano', 'Tratamiento artrosis con células madre'.",
    competitors: "Ganan la batalla del nicho médico avanzado. El reto es ablandar la fachada clínica para la conversión.",
    socialTraffic: "Tráfico SEO altamente resolutivo e intencional. No dependen de redes."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated itrt");
  } else {
    await prisma.clinic.create({
      data: {
        name: "ITRT (Instituto Terapia Regenerativa Tisular)",
        slug: "itrt",
        industry: "Medicina Regenerativa Tisular y Traumatología",
        seoMetrics: metrics,
        websites: { create: { url: "http://itrt.es/" } }
      }
    });
    console.log("Created itrt");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));
