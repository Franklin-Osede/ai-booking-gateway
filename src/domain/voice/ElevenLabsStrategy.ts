import { IVoiceStrategy, VoiceIntent, VoiceContextParams } from './VoiceIntent';

export class ElevenLabsStrategy implements IVoiceStrategy {
  getPrompt(intent: VoiceIntent, params: VoiceContextParams): string {
    switch (intent) {
      case VoiceIntent.GREETING:
        return `¡Hola! Bienvenido a ${params.brandName}. Soy Laura, tu asesora virtual. ¿De qué servicios te gustaría recibir más información?`;
      
      case VoiceIntent.ASK_SERVICE: {
        let htIntro = "En tu valoración médica gratuita analizaremos tu caso particular sin compromiso.";
        if (params.isHT) {
           if (params.userSelection === "Técnica FUE / DHI") {
              htIntro = "La técnica F-U-E trasplanta los folículos pelo a pelo, sin dolor ni cicatrices, aportando una densidad completamente natural... En tu valoración médica gratuita analizaremos tu caso particular al milímetro.";
           } else if (params.userSelection === "Tratamientos Preventivos") {
              htIntro = "Nuestros tratamientos frenan de raíz la caída y estimulan el crecimiento de pelo nuevo, multiplicando toda tu densidad... En tu valoración gratuita analizaremos las causas de tu caso particular.";
           } else if (params.userSelection === "Seguimiento Postoperatorio") {
              htIntro = "El correcto seguimiento posoperatorio es la clave maestra para garantizar que esos nuevos cabellos crezcan sanos y fuertes tras la cirugía... En tu valoración gratuita podemos analizar tu evolución.";
           }
        }
        return params.isHT 
          ? `Estupendo. ${htIntro} ¿Te gustaría agendar una videollamada con el doctor... o prefieres más información de nuestros servicios en clínica?`
          : `Perfecto. ¿Con qué especialidad o tratamiento te gustaría continuar tu sesión hoy?`;
      }
      
      case VoiceIntent.DOCTOR_PITCH:
        return `${params.pitchText}... ¿Quieres ver al equipo médico... o prefieres que agendemos tu valoración ahora?`;
      
      case VoiceIntent.OTHERS:
        return "Claro, aquí tienes al resto del equipo titular. Dime con quién prefieres agendar.";
      
      case VoiceIntent.BYE:
        return "No te preocupes. Estoy aquí cuando me necesites para dar ese gran paso.";
      
      case VoiceIntent.ASK_PHOTOS: {
        let pQuestion = `Excelente decisión. Antes de abrir el calendario, ¿podrías subir tres fotos rápidas de tu caso? Así el equipo médico podrá evaluarlas antes de tu cita.`;
        if (params.userSelection && params.userSelection.startsWith("Reservar")) {
            pQuestion = `Excelente elección. Antes de abrir la agenda de ${params.doctorName}, ¿podrías subir tres fotos de tu caso? Así las revisará antes de conectarse.`;
        }
        return pQuestion;
      }
      
      case VoiceIntent.ASK_CALENDAR:
        if (params.userSelection === "Fotos subidas") {
           return "¡Perfecto! Las he adjuntado a tu expediente seguro. Ahora sí, elige el día y la hora que mejor te vengan aquí abajo.";
        }
        return "De acuerdo, accede al calendario y selecciona la fecha y la hora que prefieras.";
      
      case VoiceIntent.CONFIRM_BOOKING:
        return params.isHT 
             ? `¡Estupendo!... Tu reserva con ${params.doctorName} en nuestra clínica ha quedado confirmada... Te esperamos.`
             : `¡Estupendo! Tu reserva con ${params.doctorName} para el día ${params.selectedDate} a las ${params.spokenTime} ha quedado confirmada, te esperamos.`;
             
      default:
        return "";
    }
  }
}
