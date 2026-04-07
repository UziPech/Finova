This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where line numbers have been added.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
- Pay special attention to the Repository Description. These contain important context and guidelines specific to this project.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: apps/web/src/**/*.ts, apps/web/src/**/*.tsx, apps/api/functions/**/*.ts, packages/types/**/*.ts, supabase/migrations/**/*.sql, CLAUDE.md, PLAN_TAREA.md, package.json, apps/web/package.json
- Files matching these patterns are excluded: node_modules/**, dist/**, .env*, repomix-output.md, **/*.test.ts, **/*.spec.ts, **/*.test.tsx, apps/api/.env
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Line numbers have been added to the beginning of each line
- Files are sorted by Git change count (files with more changes are at the bottom)

# User Provided Header
# Finova — Contexto completo para agente

Generado automáticamente con repomix.
Usar como contexto inicial para Gema o Claude Opus en Antigravity.
No editar manualmente — re-generar con: npm run ctx


# Directory Structure
```
CLAUDE.md
package.json
```

# Files

## File: package.json
````json
 1: {
 2:   "name": "finova-monorepo",
 3:   "version": "0.1.0",
 4:   "private": true,
 5:   "workspaces": [
 6:     "frontend",
 7:     "backend"
 8:   ],
 9:   "scripts": {
10:     "dev": "npm run dev --workspace=frontend",
11:     "build": "npm run build --workspace=frontend",
12:     "lint": "npm run lint --workspace=frontend",
13:     "ctx": "repomix && echo '✦ Contexto de Finova generado → repomix-output.md'"
14:   },
15:   "devDependencies": {
16:     "repomix": "^1.13.1"
17:   }
18: }
````

