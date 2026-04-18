import { IVoiceStrategy, VoiceIntent, VoiceContextParams } from './VoiceIntent';
import { resolveConfig } from '../../presentation/config/resolveConfig';

export class ElevenLabsStrategy implements IVoiceStrategy {
  getPrompt(intent: VoiceIntent, params: VoiceContextParams): string {
    const { locale: configLocale } = resolveConfig({ niche: params.niche || 'hair_transplant', locale: params.locale || 'es' });
    const scripts = configLocale.voice_scripts;
    const chatScripts = configLocale.chat_scripts;
    const isEn = String(params.locale || 'es').toLowerCase().startsWith('en');
    
    switch (intent) {
      case VoiceIntent.GREETING:
        return (chatScripts?.welcome_message || (isEn ? `Hello! Welcome. I am your virtual assistant... How can I help you today?` : `¡Hola! Bienvenido. Soy tu asesora virtual... ¿En qué te puedo ayudar hoy?`)).replace('BRAND_NAME', params.brandName || (isEn ? "the clinic" : "la clínica"));
      
      case VoiceIntent.ASK_SERVICE: {
        if (!scripts) {
          return chatScripts?.specialty_prompt || (isEn ? `Perfect... With which specialty or treatment would you like to continue today?` : `Perfecto... ¿Con qué especialidad o tratamiento te gustaría continuar tu sesión hoy?`);
        }

        const exactMatch = params.userSelection && scripts.ask_service_options[params.userSelection];
        const introText = exactMatch || (isEn ? "Perfect, how can we focus your visit today?" : scripts.ask_service_intro);
        
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
              return customFallback.replace(isEn ? 'Perfect.' : 'Perfecto.', introText);
           }
           return customFallback;
        }
      }
      
      case VoiceIntent.SERVICE_DEEP_DIVE: {
        if (!scripts) return isEn ? "Perfect... Would you like to schedule an appointment or see our specialists?" : "Perfecto... ¿Te gustaría agendar una cita o ver a nuestros especialistas?";
        
        const fallbackMsg = isEn ? "TEXT_INTRO Would you like to schedule an appointment or see our specialists?" : scripts.ask_service_fallback;
        const deepDiveText = (params.userSelection && scripts.deep_dive_scripts && scripts.deep_dive_scripts[params.userSelection]) || (isEn ? "Excellent choice." : "Excelente elección.");
        
        if (fallbackMsg.includes("TEXT_INTRO")) {
           return fallbackMsg.replace("TEXT_INTRO", deepDiveText);
        } else {
           return `${deepDiveText} ${fallbackMsg}`.trim();
        }
      }
      
      case VoiceIntent.DOCTOR_PITCH:
        return `${params.pitchText}... ` + (chatScripts?.doctor_found_prompt || (isEn ? `Would you like to see the medical team, or do you prefer we schedule your assessment now?` : `¿Quieres ver al equipo médico... o prefieres que agendemos tu valoración ahora?`));
      
      case VoiceIntent.OTHERS:
        return chatScripts?.doctor_found_prompt || (isEn ? "Sure, here is the rest of our clinical team. Let me know who you prefer to book with." : "Claro, aquí tienes al resto del equipo titular. Dime con quién prefieres agendar.");
      
      case VoiceIntent.BYE:
        return chatScripts?.think_skip_message || (isEn ? "No worries... I'm here whenever you need me." : "No te preocupes... Estoy aquí cuando me necesites.");
      
      case VoiceIntent.ASK_PHOTOS: {
        let pQuestion = chatScripts?.photos_prompt_generic || (isEn ? `Excellent... Before opening the calendar, could you upload three quick photos of your case?` : `Excelente decisión... Antes de abrir el calendario, ¿podrías subir tres fotos rápidas de tu caso?`);
        if (params.userSelection && params.userSelection.startsWith(isEn ? "Book" : "Reservar")) {
            pQuestion = (chatScripts?.photos_prompt_doctor || (isEn ? `Excellent choice... Before opening the schedule, could you upload three photos?` : `Excelente elección... Antes de abrir la agenda, ¿podrías subir tres fotos de tu caso?`)).replace('DOCTOR_NAME', params.doctorName || (isEn ? "the specialist" : "el especialista"));
        }
        return pQuestion;
      }
      
      case VoiceIntent.ASK_CALENDAR:
        if (params.userSelection === "Fotos subidas" || params.userSelection === "Uploaded photos") {
           return isEn 
               ? "Perfect... I have attached them to your file. Now, please choose the day and time that works best for you." 
               : "¡Perfecto!... Las he adjuntado a tu expediente. Ahora sí, elige el día y la hora que mejor te vengan aquí abajo.";
        }
        return isEn 
            ? "Alright, access the calendar below and simply select the date and time you prefer." 
            : "De acuerdo, accede al calendario y selecciona la fecha y la hora que prefieras.";
      
      case VoiceIntent.CONFIRM_BOOKING: {
        if (!scripts) {
           return isEn 
               ? `Great!... Your reservation with ${params.doctorName} for the ${params.selectedDate} at ${params.spokenTime} has been confirmed.` 
               : `¡Estupendo!... Tu reserva con ${params.doctorName} para el día ${params.selectedDate} a las ${params.spokenTime} ha quedado confirmada.`;
        }
        let msg = isEn ? "Great! Your reservation with DR_NAME for SELECTED_DATE at SPOKEN_TIME has been officially confirmed." : scripts.confirm_booking;
        msg = msg.replace('DR_NAME', params.doctorName || (isEn ? 'our expert' : 'nuestro experto'));
        msg = msg.replace('SELECTED_DATE', params.selectedDate?.toString() || (isEn ? 'today' : 'hoy'));
        msg = msg.replace('SPOKEN_TIME', params.spokenTime || (isEn ? 'the indicated time' : 'la hora indicada'));
        return msg;
      }
             
      default:
        return "";
    }
  }
}
