import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseCanonicalLocale } from "@/lib/utils/locale";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, industry, location, countryCode, siteUrl, brandColor, oldDemoLink } = body;
    
    if (!name) return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });

    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (!baseSlug) baseSlug = 'clinic';
    let slug = baseSlug;
    
    let counter = 1;
    while (await prisma.clinic.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const normalizeSiteUrl = (rawUrl?: string) => {
      if (!rawUrl) return undefined;
      const trimmed = rawUrl.trim();
      if (!trimmed) return undefined;
      return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    };

    const normalizedSiteUrl = normalizeSiteUrl(siteUrl);

    // Validación de Idioma Estricta (Contrato Canónico)
    const rawLocale = countryCode || "es-ES";
    const canonicalLocale = parseCanonicalLocale(rawLocale);
    if (!canonicalLocale && normalizedSiteUrl) {
      return NextResponse.json({ success: false, error: `Creación bloqueada: El idioma de la clínica ('${rawLocale}') no es un Locale válido (es-ES, en-GB, en-US).` }, { status: 400 });
    }

    const clinic = await prisma.clinic.create({
      data: {
        name,
        slug,
        industry: industry || 'Sector General',
        location: location || null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({ countryCode: countryCode || 'ES' } as any),
        websites: normalizedSiteUrl ? { create: { url: normalizedSiteUrl, isActive: true } } : undefined,
        brandings: brandColor ? { create: { primaryColor: brandColor, isActive: true } } : undefined,
        widgetConfigs: oldDemoLink ? { create: { demoLink: oldDemoLink } } : undefined,
        runtimeConfig: normalizedSiteUrl ? {
          create: {
            publishedWebsiteUrl: normalizedSiteUrl,
            publishedBrandColor: brandColor || "#333333",
            publishedNiche: industry || "Sector General",
            publishedLocale: canonicalLocale || "es-ES",
            fallbackMode: "proxy",
            version: 1
          }
        } : undefined
      }
    });
    return NextResponse.json({ success: true, data: clinic });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const clinics = await prisma.clinic.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        outreachLogs: {
          orderBy: { createdAt: "desc" },
          take: 1
        },
        websites: true
      }
    });
    return NextResponse.json({ success: true, data: clinics });
  } catch (error) {
    console.error("Error fetching clinics:", error);
    return NextResponse.json({ success: false, error: String(error), stack: error instanceof Error ? error.stack : undefined }, { status: 500 });
  }
}
