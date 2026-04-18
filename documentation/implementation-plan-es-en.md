# Implementation Plan (Best Practices) - Spanish & English

## 1) Goal / Objetivo

Build and operate one scalable widget system for your current niches with fast language switching between Spanish and English, without duplicating logic in UI components.

Construir y operar un sistema de widget escalable para tus nichos actuales, con cambio rápido entre español e inglés, sin duplicar lógica en componentes UI.

## 2) Core Strategy / Estrategia Base

- Keep niche logic centralized in `nicheConfig` (business rules only).
- Keep all copy/prompts in locale dictionaries (`es`, `en`).
- Resolve everything through one config resolver:
  - `effectiveConfig = resolveConfig({ niche, locale, market, campaign })`
- Components must not use niche/language conditionals.

- Mantener la lógica de nicho centralizada en `nicheConfig` (solo reglas de negocio).
- Mantener todos los textos/prompts en diccionarios por idioma (`es`, `en`).
- Resolver todo con un único resolver de configuración:
  - `effectiveConfig = resolveConfig({ niche, locale, market, campaign })`
- Los componentes no deben usar condicionales por nicho/idioma.

## 3) Configuration Architecture / Arquitectura de Configuración

### 3.1 `nicheConfig.ts` (language-agnostic)

Required fields per niche:

- `requiresPhotos: boolean`
- `fallbackSpecialtyKeys: string[]`
- `fallbackBioKey: string`
- `topicPromptKey: string`
- `brandLabelKey: string`
- `flowRules: { ... }`
- `triageRules: { ... }`

### 3.2 `locale/es.ts` and `locale/en.ts`

Store all strings:

- Chat greetings
- Voice prompts and fallbacks
- Specialty labels and bios
- CTA copy
- Error/empty states

### 3.3 `marketConfig.ts`

Market-specific overrides:

- Terminology (`clinic` vs `practice`)
- Timezone and call windows
- Legal/compliance disclaimers
- Optional market CTA tweaks

### 3.4 `voiceConfig.ts`

- Map locale to existing ElevenLabs voice IDs already configured (`es-ES`, `en-GB`, `en-US`)
- Add future extension:
  - `voiceProfile: "default_es" | "default_en_gb" | "default_en_us" | "custom_clone"`

### 3.5 Language Switch Orchestration (AI Configuration)

When user changes language in AI configuration, all runtime content must switch in one action:

- UI text
- Chat prompts
- Voice prompts/fallbacks
- CTA copy
- ElevenLabs voice ID

Reference contract:

- `demoLanguage: "es-ES" | "en-GB" | "en-US"`
- `voiceProvider: "elevenlabs" | "polly"`
- `voiceSelectionByLocale: Record<Locale, { elevenLabsVoiceId: string; label: string; gender?: "M" | "F" }>`

Execution rule:

- On language change, update session/campaign locale and re-resolve `effectiveConfig`.
- If provider is ElevenLabs, force `activeVoice.elevenLabsVoiceId = voiceSelectionByLocale[locale].elevenLabsVoiceId`.
- Never keep old locale text with new locale voice (atomic switch required).

## 4) Refactor Rules / Reglas de Refactor

- No `if (activeNiche === "...")` in visual components.
- No hardcoded copy inside components.
- UI receives `effectiveConfig` and renders.
- API payload must include: `niche`, `locale`, `market`, `campaignId`.

## 5) Phased Implementation / Implementación por Fases

### Phase 1 - Contracts & Resolver (Day 1-2)

- Define strict TypeScript interfaces.
- Create `resolveConfig`.
- Add defaults and validation for missing keys.

### Phase 2 - Migrate Current Hardcoded Logic (Day 3-5)

- Move niche-specific data from voice/chat/phone components to config.
- Replace legacy conditionals with config reads.
- Keep behavior parity.

### Phase 3 - Full ES/EN Localization (Day 6-8)

- Move all user-facing copy to locale dictionaries.
- Add one-click language switch at campaign/widget level.
- Wire one-click switch to ElevenLabs locale voice mapping.
- Verify full flow in ES and EN.

### Phase 4 - Market Readiness (Day 9-10)

- Add `en-GB` and `en-US` market overrides.
- Validate terminology and CTA variants.
- Add compliance/disclaimer hooks.

### Phase 5 - Hardening (Day 11-12)

- Add tests (unit/integration/e2e).
- Remove dead branches and legacy constants.
- Freeze v1 baseline for outreach.

## 6) Testing Plan / Plan de Pruebas

### Unit

- Resolver precedence: `niche < locale < market < campaign override`
- Required config fields per niche
- Fallback behavior when keys are missing

### Integration

- ES -> EN toggle updates UI, prompts, fallbacks, CTA
- ES -> EN toggle switches ElevenLabs voice ID to configured English speaker
- EN -> ES toggle switches ElevenLabs voice ID to configured Spanish speaker
- `requiresPhotos=false` paths (e.g., dental) never block flow
- Voice payload uses locale and market settings

### E2E

- Spanish campaign end-to-end demo
- UK English campaign end-to-end demo
- Same niche, different locale, same logic integrity

## 7) Sales/Operations Layer (Execution) / Capa de Ejecución Comercial

Keep current profitable niches until 10-20 paying clients:

- Standardize offer, script, onboarding, and delivery.
- Track KPIs by `niche + locale + market`:
  - Connect rate
  - Demo-to-close rate
  - Booking rate
  - Objection categories
  - Retention/churn

Use your current consulting engagement as case study input for outreach assets.

## 8) Definition of Done / Definición de Terminado

- Full demo works in ES and EN from one switch.
- ElevenLabs voice switches automatically with language (ES voice for ES, EN voice for EN).
- No niche/language conditionals in UI components.
- `nicheConfig` is the single business-rules source.
- Locale dictionaries own all copy.
- Tests passing for resolver, localization flow, and dental no-photo behavior.
- Team can add a new market/language with config-only changes.

## 9) Risks & Mitigation / Riesgos y Mitigación

- Risk: config drift across files.
  - Mitigation: strict types + startup validation.
- Risk: mixed copy still inside components.
  - Mitigation: lint/check script for hardcoded strings in target components.
- Risk: market terminology mismatch.
  - Mitigation: market review checklist before campaign launch.

## 10) Immediate Next Sprint / Próximo Sprint Inmediato

1. Implement `resolveConfig` and config contracts.
2. Migrate `AIAssistantVoice.tsx`, `AIAssistantVoiceFree.tsx`, `AIAssistantChat.tsx`, `AIAssistantPhone.tsx`.
3. Complete ES/EN dictionaries.
4. Ship campaign-level `demoLanguage` + `market` selector.
5. Run regression tests and freeze outreach build.
