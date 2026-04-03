# Estrategia Integral (TDD/DDD) para Widget Multinicho

## Objetivo
Construir una demo rápida y escalable por nicho, con voz instantánea, flujos cortos y un UI simple que no compita con el menú del sitio.

## Principios Clave
- Primer audio < 1.2s percibido.
- Menú superior mínimo (no competir con el menú del sitio).
- Voces y agentes se cambian dentro del bubble.
- Flujos cortos por nicho, con temas claros.

## UX Recomendada (Resumen)
- Barra superior: `Probar Voz` + `Agendar`.
- Dentro del bubble:
  - Selector de voz (dropdown o chips).
  - Chips de temas (ej. Prevención, Precio, Dolor, Resultados).
  - Botón de “Escuchar muestra”.

## Estrategia de Voz
- Primer audio: pre‑generado y cacheado (demo rápida).
- Audios posteriores: generación en tiempo real.
- Por nicho: 2–3 flujos cortos (15–25s).

## Chat de Texto (Estrategia)
- Objetivo: resolver dudas rápidas sin fricción.
- Inicio: 1 pregunta guía + 3 chips sugeridos.
- Respuestas cortas (2–4 líneas).
- CTA suave tras 1–2 turnos: “¿Quieres agendar una llamada?”.
- Si hay formulario en la web: ofrecer “Te lo envío por email” y capturar solo si el usuario lo pide.

## Triaje (Estrategia)
- Objetivo: calificar intención y recoger señales clave.
- 3–5 preguntas máximo.
- Formato: chips de respuesta (rápido).
- Al final: resumen + CTA a “Agendar” o “Más información”.
- Si el nicho lo exige, pedir contacto solo al final.

## Captura de Email (Recomendación)
- No pedir email al inicio.
- Pedir email después de 1 interacción útil:
  - Tras escuchar demo.
  - Tras 1 respuesta del agente.
- Ofrecer valor claro: “Recibe el presupuesto/estudio/resultado”.
- Si el sitio ya tiene formulario, el widget debe sincronizar y no duplicar.

## Precio en la Demo (Recomendación)
- Si vendes B2B de alto ticket: no pongas precio fijo.
- Usa “desde” o “planes” con rango solo si ayuda al cierre.
- Mejor CTA: “Agendar” o “Solicitar propuesta”.

## Tracking (Mínimo)
- Eventos: `widget_open`, `voice_play`, `voice_change`, `chip_click`, `cta_agendar`.
- Parametrizar con `?utm_` y `?site=`.
- Guardar `session_id` + `utm` + `site`.

## DDD: Estructura de Dominio
- `domain/agents`: entidades de Agente, Voz, Flujo.
- `domain/conversations`: estado, turnos, temas.
- `domain/telemetry`: eventos y métricas.
- `domain/niche`: configuración por sector.

## TDD: Enfoque de Pruebas
- Unit tests:
  - Selección de voz.
  - Enrutado de flujos por nicho.
  - Generación de eventos.
- Integration:
  - Primer audio demo cacheado.
  - Cambio de voz actualiza audio.
  - CTA Agendar dispara evento.
- E2E (mínimo):
  - `Probar Voz` -> escucha -> chip -> CTA.

## Definition of Done
- Primer audio < 1.2s (en demo).
- 2–3 flujos cortos por nicho.
- Menú superior no excede 2 acciones.
- Email solo después de valor.
