import { prisma } from "./src/lib/prisma";
async function main() {
  const clinic = await prisma.clinic.findFirst({where: {slug: "heira"}});
  if (clinic) {
    const ex: any = clinic.seoMetrics || {};
    ex.traffic = "570 visitas orgánicas / mes (Altamente cautivo y nominal)";
    ex.topPages = "Top Fuga: /listado-de-precios/ (Tráfico frío buscando 'hydrafacial precios' o 'láser co2 precio'). Rebote altísimo por falta de contexto médico.";
    ex.competitors = "Franquicias low-cost y centros estéticos puros (Láser2000, Centros Único) - El problema de competir por 'precio' en abierto a internet.";
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: ex}});
    console.log("Updated missing metrics for heira");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));