import { NextRequest, NextResponse } from "next/server";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

export const runtime = "nodejs";

const polly = new PollyClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId = "Lucia" } = await req.json(); // Lucia is the premium realistic female es-ES voice

    if (!text) {
       return NextResponse.json({ error: "Missing text payload" }, { status: 400 });
    }

    // 1. Sanitize for XML
    let cleanText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // 2. Wrap in SSML and slightly reduce the reading speed to make it sound more relaxed and conversational
    const ssmlText = `<speak><prosody rate="95%">${cleanText}</prosody></speak>`;

    const command = new SynthesizeSpeechCommand({
      Engine: "neural",
      LanguageCode: "es-ES",
      OutputFormat: "mp3",
      Text: ssmlText,
      TextType: "ssml",
      VoiceId: voiceId,
    });

    const response = await polly.send(command);

    if (response.AudioStream) {
      const byteArray = await response.AudioStream.transformToByteArray();
      const buffer = Buffer.from(byteArray);
      
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Length": buffer.length.toString(),
          "Cache-Control": "public, max-age=31536000",
        },
      });
    }

    return NextResponse.json({ error: "No audio stream returned from Polly" }, { status: 500 });
  } catch (error) {
    console.error("Polly API Error:", error);
    return NextResponse.json({ error: "Failed to synthesize speech via AWS SDK" }, { status: 500 });
  }
}
