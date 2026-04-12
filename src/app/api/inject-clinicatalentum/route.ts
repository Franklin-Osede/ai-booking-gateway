import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicatalentum'
      }
    });

    const seoMetricsData = {
      summary: 'El Paciente Terminal (Secarral Orgánico y Dependencia de Pago)',
      traffic: 'Inexistente. 1 visita al mes. Electroencefalograma plano en captación orgánica.',
      cost: 'Lead Value: Extremo. Toda la facturación digital depende de inyectar capital en Ads. Cada clic perdido es dinero quemado.',
      topPages: '1. Home (1 visita)\nEl resto de la web no existe para Google.',
      competitors: 'Son invisibles para la competencia en el plano orgánico.',
      socialTraffic: '',
      insights: 'Hola equipo de Clínica Talentum. Nuestro sistema de Inteligencia de Mercado ha escaneado vuestro dominio y el diagnóstico es de máxima crudeza: os encontráis en fase de «Paciente Terminal» a nivel digital orgánico.\n\nVuestra gráfica marca un electroencefalograma plano. Literalmente registramos 1 visita orgánica al mes y un total de 4 palabras clave residuales en las profundidades de Google. Sois funcionalmente invisibles en el buscador.\n\nEste diagnóstico no es para hablar de SEO (tardaríais años en remontar esto), es para hablar de Supervivencia Financiera. Al tener un desierto orgánico, vuestra clínica depende obligatoriamente del boca a boca o de inyectar dinero constante en publicidad (Meta Ads o Google Ads) para sobrevivir.\n\nLa fisura mortal (vuestra fuga de capital) es enviar tráfico de pago (por el que pagáis 1, 2 o 5 euros el clic) a una página web pasiva. Si un usuario pincha en un anuncio, entra, y se aburre buscando un teléfono o un formulario estático... acabáis de quemar ese dinero. No os podéis permitir la media de mercado del 98% de rebote.\n\nVuestra urgencia absoluta es inyectar un Asistente Digital «Closer» que rentabilice vuestra publicidad. Si no hay SEO, hay que exprimir el pago.\n\nLa estrategia: Integramos la IA. Cuando encendáis una campaña de Ads y el paciente entre, la IA fuerza la interacción al instante: «Hola. Bienvenido a Talentum. Ya que nos consultas para una valoración capilar, no te hago perder tiempo buscando por la web: ¿cuál es tu preocupación exactamente para que evalúe y te consiga un hueco con el equipo?».\n\nEsta solución no os promete milagros de tráfico orgánico; os garantiza que el dinero que gastáis en publicidad no se estrelle contra una web ineficaz, transformando cada clic comprado en una conversación médica inmediata.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicatalentum.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica Talentum',
          slug: 'clinicatalentum',
          industry: 'Clínica Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicatalentum.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica Talentum inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Clínica Talentum:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
