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
    const { text, voiceId = "Lucia", elevenlabs_voice_id, provider = "polly", voiceType = "guided", gender = "F" } = await req.json(); // Lucia is the premium realistic female es-ES voice

    if (!text) {
       return NextResponse.json({ error: "Missing text payload" }, { status: 400 });
    }

    // 1. Sanitize for XML but ALLOW <break> tags to pass through for highly realistic pacing
    const cleanText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/&lt;break(.*?)\/?&gt;/g, "<break$1/>");

    if (provider === "elevenlabs") {
      let elevenLabsVoiceId = elevenlabs_voice_id;
      if (!elevenLabsVoiceId) {
        if (voiceType === "free" && process.env.ELEVENLABS_VOICE_ID_FREE) {
          elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID_FREE;
        } else if (voiceType === "guided" && process.env.ELEVENLABS_VOICE_ID_GUIDED) {
          elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID_GUIDED;
        } else {
          elevenLabsVoiceId = process.env.ELEVENLABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL";
        }
      }
      const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

      if (!elevenLabsApiKey) {
        console.error("ElevenLabs request failed: Missing API Key");
      } else {
        // We now receive pristine natural text structured specifically for ElevenLabs natively from the Strategy
        // Just strip any accidental HTML/XML tags that might bleed through from the LLM in free-flow mode
        const noSsmlText = cleanText.replace(/<[^>]*>/g, '');
          
        const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}?optimize_streaming_latency=3`, {
          method: "POST",
          headers: {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": elevenLabsApiKey
          },
          body: JSON.stringify({
            text: noSsmlText,
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
          })
        });

        console.log(`ElevenLabs response status: ${elRes.status} for voiceId: ${elevenLabsVoiceId}`);
        if (elRes.ok) {
          const arrayBuffer = await elRes.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": buffer.length.toString(),
              "Cache-Control": "public, max-age=31536000",
            },
          });
        } else {
           const errText = await elRes.text();
           console.error("ElevenLabs error:", errText);
        }
      }
      // If ElevenLabs fails or is not configured, we gracefully fallback to Polly below
    }

    // 2. Wrap in SSML and slightly reduce the reading speed to make it sound more relaxed and conversational
    const ssmlText = `<speak><prosody rate="90%">${cleanText}</prosody></speak>`;
    const fallbackVoiceId = gender === "M" ? "Sergio" : "Lucia";

    const command = new SynthesizeSpeechCommand({
      Engine: "neural",
      LanguageCode: "es-ES",
      OutputFormat: "mp3",
      Text: ssmlText,
      TextType: "ssml",
      VoiceId: fallbackVoiceId,
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
