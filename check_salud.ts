import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const clinics = await prisma.clinic.findMany({
    where: {
      OR: [
        { name: { contains: 'salud' } },
        { slug: { contains: 'salud' } }
      ]
    }
  });
  console.log(JSON.stringify(clinics, null, 2));
}
main().finally(() => prisma.$disconnect());
