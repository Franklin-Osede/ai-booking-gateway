import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing ID" }, { status: 400 });
    }

    // @ts-expect-error - Prisma client needs restart to pick up new types
    await prisma.clinicEvent.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/clinic-events/[id] error:", error);
    return NextResponse.json({ success: false, error: "Error deleting event" }, { status: 500 });
  }
}
