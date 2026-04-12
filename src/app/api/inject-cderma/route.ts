import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'cderma'
      }
    });

    const seoMetricsData = {
      summary: 'El Paciente Terminal (Secarral Digital absoluto y Dependencia de Pago)',
      traffic: 'Inexistente. 1 visita al mes. Histórico plano al 100%.',
      cost: 'Lead Value: Extremo. Cero captación orgánica significa que el modelo de negocio depende completamente de Ads o del boca a boca. El rebote publicitario es letal.',
      topPages: '1. Home (1 visita)\nSu huella digital es un fantasma.',
      competitors: 'Invisibles en Google. Su competencia se reparte todo el pastel orgánico de Tenerife.',
      socialTraffic: '',
      insights: 'Hola equipo de CDerma. Nuestra herramienta de Inteligencia de Mercado ha escaneado vuestro dominio de principio a fin, y los datos muestran el diagnóstico más severo a nivel digital: vuestra web es un «Paciente Terminal» orgánico.\n\nLa gráfica histórica confirma un electroencefalograma plano. Google os otorga exactamente 1 visita orgánica al mes motivada por una búsqueda directa de marca (gente que ya os conoce). Estar en la página 2 o 5 para búsquedas clave como «dermatología santa cruz de tenerife» significa, a efectos de negocio, no existir.\n\nAnte un secarral orgánico así, no os proponemos SEO mágico; levantar esto requeriría miles de euros y años de paciencia. Nuestro análisis asume que para tener flujo de pacientes nuevos dependéis obligatoriamente de pagar publicidad (Meta Ads, Google Ads). \n\nY aquí está la fuga crítica que debéis tapar hoy: enviar tráfico por el que pagáis 3€ el click a un portafolio web estático es quemar el presupuesto. El usuario pincha el anuncio, entra en una página fría de «Centro dermatológico», no ve a nadie atendiéndole interactívamente y se marcha. Eso es pagar para que reboten.\n\nLa urgencia vital de CDerma es integrar un Asistente Digital «Closer» que blinde vuestra inversión en Ads. En lugar de una web pasiva, cada paciente que pinche vuestro anuncio será recibido al instante:\n«Hola. Te doy la bienvenida a la clínica CDerma. Sé que el tiempo es oro, ¿buscas cita para dermatología general o para alguna consulta específica de cirugía capilar? Te facilito la revisión con nuestro equipo en este mismo chat».\n\nInstalar esta capa de retención no os arreglará el SEO mañana, pero os garantiza que cada euro que gastéis en publicidad o cada paciente que os busque por boca a boca no se pierda por culpa de un formulario frío.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://cderma.es' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'CDerma (Centro Dermatológico)',
          slug: 'cderma',
          industry: 'Dermatología Médica y Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://cderma.es' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'CDerma inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting CDerma:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
