import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Gigante Herido' (Caída Severa de Tráfico). Clínica Ibiza es una potencia en medicina estética (Botox, Cirugía, Capilar), pero sus gráficas muestran un sangrado crítico: han pasado de más de 45.000 visitas mensuales a principios de 2024 a apenas 9.310 visitas en marzo de 2026. Han perdido casi el 80% de su tráfico SEO orgánico.",
    traffic: "9.310 visitas al mes distribuidas en más de 5.400 keywords. Aunque el volumen sigue siendo alto, la tendencia bajista es alarmante.",
    cost: "El coste no es solo el tráfico perdido, es la rentabilidad de las instalaciones. Una clínica que estaba dimensionada para recibir leads de 45.000 visitas al mes, ahora tiene que subsistir con 9.000. Si su web sigue convirtiendo al mismo porcentaje histórico (ej. 2%), ahora tienen 5 veces menos pacientes entrando por la puerta.",
    topPages: "Rankean top 1 en búsquedas altísimamente transaccionales de estética general: 'precios botox', 'drenaje linfático facial', 'blefaroplastia', etc.",
    competitors: "Están perdiendo terreno frente a competidores hiper-especializados tanto en capilar como en estética avanzada.",
    socialTraffic: "Con 9.000 visitas orgánicas, sigue siendo un volumen que muchas clínicas soñarían, pero para ellos es una crisis interna.",
    insights: "PITCH CONSULTIVO: EL TORNIQUETE DE CONVERSIÓN\n'Hola [Nombre], te llamo porque nuestro equipo ha estado auditando el histórico de tráfico de las grandes clínicas de Madrid y hemos visto la gráfica de Clínica Ibiza. Vemos que venís de cifras espectaculares (más de 40.000 visitas) pero habéis sufrido una contracción SEO severa este último año, estabilizándoos en unas 9.000 visitas mensuales.\n\nSabemos el estrés que esto genera a nivel de recepción y ventas. Cuando pasas a tener una fracción del tráfico que tenías antes, ya no te puedes permitir las 'fugas'. Si con 45.000 visitas te podías permitir que el 98% de la gente mirara los precios del Botox y se fuera sin dejar el teléfono, con 9.000 visitas cada fuga es un drama en la facturación.\n\nNo venimos a venderos SEO para recuperar esas 40.000 visitas; eso ya lo pelearán vuestras agencias. Nosotros instalamos un 'Torniquete de Conversión'. Un Asistente Médico de IA que aborda a esas 9.000 personas que aún tenéis. En vez de depender de que encuentren el formulario, la IA les salta: «Hola, ¿buscas información sobre los precios del Botox o sobre técnica FUE? Cuéntame tu caso». \n\nEl objetivo es hiper-optimizar: exprimir estas 9.000 visitas para que os generen el mismo número de teléfonos y citas que os generaban las 45.000 visitas del año pasado.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dicen que su agencia SEO ya les está arreglando la caída: 'Por supuesto, y seguro que volveréis a subir. Pero el SEO tarda meses en remontar. Mientras tanto, este mes y el que viene seguís con 9.000 visitas. La IA se implanta hoy mismo. No arregla a Google, arregla el embudo de los pacientes que SÍ están entrando hoy, asegurando la rentabilidad de la clínica este mismo trimestre.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "clinicaibiza", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://www.clinicaibiza.com/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "Clínica Ibiza",
          slug: "clinicaibiza",
          industry: "Clínica Medicina Estética y Capilar (Caída SEO)",
          location: "Madrid",
          seoMetrics,
          websites: { create: { url: "http://www.clinicaibiza.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "Clínica Ibiza inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
