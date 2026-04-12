import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'drapazmartin'
      }
    });

    const seoMetricsData = {
      summary: 'Dominio de Marca con Fugas Técnicas (Tráfico sólido pero con errores estructurales graves en WordPress/Elementor)',
      traffic: 'Saludable-Boutique (496 visitas/mes). Tienen un volumen constante y de altísima calidad basado en búsquedas puras de la Doctora.',
      cost: 'Lead Value: Pre-Convencidos. El 90% del tráfico busca "Dra Paz Martin". Es el boca a boca digitalizado. El problema es que están perdiendo casi 100 de esas visitas al mes enviándolas a URLs rotas o de plantillas por un error de WordPress.',
      topPages: '1. Home (drapazmartin.com) - 350 visitas\n2. ERROR DE WORDPRESS (?elementor_library=dra-paz-martin) - 92 visitas\n3. Neuromoduladores - 12 visitas',
      competitors: 'Actúan como un lobo solitario. No pelean en la guerra de "botox valencia" contra las cadenas, se alimentan de su propio prestigio.',
      socialTraffic: 'Alto porcentaje de tráfico viene sugestionado por redes o recomendaciones verbales previas.',
      insights: 'Hola equipo de la Dra. Paz Martín. Hemos auditado drapazmartin.com y el resultado es agridulce: sois un «Dominio de Marca» pero con «Fugas Técnicas Críticas».\n\nLa parte excelente: recibís casi 500 visitas al mes, y la inmensa mayoría provienen de pacientes tecleando vuestro nombre en Google. Sois una autoridad local basada en prestigio. No necesitáis pelear por la palabra "botox" contra grandes franquicias, porque la gente ya os busca a vosotras.\n\nLa Alerta Comercial (La Fuga): El problema es qué pasa cuando esas 500 personas "calientes" entran en vuestra web. Hemos detectado un grave error técnico de WordPress/Elementor. Cerca de 100 personas al mes están aterrizando en una URL residual (terminada en `?elementor_library`), lo que daña la experiencia, y el resto se estanca en la página principal.\n\nPara vosotros, cada paciente que entra ya viene convencido. Si se frustran con la web, estáis tirando dinero seguro.\n\nNuestra Inteligencia Artificial no hace SEO pasivo, actúa como un «Enrutador VIP». Sabedora de que quien entra a vuestra web os está buscando a posta, la IA no espera a que el paciente dé clicks. A los 5 segundos emerge: «Hola, qué alegría verte por la clínica virtual de la Dra. Paz. ¿Buscabas la agenda médica para agendar una valoración facial o prefieres que te dé un presupuesto estimativo de nuestros neuromoduladores?».\n\nConvertimos un fallo técnico y una web pasiva en una máquina que recoge y asegura a cada uno de esos 500 valiosos pacientes mensuales.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://drapazmartin.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Dra Paz Martin',
          slug: 'drapazmartin',
          industry: 'Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'http://drapazmartin.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Dra. Paz Martin inyectada correctamente.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
