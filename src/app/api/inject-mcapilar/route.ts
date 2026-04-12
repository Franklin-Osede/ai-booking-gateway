import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const seoMetrics = {
    summary: "Arquetipo: 'El Cohete en Ascenso'. MCapilar está haciendo un trabajo SEO verdaderamente extraordinario. Están rankeando en Top 1 para la keyword genérica 'clinica capilar' a nivel nacional. Su tráfico ha explotado en los últimos meses rozando las 4.000 visitas. Son un jugador muy potente que ya ha descifrado la captación.",
    traffic: "Espectacular. Han pasado de ~1.000 a rozar las 4.000 visitas orgánicas puras. Un volumen de atención muy alto impulsado por el Top 1 en 'clinica capilar'.",
    cost: "El desafío aquí no es captar, sino absorber. Si este aluvión de tráfico nuevo satura las líneas o retrasa los tiempos de respuesta, un % de leads muy valiosos se enfrían. Invertir tanto en SEO y perder pacientes en la barrera de recepción por puro volumen sería una pena.",
    socialTraffic: "Perfil sólido con claro enfoque orgánico y en marca. La gente busca proactivamente 'mcapilar'.",
    topPages: "1º Home (3144v), 2º Testimonios (184v), 3º Oviedo (179v). El hecho de que Testimonios sea su segunda URL con más visitas habla de un paciente que busca confianza e información empática antes de dar el paso.",
    competitors: "Se codean ya en visibilidad de marca y captación nacional con gigantes consolidados. Compiten duramente por leads de Madrid (rankean Top 4 y Top 6 para 'clinicas capilares madrid').",
    insights: "PITCH CONSULTIVO Y HUMILDE (Foco en Aliarnos para Absorber su Excelente Crecimiento):\n'Hola [Nombre], he estado analizando vuestra curva de crecimiento digital y quería felicitaros genuinamente. Rankear Top 1 para «clinica capilar» a nivel nacional es algo muy difícil de lograr. Vuestro volumen de tráfico está creciendo como la espuma y se nota que estáis haciendo las cosas extremadamente bien.\n\nEl motivo de mi contacto es que, interactuando con clínicas en esta fase de crecimiento tan acelerado (casi 4.000 visitas mes), a menudo me cuentan que el gran reto pasa de ser «conseguir leads» a «poder atenderlos a todos con la máxima calidez y rapidez». Sé que vuestra página de «Testimonios» es de las más visitadas —los pacientes os buscan buscando confianza.\n\nPara proteger ese trato humano que os diferencia y evitar que vuestro gran equipo se sature con respuestas repetitivas, estoy integrando Asistentes Médicos de IA en webs de alto tráfico. Trabajaría como un apoyo para vuestras coordinadoras: recibiendo al paciente con total amabilidad 24/7, resolviendo dudas iniciales sobre si sois los adecuados para ellos, y pasándoles a vuestro equipo sólo los contactos que ya están cálidos y listos para agendar.\n\nMe encantaría mostraros cómo esta tecnología se acoplaría a vuestra web sin fricciones, trabajando codo con codo con vosotros.'\n\n[MATA-OBJECIONES WP - EL CIERRE MAESTRO]: Si dicen que su equipo ya lo hace todo perfecto: 'No lo dudo ni un segundo, vuestros testimonios demuestran vuestra gran calidad. Precisamente la IA no viene a reemplazar a nadie, sino a proteger el tiempo de vuestros profesionales. Una secretaria no debería gastar 30 minutos al día en responder cuál es la dirección en Oviedo, sino en cerrar la venta con el paciente que ya está convencido.'"
  };

  try {
    let clinic = await prisma.clinic.findFirst({
      where: { slug: { contains: "mcapilar", mode: "insensitive" } },
      orderBy: { createdAt: 'asc' }
    });

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { seoMetrics, websites: { create: { url: "http://clinicamcapilar.com/" } } }
      });
    } else {
      clinic = await prisma.clinic.create({
        data: {
          name: "MCapilar",
          slug: "mcapilar",
          industry: "Clínica Capilar",
          location: "España",
          seoMetrics,
          websites: { create: { url: "http://clinicamcapilar.com/" } }
        }
      });
    }

    return NextResponse.json({ success: true, message: "MCapilar inyectada" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
