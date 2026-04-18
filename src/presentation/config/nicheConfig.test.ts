import { expect, test, describe } from 'vitest';
import { NICHE_CONFIGS } from './nicheConfig';

describe('NicheConfig Contract Validation', () => {
  const niches = Object.keys(NICHE_CONFIGS);

  test('All niches must have the strict required fields', () => {
    for (const nicheKey of niches) {
      const niche = NICHE_CONFIGS[nicheKey];
      
      // 1. requiresPhotos must be explicitly boolean
      expect(typeof niche.requiresPhotos).toBe('boolean');
      
      // 2. fallbackSpecialties must be an array of strings
      expect(Array.isArray(niche.fallbackSpecialties)).toBe(true);
      expect(niche.fallbackSpecialties.length).toBeGreaterThan(0);
      
      // 3. fallbackBio must be a non-empty string
      expect(typeof niche.fallbackBio).toBe('string');
      expect(niche.fallbackBio.length).toBeGreaterThan(0);
      
      // 4. brandLabel must be a non-empty string
      expect(typeof niche.brandLabel).toBe('string');
      expect(niche.brandLabel.length).toBeGreaterThan(0);
      
      // 5. topicPrompt must be a non-empty string
      expect(typeof niche.topicPrompt).toBe('string');
      expect(niche.topicPrompt.length).toBeGreaterThan(0);

      // 6. chatObjection must be strictly defined
      expect(niche.chatObjection).toBeDefined();
      expect(Array.isArray(niche.chatObjection.keywords)).toBe(true);
      expect(typeof niche.chatObjection.responseBot).toBe('string');
      expect(typeof niche.chatObjection.followUpBot).toBe('string');
      expect(typeof niche.chatObjection.acceptOption).toBe('string');
    }
  });

  test('Dental niche must NOT require photos', () => {
    expect(NICHE_CONFIGS.dental.requiresPhotos).toBe(false);
  });
  
  test('Hair transplant niche MUST require photos', () => {
    expect(NICHE_CONFIGS.hair_transplant.requiresPhotos).toBe(true);
  });
});
