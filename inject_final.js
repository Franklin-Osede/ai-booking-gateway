/* eslint-disable */
require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const marotoSummary = "Arquetipo: «El Secano Algorítmico / Caída Absoluta». Realidad Granular: Analizando las métricas de Doctora Maroto, queda plasmado un colapso total en visibilidad orgánica. A principios de 2024 se interceptaba un flujo moderado, pero múltiples actualizaciones algorítmicas de Google han sepultado el dominio. A día de hoy, el tráfico orgánico está en CERO absoluto y la única keyword que sobrevive a nivel precario (posición 11) es 'clínica maroto'. Habéis dejado de existir para el paciente frío. Todo visitante actual entra por búsquedas directas (boca a boca) o campañas cerradas (redes sociales).";
  const marotoCost = "Fuga Crítica: El Coste de Fricción en el Tráfico Referido. Al depender en un 100% de esfuerzos propios (visibilidad offline o de Instagram), el paciente que llega os cuesta tiempo y reputación. El coste oculto radica en no convertir este tráfico de alta fidelidad con inmediatez.\n\nContrarrestando la objeción 'Ya tenemos un botón de WhatsApp': El botón de WhatsApp clásico u otros CTAs estáticos depositan todo el peso de dar el 'primer paso' sobre el paciente. Requiere abrir la aplicación, romper el hielo sin contexto y saber qué preguntar. Ese esfuerzo frena en seco a pacientes dudosos, provocando el abandono pasivo del 60% de perfiles de alto ticket que de otra forma hubieran agendado.";
  const marotoInsights = "Equipo de la Doctora Maroto. En el análisis confirmamos un escenario de Secano Absoluto: Google ya no os aporta visitas nuevas. Dependéis exclusivamente de los pacientes que deriváis desde redes sociales o recomendaciones físicas.\n\nEn este escenario premium, la objeción más dura de aceptar es la autocomplacencia del canal actual: «Ya nos entra de vez en cuando un mensaje al WhatsApp». Lo que os proponemos con la IA no es un 'simulador' de WhatsApp, es un agente de intercepción proactiva. En lugar de esperar pasivamente a que el paciente tome valor para iniciar el chat, nuestra IA emerge de forma envolvente y privada: «Hola. Estás en la clínica de la Doctora Maroto. Sabemos que dar el paso en tratamientos regenerativos genera dudas. ¿Hay algo de tu diagnóstico que quieras comentarme de forma confidencial para ver cómo abordarlo?». \n\nNo sustituye el calor de la atención personal, la blinda. Convierte la web en un acelerador de decisiones pre-filtrando y agendando la cita. Al no haber tráfico masivo que desperdiciar, cada visita debe llevarse con pinzas hasta la reserva (el Torniquete de Conversión).";
  const marotoMetrics = {
    summary: marotoSummary, cost: marotoCost, insights: marotoInsights,
    traffic: "En Caída Libre hacia el Nulo Absoluto: 0 visitas orgánicas registradas actualmente. Deslizamiento continuado post-2024. DA: 17. Totalmente excluidos del SEO local.",
    topPages: "Nulo. Solo resiste 'clínica maroto', sin ninguna capacidad para traccionar búsquedas intencionales de 'regeneración dermatológica'.",
    competitors: "Totalmente superados en captación orgánica local por clínicas más modernas. Dependencia forzosa de la reputación.",
    socialTraffic: "Absolutamente crítico. Cualquier estrategia sin un embudo de conversión fuerte ahí será una sangría de inversión en marca."
  };

  const nbSummary = "Arquetipo: «El Monstruo Académico / El Efecto Wikipedia».\n\nRealidad Granular: Analizando las métricas de NBScience, nos encontramos ante un caso espectacular pero engañoso de volumen SEO. Tenéis un DA sólido (30), casi 6.000 backlinks y una tendencia de tráfico al alza con 1.410 visitas mensuales y más de 4.600 keywords. Sin embargo, al diseccionar estas palabras clave, descubrimos una gigantesca proporción de 'Tráfico de Estudiante o Investigador'. Ranqueáis altísimo por conceptos enciclopédicos como 'alfa 1 globulina', 'células totipotentes', e incluso 'greenland shark'. \n\nTenéis un cañón de tráfico, pero el 80% está compuesto por curiosos, universitarios o investigadores, diluyendo drásticamente la visibilidad de los tratamientos clínicos de altísimo ticket ('terapia con células madre', 'congelar cordón umbilical').";
  const nbCost = "Fuga Crítica: El Coste de Buscar una Aguja en un Pajar. Con más de 1.400 visitas de carácter tan mixto, vuestro embudo de ventas sufre lo que llamamos 'Fricción por Saturación'. El paciente real, un perfil premium que busca terapia regenerativa para Parkinson, artrosis o enfermedades autoinmunes, aterriza en una web densa e hipercualificada. \n\nSi dejáis que el peso del contacto recaiga sobre botones estáticos, un formulario web tradicional, o el clásico botón de WhatsApp, corréis un doble riesgo letal:\n1) El paciente premium de alto ticket (generalmente mayor o en situación de estrés por su salud) se abruma ante la jerga médica o la estructura de la web y abandona sin hacer clic en WhatsApp.\n2) Vuestro tiempo se desperdicia si un perfil curioso/estudiante decide escribir al WhatsApp para hacer preguntas académicas.";
  const nbInsights = "Equipo de NBScience: Vuestros números orgánicos son la envidia de muchas clínicas, pero tenéis un problema de \"cualificación extrema\". \n\nCuando entra un flujo constante de personas buscando definiciones de \"células madre hematopoyéticas\", el típico botón de WhatsApp o el formulario de contacto se vuelve ineficiente. El paciente de 50 años buscando un tratamiento para su artrosis degenerativa no quiere iniciar un chat en frío por WhatsApp sin saber si le vais a responder con jerga médica o si sois la opción correcta. Necesita una mano que le guíe inmediatamente.\n\nAquí entra la IA como vuestro 'Filtro Quirúrgico de Alta Precisión'. A diferencia del WhatsApp reactivo, nuestro Asistente Médico salta de forma proactiva al detectar al usuario: «Hola, bienvenido a NBScience. Veo que estás revisando información sobre terapias con células madre. ¿Eres un profesional/investigador buscando información clínica, o eres un paciente interesado en evaluar un tratamiento regenerativo específico para tu caso?». \n\nCon un solo movimiento, la IA:\nA) Evacúa a los estudiantes/curiosos ofreciéndoles enlaces a papers.\nB) Extiende la alfombra roja al paciente de alto ticket, dándole un trato VIP, resolviendo sus dudas de salud en un lenguaje empático, mitigando sus miedos y agendando u organizando la teleconsulta clínica sin que haya tenido que pensarse dos veces si hacer clic en el WhatsApp.";
  const nbMetrics = {
    summary: nbSummary, cost: nbCost, insights: nbInsights,
    traffic: "En Expansión pero Diluido: 1.410 visitas mensuales con clara tendencia al alza reciente. DA 30 y casi 6.000 Backlinks.",
    topPages: "Top Tráfico (Baja intención comercial): Artículos sobre 'greenland shark', 'alfa 1 globulinas', 'células totipotentes vs pluripotentes'. Mucho tráfico botánico/académico.",
    competitors: "Dominan la franja informativa, pero corren el riesgo de perder al paciente \"listo para comprar\" frente a clínicas que van directo a la venta emocional del tratamiento celular.",
    socialTraffic: "Todo el esfuerzo orgánico e informativo actual necesita un \"portero\" (IA) que separe de forma despiadada la facturación del simple tráfico de vanidad."
  };

  const updateMaroto = await prisma.clinic.update({
    where: { slug: 'doctoramaroto' },
    data: { seoMetrics: marotoMetrics }
  });
  console.log("Updated Prisma Maroto");
  
  const updateNb = await prisma.clinic.update({
    where: { slug: 'nbscience' },
    data: { seoMetrics: nbMetrics }
  });
  console.log("Updated Prisma NB");

}

main().catch(console.error).finally(() => prisma.$disconnect());
