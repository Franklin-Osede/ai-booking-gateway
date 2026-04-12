import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const wpText = "\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si te dicen que su equipo ya lo atiende manual: 'Con mil visitas al mes, el equipo humano se quema contestando a gente de toda España que solo entra a curiosear qué es la 'tricotilomanía'. Mi Asistente IA actúa como un portero de discoteca VIP: responde al instante a los curiosos para que se vayan contentos sin quitar tiempo al equipo personal, de forma automática, y cuando detecta a un sevillano listo para gastar en medicina estética, le saca los datos y cierra la cita on-site. Tu equipo de recepción solo se dedicará a facturar, no a resolver dudas de Wikipedia.'";

  const seoMetrics = {
    summary: "Arquetipo: 'La Máquina de Curiosos'. Es una clínica con una gráfica en muy buen estado de salud (casi 1.000 visitas), habiendo doblado su tráfico recientemente. Pero hay una trampa: atraen a cientos de curiosos que buscan información pura y dura (qué es la Tricotilomanía, curas postoperatorias), mientras que en keywords de venta dura (Clínica estética Sevilla) están en la página 3.",
    traffic: "Excelente volumen (946 visitas) y fuerte tendencia alcista. Sin embargo, el tráfico está muy diluido en artículos informativos y dudas médicas a nivel nacional.",
    cost: "Están perdiendo la oportunidad de oro: convertir lectores en compradores. Además, en las keywords transaccionales (la gente que busca clínica en Sevilla con tarjeta en mano) están hundidos en la posición 26, por lo que toda su facturación depende de que los lectores de sus blogs acaben pidiendo cita de milagro.",
    socialTraffic: "119 enlaces a la home, pero el blog apenas tiene tracción social. Es SEO de contenidos clásico.",
    topPages: "Detrás de la Home, el pelotazo se lo lleva un artículo sobre 'Tricotilomanía' (el impulso de arrancarse el pelo) con 260 visitas. Son personas buscando ayuda psicológica o remedios, no necesariamente listos para pagar medicina estética.",
    competitors: "En 'clinica estetica sevilla' (la joya de la corona comercial) están en la posición 26. En 'clinica capilar en sevilla' en la 18.",
    insights: "PITCH DIRECTO AL OWNER (Foco en Filtrar y Convertir el Tráfico Informativo):\n'Enhorabuena porque vuestra web es un cohete, rozáis las 1.000 visitas al mes. Pero he estado analizando las entrañas de por qué sube el tráfico y aquí tenemos que ser estrategas: tenéis a mucha gente paseando por el local pero pocas carteras abiertas.\n\nCasi 300 visitas que os entran vienen a leer qué es la 'Tricotilomanía' o a ver el postoperatorio de un pecho. Al mismo tiempo, en 'clínica estética Sevilla' estáis hundidos en la posición 26 (página 3). Atraéis curiosos de toda España, pero os cuesta captar al cliente local que de verdad busca gastar dinero hoy.\n\nEl Asistente Inteligente va a transformar vuestra web en un embudo perfecto por dos motivos. Uno: actúa como filtro. Le da palique y resuelve las dudas al curioso que lee sobre alopecia a nivel nacional, liberando de ese lastre al equipo de atención al cliente. Dos: cuando el bot detecta intención de compra o a un lead de Sevilla, activa el protocolo comercial, le orienta sobre precios y le cierra cita firme en el calendario.\n\nConvertimos la wikipedia capilar y estética que tenéis ahora mismo en una máquina de agendas. Y como fase 2: inyectamos el presupuesto ganado para sacaros del subsuelo (Pos 26) en la palabra 'clínica estética Sevilla' y traeros tráfico de venta directa.'" + wpText
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { OR: [{ slug: { contains: "horizon" } }, { name: { contains: "horizon" } }] }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://horizonclinics.es/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Horizon Clinics",
          slug: "horizonclinics",
          industry: "Medical Aesthetics",
          location: "Sevilla",
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://horizonclinics.es/" }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Horizon metido en vena" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
