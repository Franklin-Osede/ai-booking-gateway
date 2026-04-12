import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Goliat Nacional / Embudo Saturado'. Tráfico monstruoso de 29,866 visitas orgánicas al mes. Tráfico transaccional #1 en Valencia e informacional dominando España. El problema de Freitas no es la captación, es el filtrado.",
    traffic: "29,866 visitas orgánicas mensuales. Más de 1.000 personas entrando a su web cada día.",
    cost: "Con 30.000 visitas al mes, el coste de oportunidad está en el equipo de recepción: están perdiendo horas preciosas separando la 'paja' (curiosos leyendo sobre botox capilar o picores) del 'trigo' (pacientes listos para pagar 4.000€).",
    topPages: "Home, blog de dolor de cuero cabelludo, blog de botox capilar, blog de ketoconazol y blog de alopecia en la coronilla.",
    competitors: "Compiten por volumen a nivel de multinacional (tipo Svenson o Insparya) pero con posicionamiento de clínica boutique premium.",
    socialTraffic: "Bajo a nivel orgánico asilado, pero altísima autoridad (DA 24, 6.000 backlinks).",
    insights: "PITCH CONSULTIVO: EL FILTRO DE ALTO RENDIMIENTO\n\n'Hola equipo de Clínica de Freitas. Vuestros números de captación son un escándalo orgánico: casi 30.000 visitas al mes. Tenéis a 1.000 personas diarias entrando por la puerta digital de la clínica.\n\nCuando se tiene este volumen, el problema cambia. Ya no es 'cómo consigo que me vean', sino 'cómo evito que mi equipo comercial y médico se sature contestando emails basura o agendando citas a gente que solo venía a leer sobre su champú de ketoconazol'.\n\nLo que necesitáis no es más marketing, es una Capa de Inteligencia Automatizada. Un Asistente de IA en la web que funcione como un recepcionista de élite 24/7. Que tome a esos 30.000 y aplique un triaje médico: que cualifique al paciente, le pregunte por su grado de alopecia (escala Norwood), le pida fotos y, SOLO si es un perfil quirúrgico válido y con intención, pase el contacto directo a los doctores. Automatizamos la criba para que el doctor Freitas y el equipo solo hablen con pacientes listos para operarse.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "freitas" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://www.clinicadefreitas.com/" } }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica de Freitas",
          slug: "clinicadefreitas",
          industry: "Clínica Capilar",
          location: "Valencia (y Nacional)",
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://www.clinicadefreitas.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Freitas inyectada correctamente." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
