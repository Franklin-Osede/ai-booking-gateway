import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, industry, location, siteUrl, brandColor, oldDemoLink } = body;
    
    if (!name) return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });

    const clinic = await prisma.clinic.create({
      data: {
        name,
        industry: industry || 'Sector General',
        location: location || null,
        websites: siteUrl ? { create: { url: siteUrl } } : undefined,
        brandings: brandColor ? { create: { primaryColor: brandColor } } : undefined,
        widgetConfigs: oldDemoLink ? { create: { demoLink: oldDemoLink } } : undefined
      }
    });
    return NextResponse.json({ success: true, data: clinic });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const clinics = await prisma.clinic.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: clinics });
  } catch (error) {
    console.error("Error fetching clinics:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch clinics" }, { status: 500 });
  }
}

