import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Escaparate Invisible' (Cero Tráfico SEO). RC Clinic tiene unas métricas orgánicas nulas en Ubersuggest (0 visitas, DA 2, 1 backlink). Esto significa que viven exclusivamente del boca a boca, de sus redes sociales (Instagram) o de pauta publicitaria (Ads). El pitch aquí no va de SEO, va de rentabilizar el tráfico de pago y redes sociales.",
    traffic: "Totalmente nulo en orgánico (0 visitas estimadas). Tienen 38 keywords indexadas en posiciones irrelevantes (ej: 'centro capilar madrid' en posición 41).",
    cost: "El coste de oportunidad es el ROI publicitario. Si pagan 3€ a 5€ por cada clic en Google Ads o Meta Ads, mandar a ese usuario a una web estática y que se vaya sin dejar el contacto es literalmente quemar billetes.",
    topPages: "No hay páginas traccionando en Google. Tienen indexadas Armonización Facial y Neuromoduladores pero sin volumen real.",
    competitors: "Están muy por detrás en SEO frente a cualquier competidor de Madrid. Su guerra ahora mismo debe estar en la atención extremadamente premium y en exprimir el 100% del tráfico de pago.",
    socialTraffic: "Dado que no tienen SEO, todo su negocio digital debe venir de Instagram o Meta Ads. Sus redes son su verdadero canal de captación.",
    insights: "PITCH CONSULTIVO: EL ESCUDO CONTRA LA QUEMA DE ADS/REDES\n'Hola [Nombre], os llamo de un modo muy honesto. Hemos analizado el ecosistema web en Madrid y vemos las métricas orgánicas de RC Clinic. Sabemos que el SEO ahora mismo no es vuestro fuerte (0 visitas estimadas orgánicas), lo cual nos indica que jugáis con otras cartas: tráfico de Instagram, boca a boca, o campañas de Ads.\n\nEl problema cuando dependes de Ads o cuando te llega un visitante desde un reel de Instagram es la ventana de atención: dura segundos. Si pagáis a Google o a Meta para que alguien entre a la web, y esa persona al entrar ve solo texto o un formulario aburrido, a los 5 segundos se va. Y ahí se va vuestro presupuesto.\n\nPara clínicas en vuestra fase, no venimos a venderos SEO de miles de euros. Venimos a poneros un Asistente Médico de IA que sea vuestro cierre y vuestro escudo publicitario. Si pagáis por un visitante, el bot le aborda en el minuto 1: «Hola, ¿vienes por nuestros tratamientos de Armonización Facial de los que hablamos en Instagram? Cuentame qué buscas y te derivo con nuestros médicos».\n\nDe esta forma, en vez de necesitar 100 clics de pago para conseguir un lead, con nuestra IA podéis conseguir ese lead con solo 15 clics. Multiplicamos la rentabilidad de lo que ya estéis haciendo en Ads.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dudan porque no tienen casi tráfico web: 'Exacto, por eso mismo es vital. Quien tiene 16.000 visitas al mes se puede permitir que 5.000 se vayan sin saludar. Vosotros, los pocos que conseguís meter en la web (sea por Ads o Redes), tenéis que secuestrarles la atención y sacarles el WhatsApp al instante. Si no, estáis tirando el dinero que os cueste traerlos.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "rcclinic", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://rcclinic.es/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "RC Clinic",
          slug: "rcclinic",
          industry: "Clínica Capilar (Novata/Ads)",
          location: "Madrid",
          seoMetrics,
          websites: { create: { url: "http://rcclinic.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "RC Clinic inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
