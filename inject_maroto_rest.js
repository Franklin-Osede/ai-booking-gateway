import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  const summary = "Arquetipo: «El Secano Algorítmico / Caída Absoluta». Realidad Granular: Analizando las métricas de Doctora Maroto, queda plasmado un colapso total en visibilidad orgánica. A principios de 2024 se interceptaba un flujo moderado, pero múltiples actualizaciones algorítmicas de Google han sepultado el dominio. A día de hoy, el tráfico orgánico está en CERO absoluto y la única keyword que sobrevive a nivel precario (posición 11) es 'clínica maroto'. Habéis dejado de existir para el paciente frío. Todo visitante actual entra por búsquedas directas (boca a boca) o campañas cerradas (redes sociales).";

  const cost = "Fuga Crítica: El Coste de Fricción en el Tráfico Referido. Al depender en un 100% de esfuerzos propios (visibilidad offline o de Instagram), el paciente que llega os cuesta tiempo y reputación. El coste oculto radica en no convertir este tráfico de alta fidelidad con inmediatez.\n\nContrarrestando la objeción 'Ya tenemos un botón de WhatsApp': El botón de WhatsApp clásico u otros CTAs estáticos depositan todo el peso de dar el 'primer paso' sobre el paciente. Requiere abrir la aplicación, romper el hielo sin contexto y saber qué preguntar. Ese esfuerzo frena en seco a pacientes dudosos, provocando el abandono pasivo del 60% de perfiles de alto ticket que de otra forma hubieran agendado.";

  const insights = "Equipo de la Doctora Maroto. En el análisis confirmamos un escenario de Secano Absoluto: Google ya no os aporta visitas nuevas. Dependéis exclusivamente de los pacientes que deriváis desde redes sociales o recomendaciones físicas.\n\nEn este escenario premium, la objeción más dura de aceptar es la autocomplacencia del canal actual: «Ya nos entra de vez en cuando un mensaje al WhatsApp». Lo que os proponemos con la IA no es un 'simulador' de WhatsApp, es un agente de intercepción proactiva. En lugar de esperar pasivamente a que el paciente tome valor para iniciar el chat, nuestra IA emerge de forma envolvente y privada: «Hola. Estás en la clínica de la Doctora Maroto. Sabemos que dar el paso en tratamientos regenerativos genera dudas. ¿Hay algo de tu diagnóstico que quieras comentarme de forma confidencial para ver cómo abordarlo?». \n\nNo sustituye el calor de la atención personal, la blinda. Convierte la web en un acelerador de decisiones pre-filtrando y agendando la cita. Al no haber tráfico masivo que desperdiciar, cada visita debe llevarse con pinzas hasta la reserva (el Torniquete de Conversión).";

  const metrics = {
    summary,
    cost,
    insights,
    traffic: "En Caída Libre hacia el Nulo Absoluto: 0 visitas orgánicas registradas actualmente. Deslizamiento continuado post-2024. DA: 17. Totalmente excluidos del SEO local.",
    topPages: "Nulo. Solo resiste 'clínica maroto', sin ninguna capacidad para traccionar búsquedas intencionales de 'regeneración dermatológica'.",
    competitors: "Totalmente superados en captación orgánica local por clínicas más modernas. Dependencia forzosa de la reputación.",
    socialTraffic: "Absolutamente crítico. Cualquier estrategia sin un embudo de conversión fuerte ahí será una sangría de inversión en marca."
  };

  // Check if clinic exists by slug
  const getRes = await fetch(`${SUPABASE_URL}/rest/v1/Clinic?slug=eq.doctoramaroto`, {
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
    console.log("Updated doctoramaroto via REST API", await updRes.text());
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
        name: "Doctora Maroto",
        slug: "doctoramaroto",
        industry: "Medicina Regenerativa",
        seoMetrics: metrics
      })
    });
    console.log("Created doctoramaroto via REST API", await createRes.text());
  }
}

main().catch(console.error);
