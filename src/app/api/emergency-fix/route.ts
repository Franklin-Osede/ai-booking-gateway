import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const logs: string[] = [];
    const log = (msg: string) => { console.log(msg); logs.push(msg); };

    log("🛠 Iniciando purga global de Hostinger y .brs...");
    const allClinics = await prisma.clinic.findMany({ include: { websites: true } });
    
    let deletedCount = 0;
    
    for (const clinic of allClinics) {
      for (const web of clinic.websites) {
        if (web.url.includes('hostinger') || web.url.includes('.brs')) {
          log(`🗑 Eliminando basura: ${web.url} de la clínica ${clinic.slug || clinic.name}`);
          await prisma.website.delete({ where: { id: web.id } });
          deletedCount++;
        }
      }
    }
    
    log(`✅ Se eliminaron ${deletedCount} URLs basura de Hostinger a nivel global.`);

    log("🛠 Iniciando parche forzado para wmglondon...");
    const wmg = allClinics.find(c => c.slug === "wmglondon");
    if (wmg) {
      const rem = await prisma.website.findMany({ where: { clinicId: wmg.id } });
      if (!rem.some(w => w.url === "https://wmglondon.com")) {
        if (rem.length > 0) {
          await prisma.website.update({ where: { id: rem[0].id }, data: { url: "https://wmglondon.com" } });
        } else {
          await prisma.website.create({ data: { clinicId: wmg.id, url: "https://wmglondon.com" } });
        }
        log(`✅ Forzado y arreglado a https://wmglondon.com`);
      } else {
        log(`✅ wmglondon.com ya existe y está limpio de duplicados basura de hostinger.`);
      }
    }

    log("✅ Purga y Migración completada exitosamente.");

    return NextResponse.json({ success: true, deletedCount, logs });
  } catch(e: unknown) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
