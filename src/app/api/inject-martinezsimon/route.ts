import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const slug = "martinezsimon";

    const existingClinic = await prisma.clinic.findFirst({
      where: { slug: slug },
    });

    const seoMetrics = {
      summary: "Arquetipo: 'La Wikipedia de la Medicina Capilar / El Atrapasueños de los Mirones'. Su tráfico es enorme y técnico.",
      traffic: "8,243 visitas mensuales.",
      cost: "Pierden miles de euros al mes porque la gente entra, lee sus artículos extensos sobre minoxidil/dutasteride para aprender a automedicarse, y luego se van para pedirle la receta a otro médico.",
      topPages: "- /dutasteride-topico (1K visitas)\n- /como-combinar-finasteride... (470 visitas)\n- /finasteride-topico (468 visitas)",
      competitors: "Páginas grandes informacionales y clínicas nacionales.",
      socialTraffic: "Tráfico netamente SEO de usuarios altamente formados que buscan estudios.",
      insights: "Hola Clínica Martínez Simón. He analizado vuestro tráfico y el volumen orgánico que tenéis es extraordinario (más de 8.000 visitas/mes). Os habéis posicionado como la auténtica referencia en España sobre tratamientos farmacológicos complejos como el Dutasteride tópico, la Pirilutamida o el Nanoxidil.\n\nPero aquí está el dolor: tenéis un tráfico extremadamente técnico y cauteloso. Son los 'Mirones Informativos'. Leen minuciosamente vuestros artículos buscando dosis y efectos secundarios, y como no hay una llamada a la acción transaccional clara, se van con la información regalada a automedicarse o a su médico de cabecera. Es una fuga de conversión masiva.\n\nNecesitáis un Filtro Consultivo de IA. Un asistente médico digital que actúe en esos artículos clave y lance el salvavidas: «Hola, veo que te interesa nuestro artículo sobre la formulación del Dutasteride tópico frente a la caída. El éxito de estos tratamientos y evitar efectos secundarios depende 100% de la dosis exacta para tu perfil. ¿Quieres que los doctores valoren tu caso para prescribirte tu fórmula magistral de manera segura?».\n\nNo dejen que se lleven su 'know-how' gratis. Usen la IA para convertir a esos miles de lectores eruditos en pacientes de suscripción de fórmulas magistrales y consultas online."
    };

    if (existingClinic) {
      await prisma.clinic.update({
        where: { id: existingClinic.id },
        data: { 
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject
        },
      });
      return NextResponse.json({ success: true, message: "Martinez Simón actualizado correctamente." });
    } else {
      await prisma.clinic.create({
        data: {
          name: "Clínica Martínez Simón",
          slug: slug,
          // @ts-expect-error: Prisma schema update might not be reflected in IDE
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://martinezsimon.com/" } }
        },
      });
      return NextResponse.json({ success: true, message: "Martinez Simón inyectado correctamente." });
    }
  } catch (error) {
    console.error("Error al inyectar Martinez Simón:", error);
    return NextResponse.json({ success: false, error: "Error al inyectar Martinez Simón" }, { status: 500 });
  }
}
