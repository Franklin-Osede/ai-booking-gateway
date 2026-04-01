import { VoiceIntent, VoiceContextParams, IVoiceStrategy } from './VoiceIntent';
import { PollyStrategy } from './PollyStrategy';
import { ElevenLabsStrategy } from './ElevenLabsStrategy';

export class VoicePromptService {
  private static strategies: Record<string, IVoiceStrategy> = {
    polly: new PollyStrategy(),
    elevenlabs: new ElevenLabsStrategy()
  };

  /**
   * Retrieves the perfectly formatted prompt tailored for the given Voice TTS engine.
   * @param provider e.g. "polly" or "elevenlabs"
   * @param intent The business intent (e.g. GREETING, DOCTOR_PITCH)
   * @param params Arbitrary context variables for interpolation
   */
  static getPrompt(intent: VoiceIntent, params: VoiceContextParams, provider: string = 'polly'): string {
    const key = provider.toLowerCase();
    const strategy = this.strategies[key] || this.strategies['polly'];
    return strategy.getPrompt(intent, params);
  }
}
