import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const wpText = "\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si te dicen que tienen recepcionista: 'Con vuestro brutal catálogo de terapias intravenosas y aparatología tan específica (Endoláser, Slim Up, Blefaroplasma), un formulario o un WhatsApp es un embudo de dudas. El cliente necesita saber si le conviene Magnesio o Glutatión. El Asistente IA actúa como consultora médica 24/7. Les guía por el menú de servicios al milisegundo, les da confianza científica y cierra la venta on-site. Pasamos de tener dudas en un chat a tener citas cerradas en el calendario.'";

  const seoMetrics = {
    summary: "Arquetipo: 'El Escaparate Oculto'. Tienen una Home rotunda (casi 500 visitas) y lideran en nichos súper específicos (Aparatología y Sueroterapia). Sin embargo, su página dedicada a captar 'Clínica estética Sevilla' está muerta (2 visitas, página 2 y 3).",
    traffic: "Tráfico envidiable a la Home y a nichos: Láser Alejandrita (118 visitas), Glutatión Intravenoso (72 visitas). Venden tratamientos muy 'premium'.",
    cost: "El catálogo es tan extenso y técnico (Endoláser, Slim Up, Terapia Myers) que el usuario necesita mucha asesoría. Si la captación no es inmediata y guiada, el coste de oportunidad por confusión del usuario es monumental.",
    socialTraffic: "71 enlaces a la Home y 90 compartidos en Facebook. Tienen comunidad y pacientes fidelizados.",
    topPages: "Dominan la Home y los tratamientos nicho (Glutatión, Alejandrita, Vitamina C). Curiosamente, las landings diseñadas específicamente para el SEO general (como /clinica-estetica-sevilla) tienen literalmente 2 visitas.",
    competitors: "Están perdiendo la liga central. En 'clinica de estetica en sevilla' (volumen de dinero general) están en posición 19. En 'estetica sevilla' están en posición 58 (página 6).",
    insights: "PITCH DIRECTO AL OWNER (Foco en Venta Consultiva 24/7 y Rescate de Landing Local):\n'Llevo un rato analizando la arquitectura de Clínica Carrasco de arriba a abajo y tenéis un caso fascinante. Por un lado, os doy la enhorabuena: sois líderes en tratamientos nicho premium. Vuestras páginas de Glutatión intravenoso, Láser Alejandrita y Vitamina C están metiendo cientos de visitas al mes de clientes altamente cualificados.\n\nPero tengo que poneros la señal de alarma en vuestra estrategia general de captación local. Vuestra landing específica de 'Clínica Estética Sevilla' está en coma. Tiene 2 visitas orgánicas al mes y está hundida en la posición 19 o peor. Atraéis a clientes que buscan la aguja en el pajar (tratamientos específicos), pero los que buscan 'el pajar' (clínica de estética general en Sevilla) se los está llevando la competencia.\n\nFase 1: Vuestro menú de servicios es tan avanzado y clínico (Blefaroplasma, Endoláser, Sueroterapia) que genera dudas. El cliente que entra por Glutatión necesita saber si le encaja o qué precio tiene. Si le deriváis a un WhatsApp lento, se enfría. Os pongo al Asistente Médica IA hoy mismo para que opere como consultora científica: resuelve dudas precisas sobre cada terapia intravenosa y aparatología, y le reserva la butaca en el momento.\n\nFase 2: Con la IA subiendo la conversión de los tratamientos nicho, usamos ese oxígeno financiero para operar a corazón abierto vuestra landing de 'Clínica Estética Sevilla' y traccionarla desde la página 3 al top de Google.'" + wpText
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "carrasco" } }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://clinicacarrasco.com/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Carrasco",
          slug: "clinicacarrasco",
          industry: "Medical Aesthetics / Wellness",
          location: "Sevilla",
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://clinicacarrasco.com/" }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Carrasco inyectado" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
