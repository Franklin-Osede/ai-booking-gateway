const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const existingClinics = await prisma.clinic.findMany({
    select: { name: true, websites: { select: { url: true } } },
    take: 50,
    orderBy: { createdAt: 'desc' }
  });
  console.log("Last 50 clinics added:");
  existingClinics.forEach(c => console.log(c.name, c.websites.map(w => w.url)));
}
main().finally(() => prisma.$disconnect());
