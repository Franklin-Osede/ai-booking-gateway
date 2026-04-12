import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Tráfico Semilla' (Oportunidad de Micro-Conversión). Neocapilar es un dominio con métricas muy humildes: 23 visitas al mes y Autoridad 8. Están empezando a asomar la cabeza en Google. Con un volumen tan bajo de tráfico, su principal problema no es el desborde de atención, sino la extrema necesidad de convertir cada uno de los escasos clics que consiguen.",
    traffic: "Casi inexistente, pero hiper-valioso: apenas 23 visitas mensuales intentando arañar tráfico locales como 'centro capilar en madrid' (Pos 8, 1 visita).",
    cost: "El coste de oportunidad de un dominio pequeño es altísimo. Si de esas 23 personas, una o dos estaban dispuestas a informarse y se van por falta de atención inmediata, la inversión en la web es tirar el dinero. No pueden permitirse el lujo de perder a NADIE.",
    topPages: "La home genera la mitad del tráfico (11 visitas) y su post estrella es puramente formativo: 'Escala de Hamilton-Norwood' o 'Alopecia por tracción'.",
    competitors: "Están peleando en la jungla de Madrid contra monstruos como Capilárea, Hospital Capilar o NeoGraft. Su única ventaja competitiva puede ser el trato boutique y micro-personalizado.",
    socialTraffic: "Inexistente.",
    insights: "PITCH CONSULTIVO: EXPRIMIR CADA CLIC AL 100%\n'Hola [Nombre], os llamo porque hemos auditado vuestra web y vemos que estáis en una fase incipiente a nivel de tráfico web. Tenéis unas 23 visitas mensuales orgánicas y poquito a poco vais subiendo en búsquedas locales en Madrid.\n\nCuando una clínica tiene volúmenes manejables, el problema no es que no den abasto. El problema es mucho más grave: No os podéis permitir el lujo de que se os escape ni una sola de esas 23 personas. Si alguien que busca «clínicas capilares madrid» entra a las 9 de la noche en vuestra web y no tiene un estímulo interactivo e inmediato, se vuelve a Google y hace clic en el gigante de al lado.\n\nNosotros instalamos un Asistente Médico de IA que actúa como un recepcionista de guante blanco. Su objetivo no es filtrar a miles de personas, sino exprimir el 100% de vuestro escaso tráfico. Si alguien lee vuestro post sobre la 'Escala de Norwood', el bot le aborda: «¿Te preocupa el grado de tus entradas? Cuéntame tu caso y te doy cita con nuestros cirujanos.»\n\nNo intentamos venderos una campaña gigante de SEO. Intentamos que, de las 23 visitas que ya tenéis, saquéis 3 o 4 leads al mes reales, en vez de cero.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dudan por falta de presupuesto/tráfico: 'Precisamente porque el tráfico es bajo ahora mismo, no podéis depender de que el usuario haga el esfuerzo proactivo de ir a Contacto, copiar el número y mandaros un WhatsApp. La IA es proactiva: va a buscarle al artículo que esté leyendo, sea la hora que sea, y le exprime la duda para pedirle el teléfono. Cada paciente cuenta.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "neocapilar", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://www.neocapilar.es/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Neocapilar",
          slug: "neocapilar",
          industry: "Clínica Capilar (Boutique)",
          location: "Madrid",
          seoMetrics,
          websites: { create: { url: "http://www.neocapilar.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Neocapilar inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
