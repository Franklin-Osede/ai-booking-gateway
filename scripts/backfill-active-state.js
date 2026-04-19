/* eslint-disable no-console */
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const connectionString = process.env.DATABASE_URL || "";
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const clinics = await prisma.clinic.findMany({
    select: { id: true },
  });

  console.log(`Backfilling active state for ${clinics.length} clinics...`);

  for (const clinic of clinics) {
    await prisma.$transaction(async (tx) => {
      const latestWebsite = await tx.website.findFirst({
        where: { clinicId: clinic.id },
        orderBy: { updatedAt: "desc" },
      });
      if (latestWebsite) {
        await tx.website.updateMany({
          where: { clinicId: clinic.id, id: { not: latestWebsite.id } },
          data: { isActive: false },
        });
        await tx.website.update({
          where: { id: latestWebsite.id },
          data: { isActive: true },
        });
      }

      const latestBranding = await tx.branding.findFirst({
        where: { clinicId: clinic.id },
        orderBy: { updatedAt: "desc" },
      });
      if (latestBranding) {
        await tx.branding.updateMany({
          where: { clinicId: clinic.id, id: { not: latestBranding.id } },
          data: { isActive: false },
        });
        await tx.branding.update({
          where: { id: latestBranding.id },
          data: { isActive: true },
        });
      }
    });
  }

  const websitesWithoutActive = await prisma.clinic.count({
    where: {
      websites: {
        none: { isActive: true },
      },
    },
  });
  const brandingsWithoutActive = await prisma.clinic.count({
    where: {
      brandings: {
        none: { isActive: true },
      },
    },
  });

  console.log("Backfill completed.");
  console.log({ websitesWithoutActive, brandingsWithoutActive });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
