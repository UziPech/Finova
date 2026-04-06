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
- Files matching these patterns are excluded: node_modules/**, dist/**, .env*, repomix-output.md, **/*.test.ts, **/*.spec.ts, **/*.test.tsx, apps/api/.env, node_modules, dist, .env, .next
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
 34: | **Limpieza de código** | ✅ Listo | Archivos huérfanos eliminados, 0 dead code |
 35: 
 36: ### 🔲 Pendiente
 37: 
 38: | Módulo | Fase | Descripción |
 39: |--------|------|-------------|
 40: | **Testing E2E** | 1 | Verificar flujo completo auth → ventures → transacciones en local |
 41: | **Deploy Vercel** | 1 | Configurar env vars y CI/CD desde `main` |
 42: | **Hogar** | 2 | UI de gastos compartidos (tablas SQL ya creadas, sin frontend) |
 43: | **Webhook Mercado Pago** | 3 | Ingreso automático de pagos en ventures |
 44: | **Webhook Stripe** | 3 | Ingreso automático para clientes internacionales |
 45: | **Storage bucket** | 1 | Crear bucket `evidence` en Supabase para evidencias de transacciones |
 46: 
 47: ---
 48: 
 49: ## Módulos
 50: 
 51: ### ✦ Ventures (MVP — Fase 1) ✅
 52: 
 53: Panel de proyectos con ciclo financiero propio.
 54: 
 55: Entidad `Venture`:
 56: - `id`, `user_id`, `name`
 57: - `type`: `software` | `physical` | `investment` | `mixed`
 58: - `status`: `active` | `paused` | `closed` | `idea`
 59: - `invested`: capital total invertido (numérico, MXN por defecto)
 60: - `returned`: retorno total recibido
 61: - `roi`: calculado en frontend — nunca persistido → `((returned - invested) / invested) * 100`
 62: - `currency`: default `MXN`
 63: - `start_date`, `end_date?`, `notes`
 64: 
 65: Entidad `Transaction`:
 66: - `id`, `venture_id`, `user_id`
 67: - `type`: `income` | `expense`
 68: - `amount`, `description`, `date`
 69: - `evidence_url?` — foto de transferencia o referencia (Supabase Storage)
 70: 
 71: ### ✦ Dashboard global (MVP — Fase 1) ✅
 72: 
 73: Vista de salud financiera general:
 74: - Inversión total vs retorno total (all-time)
 75: - ROI promedio de ventures activos
 76: - Venture con mejor ROI
 77: - Ventures en rojo (invertido > retornado)
 78: - Flujo del mes actual (ingresos vs gastos)
 79: - Historial mensual de ingresos (últimos 6 meses — Recharts)
 80: 
 81: ### ✦ Settings — WhatsApp + Keywords (MVP — Fase 1) ✅
 82: 
 83: - Config de API WhatsApp por usuario (token, phone_number_id, verify_token)
 84: - Keywords para clasificación automática de transacciones vía WhatsApp
 85: - Webhook endpoint para recibir mensajes de WhatsApp
 86: 
 87: ### ✦ Hogar (Fase 2 — tablas creadas, sin UI)
 88: 
 89: Gastos compartidos del hogar entre ambos usuarios.
 90: - `HouseholdExpense`: gasto compartido con split configurable
 91: - `Category`: categorías (renta, comida, servicios, etc.)
 92: - `RecurringExpense`: gastos fijos mensuales
 93: 
 94: > **Regla:** No construir UI de Hogar en Fase 1. Solo existen las tablas SQL.
 95: 
 96: ### ✦ Integraciones (Fase 3)
 97: - Webhook Mercado Pago → registra ingresos automáticamente en el venture correspondiente
 98: - Webhook Stripe → mismo flujo para clientes internacionales
 99: 
