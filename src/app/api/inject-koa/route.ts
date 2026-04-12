import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicakoa'
      }
    });

    const seoMetricsData = {
      summary: 'La Trampa del Ticket Bajo (Volumen alto en microservicios, ocultando tratamientos rentables)',
      traffic: 'Tráfico sano (455 visitas/mes). Tuvieron una caída post-2024 pero se están recuperando bien.',
      cost: 'Lead Value: Preocupantemente Bajo. Lideran el SEO en Depilación con Hilo o Diseño de Cejas (servicios de 15€-30€), mientras los Rellenos de Ácido Hialurónico o PRP quedan invisibles.',
      topPages: '1. Home\n2. Depilación (Rey absoluto del tráfico)\n3. Micropigmentación',
      competitors: 'Son referentes en estética tradicional/cuidados básicos, pero las clínicas de medicina estética puros se llevan las búsquedas de inyectables orgánicamente.',
      socialTraffic: '',
      insights: 'Hola equipo de Clínica KOA. Al auditar vuestro perfil nos hemos encontrado con el arquetipo de «La Trampa del Ticket Bajo».\n\nLa buena noticia: vuestro SEO funciona. Atraer 455 visitas mensuales os da un flujo constante de personas interesadas en vuestros servicios. Sois Top 1 indiscutibles en servicios como «Depilación con hilo Valencia».\n\nLa mala noticia y Alerta Comercial: Al mirar el detalle, descubrimos que vuestro SEO os está llenando la agenda de servicios de 15€ a 30€. Aunque la depilación o el diseño de cejas dan rotación, saturan vuestra recepción y bloquean tiempo operativo.\n\nMientras tanto, vuestros tratamientos que realmente escalan la facturación (Juvederm, PRP, Radiesse, Radiofrecuencia) están en segunda o tercera página de Google, casi invisibles para pacientes de alto valor.\n\nNuestro diagnóstico: Tenéis el tráfico, pero os falta el «Up-Selling» (venta cruzada). Si vuestra recepcionista tiene que gestionar decenas de llamadas al día para dar citas de depilación de 15 minutos, no tiene tiempo para sentarse a vender un tratamiento de bótox de 300€.\n\nNuestra solución tecnológica consiste en instalar un «Consultor de Up-Selling por IA» directamente en vuestra web.\n\nCuando un usuario entra buscando «Depilación con hilo», la IA no solo le agenda la cita automáticamente (quitándole ese trabajo a vuestra recepción), sino que le lanza un dardo comercial: «¡Genial! Tienes tu cita de depilación el martes. Por cierto, viendo que te interesa el cuidado de la mirada, este mes la doctora hace valoraciones gratuitas de elevación de cejas con neuromoduladores o relleno de ojeras con Redensity 2. ¿Te gustaría aprovechar tu visita para que te valore sin compromiso?».\n\nDejad de conformaros con pacientes de 15€. Usad nuestra IA para pescar en el tráfico de estética básica y convertirlos automáticamente en pacientes de medicina estética de alto ticket.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://clinicakoa.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica KOA',
          slug: 'clinicakoa',
          industry: 'Clínica de Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://clinicakoa.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica KOA inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Clinica KOA:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
