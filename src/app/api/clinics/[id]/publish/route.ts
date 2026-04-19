import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseCanonicalLocale } from "@/lib/utils/locale";

export async function POST(req: Request, context: unknown) {
  try {
    // Next.js 15+ compatible params parsing
    let id: string;
    if (context && typeof context === 'object' && 'params' in context) {
      const params = (context as { params: Promise<{ id: string }> | { id: string } }).params;
      if (params instanceof Promise) {
        id = (await params).id;
      } else {
        id = params.id;
      }
    } else {
      return NextResponse.json({ success: false, error: "Missing params" }, { status: 400 });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { id },
      include: {
        websites: {
          orderBy: { updatedAt: "desc" }
        },
        brandings: {
          orderBy: { updatedAt: "desc" }
        }
      }
    });

    if (!clinic) {
      return NextResponse.json({ success: false, error: "Clínica no encontrada" }, { status: 404 });
    }

    const activeWebsite = clinic.websites.find(w => w.isActive);
    const activeBranding = clinic.brandings.find(b => b.isActive);

    if (!activeWebsite || !activeWebsite.url) {
      return NextResponse.json({ success: false, error: "Publicación bloqueada: No hay ningún dominio marcado como activo (isActive: true)." }, { status: 400 });
    }
    
    if (!activeBranding) {
      return NextResponse.json({ success: false, error: "Publicación bloqueada: No hay branding activo configurado." }, { status: 400 });
    }

    let urlToPublish = activeWebsite.url;
    if (urlToPublish.startsWith('http://')) {
      urlToPublish = urlToPublish.replace('http://', 'https://');
    } else if (!urlToPublish.startsWith('https://')) {
      urlToPublish = `https://${urlToPublish}`;
    }

    // Validación de Idioma Estricta (Contrato Canónico)
    const rawLocale = clinic.countryCode || "es-ES";
    const canonicalLocale = parseCanonicalLocale(rawLocale);
    
    if (!canonicalLocale) {
       return NextResponse.json({ success: false, error: `Publicación bloqueada: El idioma de la clínica ('${rawLocale}') no es un Locale válido (es-ES, en-GB, en-US). Corrige el País/Idioma en la configuración.` }, { status: 400 });
    }

    // Validación estricta GET (Fail-Closed)
    try {
      const fetchCheck = await fetch(urlToPublish, { 
        method: "GET", 
        redirect: "follow", 
        headers: { "User-Agent": "Mozilla/5.0 (AgentMinds SREbot/1.0)" },
        signal: AbortSignal.timeout(8000) 
      });
      
      if (!fetchCheck.ok) {
         return NextResponse.json({ success: false, error: `Publicación bloqueada: La URL devolvió HTTP ${fetchCheck.status}.` }, { status: 400 });
      }

      // Validar firmas de Parked Domain en el HTML
      const htmlBody = await fetchCheck.text();
      const parkingSignatures = [
        "domain is registered at hostinger", 
        "godaddy.com/forsale",
        "buy this domain",
        "domain is parked",
        "this site is parked"
      ];
      
      const lowerHtml = htmlBody.toLowerCase();
      for (const sig of parkingSignatures) {
        if (lowerHtml.includes(sig)) {
          return NextResponse.json({ success: false, error: "Publicación bloqueada: Detectada firma de Parking Domain (Hostinger/GoDaddy)." }, { status: 400 });
        }
      }

    } catch (e) {
      // Timeout, bad DNS, etc => Aborta la transacción
      const errReason = e instanceof Error ? e.message : "Error DNS/Timeout";
      return NextResponse.json({ success: false, error: `Validación estricta fallida (Timeout o Red inalcanzable): ${errReason}` }, { status: 400 });
    }

    const config = await prisma.clinicRuntimeConfig.upsert({
      where: { clinicId: id },
      create: {
        clinicId: id,
        publishedWebsiteUrl: urlToPublish,
        publishedBrandColor: activeBranding?.primaryColor || "#333333",
        publishedNiche: clinic.industry,
        publishedLocale: canonicalLocale,
        fallbackMode: "proxy",
        version: 1,
      },
      update: {
        publishedWebsiteUrl: urlToPublish,
        publishedBrandColor: activeBranding?.primaryColor || "#333333",
        publishedNiche: clinic.industry,
        publishedLocale: canonicalLocale,
        version: { increment: 1 },
        publishedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error("Publish Clinic Error:", error);
    return NextResponse.json({ success: false, error: "Failed to publish clinic configuration" }, { status: 500 });
  }
}
