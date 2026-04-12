import { prisma } from './src/lib/prisma';
import { Prisma } from '@prisma/client';
async function main() {
  const clinicsToReset = await prisma.clinic.findMany({
    where: { 
      slug: { contains: 'micro' },
      NOT: { slug: 'micropigmentacioncapilarcadiz' }
    }
  });
  console.log(`Resetting: ${clinicsToReset.map(c => c.slug).join(', ')}`);
  for (const clinic of clinicsToReset) {
    await prisma.clinic.update({
      where: { id: clinic.id },
      data: { 
        // @ts-expect-error
        seoMetrics: Prisma.DbNull 
      }
    });
  }
  console.log('Done reverting.');
}
main().finally(() => prisma.$disconnect());
