import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'bouretclinic'
      }
    });

    const seoMetricsData = {
      summary: 'El Motor Desequilibrado (Líder en Estética Avanzada, Zombie en Capilar)',
      traffic: 'Muy sano y recurrente (~634 visitas/mes), dominado por tráfico estético y corporal.',
      cost: 'Lead Value: Extremadamente alto. Tienen Top posiciones en tratamientos corporales avanzados (Endolifting, Hidrolipoclasia). Su fuga está en el nulo cross-selling hacia su unidad capilar.',
      topPages: '1. Hidrolipoclasia\n2. Home\n3. Endospheres\n4. Endolifting',
      competitors: 'Clínicas estéticas de lujo en Madrid, Valencia y Málaga.',
      socialTraffic: '',
      insights: 'Hola equipo de Bouret Clinic. Hemos auditado vuestra huella orgánica y tenéis lo que llamamos un «Motor Desequilibrado». Sois indiscutibles líderes en atraer tráfico para tratamientos corporales y faciales muy avanzados (Top 5 en toda España para Keywords pesadas como «Hidrolipoclasia» o «Endolifting»), generando más de 600 visitas sólidas al mes.\n\nPero hay una anomalía grave: vuestra «Unidad Capilar» es un fantasma digital. Para palabras como «Técnica FUE» estáis hundidos en la página 10 de Google (Top 91).\n\nLa fuga crítica de conversión aquí no es el SEO, es el «Cross-Selling» estancado. Estáis atrayendo a cientos de pacientes mensuales con un altísimo poder adquisitivo (y a sus parejas), pero los embudos mueren en el tratamiento estético puntual. Quien invierte en Endolifting es el target de libro para Bioestimulación Capilar Femenina o Injertos Masculinos.\n\nPara revivir vuestra rama capilar a Coste 0 de captación, necesitáis inyectar un «Asistente IA de Cross-Selling». Cuando un visitante absorba vuestro post sobre Hidrolipoclasia, no le deis un muro o un simple formulario. El Asistente IA debe abordarle proactivamente: «Hola, veo que te interesa la estética avanzada. En Bouret también contamos con una Unidad Capilar Élite (Mesoterapia, Densidad, FUE). Dado que estás en Málaga/Madrid, ¿te gustaría aprovechar tu visita para agendar un rápido análisis capilar con el doctor sin coste?». Monetizad el tráfico que ya tenéis.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://bouretclinic.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Bouret Clinic',
          slug: 'bouretclinic',
          industry: 'Estética Avanzada y Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://bouretclinic.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Bouret Clinic inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Bouret:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
