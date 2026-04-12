import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const wpText = "\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si te dicen que tienen un equipo enorme en recepción: 'Con 4.000 visitas puras comerciales al mes, vuestro equipo humano está operando como un Call Center resolviendo dudas repetitivas (precio de rinomodelación, dudas de láser) en vez de hacer cierres en caliente. El Asistente IA no viene a reemplazar a nadie, viene a frenar el tsunami. Absorbe el 100% de las preguntas frecuentes, agenda automáticamente a las 3 de la mañana y le entrega a vuestro equipo los clientes ya cerrados. Vais a facturar el doble sin contratar a 3 personas más.'";

  const seoMetrics = {
    summary: "Arquetipo: 'El Titán Absoluto'. Son los reyes indiscutibles de Sevilla. Tienen casi 4.000 visitas mensuales y están en la Posición 1 para literalmente todas las keywords de dinero ('Clínica estética Sevilla', 'Medicina estética Sevilla', etc.).",
    traffic: "Volumen masivo brutal (3.811 visitas). La inmensa mayoría de este tráfico es de altísima calidad comercial, yendo directo a la Home (2.297) y a servicios clave (Rinomodelación, Láser CO2).",
    cost: "Saturación operativa. Con este volumen, el coste de oportunidad ocurre en la recepción. Si no atienden a un lead en menos de 5 minutos, ese usuario vuelve a Google y pincha en el número 2. Además, están atrayendo ruido nacional con artículos sobre 'Ozempic' (100 visitas).",
    socialTraffic: "Autoridad máxima. 1.277 backlinks, 799 a la Home. Tienen un Domain Authority de 27. Intocables a corto plazo a nivel SEO.",
    topPages: "Home (2.297), Rinomodelación (251) y Láser (133). Todo tráfico local transaccional, excepto algunos artículos de blog como Ozempic.",
    competitors: "No tienen competencia real en SEO local general, son los dominadores del tablero (Top 1 en todo).",
    insights: "PITCH DIRECTO AL OWNER (Foco en Absorción, Saturación Operativa y Conversión 24/7):\n'He analizado vuestra presencia digital y, francamente, me quito el sombrero. Sois el Rey de Sevilla. 4.000 visitas al mes y posición número 1 indiscutible en todas las keywords de oro. Vuestro trabajo de SEO es magistral.\n\nPero cuando una clínica llega a vuestro nivel (El Nivel Titán), el problema ya no es cómo atraer tráfico, el problema es cómo gestionarlo sin quemar al equipo y sin perder ventas por saturación.\n\nSi tenéis a 4.000 personas entrando en la web, vuestro WhatsApp y vuestros teléfonos tienen que estar echando humo con preguntas repetitivas: '¿Cuánto vale la rinomodelación?', '¿El láser CO2 duele?'. Si vuestra recepción tarda 20 minutos en contestar a alguien un sábado, esa persona vuelve a Google y entra al que está en la posición 2. La fricción os hace perder decenas de miles de euros al mes.\n\nEl Asistente Inteligente es la pieza que os falta para coronar el monopolio. Se enchufa a la web y actúa como un muro de contención Premium. Absorbe el 100% de las consultas repetitivas al milisegundo, perfila a los pacientes, les resuelve las dudas de tratamientos específicos y reserva la cita en firme a las 3 de la mañana un domingo. Elevamos el ratio de conversión y liberamos a vuestro equipo para que solo tengan que sonreír y facturar cuando el paciente cruce la puerta.'" + wpText
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "rocio" } }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://clinicarociovazquez.com/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Rocío Vázquez",
          slug: "clinicarociovazquez",
          industry: "Plastic Surgery / Medical Aesthetics",
          location: "Sevilla",
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://clinicarociovazquez.com/" }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Rocío Vázquez metida en el dashboard" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