100: ---
101: 
102: ## Stack tecnológico
103: 
104: | Capa | Tecnología | Versión |
105: |------|-----------|---------|
106: | Frontend | React + TypeScript + Vite | React 19, Vite 8 |
107: | Estilos | Tailwind CSS | v4 |
108: | Estado global | Zustand | latest |
109: | Charts | Recharts | latest |
110: | Routing | React Router | v7 |
111: | Backend | Supabase Edge Functions (Deno + TS) | — |
112: | Base de datos | PostgreSQL vía Supabase | — |
113: | Auth | Supabase Auth | — |
114: | Storage | Supabase Storage | — |
115: | Deploy frontend | Vercel (pendiente) | — |
116: | Deploy backend | Supabase (managed) | — |
117: | Package manager | npm workspaces | — |
118: 
119: ---
120: 
121: ## Arquitectura — monorepo con Vertical Slice Design
122: 
123: ```
124: finova/
125: │
126: ├── frontend/                        ← React SPA — deploy en Vercel
127: │   ├── src/
128: │   │   ├── app/                     ← Entrypoint, router, layout, protected route
129: │   │   │   ├── Layout.tsx           ← Sidebar dark + TopBar glass + Outlet
130: │   │   │   ├── ProtectedRoute.tsx   ← Auth guard con branded loading
131: │   │   │   └── router.tsx           ← Todas las rutas
132: │   │   │
133: │   │   ├── features/                ← Vertical slices por dominio
134: │   │   │   ├── auth/
135: │   │   │   │   ├── components/AuthForm.tsx
136: │   │   │   │   ├── hooks/useAuth.ts
137: │   │   │   │   ├── store.ts
138: │   │   │   │   └── types.ts
139: │   │   │   │
140: │   │   │   ├── ventures/
141: │   │   │   │   ├── components/      ← VentureCard, VentureForm, VenturesList, VentureDetail
142: │   │   │   │   ├── hooks/useVentures.ts
143: │   │   │   │   ├── store.ts
144: │   │   │   │   ├── utils.ts         ← calculateROI, breakEven, ventureHealth
145: │   │   │   │   └── types.ts
146: │   │   │   │
147: │   │   │   ├── transactions/
148: │   │   │   │   ├── components/TransactionForm.tsx
149: │   │   │   │   ├── hooks/useTransactions.ts
150: │   │   │   │   └── types.ts
151: │   │   │   │
152: │   │   │   ├── dashboard/
153: │   │   │   │   └── components/      ← DashboardView, MetricCard, MonthlyChart, RedVentures
154: │   │   │   │
155: │   │   │   └── settings/
156: │   │   │       └── components/      ← WhatsAppSettings, KeywordsManager
157: │   │   │
158: │   │   ├── pages/                   ← Shells: montan features, sin lógica
159: │   │   │   ├── AuthPage.tsx
160: │   │   │   ├── DashboardPage.tsx
161: │   │   │   ├── VenturesPage.tsx
162: │   │   │   ├── VentureDetailPage.tsx
163: │   │   │   ├── SettingsWhatsAppPage.tsx
164: │   │   │   └── SettingsKeywordsPage.tsx
165: │   │   │
166: │   │   └── shared/                  ← Utilidades y types (sin componentes UI activos)
167: │   │       ├── lib/
168: │   │       │   ├── supabase.ts      ← Cliente Supabase (solo anon key)
169: │   │       │   ├── formatters.ts    ← formatCurrency, formatDate, formatROI
170: │   │       │   └── constants.ts     ← Labels de tipos y estados
171: │   │       └── types/
172: │   │           └── index.ts         ← Re-exporta desde backend
173: │   │
174: │   ├── index.html
175: │   ├── vite.config.ts
176: │   ├── tsconfig.app.json           ← include: ["src", "../backend/_shared/types.ts"]
177: │   ├── .env.example                 ← VITE_SUPABASE_URL + ANON_KEY
178: │   └── package.json
179: │
180: ├── backend/                         ← Edge Functions — deploy en Supabase
181: │   └── _shared/
182: │       ├── types.ts                 ← FUENTE DE VERDAD de todos los tipos
183: │       ├── cors.ts                  ← CORS helper
184: │       ├── rateLimit.ts             ← Rate limiting por IP
185: │       ├── supabaseAdmin.ts         ← service_role key — NUNCA en frontend
186: │       └── whatsapp.ts              ← Utilidades para WhatsApp API
187: │
188: ├── supabase/
189: │   ├── functions/                   ← Edge Functions desplegadas
190: │   │   ├── ventures/index.ts
191: │   │   ├── transactions/index.ts
192: │   │   ├── keywords/index.ts
193: │   │   ├── whatsapp-config/index.ts
194: │   │   └── whatsapp-webhook/index.ts
195: │   └── migrations/
196: │       ├── 001_ventures.sql
197: │       ├── 002_transactions.sql
198: │       ├── 003_household_expenses.sql
199: │       ├── 004_whatsapp_configs.sql
200: │       └── 005_keywords.sql
201: │
202: ├── CLAUDE.md                        ← Este archivo
203: ├── repomix.config.json              ← Genera contexto para agentes
204: └── package.json                     ← Workspace root
205: ```
206: 
207: ---
208: 
209: ## Regla de importaciones — Vertical Slice
210: 
211: ```
212: app → pages → features → shared
213: ```
214: 
215: **Nunca importar hacia arriba.** Un feature no importa de otro feature. Si hay lógica compartida, va a `shared/`.
216: 
217: ```typescript
218: // ✓ Correcto
219: import { Venture } from '../types'          // dentro del mismo feature
220: import { formatCurrency } from '@/shared/lib/formatters'
221: 
222: // ✗ Prohibido
223: import { useVentures } from '@/features/ventures/hooks/useVentures'  // cross-feature
224: ```
225: 
226: **Excepción permitida:** `dashboard/` puede importar `calculateROI` desde `ventures/utils.ts` porque dashboard es consumidor de métricas de ventures. No obstante, si más features lo necesitan, mover a `shared/lib/`.
227: 
228: ---
229: 
230: ## Supabase — Schema completo
231: 
232: ### 001_ventures.sql
233: ```sql
234: create table ventures (
235:   id uuid primary key default gen_random_uuid(),
236:   user_id uuid references auth.users not null,
237:   name text not null,
238:   type text check (type in ('software','physical','investment','mixed')) not null,
239:   status text check (status in ('active','paused','closed','idea')) default 'active',
240:   invested numeric(12,2) default 0,
241:   returned numeric(12,2) default 0,
242:   currency text default 'MXN',
243:   start_date date,
244:   end_date date,
245:   notes text,
246:   created_at timestamptz default now(),
247:   updated_at timestamptz default now()
248: );
249: 
250: alter table ventures enable row level security;
251: 
252: create policy "usuarios ven solo sus ventures"
253:   on ventures for all
254:   using (auth.uid() = user_id)
255:   with check (auth.uid() = user_id);
256: ```
257: 
258: ### 002_transactions.sql
259: ```sql
260: create table transactions (
261:   id uuid primary key default gen_random_uuid(),
262:   venture_id uuid references ventures(id) on delete cascade not null,
263:   user_id uuid references auth.users not null,
264:   type text check (type in ('income','expense')) not null,
265:   amount numeric(12,2) not null check (amount > 0),
266:   description text,
267:   date date not null,
268:   evidence_url text,
269:   created_at timestamptz default now()
270: );
271: 
272: alter table transactions enable row level security;
273: 
274: create policy "usuarios ven solo sus transacciones"
275:   on transactions for all
276:   using (auth.uid() = user_id)
277:   with check (auth.uid() = user_id);
278: ```
279: 
280: ### 003_household_expenses.sql (Fase 2 — solo schema)
281: ```sql
282: create table household_expenses (
283:   id uuid primary key default gen_random_uuid(),
284:   created_by uuid references auth.users not null,
285:   amount numeric(12,2) not null,
286:   category text,
287:   description text,
288:   split_ratio numeric(3,2) default 0.50 check (split_ratio between 0 and 1),
289:   date date not null,
290:   created_at timestamptz default now()
291: );
292: ```
293: 
294: ### 004_whatsapp_configs.sql
295: ```sql
296: create table whatsapp_configs (
297:   id uuid primary key default gen_random_uuid(),
298:   user_id uuid references auth.users not null unique,
299:   access_token text not null,
300:   phone_number_id text not null,
301:   verify_token text not null,
302:   created_at timestamptz default now(),
303:   updated_at timestamptz default now()
304: );
305: ```
306: 
307: ### 005_keywords.sql
308: ```sql
309: create table keywords (
310:   id uuid primary key default gen_random_uuid(),
311:   user_id uuid references auth.users not null,
312:   keyword text not null,
313:   type text check (type in ('income','expense')) not null,
314:   venture_id uuid references ventures(id) on delete set null,
315:   created_at timestamptz default now()
316: );
317: ```
318: 
319: ---
320: 
321: ## Variables de entorno
322: 
323: | Variable | Ubicación | Acceso |
324: |----------|-----------|--------|
325: | `VITE_SUPABASE_URL` | `frontend/.env` | Frontend — pública, protegida por RLS |
326: | `VITE_SUPABASE_ANON_KEY` | `frontend/.env` | Frontend — pública, protegida por RLS |
327: | `SUPABASE_URL` | Supabase secrets | Edge Functions únicamente |
328: | `SUPABASE_SERVICE_ROLE_KEY` | Supabase secrets | Edge Functions únicamente — **NUNCA en frontend** |
329: 
330: > El `service_role_key` bypasea RLS. Si llega al frontend, cualquier usuario puede leer todos los datos.
331: 
332: ---
333: 
334: ## Cálculos de negocio
335: 
336: ```typescript
337: // features/ventures/utils.ts — NUNCA persistir en DB
338: 
339: export const calculateROI = (invested: number, returned: number): number => {
340:   if (invested === 0) return 0
341:   return Number(((returned - invested) / invested * 100).toFixed(2))
342: }
343: 
344: export const breakEven = (invested: number, returned: number): number => {
345:   return Math.max(0, invested - returned)
346: }
347: 
348: export type VentureHealth = 'positive' | 'neutral' | 'negative'
349: export const ventureHealth = (roi: number): VentureHealth => {
350:   if (roi > 0) return 'positive'
351:   if (roi === 0) return 'neutral'
352:   return 'negative'
353: }
354: ```
355: 
356: ---
357: 
358: ## Reglas del agente
359: 
360: 1. Leer `CLAUDE.md` completo antes de cualquier acción
361: 2. Correr `npm run ctx` para obtener contexto actualizado del código
362: 3. No crear UI de Hogar en Fase 1
363: 4. ROI nunca se persiste — solo se calcula en frontend (`ventures/utils.ts`)
364: 5. Cada cambio a DB requiere su migration SQL versionada
365: 6. No usar `any` en TypeScript
366: 7. `service_role_key` nunca en `frontend/`
367: 8. Un feature = un commit atómico
368: 9. Nunca importar una feature desde otra feature — usar `shared/` si hay lógica común
369: 10. Tipos de dominio solo en `backend/_shared/types.ts`
370: 11. `pages/` son shells: sin lógica propia, solo montan features
371: 12. Cada feature tiene su propio `store.ts` de Zustand — sin store global
372: 13. Todas las peticiones al backend van via `VITE_SUPABASE_URL/functions/v1/{edge-function}`
373: 14. JWT de Supabase se incluye en `Authorization: Bearer` en todas las peticiones
374: 
375: ---
376: 
377: ## Comandos
378: 
379: ```bash
380: # Frontend
381: npm run dev          # Levanta frontend en desarrollo (Vite)
382: npm run build        # Build de producción (tsc + vite build)
383: npm run lint         # ESLint en todo el monorepo
384: npm run ctx          # Genera repomix-output.md para agentes
385: 
386: # Supabase
387: npx supabase start   # DB local para desarrollo
388: npx supabase db push # Aplica migrations a Supabase producción
389: npx supabase functions deploy <name>  # Despliega Edge Function
390: ```
391: 
392: ---
393: 
394: ## Checklist MVP — Fase 1
395: 
396: ### Setup base
397: - [x] Monorepo con npm workspaces
398: - [x] `frontend` — Vite + React + TypeScript
399: - [x] Tailwind CSS v4
400: - [x] Path aliases configurados (`@/` → `src/`, `@backend/` → `../backend/`)
401: - [x] repomix + script `ctx`
402: - [x] `.gitignore` — bloquea todos los `.env`
403: - [x] Limpieza de archivos Vite default (App.css, svgs, hero.png)
404: - [x] Limpieza de MockData y shared/ui no usados
405: 
406: ### Supabase
407: - [x] Proyecto creado en Supabase
408: - [x] Migration 001 aplicada (ventures + RLS)
409: - [x] Migration 002 aplicada (transactions + RLS)
410: - [x] Migration 003 aplicada (household_expenses — solo tabla)
411: - [x] Migration 004 aplicada (whatsapp_configs + RLS)
412: - [x] Migration 005 aplicada (keywords + RLS)
413: - [x] Edge Functions desplegadas (ventures, transactions, keywords, whatsapp-config, whatsapp-webhook)
414: - [x] Rate limiting en Edge Functions
415: - [ ] Supabase Storage bucket para evidencias
416: - [x] RLS verificado
417: 
418: ### Auth
419: - [x] Pantalla login / registro (monochrome split UI)
420: - [x] Integración Google OAuth
421: - [x] Protección de rutas (ProtectedRoute)
422: - [x] Hook `useAuth` (Zustand + Supabase listener)
423: - [x] Persistencia de sesión
424: 
425: ### Módulo Ventures
426: - [x] Listado de ventures con ROI calculado
427: - [x] Crear venture (form validado)
428: - [x] Editar venture
429: - [x] Detalle de venture con historial de transacciones
430: - [x] Agregar transacción (income / expense)
431: - [x] Upload de evidencia (form con file input)
432: 
433: ### Dashboard
434: - [x] 4 métricas globales (cards con animación)
435: - [x] Indicador ventures en rojo
436: - [x] Flujo del mes (ingresos vs gastos)
437: - [x] Historial mensual últimos 6 meses (Recharts bar chart)
438: 
439: ### Settings
440: - [x] WhatsApp API config (token, phone_number_id, verify_token)
441: - [x] Keywords manager (income/expense con venture opcional)
442: 
443: ### Deploy
444: - [ ] Variables de entorno configuradas en Vercel
445: - [ ] Deploy automático desde rama `main`
446: 
447: ---
448: 
449: ## Próximos pasos (por prioridad)
450: 
451: 1. **Refactorizar UI/UX** — Aplicar el nuevo diseño premium/monocromático a todos los módulos (Dashboard, Ventures, Settings)
452: 2. **Testing local** — Levantar dev server, crear cuenta, probar flujo completo
453: 3. **Storage bucket** — Crear bucket `evidence` en Supabase para evidence_url
454: 4. **Deploy Vercel** — Configurar env vars + CI/CD
455: 5. **Hogar (Fase 2)** — UI de gastos compartidos (esquema ya existe)
456: 6. **Webhooks (Fase 3)** — Mercado Pago + Stripe
````

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
