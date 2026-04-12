import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'capilarclinique'
      }
    });

    const seoMetricsData = {
      summary: 'La Ciudad Fantasma (Castigados por Local SEO Spam)',
      traffic: 'Extremadamente bajo: ~13 visitas/mes. Gráfica en coma plano.',
      cost: 'Lead Value: Supervivencia pura. Cuentan con un volumen tan crítico que cada visita perdida es un drama financiero orgánico.',
      topPages: '1. Pamplona (Única con tracción real)\n2. Bilbao\n3. Valencia (Thin content)\n4. Post: Tapar entradas (Hundido en P71)',
      competitors: 'Clínicas locales reales en cada ciudad que gozan del favor de Google Maps.',
      socialTraffic: '',
      insights: 'Hola equipo de Capilar Clinique. Hemos analizado la arquitectura de vuestra web y vemos claramente lo que ocurre: vuestra estrategia de crear landings locales para múltiples ciudades (Bilbao, Pamplona, Valencia, Sevilla...) ha sido duramente penalizada por los últimos updates de contenido de Google. Ahora mismo sois una \'ciudad fantasma\' con apenas 13 visitas orgánicas al mes.\n\nCuando el grifo de Google se cierra a este nivel, y dependéis de Ads o de esas escasas 13 visitas, no podéis permitiros usar un simple formulario de contacto pasivo en vuestras landings. Suena duro, pero cada usuario que entra en vuestra landing de Pamplona y la abandona hoy, no vuelve.\n\nNecesitáis un Filtro de Choque con IA integrado en todas esas landings locales. Un asistente que intercepte a la visita nada más entrar, valide su ciudad y cierre la consulta («He visto que nos visitas desde Pamplona, ¿quieres que valoremos el coste de tapar tus entradas sin compromiso?»). Con este volumen de tráfico, la retención en segundos es vuestra única vía de captación viable.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://www.capilarclinique.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Capilar Clinique',
          slug: 'capilarclinique',
          industry: 'Clínica Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://www.capilarclinique.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Capilar Clinique inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Capilar Clinique:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
