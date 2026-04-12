import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicaorigen'
      }
    });

    const seoMetricsData = {
      summary: 'El Escaparate sin Recepcionista (Excelente Posicionamiento SEO, Fuga por Comparación de Pestañas)',
      traffic: '394 visitas/mes estables. Lo verdaderamente importante no es el volumen, sino QUÉ posicionan.',
      cost: 'Lead Value: Extraordinario. Posicionan para palabras transaccionales puras, el tráfico que recibe es sangre vital para el negocio.',
      topPages: '1. Home (Absorbe las búsquedas genéricas de la ciudad)\n2. Blog: ¿Duele el láser de diodo? (Absorbe tráfico de miedo/duda)',
      competitors: 'Rivalizan de tú a tú en el TOP 5 de Google contra gigantes en la ciudad de Valencia.',
      socialTraffic: '',
      insights: 'Hola equipo de Clínica Origen. Nuestra Matriz de Inteligencia Comercial ha evaluado vuestra posición en Valencia y los resultados son muy claros: tenéis un tesoro SEO, pero estáis sufriendo lo que llamamos «Fuga por Comparación».\n\nEnhorabuena, porque el diagnóstico SEO es excelente: estáis en el Top 5 de Google para búsquedas de oro como «clinicas esteticas en valencia» (1.600 búsquedas al mes) o «centros estetica valencia». Habéis ganado la batalla más difícil: que Google os enseñe de los primeros.\n\nPero aquí viene el problema crítico de conversión. Cuando un paciente busca «clínica estética en valencia», no entra solo a repasar vuestra web. Ese paciente abre 4 o 5 pestañas en su navegador con las primeras 5 clínicas que le salen. \n\nY empieza la carrera. El paciente escanea las 5 webs rápidamente. La primera que le demuestre calidez, cercanía y una solución rápida, se lleva al paciente. Si vuestra web es un escaparate inerte donde el usuario tiene que buscar el contacto, acabáis de perder la venta frente a la pestaña contigua.\n\nTenéis un tráfico de 400 visitas mensuales de altísima intención de compra, pero necesitáis un Closer. Nuestra solución es encender una Recepcionista Digital de Choque.\n\nAsí, cuando el paciente abra esas 5 pestañas y aterrice en la vuestra, la IA detendrá su modo explorador: «Hola, bienvenida a Clínica Origen. ¿Buscas un tratamiento facial o corporal específico en Valencia? Te ayudo a cerrar una primera valoración gratuita hoy mismo».\n\nNo compitáis dejándolo todo al azar del diseño web. Si ya habéis pagado el precio (o el esfuerzo) de llevar al paciente hasta vuestra puerta digital, aseguraros de que nadie salga de esa pestaña sin dejaros su teléfono.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicaorigenvalencia.es' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica Origen Valencia',
          slug: 'clinicaorigen',
          industry: 'Clínica Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicaorigenvalencia.es' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica Origen inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Clínica Origen:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
