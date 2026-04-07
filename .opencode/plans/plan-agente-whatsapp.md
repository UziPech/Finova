# Finova — Plan Maestro: Agente IA WhatsApp

> Generado por opencode — supervisado por Claude Code
> Fecha: 2026-04-06
> Estado: DECISIONES TOMADAS → Sprint 1 en curso

---

## Decisiones del Usuario (confirmadas)

| Decisión | Elección |
|----------|----------|
| **Proveedor IA** | Gemini Flash 2.5 (temporal, luego se agrega Claude) |
| **API Key** | `AIzaSyAi0LOyKT0pjUgcpOEgBV1WPloDHGq0lmw` (mover a Supabase secret) |
| **Auto-aceptar** | NO — siempre preguntar/dar vistazo primero |
| **Respuestas WA** | SÍ — respuestas personalizadas por WhatsApp |
| **Idioma** | Español |
| **Pendientes** | Dashboard de transacciones pendientes para aceptar luego (definir con Claude Code) |

---

## Visión

> "Cada imagen de un ticket, cada texto de una venta, se convierte automáticamente en una transacción en el venture correcto. Finova te responde por WhatsApp con confirmaciones personalizadas."

El sistema actual de keywords (`"gasto 500 comida"`) es el **cimiento**. El agente IA lo evoluciona a:
- **OCR inteligente** → lee tickets/fotos y extrae monto, fecha, concepto
- **NLP natural** → entiende mensajes como *"acabo de vender 3 licencias a Carlos por 1500"* sin formato rígido
- **Auto-clasificación** → detecta a qué venture pertenece la transacción por contexto
- **Respuestas personalizadas** → confirma, pregunta dudas, reporta resúmenes

---

## Análisis de Cimientos Actuales

### Lo que YA existe y se reaprovecha

| Componente | Estado | Se usa para |
|-----------|--------|-------------|
| `whatsapp-webhook/index.ts` | Funcional | Recepción de mensajes, HMAC, rate limit |
| `user_integrations` table | Funcional | Config por usuario (phone_number_id, token) |
| `whatsapp_keywords` table | Funcional | Keywords income/expense |
| Download de imágenes | Implementado | Descarga media de WhatsApp API |
| Upload a `evidence` bucket | Implementado | Guarda evidencia en storage |
| Creación de transacciones | Implementado | Inserta en `transactions` |
| Recálculo de venture totals | Implementado | Actualiza invested/returned |
| Tenant identification | Implementado | phone_number_id → user_id |
| `parseMessage()` function | Implementado | Parser keyword-based actual |

### Lo que NO funciona hoy (bugs del cimiento)

| Bug | Impacto en el agente |
|-----|---------------------|
| `WhatsAppSettings.tsx` llama a ruta incorrecta (404) | No se puede configurar la integración desde la UI |
| Tablas en CLAUDE.md no coinciden con código real | Confusión para mantenimiento |
| `encrypt_token`/`decrypt_token` RPC no documentadas | Si no existen, el token no se guarda |
| `any` en `checkRateLimit` | Deuda técnica |

> **Regla:** Antes de construir el agente, los bugs críticos del cimiento deben resolverse. Un agente sobre cimientos rotos amplifica los errores.

---

## Arquitectura Propuesta

