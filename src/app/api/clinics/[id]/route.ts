import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseCanonicalLocale } from "@/lib/utils/locale";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const clinic = await prisma.clinic.findUnique({
      where: { id },
      include: {
        websites: { orderBy: { updatedAt: "desc" } },
        brandings: { orderBy: { updatedAt: "desc" } },
        widgetConfigs: true,
        outreachLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!clinic) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: clinic });
  } catch (error) {
    console.error("GET Clinic Error:", error);
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, industry, location, notes, primaryColor, videoUrl, seoMetrics, techMetrics, widgetPosition, countryCode, siteUrl } = body;

    let finalCountryCode = countryCode;
    if (countryCode) {
       const canonical = parseCanonicalLocale(countryCode);
       if (!canonical) {
          return NextResponse.json({ success: false, error: `Edición bloqueada: El idioma('${countryCode}') no es un Locale válido (es-ES, en-GB, en-US).` }, { status: 400 });
       }
       finalCountryCode = canonical;
    }

    const updateData: Record<string, unknown> = { name, industry, location, notes, videoUrl, seoMetrics, techMetrics, widgetPosition, countryCode: finalCountryCode };
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    if (primaryColor) {
      await prisma.branding.updateMany({ where: { clinicId: id }, data: { isActive: false } });
      const existingBranding = await prisma.branding.findFirst({
        where: { clinicId: id },
        orderBy: { updatedAt: "desc" },
      });
      if (existingBranding) {
         await prisma.branding.update({ where: { id: existingBranding.id }, data: { primaryColor, isActive: true } });
      } else {
         await prisma.branding.create({ data: { clinicId: id, primaryColor, isActive: true } });
      }
    }

    if (siteUrl) {
      const normalizedSiteUrl = /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`;
      await prisma.website.updateMany({ where: { clinicId: id }, data: { isActive: false } });
      const existingWebsite = await prisma.website.findFirst({
        where: { clinicId: id },
        orderBy: { updatedAt: "desc" },
      });
      if (existingWebsite) {
        await prisma.website.update({ where: { id: existingWebsite.id }, data: { url: normalizedSiteUrl, isActive: true } });
      } else {
        await prisma.website.create({ data: { clinicId: id, url: normalizedSiteUrl, isActive: true } });
      }
    }

    const clinic = await prisma.clinic.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: clinic });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.clinic.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}
