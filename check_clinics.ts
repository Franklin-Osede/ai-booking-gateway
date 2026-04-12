import { prisma } from './src/lib/prisma';
async function main() {
  const clinics = await prisma.clinic.findMany({
    where: { OR: [{ slug: { contains: 'sanlucar' } }, { slug: { contains: 'panno' } }, { slug: { contains: 'micro' } }, { slug: { contains: 'jerez' } }, { slug: { contains: 'drpelo' } }] },
    select: { id: true, name: true, location: true, slug: true }
  });
  console.log(clinics);
}
main().finally(() => prisma.$disconnect());
