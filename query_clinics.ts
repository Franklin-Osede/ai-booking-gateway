import { prisma } from './src/lib/prisma';

async function main() {
  const clinics = await prisma.clinic.findMany({ select: { name: true, slug: true }});
  console.log(clinics);
}
main().catch(console.error);
