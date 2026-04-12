import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const wpText = "\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si te dicen que tienen WhatsApp: 'Con 1 visita al mes, un botón de WhatsApp es un error estratégico. Si tienes un solo cliente entrando por la puerta de tu local, ¿le pones un cartel que dice 'escríbeme por WhatsApp y vete' o le pones una recepcionista Premium a ofrecerle un café? El cliente pulsa WhatsApp en una web muerta y no te escribe porque no hay confianza. Mi Asistente Cognitivo le habla ahí mismo, le de la bienvenida, le genera autoridad y le cierra la cita en firme. Hay que salvar a los únicos que entran.'";

  const seoMetrics = {
    summary: "Arquetipo: 'El Páramo Digital'. Otro Exact Match Domain ('Injerto Capilar Premium Sevilla') creado para engañar a Google hace años, pero totalmente penalizado o ignorado hoy. Tienen exactamente UNA sola visita al mes. Es una web comercialmente en ruinas orgánicas.",
    traffic: "1 visita al mes. Literalmente el tráfico de que el dueño o su primo entren a ver si sigue subida la web.",
    cost: "No pierden clientes, es que simplemente no existen. Operan en un local vacío a nivel web. Cualquier persona que entre aquí lo hace o por publicidad de pago directa o por un milagro, y ese milagro vale su peso en oro.",
    socialTraffic: "No tienen peso. Tienen 3 backlinks tóxicos o inútiles. Nadie habla de esta URL.",
    topPages: "La Home se lleva la única visita. Tienen una landing específica de 'Alcalá de Guadaira' que está muerta (0 visitas).",
    competitors: "Están en la posición 21 para 'clínica capilar sevilla'. Es página 3, donde se esconden los cadáveres. Para cuando un paciente de Alcalá busca una clínica, elige cualquiera de los 20 anteriores.",
    insights: "PITCH DIRECTO AL OWNER (Foco en Brutal Honestidad y Re-animación):\n'He pasado tu web (injertocapilarpremiumsevilla.com) por los escáneres SEO y tengo que darte el diagnóstico más crudo posible: a efectos de Google, estáis en coma. Tenéis exactamente 1 visita al mes según nuestros analistas.\n\nTener un dominio con tu nombre de servicio y ciudad ya no funciona como en 2014. Google lo ve como spam o pobre en contenido, y os tiene castigados en los sótanos (Posición 21). \n\nNo obstante, aquí hay solución si usamos la cabeza. Una web de 1 visita al mes no se puede permitir el lujo de usar métodos de hace diez años. Si mandas tráfico de pago o lográis rascar a una persona presencial, no pueden ver un formulario frío ni un triste botón de WhatsApp. Cierran y se van al competidor que esté en el número 1.\n\nFase 1: Vamos a transformar este 'local vacío' en una experiencia Premium. Te voy a instalar nuestro Asistente Inteligente. La primera persona que pise la web será recibida al milisegundo por un asesor capilar virtual, interactuando en caliente y agendándole una valoración en Alcalá de Guadaira. Retenemos al 100%.\n\nFase 2: Con la IA operando como trituradora de conversión, metemos tráfico real mediante una auditoría SEO profunda, para que dejéis la posición 21 y capturéis lo que es vuestro.'" + wpText
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: "injertocapilarpremiumsevilla" }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics: seoMetrics }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Injerto Capilar Premium Sevilla",
          slug: "injertocapilarpremiumsevilla",
          industry: "Hair Clinic",
          location: "Sevilla (Alcalá de Guadaira)",
          seoMetrics: seoMetrics,
          websites: {
            create: { url: "http://injertocapilarpremiumsevilla.com/" }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Páramo Digital inyectado a la perfección" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
