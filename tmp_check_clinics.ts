import { prisma } from "./src/lib/prisma";
async function main() {
  const clinics = await prisma.clinic.findMany();
  const results = [];
  for(const c of clinics) {
    const metrics: any = c.seoMetrics || {};
    const summary = metrics.summary || "";
    results.push({ slug: c.slug, length: summary.length, needsUpdate: summary.length < 50 });
  }
  console.table(results);
}
main().then(()=>console.log("Done")).catch(console.error);