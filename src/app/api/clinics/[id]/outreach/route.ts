import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, channel, nextStep, owner, contactDate } = body;

    const log = await prisma.outreachLog.create({
      data: {
        clinicId: id,
        status,
        channel,
        nextStep,
        owner,
        ...(contactDate ? { createdAt: new Date(contactDate) } : {})
      },
    });

    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create log" }, { status: 500 });
  }
}
