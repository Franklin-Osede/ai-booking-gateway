import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'draelisamatheus'
      }
    });

    const seoMetricsData = {
      summary: 'El Experto Invisible (Alto Nivel Técnico, nula retención de volumen)',
      traffic: 'Muy bajo (19 visitas/mes). Ha sufrido el síndrome del «Electrocardiograma Errático» con subidas efímeras y caídas al vacío.',
      cost: 'Lead Value: Muy Alto. El poco tráfico que recibe es para términos extremadamente técnicos («polinucleótidos o radiesse»).',
      topPages: '1. Estimuladores de Colágeno (Radiesse®, Ellansé®) - Absorbe la mayor parte de las visitas orgánicas.\n2. Home - Residual.',
      competitors: 'Totalmente desplazada en las búsquedas transaccionales clave («mejor clínica estética valencia») frente a las franquicias de Valencia, donde es relegada a la página 2 y 3.',
      socialTraffic: '',
      insights: 'Hola equipo de la Dra. Elisa Matheus. Hemos cruzado los datos de vuestro dominio en nuestra Inteligencia de Mercado y nos arroja un arquetipo muy peculiar al que llamamos «El Experto Invisible».\n\nLa buena noticia es que Google os respeta a nivel de autoridad técnica: tenéis la primera posición para una búsqueda altamente especializada como «polinucleótidos o radiesse». Esto demuestra conocimiento clínico avanzado.\n\nLa pésima noticia es que, a efectos de facturación bruta, esto no se traduce en pacientes. Vuestro tráfico orgánico es de apenas 19 visitas al mes. Para términos comerciales vitales como «mejor clínica estética valencia», perdéis toda tracción (estáis muy lejos de la primera página).\n\nEste diagnóstico no es para venderos SEO, porque posicionar esas palabras clave en Valencia cuesta una fortuna. Hoy asumimos que sobrevivís por reputación, boca a boca y referidos.\n\nY aquí radica vuestra principal fuga de seguridad. Entendemos que con ese nivel de especialización clínica, los tratamientos que ofrecéis tienen un ticket medio-alto. Sin embargo, cuando alguien entra a leer ese excelente artículo sobre «polinucleótidos o radiesse», la web actúa de forma pasiva.\n\nEse lector, que está buscando activamente un tratamiento inyectable premium, lee el artículo, resuelve su duda médica gratis, y al no ser conducido firmemente a una consulta... se marcha.\n\nNuestra solución es instalar una capa de Inteligencia Comercial hoy mismo: la Recepcionista Digital. En lugar de una web plana, cuando alguien aterrice atraído por vuestro artículo técnico o por cualquier campaña de anuncios, la IA actuará de "Closer" instintivo: \n«Hola, bienvenida. Veo que deseas información sobre estimuladores de colágeno o Radiesse. Es un tratamiento en el que somos expertos clínicos. Para no hacerte perder tiempo, ¿deseas que reservemos una valoración médica con la Dra. Matheus para ver qué necesita exactamente tu piel?»\n\nCada paciente perdido en vuestro nivel de expertise cuesta miles de euros. Dejad de ser una biblioteca de consulta gratuita; convirtamos esa autoridad técnica en citas de alto valor económico.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://draelisamatheus.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Dra. Elisa Matheus',
          slug: 'draelisamatheus',
          industry: 'Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://draelisamatheus.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Dra Elisa Matheus inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Dra Elisa:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
