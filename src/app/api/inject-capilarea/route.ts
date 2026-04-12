import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Gigante del Tráfico Informativo' (Síndrome del Lector en la Sombra). Capilárea es un coloso. Actualmente tienen más de 16.000 visitas mensuales orgánicas (y llegaron a tener 60.000 en 2024). Pero este tráfico es una espada de doble filo: el 95% son curiosos informacionales buscando cosas como 'por qué no me crece el pelo', 'alisado japonés', 'mechón blanco' o 'día mundial de los calvos'. Tienen un océano de lectores que saturan el blog pero no resuelven la compra.",
    traffic: "Masivo (16.226 visitas/mes). 5.845 keywords orgánicas rankeando. Aunque sufrieron una caída (desde las 60k en 2024), siguen siendo un monstruo de volumen. El reto no es el tráfico, es la intención comercial de ese tráfico.",
    cost: "El coste de oportunidad aquí es el 'Síndrome del Lector en la Sombra'. Atraen mensualmente a miles de personas con problemas reales (efluvio telógeno, caída por estrés, foliculitis), pero esos usuarios leen el artículo, cierran la pestaña y se van a su casa sin consultar a un médico, porque el paso de *leer un post* a *llamar a recepción* es demasiado alto.",
    topPages: "Top 1: '¿Por qué no me crece el pelo?' (401v). Top 3: 'Alisado Japonés' (255v). Top 4: 'Poliosis / Mechón blanco' (191v). Muchísima cola larga de curiosidad.",
    competitors: "Compiten con blogs gigantes como Hospital Capilar o Insparya. Su volumen de contenido informativo es brutal, atrayendo a audiencias de todo el mundo hispanohablante.",
    socialTraffic: "Bastante alto. La home sola tiene 841 shares en Facebook. El post sobre efluvio telógeno tiene un volumen de backlinks increíble (1614 backlinks). Es un dominio con muchísima autoridad técnica.",
    insights: "PITCH CONSULTIVO: EL EMBUDO PARA EL TRÁFICO INFORMATIVO\n'Hola [Nombre], te llamo porque nuestro equipo ha estado haciendo minería de datos en vuestro ecosistema web y, honestamente, vuestros números son salvajes. Tenéis más de 16.000 visitas mensuales orgánicas (y hemos visto que en 2024 llegasteis a picos de 60.000), sois un absoluto referente de tráfico informativo.\n\nEl desafío que vemos en perfiles de tan alto volumen como Capilárea es lo que llamamos el 'Síndrome del Lector en la Sombra'. Atraéis una barbaridad de tráfico de curiosidad: por ejemplo, tenéis casi 400 visitas mensuales buscando «por qué no me crece el pelo» o rankeáis casi 4.400 búsquedas de «efluvio telógeno». Pero esta gente lee el artículo a las 11 de la noche, que es buenísimo, y se va sin llamar. La fricción entre leer un blog y atreverse a mandar un WhatsApp saca del embudo al 95% de vuestros pacientes potenciales.\n\nNosotros instalamos Asistentes de IA que leen todo vuestro contenido. Su fusión perfecta se da precisamente en perfiles como el vuestro: cuando alguien termina de leer vuestro post con 1.614 backlinks sobre 'Efluvio Telógeno', el Asistente le abre conversación *EXACTAMENTE* sobre ese tema, de forma proactiva y anónima. Resuelve dos dudas, quita el miedo e inmediatamente le precalifica pidiéndole el teléfono para una consulta.\n\nNo cambiamos vuestro SEO ni vuestra web. Solo actuamos de red para atrapar a esas 16.000 visitas mensuales que ahora mismo se os están escapando.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dudan o dicen que su recepcionista atiende bien: 'Justamente de eso se trata. Vuestra recepción seguro que cierra súper bien. Pero una o dos recepcionistas no pueden interactuar de forma inmediata y 24/7 con el aluvión de 16.000 visitas que os aporta el SEO. La IA es el tripulante extra: suaviza a esos miles de curiosos en la primera barrera, les quita el miedo al anonimato y les pide el teléfono. A vuestro equipo humano solo le llega la «crema» (los leads ya filtrados y listos).'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "capilarea", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://capilarea.com/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Capilárea",
          slug: "capilarea",
          industry: "Tratamiento del Cabello",
          location: "España",
          seoMetrics,
          websites: { create: { url: "http://capilarea.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Capilárea inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