```
WhatsApp Business API
        │
        ▼
┌──────────────────────────────┐
│  whatsapp-webhook (edge fn)  │  ← Ya existe, se modifica
│  - HMAC verification         │
│  - Rate limiting             │
│  - Tenant identification     │
│  - Router de tipo mensaje    │
└──────────┬───────────────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐  ┌──────────────┐
│ Texto   │  │ Imagen/Doc   │
│ Natural │  │ (ticket)     │
└────┬────┘  └──────┬───────┘
     │              │
     ▼              ▼
┌─────────────────────────────────┐
│   AI Processing Layer           │  ← NUEVO
│                                 │
│  ┌───────────────────────────┐  │
│  │ NLP Pipeline (texto)      │  │
│  │ - Extrae tipo, monto,     │  │
│  │   descripción, venture    │  │
│  │ - Confidence score        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ OCR Pipeline (imagen)     │  │
│  │ - Lee ticket/recibo       │  │
│  │ - Extrae campos           │  │
│  │ - Confidence score        │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Venture Matcher           │  │
│  │ - Detecta venture por     │  │
│  │   keywords, historial,    │  │
│  │   default_venture_id      │  │
│  └───────────────────────────┘  │
└──────────┬──────────────────────┘
           │
     ┌─────┴──────────────┐
     ▼                    ▼
┌────────────┐      ┌──────────────┐
│ Confianza  │      │ Confianza    │
│ ALTA       │      │ BAJA/MEDIA   │
│ → Inserta  │      │ → Pregunta   │
│            │      │   al usuario │
└─────┬──────┘      └──────┬───────┘
      │                    │
      ▼                    ▼
┌──────────────────────────────────┐
│  Transaction DB + Recalculate    │  ← Ya existe
└──────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  WhatsApp Reply Engine            │  ← NUEVO
│  - Confirmación personalizada    │
│  - Resumen de venture            │
│  - Preguntas de clarificación    │
└──────────────────────────────────┘
```

---

## Fase 1: Fix del Cimiento (Prerrequisito)

> No se construye encima de cimientos rotos.

### 1.1 Fix: Authorization headers en ventures
**Archivos:** `useVentures.ts`, `VentureDetail.tsx`
**Cambio:** Inyectar `Authorization: Bearer {token}` en updateVenture y deleteVenture
**Esfuerzo:** ~15 min

### 1.2 Fix: WhatsApp Settings endpoint
**Archivos:** `WhatsAppSettings.tsx` O `user-settings/index.ts`
**Opción A (recomendada):** Cambiar frontend para llamar a `user-settings/integrations`
**Opción B:** Agregar handler de ruta base en el edge function
**Esfuerzo:** ~10 min

### 1.3 Fix: repomix.config.json
**Archivo:** `repomix.config.json`
**Cambio:** Actualizar paths de `apps/web/` → `frontend/`, `apps/api/` → `backend/`
**Esfuerzo:** ~2 min

### 1.4 Documentar: Tablas reales de DB
**Archivo:** `CLAUDE.md` + `OBSERVACIONES.md`
**Acción:** Actualizar el schema documentado para que coincida con las tablas reales:
- `user_integrations` (no `whatsapp_configs`)
- `whatsapp_keywords` (no `keywords`)
- Documentar `encrypt_token`/`decrypt_token` RPC
**Esfuerzo:** ~20 min

### 1.5 Crear: `.vscode/settings.json`
**Archivo:** `.vscode/settings.json`
**Contenido:** Config de Deno para `backend/supabase/functions/`
**Esfuerzo:** ~5 min

---

## Fase 2: Agente IA — NLP para Texto Natural

### 2.1 Nueva tabla: `ai_transaction_logs`

```sql
create table ai_transaction_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  message_text text not null,
  message_type text not null,  -- 'text', 'image', 'document'
  parsed_type text,             -- 'income' | 'expense' | null
  parsed_amount numeric(12,2),
  parsed_description text,
  matched_venture_id uuid references ventures(id),
  confidence_score numeric(3,2),  -- 0.00 a 1.00
  status text default 'pending',  -- 'pending' | 'confirmed' | 'rejected' | 'auto_accepted'
  ai_model text,                  -- 'openai-gpt-4o' | 'anthropic-sonnet' | etc.
  ai_raw_response jsonb,          -- respuesta cruda del modelo para debug
  created_at timestamptz default now()
);

alter table ai_transaction_logs enable row level security;

create policy "usuarios ven solo sus logs"
  on ai_transaction_logs for all
  using (auth.uid() = user_id);
```

**Por qué:** Toda decisión del agente queda registrada. Permite:
- Auditoría de qué entendió el agente
- Re-entrenamiento/ajuste basado en correcciones del usuario
- Dashboard de "transacciones pendientes de confirmar"

### 2.2 Nueva tabla: `ai_agent_config`

