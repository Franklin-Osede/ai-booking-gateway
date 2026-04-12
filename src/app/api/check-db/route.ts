import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const clinic = await prisma.clinic.findFirst({
    where: { slug: 'centro-capilar-gandia' }
  });
  return NextResponse.json(clinic);
}
