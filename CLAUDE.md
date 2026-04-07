# CLAUDE.md — Finova
> Documento maestro de arquitectura. Leer completo antes de ejecutar cualquier acción.
> Generado para uso con Antigravity + Gemini (planning) + Claude Opus (construcción).

---

## ¿Qué es Finova?

Finova es una aplicación web personal de gestión financiera para dos usuarios (Uziel y su novia). No es una app de contabilidad ni un tracker de gastos genérico.

**Filosofía central:**
> Finova no te dice en qué gastaste. Te dice si lo que estás construyendo te está dando o costando.

Cada proyecto, negocio o cliente es una unidad con su propio ciclo de inversión y retorno. El sistema interpreta los números — no solo los registra.

---

## Estado del proyecto

### ✅ Completado

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| **Monorepo** | ✅ Listo | npm workspaces (`frontend/` + `backend/`) |
| **Supabase Schema** | ✅ Listo | ventures, transactions, household_expenses, user_integrations, whatsapp_keywords (con RLS) |
| **Edge Functions (Backend)** | ✅ Desplegado | ventures, transactions, keywords, whatsapp-config, whatsapp-webhook |
| **Auth (Frontend)** | ✅ Listo | Monochrome split layout (Supabase style) + Google OAuth |
| **Layout (Frontend)** | ✅ Listo | Sidebar dark, TopBar glass, settings dropdown, responsive |
| **Dashboard (Frontend)** | ✅ Listo | 4 metric cards + Recharts bar chart + ventures en rojo |
| **Ventures (Frontend)** | ✅ Listo | Cards grid, filtros, crear/editar modal, detalle con transacciones |
| **Transactions (Frontend)** | ✅ Listo | Form con toggle income/expense, file upload, delete |
| **Settings (Frontend)** | ✅ Listo | WhatsApp API config + Keywords manager |
| **Rate Limiting (Backend)** | ✅ Listo | Protección contra ataques DDoS en Edge Functions |
| **Auth & Function Sync** | ✅ Listo | Inyección manual de `Authorization` header en hooks (resolve 401s) |
| **Seguridad Webhook** | ✅ Listo | Verificación HMAC SHA-256 para mensajes de WhatsApp |
| **Limpieza de código** | ✅ Listo | Archivos huérfanos eliminados y corrección de sintaxis en catches |

### 🔲 Pendiente

| Módulo | Fase | Descripción |
|--------|------|-------------|
| **Testing E2E** | 1 | Verificar flujo completo auth → ventures → transacciones en local |
| **Deploy Vercel** | 1 | Configurar env vars y CI/CD desde `main` |
| **Hogar** | 2 | UI de gastos compartidos (tablas SQL ya creadas, sin frontend) |
| **Webhook Mercado Pago** | 3 | Ingreso automático de pagos en ventures |
| **Webhook Stripe** | 3 | Ingreso automático para clientes internacionales |
| **Storage bucket** | 1 | Crear bucket `evidence` en Supabase para evidencias de transacciones |

---

## Módulos

### ✦ Ventures (MVP — Fase 1) ✅

Panel de proyectos con ciclo financiero propio.

Entidad `Venture`:
- `id`, `user_id`, `name`
- `type`: `software` | `physical` | `investment` | `mixed`
- `status`: `active` | `paused` | `closed` | `idea`
- `invested`: capital total invertido (numérico, MXN por defecto)
- `returned`: retorno total recibido
- `roi`: calculado en frontend — nunca persistido → `((returned - invested) / invested) * 100`
- `currency`: default `MXN`
- `start_date`, `end_date?`, `notes`

Entidad `Transaction`:
- `id`, `venture_id`, `user_id`
- `type`: `income` | `expense`
- `amount`, `description`, `date`
- `evidence_url?` — foto de transferencia o referencia (Supabase Storage)

### ✦ Dashboard global (MVP — Fase 1) ✅

Vista de salud financiera general:
- Inversión total vs retorno total (all-time)
- ROI promedio de ventures activos
- Venture con mejor ROI
- Ventures en rojo (invertido > retornado)
- Flujo del mes actual (ingresos vs gastos)
- Historial mensual de ingresos (últimos 6 meses — Recharts)

### ✦ Settings — WhatsApp + Keywords (MVP — Fase 1) ✅

- Config de API WhatsApp por usuario (token, phone_number_id, verify_token)
- Keywords para clasificación automática de transacciones vía WhatsApp
- Webhook endpoint para recibir mensajes de WhatsApp