```sql
create table ai_agent_config (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  provider text default 'openai',       -- 'openai' | 'anthropic' | 'local'
  api_key_encrypted text,               -- token encriptado (mismo sistema que WhatsApp)
  model text default 'gpt-4o-mini',     -- modelo a usar
  auto_accept_threshold numeric(3,2) default 0.85,  -- confianza mínima para auto-aceptar
  language text default 'es',           -- idioma del agente
  personality text,                     -- prompt de personalidad personalizado
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

**Por qué:** Cada usuario configura su propio proveedor de IA, modelo, y umbral de confianza.

### 2.3 Edge Function: `ai-text-processor`

**Ubicación:** `backend/supabase/functions/ai-text-processor/index.ts`

**Responsabilidad:** Recibe texto natural, lo procesa con LLM, devuelve transacción estructurada.

**Flujo:**
1. Recibe `{ message_text, user_id, keywords, ventures }`
2. Construye prompt con contexto del usuario (sus ventures, keywords, historial)
3. Llama a LLM (OpenAI/Anthropic)
4. Parsea respuesta JSON
5. Retorna `{ type, amount, description, venture_id, confidence, reasoning }`

**Prompt template (ejemplo):**
```
Eres el asistente financiero de Finova. Analiza este mensaje y extrae la transacción.

VENTURES DEL USUARIO:
- "Tienda Shopify" (software, active) — keywords: shopify, tienda, ecommerce
- "Consultoría" (software, active) — keywords: consultoría, consultor, freelance
- "Inversión BTC" (investment, active) — keywords: btc, bitcoin, crypto

MENSAJE: "acabo de vender 3 licencias a Carlos por 1500 pesos"

Responde SOLO en JSON:
{
  "type": "income" | "expense",
  "amount": number,
  "description": string,
  "venture_id": "uuid o null si no estás seguro",
  "confidence": 0.0-1.0,
  "reasoning": "breve explicación de tu decisión"
}
```

### 2.4 Modificación: `whatsapp-webhook/index.ts`

**Cambios:**
- Después de extraer el texto del mensaje, intentar primero el parser de keywords actual (fallback rápido)
- Si NO hay match de keywords → enviar texto a `ai-text-processor`
- Si hay match de keywords → usar el sistema actual (más rápido, sin costo de API)

```
Texto recibido
    │
    ▼
¿Match keywords? ──SÍ──→ Crear transacción (flujo actual)
    │
    NO
    ▼
Enviar a AI processor
    │
    ▼
¿Confidence >= threshold? ──SÍ──→ Auto-aceptar + confirmar por WhatsApp
    │
    NO
    ▼
Responder: "No estoy seguro, ¿es ingreso o gasto?"
```

### 2.5 Reply Engine: `sendWhatsAppMessage()`

**Función nueva en `_shared/whatsapp.ts`:**

```typescript
async function sendWhatsAppMessage(
  phoneNumberId: string,
  toPhoneNumber: string,
  accessToken: string,
  message: string
): Promise<boolean>
```

**Tipos de respuestas:**

| Tipo | Ejemplo | Cuándo |
|------|---------|--------|
| Confirmación | "✅ Registré $1,500 como ingreso en 'Consultoría'. ROI actual: +23%" | Confianza alta |
| Clarificación | "🤔 Vi '$500' pero no sé si es ingreso o gasto. ¿Me ayudas?" | Confianza baja |
| Resumen | "📊 Resumen del día: 3 transacciones, $2,300 ingresos, $800 gastos" | Comando del usuario |
| Error | "⚠️ No pude leer la imagen. ¿Puedes reenviarla?" | OCR falló |

---

## Fase 3: Agente IA — OCR para Tickets/Recibos

### 3.1 OCR Pipeline

**Opciones técnicas:**

| Opción | Pros | Contras | Costo |
|--------|------|---------|-------|
| **OpenAI Vision (GPT-4o)** | Ya tendrías la integración, entiende contexto | Costo por imagen | ~$0.01/imagen |
| **Google Cloud Vision** | Excelente para receipts | Integración adicional | ~$1.50/1000 |
| **AWS Textract** | Especializado en documentos | Integración adicional | ~$1.50/1000 |
| **Mindee Receipt API** | Especializado en receipts | Servicio externo | ~$0.05/doc |

**Recomendación:** Usar OpenAI Vision (GPT-4o). Unifica el proveedor de IA, minimiza integraciones, y el costo es marginal para uso personal.

### 3.2 Flujo OCR

```
Imagen recibida de WhatsApp
    │
    ▼
