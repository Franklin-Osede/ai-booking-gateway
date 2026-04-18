import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, niche, brandName, locale = "es-ES" } = await req.json();
    const isEnglish = String(locale).toLowerCase().startsWith("en");

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Niche based context
    let contextStr = isEnglish ? "medical clinic" : "clínica médica";
    let specifics = "";
    if (niche === 'hair_transplant') {
      contextStr = isEnglish ? "hair transplant clinic" : "clínica de injerto capilar";
      specifics = isEnglish
        ? "Treatments: FUE, DHI, PRP. Do not diagnose diseases. If asked about sleep/pain, explain local anesthesia and minimal discomfort. For price objections, focus on medical quality and close follow-up. For deep diagnosis demands, offer a free assessment."
        : "Tratamientos: Técnica FUE, DHI, PRP. No diagnostiques enfermedades. Si preguntan si duerme, di que es anestesia local casi indolora. Si dudan por precio, enfoca en calidad médica local y seguimiento continuo. Si dicen algo fuera de lugar o exigen diagnóstico profundo, ofréceles reservar una cita gratuita.";
    } else if (niche === 'dental') {
      contextStr = isEnglish ? "dental clinic" : "clínica dental";
      specifics = isEnglish
        ? "Treatments: implants, orthodontics, whitening. Do not diagnose severe infections. For fear of pain, reassure with modern technology and route to specialist booking."
        : "Tratamientos: Implantes, Ortodoncia, Blanqueamiento. No diagnostiques infecciones severas. Frente a miedo al dolor, tranquiliza mencionando tecnología moderna y derivando al especialista mediante una cita.";
    } else if (niche === 'regenerative') {
      contextStr = isEnglish ? "regenerative medicine clinic" : "clínica de medicina regenerativa";
      specifics = isEnglish
        ? "Treatments: stem cells, exosomes, anti-aging. Promise realistic outcomes, never claim cures for cancer/chronic diseases without medical evaluation. Guide users to a consultation."
        : "Tratamientos: Células madre, exosomas, antienvejecimiento. Promete resultados realistas, nunca decir que cura el cáncer o enfermedades crónicas sin estudio médico previo. Llevar a consulta valorativa.";
    }

    const brand = brandName || (isEnglish ? "our clinic" : "nuestra clínica");

    const systemPrompt = isEnglish
      ? `You are Laura, an empathetic assistant for ${brand}, a ${contextStr}.
Your objective is to provide high-value guidance without pressure, and move users softly to booking only when they are ready.

STRICT CONVERSATIONAL STRATEGY:
1. Frictionless support: answer doubts with strong value and end with one gentle open question.
2. PATIENCE: DO NOT suggest booking in the first or second reply unless user explicitly asks.
3. Technical rules: ${specifics}
4. Anti-hallucination: if unclear, ask clarifying questions instead of inventing.
5. Natural CTA: only when user shows buying intent, ask if they want available dates.
6. LENGTH: max 2 short sentences, voice-friendly punctuation and pauses.

Magic UI rule: if user clearly accepts checking schedule/booking, include exactly "[SHOW_CALENDAR]".`
      : `Eres Laura, tu rol es asesorar empáticamente a los pacientes para ${brand}, una ${contextStr}.
Tu objetivo es informar dando mucho valor médico/técnico, sin presionar, y llevarlos suavemente a una cita solo cuando estén listos.

ESTRATEGIA CONVERSACIONAL ESTRICTA ("Conversacional por defecto + reconducción suave"):
1. Detección sin fricción: Si el usuario te pregunta dudas, respóndele aportando MUCHO valor real y termina con 1 pregunta abierta suave para mantener el hilo.
2. PACIENCIA: NUNCA sugieras agendar una cita o valoración en tu primera o segunda respuesta a menos que el usuario lo pida explícitamente.
3. Reglas Técnicas: ${specifics}
4. Prevención de Alucinación: Si no entiendes bien, pregunta en vez de inventar.
5. Cierre Natural (CTA): solo cuando detectes intención real de avance.
6. RESTRICCIÓN DE LONGITUD: máximo 2 oraciones, con pausas naturales.

Regla de Interfaz Mágica: si acepta ver calendario/agendar, incluye exactamente "[SHOW_CALENDAR]".`;

    const openAiMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openAiMessages,
        temperature: 0.6,
        max_tokens: 150,
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI Error:", errText);
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    let textToSpeak = reply;
    let showCalendar = false;

    if (textToSpeak.includes("[SHOW_CALENDAR]")) {
      showCalendar = true;
      textToSpeak = textToSpeak.replace("[SHOW_CALENDAR]", "").trim();
    }

    // Default cleanup for TTS readability: remove markdown, treat dashes as pauses
    textToSpeak = textToSpeak.replace(/[\*\#\_]/g, "");
    textToSpeak = textToSpeak.replace(/\-/g, ", ");

    if (!isEnglish) {
      // Phonetic Dictionary for TTS Engine (Spanish)
      const phoneticDict: Record<string, string> = {
        "\\bFUE\\b": "F. U. E.",
        "\\bDHI\\b": "D. H. I.",
        "\\bPRP\\b": "P. R. P.",
        "\\bFinasteride\\b": "finastéride",
        "\\bDutasteride\\b": "dutastéride",
        "\\bMinoxidil\\b": "minoxídil",
        "\\bInvisalign\\b": "Invisálain",
        "\\bBotox\\b": "Bótox",
        "\\bLifting\\b": "Lífting",
        "\\bPeeling\\b": "Píling",
        "\\bAnti-aging\\b": "anti éiying",
        "\\bIA\\b": "I. A."
      };

      for (const [pattern, replacement] of Object.entries(phoneticDict)) {
        textToSpeak = textToSpeak.replace(new RegExp(pattern, "gi"), replacement);
      }
      textToSpeak = textToSpeak.replace(/\bDr\./gi, "Doctor");
      textToSpeak = textToSpeak.replace(/\bDra\./gi, "Doctora");
    }

    return NextResponse.json({
      success: true,
      text: textToSpeak,
      showCalendar
    });

  } catch (error) {
    console.error("Chat API error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
