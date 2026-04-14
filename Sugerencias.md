# Sugerencias y Roadmap de Préstamos Avanzados

Este documento contiene el plan detallado para la estabilización y expansión del módulo de préstamos, diseñado para ser ejecutado en la siguiente fase de desarrollo.

## 1. Estabilización de Backend (Bugfix)
*   **Problema**: "Fallo la función" reportado por el usuario. Posible error en el manejo de URLs en el hook `useLoans.ts` al invocar `supabase.functions.invoke`.
*   **Acción**: Refactorizar `useLoans.ts` para que pase los parámetros de consulta (`venture_id`, `id`) de forma más robusta, asegurando que coincidan con el router en `backend/supabase/functions/loans/index.ts`.
*   **Depuración**: Añadir logs explícitos en la Edge Function para trazar el `user_id` y los resultados de la consulta, validando por qué el Dashboard podría reportar "sin datos" a pesar de existir registros.

## 2. Soporte de Periodicidad Semanal
*   **Base de Datos**: Añadir columna `periodicity` (`text`, check `monthly` | `weekly`) y `risk_level` (`text`) a la tabla `loans`.
*   **Backend**: Actualizar el bucle de generación automática de pagos en `loans/index.ts`. Si es `weekly`, el intervalo entre `due_date` debe ser de 7 días exactos.
*   **Frontend**: Actualizar `LoanForm.tsx` con un selector de periodicidad.

## 3. Inteligencia de Riesgos (Semáforo)
*   **Lógica**: Crear un "Smart Risk Indicator" en `DashboardLoans.tsx`.
    *   **Verde**: > 7 días para el pago.
    *   **Amarillo**: 2-7 días para el pago.
    *   **Rojo**: < 2 días o pago vencido.
*   **Integración**: Cruzar el `payment_amount` con el `flujo_libre` mensual del usuario. Si la cuota representa > 50% del flujo libre disponible, elevar el nivel de riesgo automáticamente.

## 4. Auditoría y Línea de Tiempo (Ledger)
*   **UI**: Implementar un componente `LoanTimeline` en la vista de detalle de préstamos.
*   **Funcionalidad**: Mostrar una lista cronológica de "eventos":
    1.  Fecha de otorgamiento (Principal).
    2.  Pagos realizados (con fecha real y monto).
    3.  Ajustes o intereses acumulados.
    4.  Saldo insoluto proyectado.

## 5. Refactorización Proactiva (Cumplimiento Regla 21) ✅
*   **Estado**: COMPLETADO (08/04/2026).
*   **Acción**: Se crearon hooks especializados (`useDashboardMetrics`, `useVentureStatus`, `useSmartAlerts`, `useVentureDetail`, `useKeywords`, `useWhatsAppSettings`) y se renombraron las vistas a `.view.tsx`.

## 6. Consolidación de Arquitectura Modular (Vertical Slicing) ✅
*   **Estado**: COMPLETADO (08/04/2026).
*   **Acción**: Centralización de métricas en `shared/lib/metrics.ts` y estandarización de la estructura de carpetas por features. Eliminado el archivo ambigüo `utils.ts`.

## 7. Desacoplamiento de Préstamos y Ventures (Independencia de Slices) ✅
*   **Estado**: COMPLETADO (08/04/2026).
*   **Acción**: `VentureDetail.view.tsx` ahora es un contenedor puramente pasivo de `LoansSection.view.tsx`. Toda la lógica reside en sus respectivos hooks.

## 8. Saneamiento de VentureDetail (Deuda Técnica de Rule 21) ✅
*   **Estado**: COMPLETADO (08/04/2026).
*   **Acción**: Migración de llamadas de API y lógica de métricas al hook `useVentureDetail.ts`.

---
*Nota: Este plan fue extraído del Implementation Plan del 07/04/2026 para continuidad del siguiente agente, incorporando las nuevas directrices de arquitectura del 08/04/2026.*

NUEVAS SUGERENCIAS IMPORTANCIA EN ATENCION CRITICA 

# PLAN_TAREA_V2.md — Finova Evolution
> Versión: 2.0 — Reemplaza PLAN_TAREA.md completamente  
> Generado: Abril 2026  
> Sesión: Categorías dinámicas + Préstamos inteligentes + VPS + Formulario guiado + Detección de anomalías + Sankey  
> Agentes: Gemini (planning/research/diseño) → Claude Opus (construcción) → Claude Sonnet (revisión/auditoría)

---

## Índice