Descargar imagen (ya implementado)
    │
    ▼
Enviar a OpenAI Vision con prompt:
"Eres un extractor de datos de tickets/recibos.
 Extrae: total, fecha, comercio, conceptos.
 Responde en JSON."
    │
    ▼
Parsear respuesta:
{
  "total": 523.50,
  "date": "2026-04-05",
  "merchant": "Walmart",
  "items": ["Leche $32", "Pan $45"],
  "confidence": 0.92
}
    │
    ▼
Venture Matcher (¿a qué venture pertenece?)
    │
    ▼
¿Confianza >= threshold?
    │
    ├── SÍ → Crear transacción + evidencia + confirmar
    └── NO → Preguntar al usuario
```

### 3.3 Prompt de OCR

```
Analiza esta imagen de un ticket/recibo/factura y extrae la información financiera.

Responde SOLO en este formato JSON:
{
  "total": number,          // monto total
  "currency": string,       // MXN, USD, etc. (inferir)
  "date": string,           // YYYY-MM-DD si se puede extraer
  "merchant": string,       // nombre del comercio
  "items": [                // items individuales si son legibles
    {"name": string, "amount": number}
  ],
  "type": "expense" | "income",  // ¿es compra o venta?
  "confidence": number,     // 0.0-1.0 qué tan clara es la imagen
  "notes": string           // observaciones (imagen borrosa, incompleta, etc.)
}

Si la imagen NO es un ticket/recibo/factura, responde:
{"error": "not_a_receipt", "description": "lo que sí parece ser"}
```

---

## Fase 4: Venture Matcher Inteligente

### 4.1 Problema actual

El webhook actual usa `default_venture_id` o el primer venture activo. Esto es insuficiente cuando el usuario tiene múltiples ventures.

### 4.2 Solución: Scoring de ventures

```typescript
function matchVentureToTransaction(
  message: string,
  extractedData: { merchant?: string; items?: string[] },
  userVentures: Venture[],
  userKeywords: Keyword[]
): { venture: Venture; confidence: number } {
  // 1. Match por keywords asignadas a venture
  // 2. Match por nombre de venture en el texto
  // 3. Match por merchant histórico (si ya gastaste en Walmart para "Casa", probablemente sea "Casa")
  // 4. Fallback: default_venture_id
}
```

### 4.3 Aprendizaje histórico

Cada vez que el usuario corrige al agente ("no, eso era para el venture X"), se guarda esa corrección. La próxima vez, el agente recuerda.

**Tabla:** `ai_corrections` (o campo en `ai_transaction_logs`)

---

## Fase 5: Comandos de WhatsApp

El agente responde a comandos naturales:

| Comando | Ejemplo | Respuesta |
|---------|---------|-----------|
| Resumen diario | "resumen de hoy" | "3 transacciones: $2,300 ingresos, $800 gastos" |
| Estado de venture | "cómo va la tienda?" | "Tienda Shopify: invertido $5,000, retornado $8,200, ROI +64%" |
| Últimas transacciones | "últimos gastos" | Lista de las últimas 5 transacciones |
| Registrar manual | "gasto 200 uber" | Crea la transacción (flujo actual de keywords) |
| Ayuda | "ayuda" | Lista de comandos disponibles |

---

## Fase 6: UI de Gestión del Agente

### 6.1 Nueva página: "Agente IA" en Settings

**Ruta:** `/settings/agent`

**Componentes:**
- Config de IA (proveedor, modelo, API key, umbral de confianza)
- Toggle activar/desactivar agente
- Personalidad del agente (textarea para custom prompt)
- Historial de decisiones del agente (tabla con logs)
- Transacciones pendientes de confirmación

### 6.2 Dashboard: Métricas del Agente

En el Dashboard principal, agregar una card:
- "Transacciones por IA este mes: X"
- "Precisión del agente: X%" (basado en correcciones)

---

## Stack Técnico Propuesto

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| LLM Text + Vision | **Gemini Flash 2.5** | Un modelo sirve para texto e imágenes, API gratuita, rápido |
| LLM futuro | Claude (Sonnet/Opus) | Se agregará después como alternativa |
| Edge Function | Supabase (Deno) | Ya desplegado, sin infra adicional |
| DB | PostgreSQL (Supabase) | Nuevas tablas + migrations |
| Respuestas WA | Meta Cloud API | Ya integrada |
| UI | React + Tailwind | Mismo stack existente |

**Gemini Flash 2.5 — Por qué funciona perfecto:**
- Soporta texto + imágenes en un solo endpoint (no necesita servicio separado de OCR)
- API REST simple via `fetch` — no requiere SDK, ideal para Deno edge functions
- Gratuito con cuota generosa
- Output en JSON estructurado con `responseMimeType: 'application/json'`

**Endpoint:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=API_KEY
```

