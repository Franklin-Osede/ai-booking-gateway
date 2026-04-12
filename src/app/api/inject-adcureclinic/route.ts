import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Gigante en Recuperación' (Clínica Multidisciplinar). Adcure Clinic no es solo capilar, es una clínica estética 360. El dato más revelador no son sus 214 visitas actuales, sino que históricamente este dominio tuvo picos gigantescos de +14.000 visitas (octubre 2024), sufriendo una caída severa probablemente por una actualización de Google. Ahora mismo rankean para una mezcla extrema de tratamientos: lipoláser, cirugía íntima, ácido hialurónico y capilar.",
    traffic: "Bajo en la actualidad (214 visitas/mes), pero con un historial de dominio de altísimo tráfico en el pasado. Están en una clara fase de reconstrucción de su visibilidad orgánica.",
    cost: "El coste de oportunidad reside en la diversidad. Al ofrecer un catálogo enorme de cirugías complejas y caras (lipoláser, labioplastia, injerto), perder a 1 solo paciente que entra buscando información de 'perineoplastia' porque no encuentra un trato rápido o le da pudor preguntar por WhatsApp, es perder miles de euros en facturación.",
    topPages: "Sus posts informativos sobre diversos tratamientos estéticos son los que traen migajas de tráfico: 'Pros y contras del lipoláser' (8v), 'Hipertrofia de labios menores' (7v), 'Tipos de orejas' (6v). Su página Home apenas trae tráfico SEO.",
    competitors: "Compiten en diferentes frentes: clínicas capilares, centros de medicina estética y cirujanos plásticos en Madrid. Al abarcar tanto, es difícil tener autoridad temática en un solo sector a los ojos de Google actual.",
    socialTraffic: "Usuarios que buscan resolver complejos estéticos muy íntimos ('orejas raras', 'labios menores'). Suele ser un tráfico con mucho dolor emocional o pudor a la hora de contactar.",
    insights: "PITCH CONSULTIVO Y MULTIDISCIPLINAR:\n'Hola [Nombre], te llamo porque nuestro equipo ha hecho una auditoría de todo vuestro ecosistema digital. Sabemos que Adcure Clinic es una clínica súper completa. De hecho, hemos visto algo muy interesante en vuestro historial SEO: sabemos que vivisteis una época de tráfico brutal hace un par de años y que ahora, por culpa de los algoritmos, el tráfico orgánico se ha estabilizado en unas 200 visitas.\n\nEl motivo de la llamada no es ofreceros SEO para volver a esas cifras estúpidas de tráfico, sino rentabilizar al 300% el escenario actual. Tenéis un catálogo enorme: desde injertos capilares hasta labioplastias o lipoláser. Y cada paciente que entra buscando uno de esos servicios necesita un trato muy diferente. A alguien que busca cirugía íntima a veces le da mucho pudor hacer clic en el WhatsApp y hablar con un recepcionista humano.\n\nNosotros instalamos un Asistente Médico de IA. Su superpoder es que se adapta a CADA página de vuestra web. Si alguien lee sobre lipoláser, le aborda como experto en remodelación corporal. Si alguien lee sobre hipertrofia, le atiende con extrema discreción y tacto. Actúa como un triaje anónimo, perfecto para pacientes dudosos o con pudor. Genera la confianza inicial para sacarles el dato y que vuestro equipo solo llame a pacientes ya consolidados.\n\nNo traemos miles de curiosos, transformamos la calidad de interacción de la gente que ya conseguís meter en la web.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dudan o dicen que su recepcionista atiende bien: 'Seguro que el trato en clínica es de 10. Pero el embudo se rompe antes. El 95% de la gente abandona vuestra web ANTES de atreverse a llamar por teléfono a recepción, especialmente en tratamientos íntimos. El asistente IA elimina esa vergüenza, es una máquina neutra y experta que «suaviza» al paciente.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "adcureclinic", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://adcureclinic.com/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Adcure Clinic",
          slug: "adcureclinic",
          industry: "Cirugía Estética y Capilar",
          location: "España",
          seoMetrics,
          websites: { create: { url: "http://adcureclinic.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Adcure Clinic inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
