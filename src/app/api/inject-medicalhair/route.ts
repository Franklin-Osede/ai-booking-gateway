import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Pulpo Multisede'. A diferencia de otros que centralizan el tráfico, Medical Hair tiene una estrategia SEO híper-fragmentada y muy exitosa a nivel local. Su página de Murcia tracciona más de 1.100 visitas solita, superando incluso a su Home. Vigo, Valencia y Benidorm le siguen. Su reto es la conversión hiperlocal.",
    traffic: "Muy alto (miles de visitas) pero descentralizado. Un usuario no aterriza en 'Medical Hair España', aterriza en la landing de su ciudad concreta buscando inmediatez local.",
    cost: "El gran riesgo de las franquicias es la pérdida de identidad y lentitud centralizada. Si las 1.100 personas de Murcia caen en un embudo genérico o un call center que no les da cita rápida en su localidad, el paciente se va a una clínica de barrio por percibir un trato más 'cercano'. El coste de perder la ventaja local en 10 ciudades a la vez asciende a millones anuales.",
    socialTraffic: "Fuerte empuje orgánico y buen perfil de enlaces (especialmente en la sede principal y Vigo con +1.500 shares).",
    topPages: "1º Murcia (1113v), 2º Vigo (627v), 3º Valencia (509v), 4º Benidorm (416v), 5º Zaragoza (364v). La Home principal está en 7º lugar. Esto demuestra un ecosistema SEO local puramente transaccional.",
    competitors: "Compiten en dos frentes: nacionalmente contra las grandes corporaciones y localmente contra el 'cirujano independiente' de cada ciudad, que ofrece un trato más personalizado que a veces a Medical Hair le cuesta dar por su tamaño.",
    insights: "PITCH DIRECTO AL OWNER/FRANQUICIADO MAYOR (Foco en Conversión Hiperlocal y Calidez automatizada):\n'He mapeado toda vuestra red de tráfico. Sois el Pulpo del sector en España. No dependéis de un solo hilo, tenéis arterias gigantescas de tráfico hiper-cualificado cayendo en Murcia (1.100+ visitas), Vigo, Valencia, Benidorm... Es una estructura perfecta.\n\nPero el punto débil del modelo multisede es la fricción en la recepción. Cuando alguien busca 'clínica en Murcia' y entra en vuestra landing local, espera un trato cálido y de barrio. Si le obligáis a rellenar un formulario genérico o le contesta un call-center nacional 3 horas después, perdéis contra el cirujano local de la ciudad que le coge el teléfono al instante.\n\nFase 1: Implantación de Recepción IA Hiperlocal (Multi-agente). Instalo la IA en vuestra web y la configuro para que sea contextualmente inteligente. Si el lead entra desde la URL de Murcia, la IA se presenta como experta en la clínica de Murcia, le habla de por qué vuestra sede allí es top y le cierra una cita directamente en la agenda presencial de Murcia. Si entra por Vigo, la IA muta a Vigo de inmediato.\n\nDais la calidez y rapidez del cirujano local, pero con la fuerza y escalabilidad del monstruo corporativo que sois. No se escapa ni un lead a la competencia de barrio.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si el equipo dice que ya derivan a las sedes rápido: 'Cualquier derivación manual tiene lag. 10 minutos de lag en internet es tiempo suficiente para que el paciente pida cita en otra clínica en la pestaña de al lado. Vuestro tráfico llega geolocalizado, la retención también tiene que estarlo en el milisegundo 1. Y eso solo lo hace esta IA.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "medicalhair", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://www.medicalhair.es/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Medical Hair",
          slug: "medicalhair",
          industry: "Clínica Capilar",
          location: "España",
          seoMetrics,
          websites: { create: { url: "http://www.medicalhair.es/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Medical Hair inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
