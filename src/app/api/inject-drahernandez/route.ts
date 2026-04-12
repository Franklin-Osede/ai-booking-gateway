import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'draisabelhernandez'
      }
    });

    const seoMetricsData = {
      summary: 'El Brote Verde (Personal Branding en Fase de Despegue)',
      traffic: 'Tráfico incipiente e hiper-cualificado (135 visitas/mes). Dependencia casi total de búsquedas de nombre propio y recomendaciones.',
      cost: 'Lead Value: Crítico. Al no tener volumen masivo, no se pueden permitir fugas por formularios genéricos. Cada visita cuenta.',
      topPages: '1. Home / Biografía (El tráfico busca a la persona, no la entidad)',
      competitors: 'Clínicas más grandes, pero ella compite en otra liga: el trato personalizado y la autoridad nominal.',
      socialTraffic: '',
      insights: 'Hola equipo de la Dra. Isabel Hernández. Hemos procesado vuestros datos de captación orgánica a través de nuestra Inteligencia de Mercado y la lectura es muy interesante. Os encontráis en una de las fases más críticas y delicadas del escalado: «El Brote Verde».\n\nVuestra gráfica histórica demuestra el inicio de un despegue claro, rompiendo la barrera de las 130 visitas orgánicas mensuales. Esto está impulsado, según nuestra auditoría, por la pura fuerza de la marca personal de la Doctora Isabel. Quien os encuentra, os busca nombrativamente.\n\nEl peligro real de la fase «Brote Verde» no es el SEO, es la estadística de fuga. Jugando en ligas de 130 visitas al mes, NO podéis participar en el juego corporativo del volumen. Si usáis métodos tradicionales de conversión web (contacto pasivo o formularios fríos) y convertís al 1%, ganaréis 1 paciente al mes. Eso frena el crecimiento de la clínica.\n\nAdemás, vuestro núcleo es la Autoridad Médica Personal. Si un paciente os busca explícitamente por el nombre de la doctora (viene hiper-cualificado y recomendado) y al entrar se choca contra un formulario corporativo frío, se rompe la «magia» de la cercanía que venía buscando.\n\nEl paso estratégico inteligente no es quemar dinero en SEO para subir el número 130, sino asegurar que de esos 130 no se escape nadie. Vuestra web necesita inyectar un «Gemelo Digital» de Recepción. \n\nEn lugar del formulario actual, cuando el paciente acceda buscando a la Doctora, el sistema IA intercepta la fricción: «¡Hola! Soy la coordinación clínica de la Doctora Hernández. Me alegro de recibirte. Para que la Doctora evalúe tu caso en su próximo hueco, ¿cuál es tu preocupación principal hoy? Te agendo una visita preliminar por este chat en un minuto sin compromiso».\n\nBlindar la recepción actual y transformar el trato pasivo en un triaje empático multiplicará instantáneamente los leads mensuales utilizando la misma gasolina que ya tenéis en el motor.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://draisabelhernandez.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Dra. Isabel Hernández',
          slug: 'draisabelhernandez',
          industry: 'Clínica Capilar (Atención Personalizada)',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://draisabelhernandez.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Dra. Isabel Hernández inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Dra. Isabel Hernández:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
