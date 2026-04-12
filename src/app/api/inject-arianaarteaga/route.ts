import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicasdraarianaarteaga'
      }
    });

    const seoMetricsData = {
      summary: 'El Ecommerce Accidental (Crecimiento Constante pero Tráfico Mixto)',
      traffic: 'Crecimiento sostenido muy saludable: De 500 a 1,470 visitas orgánicas mensuales. Gráfica en verde.',
      cost: 'Lead Value: Dividido. Tienen el oro (Posición 1 en Armonización Facial Valencia) pero mucha paja (personas buscando comprar cremas Colorescience/Isdin a nivel nacional).',
      topPages: '1. Armonización Facial (Alto Ticket)\n2. Productos Colorescience/Fillmed/Isdin (Bajo Ticket/Ecommerce)',
      competitors: 'Lideran en tratamientos de alto valor específicos (Armonización, Radiesse), pero compiten con primor o farmacias en el área de productos.',
      socialTraffic: '',
      insights: 'Hola equipo de la Dra. Ariana Arteaga. Vuestra auditoría técnica es de las más interesantes que hemos analizado este mes. Tenéis una gráfica de crecimiento envidiable: un ascenso constante hasta las 1,500 visitas mensuales.\n\nNuestro diagnóstico: Sois un «Ecommerce Accidental». Habéis logrado una proeza comercial al posicionar Top 1 para «Armonización facial Valencia» (vuestro verdadero Oro, pacientes de alto ticket locales). Sin embargo, gran parte de vuestro gran volumen de tráfico proviene de búsquedas nacionales de productos: Colorescience, Fillmed, o Isdinceutics.\n\nLa Alerta Comercial (Fuga de Eficiencia): Vuestra web está atrayendo a dos perfiles radicalmente distintos. Por un lado, el paciente local dispuesto a invertir miles de euros en tratamientos médicos. Por otro, el comprador online de Madrid o Barcelona que solo quiere saber si tenéis en stock el protector solar Colorescience Flex.\n\nSi vuestra clínica utiliza los mismos canales de contacto (teléfono, WhatsApp genérico) para ambos perfiles, corréis el riesgo de saturar a recepción atendiendo dudas logísticas de cremas de 40€, mientras un paciente de Armonización Facial se enfría esperando respuesta.\n\nNuestra inyección tecnológica consiste en un «Triage Inteligente por IA». Un sistema capaz de diferenciar de forma autónoma la intención del usuario según la página que visite.\n\nSi el visitante entra en la ficha del serum Isdin, la IA actúa como asistente de tienda: resuelve dudas sobre envíos o stock sin molestar a recepción. Coste de tiempo humano: Cero.\n\nPero si el visitante entra en la landing de Armonización Facial (vuestra joya de la corona), la IA se transforma en una Consultora Médica Premium: «Hola, bienvenida a la clínica de la Dra. Arteaga. Para tratamientos de armonización facial realizamos un estudio personalizado de tus proporciones. ¿Te gustaría agendar una valoración esta misma semana en nuestra clínica de Valencia?».\n\nFiltramos la paja, automatizamos las ventas de bajo ticket, y aceleramos el cierre de los pacientes premium directamente a vuestra agenda.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicasdraarianaarteaga.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínicas Dra. Ariana Arteaga',
          slug: 'clinicasdraarianaarteaga',
          industry: 'Clínica de Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicasdraarianaarteaga.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica Dra Ariana Arteaga inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Ariana Arteaga:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
