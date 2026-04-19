import { prisma } from './lib/prisma';
async function run() {
  console.log("🛠 Iniciando...");
  const wmg = await prisma.clinic.findFirst({ where: { slug: "wmglondon" }, include: { websites: true } });
  if (wmg) {
    for (const web of wmg.websites) {
      if (web.url.includes('hostinger') || web.url.includes('.brs')) {
        console.log(`🗑 Eliminando basura: ${web.url}`);
        await prisma.website.delete({ where: { id: web.id } });
      }
    }
    const rem = await prisma.website.findMany({ where: { clinicId: wmg.id } });
    if (!rem.some(w => w.url === "https://wmglondon.com")) {
      if (rem.length > 0) await prisma.website.update({ where: { id: rem[0].id }, data: { url: "https://wmglondon.com" } });
      else await prisma.website.create({ data: { clinicId: wmg.id, url: "https://wmglondon.com" } });
      console.log(`✅ Forzado y arreglado a https://wmglondon.com`);
    } else {
        console.log(`✅ wmglondon ya está saneado en base de datos.`);
    }
  } else {
      console.log(`⚠️ Clínica no encontrada.`);
  }
}
run();
