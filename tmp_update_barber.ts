import { prisma } from "./src/lib/prisma";
async function main() {
  const summary = "Arquetipo: «El Monstruo Mediático / El Cuello de Botella Operativo».\n\nRealidad Granular: Clínicas Barber es un gigante con un tráfico orgánico masivo de 13.915 visitas al mes. Su posicionamiento está anclado hiper-sólidamente en la marca personal ('Carla Barber' tiene +22k búsquedas mensuales por sí sola) y en tratamientos clave como el relleno de ojeras y labios en sus múltiples sedes (Madrid, Bilbao, Las Palmas).\nSu problema no es la visibilidad: su problema es la escalabilidad operativa de gestionar ese tsumani de tráfico.";
  const cost = "Fuga Crítica: La Saturación Administrativa. Cuando tienes +13.000 personas mensuales entrando a tu web, tu recepción y tus canales de contacto se convierten en un 'call center' de curiosos preguntando precios ('¿cuánto cuesta el ácido?', '¿dónde está la clínica?'). El paciente cualificado VIP que quiere hacerse un 'Total Face' de inmediato entra al mismo embudo saturado que el fan curioso. Un lead de alto ticket abandonará si no tiene una atención inmediata, VIP y sin fricción porque el equipo humano está colapsado atendiendo FAQs.";
  const insights = "Equipo directivo de Clínicas Barber, sois un transatlántico en tráfico SEO. Tenéis +13.000 visitas puras cada mes. Vuestro principal dolor ahora mismo no es 'captar más', es «FILTRAR Y CONVERTIR EN PILOTO AUTOMÁTICO».\n\nNuestro Widget IA se instala en vuestras landings estrella (Ej. /relleno-ojeras-acido-hialuronico/) como un filtro VIP de alta velocidad. Entra el usuario, la IA responde al instante sus dudas sobre precios, duraciones o sedes (Bilbao, Madrid...), pre-cualifica la intención de compra, y agenda automáticamente en vuestro CRM.\n\nDescargáis a vuestra recepción del 80% de preguntas basura y garantizáis que el perfil comprador reserve su cita en el acto, 24/7, sin esperar en líneas telefónicas o WhatsApps saturados.";

  const clinic = await prisma.clinic.findFirst({where: {slug: "clinicasbarber"}});
  const metrics = {
    summary,
    cost,
    insights,
    traffic: "13.915 visitas/mes (Volumen masivo. Top 1% a nivel nacional, traccionado por fuerte marca personal).",
    topPages: "Top Fugas: /relleno-ojeras-acido-hialuronico/ y landings de sedes (Madrid, Bilbao...) saturadas de peticiones recurrentes.",
    competitors: "Por volumen, compite con franquicias gigantes (Dorsia, Londres), pero gana en percepción 'Premium/Boutique'.",
    socialTraffic: "Tráfico social colosal. Dependen de la conversión post-click, que es el eslabón más débil si depende de intervención manual."
  };

  if (clinic) {
    await prisma.clinic.update({where: {id: clinic.id}, data: {seoMetrics: metrics}});
    console.log("Updated clinicasbarber");
  } else {
    await prisma.clinic.create({
      data: {
        name: "Clínicas Barber",
        slug: "clinicasbarber",
        industry: "Medicina Estética",
        seoMetrics: metrics,
        websites: { create: { url: "http://clinicasbarber.com/" } }
      }
    });
    console.log("Created clinicasbarber");
  }
}
main().catch(console.error).finally(()=>console.log("Done"));