## File: CLAUDE.md
````markdown
  1: # CLAUDE.md — Finova
  2: > Documento maestro de arquitectura. Leer completo antes de ejecutar cualquier acción.
  3: > Generado para uso con Antigravity + Gemini (planning) + Claude Opus (construcción).
  4: 
  5: ---
  6: 
  7: ## ¿Qué es Finova?
  8: 
  9: Finova es una aplicación web personal de gestión financiera para dos usuarios (Uziel y su novia). No es una app de contabilidad ni un tracker de gastos genérico.
 10: 
 11: **Filosofía central:**
 12: > Finova no te dice en qué gastaste. Te dice si lo que estás construyendo te está dando o costando.
 13: 
 14: Cada proyecto, negocio o cliente es una unidad con su propio ciclo de inversión y retorno. El sistema interpreta los números — no solo los registra.
 15: 
 16: ---
 17: 
 18: ## Estado del proyecto
 19: 
 20: ### ✅ Completado
 21: 
 22: | Módulo | Estado | Descripción |
 23: |--------|--------|-------------|
 24: | **Monorepo** | ✅ Listo | npm workspaces (`frontend/` + `backend/`) |
 25: | **Supabase Schema** | ✅ Listo | ventures, transactions, household_expenses, whatsapp_configs, keywords (con RLS) |
 26: | **Edge Functions (Backend)** | ✅ Desplegado | ventures, transactions, keywords, whatsapp-config, whatsapp-webhook |
 27: | **Auth (Frontend)** | ✅ Listo | Monochrome split layout (Supabase style) + Google OAuth |
 28: | **Layout (Frontend)** | ✅ Listo | Sidebar dark, TopBar glass, settings dropdown, responsive |
 29: | **Dashboard (Frontend)** | ✅ Listo | 4 metric cards + Recharts bar chart + ventures en rojo |
 30: | **Ventures (Frontend)** | ✅ Listo | Cards grid, filtros, crear/editar modal, detalle con transacciones |
 31: | **Transactions (Frontend)** | ✅ Listo | Form con toggle income/expense, file upload, delete |
 32: | **Settings (Frontend)** | ✅ Listo | WhatsApp API config + Keywords manager |
 33: | **Rate Limiting (Backend)** | ✅ Listo | Protección contra ataques DDoS en Edge Functions |
 34: | **Auth & Function Sync** | ✅ Listo | Inyección manual de `Authorization` header en hooks (resolve 401s) |
 35: | **Seguridad Webhook** | ✅ Listo | Verificación HMAC SHA-256 para mensajes de WhatsApp |
 36: | **Limpieza de código** | ✅ Listo | Archivos huérfanos eliminados y corrección de sintaxis en catches |
 37: 
 38: ### 🔲 Pendiente
 39: 
 40: | Módulo | Fase | Descripción |
 41: |--------|------|-------------|
 42: | **Testing E2E** | 1 | Verificar flujo completo auth → ventures → transacciones en local |
 43: | **Deploy Vercel** | 1 | Configurar env vars y CI/CD desde `main` |
 44: | **Hogar** | 2 | UI de gastos compartidos (tablas SQL ya creadas, sin frontend) |
 45: | **Webhook Mercado Pago** | 3 | Ingreso automático de pagos en ventures |
 46: | **Webhook Stripe** | 3 | Ingreso automático para clientes internacionales |
 47: | **Storage bucket** | 1 | Crear bucket `evidence` en Supabase para evidencias de transacciones |
 48: 
 49: ---
 50: 
 51: ## Módulos
 52: 
 53: ### ✦ Ventures (MVP — Fase 1) ✅
 54: 
 55: Panel de proyectos con ciclo financiero propio.
 56: 
 57: Entidad `Venture`:
 58: - `id`, `user_id`, `name`
 59: - `type`: `software` | `physical` | `investment` | `mixed`
 60: - `status`: `active` | `paused` | `closed` | `idea`
 61: - `invested`: capital total invertido (numérico, MXN por defecto)
 62: - `returned`: retorno total recibido
 63: - `roi`: calculado en frontend — nunca persistido → `((returned - invested) / invested) * 100`
 64: - `currency`: default `MXN`
 65: - `start_date`, `end_date?`, `notes`
 66: 
 67: Entidad `Transaction`:
 68: - `id`, `venture_id`, `user_id`
 69: - `type`: `income` | `expense`
 70: - `amount`, `description`, `date`
 71: - `evidence_url?` — foto de transferencia o referencia (Supabase Storage)
 72: 
 73: ### ✦ Dashboard global (MVP — Fase 1) ✅
 74: 
 75: Vista de salud financiera general:
 76: - Inversión total vs retorno total (all-time)
 77: - ROI promedio de ventures activos
 78: - Venture con mejor ROI
 79: - Ventures en rojo (invertido > retornado)
 80: - Flujo del mes actual (ingresos vs gastos)
 81: - Historial mensual de ingresos (últimos 6 meses — Recharts)
 82: 
 83: ### ✦ Settings — WhatsApp + Keywords (MVP — Fase 1) ✅
 84: 
 85: - Config de API WhatsApp por usuario (token, phone_number_id, verify_token)
 86: - Keywords para clasificación automática de transacciones vía WhatsApp
 87: - Webhook endpoint para recibir mensajes de WhatsApp
 88: 
 89: ### ✦ Hogar (Fase 2 — tablas creadas, sin UI)
 90: 
 91: Gastos compartidos del hogar entre ambos usuarios.
 92: - `HouseholdExpense`: gasto compartido con split configurable
 93: - `Category`: categorías (renta, comida, servicios, etc.)
 94: - `RecurringExpense`: gastos fijos mensuales
 95: 
 96: > **Regla:** No construir UI de Hogar en Fase 1. Solo existen las tablas SQL.
 97: 
 98: ### ✦ Integraciones (Fase 3)
 99: - Webhook Mercado Pago → registra ingresos automáticamente en el venture correspondiente
