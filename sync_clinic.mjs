import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const clinics = await prisma.clinic.findMany();
  
  const capmedica = clinics.find(c => c.name.toLowerCase().includes('capmedica') || c.slug?.toLowerCase().includes('capmedica'));
  
  if (!capmedica) {
    console.log("Clinic not found! Found clinics:", clinics.map(c => c.name));
    return;
  }

  await prisma.clinic.update({
    where: { id: capmedica.id },
    data: {
      seoMetrics: {
        traffic: "1.937 visitas orgánicas / mes",
        cost: "Competitivo (Rankeando en docenas de provincias)",
        topPages: "Top Fugues:\n1. /blog/precio-de-los-injertos-capilares/\n2. /blog/testosterona-y-alopecia-masculina/\n3. /trasplante-de-pelo/tenerife/ \nMucha gente de curiosidad e investigación de precios que rebota.",
        socialTraffic: "Revisar su Meta Ads e IG. Su tráfico es altamente móvil.",
        competitors: "Insparya, Capilclinic (Franquicias que invierten masivo en anuncios).",
        insights: "BALA DE PLATA: 'El Embudo de los Precios'.\nEstáis sangrando a vuestros leads más calientes en la URL de precios porque la gente entra exigiendo saber el coste, no ve un número inmediato y se van a pedir presupuesto a la competencia.\nSolución: El Widget IA captura a la gente pidiéndo presupuesto in-situ y les saca las fotos con el móvil 24/7."
      }
    }
  });

  console.log("Successfully updated Capmedica in DB! ID:", capmedica.id);
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
