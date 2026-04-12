import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «El Agujero Negro Informativo / El Gigante Nacional».\n\nRealidad Granular: Clínica Londres es un transatlántico del SEO en España. Atráeis decenas de miles de visitas. Sin embargo, un análisis detallado revela que el grueso absoluto de vuestro tráfico proviene de vuestro blog corporativo con preguntas genéricas como '¿Duele la depilación láser?' o '¿Qué es la cavitación?'.\n\nMientras tanto, la ficha técnica de la Clínica de Valencia apenas recaba 213 visitas mensuales orgánicas. Vuestro dominio atrae a toda España a leer, pero la sucursal local está desconectada de ese boom.";
  const cost = "Fuga Crítica: El problema de ser la 'Wikipedia de la Cirugía Estética' es que educáis gratis al paciente español sin forzar la venta local. Alguien en Valencia lee sobre las bolas de Bichat en vuestro blog, satisface su curiosidad, y acaba yéndose a otra clínica porque el artículo no le cerró la venta.";
  const insights = "Equipo directivo de Clínica Londres, hemos pasado vuestro mastodóntico perfil por nuestro analizador y sois claramente un «Agujero Negro Informativo».\n\nTenéis un tráfico nacional envidiable, pero la conversión hacia clínicas locales (como la de Valencia, con solo 213 visitas propias) es la gran fuga. Miles de personas leen vuestros artículos a diario y se van sin dejar ni un contacto.\n\nNuestra IA se despliega como el «Enrutador Nacional». Si alguien lee un artículo desde Valencia, la IA le salta: «Veo que te estás informando sobre los efectos de la cavitación. Precisamente tenemos hueco esta semana en nuestra Clínica Londres de Valencia para que te hagamos un test presencial gratuito. ¿Quieres que te pase a la agenda de la doctora?»\n\nDejamos de ser una enciclopedia gratuita para convertirnos en un embudo implacable.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "clinicalondres"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "+20.000 visitas/mes (Nivel España / Blog Múltiple). Sucursal Valencia: 213 visitas/mes.",
    topPages: "Top Fugas: /blog/celulitis-..., /blog/depilacion... - Generando visitas de toda España que solo leen y se marchan (alto rebote informacional).",
    competitors: "Franquicias Nacionales (Dorsia, Clínicas Diego de León). Guerra masiva de contenidos.",
    socialTraffic: "Tráfico secundario impulsado fuertemente por Paid y Redes para apoyar la apertura de sedes."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated clinicalondres");
  } else {
    await prisma.clinic.create({
      data: {
        name: "Clínica Londres",
        slug: "clinicalondres",
        industry: "Medicina y Cirugía Estética",
        seoMetrics: metrics,
        websites: { create: { url: "http://www.clinicalondres.es/" } }
      }
    });
    console.log("Created clinicalondres");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));
