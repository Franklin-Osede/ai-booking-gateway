import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Diamante en Bruto' (Buscando la Aceleración). Clínica Alpha (clinicaalpha.es) tiene una tracción inicial muy sana (464 visitas/mes), demostrando que han hecho un buen trabajo de base. Aunque el volumen grueso entra por búsquedas de su propia marca, están empezando a posicionar muy bien artículos nicho como la comparativa 'Finasteride vs Dutasteride' o 'Mesoterapia Dutasteride en Madrid'.",
    traffic: "Bajo-Medio (464 visitas/mes). Es un tráfico en fase de crecimiento. A diferencia de clínicas invisibles, Alpha ya tiene un flujo mensual constante que combina pacientes de referidos (búsqueda de marca) con curiosos de tratamientos específicos.",
    cost: "El coste de oportunidad está en el esfuerzo desperdiciado. Han conseguido aparecer por delante de la competencia para tratamientos como la 'mesoterapia dutasteride', pero si el paciente entra a investigar y no siente un trato cercano inmediato, se va a otra clínica de Madrid más consolidada.",
    topPages: "El peso lo lleva su página de Inicio (428v), demostrando el poder de su marca local. Pero también captan tráfico cualificado en artículos como 'Finasteride vs Dutasteride' y páginas de tratamiento local 'Mesoterapia Dutasteride en Madrid'.",
    competitors: "Compiten en la jungla de Madrid con gigantes del sector. Posicionar por artículos técnicos y tratamientos específicos ha sido su mejor estrategia para esquivar a los grandes en búsquedas como 'injerto capilar madrid'.",
    socialTraffic: "Tráfico variado. Desde pacientes que ya les conocen hasta usuarios muy informados que buscan concretamente 'mesoterapia con dutasteride' y saben lo que quieren.",
    insights: "PITCH CONSULTIVO Y POSITIVO:\n'Hola [Nombre], qué tal. Primero de todo, enhorabuena por la evolución web. He estado mirando vuestros datos en Clínica Alpha y tenéis una base súper sana, rozando las 500 visitas orgánicas. Me gusta mucho cómo habéis esquivado a los gigantes posicionando directamente por nichos de alto valor como «mesoterapia con dutasteride».\n\nEl motivo de mi llamada es porque trabajamos con perfiles de clínicas exactamente como el vuestro: clínicas que hacen las cosas muy bien, atraen un tráfico cuidado y especializado, pero chocan con el mismo problema que todos: el usuario hoy en día es comodón y le cuesta rellenar un formulario o iniciar un WhatsApp desde cero en la web.\n\nSi de esas casi 500 visitas, solo os está entrando un pequeño porcentaje de consultas, es una lástima. Lo que hacemos nosotros es ayudaros a aprovechar al máximo el tráfico que YA tenéis. Instalamos un Asistente Capilar Inteligente que da la bienvenida y fomenta la charla. Por ejemplo, si alguien está aterrizando en vuestra página de Finasteride vs Dutasteride, la IA le dice: «Hola, veo que te informas sobre bloqueadores DHT. En Clínica Alpha somos médicos pioneros en mesoterapia con Dutasteride. ¿Has probado algún tratamiento previo?».\n\nEs 100% amigable, no intrusivo y os ayuda a retener a esa persona, sacándole el contacto antes de que se enfríe y regrese a Google a mirar a la competencia.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dudan o dicen que su web funciona: 'No me cabe duda de que funciona, los datos lo dicen. El reto no es arreglar algo roto, sino potenciar vuestra mina de oro actual. Implementar una recepción ininterrumpida y que da contexto inmediato a vuestros tratamientos estrella multiplica la conversión. ¿Por qué no le damos una vuelta a cómo quedaría la IA entrenada con vuestros propios protocolos y precios?'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "clinicaalpha", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://clinicaalpha.es/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Alpha",
          slug: "clinicaalpha",
          industry: "Clínica Capilar",
          location: "España",
          seoMetrics,
          websites: { create: { url: "http://clinicaalpha.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Clínica Alpha inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
