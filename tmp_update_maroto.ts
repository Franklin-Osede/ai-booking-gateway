import { prisma } from "./src/lib/prisma";

async function main() {
  const summary = "Arquetipo: «El Secano Algorítmico / Caída Absoluta».\n\nRealidad Granular: Los datos de Doctora Maroto muestran un evento catastrófico en su visibilidad orgánica. Tuvieron un tráfico decente hasta mediados de 2024, pero una serie de actualizaciones de Google han desplomado su tráfico a literalmente 0 visitas orgánicas y con 1 sola keyword posicionada marginalmente. Han desaparecido del mapa para el tráfico frío.";
  
  const cost = "Fuga Crítica: El Coste de Depender Exclusivamente del Boca a Boca. Al no tener flujo de tráfico SEO, la clínica está operando a puerta cerrada en el entorno de búsquedas. El 100% de las visitas que llegan ahora provienen de referidos (boca a boca) o esfuerzo desgastante en redes sociales. Si un usuario llega a la web producto de un esfuerzo en Instagram y no encuentra una vía rápida, interactiva y resolutiva para agendar, el desperdicio del lead es total. La web actual no convierte; es un folleto estático en un desierto.";
  
  const insights = "Equipo de la Doctora Maroto. Hemos analizado vuestras gráficas de rendimiento digital y el diagnóstico es muy crudo: habéis sufrido una caída masiva y el tráfico orgánico se ha ido a 0.\n\nEn un escenario donde habéis perdido el motor de búsquedas de Google, depender de una web tradicional pasiva es un lujo que no os podéis permitir. \n\nAhora mismo dependéis de que vuestro tráfico social o de pacientes referidos naveguen solos para intentar encontrar cómo pedir cita, y el riesgo de abandono es extremo. Nuestro Asistente Médico con IA actúa como un 'Torniquete de Conversión'. Se instala en su web y aborda proactivamente a ese escaso y valioso tráfico cualificado que os queda: «Hola, bienvenida a la clínica de la Doctora Maroto. ¿Buscas información sobre algún tratamiento de medicina regenerativa o capilar, o prefieres que agende una cita con nosotras directamente?». \n\nNo estamos aquí para venderos ilusión SEO. Estamos aquí para instalar una urgencia: un sistema que exprima hasta la última gota de cada visitante que consigáis por redes o boca a boca, asegurando que se convierta en una reserva firme para la doctora.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "doctoramaroto"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "En Caída Libre hacia el Nulo Absoluto: 0 visitas orgánicas registradas actualmente. Gráfica en declive vertical desde 2024. DA bajo-medio (17) y 368 Backlinks que no empujan tráfico real.",
    topPages: "Virtualmente nulo. La única keyword que sobrevive a nivel muy precario es 'clínica maroto' (pos 11, volumen 140, visitas 0).",
    competitors: "Están perdiendo la partida en búsquedas locales frente a clínicas de dermatología regenerativa y capilar que sí mantienen tracción orgánica.",
    socialTraffic: "Dado que el SEO está destruido en un 100%, la dependencia de campañas de pago o redes sociales (Instagram/Facebook) pasa a ser vital y su tráfico orgánico/social allí debe protegerse como oro en paño."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated doctoramaroto");
  } else {
    await prisma.clinic.create({
      data: {
        name: "Doctora Maroto",
        slug: "doctoramaroto",
        industry: "Medicina Regenerativa en Dermatología",
        seoMetrics: metrics,
        websites: { create: { url: "http://doctoramaroto.com/" } }
      }
    });
    console.log("Created doctoramaroto");
  }
}

main().catch(console.error).finally(()=>console.log("Done"));
