import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Castillo Disperso'. Tienen mucho tráfico (1.000+ visitas) sostenido por su propia marca y Autoridad de Dominio (24), pero están captando tráfico basura ('sugar daddy meaning') y están hundidos en la página 5 para la keyword reina ('clínica estética sevilla').",
    traffic: "1.015 visitas mensuales. Su gráfica muestra picos altos en el pasado pero ahora una cierta estabilización a la baja, sostenida casi íntegramente por usuarios que ya buscan su nombre (Clínica Roch).",
    cost: "Están perdiendo todo el pastel comercial y nuevo. Al estar en la posición 44 para 'clínica estetica en sevilla' (1.600 búsquedas/mes), están cediendo a competidores clientes diarios que no les conocen previamente.",
    socialTraffic: "Tienen cierta actividad de enlaces (154 backlinks y páginas compartidas), pero el tráfico está tan disperso entre tratamientos (desde hidroterapia de colon hasta estética pura) que el usuario puede perderse al llegar.",
    topPages: "La Home capta la mayoría. Tienen páginas muy aleatorias atrayendo visitas menores (como un artículo de 'what exactly is sugar daddy meaning'). Las páginas de servicios potentes como Rellenos Faciales apenas traen tráfico orgánico directo.",
    competitors: "En keywords comerciales están en página 5. Sus competidores locales directos se están comiendo el mercado de nueva captación en Sevilla mientras Roch sobrevive de su fama ya creada y boca a boca.",
    insights: "PITCH DIRECTO AL OWNER (Foco en Organización, Filtrado y Recuperación de 'Leads Perdidos'):\n'He estado auditando a fondo vuestro ecosistema digital y hay algo muy claro: tenéis muchísima fuerza como marca. 1.000 visitas al mes os consolidan como un castillo en Sevilla. Todo aquel que busca Clínica Roch, os encuentra.\n\nPero hay una enorme grieta por donde se os está escapando mucho dinero. Primero: estáis relegados a la página 5 para 'Clínica estética Sevilla', lo que significa que el mercado nuevo (gente que aún no os conoce) se lo lleva la competencia. Segundo: parte de vuestro tráfico actual llega por artículos irrelevantes (como curiosidades sociales) o se dispersa entre la hidroterapia de colon y los rellenos faciales.\n\nFase 1: Con tanto tráfico dispar y tanta gente entrando a la Home, vuestra prioridad #1 no es más SEO, es un Filtro de Alta Conversión. Si alguien entra buscando estética facial, no le podemos pedir que navegue, lea o espere un WhatsApp. Le instalamos un Asistente Médico de IA. Desde el segundo 1 de entrar a la web, el asistente segmenta la intención: '¿Buscas estética o colon?' 'Te explico el tratamiento y te cierro cita para el doctor'. Actúa como un triaje médico perfecto. Limpiáis curiosos, atendéis instantáneo y rellenáis agenda en piloto automático.\n\nFase 2: Con la IA convirtiendo a los curiosos, atacaremos el verdadero problema: reposicionar los servicios clave para meterlos en el Top 3 y comerse el pastel de los 1.600 usuarios mensuales que buscan 'Estética Sevilla' y que ahora mismo se llevan las otras clínicas.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si argumentan que los clientes de marca ya les llaman o prefieren trato humano: 'Precisamente porque sois una clínica consolidada, vuestro personal humano no debería estar filtrando preguntas repetitivas o curiosos que entraron por un post del blog. Enviarlos a un formulario o WhatsApp es crear un embudo lento. La IA es el muro de contención Premium: habla como vuestro personal, filtra intenciones y manda al humano solo las citas cerradas y calificadas. Ahorramos tiempo y evitamos que ese lead esporádico cierre la web al primer momento de pereza.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "roch", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' } // Prioriza el primero creado
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://www.clinicaroch.com/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Roch",
          slug: "clinicaroch",
          industry: "Clínica de Medicina Estética",
          location: "Sevilla",
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://www.clinicaroch.com/" }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Clínica Roch inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
