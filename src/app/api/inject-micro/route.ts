import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'La Inversión Muerta / El Exact-Match Fallido'. Compraron el dominio 'micropigmentacioncapilarcadiz.com' pensando que solo con la palabra clave conseguirían clientes. La realidad hoy: Autoridad de Dominio 1 y exactamente CERO visitas orgánicas al mes. Su estrategia SEO está clínicamente muerta.",
    traffic: "CERO VISITAS orgánicas al mes. Rankear en la posición 47 en Google es igual que no existir. Absolutamente invisibles.",
    cost: "El coste de oportunidad es la dependencia total y absoluta de Ads o plataformas como Treatwell. Si su web tiene tráfico, viene 100% pagado de Meta o Google Ads. Si pagan por clics a una web vacía y el paciente se va, queman billetes.",
    topPages: "N/A. Dominio sin peso en buscadores.",
    competitors: "Casi cualquier clínica o peluquería en Cádiz con un perfil de Google Business medianamente activo les roba los pacientes.",
    socialTraffic: "Asumimos que sobreviven o de referidos muy cerrados, o derivando todo por Instagram o anuncios pagados.",
    insights: "PITCH CONSULTIVO: EL PARACAÍDAS PARA ADS (SALVANDO CLICS PAGADOS)\n\n'Hola [Nombre], he auditado micropigmentacioncapilarcadiz.com y el diagnóstico es muy crudo: Autoridad 1 y Cero visitas desde Google. La estrategia de usar el nombre del tratamiento en el dominio funcionaba en 2010, pero hoy sois invisibles orgánicamente.\n\nSé perfectamente que esto significa que si queréis pacientes digitales estáis obligados a pagar Google Ads o Facebook Ads. Y si pagas 2€ o 3€ por clic para traer a alguien a tu web, no puedes permitirte que entre, mire precios y se vaya sin decir nada.\n\nAquí es donde entramos. No os vamos a vender humo ni SEO. Os instalamos un Asistente Médico de IA que actúa como un 'Paracaídas para vuestros Ads'. Si invertís en traer a alguien desde Facebook, el Asistente le aborda en la Landing Page: 'Hola, ¿buscabas tratar tu alopecia en Sanlúcar/Cádiz de forma no invasiva? Te doy los precios por WhatsApp.'\n\nHacemos que la poca inversión que podéis hacer en Ads sea rentable porque atrapamos el contacto antes de que el usuario cierre la pestaña. Si el tráfico es caro, hay que exprimirlo.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: "micropigmentacioncapilarcadiz" },
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
    }

    return NextResponse.json({ success: true, message: "Micropigmentación inyectada correctamente." });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
