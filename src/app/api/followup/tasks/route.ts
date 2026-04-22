import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    const whereClause: Record<string, unknown> = {};
    if (start && end) {
      whereClause.dueDate = {
        gte: new Date(start),
        lte: new Date(end)
      };
    }

    const tasks = await prisma.followUpTask.findMany({
      where: whereClause,
      include: {
        clinic: {
          select: { 
            name: true, 
            industry: true, 
            id: true,
            slug: true,
            seoMetrics: true,
            techMetrics: true,
            runtimeConfig: {
              select: { publishedWebsiteUrl: true }
            },
            createdAt: true,
            outreachLogs: { orderBy: { createdAt: 'desc' }, take: 1, select: { createdAt: true } }
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clinicId, dueDate, feedback, nextAction } = body;

    // Si pasaron feedback, dejamos constancia en el historial hoy
    if (feedback) {
      await prisma.outreachLog.create({
        data: {
          clinicId,
          status: "CONTACTED",
          type: "NOTE",
          result: "COMPLETED",
          attemptNum: 1,
          metadata: { notes: feedback, nextAction }
        }
      });
    }

    const task = await prisma.followUpTask.create({
      data: {
        clinicId,
        dueDate: new Date(dueDate),
        type: "CALL", 
        status: "PENDING",
        attemptNum: 1
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating manual task:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
