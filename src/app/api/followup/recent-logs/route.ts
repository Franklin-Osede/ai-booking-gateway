import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const logs = await prisma.outreachLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      include: {
        clinic: { select: { name: true, slug: true } }
      }
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching recent logs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
