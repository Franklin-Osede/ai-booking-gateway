import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «Boutique Capilar en Sombra / Dependencia de Marca».\n\nRealidad Granular: Elite Medical Madrid tiene un tráfico muy modesto (593 visitas/mes) concentrado casi en exclusiva en 'Tráfico Navigacional' (búsquedas por la propia marca). Esto significa que viven de referidos y reputación previa, pero en captación de tráfico frío (nuevos pacientes que buscan 'injerto capilar madrid') están en la sombra. Su volumen no admite fugas.";
  const cost = "Fuga Crítica: El Cuello de Botella del Referido. Cuando el 80% de tus visitas te buscan por nombre y tienes muy poco volumen, significa que tu coste de adquisición de nuevos pacientes está estancado. Si una de esas 593 visitas entra porque escuchó hablar de vosotros, pero abandona la web porque no encontró cita o precio rápido, es una venta de miles de euros (implante) quemada en la puerta de la clínica.";
  const insights = "Equipo de Elite Medical Madrid. Vuestras métricas muestran un claro 'Efecto Boca a Boca': casi todo vuestro tráfico (593 visitas/mes) os busca por vuestro nombre. Eso indica una buena reputación, pero también un estancamiento en la captación de tráfico frío (el que busca el tratamiento, no la marca).\n\nEn este escenario de tráfico bajo pero altamente cualificado (alguien que te busca por tu nombre ya viene pre-vendido), tener un formulario de contacto pasivo es un riesgo enorme. \n\nNuestro Widget de IA se instala como un 'Concierge de Admisión Inmediata'. Si alguien os busca por recomendación y entra a la sección de Mesoterapia o Implante Capilar, el asistente no espera: «Hola. Si vienes recomendado a la clínica y quieres agendar una valoración capilar diagnóstica, puedo bloquearte una cita ahora mismo en la agenda del doctor. ¿Para cuándo te vendría bien?». \n\nTransformamos vuestro tráfico de referidos en citas cerradas 24/7 sin que se enfríen.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "elitemedicalmadrid"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "Bajo: 593 visitas/mes. La mayoría concentrado en la Home y búsquedas de marca.",
    topPages: "Top Tráfico (Marca): Home, Contacto, Artículos nicho sobre Mesoterapia y DHT.",
    competitors: "Compiten contra monstruos del marketing capilar en Madrid. Su baza es el trato VIP, que debe reflejarse en la IA.",
    socialTraffic: "Necesitan herramientas agresivas para convertir el escaso tráfico que tienen."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated elitemedicalmadrid");
  } else {
    await prisma.clinic.create({
      data: {
        name: "Elite Medical Madrid",
        slug: "elitemedicalmadrid",
        industry: "Medicina Capilar y Estética",
        seoMetrics: metrics,
        websites: { create: { url: "http://elitemedicalmadrid.es/" } }
      }
    });
    console.log("Created elitemedicalmadrid");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));
