import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «El Cohete de Alta Autoridad / Cirugía VIP».\n\nRealidad Granular: Demya (alianza Martín del Yerro - Amselem - Picó) no es una clínica más, es una firma de alto prestigio en Cirugía Plástica y Estética. Su gráfica SEO muestra un crecimiento vertical agresivo (de estancado a +5.000 visitas al mes en medio año). Tienen una autoridad de marca brutal ('famosas operadas por martin del yerro', tickets altísimos en cirugías complejas y aparatología premium como Emsculpt o Endolifting).";
  const cost = "Fuga Crítica: El Paciente VIP Desatendido por Fricción. Demya atrae búsquedas de intención de compra de muy alto ticket (Cirugías de 6k-10k€, Endolifting). El problema del crecimiento rápido del tráfico es que se mezcla el paciente premium dispuesto a pagar con una masa de curiosos preguntando 'cuánto cuesta'. Si vuestros canales de contacto habituales obligan al paciente VIP a hacer cola, rellenar formularios pasivos o chatear con un bot tonto, la percepción 'Premium' se rompe. El paciente de lujo exige inmediatez y exclusividad.";
  const insights = "Equipo directivo de DEMYA. Vuestra gráfica de tráfico es un cohete: acabáis de romper los 5.000 visitantes mensuales. Os habéis consolidado como el referente top con cirugías mayores y tratamientos como Endolifting o Emsculpt.\n\nPero cuidado: cuando un cliente Premium entra a vuestra web atraído por el renombre de Martín del Yerro, espera el mismo nivel de trato ('Guante Blanco') que tendría cruzando la puerta en Paseo de la Habana.\n\nNuestro Widget de Inteligencia Artificial actúa como el *Conserje Digital VIP*. Atiende en un milisegundo al visitante interesado en 'Lifting Cervicofacial' o 'Mia Femtech', pre-cualifica su perfil inversor de forma conversacional y elegante, y agenda directamente la cita para los coordinadores médicos. Garantizáis exclusividad 24/7 y filtráis al 'curioso' del verdadero cliente de lujo.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "demya"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "5.216 visitas/mes. Crecimiento vertical reciente tremendo. Trafico de altísima intención y ticket elevado.",
    topPages: "Top Fugas: Landings informacionales de alto valor pero alta duda (/emsculpt..., /endolifting-facial...) donde el usuario necesita validación antes de dar el paso.",
    competitors: "Compiten por el sector del lujo y prestigio (Clínica Planas, Quirón alta especialización). La percepción VIP digital es innegociable.",
    socialTraffic: "Elevadísima autoridad de marca. Muchos leads entran buscando directamente a sus cirujanos estrella."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated demya");
  } else {
    await prisma.clinic.create({
      data: {
        name: "DEMYA (Martín del Yerro)",
        slug: "demya",
        industry: "Cirugía Plástica Exclusiva",
        seoMetrics: metrics,
        websites: { create: { url: "http://demya.com/" } }
      }
    });
    console.log("Created demya");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));
