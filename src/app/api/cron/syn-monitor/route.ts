import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60; // Set Vercel hobby maximum duration if possible, Pro is 300
export const dynamic = 'force-dynamic';

async function sendTelegramAlert(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("Faltan variables TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID, saltando alerta.");
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML"
      }),
    });
  } catch (e) {
    console.error("Error enviando alerta por Telegram", e);
  }
}

export async function GET(req: Request) {
  try {
    // 1. Autorización Básica
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      const url = new URL(req.url);
      if (url.searchParams.get("key") !== process.env.CRON_SECRET) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    // 2. Traer TODAS las configuraciones publicadas para evaluar tanto caídas como recuperaciones
    const activeConfigs = await prisma.clinicRuntimeConfig.findMany({
      include: { clinic: { select: { name: true, slug: true, id: true } } }
    });

    const failedClinics: Array<{ name: string, url: string, reason: string }> = [];
    const recoveredClinics: Array<{ name: string, url: string }> = [];

    // 3. Healthcheck Asíncrono en Paralelo (En lotes para no saturar memoria)
    const chunkSize = 20;
    for (let i = 0; i < activeConfigs.length; i += chunkSize) {
      const chunk = activeConfigs.slice(i, i + chunkSize);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await Promise.allSettled(chunk.map(async (config: any) => {
        try {
          const fetchCheck = await fetch(config.publishedWebsiteUrl, { 
            method: "HEAD", 
            redirect: "follow", 
            signal: AbortSignal.timeout(8000) 
          });

          // Consideramos "caída" un estatus 404, 500+ o que no resuelve DNS/Timeout
          if (!fetchCheck.ok && [404, 500, 502, 503, 504].includes(fetchCheck.status)) {
             throw new Error(`HTTP ${fetchCheck.status}`);
          }
          // Si estaba roto y ahora funciona, recuperarlo!
          if (config.fallbackMode !== "proxy") {
            recoveredClinics.push({ name: config.clinic.name, url: config.publishedWebsiteUrl });
            await prisma.clinicRuntimeConfig.update({
              where: { id: config.id },
              data: { fallbackMode: "proxy" }
            });
          }
        } catch (error) {
          // Si cae aquí, ha sido timeout, error de red, o throw explícito nuestro
          if (config.fallbackMode === "proxy") {
            const errReason = error instanceof Error ? error.message : "Error DNS/Timeout";
            
            failedClinics.push({
              name: config.clinic.name,
              url: config.publishedWebsiteUrl,
              reason: errReason
            });

            // Ejecutar degradación elegante atómica a modo screenshot/neutral
            await prisma.clinicRuntimeConfig.update({
              where: { id: config.id },
              data: { fallbackMode: "neutral" }
            });
          }
        }
      }));
    }

    // 4. Si hay caídas, notificar agrupadas por Telegram
    if (failedClinics.length > 0) {
      let alertMessage = `🚨 <b>INCIDENTE DEMO HUB</b> 🚨\n\nSe han detectado ${failedClinics.length} webs de clínicas no disponibles.\nSe ha activado el *Modo Seguro* (Neutral) automáticamente para ellas.\n\n`;
      
      failedClinics.forEach(c => {
         alertMessage += `🏥 <b>${c.name}</b>\n❌ <code>${c.reason}</code>\n🔗 ${c.url}\n\n`;
      });
      alertMessage += `🛠 Revisarlas en el Admin:\nhttps://demos.agentminds.io/admin`;
      await sendTelegramAlert(alertMessage);
    }

    if (recoveredClinics.length > 0) {
      let alertMessage = `✅ <b>RECUPERACIÓN SRE</b> ✅\n\nLas siguientes clínicas han vuelto a estar online y han sido auto-promovidas a Modo Proxy.\n\n`;
      recoveredClinics.forEach(c => {
         alertMessage += `🏥 <b>${c.name}</b>\n🔗 ${c.url}\n\n`;
      });
      await sendTelegramAlert(alertMessage);
    }

    return NextResponse.json({ 
      success: true, 
      checked: activeConfigs.length, 
      failed: failedClinics.length,
      recovered: recoveredClinics.length
    });

  } catch (error) {
    console.error("Cron Monitor Error:", error);
    return NextResponse.json({ success: false, error: "Critical failure running syn-monitor" }, { status: 500 });
  }
}
