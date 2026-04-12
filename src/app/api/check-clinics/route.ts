import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const clinics = await prisma.clinic.findMany({
    select: { id: true, name: true, slug: true, location: true }
  });
  return NextResponse.json(clinics);
}
