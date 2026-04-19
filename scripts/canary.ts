import { prisma } from "../src/lib/prisma";

const VIP_SLUGS = [
  "wmglondon",
  "instituto-capilar",
  "clinica-arbelaez",
  "info-mncapilar",
  "clinicaciro"
];

async function runCanary() {
  console.log("🦅 Iniciando SRE Canary Deploy Block...");
  console.log("Asegurando consistencia de 10 VIPs y 10 Clínicas Recientes...");

  try {
    // 1. Recopilar Target: VIPs (Fallback por slugs si no llegan a 10)
    const vipConfigs = await prisma.clinicRuntimeConfig.findMany({
      where: {
        clinic: {
          slug: { in: VIP_SLUGS }
        }
      },
      include: { clinic: { select: { slug: true, name: true } } }
    });

    // 2. Recopilar Target: Top 10 Recientes Dinámicas
    const recentConfigs = await prisma.clinicRuntimeConfig.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 10,
      include: { clinic: { select: { slug: true, name: true } } }
    });

    const pool = new Map();
    vipConfigs.forEach(c => pool.set(c.clinicId, c));
    recentConfigs.forEach(c => pool.set(c.clinicId, c));

    const totalToTest = Array.from(pool.values());
    console.log(`📡 Probando integridad de ${totalToTest.length} Slugs Clínicos.`);

    let failures = 0;

    for (const config of totalToTest) {
      if (!config.publishedWebsiteUrl) {
         console.error(`❌ FATAL: ${config.clinic.name} no tiene URL publicada.`);
         failures++;
         continue;
      }

      // Probar si el Dominio resuelve
      try {
        const check = await fetch(config.publishedWebsiteUrl, { 
            method: "HEAD", 
            redirect: "follow", 
            signal: AbortSignal.timeout(5000),
            headers: { "User-Agent": "AgentMinds/Canary" }
        });
        if (!check.ok && check.status >= 500) {
            console.error(`❌ FATAL: ${config.clinic.name} (${config.publishedWebsiteUrl}) retornó ${check.status}.`);
            failures++;
            continue;
        }
      } catch (e) {
          const reason = e instanceof Error ? e.message : "Desconocido";
          console.error(`❌ FALLO DE RED: ${config.clinic.name} -> ${reason}`);
          failures++;
          continue;
      }

      console.log(`✅ [OK] ${config.clinic.name}`);
    }

    if (failures > 0) {
       console.error(`🚨 CANARY FAILED: Han fallado ${failures} validaciones de Slugs clave.`);
       console.error(`🚨 DEPLOYMENT BLOQUEADO automáticamante. Requerida intervención SRE.`);
       process.exit(1);
    }

    console.log("🦅 CANARY SUCCESS: Todos los sistemas listos. Autorizando Deploy a Producción.");
    process.exit(0);

  } catch (error) {
     console.error("Critical Canary Execution Error:", error);
     process.exit(1);
  } finally {
     await prisma.$disconnect();
  }
}

runCanary();