**Para imágenes:** se envía como `inlineData` con base64 en el mismo payload.

---

## Costo Estimado (uso personal, 2 usuarios)

| Servicio | Uso mensual | Costo estimado |
|----------|------------|----------------|
| Gemini Flash 2.5 (texto + visión) | ~600 requests | ~$0 (free tier generoso) |
| WhatsApp API (Meta) | Conversations | ~$0 (user-initiated son gratis) |
| Supabase | Free tier | $0 |
| **Total** | | **~$0/mes** |

---

## Plan de Implementación — Orden de Ejecución

### Sprint 1: Cimientos (1-2 horas)
1. Fix auth headers en ventures
2. Fix WhatsApp Settings endpoint
3. Fix repomix config
4. Documentar tablas reales
5. Crear `.vscode/settings.json`

### Sprint 2: Infraestructura del Agente (2-3 horas)
1. Migration: `ai_transaction_logs`
2. Migration: `ai_agent_config`
3. Edge function: `ai-processor` (Gemini Flash 2.5 — texto + visión unificado)
4. Función: `sendWhatsAppMessage()` en `_shared/whatsapp.ts`
5. Modificar `whatsapp-webhook` para integrar Gemini como fallback de keywords

### Sprint 3: Gemini NLP + OCR Unificado (2-3 horas)
1. Integrar Gemini Flash 2.5 API en edge function (texto + imágenes)
2. Prompt engineering con contexto de ventures + keywords
3. JSON parsing + confidence score
4. Respuestas de clarificación por WhatsApp (siempre preguntar, no auto-aceptar)
5. Testing con mensajes naturales e imágenes de tickets

### Sprint 4: Venture Matcher Inteligente (1-2 horas)
1. Scoring de ventures por keywords, nombre, historial
2. Aprendizaje de correcciones del usuario
3. Fallback inteligente

### Sprint 5: Comandos y Respuestas (2-3 horas)
1. Comandos: resumen, estado, últimos
2. Reply engine con templates personalizados
3. Respuestas con datos del venture (ROI, invested, returned)

### Sprint 6: UI de Gestión (3-4 horas)
1. Página `/settings/agent`
2. Config de IA
3. Historial de decisiones
4. Transacciones pendientes de confirmar
5. Card en Dashboard

---

## Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| LLM malinterpreta mensaje | Transacción incorrecta | Confidence threshold + corrección del usuario |
| Costo de API se dispara | Factura sorpresa | Rate limiting + logging de uso |
| OCR falla con imágenes borrosas | Datos incorrectos | Pedir reenvío al usuario |
| Edge function timeout (15s) | LLM tarda demasiado | Usar modelos rápidos (4o-mini), timeout handling |
| Token de WhatsApp expira | Agente deja de funcionar | Refresh token automático |

