import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'clinicacemeq'
      }
    });

    const seoMetricsData = {
      summary: 'El Gigante Caído (Penalización Algorítmica)',
      traffic: '1.598 orgánicas / mes (caída drástica desde 20.000 en 2024)',
      cost: 'Lead Value: Alto (implantes cigomáticos, aumento de labios). Fuga pasiva muy dolorosa por falta de triaje activo tras caída de tráfico.',
      topPages: '1. Implantes Cigomáticos\n2. Aumento de Labios\n3. Patologías del Pezón',
      competitors: 'Otras clínicas de Valencia que se mantienen con Ads.',
      socialTraffic: '',
      insights: 'Hola equipo de CEMEQ. Hemos analizado vuestra curva de tráfico y hemos notado la fuerte corrección que habéis sufrido desde el verano pasado, perdiendo gran parte del volumen informacional.\n\nCuando el tráfico baja un 90%, cambian las reglas del juego: cada paciente que hoy aterriza buscando "implantes cigomáticos" o "aumento de labios" vale oro y no podemos dejar que se enfríe en un formulario estático.\n\nNecesitáis un Filtro de Triaje Activo (IA) integrado en esas URLs clave que aborde al usuario en tiempo real, resuelva sus miedos sobre las cirugías y lo cierre para una primera valoración. La IA no os va a devolver las 20.000 visitas de golpe, pero va a asegurar que exprimís cada gota de rentabilidad a las 1.500 que tenéis ahora.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Clínica Estética y Dental CEMEQ',
          slug: 'clinicacemeq',
          url: 'clinicacemeq.es',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Clínica CEMEQ inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting CEMEQ:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
