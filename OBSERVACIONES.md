# Finova — Observaciones y Hallazgos del Código

> Generado automáticamente por opencode.
> Este archivo es SOLO lectura de observaciones. NO modifica código.
> Claude Code supervisa este proceso.

---

## 1. Bugs Críticos

### 1.1 Authorization headers faltantes en `useVentures.ts` ✅ RESOLVIENDO

**Archivo:** `frontend/src/features/ventures/hooks/useVentures.ts`
**Líneas:** ~64-84

`updateVenture()` y `deleteVenture()` NO inyectan el header `Authorization: Bearer {token}` en la llamada a `supabase.functions.invoke`. Solo `fetchVentures()` y `createVenture()` lo hacen correctamente.

**Impacto:** Editar o eliminar un venture falla con 401 (Unauthorized).

**Detalle:**
- `fetchVentures` (línea ~28-45): ✅ incluye `Authorization`
- `createVenture` (línea ~47-62): ✅ incluye `Authorization`
- `updateVenture` (línea ~64-73): ❌ NO incluye `Authorization`
- `deleteVenture` (línea ~75-84): ❌ NO incluye `Authorization`

---

### 1.2 Authorization headers faltantes en `VentureDetail.tsx` ✅ RESOLVIENDO

**Archivo:** `frontend/src/features/ventures/components/VentureDetail.tsx`
**Líneas:** ~38-54

`handleEditVenture` y `handleDeleteVenture` llaman directamente a `supabase.functions.invoke` sin pasar el header `Authorization`.

**Impacto:** Editar/eliminar venture desde la vista de detalle falla con 401.

---

### 1.3 Mismatch de endpoint en WhatsApp Settings

**Archivo frontend:** `frontend/src/features/settings/components/WhatsAppSettings.tsx`
**Archivo backend:** `backend/supabase/functions/user-settings/index.ts`

El frontend llama a:
```
supabase.functions.invoke('user-settings', { body: { ... } })
```

Pero el edge function `user-settings/index.ts` solo maneja sub-rutas:
- `/user-settings/integrations` → GET/PUT/DELETE
- `/user-settings/keywords` → GET/POST/DELETE

**Impacto:** Las llamadas GET/PUT del frontend a la ruta base `user-settings` devuelven 404. La configuración de WhatsApp no se puede cargar ni guardar.

**Posibles soluciones:**
- Opción A: Agregar un handler para la ruta base en el edge function que redirija a `/integrations`
- Opción B: Cambiar las llamadas del frontend para que apunten a `user-settings/integrations`

---

### 1.4 `repomix.config.json` con rutas stale ✅ RESUELTO

**Archivo:** `repomix.config.json`

Los `include` patterns apuntan a:
```
apps/web/src/**/*.ts
apps/web/src/**/*.tsx
apps/api/functions/**/*.ts
packages/types/**/*.ts
```

Pero la estructura real del proyecto es:
```
frontend/src/**/*.ts
frontend/src/**/*.tsx
backend/supabase/functions/**/*.ts
backend/_shared/types.ts
```

**Impacto:** `npm run ctx` genera un repomix-output.md incompleto o vacío. Los agentes de IA no reciben contexto del código real.

---

## 2. Bugs Potenciales / Inconsistencias

### 2.1 Tablas de base de datos no coinciden entre CLAUDE.md y el código ✅ RESUELTO (Docs actualizadas)

**CLAUDE.md dice:**
- Tabla `whatsapp_configs`
- Tabla `keywords`

**El código del edge function (`whatsapp-webhook/index.ts`) usa:**
- Tabla `user_integrations` (no `whatsapp_configs`)
- Tabla `whatsapp_keywords` (no `keywords`)

**El edge function `user-settings/index.ts` usa:**
- `user_integrations` con campos `provider`, `encrypted_token`, `metadata`
- `whatsapp_keywords` con campos `keyword`, `type`, `venture_id`

**Impacto:** Las migrations descritas en CLAUDE.md (004_whatsapp_configs.sql, 005_keywords.sql) no coinciden con las tablas que el código realmente consulta. Si se aplicaron las migrations de CLAUDE.md pero el código espera otras tablas, todo falla silenciosamente.

---

### 2.2 Token encryption RPC functions

El edge function `user-settings/index.ts` llama a:
- `rpc('encrypt_token', { token: ... })`
- `rpc('decrypt_token', { encrypted_token: ... })`

Estas funciones RPC no están documentadas en CLAUDE.md ni en las migrations conocidas.

**Impacto:** Si estas funciones no existen en la instancia de Supabase, el guardado y carga de configuraciones de WhatsApp falla.

---

### 2.3 CORS duplicado

**Archivo:** `backend/_shared/cors.ts` existe y exporta `corsHeaders` y `handleCors()`.

Pero los edge functions definen CORS inline en cada uno:
- `ventures/index.ts`: define `corsHeaders` manualmente
- `transactions/index.ts`: define `corsHeaders` manualmente
- `whatsapp-webhook/index.ts`: define `corsHeaders` manualmente
- `user-settings/index.ts`: define `corsHeaders` manualmente

