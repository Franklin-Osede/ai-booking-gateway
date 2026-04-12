import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «El Menú de Restaurante / El Escaparate de Precios».\n\nRealidad Granular: Clínica Heira tiene un volumen sano de 570 visitas, pero el 90% llega anclado a su nombre propio (`heira`, `clínica heira`, `ignacio torres`).\n\nLo fascinante y peligroso es su estrategia técnica: Tienen una única URL (`/listado-de-precios/`) rankeando para docenas de palabras clave híper-transaccionales (`láser co2 precio`, `hydrafacial precios`, `radiesse precio`, `endolifting papada precio`). Estáis atrayendo tráfico para mirar precios como si fuerais la carta de un restaurante.";
  const cost = "Fuga Crítica: Exponer un «Listado de Precios» puro a tráfico frío en internet destruye el ratio de conversión de alto ticket. El paciente busca `láser manchas cara precio`, entra a vuestra web, ve un número frío en una lista, no entiende el valor médico detrás de ese precio, se asusta o lo compara con un centro estético barato, y cierra la pestaña.\n\nEstáis mercantilizando a vuestros excelentes doctores y perdiendo consultas que, con una buena labia, se habrían cerrado.";
  const insights = "Equipo directivo de Clínica Heira, hemos radiografiado vuestra agresiva estrategia SEO. Vuestro diagnóstico perfila el arquetipo del «Menú de Restaurante».\n\nEstáis atrayendo curiosidad hacia vuestra página de `/listado-de-precios/` para tratamientos como Hydrafacial, Radiesse o Láser CO2. El problema comercial es que publicar tarifas planas en internet sin defensa clínica espanta al paciente premium. Ven un número, lo comparan con la franquicia low-cost de turno, y abandonan la web sin llamar.\n\nHeira no es un supermercado, es dermatología avanzada. Nuestra IA se inyecta en esa URL de precios para actuar como «Defensor de Valor Médico».\n\nCuando alguien entra al listado buscando el precio del láser vascular, la IA le bloquea sutilmente la huida: «Entiendo que estás revisando nuestras tarifas de láser vascular o CO2. Ten en cuenta que en Heira los precios garantizan aparatología de punta y manos médicas. Para darte un presupuesto 100% exacto a tus lesiones, el Doctor Torres ofrece valoraciones pre-diagnósticas. ¿A qué número puedo llamarte para darte disponibilidad?»\n\nCerremos ventas por autoridad, no por guerra de precios.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "heira"}});
  if (clinic) {
    const ex: any = clinic.seoMetrics || {};
    ex.summary = summary; ex.cost = cost; ex.insights = insights;
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: ex}});
    console.log("Updated heira");
  } else {
    await prisma.clinic.create({
      data: {
        name: "Heira",
        slug: "heira",
        industry: "Medicina Estética",
        seoMetrics: { summary, cost, insights },
        websites: { create: { url: "http://heira.es" } }
      }
    });
    console.log("Created heira");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));