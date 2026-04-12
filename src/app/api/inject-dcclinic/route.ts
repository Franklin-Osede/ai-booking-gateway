import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'dcclinic'
      }
    });

    const seoMetricsData = {
      summary: 'El Campeón del «Cerca de Mí» (Tráfico de Hiper-Conveniencia)',
      traffic: 'Volumen concentrado y de extrema calidad comercial. Dependencia masiva de un canal geolocalizado de alta intención.',
      cost: 'Lead Value: Incalculable. Son el #1 en Google para «clínica capilar cerca de mi» (1,300 búsquedas/mes). Tráfico hiper-transaccional impulsivo.',
      topPages: '1. Home (Atrapa casi el 100% de este tráfico)\n2. Contacto (Ligera fuga de caída)',
      competitors: 'Clínicas locales en franquicia que pujan por cercanía.',
      socialTraffic: '',
      insights: 'Hola equipo de DC Clinic. Al someter vuestra huella digital a nuestro volcado de Inteligencia de Mercado, hemos saltado de la silla. Técnicamente estáis sentados sobre un auténtico pozo de petróleo comercial: sois el número 1 indiscutible en Google para la búsqueda «clínica capilar cerca de mi». Esta única frase os inyecta casi 400 pacientes directos en la puerta virtual de vuestra clínica cada mes.\n\nMucha atención a este punto: la psicología del paciente que busca "cerca de mí" es la más caliente y transaccional que existe en la red. Tienen la cartera en la mano. No quieren leer artículos médicos ni ver currículums, quieren saber dónde estáis y cómo ir ahora. Buscan «hiper-conveniencia impulsiva».\n\nLa fricción actual (y profunda pérdida de facturación) ocurre porque cuando hacen clic en Google llenos de impulso, aterrizan en vuestra Home genérica. Les obligáis a navegar, buscar el teléfono, y rellenar un formulario frío. Estáis cogiendo al buscador más rápido y ansioso de Internet y obligándole a frenar a hacer papeleo.\n\nVuestro atajo definitivo de escalado no requiere tocar ni una coma del SEO. Requiere inyectar un "Conserje de Tríaje IA" inmediato. Si nuestro sistema detecta que el usuario entra, la Inteligencia Artificial debe saltar a pantalla completa interrumpiendo su lectura pasiva: «¡Hola! Veo que buscas una clínica cercana. Estamos exactamente en [Vuestra Dirección]. Tengo un hueco disponible de cortesía con el Doctor Carmona hoy a las 18:00 o mañana a las 10:00. ¿Cuál te bloqueo en este mismo chat en 10 segundos?».\n\nSi reducís la fricción de agenda a cero para ese tráfico geolocalizado, reventaréis vuestra ratio de primeras visitas sin gastar un céntimo extra en Google. Tenéis al tráfico correcto intentando entrar, solo hay que abrirles la puerta automática.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://www.dcclinic.es' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'DC Clinic',
          slug: 'dcclinic',
          industry: 'Clínica de Medicina Estética y Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://www.dcclinic.es' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'DC Clinic inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting DC Clinic:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
