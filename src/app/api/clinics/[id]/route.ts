import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const clinic = await prisma.clinic.findUnique({
      where: { id },
      include: {
        websites: true,
        brandings: true,
        widgetConfigs: true,
        outreachLogs: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!clinic) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: clinic });
  } catch {
    return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, industry, location, notes, primaryColor, videoUrl } = body;

    const updateData: Record<string, string | undefined> = { name, industry, location, notes, videoUrl };
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    if (primaryColor) {
      const existingBranding = await prisma.branding.findFirst({ where: { clinicId: id } });
      if (existingBranding) {
         await prisma.branding.update({ where: { id: existingBranding.id }, data: { primaryColor } });
      } else {
         await prisma.branding.create({ data: { clinicId: id, primaryColor } });
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

