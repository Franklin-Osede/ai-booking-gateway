import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const clinics = await prisma.clinic.findMany({ select: { slug: true, name: true } });
  return NextResponse.json(clinics);
}