**Impacto:** No es un bug funcional, pero viola el principio DRY. Si se necesita cambiar un header CORS, hay que modificar 4+ archivos.

---

### 2.4 Uso de `any` en `transactions/index.ts`

**Archivo:** `backend/supabase/functions/transactions/index.ts`

La función `checkRateLimit` recibe un parámetro `supabase` tipado como `any`.

**Impacto:** Viola la regla #6 de CLAUDE.md ("No usar `any` en TypeScript").

---

### 2.5 `backend/tsconfig.json` referencia directorio inexistente

**Archivo:** `backend/tsconfig.json`

El `include` contiene `"features"` pero ese directorio no existe en `backend/`.

**Impacto:** Warning de TypeScript, no crítico pero ensucia la DX.

---

## 3. Archivos Faltantes

### 3.1 No existe `.vscode/settings.json`

CLAUDE.md menciona:
> Se requiere el uso del archivo `.vscode/settings.json` para habilitar el soporte de Deno exclusivamente en `backend/supabase/functions`

Pero el archivo no existe en el repositorio.

**Impacto:** Los editores no saben que los edge functions usan Deno, lo que causa errores de tipado falsos (importes de `Deno`, `esm.sh`, etc.).

---

### 3.2 No existen migrations SQL en el repo

Las migrations (001_ventures.sql, 002_transactions.sql, etc.) están documentadas en CLAUDE.md pero no existen como archivos en el repositorio.

**Impacto:** No hay forma de reproducir el schema desde cero ni de hacer versionado real de la base de datos. CLAUDE.md dice que se aplicaron directamente a Supabase.

---

### 3.3 No existe `backend/package.json`

El backend son solo edge functions de Supabase (Deno), no un paquete npm. Esto es correcto arquitectónicamente pero el `backend/tsconfig.json` existe sin un package.json que lo acompañe.

**Impacto:** No es un bug, pero puede causar confusión.

---

## 4. Mejoras de DX

### 4.1 `index.html` tiene título genérico

**Archivo:** `frontend/index.html`
**Título actual:** `<title>web</title>`

Debería ser `<title>Finova</title>`.

---

### 4.2 README del frontend es el default de Vite

**Archivo:** `frontend/README.md`

Contiene el README por defecto de Vite + React template, sin personalización para Finova.

---

### 4.3 Inline styles excesivos en Layout.tsx

**Archivo:** `frontend/src/app/Layout.tsx` (359 líneas)

La mayoría del styling usa inline styles en lugar de clases Tailwind. Esto dificulta la mantenibilidad y no aprovecha las utilidades de Tailwind v4 ya configuradas.

**Impacto:** No es un bug, pero es una deuda de estilo.

---

### 4.4 `netProfit()` en utils.ts no documentada en CLAUDE.md

**Archivo:** `frontend/src/features/ventures/utils.ts`

Existe la función `netProfit()` que no está documentada en la sección de "Cálculos de negocio" de CLAUDE.md.

---

## 5. Seguridad

### 5.1 Rate limiting fail-open

**Archivo:** `backend/_shared/rateLimit.ts`

Si la verificación de rate limit falla (ej. error de DB), la petición se permite. Esto es intencional (documentado en JSDoc) pero vale la pena notar.

---

### 5.2 Webhook WhatsApp siempre responde 200

**Archivo:** `backend/supabase/functions/whatsapp-webhook/index.ts`

El webhook siempre devuelve HTTP 200 a Meta, incluso cuando falla internamente. Esto evita retries infinitos de Meta pero puede silenciar errores.

---

## 6. Pendientes del MVP (según CLAUDE.md)

| Item | Prioridad | Estado |
|------|-----------|--------|
| Storage bucket `evidence` | 1 | No creado |
| Deploy Vercel + env vars | 1 | No configurado |
| Testing E2E | 1 | No hecho |
| UI Hogar (Fase 2) | 2 | Tablas existen, sin frontend |
| Webhook Mercado Pago | 3 | No empezado |
| Webhook Stripe | 3 | No empezado |

---

## 7. Resumen de Prioridades de Fix

| # | Bug | Severidad | Archivos afectados |
|---|-----|-----------|-------------------|
| 1 | Auth headers faltantes en update/delete ventures | 🔴 Crítico | `useVentures.ts`, `VentureDetail.tsx` |
| 2 | WhatsApp Settings endpoint 404 | 🔴 Crítico | `WhatsAppSettings.tsx`, `user-settings/index.ts` |
| 3 | Tablas DB no coinciden (whatsapp_configs vs user_integrations) | 🔴 Crítico | Schema + edge functions |
| 4 | repomix.config.json rutas stale | 🟡 Medio | `repomix.config.json` |
| 5 | RPC encrypt_token/decrypt_token no documentadas | 🟡 Medio | `user-settings/index.ts` |
| 6 | `.vscode/settings.json` faltante | 🟢 Bajo | DX |
| 7 | CORS duplicado | 🟢 Bajo | 4 edge functions |
| 8 | `any` en transactions | 🟢 Bajo | `transactions/index.ts` |
| 9 | Título index.html genérico | 🟢 Bajo | `index.html` |

---

> Última actualización: 2026-04-06
> Generado por opencode — supervisado por Claude Code
