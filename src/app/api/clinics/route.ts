import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, industry, location, siteUrl, brandColor, oldDemoLink } = body;
    
    if (!name) return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });

    let baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (!baseSlug) baseSlug = 'clinic';
    let slug = baseSlug;
    
    let counter = 1;
    while (await prisma.clinic.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const clinic = await prisma.clinic.create({
      data: {
        name,
        slug,
        industry: industry || 'Sector General',
        location: location || null,
        websites: siteUrl ? { create: { url: siteUrl } } : undefined,
        brandings: brandColor ? { create: { primaryColor: brandColor } } : undefined,
        widgetConfigs: oldDemoLink ? { create: { demoLink: oldDemoLink } } : undefined
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
        }
      }
    });
    return NextResponse.json({ success: true, data: clinics });
  } catch (error) {
    console.error("Error fetching clinics:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch clinics" }, { status: 500 });
  }
}

