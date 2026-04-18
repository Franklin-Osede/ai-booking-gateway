export type MarketConfig = {
  timezone: string;
  terminology: Record<string, string>;
  disclaimerText?: string;
};

export const MARKET_CONFIGS: Record<string, MarketConfig> = {
  'es-ES': {
    timezone: 'Europe/Madrid',
    terminology: {
      clinic: 'clínica',
      doctor: 'doctor',
      appointment: 'cita',
    },
    disclaimerText: 'Al agendar confirmas haber leído nuestra política de privacidad médica.',
  },
  'en-GB': {
    timezone: 'Europe/London',
    terminology: {
      clinic: 'practice',
      doctor: 'consultant',
      appointment: 'consultation',
    },
    disclaimerText: 'By booking you confirm you have read our medical privacy policy.',
  },
  'en-US': {
    timezone: 'America/New_York',
    terminology: {
      clinic: 'clinic',
      doctor: 'physician',
      appointment: 'appointment',
    },
    disclaimerText: 'By booking you confirm you have read our HIPAA compliance and privacy policy.',
  }
};
