const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const deleted = await prisma.clinic.deleteMany({
    where: {
      name: 'Canarias',
      location: null
    }
  });
  console.log(`Borradas ${deleted.count} clínicas erróneas con nombre 'Canarias'`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
