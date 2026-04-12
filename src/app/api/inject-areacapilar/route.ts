import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'La Clínica Fantasma / Start-Up Estancada'. Área Capilar tiene un perfil digital desértico: 0 visitas en Google, DA 1, y además un Instagram de recién nacidos (apenas 10 posts y 18 seguidores). No es una clínica que viva de redes, es un proyecto que acaba de nacer o que directamente está abandonado en el ámbito digital.",
    traffic: "Totalmente nulo. 0 visitas estimadas.",
    cost: "Sufren de una profunda falta de autoridad (trust). Alguien que aterriza en su web (ya sea porque pasaron una tarjeta física o un boca a boca) y luego mira su Instagram de 18 seguidores, siente desconfianza clínica inmediata.",
    topPages: "Inexistente.",
    competitors: "No compiten digitalmente. Están fuera del mapa y a años luz de las grandes.",
    socialTraffic: "Instagram prácticamente muerto (10 posts, 18 seguidores). Su adquisición es hiper-local y boca a boca.",
    insights: "PITCH CONSULTIVO: EL ATAJO DE AUTORIDAD (FAKE IT TILL YOU MAKE IT)\n'Hola [Nombre], voy a ser muy honesto. He estado echando un ojo no solo al nulo tráfico web orgánico (0 visitas), sino también a vuestras redes, donde veo que estáis arrancando con apenas 18 seguidores. Esto me indica que estáis en una fase súper inicial o dependiendo puramente del boca a boca local.\n\nEl problema que tenéis es de «Autoridad Clínica Acumulada». Si alguien os descubre y busca vuestra web o vuestro Instagram, la imagen visual que se llevan es de una clínica vacía o novata. Esto genera mucha fricción en el mundo médico capilar, donde los pacientes exigen máxima seguridad y ven a Capilclinic con miles de seguidores.\n\nNosotros instalamos Asistentes Médicos de IA. Para una clínica gigante, la IA es un filtro. Pero para vosotros, es «Estatus Inmediato». Poner nuestro Asistente en vuestra web da un salto tecnológico brutal: pasáis de ser una web que parece inactiva, a ser una Clínica Boutique con tecnología de vanguardia y atención instantánea 24/7 en vuestra página principal.\n\nEn un sector de alto ticket, la IA suple la falta de años de SEO e Instagram, proyectando un servicio al cliente súper premium que genera toda la confianza que ahora mismo os falta.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dudan porque acaban de empezar o no tienen dinero: 'Precisamente porque sois pequeños, no os podéis permitir perder a la ÚNICA persona que pisa vuestra web al día por el boca a boca. No podéis pagar ahora 10.000 euros en SEO, pero podéis blindar la percepción de vuestros pacientes actuales hoy mismo. La IA les recibe como en una clínica de 5 estrellas, camuflando la falta de volumen.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "areacapilar", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://www.areacapilar.com/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Área Capilar",
          slug: "areacapilar",
          industry: "Clínica Capilar (Redes/Ads)",
          location: "España",
          seoMetrics,
          websites: { create: { url: "http://www.areacapilar.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Área Capilar inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
