import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «El Imperio Caído / El Superviviente de Tráfico».\n\nRealidad Granular: Los datos históricos de Clínica Fontana muestran una hemorragia crítica: una caída masiva del 90% de su tráfico orgánico en apenas un año (de picos de +15.000 visitas a estar estancados en 1.855 visitas/mes). Actualmente, sobreviven a base del reconocimiento de marca pura ('Clinica Fontana') y nichos informacionales médicos, especialmente el diagnóstico del Lipedema ('¿Cómo sé si tengo Lipedema?').";
  const cost = "Fuga Crítica: Cuando pierdes el 90% del tráfico frío que te llenaba las agendas, cada visita que aterriza vale oro. Su mayor imán actual de pacientes nuevos es un artículo sobre Lipedema. Un usuario aterriza con miedo o dudas sobre sus piernas, lee la lista de síntomas en el blog de Fontana, se diagnostica a sí mismo frente a la pantalla, y cierra la pestaña. Al no haber un mecanismo de 'captura o triaje' inmediato, están dejando escapar a un paciente altamente preocupado y cualificado.";
  const insights = "Equipo de Clínica Fontana, hemos analizado vuestro histórico y hay que actuar con urgencia quirúrgica. Vuestra gráfica de atracción orgánica ha sufrido un colapso masivo en el último año. Ahora mismo, el tráfico frío no os sobra.\n\nEsto significa que la 'Tasa de Conversión' tiene que ser perfecta. Vuestro principal embudo de entrada hoy son pacientes buscando síntomas de Lipedema.\n\nNuestra IA se instala directamente en ese artículo como un «Triaje Médico Virtual». La paciente está leyendo los síntomas y la IA le salta: 'Hola, veo que te estás informando sobre el Lipedema. Si lo deseas, puedo hacerte tres preguntas rápidas de evaluación y, si lo necesitas, te agendo directamente una valoración especializada con nuestros cirujanos vasculares para salir de dudas'.\n\nNo podéis permitiros que el poco tráfico frío que entra a informarse se vaya a la competencia porque no sintieron un apoyo inmediato.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "clinicafontana"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "1.855 visitas/mes (Caída dramática del 90% interanual desde su pico de 15.000 visitas mensuales).",
    topPages: "Top Fugas: /como-se-si-tengo-lipedema/ - Tráfico informacional en fase de miedo/diagnóstico que rebota sin atención.",
    competitors: "En su época dorada competían con los gigantes de Valencia (Sanchis Cardona, Alberto Marina), hoy sufren por el algoritmo.",
    socialTraffic: "Presión alta en redes y SEM obligatoria para compensar la masiva sequía de captación SEO reciente."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated clinicafontana");
  } else {
    await prisma.clinic.create({
      data: {
        name: "Clínica Fontana",
        slug: "clinicafontana",
        industry: "Cirugía y Medicina Estética",
        seoMetrics: metrics,
        websites: { create: { url: "http://clinicafontana.com/" } }
      }
    });
    console.log("Created clinicafontana");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));
