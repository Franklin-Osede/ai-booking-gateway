import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clinicId = searchParams.get("clinicId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (clinicId) where.clinicId = clinicId;
    if (startDate && endDate) {
      where.eventDate = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.eventDate = { gte: new Date(startDate) };
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const events = await prisma.clinicEvent.findMany({
      where,
      include: {
        clinic: {
          select: { name: true, industry: true }
        }
      },
      orderBy: { eventDate: "asc" }
    });

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("GET /api/clinic-events error:", error);
    return NextResponse.json({ success: false, error: "Error fetching events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clinicId, eventDate, reminderDate, feedback, nextAction } = body;

    if (!clinicId || !eventDate) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const event = await prisma.clinicEvent.create({
      data: {
        clinicId,
        eventDate: new Date(eventDate),
        reminderDate: reminderDate ? new Date(reminderDate) : null,
        feedback,
        nextAction
      },
      include: {
        clinic: {
          select: { name: true, industry: true }
        }
      }
    });

    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    console.error("POST /api/clinic-events error:", error);
    return NextResponse.json({ success: false, error: "Error creating event" }, { status: 500 });
  }
}