100: - Webhook Stripe → mismo flujo para clientes internacionales
101: 
102: ---
103: 
104: ## Stack tecnológico
105: 
106: | Capa | Tecnología | Versión |
107: |------|-----------|---------|
108: | Frontend | React + TypeScript + Vite | React 19, Vite 8 |
109: | Estilos | Tailwind CSS | v4 |
110: | Estado global | Zustand | latest |
111: | Charts | Recharts | latest |
112: | Routing | React Router | v7 |
113: | Backend | Supabase Edge Functions (Deno + TS) | — |
114: | Base de datos | PostgreSQL vía Supabase | — |
115: | Auth | Supabase Auth | — |
116: | Storage | Supabase Storage | — |
117: | Deploy frontend | Vercel (pendiente) | — |
118: | Deploy backend | Supabase (managed) | — |
119: | Package manager | npm workspaces | — |
120: 
121: ---
122: 
123: ## Arquitectura — monorepo con Vertical Slice Design
124: 
125: ```
126: finova/
127: │
128: ├── frontend/                        ← React SPA — deploy en Vercel
129: │   ├── src/
130: │   │   ├── app/                     ← Entrypoint, router, layout, protected route
131: │   │   │   ├── Layout.tsx           ← Sidebar dark + TopBar glass + Outlet
132: │   │   │   ├── ProtectedRoute.tsx   ← Auth guard con branded loading
133: │   │   │   └── router.tsx           ← Todas las rutas
134: │   │   │
135: │   │   ├── features/                ← Vertical slices por dominio
136: │   │   │   ├── auth/
137: │   │   │   │   ├── components/AuthForm.tsx
138: │   │   │   │   ├── hooks/useAuth.ts
139: │   │   │   │   ├── store.ts
140: │   │   │   │   └── types.ts
141: │   │   │   │
142: │   │   │   ├── ventures/
143: │   │   │   │   ├── components/      ← VentureCard, VentureForm, VenturesList, VentureDetail
144: │   │   │   │   ├── hooks/useVentures.ts
145: │   │   │   │   ├── store.ts
146: │   │   │   │   ├── utils.ts         ← calculateROI, breakEven, ventureHealth
147: │   │   │   │   └── types.ts
148: │   │   │   │
149: │   │   │   ├── transactions/
150: │   │   │   │   ├── components/TransactionForm.tsx
151: │   │   │   │   ├── hooks/useTransactions.ts
152: │   │   │   │   └── types.ts
153: │   │   │   │
154: │   │   │   ├── dashboard/
155: │   │   │   │   └── components/      ← DashboardView, MetricCard, MonthlyChart, RedVentures
156: │   │   │   │
157: │   │   │   └── settings/
158: │   │   │       └── components/      ← WhatsAppSettings, KeywordsManager
159: │   │   │
160: │   │   ├── pages/                   ← Shells: montan features, sin lógica
161: │   │   │   ├── AuthPage.tsx
162: │   │   │   ├── DashboardPage.tsx
163: │   │   │   ├── VenturesPage.tsx
164: │   │   │   ├── VentureDetailPage.tsx
165: │   │   │   ├── SettingsWhatsAppPage.tsx
166: │   │   │   └── SettingsKeywordsPage.tsx
167: │   │   │
168: │   │   └── shared/                  ← Utilidades y types (sin componentes UI activos)
169: │   │       ├── lib/
170: │   │       │   ├── supabase.ts      ← Cliente Supabase (solo anon key)
171: │   │       │   ├── formatters.ts    ← formatCurrency, formatDate, formatROI
172: │   │       │   └── constants.ts     ← Labels de tipos y estados
173: │   │       └── types/
174: │   │           └── index.ts         ← Re-exporta desde backend
175: │   │
176: │   ├── index.html
177: │   ├── vite.config.ts
178: │   ├── tsconfig.app.json           ← include: ["src", "../backend/_shared/types.ts"]
179: │   ├── .env.example                 ← VITE_SUPABASE_URL + ANON_KEY
180: │   └── package.json
181: │
182: ├── backend/                         ← Edge Functions — deploy en Supabase
183: │   └── _shared/
184: │       ├── types.ts                 ← FUENTE DE VERDAD de todos los tipos
185: │       ├── cors.ts                  ← CORS helper
186: │       ├── rateLimit.ts             ← Rate limiting por IP
187: │       ├── supabaseAdmin.ts         ← service_role key — NUNCA en frontend
188: │       └── whatsapp.ts              ← Utilidades para WhatsApp API
189: │
190: ├── supabase/
191: │   ├── functions/                   ← Edge Functions desplegadas
192: │   │   ├── ventures/index.ts
193: │   │   ├── transactions/index.ts
194: │   │   ├── keywords/index.ts
195: │   │   ├── whatsapp-config/index.ts
196: │   │   └── whatsapp-webhook/index.ts
197: │   └── migrations/
198: │       ├── 001_ventures.sql
199: │       ├── 002_transactions.sql
200: │       ├── 003_household_expenses.sql
201: │       ├── 004_whatsapp_configs.sql
202: │       └── 005_keywords.sql
203: │
204: ├── CLAUDE.md                        ← Este archivo
205: ├── repomix.config.json              ← Genera contexto para agentes
206: └── package.json                     ← Workspace root
207: ```
208: 
209: ---
210: 
211: ## Regla de importaciones — Vertical Slice
212: 
213: ```
214: app → pages → features → shared
215: ```
216: 
217: **Nunca importar hacia arriba.** Un feature no importa de otro feature. Si hay lógica compartida, va a `shared/`.
218: 
219: ```typescript
220: // ✓ Correcto
221: import { Venture } from '../types'          // dentro del mismo feature
222: import { formatCurrency } from '@/shared/lib/formatters'
223: 
224: // ✗ Prohibido
225: import { useVentures } from '@/features/ventures/hooks/useVentures'  // cross-feature
226: ```
227: 
228: **Excepción permitida:** `dashboard/` puede importar `calculateROI` desde `ventures/utils.ts` porque dashboard es consumidor de métricas de ventures. No obstante, si más features lo necesitan, mover a `shared/lib/`.
229: 
230: ---
231: 
232: ## Supabase — Schema completo
233: 
234: ### 001_ventures.sql
235: ```sql
236: create table ventures (
237:   id uuid primary key default gen_random_uuid(),
238:   user_id uuid references auth.users not null,
239:   name text not null,
240:   type text check (type in ('software','physical','investment','mixed')) not null,
241:   status text check (status in ('active','paused','closed','idea')) default 'active',
242:   invested numeric(12,2) default 0,
243:   returned numeric(12,2) default 0,
244:   currency text default 'MXN',
245:   start_date date,
246:   end_date date,
247:   notes text,
248:   created_at timestamptz default now(),
249:   updated_at timestamptz default now()
250: );
251: 
252: alter table ventures enable row level security;
253: 
254: create policy "usuarios ven solo sus ventures"
255:   on ventures for all
256:   using (auth.uid() = user_id)
257:   with check (auth.uid() = user_id);
258: ```
259: 
260: ### 002_transactions.sql
261: ```sql
262: create table transactions (
263:   id uuid primary key default gen_random_uuid(),
264:   venture_id uuid references ventures(id) on delete cascade not null,
265:   user_id uuid references auth.users not null,
266:   type text check (type in ('income','expense')) not null,
267:   amount numeric(12,2) not null check (amount > 0),
268:   description text,
269:   date date not null,
270:   evidence_url text,
271:   created_at timestamptz default now()
272: );
273: 
274: alter table transactions enable row level security;
275: 
276: create policy "usuarios ven solo sus transacciones"
277:   on transactions for all
278:   using (auth.uid() = user_id)
279:   with check (auth.uid() = user_id);
280: ```
281: 
282: ### 003_household_expenses.sql (Fase 2 — solo schema)
283: ```sql
284: create table household_expenses (
285:   id uuid primary key default gen_random_uuid(),
286:   created_by uuid references auth.users not null,
287:   amount numeric(12,2) not null,
288:   category text,
289:   description text,
290:   split_ratio numeric(3,2) default 0.50 check (split_ratio between 0 and 1),
291:   date date not null,
292:   created_at timestamptz default now()
293: );
294: ```
295: 
296: ### 004_whatsapp_configs.sql
297: ```sql
298: create table whatsapp_configs (
299:   id uuid primary key default gen_random_uuid(),
300:   user_id uuid references auth.users not null unique,
301:   access_token text not null,
302:   phone_number_id text not null,
303:   verify_token text not null,
304:   created_at timestamptz default now(),
305:   updated_at timestamptz default now()
306: );
307: ```
308: 
309: ### 005_keywords.sql
310: ```sql
311: create table keywords (
312:   id uuid primary key default gen_random_uuid(),
313:   user_id uuid references auth.users not null,
314:   keyword text not null,
315:   type text check (type in ('income','expense')) not null,
316:   venture_id uuid references ventures(id) on delete set null,
317:   created_at timestamptz default now()
318: );
319: ```
320: 
321: ---
322: 
323: ## Variables de entorno
324: 
325: | Variable | Ubicación | Acceso |
326: |----------|-----------|--------|
327: | `VITE_SUPABASE_URL` | `frontend/.env` | Frontend — pública, protegida por RLS |
328: | `VITE_SUPABASE_ANON_KEY` | `frontend/.env` | Frontend — pública, protegida por RLS |
329: | `SUPABASE_URL` | Supabase secrets | Edge Functions únicamente |
330: | `SUPABASE_SERVICE_ROLE_KEY` | Supabase secrets | Edge Functions únicamente — **NUNCA en frontend** |
331: 
332: > El `service_role_key` bypasea RLS. Si llega al frontend, cualquier usuario puede leer todos los datos.
333: 
334: ---
335: 
336: ## Cálculos de negocio
337: 
338: ```typescript
339: // features/ventures/utils.ts — NUNCA persistir en DB
340: 
341: export const calculateROI = (invested: number, returned: number): number => {
342:   if (invested === 0) return 0
343:   return Number(((returned - invested) / invested * 100).toFixed(2))
344: }
345: 
346: export const breakEven = (invested: number, returned: number): number => {
347:   return Math.max(0, invested - returned)
348: }
349: 
350: export type VentureHealth = 'positive' | 'neutral' | 'negative'
351: export const ventureHealth = (roi: number): VentureHealth => {
352:   if (roi > 0) return 'positive'
353:   if (roi === 0) return 'neutral'
354:   return 'negative'
355: }
356: ```
357: 
358: ---
359: 
360: ## Reglas del agente
361: 
362: 1. Leer `CLAUDE.md` completo antes de cualquier acción
363: 2. Correr `npm run ctx` para obtener contexto actualizado del código
364: 3. No crear UI de Hogar en Fase 1
365: 4. ROI nunca se persiste — solo se calcula en frontend (`ventures/utils.ts`)
366: 5. Cada cambio a DB requiere su migration SQL versionada
367: 6. No usar `any` en TypeScript
368: 7. `service_role_key` nunca en `frontend/`
369: 8. Un feature = un commit atómico
370: 9. Nunca importar una feature desde otra feature — usar `shared/` si hay lógica común
371: 10. Tipos de dominio solo en `backend/_shared/types.ts`
372: 11. `pages/` son shells: sin lógica propia, solo montan features
373: 12. Cada feature tiene su propio `store.ts` de Zustand — sin store global
374: 13. Todas las peticiones al backend van via `VITE_SUPABASE_URL/functions/v1/{edge-function}`
375: 14. **Crucial:** El JWT de Supabase debe incluirse **manualmente** en `Authorization: Bearer` dentro de las llamadas a `supabase.functions.invoke`, ya que el SDK no lo persiste automáticamente en este método.
376: 15. Seguridad WhatsApp: Webhooks usan HMAC signature verification (Meta standard).
377: 
378: ---
379: 
380: ## Comandos
381: 
382: ```bash
383: # Frontend
384: npm run dev          # Levanta frontend en desarrollo (Vite)
385: npm run build        # Build de producción (tsc + vite build)
386: npm run lint         # ESLint en todo el monorepo
387: npm run ctx          # Genera repomix-output.md para agentes
388: 
389: # Supabase
390: npx supabase start   # DB local para desarrollo
391: npx supabase db push # Aplica migrations a Supabase producción
392: npx supabase functions deploy <name>  # Despliega Edge Function
393: ```
394: 
395: ---
396: 
397: ## Desarrollo y DX (Developer Experience)
398: 
399: - **Editor (VS Code/Cursor):** Se requiere el uso del archivo `.vscode/settings.json` para habilitar el soporte de Deno exclusivamente en `backend/supabase/functions`, evitando errores de tipado falsos en el frontend.
400: - **Extensiones recomendadas:** `denoland.vscode-deno`.
401: 
402: ---
403: 
404: ## Checklist MVP — Fase 1
405: 
406: ### Setup base
407: - [x] Monorepo con npm workspaces
408: - [x] `frontend` — Vite + React + TypeScript
409: - [x] Tailwind CSS v4
410: - [x] Path aliases configurados (`@/` → `src/`, `@backend/` → `../backend/`)
411: - [x] repomix + script `ctx`
412: - [x] `.gitignore` — bloquea todos los `.env`
413: - [x] Limpieza de archivos Vite default (App.css, svgs, hero.png)
414: - [x] Limpieza de MockData y shared/ui no usados
415: - [x] Configuración `.vscode/settings.json` para Deno support
416: 
417: ### Supabase
418: - [x] Proyecto creado en Supabase
419: - [x] Migration 001 aplicada (ventures + RLS)
420: - [x] Migration 002 aplicada (transactions + RLS)
421: - [x] Migration 003 aplicada (household_expenses — solo tabla)
422: - [x] Migration 004 aplicada (whatsapp_configs + RLS)
423: - [x] Migration 005 aplicada (keywords + RLS)
424: - [x] Edge Functions desplegadas (ventures, transactions, keywords, whatsapp-config, whatsapp-webhook)
425: - [x] Rate limiting en Edge Functions
426: - [ ] Supabase Storage bucket para evidencias
427: - [x] RLS verificado
428: - [x] Verificación HMAC para WhatsApp Webhook
429: 
430: ### Auth
431: - [x] Pantalla login / registro (monochrome split UI)
432: - [x] Integración Google OAuth
433: - [x] Protección de rutas (ProtectedRoute)
434: - [x] Hook `useAuth` (Zustand + Supabase listener)
435: - [x] Persistencia de sesión
436: - [x] Inyección de Authorization Header en `supabase.functions.invoke`
437: 
438: ### Módulo Ventures
439: - [x] Listado de ventures con ROI calculado
440: - [x] Crear venture (form validado)
441: - [x] Editar venture
442: - [x] Detalle de venture con historial de transacciones
443: - [x] Agregar transacción (income / expense)
444: - [x] Upload de evidencia (form con file input)
445: 
446: ### Dashboard
447: - [x] 4 métricas globales (cards con animación)
448: - [x] Indicador ventures en rojo
449: - [x] Flujo del mes (ingresos vs gastos)
450: - [x] Historial mensual últimos 6 meses (Recharts bar chart)
451: 
452: ### Settings
453: - [x] WhatsApp API config (token, phone_number_id, verify_token)
454: - [x] Keywords manager (income/expense con venture opcional)
455: 
456: ### Deploy
457: - [ ] Variables de entorno configuradas en Vercel
458: - [ ] Deploy automático desde rama `main`
459: 
460: ---
461: 
462: ## Próximos pasos (por prioridad)
463: 
464: 1. **Storage bucket** — Crear bucket `evidence` en Supabase para evidence_url
465: 2. **Deploy Vercel** — Configurar env vars + CI/CD
466: 3. **Hogar (Fase 2)** — UI de gastos compartidos (esquema ya existe)
467: 4. **Webhooks (Fase 3)** — Mercado Pago + Stripe
````
