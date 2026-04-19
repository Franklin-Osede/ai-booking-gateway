import { prisma } from '../src/lib/prisma';
import { parseCanonicalLocale } from '../src/lib/utils/locale';

async function main() {
  console.log("Iniciando backfill a ClinicRuntimeConfig...");
  
  const clinics = await prisma.clinic.findMany({
    include: {
      websites: {
        orderBy: { updatedAt: "desc" }
      },
      brandings: {
        orderBy: { updatedAt: "desc" }
      }
    }
  });

  console.log(`Se encontraron ${clinics.length} clínicas.`);
  let count = 0;

  for (const clinic of clinics) {
    const website = clinic.websites[0];
    const branding = clinic.brandings[0];

    if (!website) {
      console.log(`[Skipped] Clínica ${clinic.name} (${clinic.id}) no tiene website activo.`);
      continue;
    }

    try {
      const rawLocale = clinic.countryCode || "es-ES";
      const canonicalLocale = parseCanonicalLocale(rawLocale) || "es-ES"; // Default de seguridad si es imparseable en legacy

      await prisma.clinicRuntimeConfig.upsert({
        where: { clinicId: clinic.id },
        update: {
          publishedWebsiteUrl: website.url,
          publishedBrandColor: branding?.primaryColor || "#333333",
          publishedNiche: clinic.industry,
          publishedLocale: canonicalLocale,
          fallbackMode: "proxy",
          version: 1,
          publishedAt: new Date(),
        },
        create: {
          clinicId: clinic.id,
          publishedWebsiteUrl: website.url,
          publishedBrandColor: branding?.primaryColor || "#333333",
          publishedNiche: clinic.industry,
          publishedLocale: canonicalLocale,
          fallbackMode: "proxy",
          version: 1,
        }
      });
      count++;
    } catch (e) {
      console.error(`[Error] Fallo insertando RuntimeConfig para ${clinic.name}:`, e);
    }
  }

  console.log(`\n¡Backfill completado! Se han inicializado en O(1) Snapshot: ${count} clínicas.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
