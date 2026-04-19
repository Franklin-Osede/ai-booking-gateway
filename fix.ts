import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  console.log("Starting...");
  const wmg = await prisma.clinic.findFirst({ where: { slug: "wmglondon" }, include: { websites: true } });
  if (wmg) {
    for (const web of wmg.websites) {
      if (web.url.includes('hostinger') || web.url.includes('.brs')) {
        console.log(`Deleting invalid: ${web.url}`);
        await prisma.website.delete({ where: { id: web.id } });
      }
    }
    const rem = await prisma.website.findMany({ where: { clinicId: wmg.id } });
    const targetUrl = "https://wmglondon.com";
    if (!rem.some(w => w.url === targetUrl)) {
      if (rem.length > 0) {
        await prisma.website.update({ where: { id: rem[0].id }, data: { url: targetUrl } });
      } else {
        await prisma.website.create({ data: { clinicId: wmg.id, url: targetUrl } });
      }
      console.log(`Updated to ${targetUrl}`);
    }
  }
  console.log("Done.");
}
run();
