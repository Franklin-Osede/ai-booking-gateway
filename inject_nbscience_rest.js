import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  const summary = "Arquetipo: «El Monstruo Académico / El Efecto Wikipedia».\n\nRealidad Granular: Analizando las métricas de NBScience, nos encontramos ante un caso espectacular pero engañoso de volumen SEO. Tenéis un DA sólido (30), casi 6.000 backlinks y una tendencia de tráfico al alza con 1.410 visitas mensuales y más de 4.600 keywords. Sin embargo, al diseccionar estas palabras clave, descubrimos una gigantesca proporción de 'Tráfico de Estudiante o Investigador'. Ranqueáis altísimo por conceptos enciclopédicos como 'alfa 1 globulina', 'células totipotentes', e incluso 'greenland shark'. \n\nTenéis un cañón de tráfico, pero el 80% está compuesto por curiosos, universitarios o investigadores, diluyendo drásticamente la visibilidad de los tratamientos clínicos de altísimo ticket ('terapia con células madre', 'congelar cordón umbilical').";

  const cost = "Fuga Crítica: El Coste de Buscar una Aguja en un Pajar. Con más de 1.400 visitas de carácter tan mixto, vuestro embudo de ventas sufre lo que llamamos 'Fricción por Saturación'. El paciente real, un perfil premium que busca terapia regenerativa para Parkinson, artrosis o enfermedades autoinmunes, aterriza en una web densa e hipercualificada. \n\nSi dejáis que el peso del contacto recaiga sobre botones estáticos, un formulario web tradicional, o el clásico botón de WhatsApp, corréis un doble riesgo letal:\n1) El paciente premium de alto ticket (generalmente mayor o en situación de estrés por su salud) se abruma ante la jerga médica o la estructura de la web y abandona sin hacer clic en WhatsApp.\n2) Vuestro tiempo se desperdicia si un perfil curioso/estudiante decide escribir al WhatsApp para hacer preguntas académicas.";

  const insights = "Equipo de NBScience: Vuestros números orgánicos son la envidia de muchas clínicas, pero tenéis un problema de \"cualificación extrema\". \n\nCuando entra un flujo constante de personas buscando definiciones de \"células madre hematopoyéticas\", el típico botón de WhatsApp o el formulario de contacto se vuelve ineficiente. El paciente de 50 años buscando un tratamiento para su artrosis degenerativa no quiere iniciar un chat en frío por WhatsApp sin saber si le vais a responder con jerga médica o si sois la opción correcta. Necesita una mano que le guíe inmediatamente.\n\nAquí entra la IA como vuestro 'Filtro Quirúrgico de Alta Precisión'. A diferencia del WhatsApp reactivo, nuestro Asistente Médico salta de forma proactiva al detectar al usuario: «Hola, bienvenido a NBScience. Veo que estás revisando información sobre terapias con células madre. ¿Eres un profesional/investigador buscando información clínica, o eres un paciente interesado en evaluar un tratamiento regenerativo específico para tu caso?». \n\nCon un solo movimiento, la IA:\nA) Evacúa a los estudiantes/curiosos ofreciéndoles enlaces a papers.\nB) Extiende la alfombra roja al paciente de alto ticket, dándole un trato VIP, resolviendo sus dudas de salud en un lenguaje empático, mitigando sus miedos y agendando u organizando la teleconsulta clínica sin que haya tenido que pensarse dos veces si hacer clic en el WhatsApp.";

  const metrics = {
    summary,
    cost,
    insights,
    traffic: "En Expansión pero Diluido: 1.410 visitas mensuales con clara tendencia al alza reciente. DA 30 y casi 6.000 Backlinks.",
    topPages: "Top Tráfico (Baja intención comercial): Artículos sobre 'greenland shark', 'alfa 1 globulinas', 'células totipotentes vs pluripotentes'. Mucho tráfico botánico/académico.",
    competitors: "Dominan la franja informativa, pero corren el riesgo de perder al paciente \"listo para comprar\" frente a clínicas que van directo a la venta emocional del tratamiento celular.",
    socialTraffic: "Todo el esfuerzo orgánico e informativo actual necesita un \"portero\" (IA) que separe de forma despiadada la facturación del simple tráfico de vanidad."
  };

  const getRes = await fetch(`${SUPABASE_URL}/rest/v1/Clinic?slug=eq.nbscience`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });

  const clinics = await getRes.json();

  if (clinics.length > 0) {
    const id = clinics[0].id;
    const updRes = await fetch(`${SUPABASE_URL}/rest/v1/Clinic?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ seoMetrics: metrics })
    });
    console.log("Updated nbscience via REST API", await updRes.text());
  } else {
    const createRes = await fetch(`${SUPABASE_URL}/rest/v1/Clinic`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: "NBScience",
        slug: "nbscience",
        industry: "Medicina Regenerativa / Terapia Celular",
        seoMetrics: metrics,
        websites: [{ url: "http://nbscience.com/" }]
      })
    });
    console.log("Created nbscience via REST API", await createRes.text());
  }
}

main().catch(console.error);