---

## Decisiones Pendientes (necesitan tu input)

1. **¿Qué proveedor de IA prefieres?** OpenAI (recomendado), Anthropic, o ambos?
2. **¿Quieres que el agente auto-acepte transacciones con alta confianza, o siempre pregunte antes?**
3. **¿El agente debe responder por WhatsApp o solo registrar silenciosamente?**
4. **¿Necesitas multi-idioma (español/inglés) o solo español?**
5. **¿Quieres un dashboard de "transacciones pendientes de confirmar" o prefieres que todo sea automático?**

---

> Este es un plan vivo. Se actualiza con cada decisión y hallazgo.
> Siguiente paso: Sprint 1 (fix cimientos) → Sprint 2 (Gemini + webhook) → Sprint 3 (UI pendientes).

---

## Notas del Agente (opencode) — Para Claude Code

### Lo que SÍ vale la pena

1. **Los 4 bugs críticos del cimiento son reales.** Si no se fixean antes, el agente amplifica los errores:
   - `WhatsAppSettings.tsx` → 404, no se puede configurar nada
   - Auth headers en ventures → no se puede editar/borrar
   - repomix stale → los agentes no tienen contexto
   - Tablas documentadas ≠ tablas reales → confusión total

2. **Gemini Flash 2.5 es la elección correcta.** Un modelo, texto + imágenes, gratis. Simplifica todo vs el plan original de OpenAI que separaba NLP de OCR.

3. **"Siempre preguntar" > auto-aceptar** para uso personal. No queremos transacciones fantasma en el venture equivocado.

### Lo que es relleno (no ejecutar todavía)

1. **6 sprints → se pueden comprimir en 3:**
   - Sprint A: Fix cimientos + infraestructura (tablas + edge function base)
   - Sprint B: Gemini integrado (texto + imágenes) + respuestas WhatsApp
   - Sprint C: UI del dashboard de pendientes
   - Todo lo demás es decoración.

2. **`ai_agent_config` table es premature abstraction.** Para 2 usuarios y 1 proveedor (Gemini), no necesitas una tabla con provider, model, personality, threshold, language... Hardcodea el API key como Supabase secret y ajusta el prompt en el código. Se agrega complejidad innecesaria. Si luego se quiere Claude, se agrega en ese momento.

3. **"Venture Matcher con aprendizaje histórico"** suena bonito pero es el tipo de feature que nunca se termina. Gemini con la lista de ventures activos en el prompt ya hace un buen trabajo de matching. El aprendizaje se puede agregar después si realmente hace falta.

4. **Comandos de WhatsApp ("resumen de hoy", "cómo va la tienda?")** son nice-to-have, no need-to-have. El MVP es: recibe → entiende → pregunta → registra. Lo demás es decoración.

5. **`ai_corrections` table separada** — innecesaria. Se puede meter un campo `user_corrected_venture_id` en `ai_transaction_logs` y ya.

### Recomendación de ejecución

**Orden real:**
1. Fix cimientos (~1 hora) — obligatorio
2. Gemini + webhook + respuestas WA (~2-3 horas) — esto ES el agente
3. Dashboard de pendientes (~1-2 horas) — UX

**NO tocar hasta que el agente funcione:**
- Multi-proveedor (Claude)
- Comandos de WhatsApp
- Personalidad configurable
- Aprendizaje histórico
- Métricas de precisión del agente

### API Key de Gemini

El usuario proporcionó: `AIzaSyAi0LOyKT0pjUgcpOEgBV1WPloDHGq0lmw`

**NO hardcodear en el código.** Guardar como Supabase secret:
```
npx supabase secrets set GEMINI_API_KEY=AIzaSyAi0LOyKT0pjUgcpOEgBV1WPloDHGq0lmw
```

Y acceder en edge functions con `Deno.env.get('GEMINI_API_KEY')`.

### Endpoint de Gemini Flash 2.5

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}
```

Soporta texto + imágenes inline (base64) en el mismo payload. No necesita servicio separado de OCR.

---
