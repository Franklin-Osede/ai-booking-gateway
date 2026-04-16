import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'mediteknia'
      }
    });

    const seoMetricsData = {
      summary: 'El Hipocondríaco Digital (Tráfico Médico de Miedo y Urgencia)',
      traffic: 'Volumen fuerte y elástico (1,500+ visitas/mes). Picos estacionales impulsados por artículos de consulta médica de alta preocupación.',
      cost: 'Lead Value: Extraordinario en Urgencia. Tráfico guiado por miedo («lunar que sangra») requiere conversión instintiva, no pasiva.',
      topPages: '1. Láser Q-SWITCHED ND-YAG (400+ visitas técnicas)\n2. Costra/Grano que no se quita (160+ visitas de miedo clínico)\n3. Por qué me pica la cabeza (150+ visitas)',
      competitors: 'Foros de salud generalistas y páginas tipo WebMD, a los que barren por autoridad médica local.',
      socialTraffic: '',
      insights: 'Hola equipo de Mediteknia. Hemos volcado vuestra huella web en nuestra IA de Inteligencia Comercial y el informe revela un motor de captación orgánico fascinante. Mantenéis más de 1,500 visitas al mes, con fluctuaciones muy marcadas, pero una base poderosísima.\n\nSin embargo, la auditoría del Comportamiento nos revela una fuga financiera enorme en un arquetipo que llamamos «El Hipocondríaco Digital» o «Tráfico de Pánico».\n\nLa realidad de vuestros datos es que estáis capturando a cientos de personas cada mes a través de búsquedas de alerta médica grave: «lunar que sangra», «grano en la nariz cáncer» o «costra que no se cura». El perfil psicológico de esta visita es un paciente asustado buscando paz mental rápida. El fallo crítico de conversión de vuestra web actual es recibir a ese paciente asustado con un bloque de texto informativo, y dejar la página estática. El paciente entra, se sugestiona o asusta más al leer los síntomas de melanoma, y se marcha corriendo a urgencias o a buscar a otro doctor que le pinte más rápido en Google.\n\nNo se puede recibir tráfico de "Miedo Clínico" sin ponerles una ambulancia en la puerta de salida. Vuestra Inyección de Rentabilidad Inmediata pasa por un Sistema de Triaje IA en caliente.\n\nSi el usuario entra en vuestro artículo sobre el cáncer de piel o la costra persistente, la Inteligencia Artificial debe bloquear su lectura a los 10 segundos con un tono médico autoritario y compasivo: «Hola. Veo que estás consultando síntomas sobre lesiones de la piel. Buscar diagnósticos en internet genera mucha ansiedad innecesaria. Soy la coordinadora técnica del Dr. Jiménez en Las Palmas. Tengo un hueco de cribado rápido mañana por la mañana para revisar esa lesión directamente. ¿Quieres que te lo bloquee por este chat en 30 segundos y sales de dudas?».\n\nEstáis educando al paciente, pero dejando que el miedo se lo lleve a hacer la caja a otro doctor. Si interceptáis esa vulnerabilidad en caliente con una cita rápida, multiplicaréis vuestros ingresos dermatológicos de urgencia con el mismo tráfico que tenéis hoy.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://mediteknia.es' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Mediteknia (Dermatología Las Palmas)',
          slug: 'mediteknia',
          industry: 'Clínica Dermatológica y Capilar',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://mediteknia.es' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Mediteknia inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Mediteknia:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
