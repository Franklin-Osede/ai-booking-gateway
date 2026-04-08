import { ES_DICTIONARY } from "./dictionaries/es";
import { EN_DICTIONARY } from "./dictionaries/en";
import { NicheConfig } from "./dictionaries/es";

export type Dictionary = Record<string, NicheConfig>;

export function getDictionary(lang: string = "es"): Dictionary {
  // If lang starts with 'en' (e.g. en-GB, en-US, en), return English dict
  if (lang.toLowerCase().startsWith("en")) {
    return { ...ES_DICTIONARY, ...EN_DICTIONARY }; 
    // Merge so any untranslated niche falls back to ES
  }
  return ES_DICTIONARY;
}
