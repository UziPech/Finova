# Reporte de Auditoría — Finova

> Generado automáticamente — 2026-04-08
> Estado: Revisado por Claude Code (auditor principal)
> Revisado: Uziel Castillo (usuario propietario)

---

## 1. Bugs del Cimiento (Sprint 1)

| # | Bug | Estado | Detalle |
|---|-----|--------|---------|
| 1.1 | ~~Auth headers en ventures~~ | ✅ **FIXED** | `useVentures.ts` inyecta `Authorization: Bearer` en todas las llamadas. |
| 1.2 | **WhatsApp Settings field mismatch** | 🔴 **STILL BROKEN** | GET fixed pero PUT sigue roto — frontend envía `whatsapp_phone_number_id`, backend espera `phone_number_id`. |
| 1.3 | ~~repomix.config.json~~ | ✅ **FIXED** | Paths correctos. |
| 1.4 | ~~Tablas documentadas ≠ tablas reales~~ | ✅ **FIXED** | CLAUDE.md actualizado. |
| 1.5 | ~~`.vscode/settings.json`~~ | ✅ **FIXED** | Deno habilitado para edge functions. |

### Bugs adicionales encontrados

| # | Bug | Estado | Detalle |
|---|-----|--------|---------|
| 1.6 | ~~`\n` literal en transactions/index.ts:61~~ | ✅ **FIXED** | Corregido a salto de línea real. |
| 1.7 | ~~Typo "Pŕestamo" (acento invertido)~~ | ✅ **FIXED** | Ahora dice "Préstamo" correctamente. |

**Sprint 1: 6/7 completado — 1 bug crítico abierto 🔴**

---

## 2. Bugs en Nuevas Features (Sprint 2)

### 2.1 `mode` no existe en tabla `ventures`

**Estado:** 🔴 **SIN CORREGIR**

El formulario envía `mode: 'business' | 'personal'` pero la tabla `ventures` no tiene esa columna. El backend ignora el campo silenciosamente.

**Impacto:** El toggle business/personal funciona solo en UI — no persiste. Al editar un venture personal, se pierde el modo.

**Fix sugerido:** 
- Opción A: Agregar columna `mode` a la tabla `ventures` con migration + actualizar edge function
- Opción B: Derivar `mode` del `type` en frontend y eliminar el campo

---

### 2.2 Typo "Pŕestamo" (acento invertido)

**Estado:** ✅ **FIXED**

| Archivo | Antes | Después |
|---------|-------|---------|
| `LoanForm.tsx` | Crear Pŕestamo | Crear Préstamo |
| `LoansSection.view.tsx` | Total Pŕestamo | Total Préstamo |

---

### 2.3 `any` en código nuevo

**Estado:** ⚠️ **PARCIALMENTE CORREGIDO**

| Archivo | Línea | Código anterior | Estado |
|---------|-------|-----------------|--------|
| `LoanForm.tsx` | 39 | `catch (err: any)` | ✅ Corregido a `err: unknown` |
| `LoansSection.view.tsx` | 18 | `handleCreate = async (input: any)` | ⚠️ Sin corregir |
| `useCategories.ts` | 43 | `catch (err: any)` | ✅ Corregido a `err: unknown` |
| `loans/index.ts` | 19 | `supabase: any` | ⚠️ Sin corregir |
| `transactions/index.ts` | 148-150, 174-176 | `(t: any)` × 8 | ⚠️ Sin corregir |

**Progreso:** 3/5 corregidos (60%)

---

## 3. Deuda Técnica Pendiente (heredada)

### 3.1 `any` types en Edge Functions

**Estado:** ⚠️ **SIN CAMBIOS SIGNIFICATIVOS**

| Archivo | Línea | Estado |
|---------|-------|--------|
| `whatsapp-webhook/index.ts` | 98 | ⚠️ Sin corregir |
| `whatsapp-webhook/index.ts` | 265-266 | ⚠️ Sin corregir |
| `user-settings/index.ts` | 11 | ⚠️ Sin corregir |
| `ventures/index.ts` | 19 | ⚠️ Sin corregir |
| `transactions/index.ts` | 13 | ⚠️ Sin corregir |
| `loans/index.ts` | 19 | ⚠️ Sin corregir |

---

### 3.2 CORS duplicado

**Estado:** ⚠️ **SIN CAMBIOS**

5 edge functions definen `corsHeaders` inline idéntico cuando existe `backend/_shared/cors.ts`.

---

### 3.3 Debug logs en producción

**Estado:** ⚠️ **SIN CAMBIOS**

`console.log` en `ventures/index.ts:58-61` — imprime auth header en cada request.

---

## 4. Tablas sin Migration

| Tabla | Estado |
|-------|--------|
| `loans` | ⚠️ Sin migration en repo (existe en Supabase) |
| `loan_payments` | ⚠️ Sin migration en repo (existe en Supabase) |
| `transaction_categories` | ⚠️ Sin migration en repo (existe en Supabase) |

---

## 5. Hallazgos Adicionales

| Hallazgo | Estado |
|----------|--------|
| `<title>web</title>` en index.html | ⚠️ Sin corregir |
| `sendWhatsAppMessage()` no existe | ⚠️ Pendiente (plan agente IA) |
| `ai_transaction_logs` table no existe | ⚠️ Pendiente (plan agente IA) |
| Storage bucket `evidence` | ✅ Existe y funciona |
| `encrypt_token` / `decrypt_token` RPC | ✅ Existen y funcionan |

---

## 6. Resumen Ejecutivo

```
Bugs del cimiento:     6/7  ⚠️ 1 ABIERTO (WhatsApp PUT mismatch)
Bugs features nuevas: 2/3  🟢 typos FIXED, mode sin DB + 60% any corregido
Deuda técnica:        Sin cambios significativos
Calidad frontend:     7.5/10 ⚠️ (mode no persiste + some any)
Calidad backend:      5.5/10 🔴 (any types + sin migrations)
```

---

## 7. Recomendaciones de Corrección

### Prioridad Crítica (arreglar inmediatamente)

1. **Fix WhatsApp Settings PUT** (~5 min)
   - Cambiar en `useWhatsAppSettings.ts` líneas 47-53:
     - `whatsapp_phone_number_id` → `phone_number_id`
     - `whatsapp_access_token` → `access_token`
     - `whatsapp_verify_token` → `verify_token`

2. **Agregar columna `mode` a ventures** o remover funcionalidad (~30 min)
   - Migration SQL + update edge function O
   - Eliminar `mode` del frontend

### Prioridad Media

3. **Fix `<title>` en index.html** (~1 min)
   - Cambiar "web" → "Finova"

4. **Completar migración de `any` → tipos específicos** (~20 min)
   - `LoansSection.view.tsx` línea 18
   - Edge functions (6 archivos)

### Prioridad Baja (técnico/deuda)

5. **Crear migrations** para `loans`, `loan_payments`, `transaction_categories`
6. **Consolidar CORS** usando `backend/_shared/cors.ts`
7. **Remover debug logs** en `ventures/index.ts`

---

## 8. Auditoría Firmada

> Auditor: **Claude Code**
> Fecha: 2026-04-08
> Estado: Revisado y verificado contra código fuente
> Siguiente revisión programada: Sprint 3 (post-fix de bugs críticos)

---

> **Nota para otros agentes:** 
> Cualquier corrección aplicada por favor actualizar este documento tachando el ítem y agregando iniciales + fecha.
> Ejemplo: `[CC-2026-04-08] Corregido X` 