### ✦ Hogar (Fase 2 — tablas creadas, sin UI)

Gastos compartidos del hogar entre ambos usuarios.
- `HouseholdExpense`: gasto compartido con split configurable
- `Category`: categorías (renta, comida, servicios, etc.)
- `RecurringExpense`: gastos fijos mensuales

> **Regla:** No construir UI de Hogar en Fase 1. Solo existen las tablas SQL.

### ✦ Integraciones (Fase 3)
- Webhook Mercado Pago → registra ingresos automáticamente en el venture correspondiente
- Webhook Stripe → mismo flujo para clientes internacionales

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + TypeScript + Vite | React 19, Vite 8 |
| Estilos | Tailwind CSS | v4 |
| Estado global | Zustand | latest |
| Charts | Recharts | latest |
| Routing | React Router | v7 |
| Backend | Supabase Edge Functions (Deno + TS) | — |
| Base de datos | PostgreSQL vía Supabase | — |
| Auth | Supabase Auth | — |
| Storage | Supabase Storage | — |
| Deploy frontend | Vercel (pendiente) | — |
| Deploy backend | Supabase (managed) | — |
| Package manager | npm workspaces | — |

---

## Arquitectura — monorepo con Vertical Slice Design

```
finova/
│
├── frontend/                        ← React SPA — deploy en Vercel
│   ├── src/
│   │   ├── app/                     ← Entrypoint, router, layout, protected route
│   │   │   ├── Layout.tsx           ← Sidebar dark + TopBar glass + Outlet
│   │   │   ├── ProtectedRoute.tsx   ← Auth guard con branded loading
│   │   │   └── router.tsx           ← Todas las rutas
│   │   │
│   │   ├── features/                ← Vertical slices por dominio
│   │   │   ├── auth/
│   │   │   │   ├── components/AuthForm.tsx
│   │   │   │   ├── hooks/useAuth.ts
│   │   │   │   ├── store.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── ventures/
│   │   │   │   ├── components/      ← VentureCard, VentureForm, VenturesList, VentureDetail
│   │   │   │   ├── hooks/useVentures.ts
│   │   │   │   ├── store.ts
│   │   │   │   ├── utils.ts         ← calculateROI, breakEven, ventureHealth
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── transactions/
│   │   │   │   ├── components/TransactionForm.tsx
│   │   │   │   ├── hooks/useTransactions.ts
│   │   │   │   └── types.ts
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── components/      ← DashboardView, MetricCard, MonthlyChart, RedVentures
│   │   │   │
│   │   │   └── settings/
│   │   │       └── components/      ← WhatsAppSettings, KeywordsManager
│   │   │
│   │   ├── pages/                   ← Shells: montan features, sin lógica
│   │   │   ├── AuthPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── VenturesPage.tsx
│   │   │   ├── VentureDetailPage.tsx
│   │   │   ├── SettingsWhatsAppPage.tsx
│   │   │   └── SettingsKeywordsPage.tsx
│   │   │
│   │   └── shared/                  ← Utilidades y types (sin componentes UI activos)
│   │       ├── lib/
│   │       │   ├── supabase.ts      ← Cliente Supabase (solo anon key)
│   │       │   ├── formatters.ts    ← formatCurrency, formatDate, formatROI
│   │       │   └── constants.ts     ← Labels de tipos y estados
│   │       └── types/
│   │           └── index.ts         ← Re-exporta desde backend
│   │
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.app.json           ← include: ["src", "../backend/_shared/types.ts"]
│   ├── .env.example                 ← VITE_SUPABASE_URL + ANON_KEY
│   └── package.json
│
├── backend/                         ← Edge Functions — deploy en Supabase
│   └── _shared/
│       ├── types.ts                 ← FUENTE DE VERDAD de todos los tipos
│       ├── cors.ts                  ← CORS helper
│       ├── rateLimit.ts             ← Rate limiting por IP
│       ├── supabaseAdmin.ts         ← service_role key — NUNCA en frontend
│       └── whatsapp.ts              ← Utilidades para WhatsApp API
│
├── supabase/
│   ├── functions/                   ← Edge Functions desplegadas
│   │   ├── ventures/index.ts
│   │   ├── transactions/index.ts
│   │   ├── keywords/index.ts
│   │   ├── whatsapp-config/index.ts
│   │   └── whatsapp-webhook/index.ts
│   └── migrations/
│       ├── 001_ventures.sql
│       ├── 002_transactions.sql
│       ├── 003_household_expenses.sql
│       ├── 004_user_integrations.sql
│       └── 005_whatsapp_keywords.sql
│
├── CLAUDE.md                        ← Este archivo
├── repomix.config.json              ← Genera contexto para agentes
└── package.json                     ← Workspace root
```

