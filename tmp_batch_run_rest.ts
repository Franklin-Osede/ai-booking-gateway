import { prisma } from "./src/lib/prisma";
import fs from "fs";
async function main() {
  const data = JSON.parse(fs.readFileSync("./tmp_data_rest.json", "utf8"));
  for(const d of data) {
    const clinic = await prisma.clinic.findFirst({where: {slug: d.slug}});
    if(clinic) {
      const ex: any = clinic.seoMetrics || {};
      ex.summary = d.summary; ex.cost = d.cost; ex.insights = d.insights;
      await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: ex}});
      console.log("Updated", d.slug);
    } else {
      await prisma.clinic.create({
        data: {
          name: d.slug.toUpperCase(),
          slug: d.slug,
          industry: "Medicina Estética",
          seoMetrics: { summary: d.summary, cost: d.cost, insights: d.insights },
          websites: { create: { url: "http://" + d.slug + ".com" } }
        }
      });
      console.log("Created", d.slug);
    }
  }
}
main().then(() => console.log("Done")).catch(console.error);