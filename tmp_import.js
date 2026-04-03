const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function importData() {
  const csvContent = fs.readFileSync('./scripts/leads_procesados_final.csv', 'utf-8');
  const lines = csvContent.split('\n').filter(l => l.trim() !== '');
  
  // Skip header
  const dataLines = lines.slice(1);
  
  let importedCount = 0;

  for (const line of dataLines) {
    const parts = line.split(',');
    // CSV Columns: Client, URL, Location, Telefoo, Directora, Day of contact, Visto Video?, Follw up 1, Link Demo Generado, Color Extraido
    const url = parts[1]?.trim();
    const location = parts[2]?.trim();
    
    // Extract slug from URL if name is empty
    let name = parts[0]?.trim();
    if (!name && url) {
       name = url.replace(/https?:\/\/(www\.)?/, '').split('/')[0].replace('.com', '').replace('.es', '');
    }
    if (!name) continue;

    const oldDemoLink = parts[8]?.trim();
    const color = parts[9]?.trim() || "#FFD700";

    try {
      const clinic = await prisma.clinic.create({
        data: {
          name: name,
          industry: "Clínica Capilar",
          location: location || null,
          websites: {
            create: { url: url }
          },
          brandings: {
            create: { primaryColor: color }
          },
          widgetConfigs: {
            create: { demoLink: oldDemoLink }
          }
        }
      });
      console.log(`✅ Importada: ${clinic.name}`);
      importedCount++;
    } catch (e) {
      console.error(`❌ Error importando ${name}:`, e.message);
    }
  }

  console.log(`\n🎉 Total clínicas importadas: ${importedCount}`);
  await prisma.$disconnect();
}

importData();
