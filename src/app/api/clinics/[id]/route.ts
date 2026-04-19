import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const clinic = await prisma.clinic.findUnique({
      where: { id },
      include: {
        websites: {
          where: { isActive: true },
          orderBy: { updatedAt: "desc" },
          take: 1,
        },
        brandings: {
          where: { isActive: true },
          orderBy: { updatedAt: "desc" },
          take: 1,
        },
        widgetConfigs: true,
        outreachLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!clinic) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    // Backward-compatible fallback while active-state rollout completes.
    if (!clinic.websites?.length) {
      const latestWebsite = await prisma.website.findFirst({
        where: { clinicId: id },
        orderBy: { updatedAt: "desc" },
      });
      if (latestWebsite) clinic.websites = [latestWebsite];
    }
    if (!clinic.brandings?.length) {
      const latestBranding = await prisma.branding.findFirst({
        where: { clinicId: id },
        orderBy: { updatedAt: "desc" },
      });
      if (latestBranding) clinic.brandings = [latestBranding];
    }

    return NextResponse.json({ success: true, data: clinic });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, industry, location, notes, primaryColor, videoUrl, seoMetrics, techMetrics, widgetPosition, countryCode, siteUrl } = body;

    const updateData: Record<string, unknown> = { name, industry, location, notes, videoUrl, seoMetrics, techMetrics, widgetPosition, countryCode };
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    await prisma.$transaction(async (tx) => {
      if (primaryColor) {
        const existingBranding = await tx.branding.findFirst({
          where: { clinicId: id, isActive: true },
          orderBy: { updatedAt: "desc" },
        }) || await tx.branding.findFirst({
          where: { clinicId: id },
          orderBy: { updatedAt: "desc" },
        });

        let activeBrandingId: string;
        if (existingBranding) {
          const updated = await tx.branding.update({
            where: { id: existingBranding.id },
            data: { primaryColor },
          });
          activeBrandingId = updated.id;
        } else {
          const created = await tx.branding.create({
            data: { clinicId: id, primaryColor, isActive: true },
          });
          activeBrandingId = created.id;
        }

        await tx.branding.updateMany({
          where: { clinicId: id, id: { not: activeBrandingId } },
          data: { isActive: false },
        });
        await tx.branding.update({
          where: { id: activeBrandingId },
          data: { isActive: true },
        });
      }

      if (siteUrl) {
        const normalizedSiteUrl = /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`;
        const existingWebsite = await tx.website.findFirst({
          where: { clinicId: id, isActive: true },
          orderBy: { updatedAt: "desc" },
        }) || await tx.website.findFirst({
          where: { clinicId: id },
          orderBy: { updatedAt: "desc" },
        });

        let activeWebsiteId: string;
        if (existingWebsite) {
          const updated = await tx.website.update({
            where: { id: existingWebsite.id },
            data: { url: normalizedSiteUrl },
          });
          activeWebsiteId = updated.id;
        } else {
          const created = await tx.website.create({
            data: { clinicId: id, url: normalizedSiteUrl, isActive: true },
          });
          activeWebsiteId = created.id;
        }

        await tx.website.updateMany({
          where: { clinicId: id, id: { not: activeWebsiteId } },
          data: { isActive: false },
        });
        await tx.website.update({
          where: { id: activeWebsiteId },
          data: { isActive: true },
        });
      }
    });

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
