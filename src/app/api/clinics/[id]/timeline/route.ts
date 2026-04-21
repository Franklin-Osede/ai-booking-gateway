import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch timeline (OutreachLogs configured as ActivityLog + the legacy fields)
    const timeline = await prisma.outreachLog.findMany({
      where: { clinicId: id },
      orderBy: { createdAt: 'desc' }
    });

    // Also fetch current pending tasks to show in the UI
    const pendingTasks = await prisma.followUpTask.findMany({
      where: { clinicId: id, status: 'PENDING' },
      orderBy: { dueDate: 'asc' }
    });

    return NextResponse.json({ timeline, pendingTasks });
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
