import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Gigante del Tráfico Informativo' (La Máquina de Contenidos Top of Funnel). Hospital Capilar tiene una estrategia de captación de tráfico bestial. Acumulan más de 67.000 visitas al mes orgánicas. Este volumen masivo se consigue resolviendo innumerables dudas cotidianas ('granos en la cabeza', 'calvas en la cabeza', 'caspa en las cejas', 'dermatitis'). Son una enciclopedia gigante.",
    traffic: "Extremo (+67.100 visitas/mes). Es un volumen de tráfico muy superior a la media del sector. La inmensa mayoría proviene de búsquedas de información y síntomas, no de búsquedas con intención de compra directa.",
    cost: "Con más de 67k visitas, su problema no es la captación, es la RETENCIÓN y CONVERSIÓN de ese inmenso embudo superior (Top of Funnel). Tener 4.300 visitas al post de 'granos en la cabeza' está genial para el ego SEO, pero si esa visita lee y se va sin dejar el email, el coste de oportunidad en ventas perdidas (o el desperdicio de ese posicionamiento) es gigantesco.",
    topPages: "Los artículos del blog arrasan: 'Granos en la cabeza' (4.309v), 'Partes de la cabeza' (2.660v), la propia Home (1.979v), 'Calvas en la cabeza' (642v), 'Por qué se ponen los pelos de punta' (562v).",
    competitors: "Compiten a escala nacional (tienen clínicas en Madrid, Murcia, Pontevedra) y a nivel SEO compiten con portales médicos fuertes.",
    socialTraffic: "Usuarios que hacen consultas de salud del día a día, buscando autodiagnosticarse (ej. 'Malassezia en el cuero cabelludo'). Nivel de consciencia de dolor: bajo/medio. Muchos ni saben que necesitan una clínica.",
    insights: "PITCH CONSULTIVO Y ESTRATÉGICO:\n'Hola [Nombre], qué tal. Primero de todo, enhorabuena por el trabajo titánico de contenidos que tenéis en Hospital Capilar. Os hemos estado analizando y captar más de 67.000 visitas orgánicas al mes y rankear Top 1 para dudas como «granos en la cabeza» o «dermatitis» es de admirar.\n\nSin embargo, os llamo precisamente porque sabemos el reto enorme al que os enfrentáis con este tipo de tráfico masivo. Tenéis una «Máquina de Tráfico Top of Funnel», pero esos visitantes son extremadamente volátiles: entran, se diagnostican leyendo vuestro artículo de la caspa en las cejas, y desaparecen (El Síndrome del Lector Fantasma). Cuesta muchísimo que den el salto racional para ir hasta la Home o la página de contacto.\n\nLa solución técnica que implementamos para este volumen es un Asistente Médico de IA con Contexto Total. Imagina que el lector que lleva 45 segundos leyendo sobre la caída de pelo por estrés, no ve un aburrido formulario. Ve un pequeño asistente que, proactivamente, le dice: «Veo que te preocupa el estrés y la caída. Esto puede causar efluvio telógeno temporal. ¿Has notado clareos recientes o pérdida de densidad general? En Hospital Capilar podemos valorarlo gratis». \n\nNo interrumpimos, no vendemos a puerta fría. Convertimos la pasividad de la lectura en una conversación interactiva en tiempo real sobre SU dolor específico. Ese es el puente invisible que pasa a vuestros lectores anónimos directamente a vuestro CRM y WhatsApp de recepción.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Podrían deciros: \"Ya nos va bien, ya tenemos formularios en todas las páginas\". -> 'Totalmente, y los formularios son el estándar. Pero la tasa de conversión media de un banner en un blog es del 0.5% por culpa de la «ceguera publicitaria». Nuestro Asistente IA simula una recepción médica virtual humana y personalizada según lo que leen. Está levantando las conversiones un 3x en clínicas con embudos informativos grandes. ¿Por qué no lo probamos y vemos cuántos leads extra rascamos que hoy en día se os van de la web leyendo gratis?'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "hospitalcapilar", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://hospitalcapilar.com/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Hospital Capilar",
          slug: "hospitalcapilar",
          industry: "Clínica Capilar",
          location: "España",
          seoMetrics,
          websites: { create: { url: "http://hospitalcapilar.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Hospital Capilar inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
