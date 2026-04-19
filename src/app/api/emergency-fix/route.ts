import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const logs: string[] = [];
    const log = (msg: string) => { console.log(msg); logs.push(msg); };

    log("🛠 Iniciando parche de emergencia para wmglondon...");
    const wmg = await prisma.clinic.findFirst({ where: { slug: "wmglondon" }, include: { websites: true } });
    
    if (wmg) {
      for (const web of wmg.websites) {
        if (web.url.includes('hostinger') || web.url.includes('.brs')) {
          log(`🗑 Eliminando basura: ${web.url}`);
          await prisma.website.delete({ where: { id: web.id } });
        }
      }
      
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
    } else {
      log(`⚠️ Clínica wmglondon no encontrada en esta base de datos.`);
    }

    log("✅ Migración completada exitosamente.");

    return NextResponse.json({ success: true, logs });
  } catch(e: any) {
    return NextResponse.json({ success: false, error: e.message || String(e) }, { status: 500 });
  }
}
