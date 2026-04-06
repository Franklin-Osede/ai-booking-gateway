const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const clinic = await prisma.clinic.findFirst({ where: { slug: "clinicaciro" } });
  console.log(clinic);
}
main();
