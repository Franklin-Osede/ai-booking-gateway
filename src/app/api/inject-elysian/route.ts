import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicaelysian'
      }
    });

    const seoMetricsData = {
      summary: 'El Imperio Caído (Hemorragia de Tráfico y Supervivencia por Marca)',
      traffic: 'Caída drástica: Han bajado de ~4,000 visitas mensuales en 2024 a apenas 500 visitas en la actualidad. Una pérdida de más del 80% de captación Google.',
      cost: 'Lead Value: Dependientes de la marca. Casi todo su tráfico residual entra por la Home buscando directamente su nombre.',
      topPages: '1. Home (Casi 400 de sus 500 visitas)\n2. Thermage / Indiba (Volúmenes residuales)',
      competitors: 'Han pedido la batalla SEO en tratamientos estrella (posiciones 15-90) frente a competidores más agresivos.',
      socialTraffic: '',
      insights: 'Hola equipo de Clínica Elysian. Al auditar vuestra presencia digital, hemos visto el «elefante en la habitación» en vuestras gráficas históricas.\n\nNuestro diagnóstico: El Imperio Caído. Durante 2024 teníais un volumen orgánico envidiable de captación (hasta 4,000 visitas al mes). Sin embargo, Google os ha penalizado brutalmente y hoy rondáis las 500 visitas. Habéis sufrido una auténtica hemorragia SEO.\n\nActualmente estáis sobreviviendo comercialmente en el ecosistema digital gracias a la fuerza técnica de vuestra marca: el 80% de las visitas aterrizan directamente en la Home buscando «Clínica Elysian». Tenéis muchos artículos y páginas de servicios (Thermage, Radiesse, Cooltech), pero Google os ha relegado a la segunda, tercera o cuarta página de resultados, volviéndoos invisibles para pacientes nuevos que no os conocen.\n\nCuando el tráfico sufre una caída del 85%, la estrategia de recepción tiene que cambiar radicalmente hacia el «Blindaje Total del Lead». No podéis permitiros el lujo de que de las 500 personas que entran, solo os llamen 5.\n\nNuestra inyección tecnológica no os va a devolver las 4,000 visitas mañana, pero va a instalar un sistema de Triage IA para maximizar el rescate del tráfico actual. Se trata de poner una IA como Recepcionista Virtual Activa en vuestra Home.\n\nCuando ese paciente fiel o referido os busca por marca y entra en la Home, la IA no espera a que busque el formulario. Le asalta proactivamente: «Hola, bienvenida de nuevo a Elysian. Tenemos huecos esta semana para valoraciones de Thermage o Indiba. ¿Te agendo con nuestros doctores?».\n\nPara los poquísimos pacientes que aún os encuentran buscando «Ultherapy Valencia» (que estáis en posición 4), la IA actúa como un Closer de emergencia, cerrando la cita en caliente en menos de un minuto para evitar que se vayan a la clínica que está en posición 1.\n\nDejad de perder valor económico por culpa del SEO. Automatizad la atención al 100% para que el tráfico que quede, se convierta en facturación asegurada.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicaelysian.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica Elysian',
          slug: 'clinicaelysian',
          industry: 'Clínica de Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://clinicaelysian.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica Elysian inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Clinica Elysian:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
