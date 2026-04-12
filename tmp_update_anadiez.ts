import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «La Boutique Escondida / Supervivencia en la Escasez».\n\nRealidad Granular: La Dra. Ana Díez compite en un entorno de extrema escasez de tráfico. Su dominio apenas genera 329 visitas mensuales (unas 10 visitas diarias). Solo ranquea por 65 palabras clave, principalmente su propio nombre y un par de tratamientos 'trend' muy específicos como 'Láser Génesis' o 'Vampiro Facial'. Su visibilidad SEO es crítica.";
  const cost = "Fuga Crítica: El Coste por Escasez. Cuando solo tienes 10 personas nuevas al día entrando a tu clínica digital, una tasa de rebote del 90% (lo habitual en clínicas) significa que terminas el mes con 0 o 1 paciente captado desde la web web. La fuga real aquí no es perder volumen, es dejar que la poquísima gente interesada en tratamientos caros ('Intralipoterapia', 'Vampire Facial') no se sienta atrapada y valorada desde el segundo uno.";
  const insights = "Dra. Ana Díez, hemos visto que vuestro volumen orgánico es de apenas 300 visitas al mes. Con este nivel de tráfico, no hay margen para dejarlos navegar tranquilamente; la proactividad tiene que ser absoluta. No podéis depender de que ellos encuentren el botón de WhatsApp y se atrevan a escribir.\n\nNuestro Widget Inteligente soluciona el 'Problema de Escasez'. De las 10 personas que entran hoy a informarse sobre el 'Láser Génesis', la IA las recibe de frente: «Hola, veo que estás mirando nuestro tratamiento Láser Génesis. Soy la asistente médica directa de la Dra. Ana. Dada nuestra disponibilidad limitada, ¿te gustaría que te reserve un hueco rápido para una valoración esta misma semana?».\n\nConvertimos una web pasiva con poco tráfico en una clínica boutique donde el paciente frío se siente atendido exclusivamentedesde el primer clic.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "dranadiez"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "Crítico: 329 visitas/mes (Menos de 11 visitas diarias. Margen de error en conversión del 0%).",
    topPages: "Top Fugas: /laser-genesis/, /intralipoterapia/ - Tratamientos nicho de buen ticket donde cada rebote es una pérdida severa.",
    competitors: "No compite en volumen. Su único juego viable actualmente es el hiper-localismo o la retención absoluta del poco tráfico que entra.",
    socialTraffic: "Vital. Si el SEO no tracciona (DA 8), tienen que estar gastando en ADS o generando contenido fuerte en Instagram para sobrevivir."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated dranadiez");
  } else {
    await prisma.clinic.create({
      data: {
        name: "Dra. Ana Díez",
        slug: "dranadiez",
        industry: "Medicina Estética",
        seoMetrics: metrics,
        websites: { create: { url: "http://dranadiez.com/" } }
      }
    });
    console.log("Created dranadiez");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));
