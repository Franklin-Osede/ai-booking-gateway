import { prisma } from "./src/lib/prisma";
import fs from "fs";
async function main() {
  const data = JSON.parse(fs.readFileSync("./tmp_data.json", "utf8"));
  for(const d of data) {
    const clinic = await prisma.clinic.findFirst({where: {slug: d.slug}});
    if(clinic) {
      const ex: any = clinic.seoMetrics || {};
      ex.summary = d.summary; ex.cost = d.cost; ex.insights = d.insights;
      await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: ex}});
      console.log("Updated", d.slug);
    }
  }
}
main().then(() => console.log("Done")).catch(console.error);