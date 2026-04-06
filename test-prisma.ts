import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const c = await prisma.clinic.findFirst({ where: { slug: 'clinicaciro' } });
  console.log(JSON.stringify(c, null, 2));
}
check().finally(() => prisma.$disconnect());
