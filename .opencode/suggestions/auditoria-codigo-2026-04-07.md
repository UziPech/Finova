# Reporte de Auditoría — Finova

> Generado automáticamente — 2026-04-07
> Estado: Sprint 1 (Fix Cimientos) completado — Deuda técnica pendiente

---

## 1. Bugs del Cimiento (Sprint 1)

| # | Bug | Estado | Detalle |
|---|-----|--------|---------|
| 1.1 | ~~Auth headers en ventures~~ | ✅ **FIXED** | `useVentures.ts` inyecta `Authorization: Bearer` en todas las llamadas (GET, POST, PUT, DELETE). `VentureDetail.tsx` también. |
| 1.2 | ~~WhatsApp Settings endpoint~~ | ✅ **FIXED** | `WhatsAppSettings.tsx` llama a `user-settings/integrations` — edge function `user-settings/index.ts` maneja GET/PUT/DELETE correctamente. |
| 1.3 | ~~repomix.config.json~~ | ✅ **FIXED** | Paths correctos: `frontend/src/**/*.ts`, `backend/**/*.ts`. Ya no usa `apps/web/` ni `apps/api/`. |
| 1.4 | ~~Tablas documentadas ≠ tablas reales~~ | ✅ **FIXED** | CLAUDE.md documenta correctamente: `user_integrations`, `whatsapp_keywords`, `ventures`, `transactions`, `household_expenses`. Coincide con el código real. |
| 1.5 | ~~`.vscode/settings.json`~~ | ✅ **FIXED** | Existe con `deno.enablePaths: ["backend/supabase/functions"]`. Habilita Deno solo para edge functions. |

### Bugs adicionales encontrados durante auditoría

| # | Bug | Estado | Detalle |
|---|-----|--------|---------|
| 1.6 | ~~`\n` literal en transactions/index.ts:61~~ | ✅ **FIXED** | Había un carácter `\n` literal incrustado en la línea 61 que rompía la sintaxis. Corregido a salto de línea real. |

**Sprint 1: 6/6 completado ✅**

---

## 2. Deuda Técnica Pendiente

### 2.1 `any` types en Edge Functions (10 ocurrencias)

| Archivo | Línea | Código actual | Fix sugerido |
|---------|-------|--------------|--------------|
| `whatsapp-webhook/index.ts` | 98 | `let payload: any` | `let payload: { object: string; entry?: Array<{ changes?: Array<{ value?: { messages?: Array<Record<string, unknown>>; metadata?: { phone_number_id: string } } }> }> }` |
| `whatsapp-webhook/index.ts` | 265-266 | `(t: any)` × 4 | `type TxTotals = Pick<Transaction, 'type' | 'amount'>` — definir tipo inline |
| `user-settings/index.ts` | 11 | `supabase: any` | `supabase: SupabaseClient` — importar tipo de `@supabase/supabase-js` |
| `ventures/index.ts` | 19 | `supabase: any` | `supabase: SupabaseClient` |
| `transactions/index.ts` | 13 | `supabase: any` | `supabase: SupabaseClient` |
| `transactions/index.ts` | 118-119, 145-146 | `(t: any)` × 8 | Mismo tipo inline `TxTotals` |

**Prioridad:** Media — no rompe nada, pero viola la regla #6 de CLAUDE.md ("No usar `any`").
**Esfuerzo:** ~20 min

### 2.2 Cross-feature imports de auth

| Archivo | Import | Evaluación |
|---------|--------|------------|
| `useVentures.ts:5` | `import { useAuthStore } from '@/features/auth/store'` | ✅ **Aceptable** — auth es infraestructura compartida, no un feature de dominio |
| `useTransactions.ts:5` | `import { useAuthStore } from '@/features/auth/store'` | ✅ **Aceptable** — misma razón |

**Veredicto:** No es un bug. CLAUDE.md debería mencionar explícitamente que `auth/store` es excepción permitida.

---

## 3. Calidad por Capa

### Frontend — 8.5/10

| Aspecto | Evaluación |
|---------|-----------|
| TypeScript | ✅ Sin `any` en ningún archivo `.ts` o `.tsx` del frontend |
| Arquitectura | ✅ Vertical Slice respetado — features no se importan entre sí |
| Componentes | ✅ Limpios, sin lógica en `pages/`, inline styles consistentes |
| Hooks | ✅ Bien estructurados — `useCallback`, `useEffect` con dependencias correctas |
| Stores (Zustand) | ✅ Un store por feature, sin store global |
| Auth en llamadas | ✅ Todas las llamadas a edge functions incluyen `Authorization` header |
| Manejo de errores | ✅ try/catch, error states en UI, mensajes descriptivos |

### Backend (Edge Functions) — 6.5/10

| Aspecto | Evaluación |
|---------|-----------|
| CORS | ✅ Todas las funciones tienen `handleCors()` inline |
| Rate Limiting | ✅ Todas usan `checkRateLimit()` con RPC |
| Auth | ✅ Validan `Authorization` header con `supabase.auth.getUser()` |
| Routing | ✅ Routing por método HTTP y path parsing correcto |
| TypeScript | ⚠️ 10 usos de `any` — deuda técnica |
| Error handling | ✅ try/catch global, respuestas con códigos HTTP apropiados |
| HMAC verification | ✅ WhatsApp webhook verifica firma SHA-256 |

### Infraestructura — 9/10

| Aspecto | Evaluación |
|---------|-----------|
| `.vscode/settings.json` | ✅ Deno habilitado solo para `backend/supabase/functions` |
| `repomix.config.json` | ✅ Paths correctos |
| `CLAUDE.md` | ✅ Documento maestro actualizado y preciso |
| Monorepo | ✅ npm workspaces configurado correctamente |
| `.gitignore` | ✅ Bloquea `.env*` y archivos sensibles |

---

## 4. Hallazgos Adicionales

| Hallazgo | Tipo | Acción |
|----------|------|--------|
| `keywords` edge function no existe como archivo separado | Info | No es un bug — la lógica está dentro de `user-settings/index.ts`. Mejor así. |
| `sendWhatsAppMessage()` no existe en `_shared/whatsapp.ts` | Pendiente | Parte del Sprint 2 (Agente IA). No es deuda técnica. |
| `ai_transaction_logs` table no existe | Pendiente | Parte del Sprint 2. Esperado. |
| `ai_agent_config` table no existe | Pendiente | Parte del Sprint 2. El plan mismo dice que es "premature abstraction". |
| Storage bucket `evidence` | ✅ Existe | Se usa en `transactions/index.ts` para upload de evidencias |
| `encrypt_token` / `decrypt_token` RPC | ✅ Existen | Se usan en `user-settings/index.ts` y `whatsapp-webhook/index.ts` |

---

## 5. Resumen Ejecutivo

```
Bugs del cimiento:     5/5  ✅ COMPLETADO
Deuda técnica:         1/10 ⚠️ PENDIENTE (solo `any` types)
Calidad frontend:      8.5/10 ✅ BUENA
Calidad backend:       6.5/10 ⚠️ REGULAR (por `any` types)
Calidad infra:         9/10   ✅ EXCELENTE
```

### Próximos pasos recomendados

1. **Fix `any` types** (~20 min) — limpiar los 10 usos de `any` en edge functions
2. **Sprint 2: Agente IA** — Gemini Flash 2.5 + webhook + respuestas WhatsApp
3. **Dashboard de pendientes** — UI para revisar transacciones del agente

---

> El cimiento está sólido. Los bugs críticos están resueltos. La única deuda técnica relevante son los `any` types en el backend, que no afectan funcionalidad pero violan las reglas del proyecto.
