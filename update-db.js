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
  console.log("Looking for info-mncapilar...");
  const clinic = await prisma.clinic.findFirst({
    where: { slug: 'info-mncapilar' },
    include: { websites: true }
  });

  if (clinic) {
    if (clinic.websites.length === 0) {
      await prisma.website.create({
        data: {
          url: 'https://info.mncapilar.com/',
          clinicId: clinic.id
        }
      });
      console.log('Website added for info-mncapilar');
    } else {
       // update it
      await prisma.website.update({
         where: { id: clinic.websites[0].id },
         data: { url: 'https://info.mncapilar.com/' }
      });
      console.log('Website updated for info-mncapilar');
    }
  } else {
    console.log('Clinic info-mncapilar NOT FOUND!');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
