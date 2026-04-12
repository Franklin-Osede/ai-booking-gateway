import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'La Estrella Ascendente / Tráfico Frío Top-of-Funnel'. Están haciendo un trabajo SEO excelente con un crecimiento sostenido de 100 a más de 400 visitas. El problema es la 'temperatura' de ese tráfico: mucha gente entra buscando informarse sobre 'entradas en el pelo' o 'dutasteride', en lugar de buscar directamente operarse.",
    traffic: "401 visitas orgánicas mensuales. Gráfica en crecimiento puro y constante.",
    cost: "El tráfico informacional (Top of Funnel) rebota rápido porque el usuario solo viene a leer. Si no hay un elemento dinámico e interactivo que 'pesque' a ese curioso y le ofrezca un análisis sin compromiso, todo ese buen trabajo SEO se pierde en visitas que no convierten.",
    topPages: "Home, blog sobre 'entradas en el pelo' y artículo sobre 'dutasteride'.",
    competitors: "Compiten con gigantes como Insparya por las KW informacionales, pero tienen fuelle local en Valencia.",
    socialTraffic: "Bajo, enfoque puramente en contenido orgánico SEO.",
    insights: "PITCH CONSULTIVO: CALENTANDO EL TRÁFICO FRÍO\n\n'Hola equipo de Salud Capilar. Primero, enhorabuena: he revisado vuestro histórico SEO y tenéis una curva de crecimiento envidiable, pasando de 100 a más de 400 visitas al mes. Estáis haciendo las cosas muy bien.\n\nPero hay un detalle importante: gran parte de vuestro volumen viene de gente buscando qué hacer con sus entradas o qué es el dutasteride. Este es tráfico muy frío (Top of Funnel). Un hombre que busca información sobre sus entradas en Google suele tener mucha vergüenza y rara vez descuelga el teléfono para llamar a una clínica tras leer un artículo.\n\nPara capitalizar todo vuestro tráfico informacional, necesitáis un puente. Un Asistente de IA en esos artículos que, de forma anónima, les diga: «Veo que te preocupan tus entradas. ¿Quieres que te envíe un presupuesto estimado basado en tu grado de alopecia?». Transformamos al lector asustado en un paciente agendado.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: "clinicasaludcapilar" },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://clinicasaludcapilar.com/" } }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Salud Capilar",
          slug: "clinicasaludcapilar",
          industry: "Clínica Capilar",
          location: "Valencia",
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://clinicasaludcapilar.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Salud Capilar inyectada correctamente." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
