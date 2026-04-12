/* eslint-disable */
require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const clinics = await prisma.clinic.findMany({
    where: { slug: { in: ['nbscience', 'doctoramaroto'] } }
  });
  console.log("Clinics found via Prisma:", clinics.length, clinics.map(c => c.slug));
}

main().catch(console.error).finally(() => prisma.$disconnect());
