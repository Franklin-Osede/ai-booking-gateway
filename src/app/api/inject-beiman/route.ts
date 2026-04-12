import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Pulpo Regional / Captación Descentralizada'. Beiman Capilar es una red clínica fuerte a nivel autonómico (Andalucía). Su tráfico (432 visitas/mes) no está concentrado, sino perfectamente fragmentado por ciudades: Granada, Jaén, Jerez, Sevilla y Córdoba. Son fuertes localmente pero tienen el reto logístico de canalizar cada visitante a su clínica correspondiente sin perder ventas en el proceso.",
    traffic: "Estable y hiper-localizado. Captan unas 430 visitas mensuales distribuidas quirúrgicamente por las distintas capitales andaluzas ('clinica beiman jerez', 'implante capilar granada').",
    cost: "El coste de oportunidad reside en la 'fricción de enrutamiento'. Si alguien de Jaén tiene que pasar por una centralita general o un formulario genérico para pedir cita, se enfría. Perder el 10% de 400 leads hiper-cualificados por ciudad es una fuga económica constante.",
    topPages: "Páginas específicas de cada ciudad: 1. Home (Jerez). 2. Granada. 3. Contacto. 4. Jaén. 5. Sevilla.",
    competitors: "Compiten en el ecosistema andaluz contra clínicas locales de cada ciudad y contra gigantes nacionales que tienen sedes en Sevilla o Málaga.",
    socialTraffic: "Hacen un esfuerzo en capilaridad local. Probablemente usen redes sociales para derivar a pacientes locales.",
    insights: "PITCH CONSULTIVO: EL ENRUTADOR REGIONAL / CUALIFICACIÓN MULTI-SEDE\n\n'Hola [Nombre], he analizado la estructura de captación de Beiman Capilar. Enhorabuena, porque estáis haciendo lo más difícil: dominar el SEO a nivel hiper-local en toda Andalucía (Granada, Jaén, Jerez, Córdoba...). Tenéis a más de 400 personas entrando al mes buscando injertos en su ciudad exacta.\n\nEl problema de ser un Pulpo Regional es la 'fricción de la centralita'. Si un usuario entra leyendo vuestra sección de Granada y tiene que ir al formulario de contacto general o llamar para que le deriven, estáis perdiendo pacientes impulsivos por el camino.\n\nNosotros no hacemos SEO. Instalamos una Arquitectura de Triaje con IA que actúa como un enrutador local. Si el visitante está leyendo sobre Córdoba, el Asistente le salta de inmediato: 'Hola, somos la sede de Beiman en Córdoba. ¿Quieres que nuestro especialista local revise tu caso sin compromiso?'.\n\nEl Asistente cualifica, saca el teléfono y manda el lead directamente a la agenda de la clínica de Córdoba. Eliminamos la fricción de la centralita central, capturamos al paciente en su ciudad y os subimos el ratio de conversión en todas vuestras sedes andaluzas de golpe.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "beiman", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: {
            create: { url: "http://beimancapilar.com/" }
          }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Beiman Capilar",
          slug: "beiman",
          industry: "Clínica Capilar",
          location: "Andalucía (Múltiples)",
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://beimancapilar.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Beiman Capilar inyectada en el dashboard." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