1. [Mapa de dependencias](#1-mapa-de-dependencias)
2. [Decisiones arquitecturales de sesión](#2-decisiones-arquitecturales-de-sesión)
3. [BLOQUE I — Base de datos (ejecutar primero, bloquea todo)](#bloque-i--base-de-datos)
4. [BLOQUE II — Backend Edge Functions](#bloque-ii--backend-edge-functions)
5. [BLOQUE III — Lógica de negocio frontend](#bloque-iii--lógica-de-negocio-frontend)
6. [BLOQUE IV — Interfaces de usuario](#bloque-iv--interfaces-de-usuario)
7. [BLOQUE V — Actualización CLAUDE.md](#bloque-v--actualización-claudemd)
8. [Resumen ejecutivo](#resumen-ejecutivo)

---

## 1. Mapa de dependencias

```
BLOQUE I — DB (todas las migraciones en orden)
│
├── 007_venture_contexts.sql
├── 008_loans_enhanced.sql
└── 009_analytics_baseline.sql
        │
        ▼
BLOQUE II — Edge Functions
│
├── user-settings (categorías + contextos)
├── loans (amortización + instituciones)
└── analytics (z-score + duplicados)
        │
        ▼
BLOQUE III — Lógica frontend
│
├── shared/lib/vps.ts         (índice compuesto de ventures)
├── shared/lib/anomalies.ts   (detección cliente)
└── shared/lib/metrics.ts     (actualizar con ROI ponderado)
        │
        ▼
BLOQUE IV — UI
│
├── TransactionForm (flujo guiado 3 pasos)
├── CategoriesManager (panel settings)
├── VentureCard + VentureDetail (rediseño)
├── LoanForm (inteligente con amortización)
├── SankeyDiagram (visualización de flujo)
└── AnomalyFeed (superficie de alertas)
```

**Regla de ejecución:** No iniciar un bloque si el anterior tiene tareas sin checklist completo. El agente debe verificar cada checklist antes de avanzar.

---

## 2. Decisiones arquitecturales de sesión

Estas decisiones son inamovibles. Si un agente encuentra un conflicto con alguna, debe detenerse y reportar — no resolver silenciosamente.

**D1 — ROI ponderado por capital**
El ROI porcentual puro está prohibido como métrica de prioridad de ventures. Todo ranking usa el Venture Priority Score (VPS) definido en TAREA-III-A. Un venture con $300 invertidos y 400% ROI nunca puede aparecer por encima de uno con $100,000 y 100% ROI.

**D2 — Formulario de transacciones en 3 pasos**
El `TransactionForm.tsx` actual se reemplaza completamente. El flujo nuevo es: tipo de movimiento → detalles contextuales → confirmación con impacto. No hay regresión al form plano.

**D3 — Categorías con contexto obligatorio al guardar**
A partir de esta versión, el campo `category_id` en transacciones nuevas es recomendado con nudge visual. No es bloqueante (para no romper el flujo de WhatsApp), pero el form guiado no permite avanzar al paso 3 sin categoría seleccionada.

**D4 — Anomalías detectadas en DB, surfaceadas en frontend**
El cálculo de z-score y detección de duplicados ocurre en una Edge Function (`analytics`), no en el cliente. El frontend solo consume y renderiza. Esto garantiza que la detección funcione también cuando llegan transacciones vía WhatsApp.

**D5 — Sankey requiere datos limpios**
El componente Sankey solo renderiza si el venture tiene al menos el 70% de sus transacciones con categoría asignada. Si no llega al umbral, muestra un estado vacío con CTA para categorizar transacciones pendientes.

**D6 — VPS nunca se persiste en DB**
Igual que el ROI, el VPS se calcula siempre en frontend desde los datos crudos. Nunca en una columna de la tabla `ventures`.

---

## BLOQUE I — Base de datos

> Agente: Claude Opus  
> Prerequisito: ninguno  
> Ejecutar en orden estricto: 007 → 008 → 009

---

### TAREA I-A — Migration 007: Sistema de contextos y categorías dinámicas

**Archivo:** `supabase/migrations/007_venture_contexts.sql`  
**Tiempo estimado:** 45 min

```sql
-- ═══════════════════════════════════════════════════════════════════
-- 007_venture_contexts.sql
-- Sistema de contextos de venture y categorías dinámicas
-- Prerequisito: 001-006 aplicadas
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. Contextos de venture ──────────────────────────────────────────
CREATE TABLE venture_contexts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        REFERENCES auth.users ON DELETE CASCADE,
  -- NULL = contexto del sistema, no editable por usuario
  name        TEXT        NOT NULL,
  slug        TEXT        NOT NULL,
  description TEXT,
  icon        TEXT,
  color       TEXT,
  is_system   BOOLEAN     DEFAULT FALSE,
  sort_order  INT         DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, slug)
);

ALTER TABLE venture_contexts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ver contextos sistema y propios"
  ON venture_contexts FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "gestionar contextos propios"
  ON venture_contexts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND is_system = FALSE);


-- ── 2. Enriquecer transaction_categories ────────────────────────────
ALTER TABLE transaction_categories
  ADD COLUMN IF NOT EXISTS context_slugs         TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS scope                 TEXT    DEFAULT 'global'
    CHECK (scope IN ('global', 'venture_specific')),
  ADD COLUMN IF NOT EXISTS transaction_direction TEXT    DEFAULT 'both'
    CHECK (transaction_direction IN ('income', 'expense', 'both')),
  ADD COLUMN IF NOT EXISTS is_system             BOOLEAN DEFAULT FALSE;

-- Marcar categorías existentes como sistema
UPDATE transaction_categories SET is_system = TRUE WHERE user_id IS NULL;


-- ── 3. Asignación por venture ────────────────────────────────────────
CREATE TABLE venture_category_assignments (
  venture_id  UUID REFERENCES ventures(id)               ON DELETE CASCADE,
  category_id UUID REFERENCES transaction_categories(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (venture_id, category_id)
);

ALTER TABLE venture_category_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gestionar asignaciones de ventures propios"
  ON venture_category_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM ventures v
      WHERE v.id = venture_id AND v.user_id = auth.uid()
    )
  );


-- ── 4. Conectar ventures con contextos ──────────────────────────────
ALTER TABLE ventures
  ADD COLUMN IF NOT EXISTS context_id UUID
    REFERENCES venture_contexts(id) ON DELETE SET NULL;


-- ── 5. Seed de contextos del sistema ────────────────────────────────
INSERT INTO venture_contexts
  (user_id, name, slug, description, icon, color, is_system, sort_order)
VALUES
  (NULL, 'Hogar / Personal',       'personal',   'Presupuesto del hogar y finanzas personales',              '#', '#6366f1', TRUE, 1),
  (NULL, 'Negocio Fisico',         'physical',   'Tienda, restaurante, taller o presencia fisica',           '#', '#f59e0b', TRUE, 2),
  (NULL, 'Software / Digital',     'software',   'Producto digital, SaaS, agencia o negocio en linea',      '#', '#3b82f6', TRUE, 3),
  (NULL, 'Inversion / Portafolio', 'investment', 'Activos financieros, inmuebles, instrumentos de inversion','#', '#10b981', TRUE, 4),
  (NULL, 'Freelance / Servicios',  'freelance',  'Servicios profesionales, consultoria, trabajo independiente','#', '#8b5cf6', TRUE, 5);


-- ── 6. Seed de categorías del sistema ───────────────────────────────
INSERT INTO transaction_categories
  (name, accounting_type, icon, is_system, context_slugs, transaction_direction)
VALUES
  -- Ingresos
  ('Salario',                'income',  '#', TRUE, '{personal,freelance}',         'income'),
  ('Ingreso freelance',      'income',  '#', TRUE, '{personal,freelance}',         'income'),
  ('Renta cobrada',          'income',  '#', TRUE, '{personal,investment}',        'income'),
  ('Dividendos',             'income',  '#', TRUE, '{investment}',                 'income'),
  ('Plusvalia realizada',    'income',  '#', TRUE, '{investment}',                 'income'),
  ('Intereses ganados',      'income',  '#', TRUE, '{investment,personal}',        'income'),
  ('Ventas',                 'income',  '#', TRUE, '{physical,software}',          'income'),
  ('Suscripciones',          'income',  '#', TRUE, '{software}',                   'income'),
  ('Licencias',              'income',  '#', TRUE, '{software}',                   'income'),
  ('Servicios prestados',    'income',  '#', TRUE, '{physical,freelance}',         'income'),
  ('Consultoria',            'income',  '#', TRUE, '{freelance,software}',         'income'),
  ('Proyectos',              'income',  '#', TRUE, '{freelance,software}',         'income'),
  ('Transferencia recibida', 'income',  '#', TRUE, '{personal}',                   'income'),
  -- Gastos hogar
  ('Renta / Hipoteca',       'expense', '#', TRUE, '{personal}',                   'expense'),
  ('Despensa',               'expense', '#', TRUE, '{personal}',                   'expense'),
  ('Servicios basicos',      'expense', '#', TRUE, '{personal,physical}',          'expense'),
  ('Internet / Telefono',    'expense', '#', TRUE, '{personal,software,physical}', 'expense'),
  ('Transporte',             'expense', '#', TRUE, '{personal,physical}',          'expense'),
  ('Salud',                  'expense', '#', TRUE, '{personal}',                   'expense'),
  ('Educacion',              'expense', '#', TRUE, '{personal}',                   'expense'),
  ('Entretenimiento',        'expense', '#', TRUE, '{personal}',                   'expense'),
  ('Seguro medico',          'expense', '#', TRUE, '{personal}',                   'expense'),
  -- Gastos negocio fisico
  ('Renta del local',        'expense', '#', TRUE, '{physical}',                   'expense'),
  ('Inventario / Mercancia', 'capital', '#', TRUE, '{physical}',                   'expense'),
  ('Materia prima',          'capital', '#', TRUE, '{physical}',                   'expense'),
  ('Nomina',                 'expense', '#', TRUE, '{physical}',                   'expense'),
  ('Mantenimiento',          'expense', '#', TRUE, '{physical}',                   'expense'),
  ('Publicidad local',       'expense', '#', TRUE, '{physical}',                   'expense'),
  ('Permisos / Licencias op','expense', '#', TRUE, '{physical}',                   'expense'),
  -- Gastos software
  ('Hosting / Servidores',   'expense', '#', TRUE, '{software}',                   'expense'),
  ('Dominios',               'expense', '#', TRUE, '{software}',                   'expense'),
  ('APIs externas',          'expense', '#', TRUE, '{software}',                   'expense'),
  ('Herramientas SaaS',      'expense', '#', TRUE, '{software}',                   'expense'),
  ('Ads Meta / Google',      'expense', '#', TRUE, '{software,physical}',          'expense'),
  ('Freelancers / Equipo',   'expense', '#', TRUE, '{software,freelance}',         'expense'),
  ('Cursos tecnicos',        'expense', '#', TRUE, '{software,freelance}',         'expense'),
  -- Gastos inversion
  ('Comisiones broker',      'expense', '#', TRUE, '{investment}',                 'expense'),
  ('Impuesto sobre ganancia','expense', '#', TRUE, '{investment}',                 'expense'),
  ('Mantenimiento de activo','expense', '#', TRUE, '{investment}',                 'expense'),
  -- Gastos freelance
  ('Software profesional',   'expense', '#', TRUE, '{freelance}',                  'expense'),
  ('Equipo de trabajo',      'capital', '#', TRUE, '{freelance,software}',         'expense'),
  ('Coworking',              'expense', '#', TRUE, '{freelance}',                  'expense'),
  ('Impuestos ISR / IVA',    'expense', '#', TRUE, '{freelance,software}',         'expense'),
  -- Capital universal
  ('Inversion de capital',   'capital', '#', TRUE, '{}',                           'expense'),
  ('Reinversion',            'capital', '#', TRUE, '{}',                           'expense');
```

**Checklist TAREA I-A:**
- [ ] Tabla `venture_contexts` creada con RLS
- [ ] Columnas nuevas en `transaction_categories` sin errores
- [ ] Tabla `venture_category_assignments` creada con RLS
- [ ] Columna `context_id` agregada a `ventures` como nullable
- [ ] 5 contextos del sistema insertados con `user_id IS NULL`
- [ ] Categorías del sistema insertadas con `is_system = TRUE`
- [ ] Ventures existentes no se rompen (context_id nullable)

---

### TAREA I-B — Migration 008: Préstamos inteligentes

**Archivo:** `supabase/migrations/008_loans_enhanced.sql`  
**Tiempo estimado:** 45 min

```sql
-- ═══════════════════════════════════════════════════════════════════
-- 008_loans_enhanced.sql
-- Catálogo de instituciones financieras y amortización real
-- Prerequisito: 006_loans.sql aplicada
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. Catálogo de instituciones ────────────────────────────────────
CREATE TABLE loan_institutions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  short_name  TEXT,
  loan_type   TEXT        NOT NULL
    CHECK (loan_type IN ('credit_card','personal','mortgage','auto','business','family')),
  apr_min     NUMERIC(5,2),
  apr_max     NUMERIC(5,2),
  cat_approx  NUMERIC(5,2),
  is_active   BOOLEAN     DEFAULT TRUE,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE loan_institutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "catalogo de instituciones publico de lectura"
  ON loan_institutions FOR SELECT TO authenticated USING (TRUE);


-- ── 2. Seed del catálogo (tasas referenciales Q1 2026, CONDUSEF) ────
INSERT INTO loan_institutions (name, short_name, loan_type, apr_min, apr_max, cat_approx, notes) VALUES
  ('Banamex Clasica',           'Banamex',   'credit_card', 36.0,  89.0,  71.0, 'Tasa variable segun historial'),
  ('BBVA Azul',                 'BBVA',      'credit_card', 29.0,  79.0,  66.0, NULL),
  ('Santander Zero',            'Santander', 'credit_card', 28.0,  75.0,  62.0, 'Sin anualidad'),
  ('Nu Mexico',                 'Nu',        'credit_card', 29.0,  59.0,  45.0, 'Tasa mas baja del mercado 2026'),
  ('HSBC Classic',              'HSBC',      'credit_card', 35.0,  85.0,  68.0, NULL),
  ('Banorte Clasica',           'Banorte',   'credit_card', 30.0,  80.0,  64.0, NULL),
  ('American Express Gold',     'Amex',      'credit_card', 25.0,  60.0,  48.0, 'Requiere historial solido'),
  ('Kueski Pay',                'Kueski',    'personal',    36.0, 120.0,  95.0, 'Accesible pero tasa alta'),
  ('Konfio',                    'Konfio',    'personal',    24.0,  60.0,  45.0, 'Enfocado en PyMEs'),
  ('Banamex Prestamo Personal', 'Banamex',   'personal',    18.0,  45.0,  35.0, NULL),
  ('BBVA Prestamo Personal',    'BBVA',      'personal',    16.0,  40.0,  32.0, NULL),
  ('Prestamo familiar',         'Personal',  'family',       0.0,   0.0,   0.0, 'Sin tasa formal'),
  ('INFONAVIT',                 'INFONAVIT', 'mortgage',     8.0,  12.0,   9.5, 'Solo trabajadores formales'),
  ('FOVISSSTE',                 'FOVISSSTE', 'mortgage',     6.0,  10.0,   8.0, 'Solo empleados gobierno'),
  ('BBVA Hipoteca',             'BBVA',      'mortgage',    10.5,  13.5,  12.0, 'Tasa fija disponible'),
  ('Banamex Hipoteca',          'Banamex',   'mortgage',    10.0,  13.0,  11.5, NULL),
  ('BBVA Auto',                 'BBVA',      'auto',        12.0,  18.0,  15.0, NULL),
  ('Banamex Auto',              'Banamex',   'auto',        11.0,  17.0,  14.0, NULL),
  ('Konfio PyME',               'Konfio',    'business',    24.0,  55.0,  40.0, 'Hasta 3M MXN'),
  ('BBVA Credito PyME',         'BBVA',      'business',    18.0,  45.0,  35.0, NULL),
  ('NAFIN',                     'NAFIN',     'business',    10.0,  25.0,  18.0, 'Requiere aval o garantia');


-- ── 3. Enriquecer tabla loans ────────────────────────────────────────
ALTER TABLE loans
  ADD COLUMN IF NOT EXISTS loan_type           TEXT DEFAULT 'personal'
    CHECK (loan_type IN ('credit_card','personal','mortgage','auto','business','family')),
  ADD COLUMN IF NOT EXISTS institution_id      UUID REFERENCES loan_institutions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS amortization_type   TEXT DEFAULT 'french'
    CHECK (amortization_type IN ('french','revolving','bullet','custom')),
  ADD COLUMN IF NOT EXISTS payment_frequency   TEXT DEFAULT 'monthly'
    CHECK (payment_frequency IN ('weekly','biweekly','monthly')),
  ADD COLUMN IF NOT EXISTS minimum_payment_pct NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS current_balance     NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS credit_limit        NUMERIC(12,2);


-- ── 4. Enriquecer loan_payments con desglose de amortización ─────────
ALTER TABLE loan_payments
  ADD COLUMN IF NOT EXISTS principal_portion NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS interest_portion  NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS balance_after     NUMERIC(12,2);


-- ── 5. Función SQL: amortización francesa ───────────────────────────
CREATE OR REPLACE FUNCTION calculate_french_amortization(
  p_principal    NUMERIC,
  p_annual_rate  NUMERIC,
  p_periods      INT,
  p_start_date   DATE,
  p_frequency    TEXT DEFAULT 'monthly'
)
RETURNS TABLE (
  period           INT,
  due_date         DATE,
  payment_amount   NUMERIC,
  principal_part   NUMERIC,
  interest_part    NUMERIC,
  balance_after    NUMERIC
) AS $$
DECLARE
  v_rate         NUMERIC;
  v_periods_year INT;
  v_payment      NUMERIC;
  v_balance      NUMERIC   := p_principal;
  v_date         DATE      := p_start_date;
  v_interval     INTERVAL;
BEGIN
  v_periods_year := CASE p_frequency
    WHEN 'weekly'   THEN 52
    WHEN 'biweekly' THEN 26
    ELSE 12
  END;
  v_interval := CASE p_frequency
    WHEN 'weekly'   THEN INTERVAL '1 week'
    WHEN 'biweekly' THEN INTERVAL '2 weeks'
    ELSE INTERVAL '1 month'
  END;

  v_rate := (p_annual_rate / 100.0) / v_periods_year;

  IF v_rate = 0 THEN
    v_payment := ROUND(p_principal / p_periods, 2);
  ELSE
    v_payment := ROUND(
      p_principal * (v_rate * POWER(1 + v_rate, p_periods))
                  / (POWER(1 + v_rate, p_periods) - 1),
      2
    );
  END IF;

  FOR i IN 1..p_periods LOOP
    v_date        := v_date + v_interval;
    interest_part  := ROUND(v_balance * v_rate, 2);
    principal_part := LEAST(v_payment - interest_part, v_balance);
    payment_amount := interest_part + principal_part;
    v_balance      := GREATEST(v_balance - principal_part, 0);
    period         := i;
    due_date       := v_date;
    balance_after  := v_balance;
    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

**Checklist TAREA I-B:**
- [ ] Tabla `loan_institutions` creada con RLS de solo lectura
- [ ] 21 instituciones insertadas en el catálogo
- [ ] Columnas nuevas en `loans` sin romper préstamos existentes
- [ ] Columnas de desglose en `loan_payments`
- [ ] Función `calculate_french_amortization` creada y testeable con `SELECT`

---

### TAREA I-C — Migration 009: Base estadística para detección de anomalías

**Archivo:** `supabase/migrations/009_analytics_baseline.sql`  
**Tiempo estimado:** 30 min

```sql
-- ═══════════════════════════════════════════════════════════════════
-- 009_analytics_baseline.sql
-- Tablas y funciones para detección de anomalías financieras
-- Prerequisito: 007 y 008 aplicadas
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. Tabla de baseline estadístico por categoría/usuario ──────────
-- Se actualiza via Edge Function analytics al detectar anomalías
-- Evita recalcular estadísticas históricas en cada request
CREATE TABLE category_stats (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  category_id     UUID        REFERENCES transaction_categories(id) ON DELETE CASCADE,
  venture_id      UUID        REFERENCES ventures(id) ON DELETE CASCADE,
  -- NULL venture_id = estadísticas globales del usuario para esa categoría
  period_months   INT         DEFAULT 6,
  -- Cuántos meses de historial se usaron para calcular estas stats
  mean_amount     NUMERIC(12,2),
  std_dev         NUMERIC(12,2),
  median_amount   NUMERIC(12,2),
  sample_count    INT,
  last_calculated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, category_id, venture_id)
);

ALTER TABLE category_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios ven solo sus stats"
  ON category_stats FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── 2. Tabla de anomalías detectadas ────────────────────────────────
CREATE TABLE anomaly_log (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  transaction_id  UUID        REFERENCES transactions(id) ON DELETE CASCADE,
  venture_id      UUID        REFERENCES ventures(id) ON DELETE SET NULL,
  anomaly_type    TEXT        NOT NULL
    CHECK (anomaly_type IN (
      'high_spend',       -- gasto inusualmente alto en categoría
      'low_income',       -- ingreso inusualmente bajo
      'flow_drop',        -- caída brusca de flujo mensual
      'flow_spike',       -- subida brusca de flujo mensual
      'duplicate',        -- transacción posiblemente duplicada
      'category_shift'    -- categoría nueva sin historial
    )),
  severity        TEXT        DEFAULT 'warning'
    CHECK (severity IN ('info','warning','critical')),
  z_score         NUMERIC(6,2),
  -- z > 2 = warning, z > 3 = critical
  description     TEXT        NOT NULL,
  related_tx_id   UUID        REFERENCES transactions(id) ON DELETE SET NULL,
  -- Para duplicados: ID de la transacción original
  is_dismissed    BOOLEAN     DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE anomaly_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios ven solo sus anomalias"
  ON anomaly_log FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_anomaly_log_user_created
  ON anomaly_log (user_id, created_at DESC);

CREATE INDEX idx_anomaly_log_venture
  ON anomaly_log (venture_id, created_at DESC);


-- ── 3. Función SQL: calcular z-score de una transacción ─────────────
CREATE OR REPLACE FUNCTION get_transaction_zscore(
  p_user_id     UUID,
  p_category_id UUID,
  p_amount      NUMERIC,
  p_venture_id  UUID DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
  v_mean   NUMERIC;
  v_stddev NUMERIC;
BEGIN
  SELECT mean_amount, std_dev
  INTO   v_mean, v_stddev
  FROM   category_stats
  WHERE  user_id    = p_user_id
    AND  category_id = p_category_id
    AND  (venture_id = p_venture_id OR (venture_id IS NULL AND p_venture_id IS NULL));

  IF v_mean IS NULL OR v_stddev IS NULL OR v_stddev = 0 THEN
    RETURN NULL; -- Sin historial suficiente, no hay z-score
  END IF;

  RETURN ROUND((p_amount - v_mean) / v_stddev, 2);
END;
$$ LANGUAGE plpgsql;


-- ── 4. Función SQL: detectar duplicados en ventana temporal ─────────
CREATE OR REPLACE FUNCTION find_potential_duplicate(
  p_user_id    UUID,
  p_venture_id UUID,
  p_type       TEXT,
  p_amount     NUMERIC,
  p_date       DATE,
  p_hours_window INT DEFAULT 72
)
RETURNS UUID AS $$
DECLARE
  v_duplicate_id UUID;
BEGIN
  SELECT id INTO v_duplicate_id
  FROM   transactions
  WHERE  user_id    = p_user_id
    AND  venture_id = p_venture_id
    AND  type       = p_type
    AND  amount     = p_amount
    AND  ABS(EXTRACT(EPOCH FROM (created_at - NOW())) / 3600) <= p_hours_window
  ORDER BY created_at DESC
  LIMIT 1;

  RETURN v_duplicate_id;
END;
$$ LANGUAGE plpgsql;


-- ── 5. Vista: anomalías activas del usuario ──────────────────────────
CREATE OR REPLACE VIEW active_anomalies AS
SELECT
  a.id,
  a.user_id,
  a.transaction_id,
  a.venture_id,
  v.name          AS venture_name,
  a.anomaly_type,
  a.severity,
  a.z_score,
  a.description,
  a.related_tx_id,
  a.created_at,
  t.amount        AS transaction_amount,
  t.date          AS transaction_date,
  c.name          AS category_name
FROM   anomaly_log a
LEFT JOIN ventures      v ON v.id = a.venture_id
LEFT JOIN transactions  t ON t.id = a.transaction_id
LEFT JOIN transaction_categories c ON c.id = (
  SELECT category_id FROM transactions WHERE id = a.transaction_id
)
WHERE  a.is_dismissed = FALSE
ORDER BY
  CASE a.severity WHEN 'critical' THEN 1 WHEN 'warning' THEN 2 ELSE 3 END,
  a.created_at DESC;
```

**Checklist TAREA I-C:**
- [ ] Tabla `category_stats` creada con RLS e índice único
- [ ] Tabla `anomaly_log` creada con RLS e índices de búsqueda
- [ ] Función `get_transaction_zscore` creada y retorna NULL correctamente cuando no hay historial
- [ ] Función `find_potential_duplicate` creada y testeable
- [ ] Vista `active_anomalies` creada y consultable

---

## BLOQUE II — Backend Edge Functions

> Agente: Claude Opus  
> Prerequisito: BLOQUE I completo

---

### TAREA II-A — Edge Function: user-settings (extensión con categorías y contextos)

**Archivo:** `backend/supabase/functions/user-settings/index.ts`  
**Tiempo estimado:** 1.5h

Agregar tres secciones nuevas al handler existente:

**GET /user-settings/contexts**
Retorna contextos del sistema (user_id IS NULL) + los del usuario autenticado, ordenados por sort_order.

**POST /user-settings/contexts**
Crea un contexto personalizado. Validaciones:
- `name` requerido, máximo 50 chars
- `slug` requerido, solo letras minúsculas, números y guión bajo
- `is_system` siempre FALSE — el agente debe forzarlo, no confiar en el body
- Setear `user_id = auth.uid()` siempre

**DELETE /user-settings/contexts/:id**
Solo permite eliminar contextos propios (`user_id = auth.uid()`). Si el contexto tiene ventures asignados, retornar error 409 con mensaje descriptivo.

**GET /user-settings/categories?context_slug=X&direction=Y**
Retorna categorías del sistema + las del usuario. Lógica de filtrado:
```
Si context_slug presente:
  WHERE context_slugs @> ARRAY[context_slug]
     OR context_slugs = '{}'  ← vacío = aplica a todos
Si direction presente:
  WHERE transaction_direction = direction
     OR transaction_direction = 'both'
Ordenar por: accounting_type ASC, name ASC
```

**POST /user-settings/categories**
Crea categoría personalizada del usuario. Validaciones:
- `name` requerido, máximo 50 chars
- `accounting_type` debe ser `'income' | 'expense' | 'capital'`
- `transaction_direction` debe ser `'income' | 'expense' | 'both'`
- `context_slugs` array de strings (puede ser vacío)
- Siempre setear `user_id = auth.uid()`, `is_system = FALSE`

**PUT /user-settings/categories/:id**
Solo permite editar categorías propias. Las de sistema retornan 403.

**DELETE /user-settings/categories/:id**
Solo permite eliminar propias y no-sistema. Verificar que no tenga transacciones asociadas antes de eliminar — si las tiene, retornar 409.

---

### TAREA II-B — Edge Function: loans (extensión con inteligencia)

**Archivo:** `backend/supabase/functions/loans/index.ts`  
**Tiempo estimado:** 1.5h

**Nuevo endpoint: GET /loans/institutions?type=X**
Retorna instituciones filtradas por `loan_type`, ordenadas por `cat_approx ASC`. Sin autenticación requerida más allá de la sesión base.

**Modificación en POST /loans:**
Al crear un préstamo con `amortization_type = 'french'`:
1. Llamar a `calculate_french_amortization()` via `supabase.rpc()`
2. Insertar todos los `loan_payments` generados con `principal_portion`, `interest_portion`, `balance_after` del resultado de la función
3. El response incluye el préstamo + array `amortization_summary` con: cuota mensual, total a pagar, total intereses, número de pagos

Para `amortization_type = 'revolving'`:
- No generar loan_payments automáticos
- Guardar `current_balance`, `credit_limit`, `minimum_payment_pct` del body
- Retornar el préstamo con estos campos

---

### TAREA II-C — Edge Function: analytics (nueva)

**Archivo:** `backend/supabase/functions/analytics/index.ts`  
**Tiempo estimado:** 2h

Esta Edge Function tiene dos responsabilidades: actualizar estadísticas baseline y detectar anomalías.

**POST /analytics/baseline/recalculate**
Recalcula `category_stats` para el usuario autenticado basado en los últimos 6 meses de transacciones. Llamar después de que el usuario categorice transacciones retroactivas o cuando `sample_count < 5` (historial insuficiente).

Lógica:
```typescript
// Para cada combinación única de (user_id, category_id, venture_id)
// en transactions de los últimos 6 meses:
const stats = await supabase.rpc('calculate_category_stats', {
  p_user_id: user.id,
  p_months: 6
})
// Upsert en category_stats
```

**POST /analytics/detect**
Llamado automáticamente desde la Edge Function `transactions` al crear una transacción nueva. Body: `{ transaction_id }`.

Lógica de detección en orden:

```typescript
// 1. Verificar duplicado
const duplicateId = await supabase.rpc('find_potential_duplicate', {
  p_user_id:    user.id,
  p_venture_id: tx.venture_id,
  p_type:       tx.type,
  p_amount:     tx.amount,
  p_date:       tx.date,
  p_hours_window: 72
})
if (duplicateId) {
  // Insertar anomaly_log tipo 'duplicate', severity 'critical'
  // related_tx_id = duplicateId
}

// 2. Calcular z-score si hay categoría y historial suficiente
if (tx.category_id) {
  const zscore = await supabase.rpc('get_transaction_zscore', {
    p_user_id:     user.id,
    p_category_id: tx.category_id,
    p_amount:      tx.amount,
    p_venture_id:  tx.venture_id
  })
  if (zscore !== null) {
    if (zscore > 3.0) {
      // anomaly_log: high_spend, severity 'critical'
    } else if (zscore > 2.0) {
      // anomaly_log: high_spend, severity 'warning'
    } else if (zscore < -2.0 && tx.type === 'income') {
      // anomaly_log: low_income, severity 'warning'
    }
  }
}

// 3. Detectar caída/subida brusca de flujo mensual
// Comparar flujo del mes actual vs mediana de últimos 6 meses
// Si delta > 40% en cualquier dirección: flow_drop o flow_spike
```

**GET /analytics/anomalies?venture_id=X&dismissed=false**
Retorna anomalías activas del usuario desde la vista `active_anomalies`. Filtros opcionales por venture y dismissed.

**PUT /analytics/anomalies/:id/dismiss**
Marca una anomalía como descartada (`is_dismissed = TRUE`).

**Integración con Edge Function transactions:**
Al final del handler POST de `transactions/index.ts`, agregar llamada asíncrona a analytics:
```typescript
// Fire-and-forget — no bloquear el response al usuario
supabase.functions.invoke('analytics', {
  method: 'POST',
  body: { action: 'detect', transaction_id: data.id },
  headers: { Authorization: authHeader }
}).catch(err => console.error('[Tx] Analytics detection failed:', err))
```

**Checklist TAREA II-C:**
- [ ] Edge Function `analytics` desplegada
- [ ] Endpoint `POST /analytics/detect` funcional
- [ ] Endpoint `GET /analytics/anomalies` retorna datos de la vista correctamente
- [ ] Integración en `transactions/index.ts` sin bloquear el response
- [ ] Duplicados detectados en test manual con dos transacciones iguales en 72h

---

## BLOQUE III — Lógica de negocio frontend

> Agente: Claude Opus  
> Prerequisito: BLOQUE II completo  
> Regla: Ningún archivo `.view.tsx` — toda lógica en hooks o utils

---

### TAREA III-A — Venture Priority Score (VPS)

**Archivo nuevo:** `frontend/src/shared/lib/vps.ts`

```typescript
// frontend/src/shared/lib/vps.ts
// Venture Priority Score — índice compuesto de prioridad
// NUNCA persistir en DB — calcular siempre desde datos crudos
// Reemplaza el ordenamiento por ROI puro en toda la app

import type { Venture, Transaction } from '@backend/_shared/types'

export interface VPSResult {
  ventureId:        string
  score:            number         // 0.0 - 1.0
  rank:             number         // posición en el portafolio
  roiWeighted:      number         // componente ROI ponderado
  capitalScore:     number         // componente capital
  flowScore:        number         // componente flujo mensual
  maturityScore:    number         // componente madurez
  interpretation:   string         // texto accionable para el usuario
  warningReason:    string | null  // si un venture de alto ROI tiene capital bajo
}

export interface VPSConfig {
  weightROI:      number  // default 0.35
  weightCapital:  number  // default 0.30
  weightFlow:     number  // default 0.25
  weightMaturity: number  // default 0.10
}

const DEFAULT_CONFIG: VPSConfig = {
  weightROI:      0.35,
  weightCapital:  0.30,
  weightFlow:     0.25,
  weightMaturity: 0.10,
}

export function calculateVPS(
  ventures:     Venture[],
  transactions: Transaction[],
  config:       VPSConfig = DEFAULT_CONFIG
): VPSResult[] {
  const activeVentures = ventures.filter(v =>
    v.status === 'active' || v.status === 'paused'
  )

  if (activeVentures.length === 0) return []

  const totalPortfolioCapital = activeVentures.reduce(
    (sum, v) => sum + v.invested, 0
  )

  const now = new Date()

  // ── Componente 1: ROI ponderado por capital ──────────────────────
  // El logaritmo amortigua diferencias extremas de capital sin eliminarlas
  const roiWeightedValues = activeVentures.map(v => {
    const roi = v.invested === 0 ? 0
      : ((v.returned - v.invested) / v.invested) * 100
    return roi * Math.log10(Math.max(v.invested, 1))
  })

  // ── Componente 2: Capital score ──────────────────────────────────
  const capitalValues = activeVentures.map(v =>
    totalPortfolioCapital > 0 ? v.invested / totalPortfolioCapital : 0
  )

  // ── Componente 3: Flujo libre promedio (últimos 3 meses) ─────────
  const flowValues = activeVentures.map(v => {
    let totalFlow = 0
    for (let i = 1; i <= 3; i++) {
      const d   = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const monthTx = transactions.filter(t =>
        t.venture_id === v.id && t.date.startsWith(key)
      )
      totalFlow += monthTx.reduce(
        (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0
      )
    }
    return totalFlow / 3  // promedio mensual
  })

  // ── Componente 4: Madurez (satura en 12 meses) ──────────────────
  const maturityValues = activeVentures.map(v => {
    const days   = Math.ceil(
      Math.abs(now.getTime() - new Date(v.start_date).getTime())
      / (1000 * 60 * 60 * 24)
    )
    const months = days / 30
    return Math.min(months / 12, 1)
  })

  // ── Normalizar cada componente a [0, 1] ──────────────────────────
  const normalize = (values: number[]): number[] => {
    const min = Math.min(...values)
    const max = Math.max(...values)
    if (max === min) return values.map(() => 0.5)
    return values.map(v => (v - min) / (max - min))
  }

  const roiNorm      = normalize(roiWeightedValues)
  const capitalNorm  = normalize(capitalValues)
  const flowNorm     = normalize(flowValues)
  const maturityNorm = normalize(maturityValues)

  // ── Calcular VPS final y ordenar ────────────────────────────────
  const scores = activeVentures.map((v, i) => ({
    ventureId:    v.id,
    score: (
      roiNorm[i]      * config.weightROI +
      capitalNorm[i]  * config.weightCapital +
      flowNorm[i]     * config.weightFlow +
      maturityNorm[i] * config.weightMaturity
    ),
    roiWeighted:  roiNorm[i],
    capitalScore: capitalNorm[i],
    flowScore:    flowNorm[i],
    maturityScore: maturityNorm[i],
    rawCapital:   v.invested,
    rawROI:       v.invested === 0 ? 0
      : ((v.returned - v.invested) / v.invested) * 100,
  }))
  .sort((a, b) => b.score - a.score)

  // ── Generar interpretación accionable ───────────────────────────
  return scores.map((s, idx) => {
    const venture = activeVentures.find(v => v.id === s.ventureId)!

    let interpretation = ''
    let warningReason: string | null = null

    if (s.rawROI > 100 && s.capitalScore < 0.1) {
      warningReason = `ROI alto (${s.rawROI.toFixed(0)}%) pero capital marginal ($${s.rawCapital.toLocaleString('es-MX')}). Impacto real en el portafolio es menor.`
    }

    if (idx === 0) {
      interpretation = `Venture de mayor impacto real en el portafolio.`
    } else if (s.flowScore < 0.2) {
      interpretation = `Capital activo pero sin flujo reciente. Revisar actividad.`
    } else if (s.maturityScore < 0.25) {
      interpretation = `Venture nuevo. Datos insuficientes para evaluacion definitiva.`
    } else {
      interpretation = `Rendimiento estable. Mantener seguimiento mensual.`
    }

    return {
      ventureId:      s.ventureId,
      score:          Number(s.score.toFixed(3)),
      rank:           idx + 1,
      roiWeighted:    Number(s.roiWeighted.toFixed(3)),
      capitalScore:   Number(s.capitalScore.toFixed(3)),
      flowScore:      Number(s.flowScore.toFixed(3)),
      maturityScore:  Number(s.maturityScore.toFixed(3)),
      interpretation,
      warningReason,
    }
  })
}
```

**Actualizar `shared/lib/metrics.ts`:**
Agregar `calculateROIWeighted` para uso interno del VPS:
```typescript
// ROI puro sigue existiendo — se usa para mostrar % al usuario
// VPS usa la versión ponderada internamente
export const calculateROIWeighted = (invested: number, returned: number): number => {
  const roi = calculateROI(invested, returned)
  return roi * Math.log10(Math.max(invested, 1))
}
```

**Actualizar `useVentureStatus.ts`:**
Reemplazar el ordenamiento actual por `calculateVPS`. El hook retorna `ventureData` ordenado por VPS score descendente, no por ROI puro.

**Actualizar `VentureROIChart.tsx`:**
El chart de ranking debe ordenarse por VPS, no por ROI. Agregar tooltip que explica el `warningReason` cuando existe.

**Checklist TAREA III-A:**
- [ ] `vps.ts` creado en `shared/lib/`
- [ ] Tipos `VPSResult` y `VPSConfig` agregados a `backend/_shared/types.ts`
- [ ] `useVentureStatus.ts` usa VPS para ordenar
- [ ] `VentureROIChart` ordena por VPS
- [ ] Test manual: venture $300/400% ROI aparece por debajo de venture $100k/100% ROI

---

### TAREA III-B — Hook de anomalías

**Archivo nuevo:** `frontend/src/features/dashboard/hooks/useAnomalies.ts`

```typescript
// Hook para consumir anomalías desde la Edge Function analytics
// Integrar con useSmartAlerts para unificar superficie de alertas

export function useAnomalies(ventureId?: string) {
  // fetchAnomalies() → GET /analytics/anomalies?venture_id=X
  // dismissAnomaly(id) → PUT /analytics/anomalies/:id/dismiss
  // Retorna: { anomalies, loading, dismissAnomaly, criticalCount, warningCount }
}
```

**Actualizar `useSmartAlerts.ts`:**
Las alertas manuales hardcodeadas actuales (gastos elevados, venture negativo, etc.) deben coexistir con las anomalías de la DB. Merge de ambas fuentes, priorizando `severity: 'critical'` primero.

---

### TAREA III-C — Hook del formulario guiado

**Archivo nuevo:** `frontend/src/features/transactions/hooks/useTransactionForm.ts`

Maneja el estado del formulario de 3 pasos:

```typescript
export type TransactionStep = 'type_selection' | 'details' | 'confirmation'
export type MovementType = 'income' | 'operating_expense' | 'capital_investment' | 'transfer'

export function useTransactionForm(ventureId: string) {
  // Estado del paso actual
  // Validaciones por paso
  // Preview de impacto en tiempo real:
  //   - Para income: nuevo flujo libre del mes
  //   - Para operating_expense: reducción de flujo + comparación vs promedio categoría
  //   - Para capital_investment: nuevo capital invertido + ROI proyectado
  // Detección pre-save: llama a /analytics/detect en modo dry-run antes de confirmar
  //   para mostrar warning de duplicado o anomalía en el paso 3
}
```

---

## BLOQUE IV — Interfaces de usuario

> Agente: Gemini (diseño de componentes) + Claude Opus (implementación)  
> Prerequisito: BLOQUE III completo  
> Regla estética: Sin emojis en texto de UI. Solo en íconos de categoría (que son datos). Paleta monocromática.

---

### TAREA IV-A — TransactionForm: flujo guiado en 3 pasos

**Archivo:** `frontend/src/features/transactions/components/TransactionForm.tsx`  
**Reemplaza completamente el form actual**

**Paso 1 — Selección de tipo de movimiento**

Cuatro cards visuales dentro del SlidePanel existente:

```
┌──────────────────┐  ┌──────────────────┐
│   INGRESO        │  │   GASTO          │
│                  │  │   OPERATIVO      │
│   Dinero que     │  │                  │
│   entra al       │  │   Costo de       │
│   venture        │  │   operacion      │
└──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐
│   INVERSION      │  │   TRANSFERENCIA  │
│   DE CAPITAL     │  │   INTERNA        │
│                  │  │                  │
│   Activo que     │  │   Mover capital  │
│   genera valor   │  │   entre ventures │
└──────────────────┘  └──────────────────┘
```

Card seleccionada: borde negro 2px, fondo #fafafa. Sin seleccionar: borde #e5e5e5, fondo blanco.

**Paso 2 — Detalles contextuales**

Campos según `MovementType`:

```
INGRESO y GASTO OPERATIVO (campos comunes):
  Monto ($)  |  Fecha  |  Descripción
  Categoría — filtrada por contexto del venture + direction del tipo
  Evidencia (opcional)

GASTO OPERATIVO (campo adicional):
  Toggle: ¿Es recurrente?
  Si activo: Frecuencia (Mensual / Semanal / Quincenal)

INVERSION DE CAPITAL (campos distintos):
  Monto ($)  |  Fecha
  ¿En qué? (descripción del activo adquirido)
  Toggle: ¿Es depreciable?

TRANSFERENCIA INTERNA:
  Venture destino (dropdown de ventures del usuario, excluye el actual)
  Monto ($)  |  Fecha  |  Concepto
```

**Paso 3 — Confirmación con impacto**

Resumen de una sola pantalla:

```
┌─────────────────────────────────────────┐
│  Resumen del movimiento                 │
│                                         │
│  Tipo:       Gasto operativo            │
│  Categoría:  APIs externas              │
│  Monto:      $1,200                     │
│  Fecha:      12 abr 2026               │
│                                         │
│  ── Impacto proyectado ──               │
│  Flujo libre este mes:  -$1,200         │
│  Nuevo flujo estimado:  +$3,840         │
│                                         │
│  ── Aviso del sistema ──                │  ← solo si hay anomalía detectada
│  Este monto es 340% mayor que tu        │
│  promedio en APIs externas ($353/mes).  │
│  Verifica antes de confirmar.           │
│                                         │
│  [  Editar  ]      [  Confirmar  ]      │
└─────────────────────────────────────────┘
```

El aviso del sistema usa el mismo esquema de colores que SmartAlerts:
- Amarillo (#fefce8 / #a16207) para warnings
- Rojo (#fef2f2 / #991b1b) para críticos (duplicado detectado)

---

### TAREA IV-B — Panel de categorías y contextos

**Ruta:** `/settings/categories`  
**Archivo nuevo:** `frontend/src/features/settings/components/CategoriesManager.view.tsx`  
**Archivo nuevo:** `frontend/src/features/settings/pages/SettingsCategoriesPage.tsx`

Tres tabs:

**Tab "Mis Contextos":** Cards de contextos con nombre, descripción, número de ventures y categorías activas. Badge "Sistema" en gris para los no editables. Botón "Nuevo contexto" abre SlidePanel con form.

**Tab "Mis Categorías":** Tabla con filtros (contexto, tipo contable, dirección). Filas del sistema tienen fondo #fafafa con texto más tenue y sin acciones de edición. Botón "Nueva categoría" abre SlidePanel.

**Tab "Por Venture":** Solo visible si hay categorías con `scope = 'venture_specific'`. Lista de ventures con checklist de asignación.

Agregar al menú de Settings en `Layout.tsx` — nuevo ítem "Categorias" con ícono de etiqueta.

---

### TAREA IV-C — Rediseño VentureCard

**Archivo:** `frontend/src/features/ventures/components/VentureCard.tsx`

Card nueva con más información estructurada:

```
[dot estado] Nombre del Venture          [VPS rank #1]
             Contexto · Tipo · Estado

Invertido    Retornado    Neto
$100,000     $200,000    +$100k

[████████░░] Recuperado 100%
Activo desde hace 14 meses

[badge accion: Escalar]   [si hay anomalias: 2 avisos]
```

El badge de ranking VPS (`#1`, `#2`, etc.) reemplaza el ROI badge en la parte superior. El ROI se mantiene pero visible solo en el hover o en la vista de detalle. Esto refuerza la decisión D1.

---

### TAREA IV-D — Rediseño VentureDetail

**Archivo:** `frontend/src/features/ventures/components/VentureDetail.view.tsx`  
**Archivo nuevo:** `frontend/src/features/ventures/components/VenturePnL.view.tsx`  
**Archivo nuevo:** `frontend/src/features/ventures/hooks/useVenturePnL.ts`

Layout nuevo de 4 filas:

```
Fila A: Header + 4 métricas (igual que ahora, mejoradas)

Fila B: P&L (Estado de resultados) + MonthlyChart del venture
  P&L para modo business:
    Ingresos totales
    Costos directos (capital)     ← categorías accounting_type='capital'
    ─────────────────────────────
    Utilidad bruta
    Gastos operativos             ← categorías accounting_type='expense'
    ─────────────────────────────
    Resultado neto

  P&L para modo personal:
    Presupuesto total (invested)
    Gastado (returned)
    Disponible restante
    Distribución por categoría (barra horizontal)

Fila C: Transacciones con filtros mejorados
  Tipo | Categoría | Rango de fechas | Búsqueda
  + columna Categoría en la tabla

Fila D: Préstamos del venture (igual que ahora)
```

**Hook `useVenturePnL`:**
```typescript
// Clasifica transacciones según accounting_type de su categoría
// income → Ingresos
// expense con accounting_type='capital' → Costos directos
// expense con accounting_type='expense' → Gastos operativos
// Sin categoría → Gastos operativos (fallback)
```

---

### TAREA IV-E — Sankey de flujo financiero

**Archivo nuevo:** `frontend/src/features/dashboard/components/SankeyChart.view.tsx`  
**Archivo nuevo:** `frontend/src/features/dashboard/hooks/useSankeyData.ts`

**Dependencia nueva:** `d3-sankey` (agregar a `frontend/package.json`)

```bash
npm install d3-sankey --workspace=frontend
npm install @types/d3-sankey --workspace=frontend --save-dev
```

El Sankey muestra para el período seleccionado (mes actual por defecto):

```
Nodos izquierda: fuentes de ingreso por venture
Nodos centro:    categorías de gasto
Nodos derecha:   resultado (Neto retenido / Pérdida)

Flujo: Ingreso → Categoría → Resultado
```

**Condición de renderizado (decisión D5):**
Antes de renderizar, `useSankeyData` calcula el porcentaje de transacciones con categoría. Si es menor al 70%, el componente retorna un estado vacío:

```
[Sin datos suficientes para el diagrama]
El 43% de tus transacciones no tienen categoría asignada.
Categoriza tus movimientos en el historial para ver el flujo completo.
[Ir a transacciones]
```

Si supera el 70%, renderiza el Sankey con `d3-sankey` dentro de un `<svg>` responsivo.

**Filtro de período:** Dropdown en el header del componente: Este mes / Últimos 3 meses / Últimos 6 meses / Este año.

---

### TAREA IV-F — Feed de anomalías

**Archivo:** `frontend/src/features/dashboard/components/SmartAlerts.view.tsx`  
**Modificar**, no reemplazar completamente

Evolucionar `SmartAlerts` para mostrar dos fuentes de alertas:

1. Alertas calculadas localmente (las actuales: venture negativo, mejor venture, etc.) — marcadas con badge "Sistema"
2. Anomalías de la DB (`useAnomalies`) — marcadas con badge "Detectado" y con botón "Descartar"

Las anomalías críticas (duplicados, z-score > 3) aparecen primero, con borde rojo más grueso y texto de acción más urgente.

Agregar botón "Descartar" en cada card de anomalía de DB. Al clickear llama a `dismissAnomaly(id)`.

---

## BLOQUE V — Actualización CLAUDE.md

> Agente: Claude Opus  
> Prerequisito: BLOQUE IV completo (o ejecutar en paralelo documentando lo ya construido)

### Nuevas reglas a agregar al CLAUDE.md existente

Agregar como Reglas #22 a #27 en la sección "Reglas del agente":

```markdown
22. **VPS como métrica de prioridad:**
    El ROI porcentual puro nunca se usa para ordenar o priorizar ventures.
    Todo ranking usa calculateVPS() de shared/lib/vps.ts.
    El ROI % se muestra solo como información, nunca como criterio de orden.

23. **Formulario de transacciones en pasos:**
    TransactionForm.tsx sigue el flujo de 3 pasos definido en TAREA IV-A.
    No agregar campos al paso 1 (solo selección de tipo).
    No saltarse el paso 3 de confirmación.

24. **Detección de anomalías en backend:**
    Ningún cálculo de z-score o detección de duplicados ocurre en el cliente.
    El frontend solo consume el endpoint GET /analytics/anomalies.
    La llamada a POST /analytics/detect se hace desde transactions/index.ts
    de forma asíncrona (fire-and-forget).

25. **Sankey con umbral de calidad de datos:**
    SankeyChart.view.tsx no renderiza si menos del 70% de las transacciones
    del período tienen categoría asignada. Mostrar estado vacío con CTA.

26. **Categorías del sistema son inmutables:**
    Las categorías con is_system = TRUE no pueden editarse ni eliminarse.
    Las Edge Functions deben verificar este flag antes de cualquier UPDATE o DELETE.
    El frontend oculta los controles de edición para estas categorías.

27. **Baseline de anomalías requiere mínimo 5 muestras:**
    get_transaction_zscore() retorna NULL si sample_count < 5 en category_stats.
    El frontend no muestra anomalías de tipo high_spend/low_income si no hay
    historial suficiente. Mostrar en su lugar: "Historial insuficiente para
    analisis estadístico en esta categoria."
```

### Actualizar sección "Estado del proyecto — Pendiente"

Reemplazar la tabla de pendientes con el nuevo estado real post-implementación de este plan.

### Actualizar checklist MVP

Agregar nuevas secciones al checklist:

```markdown
### Sistema de Categorías Dinámicas
- [ ] Migration 007 aplicada
- [ ] Panel /settings/categories funcional
- [ ] TransactionForm filtra categorías por contexto del venture
- [ ] Contextos personalizados del usuario funcionan

### Préstamos Inteligentes
- [ ] Migration 008 aplicada
- [ ] Catálogo de instituciones con 21 registros
- [ ] LoanForm con selector de institución y preview de amortización
- [ ] Tabla de amortización visible en detalle de préstamo

### Motor de Análisis
- [ ] Migration 009 aplicada
- [ ] Edge Function analytics desplegada
- [ ] Detección de duplicados funcional (test manual)
- [ ] Z-score calculado para categorías con 5+ muestras
- [ ] SmartAlerts muestra anomalías de DB + locales

### Visualización Avanzada
- [ ] SankeyChart renderiza con datos limpios
- [ ] Estado vacío con umbral 70% funcional
- [ ] P&L por venture visible en VentureDetail
- [ ] VPS ordena correctamente: $300/400% por debajo de $100k/100%
```

---

## Resumen ejecutivo

| # | Tarea | Módulo | Agente | Horas | Bloquea |
|---|-------|--------|--------|-------|---------|
| I-A | Migration 007: contextos + categorías | DB | Opus | 45m | II-A, III-B, IV-A, IV-B |
| I-B | Migration 008: préstamos + instituciones | DB | Opus | 45m | II-B, IV loanform |
| I-C | Migration 009: analytics baseline | DB | Opus | 30m | II-C, III-B, IV-F |
| II-A | Edge Function settings (categorías + contextos) | Backend | Opus | 1.5h | IV-A, IV-B |
| II-B | Edge Function loans (amortización) | Backend | Opus | 1.5h | IV loanform |
| II-C | Edge Function analytics (nueva) | Backend | Opus | 2h | III-B, IV-F |
| III-A | VPS — índice compuesto de ventures | Frontend lib | Opus | 1.5h | IV-C, IV-D |
| III-B | Hook useAnomalies | Frontend hook | Opus | 1h | IV-F |
| III-C | Hook useTransactionForm | Frontend hook | Opus | 1h | IV-A |
| IV-A | TransactionForm flujo 3 pasos | UI | Gemini+Opus | 2.5h | — |
| IV-B | Panel /settings/categories | UI | Gemini+Opus | 2.5h | — |
| IV-C | VentureCard rediseñada | UI | Gemini+Opus | 1.5h | — |
| IV-D | VentureDetail + P&L | UI | Gemini+Opus | 2.5h | — |
| IV-E | SankeyChart | UI | Gemini+Opus | 2h | — |
| IV-F | SmartAlerts + AnomalyFeed | UI | Gemini+Opus | 1.5h | — |
| V | Actualizar CLAUDE.md | Docs | Opus | 30m | — |
| **Total** | | | | **~23h** | |

**Primer commit de la sesión:** Siempre TAREA I-A → I-B → I-C en ese orden.  
**Sin DB lista, nada del resto funciona.**