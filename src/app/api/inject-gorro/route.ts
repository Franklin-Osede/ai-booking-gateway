import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Rey Local / Crecimiento Estancado por Techo de Mercado'. El Dr. Alberto Gorrochategui domina su zona. Es el absoluto #1 para 'clinica capilar jerez' robándose todo el tráfico local por delante de su competencia. El problema es que el volumen de búsquedas de su ciudad es finito (140/mes). Ha tocado techo.",
    traffic: "257 visitas mensuales maravillosas. 187 son de pacientes buscando directamente su nombre (boca a boca) y 66 son de tráfico SEO local puro en Jerez. Tráfico ultra caliente.",
    cost: "La fuga de capital aquí es de conversión, no de adquisición. Si estás en la cima de tu ciudad, no puedes conseguir mágicamente el triple de tráfico porque no hay tanta gente buscando en Jerez. Su coste de oportunidad es perder a alguien que ya ha decidido operarse en su ciudad por culpa de una web lenta o falta de atención inmediata.",
    topPages: "Home, y la página de 'Primera Visita'.",
    competitors: "Su competencia real es Clínica Capilar Jerez (a los cuales les roba todo el tráfico) y las clínicas de Sevilla si el paciente decide viajar buscando algo mejor.",
    socialTraffic: "Tráfico local muy fiel y directo.",
    insights: "PITCH CONSULTIVO: EL EMBUDO PARA REYES LOCALES\n\n'Hola [Nombre], he auditado la presencia del Dr. Gorrochategui. Enhorabuena, sois los Reyes de Jerez. Tenéis la posición #1 indiscutible y os lleváis absolutamente todo el tráfico de la ciudad por delante de vuestra competencia.\n\nPero hay un problema cuando eres el rey de un mercado local: tocas un techo de cristal. En Jerez solo hay unas 140 personas al mes buscando injertos. Por mucho SEO que hagáis, ese número no va a crecer de la noche a la mañana.\n\nEsto significa que vuestro objetivo ya no es conseguir más visitas, sino exprimir la rentabilidad de las que ya tenéis. Si hoy entran 3 personas buscando injertos en Jerez, no podéis permitir que ninguna cierre la web sin dejar sus datos.\n\nNosotros instalamos un Asistente Médico de IA diseñado específicamente para exprimir bases de tráfico finito. En el instante en que ese paciente jerezano entra en la web, el Asistente le aborda, agenda la Primera Visita ahí mismo en el chat y os lo manda directo por WhatsApp. Ya habéis ganado la guerra del SEO en vuestra ciudad; ahora os ayudamos a ganar la guerra de la conversión.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: "albertogorrochategui" },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Dr. Alberto Gorrochategui",
          slug: "albertogorrochategui",
          industry: "Clínica Capilar",
          location: "Jerez de la Frontera",
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://www.albertogorrochategui.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Gorrochategui inyectada correctamente." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
