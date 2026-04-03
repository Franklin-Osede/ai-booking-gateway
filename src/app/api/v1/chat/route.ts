import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, niche, brandName } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Niche based context
    let contextStr = "clínica médica";
    let specifics = "";
    if (niche === 'hair_transplant') {
      contextStr = "clínica de injerto capilar";
      specifics = "Tratamientos: Técnica FUE, DHI, PRP. No diagnostiques enfermedades. Si preguntan si duerme, di que es anestesia local casi indolora. Si dudan por precio, enfoca en calidad médica local y seguimiento continuo. Si dicen algo fuera de lugar o exigen diagnóstico profundo, ofréceles reservar una cita gratuita.";
    } else if (niche === 'dental') {
      contextStr = "clínica dental";
      specifics = "Tratamientos: Implantes, Ortodoncia, Blanqueamiento. No diagnostiques infecciones severas. Frente a miedo al dolor, tranquiliza mencionando tecnología moderna y derivando al especialista mediante una cita.";
    } else if (niche === 'regenerative') {
      contextStr = "clínica de medicina regenerativa";
      specifics = "Tratamientos: Células madre, exosomas, antienvejecimiento. Promete resultados realistas, nunca decir que cura el cáncer o enfermedades crónicas sin estudio médico previo. Llevar a consulta valorativa.";
    }

    const brand = brandName || "nuestra clínica";

    const systemPrompt = `Eres Laura, tu rol es asesorar empáticamente a los pacientes para ${brand}, una ${contextStr}.
Tu objetivo es informar dando mucho valor médico/técnico, sin presionar, y llevarlos suavemente a una cita solo cuando estén listos.

ESTRATEGIA CONVERSACIONAL ESTRICTA ("Conversacional por defecto + reconducción suave"):
1. Detección sin fricción: Si el usuario te pregunta dudas, respóndele aportando MUCHO valor real y termina con 1 pregunta abierta suave para mantener el hilo (ej: "¿Hace mucho tiempo que te preocupa esto?" o "¿Has probado algún remedio antes?").
2. PACIENCIA: NUNCA sugieras agendar una cita o valoración en tu primera o segunda respuesta a menos que el usuario lo pida explícitamente. Dedícate primero a resolver sus miedos.
3. Reglas Técnicas: ${specifics}
4. Prevención de Alucinación: Si el usuario dice algo que no entiendes bien, NUNCA inventes. Pregunta amablemente: "Disculpa, ¿te refieres a los precios, al cuidado preventivo o te gustaría saber la disponibilidad médica?".
5. Cierre Natural (CTA): ÚNICAMENTE cuando detectes intención real de avance (ej: "me gusta", "¿qué pasos seguimos?", "quiero hacerlo"), lánzale suavemente tu CTA: "¿Quieres que echemos un vistazo a las fechas libres del doctor?".
6. RESTRICCIÓN DE LONGITUD: TUS RESPUESTAS DEBEN SER MUY CORTAS (Máximo 2 oraciones). Eres un bot de voz y si hablas más de 5 segundos el usuario cortará. Usa PUNTOS y COMAS, no uses listas.

Regla de Interfaz Mágica: Si el usuario acepta formalmente ver el calendario o agendar (ej: "sí, miremos agenda", "¿qué huecos tienes?"), incluye exactamente la palabra "[SHOW_CALENDAR]" para que la pantalla local haga el pop-up mágico.`;

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

    // Default cleanup for TTS readability
    textToSpeak = textToSpeak.replace(/[\*\#\-\_]/g, "");

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
