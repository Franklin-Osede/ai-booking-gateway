import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseCanonicalLocale } from "@/lib/utils/locale";
import * as fs from "fs";
import * as path from "path";

export async function GET() {
  try {
    const csvContent = fs.readFileSync(path.join(process.cwd(), './scripts/leads_procesados_final.csv'), 'utf-8');
    const lines = csvContent.split('\n').filter(l => l.trim() !== '');
    
    // Skip header
    const dataLines = lines.slice(1);
    let importedCount = 0;

    for (const line of dataLines) {
      const parts = line.split(',');
      const url = parts[1]?.trim();
      const location = parts[2]?.trim();
      
      let name = parts[0]?.trim();
      if (!name && url) {
         name = url.replace(/https?:\/\/(www\.)?/, '').split('/')[0].replace('.com', '').replace('.es', '');
      }
      if (!name) continue;

      const oldDemoLink = parts[8]?.trim();
      const color = parts[9]?.trim() || "#FFD700";

      await prisma.clinic.create({
        data: {
          name: name,
          industry: "Clínica Capilar",
          location: location || null,
          websites: {
            create: { url: url, isActive: true }
          },
          brandings: {
            create: { primaryColor: color, isActive: true }
          },
          widgetConfigs: {
            create: { demoLink: oldDemoLink }
          },
          runtimeConfig: url ? {
            create: {
              publishedWebsiteUrl: url,
              publishedBrandColor: color || "#333333",
              publishedNiche: "Clínica Capilar",
              publishedLocale: parseCanonicalLocale(location) || "es-ES",
              fallbackMode: "proxy",
              version: 1,
            }
          } : undefined
        }
      });
      importedCount++;
    }

    return NextResponse.json({ success: true, count: importedCount });
  } catch (error: unknown) {
    console.error("Import error", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
