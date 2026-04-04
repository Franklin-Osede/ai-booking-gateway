import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("file") as Blob;

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const openAiKey = process.env.OPENAI_API_KEY;
    if (!openAiKey) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json({ error: "STT API Key not configured" }, { status: 500 });
    }

    // Prepare Whisper formData
    const whisperData = new FormData();
    whisperData.append("file", audioFile, "audio.webm");
    whisperData.append("model", "whisper-1");
    whisperData.append("language", "es");
    whisperData.append("temperature", "0"); // lower temp for more literal STT without hallucinations

    // Call OpenAI API directly (no dependency needed)
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAiKey}`,
      },
      body: whisperData,
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI Whisper Error:", errorData);
      return NextResponse.json({ error: "Failed to transcribe audio" }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("STT Error:", error);
    return NextResponse.json({ error: "Internal Server Error during STT" }, { status: 500 });
  }
}
