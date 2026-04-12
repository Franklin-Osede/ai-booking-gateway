import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «El Especialista de Nicho Íntimo / La Bóveda de Privacidad».\n\nRealidad Granular: Clínica Maysoon tiene un tráfico muy sano de 1.152 visitas orgánicas/mes, pero lo fascinante es su perfil de palabras clave. Están dominando un nicho de altísimo ticket y altísimo pudor: la estética íntima masculina (\"escrotox\", \"engrosamiento peneano ácido hialurónico\", \"tricopigmentación\", \"microblading hombre\"). Tienen un posicionamiento brutal en tratamientos que otras clínicas ni tocan.";
  const cost = "Fuga Crítica: El paciente que busca 'engrosamiento peneano antes y después' o 'escrotox' tiene un nivel de pudor extremo. Atráeis a cientos de hombres con este perfil a la web, pero el embudo falla en la pasarela de contacto. Cientos de ellos jamás descolgarán el teléfono para decir 'hola, llamo por el escrotox' a una recepcionista. Abandono brutal de leads de alto valor por simple vergüenza o falta de anonimato en el 'primer toque'.";
  const insights = "Equipo directivo de Clínica Maysoon, vuestro posicionamiento en medicina estética masculina e íntima es una mina de oro (1.152 visitas al mes muy nichadas), pero estáis perdiendo conversiones masivas por culpa del 'Pudor Telefónico'.\n\nNuestra IA funciona aquí como un «Asistente Clínico de Privacidad Absoluta». Es decir, un hombre entra buscando 'engrosamiento peneano', y el widget salta empáticamente: «Hola, soy el asistente médico virtual de Maysoon. Puedes realizarme cualquier consulta sobre el procedimiento de ácido hialurónico con total discreción, sin juicios. ¿Quieres que hagamos una evaluación previa y te agende una cita médica privada?»\n\nEl paciente varón interactúa infinitamente más con una IA (por el anonimato) que con una persona humana en este tipo de consultas. Vas a transformar vuestro rincón de SEO masculino en una máquina de agendas seguras.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "clinicamaysoon"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "1.152 visitas orgánicas / mes (Altamente nichificado en Medicina Estética Masculina e Íntima).",
    topPages: "Top Fugas: /escrotox/, /engrosamiento-de-pene.../ - Tráfico masculino de altísimo valor que requiere un contacto ultra-discreto.",
    competitors: "Pioneros en el nicho. Compiten tangencialmente con Institutos Urológicos, pero lideran la vertiente estética.",
    socialTraffic: "Tráfico discreto en orgánico social por las restricciones de contenido médico/íntimo de Meta, lo que hace el tráfico SEO el doble de valioso."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated clinicamaysoon");
  } else {
    await prisma.clinic.create({
      data: {
        name: "Clínica Maysoon",
        slug: "clinicamaysoon",
        industry: "Medicina Estética y Cirugía",
        seoMetrics: metrics,
        websites: { create: { url: "http://www.clinicamaysoon.com/" } }
      }
    });
    console.log("Created clinicamaysoon");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));
