# Reporte de Auditoría — Finova

> Generado automáticamente — 2026-04-07
> Estado: Sprint 2 (Nuevas Features) en curso — Bugs críticos pendientes

---

## 1. Bugs del Cimiento (Sprint 1)

| # | Bug | Estado | Detalle |
|---|-----|--------|---------|
| 1.1 | ~~Auth headers en ventures~~ | ✅ **FIXED** | `useVentures.ts` inyecta `Authorization: Bearer` en todas las llamadas. `VentureDetail.tsx` también. |
| 1.2 | **WhatsApp Settings field mismatch** | 🔴 **STILL BROKEN** | GET fixed (lee de `d.config`) pero PUT sigue roto — frontend envía `whatsapp_phone_number_id`, backend espera `phone_number_id`. Ver §1.2b. |
| 1.3 | ~~repomix.config.json~~ | ✅ **FIXED** | Paths correctos. |
| 1.4 | ~~Tablas documentadas ≠ tablas reales~~ | ✅ **FIXED** | CLAUDE.md actualizado. |
| 1.5 | ~~`.vscode/settings.json`~~ | ✅ **FIXED** | Deno habilitado para edge functions. |

### Bugs adicionales encontrados durante auditoría

| # | Bug | Estado | Detalle |
|---|-----|--------|---------|
| 1.6 | ~~`\n` literal en transactions/index.ts:61~~ | ✅ **FIXED** | Corregido a salto de línea real. |

**Sprint 1: 5/6 completado — 1 bug crítico abierto 🔴**

---

### 1.2b — WhatsApp Settings: Mismatch de campos (DETALLE)

**GET está FIXED** — ahora lee correctamente de `d.config.phone_number_id`, `d.config.verify_token`, `d.encrypted_token`.

**PUT sigue ROTO** — el frontend envía campos con prefijo `whatsapp_` que el backend no reconoce:

| Lo que el frontend envía | Lo que el backend espera | ¿Match? |
|---|---|---|
| `whatsapp_phone_number_id` | `phone_number_id` | ❌ |
| `whatsapp_access_token` | `access_token` | ❌ |
| `whatsapp_verify_token` | `verify_token` | ❌ |

**Archivo:** `WhatsAppSettings.tsx:59-64`

#### Fix requerido

Cambiar en `WhatsAppSettings.tsx` el body del PUT:
```ts
// Antes (roto):
body.whatsapp_phone_number_id = phoneNumberId
body.whatsapp_access_token = accessToken
body.whatsapp_verify_token = verifyToken

// Después (correcto):
body.phone_number_id = phoneNumberId
body.access_token = accessToken
body.verify_token = verifyToken
```

**Esfuerzo:** ~5 min

---

## 2. Bugs en Nuevas Features (Sprint 2)

### 2.1 `mode` no existe en tabla `ventures`

**Archivos:** `VentureForm.tsx:46`, `VentureDetail.tsx`

El formulario envía `mode: 'business' | 'personal'` al backend, pero la tabla `ventures` no tiene esa columna. El backend de `ventures/index.ts` inserta campos explícitos (`name`, `type`, `status`, `invested`, `returned`, `currency`, `start_date`, `end_date`, `notes`) — `mode` se ignora silenciosamente.

**Impacto:** El toggle business/personal funciona solo en UI — no persiste. Al editar un venture personal, se pierde el modo.

**Fix sugerido:** Opción A — agregar columna `mode` a la tabla `ventures` con migration. Opción B — derivar `mode` del `type` en frontend (`type === 'mixed' && invested > 0` → personal).

### 2.2 Typo "Pŕestamo" (acento invertido)

| Archivo | Línea | Texto actual | Correcto |
|---------|-------|-------------|----------|
| `LoanForm.tsx` | 138 | `Crear Pŕestamo` | `Crear Préstamo` |
| `LoansSection.tsx` | 96 | `Total Pŕestamo` | `Total Préstamo` |

### 2.3 `any` en código nuevo

| Archivo | Línea | Código | Fix |
|---------|-------|--------|-----|
| `LoanForm.tsx` | 39 | `catch (err: any)` | `catch (err: unknown)` |
| `LoansSection.tsx` | 18 | `handleCreate = async (input: any)` | Tipar con `CreateLoanInput` |
| `useCategories.ts` | 43 | `catch (err: any)` | `catch (err: unknown)` |
| `loans/index.ts` | 19 | `supabase: any` | `SupabaseClient` |
| `transactions/index.ts` | 148-150, 174-176 | `(t: any)` × 8 | Tipo inline `TxTotals` |

### 2.4 Tablas sin migration

| Tabla | Usada en | Estado |
|-------|----------|--------|
| `loans` | `loans/index.ts`, `LoansSection.tsx` | Sin migration en repo |
| `loan_payments` | `loans/index.ts`, `LoansSection.tsx` | Sin migration en repo |
| `transaction_categories` | `useCategories.ts`, `transactions/index.ts` | Sin migration en repo |

**Impacto:** Si se necesita reproducir el schema desde cero, estas 3 tablas no existen en versionado.

---

## 3. Deuda Técnica Pendiente (heredada)

### 3.1 `any` types en Edge Functions (10 ocurrencias originales + 1 nueva)

