import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'micropigmentacionthay'
      }
    });

    const seoMetricsData = {
      summary: 'El Especialista de Nicho (Micropigmentación + Formación)',
      traffic: '548 orgánicas / mes (Tráfico inestable local/transaccional, bajando desde picos de 4K)',
      cost: 'Lead Value: Muy Alto (Tratamientos High Ticket + Venta de Cursos de Formación). La fuga de un solo alumno/paciente duele mucho.',
      topPages: '1. Home (Micropigmentación Valencia)\n2. Post: Famosos y Micropigmentación\n3. Cejas & Labios',
      competitors: 'Otros centros de estética avanzada e institutos de formación en Valencia.',
      socialTraffic: '',
      insights: 'Hola equipo de Micropigmentación Thay. Hemos analizado vuestra presencia digital y vemos que lideráis búsquedas muy rentables en Valencia como "micropigmentación capilar" o "curso nanoblading". \n\nSin embargo, combináis dos tipos de cliente muy distintos: el paciente que busca un tratamiento estético (con miedos sobre el dolor o el resultado final) y el profesional que busca formación y rentabilidad. \n\nVuestro tráfico de ~500 visitas mensuales vale oro porque es hiper-transaccional, pero un simple botón de WhatsApp o formulario de contacto obliga al usuario a "dar el salto" en frío. Necesitáis un Filtro de Triaje de IA entrenado específicamente en vuestras técnicas y cursos, que pueda interceptar al visitante 24/7 y decirle: "¿Buscas formación profesional o un diagnóstico para tu caso capilar/facial? Responde 2 preguntas y vemos si encajas". \n\nSe trata de elevar la percepción de exclusividad desde el segundo uno.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Micropigmentación Thay',
          slug: 'micropigmentacionthay',
          url: 'micropigmentacionthay.es',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Micropigmentación Thay inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Thay:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
