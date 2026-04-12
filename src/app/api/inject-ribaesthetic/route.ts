import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const clinic = await prisma.clinic.findFirst({
      where: {
        slug: 'ribaesthetic'
      }
    });

    const seoMetricsData = {
      summary: 'Código Rojo: Dominio Zombi por Perfil Tóxico de Enlaces',
      traffic: 'Tráfico Muerto (0 visitas). Curva plana tras un pico anómalo de 400 visitas en 2025, típico de tráfico bot o spam.',
      cost: 'Lead Value: Inexistente en orgánico. Perfil con altísimo riesgo de penalización (6,569 backlinks vs DA 6). Competir ahora mismo es inviable.',
      topPages: '1. Inexistente (No indexados correctamente)',
      competitors: 'Ninguno en el ecosistema orgánico.',
      socialTraffic: '',
      insights: 'Hola equipo de Rib Aesthetic. Hemos monitorizado vuestra huella técnica digital y tenemos que enviaros una valoración de "Código Rojo". En estos momentos sufrís lo que denominamos un estado de «Dominio Zombi o Penalizado».\n\nVuestras métricas acusan literalmente 0 visitas orgánicas y 0 palabras clave posicionadas. Sois opacos para los buscadores. El dato crítico que explica esto son vuestros enlaces: presentáis más de 6,569 backlinks pero con un Domain Authority bajísimo de 6. El 99.9% de esos enlaces son «NoFollow» o de bajísima calidad. Esta huella es el clásico patrón de un ataque de spam negativo o SEO tóxico obsoleto. Es casi seguro que Google ha aplicado una devaluación severa (penalización) a vuestro dominio.\n\nCualquier euro que invirtáis a corto plazo en SEO será ignorado por los buscadores al estar en "cuarentena". Recuperar esa confianza tomará meses de limpieza (Disavow).\n\nEl salvavidas inmediato no es pelear contra Google, es exprimir al máximo y con fiereza el tráfico directo y social (vuestro boca a boca, Instagram...).\nNo os podéis permitir perder ni a 1 de las 5 personas que entran tecleando vuestra dirección al mes. La clave está en inyectar un «Recepcionista IA de Conversión Crítica». Cuando el paciente recomendado logre entrar a la web, el asistente saltará: «¡Hola! Veo que llegas de forma directa. Soy el asistente de guardia, ¿puedo gestionarte tu cita para valoración con nosotros en menos de 1 minuto?».\nCon 0% de visibilidad exterior, la supervivencia depende de convertir al 100% el tráfico interior.'
    };

    if (clinic) {
      await prisma.clinic.update({
        where: { id: clinic.id },
        data: { 
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://www.ribaesthetic.com' }
          }
        }
      });
    } else {
      await prisma.clinic.create({
        data: {
          name: 'Rib Aesthetic',
          slug: 'ribaesthetic',
          industry: 'Clínica de Medicina Estética',
          seoMetrics: seoMetricsData as Prisma.InputJsonObject,
          websites: {
            create: { url: 'https://www.ribaesthetic.com' }
          }
        }
      });
    }

    return NextResponse.json({ success: true, message: 'Rib Aesthetic inyectada correctamente.' });
  } catch (error) {
    console.error('Error injecting Rib Aesthetic:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