---

## Regla de importaciones — Vertical Slice

```
app → pages → features → shared
```

**Nunca importar hacia arriba.** Un feature no importa de otro feature. Si hay lógica compartida, va a `shared/`.

```typescript
// ✓ Correcto
import { Venture } from '../types'          // dentro del mismo feature
import { formatCurrency } from '@/shared/lib/formatters'

// ✗ Prohibido
import { useVentures } from '@/features/ventures/hooks/useVentures'  // cross-feature
```

**Excepción permitida:** `dashboard/` puede importar `calculateROI` desde `ventures/utils.ts` porque dashboard es consumidor de métricas de ventures. No obstante, si más features lo necesitan, mover a `shared/lib/`.

---

## Supabase — Schema completo

### 001_ventures.sql
```sql
create table ventures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  type text check (type in ('software','physical','investment','mixed')) not null,
  status text check (status in ('active','paused','closed','idea')) default 'active',
  invested numeric(12,2) default 0,
  returned numeric(12,2) default 0,
  currency text default 'MXN',
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table ventures enable row level security;

create policy "usuarios ven solo sus ventures"
  on ventures for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### 002_transactions.sql
```sql
create table transactions (
  id uuid primary key default gen_random_uuid(),
  venture_id uuid references ventures(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  type text check (type in ('income','expense')) not null,
  amount numeric(12,2) not null check (amount > 0),
  description text,
  date date not null,
  evidence_url text,
  created_at timestamptz default now()
);

alter table transactions enable row level security;

create policy "usuarios ven solo sus transacciones"
  on transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### 003_household_expenses.sql (Fase 2 — solo schema)
```sql
create table household_expenses (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users not null,
  amount numeric(12,2) not null,
  category text,
  description text,
  split_ratio numeric(3,2) default 0.50 check (split_ratio between 0 and 1),
  date date not null,
  created_at timestamptz default now()
);
```

### 004_user_integrations.sql
```sql
create table user_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  provider text not null,
  config jsonb not null,
  encrypted_token text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, provider)
);
```

### 005_whatsapp_keywords.sql
```sql
create table whatsapp_keywords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  keyword text not null,
  maps_to text check (maps_to in ('income','expense')) not null,
  venture_id uuid references ventures(id) on delete set null,
  created_at timestamptz default now()
);

-- RPC Functions
-- encrypt_token(p_token text, p_key text) returns text
-- decrypt_token(p_encrypted_token text, p_key text) returns text
```

---

## Variables de entorno

| Variable | Ubicación | Acceso |
|----------|-----------|--------|
| `VITE_SUPABASE_URL` | `frontend/.env` | Frontend — pública, protegida por RLS |
| `VITE_SUPABASE_ANON_KEY` | `frontend/.env` | Frontend — pública, protegida por RLS |
| `SUPABASE_URL` | Supabase secrets | Edge Functions únicamente |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase secrets | Edge Functions únicamente — **NUNCA en frontend** |

> El `service_role_key` bypasea RLS. Si llega al frontend, cualquier usuario puede leer todos los datos.

---

## Cálculos de negocio

```typescript
// features/ventures/utils.ts — NUNCA persistir en DB

export const calculateROI = (invested: number, returned: number): number => {
  if (invested === 0) return 0
  return Number(((returned - invested) / invested * 100).toFixed(2))
}

export const breakEven = (invested: number, returned: number): number => {
  return Math.max(0, invested - returned)
}

export type VentureHealth = 'positive' | 'neutral' | 'negative'
export const ventureHealth = (roi: number): VentureHealth => {
  if (roi > 0) return 'positive'
  if (roi === 0) return 'neutral'
  return 'negative'
}
```

---

## Reglas del agente

1. Leer `CLAUDE.md` completo antes de cualquier acción
2. Correr `npm run ctx` para obtener contexto actualizado del código
3. No crear UI de Hogar en Fase 1
4. ROI nunca se persiste — solo se calcula en frontend (`ventures/utils.ts`)
5. Cada cambio a DB requiere su migration SQL versionada
6. No usar `any` en TypeScript
7. `service_role_key` nunca en `frontend/`
8. Un feature = un commit atómico
9. Nunca importar una feature desde otra feature — usar `shared/` si hay lógica común
10. Tipos de dominio solo en `backend/_shared/types.ts`
11. `pages/` son shells: sin lógica propia, solo montan features
12. Cada feature tiene su propio `store.ts` de Zustand — sin store global
13. Todas las peticiones al backend van via `VITE_SUPABASE_URL/functions/v1/{edge-function}`
14. **Crucial:** El JWT de Supabase debe incluirse **manualmente** en `Authorization: Bearer` dentro de las llamadas a `supabase.functions.invoke`, ya que el SDK no lo persiste automáticamente en este método.
15. Seguridad WhatsApp: Webhooks usan HMAC signature verification (Meta standard).

---

## Comandos

```bash
# Frontend
npm run dev          # Levanta frontend en desarrollo (Vite)
npm run build        # Build de producción (tsc + vite build)
npm run lint         # ESLint en todo el monorepo
npm run ctx          # Genera repomix-output.md para agentes

# Supabase
npx supabase start   # DB local para desarrollo
npx supabase db push # Aplica migrations a Supabase producción
npx supabase functions deploy <name>  # Despliega Edge Function
```

---

## Desarrollo y DX (Developer Experience)

- **Editor (VS Code/Cursor):** Se requiere el uso del archivo `.vscode/settings.json` para habilitar el soporte de Deno exclusivamente en `backend/supabase/functions`, evitando errores de tipado falsos en el frontend.
- **Extensiones recomendadas:** `denoland.vscode-deno`.

---

## Checklist MVP — Fase 1

### Setup base
- [x] Monorepo con npm workspaces
- [x] `frontend` — Vite + React + TypeScript
- [x] Tailwind CSS v4
- [x] Path aliases configurados (`@/` → `src/`, `@backend/` → `../backend/`)
- [x] repomix + script `ctx`
- [x] `.gitignore` — bloquea todos los `.env`
- [x] Limpieza de archivos Vite default (App.css, svgs, hero.png)
- [x] Limpieza de MockData y shared/ui no usados
- [x] Configuración `.vscode/settings.json` para Deno support

### Supabase
- [x] Proyecto creado en Supabase
- [x] Migration 001 aplicada (ventures + RLS)
- [x] Migration 002 aplicada (transactions + RLS)
- [x] Migration 003 aplicada (household_expenses — solo tabla)
- [x] Migration 004 aplicada (user_integrations + RLS)
- [x] Migration 005 aplicada (whatsapp_keywords + RLS)
- [x] Edge Functions desplegadas (ventures, transactions, keywords, whatsapp-config, whatsapp-webhook)
- [x] Rate limiting en Edge Functions
- [ ] Supabase Storage bucket para evidencias
- [x] RLS verificado
- [x] Verificación HMAC para WhatsApp Webhook

### Auth
- [x] Pantalla login / registro (monochrome split UI)
- [x] Integración Google OAuth
- [x] Protección de rutas (ProtectedRoute)
- [x] Hook `useAuth` (Zustand + Supabase listener)
- [x] Persistencia de sesión
- [x] Inyección de Authorization Header en `supabase.functions.invoke`

### Módulo Ventures
- [x] Listado de ventures con ROI calculado
- [x] Crear venture (form validado)
- [x] Editar venture
- [x] Detalle de venture con historial de transacciones
- [x] Agregar transacción (income / expense)
- [x] Upload de evidencia (form con file input)

### Dashboard
- [x] 4 métricas globales (cards con animación)
- [x] Indicador ventures en rojo
- [x] Flujo del mes (ingresos vs gastos)
- [x] Historial mensual últimos 6 meses (Recharts bar chart)

### Settings
- [x] WhatsApp API config (token, phone_number_id, verify_token)
- [x] Keywords manager (income/expense con venture opcional)

### Deploy
- [ ] Variables de entorno configuradas en Vercel
- [ ] Deploy automático desde rama `main`

---

## Próximos pasos (por prioridad)

1. **Storage bucket** — Crear bucket `evidence` en Supabase para evidence_url
2. **Deploy Vercel** — Configurar env vars + CI/CD
3. **Hogar (Fase 2)** — UI de gastos compartidos (esquema ya existe)
4. **Webhooks (Fase 3)** — Mercado Pago + Stripe
