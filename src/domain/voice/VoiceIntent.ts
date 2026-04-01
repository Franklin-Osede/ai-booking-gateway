export enum VoiceIntent {
  GREETING = 'GREETING',
  ASK_SERVICE = 'ASK_SERVICE',
  DOCTOR_PITCH = 'DOCTOR_PITCH',
  ASK_PHOTOS = 'ASK_PHOTOS',
  ASK_CALENDAR = 'ASK_CALENDAR',
  CONFIRM_BOOKING = 'CONFIRM_BOOKING',
  BYE = 'BYE',
  OTHERS = 'OTHERS'
}

export interface VoiceContextParams {
  brandName?: string;
  isHT?: boolean;
  userSelection?: string;
  pitchText?: string;
  doctorName?: string;
  selectedDate?: number;
  selectedTime?: string;
  monthNameStr?: string;
  spokenTime?: string;
}

export interface IVoiceStrategy {
  getPrompt(intent: VoiceIntent, params: VoiceContextParams): string;
}
