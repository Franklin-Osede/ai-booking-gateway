# SRE RUNBOOK: AgentMinds Demo Hub

Este documento especifica el Procedimiento Operativo Estándar (SOP) para mitigar interrupciones en el entorno de Demos de Clínicas.

## 🎯 Objetivo de Nivel de Servicio (SLO)
**MTTR (Tiempo Medio de Recuperación):** Menor a 15 Minutos.
Cualquier URL caída que muestre una "página basura" o un "Hostinger Error" al cliente (perjudicando la estética AgentMinds) debe ser contenida en <15 min desde la alerta en Telegram.

## 📡 Fases del Incidente

### 1. Detección (Alerting)
El monitor sintético (`/api/cron/syn-monitor`) saltará en Telegram:
`🚨 INCIDENTE DEMO HUB 🚨`
Aportará la URL caída y el StatusCode (ej: `HTTP 500` o `TIMEOUT`).

### 2. Contención Inmediata (Fail-Closed)
**Objetivo:** Evitar que un potencial cliente vea la web caída. 
- Por defecto, el `syn-monitor` ejecuta la contención automática y aplica el "Neutral Mode" pasivo a la demo afectada. 
- *Acción Humana:* Entrar al **SRE Dashboard** (`/admin/sre`) y verificar que el semáforo está en ROJO y el estado es `neutral`. Si por latencia sigue en "Proxy", forzar la degradación.

### 3. Diagnóstico (Root Cause Analysis - RCA)
El equipo SRE debe acceder la URL nativa sin AgentMinds de la clínica en un navegador incógnito (o vía la herramienta "Retestar URL" de `/admin/sre`) y confirmar qué le ocurre al proveedor:
- ¿Es un Parked Domain ("Dominio caducado", Hostinger)?
- ¿Es un error genérico (500, Bad Gateway de PHP/WordPress)?
- ¿Es geo-bloqueo contra los servidores US-East de Vercel (Error 403 / Timeout extremo > 8s)?

### 4. Resolución y Corrección
En caso de que sea geo-bloqueo inofensivo pero real en Vercel, o si el administrador técnico del cliente mueve la web:
- Modifica la Base de Datos a través de la interfaz administrativa de Clínica.
- Actualiza la `publishedWebsiteUrl` y pulsa **Validar y Publicar**. 
*(Si la nueva URL es válida, se publicará transaccionalmente y volverá automáticamente a "Proxy")*.

### 5. Validación Canary y Cierre
Validar en `/admin/sre` ejecutando **[Retestar URL]** explícitamente:
- El estado debe transicionar de "Neutral" a "Proxy" ("Verde").
- Un mensaje de `✅ RECUPERACIÓN SRE ✅` aparecerá en Telegram.
- **Caso Especial (Ciclo CI/CD):** Si esto ha roto un despliegue y provocó un Fail en Vercel (bloqueo `npm run canary`), una vez corregida la BD, re-lanzar el Build de Vercel en la interfaz del CI y verificar la luz verde.

## 🩺 Política Estricta de Publicación
- El botón Publish bloquea cualquier guardado que no tenga un Locale canónico estricto (`es-ES`, `en-US`, `en-GB`).
- **NUNCA** recurras a fallbacks silenciosos. Si un ID falla, no se publica. El error de publicación es operable, el fallo silencioso no lo es.
