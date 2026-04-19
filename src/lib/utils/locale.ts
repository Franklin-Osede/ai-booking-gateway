export type AllowedLocale = 'es-ES' | 'en-GB' | 'en-US';

export const ALLOWED_LOCALES: AllowedLocale[] = ['es-ES', 'en-GB', 'en-US'];

/**
 * Mapea e intenta rescatar códigos sucios de legado o URLs a estándares.
 * Retorna null si la adivinanza no es 100% segura.
 */
export function parseCanonicalLocale(input: string | undefined | null): AllowedLocale | null {
  if (!input) return null;
  
  const loc = input.trim().toLowerCase();
  if (!loc) return null;

  // Exact Matches
  if (loc === 'es-es') return 'es-ES';
  if (loc === 'en-gb') return 'en-GB';
  if (loc === 'en-us') return 'en-US';

  // Legacy Fallbacks
  if (loc === 'es' || loc === 'esp' || loc === 'espanol') return 'es-ES';
  if (loc === 'en' || loc === 'gb' || loc === 'uk' || loc === 'eng' || loc === 'english') return 'en-GB';
  if (loc === 'us' || loc === 'usa') return 'en-US';
  
  if (loc.startsWith('en-')) return 'en-GB';
  if (loc.startsWith('es-')) return 'es-ES';

  // Textos y ubicaciones heurísticas centralizadas (para imports o basuras)
  if (loc.match(/(uk|london|england|manchester|birmingham)/)) return 'en-GB';
  if (loc.match(/(us|usa|florida|texas|york|california|miami)/)) return 'en-US';
  if (loc.match(/(spain|españa|madrid|barcelona|sevilla|valencia|malaga)/)) return 'es-ES';

  return null;
}
