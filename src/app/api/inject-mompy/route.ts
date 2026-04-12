import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'mompy'
      }
    });

    const seoMetricsData = {
      summary: 'El Electrocardiograma Errático (Picos Fantasma y Rebote Masivo)',
      traffic: 'Residual y muy inestable (7 visitas/mes). Presenta picos bruscos a ~100 visitas seguidos de hundimientos inmediatos a cero.',
      cost: 'Lead Value: Crítico. Incapacidad de retener el tráfico cuando el algoritmo les da visibilidad. Cada rebote les penaliza en SEO.',
      topPages: '1. Home / Búsqueda de Marca (Absorbe lo poco que llega)\n2. Sensibilidad cuero cabelludo (Artículo que no retiene)',
      competitors: 'Rivalizan perdiendo tracción ante cualquier clínica local de Tenerife con retención web.',
      socialTraffic: '',
      insights: 'Hola equipo del Centro Médico Mompy. Hemos introducido vuestro dominio en nuestra Inteligencia de Datos y el informe revela un patrón muy específico que catalogamos como «El Electrocardiograma Errático».\n\nA nivel de captación pasiva, estáis en mínimos peligrosos: registráis una media de apenas 7 visitas orgánicas mensuales. Salvo por aquellos pacientes que buscan vuestro nombre exacto, sois invisibles en Tenerife.\n\nPero el dato crítico (vuestra gran fuga) está en la gráfica histórica: sufrís «Picos Fantasma». Entráis en radar de repente y subís a 100 visitas en un mes, solo para que el algoritmo vuelva a hundiros a casi cero al mes siguiente. ¿Por qué ocurre este castigo constante? \n\nPorque cuando Google os premia y os envía usuarios, estos interactúan con una web estática, no sienten urgencia clínica, no ven un método rápido de ser atendidos, y rebotan masivamente (vuelven a buscar a otra clínica). El algoritmo interpreta ese rebote como un rechazo a vuestra clínica y os castiga quitándoos el tráfico.\n\nLa prioridad estratégica NO es contratar más SEO tradicional para intentar forzar las gráficas. La urgencia vital es blindar la retención.\n\nTenéis que instalar un «Gemelo Digital de Retención». Cuando ocurran esos picos (o cuando gastéis dinero en anuncios), el paciente no puede quedar en silencio. Si entra a la web, la IA entra al choque amablemente: «Hola. Bienvenido a Mompy Tenerife. Para orientar tu caso de la mejor manera, ¿cuál es tu preocupación capilar principal? Te reservo una valoración inicial con el equipo en menos de un minuto».\n\nEn lugar de una página muda que provoca huidas, tendréis una recepción activa. Si retenéis el tráfico en conversaciones, bajáis la tasa de rebote drásticamente, cerráis los pocos leads que os llegan, y obligáis a Google a estabilizar vuestras métricas en lo alto.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://mompy.es' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Mompy Centro Capilar',
          slug: 'mompy',
          industry: 'Clínica Médico Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://mompy.es' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Mompy inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Mompy:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
