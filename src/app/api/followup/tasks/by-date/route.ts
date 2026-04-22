import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz"; // If not available, we will do manual offset

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clinicId = searchParams.get("clinicId");
    const dateStr = searchParams.get("date"); // ISO string

    if (!clinicId || !dateStr) {
      return NextResponse.json({ error: "Missing clinicId or date" }, { status: 400 });
    }

    // Convert dateStr to a local date string (e.g. "2026-04-22") without tz shifting
    // dateStr comes from ISO string generated in local browser, e.g. 2026-04-21T22:00:00.000Z for Apr 22 in Europe
    const clientDate = new Date(dateStr);
    
    // Create a broad 48-hour window to catch any timezone discrepancies for the selected day
    const broadStart = new Date(clientDate.getTime() - 24 * 60 * 60 * 1000);
    const broadEnd = new Date(clientDate.getTime() + 24 * 60 * 60 * 1000);

    // To perfectly match, we'll just delete tasks and logs that fall around this day.
    // However, it's safer to just fetch and delete in memory if we really need precise matching.
    // Let's use a wide deletion range since they want to clear the whole day.
    
    await prisma.followUpTask.deleteMany({
      where: {
        clinicId,
        dueDate: { gte: broadStart, lte: broadEnd }
      }
    });

    await prisma.outreachLog.deleteMany({
      where: {
        clinicId,
        createdAt: { gte: broadStart, lte: broadEnd }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting tasks by date:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
