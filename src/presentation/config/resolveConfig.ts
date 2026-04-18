import { NICHE_CONFIGS, NicheConfig } from './nicheConfig';
import { getDictionary } from '../i18n';
import { COMMON_EN, COMMON_ES } from '../i18n/dictionaries/common';
import { MARKET_CONFIGS, MarketConfig } from './marketConfig';

export type EffectiveConfig = {
  niche: NicheConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  locale: any;
  market: MarketConfig;
};

export function resolveConfig(options: { niche: string; locale: string; market?: string }): EffectiveConfig {
  const activeNiche = options.niche && NICHE_CONFIGS[options.niche] ? options.niche : 'hair_transplant';
  
  const baseNiche = NICHE_CONFIGS[activeNiche] || NICHE_CONFIGS.default;
  
  const dict = getDictionary(options.locale);
  const nicheLocaleDict = dict[activeNiche] || dict.default || dict.medical;
  const isEn = options.locale.toLowerCase().startsWith('en');
  const commonLocale = isEn ? COMMON_EN : COMMON_ES;
  const localeDict = { ...nicheLocaleDict, ...commonLocale };
  
  const marketCode = options.market || options.locale;
  const marketCfg = MARKET_CONFIGS[marketCode] || MARKET_CONFIGS['es-ES'];

  return {
    niche: baseNiche,
    locale: localeDict,
    market: marketCfg
  };
}
