import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'La Enciclopedia Médica' (Gladiador de Contenidos). Microcapilar Hair Clinic tiene una estrategia SEO basada en Marketing de Contenidos puro. Tienen un volumen altísimo (3.300+ visitas) sostenido casi enteramente por artículos de blog respondiendo dudas muy específicas de usuarios (Minoxidil, Dutasteride, Hipotiroidismo, Creatina).",
    traffic: "Alto (3.368 visitas/mes). Es un tráfico mayoritariamente 'Top of Funnel' (Informativo). La gente busca síntomas o dudas sobre fármacos capilares en Google y acaba en su blog.",
    cost: "El gran problema del SEO informativo es el Bounce Rate (Tasa de Rebote). Un usuario lee si la creatina deja calvo, obtiene su respuesta y cierra la pestaña sin dejar el email. El coste de oportunidad aquí es perder a miles de lectores mensuales que tienen un problema capilar real pero no reciben un 'empujón' activo para pedir cita.",
    socialTraffic: "Tráfico con muchas dudas médicas. Nivel de consciencia del usuario: Medio (Saben que tienen un problema, buscan la causa/cura, pero aún no buscan 'clínica').",
    topPages: "El 80% de su Top 10 son posts del blog: 'Efectos secundarios minoxidil' (198v), 'Micropigmentación pros y contras' (176v), 'Hipotiroidismo' (127v), 'Finasteride vs Dutasteride' (106v).",
    competitors: "Compiten a nivel informacional con gigantes de la salud (Sanitas, Wikipedia, blogs internacionales). Es mucho más difícil monetizar este tráfico que el de la 'Clínica Mora', que busca cirugía directamente.",
    insights: "PITCH CONSULTIVO Y ESTRATÉGICO (Foco en Monetizar el Blog):\n'Hola [Nombre], he estado analizando vuestra curva de tráfico y la estrategia de contenidos que tenéis es brillante. Tenéis más de 3.300 visitas al mes y habéis creado una auténtica Enciclopedia Médica capilar. Rankear Top 1 en artículos sobre Hipotiroidismo, Dutasteride o Creatina demuestra una autoridad brutal.\n\nEl motivo de mi llamada es porque, trabajando con clínicas que tienen blogs tan potentes, siempre nos encontramos con el mismo muro: el Lector Fantasma. Entran, se leen el post sobre los efectos secundarios del Minoxidil, y se van. Cuesta muchísimo que un lector frío haga clic por sí solo en la página de «Contacto».\n\nLa solución que estamos integrando es un Asistente Médico de IA diseñado específicamente para monetizar blogs. Si un usuario lleva 1 minuto leyendo vuestro post sobre Minoxidil, la IA le habla sutilmente y con contexto: «Veo que te preocupan los efectos secundarios del Minoxidil. Muchos de nuestros pacientes vienen por lo mismo. ¿Estás notando mucha caída reciente? Podemos valorarte gratis en la clínica para buscar alternativas».\n\nTransformamos pasividad (leer) en interactividad (conversar). Capturáis activamente los datos de ese lector antes de que cierre la pestaña, enviándole el Lead caliente directo a vuestra coordinadora. No desaprovecháis ni una sola visita de ese contenido que tanto os ha costado crear.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dicen que ya tienen banners de contacto en el blog: 'Exacto, y los banners son geniales, pero sufren de «ceguera de banner». El usuario moderno los ignora instintivamente. Una conversación proactiva, iniciada por la IA sobre el tema EXACTO que está leyendo, tiene una tasa de retención infinitamente mayor. Es la diferencia entre un cartel estático y un recepcionista que te pregunta cómo puede ayudarte.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "microcapilar", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://microcapilarhairclinic.es/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Microcapilar Hair Clinic",
          slug: "microcapilar",
          industry: "Clínica Capilar",
          location: "España",
          seoMetrics,
          websites: { create: { url: "http://microcapilarhairclinic.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Microcapilar inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
