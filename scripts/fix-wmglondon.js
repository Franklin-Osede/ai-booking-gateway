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

function normalizeUrl(url) {
  const trimmed = (url || "").trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

async function main() {
  const slug = "wmglondon";
  const canonicalUrl = "https://wmglondon.com";

  const clinic = await prisma.clinic.findFirst({
    where: { slug },
    include: {
      websites: { orderBy: { updatedAt: "desc" } },
      brandings: { orderBy: { updatedAt: "desc" } },
    },
  });

  if (!clinic) {
    throw new Error(`Clinic not found for slug=${slug}`);
  }

  await prisma.$transaction(async (tx) => {
    const toDeleteIds = clinic.websites
      .filter((w) => {
        const val = (w.url || "").toLowerCase();
        return val.includes("hostinger") || val.endsWith(".brs") || val.includes(".brs/");
      })
      .map((w) => w.id);

    if (toDeleteIds.length) {
      await tx.website.deleteMany({
        where: { id: { in: toDeleteIds } },
      });
      console.log(`Deleted ${toDeleteIds.length} deprecated website rows`);
    }

    const existing = await tx.website.findFirst({
      where: { clinicId: clinic.id },
      orderBy: { updatedAt: "desc" },
    });

    let activeWebsiteId;
    if (existing) {
      const updated = await tx.website.update({
        where: { id: existing.id },
        data: { url: canonicalUrl },
      });
      activeWebsiteId = updated.id;
      console.log(`Updated website ${activeWebsiteId} => ${canonicalUrl}`);
    } else {
      const created = await tx.website.create({
        data: { clinicId: clinic.id, url: canonicalUrl, isActive: true },
      });
      activeWebsiteId = created.id;
      console.log(`Created website ${activeWebsiteId} => ${canonicalUrl}`);
    }

    await tx.website.updateMany({
      where: { clinicId: clinic.id, id: { not: activeWebsiteId } },
      data: { isActive: false },
    });
    await tx.website.update({
      where: { id: activeWebsiteId },
      data: { isActive: true, url: normalizeUrl(canonicalUrl) },
    });

    const activeBranding = await tx.branding.findFirst({
      where: { clinicId: clinic.id },
      orderBy: { updatedAt: "desc" },
    });
    if (activeBranding) {
      await tx.branding.updateMany({
        where: { clinicId: clinic.id, id: { not: activeBranding.id } },
        data: { isActive: false },
      });
      await tx.branding.update({
        where: { id: activeBranding.id },
        data: { isActive: true },
      });
    }
  });

  const after = await prisma.clinic.findFirst({
    where: { id: clinic.id },
    include: {
      websites: { orderBy: { updatedAt: "desc" } },
      brandings: { orderBy: { updatedAt: "desc" } },
    },
  });
  console.log("Post-fix websites:", after.websites.map((w) => ({ id: w.id, url: w.url, isActive: w.isActive })));
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
