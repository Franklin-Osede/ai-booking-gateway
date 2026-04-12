import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Imperio Saturado'. El titán definitivo (Clínica de Cristiano Ronaldo). Tienen 274.591 visitas orgánicas mensuales y un DA de 47. Son un agujero negro que absorbe todo el tráfico del sector capilar en España. Su reto no es captar, es gestionar la avalancha sin que su equipo humano colapse.",
    traffic: "Brutal (274k+ visitas). Rankean top 3 para términos hiper-genéricos ('minoxidil' 90k búsquedas, 'granos en la cabeza', 'caída del pelo') además de su propia marca fuerte ('insparya' 8k búsquedas). Tienen todo el embudo cubierto.",
    cost: "El coste aquí es operativo e ineficiencia humana. Con 274.000 visitas, su call center o equipo de recepción debe estar saturado de 'preguntas basura' (ej. gente preguntando por remedios caseros). Cada minuto que un humano gasta respondiendo a un curioso, es un minuto menos que dedica a cerrar una cirugía de 6.000€. Están pagando sueldos para filtrar ruido.",
    socialTraffic: "Titánico (42.035 backlinks). Apoyados por campañas de PR masivas y la figura de Cristiano Ronaldo.",
    topPages: "Dominio absoluto gracias al blog. Convierten posts informativos de salud capilar en tráfico masivo.",
    competitors: "Ellos son el estándar. Compiten contra Capilclinic u Hospital Capilar, pero a nivel de volumen de tráfico informativo ahora mismo reinan.",
    insights: "PITCH DIRECTO AL C-LEVEL/DIRCOM (Foco en Eficiencia Operativa y Ahorro en Call Center):\n'He analizado la estructura de Insparya. Sois el indiscutible Imperio del sector. Con más de 270.000 visitas al mes orgánicas y 42.000 backlinks, no necesitáis a nadie que os hable de captar más tráfico. Pero vuestro volumen es vuestro mayor enemigo a nivel operativo.\n\nHe visto que vuestro tráfico viene de gente buscando cirugías, sí, pero también miles de personas buscando 'qué es el minoxidil' o 'hongos en la cabeza'. Si tenéis equipos humanos (call centers o WhatsApp) filtrando a 270.000 personas al mes, estáis quemando dinero a espuertas en horas-hombre. Y peor: por saturación de los canales, los verdaderos pacientes VIP que quieren operarse mañana se quedan en cola o reciben una plantilla fría.\n\nFase 1: Implantación de IA Corporativa de Pre-Triaje. Os instalo una flota de Asistentes de IA que atienda a 10.000 personas a la vez si hace falta, las 24/7. La IA filtra, da las respuestas informativas a los que curiosean, cualifica médicamente el caso, y SOLO manda a vuestros cerradores humanos los leads que ya vienen calientes y con presupuesto. Es como añadir 50 agentes de recepción VIP por una fracción irrisoria del coste laboral.\n\nFase 2: Expansión y omnicanalidad total sin temor a cuellos de botella humanos.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dicen que ya tienen su propio call center grande o bots básicos: 'Los bots básicos (pulsar 1, pulsar 2) frustran al paciente premium, y los humanos se agotan. Mi IA conversa con empatía médica en lenguaje natural. Cifra la experiencia de usuario a la altura de la marca 'Cristiano Ronaldo'. Un paciente potencial se siente escuchado a las 3 de la madrugada un domingo y cierra su cita. Vuestro call center es un coste; mi sistema es un embudo inteligente que elimina el coste y dispara la conversión.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "insparya", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://insparya.es/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Insparya",
          slug: "insparya",
          industry: "Clínica Capilar",
          location: "España",
          seoMetrics,
          websites: { create: { url: "http://insparya.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Insparya inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