| Archivo | Línea | Código actual |
|---------|-------|--------------|
| `whatsapp-webhook/index.ts` | 98 | `let payload: any` |
| `whatsapp-webhook/index.ts` | 265-266 | `(t: any)` × 4 |
| `user-settings/index.ts` | 11 | `supabase: any` |
| `ventures/index.ts` | 19 | `supabase: any` |
| `transactions/index.ts` | 13 | `supabase: any` |
| `transactions/index.ts` | 148-150, 174-176 | `(t: any)` × 8 |
| `loans/index.ts` | 19 | `supabase: any` |

### 3.2 CORS duplicado

5 edge functions (ventures, transactions, user-settings, whatsapp-webhook, loans) definen `corsHeaders` inline idéntico cuando existe `backend/_shared/cors.ts`.

### 3.3 Debug logs en producción

`console.log` en `ventures/index.ts:58-61` — imprime auth header en cada request.

---

## 4. Features Nuevas Implementadas (Sprint 2)

| Feature | Estado | Notas |
|---------|--------|-------|
| Paginación de transacciones | ✅ Funcional | Backend + frontend con búsqueda y debounce |
| Categorías de transacciones | ✅ Funcional | Hook + Zustand store + selector en form |
| Toggle business/personal en ventures | ⚠️ Parcial | UI funciona pero `mode` no persiste en DB |
| Módulo de préstamos (Loans) | ✅ Funcional | CRUD completo + generación de cronograma |
| Types centralizados en `_shared/types.ts` | ✅ Implementado | 243 líneas, fuente de verdad |
| Constants con labels de modo | ✅ Implementado | `VENTURE_MODE_LABELS`, `VENTURE_MODE_METRICS` |

---

## 5. Calidad por Capa

### Frontend — 7.5/10

| Aspecto | Evaluación |
|---------|-----------|
| TypeScript | ⚠️ 3 `any` en código nuevo (LoanForm, LoansSection, useCategories) |
| Arquitectura | ✅ Vertical Slice respetado |
| Componentes | ✅ Limpios, sin lógica en `pages/` |
| Hooks | ✅ Bien estructurados, debounce correcto |
| Stores (Zustand) | ✅ Un store por feature |
| Auth en llamadas | ✅ Todas incluyen `Authorization` |
| WhatsApp Settings | 🔴 PUT roto — field mismatch |

### Backend (Edge Functions) — 5.5/10

| Aspecto | Evaluación |
|---------|-----------|
| CORS | ✅ Todas tienen handleCors() |
| Rate Limiting | ✅ Todas usan checkRateLimit() |
| Auth | ✅ Validan Authorization header |
| Routing | ✅ Routing correcto |
| TypeScript | 🔴 11 usos de `any` (10 heredados + 1 nuevo en loans) |
| Error handling | ✅ try/catch global |
| HMAC verification | ✅ WhatsApp webhook |
| Debug en producción | ⚠️ console.log en ventures |
| Migrations | 🔴 3 tablas nuevas sin versionado |

### Infraestructura — 8.5/10

| Aspecto | Evaluación |
|---------|-----------|
| `.vscode/settings.json` | ✅ Deno habilitado |
| `repomix.config.json` | ✅ Paths correctos |
| `CLAUDE.md` | ✅ Actualizado |
| Monorepo | ✅ npm workspaces |
| `.gitignore` | ✅ Bloquea `.env*` |
| Types centralizados | ✅ `_shared/types.ts` |

---

## 6. Hallazgos Adicionales

| Hallazgo | Tipo | Acción |
|----------|------|--------|
| `sendWhatsAppMessage()` no existe | Pendiente | Sprint 3 (Agente IA) |
| `ai_transaction_logs` table no existe | Pendiente | Sprint 3 |
| Storage bucket `evidence` | ✅ Existe | Funcional |
| `encrypt_token` / `decrypt_token` RPC | ✅ Existen | Funcionales |
| `<title>web</title>` en index.html | Limpieza | Cambiar a `Finova` |

---

## 7. Resumen Ejecutivo

```
Bugs del cimiento:     5/6  ⚠️ 1 ABIERTO (WhatsApp PUT mismatch)
Bugs features nuevas:  3/3  🔴 mode sin DB + 2 typos + 5 `any` nuevos
Deuda técnica total:   11 `any` + CORS duplicado + 3 tablas sin migration
Calidad frontend:      7.5/10 ⚠️ (bajó por `any` nuevos + WhatsApp roto)
Calidad backend:       5.5/10 🔴 (bajó por loans `any` + sin migrations)
Calidad infra:         8.5/10 ✅
```

### Próximos pasos priorizados

1. **Fix WhatsApp Settings PUT** (~5 min) — 🔴 CRÍTICO
2. **Agregar columna `mode` a ventures** (migration + backend) — 🔴
3. **Fix typos "Pŕestamo"** (~2 min) — 🟢
4. **Fix `any` en código nuevo** (~15 min) — 🟡
5. **Crear migrations para loans, loan_payments, transaction_categories** (~30 min) — 🟡
6. **Fix `any` heredados** (~20 min) — 🟢
7. **Sprint 3: Agente IA** — pendiente

---

> Última actualización: 2026-04-07
> Revisión manual completada — todos los cambios verificados contra git diff
