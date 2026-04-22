import { NextRequest, NextResponse } from "next/server";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { prisma } from "@/lib/prisma";

// --- TTS DICTIONARY MIDDLEWARE ---
type TermRule = { match: string; replace: string; priority?: number };
const dictCache = new Map<string, { compiled: { regex: RegExp; replace: string; priority: number }[], timestamp: number }>();

async function applyTTSDictionary(text: string, clinicId?: string, niche: string = "hair_transplant", locale: string = "es-ES"): Promise<string> {
  const cacheKey = `${clinicId || 'none'}_${niche}_${locale}`;
  const now = Date.now();
  let cached = dictCache.get(cacheKey);

  // Cache busting every 5 minutes
  if (!cached || now - cached.timestamp > 5 * 60 * 1000) {
    try {
      const nicheRules = await prisma.pronunciationProfile.findFirst({
        where: { scopeType: 'niche', scopeId: niche, locale }
      });
      const clinicRules = clinicId ? await prisma.pronunciationProfile.findFirst({
        where: { scopeType: 'clinic', scopeId: clinicId, locale }
      }) : null;

      const merged = new Map<string, TermRule>();
      const nRules = (nicheRules?.rules as TermRule[]) || [];
      const cRules = (clinicRules?.rules as TermRule[]) || [];

      const isEnglish = locale.toLowerCase().startsWith("en");

      // Base rules
      const baseRules: TermRule[] = [
        { match: "\\bFUE\\b", replace: "F. U. E.", priority: -1 },
        { match: "\\bDHI\\b", replace: "D. H. I.", priority: -1 },
        { match: "\\bPRP\\b", replace: "P. R. P.", priority: -1 },
        { match: "\\bIA\\b", replace: "I. A.", priority: -1 },
      ];

      if (!isEnglish) {
        baseRules.push(
          { match: "\\bFinasteride\\b", replace: "finastéride", priority: -1 },
          { match: "\\bDutasteride\\b", replace: "dutastéride", priority: -1 },
          { match: "\\bMinoxidil\\b", replace: "minoxídil", priority: -1 },
          { match: "\\bInvisalign\\b", replace: "Invisálain", priority: -1 },
          { match: "\\bBotox\\b", replace: "Bótox", priority: -1 },
          { match: "\\bLifting\\b", replace: "Lífting", priority: -1 },
          { match: "\\bPeeling\\b", replace: "Píling", priority: -1 },
          { match: "\\bAnti-aging\\b", replace: "anti éiying", priority: -1 },
          { match: "Dr\\.", replace: "Doctor ", priority: -1 },
          { match: "Dra\\.", replace: "Doctora ", priority: -1 },
          { match: "Medclinicanarias", replace: "Medic clinic canarias", priority: -1 },
          { match: "medclinicanarias", replace: "medic clinic canarias", priority: -1 }
        );
      }

      for (const rule of baseRules) {
        merged.set(rule.match, rule);
      }

      // Merge niche rules first
      for (const rule of nRules) {
        merged.set(rule.match, { ...rule, priority: rule.priority || 0 });
      }
      // Override with clinic rules
      for (const rule of cRules) {
        merged.set(rule.match, { ...rule, priority: rule.priority || 0 });
      }

      const ordered = [...merged.values()].sort((a, b) => (b.priority || 0) - (a.priority || 0));
      const compiled = ordered.map(r => ({
        regex: new RegExp(r.match, 'g'),
        replace: r.replace,
        priority: r.priority || 0
      }));

      cached = { compiled, timestamp: now };
      dictCache.set(cacheKey, cached);
    } catch(e) {
      console.error("Failed to load TTS Dict from DB:", e);
      return text;
    }
  }

  let processed = text;
  for (const rule of cached.compiled) {
    processed = processed.replace(rule.regex, rule.replace);
  }
  return processed;
}
// --- FIN DICTIONARY ---

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
    const { text, intent, voiceId = "Lucia", elevenlabs_voice_id, provider = "polly", voiceType = "guided", gender = "F", clinicId, niche, locale = "es-ES" } = await req.json(); // Lucia is the premium realistic female es-ES voice

    if (!text) {
       return NextResponse.json({ error: "Missing text payload" }, { status: 400 });
    }

    // 1. Sanitize for XML but ALLOW <break> tags to pass through for highly realistic pacing
    let cleanText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/&lt;break(.*?)\/?&gt;/g, "<break$1/>");
      
    // Apply Pronunciation Middleware correctly here
    cleanText = await applyTTSDictionary(cleanText, clinicId, niche, locale);

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
          
        // Map semantic intents to voice modulation
        let stability = 0.5;
        let similarity_boost = 0.75;
        if (intent === "GREETING") {
          stability = 0.70; similarity_boost = 0.85;
        } else if (intent === "QUESTION") {
          stability = 0.40; similarity_boost = 0.65;
        } else if (intent === "CONFIRMATION") {
          stability = 0.85; similarity_boost = 0.90;
        }

        const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elevenLabsVoiceId}?optimize_streaming_latency=3`, {
          method: "POST",
          headers: {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": elevenLabsApiKey
          },
          body: JSON.stringify({
            text: noSsmlText,
            model_id: locale.toLowerCase().startsWith('en') ? "eleven_turbo_v2_5" : "eleven_multilingual_v2",
            voice_settings: { stability, similarity_boost }
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
    
    // Select LanguageCode and Voice based on locale and gender
    const isEnglish = locale.toLowerCase().startsWith("en");
    const langCode = isEnglish ? "en-US" : "es-ES";
    let fallbackVoiceId = "Lucia";
    
    if (isEnglish) {
       fallbackVoiceId = gender === "M" ? "Matthew" : "Joanna";
    } else {
       fallbackVoiceId = gender === "M" ? "Sergio" : "Lucia";
    }

    const command = new SynthesizeSpeechCommand({
      Engine: "neural",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      LanguageCode: langCode as any,
      OutputFormat: "mp3",
      Text: ssmlText,
      TextType: "ssml",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      VoiceId: fallbackVoiceId as any,
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
