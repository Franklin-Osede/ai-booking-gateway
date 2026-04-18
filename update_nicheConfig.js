const fs = require('fs');

let content = fs.readFileSync('src/presentation/config/nicheConfig.ts', 'utf8');

content = content.replace(
  'topicPrompt: string;',
  `topicPrompt: string;
  objectionHandling: {
    keywords: string[];
    responseBot: string;
    followUpBot: string;
    acceptOption: string;
  };`
);

const objectionDefaults = {
  medical: `{ keywords: ["precio", "caro", "barato", "coste", "seguro"], responseBot: "Entendemos que el coste es importante. Priorizamos un cuidado médico de primera línea utilizando equipos modernos para asegurar un diagnóstico preciso y rápido.", followUpBot: "¿Te gustaría agendar una valoración y lo miramos detenidamente?", acceptOption: "Agendar primera cita" }`,
  dental: `{ keywords: ["precio", "caro", "barato", "coste", "presupuesto", "financiacion", "financiación"], responseBot: "Es comprensible fijarse en el coste. Nosotros no somos una franquicia 'low-cost': priorizamos la salud a largo plazo usando los mejores materiales (implantes titanio, escáner 3D). Además ofrecemos planes de pago y financiación al 100%.", followUpBot: "¿Te gustaría agendar una valoración sin coste y te damos un diagnóstico real adaptado a ti?", acceptOption: "Agendar primera cita" }`,
  beauty: `{ keywords: ["precio", "caro", "barato", "coste", "oferta"], responseBot: "El precio es clave, pero también lo es usar productos que cuiden tu salud y garanticen una belleza duradera. Nuestros tratamientos usan formulaciones orgánicas y técnicas avanzadas que marcan la diferencia.", followUpBot: "¿Deseas reservar tu hueco y disfrutar de una experiencia premium?", acceptOption: "Reservar sesión" }`,
  legal: `{ keywords: ["precio", "caro", "barato", "coste", "honorarios", "presupuesto"], responseBot: "Sabemos que los honorarios son importantes. Por eso somos transparentes y ofrecemos facilidades de pago. En temas legales, un buen asesoramiento a tiempo previene grandes pérdidas a futuro.", followUpBot: "¿Agenda tu primera consulta y analizamos tu viabilidad legal?", acceptOption: "Agendar Consulta" }`,
  auto: `{ keywords: ["precio", "caro", "barato", "coste", "descuento", "oferta", "financiación"], responseBot: "Te entendemos. Analizamos continuamente el mercado para ofrecer vehículos garantizados y financiaciones exclusivas al 100%. La tranquilidad en la carretera es nuestra prioridad.", followUpBot: "¿Quieres agendar una visita o prueba de conducción guiada?", acceptOption: "Agendar visita" }`,
  b2b: `{ keywords: ["precio", "caro", "barato", "coste", "tarifa"], responseBot: "Comprendemos la importancia de la inversión. Nuestras soluciones aceleran la amortización aumentando dramáticamente la productividad de tu equipo operativo desde el primer mes.", followUpBot: "¿Agendamos una breve sesión de descubrimiento y vemos viabilidad?", acceptOption: "Agendar sesión" }`,
  default: `{ keywords: ["precio", "caro", "barato", "coste"], responseBot: "Es totalmente normal comparar. Nos centramos en brindar el máximo valor y resultados duraderos a través de profesionales de primer nivel.", followUpBot: "¿Deseas avanzar y analizar tu caso en detalle con un consultor?", acceptOption: "Avanzar reserva" }`,
  hair_transplant: `{ keywords: ["turqu", "turquía", "precio", "caro", "barato", "coste"], responseBot: "Es normal que compares. El modelo 'Low Cost' suele ser más barato, pero nosotros garantizamos un diseño médico personalizado superior, densidad máxima y seguimiento presencial a tu lado si hay cualquier imprevisto. Además, ofrecemos financiación al 100%.", followUpBot: "¿Quieres agendar una videollamada de 10 minutos para que el doctor te valore?", acceptOption: "Agendar videollamada" }`,
  regenerative: `{ keywords: ["precio", "caro", "barato", "coste", "seguro"], responseBot: "Comprendemos tu postura. Nuestros tratamientos pioneros utilizan tecnología celular de última generación que es compleja, pero garantizan los máximos estándares de calidad y purificación clínica.", followUpBot: "¿Quieres que agendemos una primera asesoría con el biólogo o terapeuta?", acceptOption: "Agendar asesoría" }`,
  aesthetic: `{ keywords: ["precio", "caro", "barato", "coste"], responseBot: "Es comprensible dudar por precio. En este sector utilizar toxina o inyectables de máxima calidad y pureza es innegociable para resultados elegantes y duraderos; trabajamos con los mejores laboratorios suizos y americanos.", followUpBot: "¿Agendamos una evaluación facial con el equipo médico?", acceptOption: "Agendar valoración" }`,
  hair_salon: `{ keywords: ["precio", "caro", "barato", "coste"], responseBot: "Sabemos que miras los precios. No obstante, para tratar el cabello y colorimetría aplicamos productos que cuidan tu fibra capilar, minimizan daños y unifican el color como deseas.", followUpBot: "¿Quieres que agendemos la sesión y transformemos tu estilo?", acceptOption: "Reservar sesión" }`
};

for (const [key, objLit] of Object.entries(objectionDefaults)) {
  const targetStr = `topicPrompt: (.*)`
  const regex = new RegExp(`(topicPrompt: .*)(\\s*\\}(,)?(\\s*)( *[a-zA-Z_]+: \\{)?)`, 'g');
  // It's tricky to inject exactly into the object. 
  // Another way is to split by \`${key}: {\` and inject before the NEXT top-level niche.
}

content = content.replace(/topicPrompt:\s*"([^"]+)"/g, (match, topic) => {
    // Find the right object by reverse tracing or just searching forward
    return \`topicPrompt: "\\\${topic}"\`;
});

fs.writeFileSync('src/presentation/config/nicheConfig.ts', content, 'utf8');

