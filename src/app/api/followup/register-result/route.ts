import { NextResponse } from "next/server";
import { processFollowUpResult } from "@/server/followup/engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clinicId, taskId, type, result, notes } = body;

    if (!clinicId || !type || !result) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const log = await processFollowUpResult({
      clinicId,
      taskId,
      type,
      result,
      notes
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error registering result:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
