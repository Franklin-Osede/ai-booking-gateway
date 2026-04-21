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

    // Añadirlo automáticamente al nuevo Calendario
    await prisma.followUpTask.create({
      data: {
        clinicId: id,
        dueDate: contactDate ? new Date(contactDate) : new Date(),
        type: channel?.toUpperCase() === "EMAIL" ? "EMAIL" : channel?.toUpperCase() === "WHATSAPP" ? "WHATSAPP" : "CALL",
        status: status === "Agendado" || status === "Pendiente" ? "PENDING" : "COMPLETED",
        attemptNum: 1
      }
    });

    return NextResponse.json({ success: true, data: log }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create log" }, { status: 500 });
  }
}
