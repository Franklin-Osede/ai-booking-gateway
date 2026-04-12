import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicaivab'
      }
    });

    const seoMetricsData = {
      summary: 'El Tráfico Paparazzi (Visitan la web para leer cotilleo sobre famosas, sin intención de compra)',
      traffic: 'Muy Bajo (79 visitas). La gráfica muestra un pico irreal este año que se ha desplomado dramáticamente.',
      cost: 'Lead Value: Extremadamente Tóxico. Casi todo el tráfico es gente buscando "Ester Exposito antes y despues". Son curiosos, probablemente adolescentes, sin capacidad económica o intención de ir a una clínica en Valencia.',
      topPages: '1. Blog: La transformación facial de Ester Expósito (Se lleva el 80% del tráfico)\n2. Home - 0 visitas orgánicas puras\n3. Servicios (Aumento de labios) - 1 visita.',
      competitors: 'Las grandes clínicas de Valencia no hacen artículos de "Revista Cuore" porque destruye las métricas de conversión. Esto les sitúa fuera del mapa comercial real.',
      socialTraffic: 'Total dependencia. El SEO que tienen genera clics, pero cero euros. Dependen enteramente de su Instagram para financiarse.',
      insights: 'Hola equipo de Clínica IVAB. Hemos realizado un TAC de nuestro escáner SEO a vuestra web y el resultado es lo que llamamos el Síndrome del «Tráfico Paparazzi».\n\nOs hablo claro: Entran 79 personas al mes orgánicamente, pero casi el 80% de esas visitas llegan buscando en Google palabras como "Ester Expósito antes y después" o "Ester Expósito operaciones". Aterrizan en vuestro artículo del blog, satisfacen su curiosidad y se van. Es tráfico basura, sin intención de compra, que os infla las analíticas pero no llena la agenda de la clínica.\n\nMientras tanto, vuestra página principal sobre "Aumento de Labios" recibe estadísticamente 1 visita al mes. Habéis convertido vuestro SEO en una revista de corazón, no en una máquina de ventas.\n\nComo no somos una agencia de SEO, no venimos a venderos artículos nuevos. Venimos a hackear el tráfico que ya tenéis con IA.\n\nSi una chica atraída por el morbo entra a ver qué se ha operado Ester Expósito, nuestra IA detecta en qué página está y lanza un dardo comercial directo a la envidia aspiracional: «Hola, veo que estás leyendo sobre la armonización facial de Ester. El secreto suele ser un perfilado mandibular y un sutil diseño de labios. Si te gustaría saber cómo adaptarlo a tu rostro y qué presupuesto tendría, puedo buscarte un hueco con nuestros doctores para una primera valoración visual».\n\nDejemos de regalar clics fáciles a Google y empecemos a exprimir a esos curiosos, transformando el deseo aspiracional de parecerse a una famosa en un número de teléfono y una cita confirmada en vuestra recepción.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://clinicaivab.es' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica IVAB',
          slug: 'clinicaivab',
          industry: 'Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://clinicaivab.es' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica IVAB inyectada correctamente.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
