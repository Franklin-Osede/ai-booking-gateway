import { IVoiceStrategy, VoiceIntent, VoiceContextParams } from './VoiceIntent';
import { NICHE_CONFIGS } from '../../presentation/config/nicheConfig';

export class PollyStrategy implements IVoiceStrategy {
  getPrompt(intent: VoiceIntent, params: VoiceContextParams): string {
    const nicheConfig = NICHE_CONFIGS[params.niche || 'hair_transplant'] || NICHE_CONFIGS.hair_transplant;
    const scripts = nicheConfig.voice_scripts;
    
    const isEn = String(params.locale || 'es').toLowerCase().startsWith('en');
    
    switch (intent) {
      case VoiceIntent.GREETING:
        return isEn
          ? `Hello! Welcome to ${params.brandName}. I am Laura, your virtual assistant. Which services would you like to know more about?`
          : `¡Hola! Bienvenido a ${params.brandName}. Soy Laura, tu asesora virtual. ¿De qué servicios te gustaría recibir más información?`;
      
      case VoiceIntent.ASK_SERVICE: {
        if (!scripts) {
          // Fallback legacy logic
          return params.isHT 
            ? `Estupendo. En tu valoración médica gratuita analizaremos tu caso particular. ¿Te gustaría agendar una videollamada con el doctor? ¿O prefieres más información de nuestros servicios en clínica?`
            : `Perfecto. ¿Con qué especialidad o tratamiento te gustaría continuar tu sesión hoy?`;
        }

        const exactMatch = params.userSelection && scripts.ask_service_options[params.userSelection];
        let introText = exactMatch || (isEn ? "Perfect, how can we focus your visit today?" : scripts.ask_service_intro);
        if (params.userSelection === "Técnica FUE / DHI") introText = introText.replace("F-U-E", "<say-as interpret-as=\"characters\">FUE</say-as>");
        
        // Si la categoría tiene Deep Dive, el texto introductorio YA TIENE la pregunta de cualificación final
        if (params.userSelection && scripts.deep_dive_chips && scripts.deep_dive_chips[params.userSelection]) {
           return introText;
        }

        let customFallback = isEn ? "TEXT_INTRO Would you prefer to book an assessment now, or need more info?" : scripts.ask_service_fallback;
        if (customFallback.includes('TEXT_INTRO')) {
           customFallback = customFallback.replace('TEXT_INTRO', introText);
           return customFallback;
        } else {
           if (exactMatch) {
              return customFallback.replace('Perfecto.', introText);
           }
           return customFallback;
        }
      }
      
      case VoiceIntent.SERVICE_DEEP_DIVE: {
        if (!scripts) return isEn ? "Perfect. Would you like to schedule an appointment or see our specialists?" : "Perfecto. ¿Te gustaría agendar una cita o ver a nuestros especialistas?";
        
        const fallbackMsg = isEn ? "TEXT_INTRO Would you like to schedule an appointment or see our specialists?" : scripts.ask_service_fallback;
        let deepDiveText = (params.userSelection && scripts.deep_dive_scripts && scripts.deep_dive_scripts[params.userSelection]) || (isEn ? "Excellent choice." : "Excelente elección.");
        
        // Polly SSML pauses
        deepDiveText = `${deepDiveText} <break time="300ms"/>`;

        if (fallbackMsg.includes("TEXT_INTRO")) {
           return fallbackMsg.replace("TEXT_INTRO", deepDiveText);
        } else {
           return `${deepDiveText} ${fallbackMsg}`.trim();
        }
      }
      
      case VoiceIntent.DOCTOR_PITCH:
        return `${params.pitchText} <break time="200ms"/> ` + (isEn ? "Would you like to see the medical team? Or do you prefer we book your assessment now?" : "¿Quieres ver al equipo médico? ¿O prefieres que agendemos tu valoración ahora?");
      
      case VoiceIntent.OTHERS:
        return isEn ? "Sure, here is the rest of our clinical team. Let me know who you prefer to book with." : "Claro, aquí tienes al resto del equipo titular. Dime con quién prefieres agendar.";
      
      case VoiceIntent.BYE:
        return isEn ? "No worries. I'm here whenever you need me to take that big step." : "No te preocupes. Estoy aquí cuando me necesites para dar ese gran paso.";
      
      case VoiceIntent.ASK_PHOTOS: {
        let pQuestion = isEn 
            ? `Excellent decision. Before opening the calendar, could you upload 3 quick photos of your case? Then the medical team can review them before your appointment.`
            : `Excelente decisión. Antes de abrir el calendario, ¿podrías subir 3 fotos rápidas de tu caso? Así el equipo médico podrá evaluarlas antes de tu cita.`;
        if (params.userSelection && params.userSelection.startsWith(isEn ? "Book" : "Reservar")) {
            pQuestion = isEn 
                ? `Excellent choice. Before opening ${params.doctorName}'s schedule, could you upload 3 photos of your case? Thus they will review them before connecting.`
                : `Excelente elección. Antes de abrir la agenda de ${params.doctorName}, ¿podrías subir 3 fotos de tu caso? Así las revisará antes de conectarse.`;
        }
        return pQuestion;
      }
      
      case VoiceIntent.ASK_CALENDAR:
        if (params.userSelection === "Fotos subidas" || params.userSelection === "Uploaded photos") {
           return isEn 
               ? "Perfect! I have safely attached them to your record. Now, please select the date and time that works best for you below."
               : "¡Perfecto! Las he adjuntado a tu expediente seguro. Ahora sí, elige el día y la hora que mejor te vengan aquí abajo.";
        }
        return isEn
            ? "Alright, access the calendar and select the date and time you prefer."
            : "De acuerdo, accede al calendario y selecciona la fecha y hora que prefieras.";
      
      case VoiceIntent.CONFIRM_BOOKING: {
        if (!scripts) {
           return params.isHT 
             ? `¡Estupendo! <break time="400ms"/> Tu reserva con ${params.doctorName} en nuestra clínica ha quedado confirmada. <break time="300ms"/> Te esperamos.`
             : `¡Estupendo! Tu reserva con ${params.doctorName} para el día ${params.selectedDate} a las ${params.spokenTime} ha quedado confirmada, te esperamos.`;
        }
        let msg = isEn 
            ? "Great! Your reservation with DR_NAME for SELECTED_DATE at SPOKEN_TIME has been confirmed."
            : scripts.confirm_booking;
        msg = msg.replace('DR_NAME', params.doctorName || (isEn ? 'our expert' : 'nuestro experto'));
        msg = msg.replace('SELECTED_DATE', params.selectedDate?.toString() || (isEn ? 'today' : 'hoy'));
        msg = msg.replace('SPOKEN_TIME', params.spokenTime || (isEn ? 'the indicated time' : 'la hora indicada'));
        
        // Add Polly specific SSML pauses
        msg = msg.replace('¡Estupendo!', '¡Estupendo! <break time="400ms"/>');
        msg = msg.replace('confirmada.', 'confirmada. <break time="300ms"/>');
        
        return msg;
      }
             
      default:
        return "";
    }
  }
}

