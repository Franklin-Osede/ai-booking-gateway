import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Especialista Emergente (Clínica de Autor)'. La Clínica del Dr. Aníbal Mora está experimentando un bonito despunte orgánico reciente, pasando a unas 200 visitas mensuales. Al ser una clínica con el nombre y prestigio del propio doctor, la conversión no va de volumen masivo, sino de generar confianza clínica exquisita.",
    traffic: "En torno a 200 visitas mensuales orgánicas. Es un tráfico muy cualificado que busca soluciones específicas en Madrid. Destaca un despunte reciente en la gráfica, demostrando que el trabajo SEO empieza a dar frutos serios.",
    cost: "Con 200 visitas al mes, cada lead vale oro puro. No se pueden permitir el lujo de las grandes franquicias de que un visitante se marche de la web por falta de información rápida. Su coste de oportunidad es la 'fuga quirúrgica': el paciente que se va a buscar a otro porque le dio apuro llamar o rellenar un formulario frío.",
    socialTraffic: "Se percibe un enfoque muy profesional, apoyado en la figura de autoridad clínica del Dr.",
    topPages: "Principalmente la Home y páginas de altísimo valor añadido: 'técnica FUE Zafiro', 'PRP capilar' y 'mesoterapia femenina'. Son pacientes que ya saben bastante del tema médico.",
    competitors: "Compiten en el ecosistema madrileño ('clínica capilar madrid' top 7), un mar infestado de tiburones corporativos. Su ventaja competitiva contra ellos es el trato personal de autor.",
    insights: "PITCH CONSULTIVO Y MÉDICO (Foco en Clínica de Autor y Conversión Perfecta):\n'Doctor [o Coordinador/a], he estado evaluando su evolución digital reciente y quería darles la enhorabuena. He visto el repunte de sus gráficas de tráfico hacia las 200 visitas orgánicas. En un mercado tan duro como Madrid, posicionarse en Top 7 para 'clínica capilar madrid' es un logro excelente.\n\nAl ser una clínica de autor, firmada por el Dr. Aníbal Mora, ustedes juegan en otra liga diferente a las grandes franquicias 'de cadena de montaje'. El paciente que aterriza en su web busca al especialista, busca confianza médica y un trato hiper-personalizado. El reto con 200 visitas al mes es asegurar que su tasa de conversión sea absolutamente impecable; cada persona que entra es un paciente potencial de alto valor.\n\nLo que he diseñado para clínicas de autor como la suya es una Recepción Virtual Médica con IA. Este asistente se integra en su web y habla en nombre del equipo del Dr. Mora. Cuando un visitante lee sobre la Técnica FUE Zafiro a las 11 de la noche, la IA le atiende, resuelve sus dudas clínicas básicas con total rigor y le pre-cualifica para agendar una valoración presencial. \n\nNo sustituimos la empatía de su equipo, la ampliamos 24/7. Conseguimos que ese tráfico que tanto les cuesta conseguir no se escape y perciba un servicio premium, digno del nombre de la clínica, desde el primer segundo.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dicen que prefieren el trato telefónico humano directo: 'Esa es precisamente la magia. Una clínica de su nivel DEBE tener un trato humano excepcional. La IA sólo hace el «triaje digital». Intercepta a los curiosos, les da información de valor de forma elegante, y envía a su teléfono de WhatsApp o a su coordinadora únicamente a aquellos pacientes que ya están educados y listos para entrar en consulta. Así su equipo humano invierte su tiempo en los pacientes reales, no en responder cuánto cuesta la consulta.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "mora", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://clinicacapilarmora.com/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Capilar Mora",
          slug: "mora",
          industry: "Clínica Capilar",
          location: "España",
          seoMetrics,
          websites: { create: { url: "http://clinicacapilarmora.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Clínica Mora inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
