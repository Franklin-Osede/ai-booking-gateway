import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Gigante del E-commerce Emocional'. Sus números son abrumadores: casi 10.000 visitas orgánicas al mes (9.702) y autoridad de dominio 31. No son una clínica estándar, son los reyes nacionales en venta de prótesis capilares y pelucas de pelo natural.",
    traffic: "9.702 visitas. Dominan palabras clave top como 'pelucas pelo natural' (Posición 1, 1765 visitas) y 'prótesis capilar'. Tienen un tráfico masivo de e-commerce.",
    cost: "La Fricción del 'Añadir al Carrito'. Vender una prótesis o peluca oncológica no es vender una camiseta. Es una compra de alto ticket (cientos o miles de euros) cargada de miedo, dudas y dolor emocional. Si confían solo en un botón de compra frío, la tasa de abandonan de carrito será gigantesca.",
    topPages: "La URL '/pelucas-pelo-natural/' atrae más de 5.000 visitas. La sección de prótesis hombre casi 1.000 visitas.",
    competitors: "Peluquerías locales o clínicas que ofrezcan un trato humano y consultivo presencial.",
    socialTraffic: "Fuerte, pero el SEO es su motor principal.",
    insights: "PITCH CONSULTIVO: EL PERSONAL SHOPPER ONCOLÓGICO / CAPILAR\n\n'Hola equipo de Centros Beltrán. Vuestros datos SEO son sencillamente espectaculares. Con cerca de 10.000 visitas mensuales sois el Amazon de las prótesis y pelucas en España. Tenéis el mercado dominado.\n\nPero aquí está la fuga de capital: estáis vendiendo un producto altamente emocional con una interfaz transaccional fría. Cuando una mujer con un diagnóstico reciente de oncología o un hombre con alopecia severa entra a buscar una prótesis, tiene miedo. ¿Se notará? ¿Cómo me mido la cabeza? ¿Me dará calor? Si solo le mostráis fotos y un botón de 'Añadir al carrito', muchísimos abandonan la web por parálisis por análisis y buscan una tienda física donde alguien les escuche.\n\nPara monetizar esos 10.000 visitantes al máximo, necesitáis un 'Personal Shopper IA Empático'. Una IA que detecte cuando alguien está en la sección de pelucas naturales y salte diciendo: «Hola, sé que elegir tu primera peluca o prótesis es un paso muy delicado. Estoy aquí para acompañarte. Si me cuentas el color que buscas y tus medidas, te ayudo a seleccionar las opciones más indetectables y cómodas para que vuelvas a sentirte tú mism@».\nLa IA asesora, elimina el miedo a equivocarse en la talla, y os captura el lead (o cierra la venta guiada) con una empatía que un 'carrito de la compra' jamás tendrá.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "beltran" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://centrosbeltran.com/" } }
        }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Centros Beltrán",
          slug: "centrosbeltran",
          industry: "Prótesis y Pelucas (E-commerce)",
          location: "Nacional (Sede Vcia)",
          // @ts-expect-error
          seoMetrics: seoMetrics as Prisma.InputJsonObject,
          websites: { create: { url: "http://centrosbeltran.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Centros Beltrán inyectado correctamente." });
  } catch (error: unknown) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
