import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { clinics } = await req.json();
    if (!clinics || !Array.isArray(clinics)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    // Bulk Deduplication Pre-fetch
    const existingClinics = await prisma.clinic.findMany({
      select: { name: true, websites: { select: { url: true } } }
    });

    const existingNames = new Set(existingClinics.map((c: { name: string }) => c.name.toLowerCase().trim()));
    const existingUrls = new Set(
      existingClinics.flatMap((c: { websites: { url: string }[] }) => c.websites.map((w: { url: string }) => w.url.toLowerCase().trim()))
    );

    let added = 0;
    let skipped = 0;

    for (const data of clinics) {
      if (!data.name) continue;

      const n = data.name.toLowerCase().trim();
      const u = data.url ? data.url.toLowerCase().trim() : null;

      // Smart intelligence: skip if exactly same name OR same URL exists
      if (existingNames.has(n) || (u && existingUrls.has(u))) {
        skipped++;
        continue;
      }

      // Generate slug safely
      let baseSlug = n.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (!baseSlug) baseSlug = 'clinic';
      let slug = baseSlug;
      let counter = 1;
      while (await prisma.clinic.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      await prisma.clinic.create({
        data: {
          name: data.name,
          slug,
          industry: data.industry || 'General',
          location: data.location || null,
          websites: data.url ? { create: { url: data.url } } : undefined,
        }
      });
      
      // Register in local cache to prevent clones WITHIN the same Excel
      existingNames.add(n);
      if (u) existingUrls.add(u);
      
      added++;
    }

    return NextResponse.json({ success: true, added, skipped });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
