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
- Only files matching these patterns are included: frontend/src/**/*.ts, frontend/src/**/*.tsx, backend/**/*.ts, supabase/migrations/**/*.sql, CLAUDE.md, PLAN_TAREA.md, package.json, frontend/package.json
- Files matching these patterns are excluded: node_modules/**, dist/**, .env*, repomix-output.md, PLAN_TAREA.md, OBSERVACIONES.md, **/*.test.ts, **/*.spec.ts, **/*.test.tsx, backend/.env*, frontend/.env*
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
backend/
  _shared/
    cors.ts
    rateLimit.ts
    supabaseAdmin.ts
    types.ts
    whatsapp.ts
  supabase/
    functions/
      transactions/
        index.ts
      user-settings/
        index.ts
      ventures/
        index.ts
      whatsapp-webhook/
        index.ts
frontend/
  src/
    app/
      Layout.tsx
      ProtectedRoute.tsx
      router.tsx
    features/
      auth/
        components/
          AuthForm.tsx
        hooks/
          useAuth.ts
        pages/
          AuthPage.tsx
        store.ts
        types.ts
      dashboard/
        components/
          DashboardView.tsx
          MetricCard.tsx
          MonthlyChart.tsx
          RedVentures.tsx
        pages/
          DashboardPage.tsx
      settings/
        components/
          KeywordsManager.tsx
          WhatsAppSettings.tsx
        pages/
          SettingsKeywordsPage.tsx
          SettingsWhatsAppPage.tsx
      transactions/
        components/
          TransactionForm.tsx
        hooks/
          useTransactions.ts
        types.ts
      ventures/
        components/
          VentureCard.tsx
          VentureDetail.tsx
          VentureForm.tsx
          VenturesList.tsx
        hooks/
          useVentures.ts
        pages/
          VentureDetailPage.tsx
          VenturesPage.tsx
        store.ts
        types.ts
        utils.ts
    shared/
      components/
        SlidePanel.tsx
      lib/
        constants.ts
        formatters.ts
        supabase.ts
      types/
        index.ts
    App.tsx
    main.tsx
  package.json
CLAUDE.md
package.json
```

# Files

## File: frontend/src/shared/components/SlidePanel.tsx
````typescript
  1: import { useEffect, type ReactNode } from 'react'
  2: 
  3: interface SlidePanelProps {
  4:   isOpen: boolean
  5:   onClose: () => void
  6:   title: string
  7:   children: ReactNode
  8: }
  9: 
 10: export function SlidePanel({ isOpen, onClose, title, children }: SlidePanelProps) {
 11:   useEffect(() => {
 12:     const handleEscape = (e: KeyboardEvent) => {
 13:       if (e.key === 'Escape') onClose()
 14:     }
 15: 
 16:     if (isOpen) {
 17:       document.addEventListener('keydown', handleEscape)
 18:       // Prevent scrolling on body when panel is open
 19:       document.body.style.overflow = 'hidden'
 20:     }
 21: 
 22:     return () => {
 23:       document.removeEventListener('keydown', handleEscape)
 24:       document.body.style.overflow = 'unset'
 25:     }
 26:   }, [isOpen, onClose])
 27: 
 28:   if (!isOpen) return null
 29: 
 30:   return (
 31:     <div style={{
 32:       position: 'fixed',
 33:       inset: 0,
 34:       zIndex: 50,
 35:       display: 'flex',
 36:       flexDirection: 'column',
 37:       alignItems: 'center',
 38:     }}>
 39:       {/* Backdrop */}
 40:       <div 
 41:         className="animate-fade-in"
 42:         style={{
 43:           position: 'absolute',
 44:           inset: 0,
 45:           backgroundColor: 'rgba(0,0,0,0.6)',
 46:           backdropFilter: 'blur(8px)',
 47:         }} 
 48:         onClick={onClose} 
 49:       />
 50: 
 51:       {/* Sliding Panel */}
 52:       <div 
 53:         className="animate-panel-slide" 
 54:         style={{
 55:           position: 'relative',
 56:           backgroundColor: '#0a0a0a',
 57:           borderBottomLeftRadius: '24px',
 58:           borderBottomRightRadius: '24px',
 59:           border: '1px solid #262626',
 60:           borderTop: 'none',
 61:           boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
 62:           width: '100%',
 63:           maxWidth: '520px',
 64:           maxHeight: '90dvh',
 65:           display: 'flex',
 66:           flexDirection: 'column',
 67:           color: '#fafafa'
 68:         }}
 69:       >
 70:         {/* Decorative Top Line */}
 71:         <div style={{
 72:           position: 'absolute',
 73:           top: 0,
 74:           left: '20%',
 75:           right: '20%',
 76:           height: '2px',
 77:           background: 'linear-gradient(90deg, transparent, #fafafa, transparent)',
 78:           opacity: 0.15
 79:         }} />
 80: 
 81:         {/* Header */}
 82:         <div style={{ 
 83:           display: 'flex', 
 84:           alignItems: 'center', 
 85:           justifyContent: 'space-between', 
 86:           padding: '24px',
 87:           borderBottom: '1px solid #171717' 
 88:         }}>
 89:           <div>
 90:             <h2 style={{ 
 91:               fontSize: '18px', 
 92:               fontWeight: 600, 
 93:               color: '#fafafa', 
 94:               letterSpacing: '-0.02em',
 95:               margin: 0 
 96:             }}>
 97:               {title}
 98:             </h2>
 99:           </div>
100:           
101:           <button
102:             onClick={onClose}
103:             style={{ 
104:               padding: '6px', 
105:               borderRadius: '8px', 
106:               background: 'none', 
107:               border: 'none', 
108:               cursor: 'pointer', 
109:               color: '#737373', 
110:               display: 'flex', 
111:               transition: 'all 0.15s',
112:               backgroundColor: 'rgba(255,255,255,0.05)'
113:             }}
114:             onMouseEnter={(e) => { 
115:               e.currentTarget.style.color = '#fafafa'
116:               e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
117:             }}
118:             onMouseLeave={(e) => { 
119:               e.currentTarget.style.color = '#737373'
120:               e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
121:             }}
122:           >
123:             <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
124:               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
125:             </svg>
126:           </button>
127:         </div>
128: 
129:         {/* Scrollable Content */}
130:         <div style={{
131:           padding: '24px',
132:           overflowY: 'auto',
133:           flex: 1
134:         }}>
135:           {children}
136:         </div>
137:       </div>
138:     </div>
139:   )
140: }
````

## File: backend/_shared/cors.ts
````typescript
 1: // apps/api/_shared/cors.ts
 2: // Headers CORS para todas las Edge Functions
 3: 
 4: export const corsHeaders = {
 5:   'Access-Control-Allow-Origin': '*',
 6:   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
 7:   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
 8: }
 9: 
10: export function handleCors(req: Request): Response | null {
11:   if (req.method === 'OPTIONS') {
12:     return new Response('ok', { headers: corsHeaders })
13:   }
14:   return null
15: }
````

## File: backend/_shared/rateLimit.ts
````typescript
 1: // backend/_shared/rateLimit.ts
 2: // ─────────────────────────────────────────────────────────────────────────────
 3: // Middleware de rate limiting usando Postgres (sin dependencias externas).
 4: // Llama a check_rate_limit() de la DB y agrega headers estándar.
 5: // ─────────────────────────────────────────────────────────────────────────────
 6: import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
 7: import { corsHeaders } from './cors.ts'
 8: import type { RateLimitResult } from './types.ts'
 9: 
10: interface RateLimitOptions {
11:   /** Identificador único: 'user:{uid}' o 'ip:{address}' o 'phone:{id}' */
12:   key: string
13:   /** Máximo de requests por ventana. Default: 60 */
14:   maxRequests?: number
15:   /** Duración de la ventana en segundos. Default: 60 */
16:   windowSeconds?: number
17: }
18: 
19: /**
20:  * Verifica rate limits contra la función SQL check_rate_limit().
21:  * Retorna headers para agregar al Response + si fue bloqueado.
22:  */
23: export async function checkRateLimit(
24:   supabase: SupabaseClient,
25:   options: RateLimitOptions
26: ): Promise<{
27:   allowed: boolean
28:   headers: Record<string, string>
29:   response?: Response
30: }> {
31:   const { key, maxRequests = 60, windowSeconds = 60 } = options
32: 
33:   const { data, error } = await supabase.rpc('check_rate_limit', {
34:     p_key: key,
35:     p_max_requests: maxRequests,
36:     p_window_seconds: windowSeconds,
37:   })
38: 
39:   if (error) {
40:     // Si falla el rate limiter, permitir el request (fail-open)
41:     // pero loguear el error
42:     console.error('[RateLimit] Error checking rate limit:', error.message)
43:     return {
44:       allowed: true,
45:       headers: {
46:         'X-RateLimit-Limit': String(maxRequests),
47:         'X-RateLimit-Remaining': 'unknown',
48:       },
49:     }
50:   }
51: 
52:   const result = data as RateLimitResult
53: 
54:   const headers: Record<string, string> = {
55:     'X-RateLimit-Limit': String(maxRequests),
56:     'X-RateLimit-Remaining': String(result.remaining),
57:     'X-RateLimit-Reset': result.reset_at,
58:   }
59: 
60:   if (!result.allowed) {
61:     return {
62:       allowed: false,
63:       headers,
64:       response: new Response(
65:         JSON.stringify({
66:           code: 'RATE_LIMIT_EXCEEDED',
67:           message: `Rate limit exceeded. Try again after ${result.reset_at}`,
68:         }),
69:         {
70:           status: 429,
71:           headers: {
72:             ...corsHeaders,
73:             ...headers,
74:             'Content-Type': 'application/json',
75:             'Retry-After': String(windowSeconds),
76:           },
77:         }
78:       ),
79:     }
80:   }
81: 
82:   return { allowed: true, headers }
83: }
84: 
85: /**
86:  * Extrae la IP del request (para rate limiting de webhooks anónimos).
87:  */
88: export function getClientIP(req: Request): string {
89:   return (
90:     req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
91:     req.headers.get('x-real-ip') ||
92:     'unknown'
93:   )
94: }
````

## File: backend/_shared/supabaseAdmin.ts
````typescript
 1: // @ts-nocheck — archivo Deno/Edge Function, no compatible con el TS del IDE
 2: // apps/api/_shared/supabaseAdmin.ts
 3: // ─────────────────────────────────────────────────────────────────────────────
 4: // Cliente Supabase con service_role key.
 5: // NUNCA importar este archivo desde apps/web/.
 6: // Bypasea RLS completamente — úsalo solo cuando sea estrictamente necesario.
 7: // ─────────────────────────────────────────────────────────────────────────────
 8: import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
 9: 
10: const supabaseUrl = Deno.env.get('SUPABASE_URL')!
11: const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
12: 
13: export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
14:   auth: {
15:     autoRefreshToken: false,
16:     persistSession: false,
17:   },
18: })
````

## File: backend/_shared/types.ts
````typescript
  1: // backend/_shared/types.ts
  2: // ─────────────────────────────────────────────────────────────────────────────
  3: // Fuente de verdad central de tipos del dominio Finova.
  4: // El frontend NO define tipos de dominio — solo re-exporta desde aquí.
  5: // ─────────────────────────────────────────────────────────────────────────────
  6: 
  7: // ── Ventures ─────────────────────────────────────────────────────────────────
  8: 
  9: export type VentureType = 'software' | 'physical' | 'investment' | 'mixed'
 10: export type VentureStatus = 'active' | 'paused' | 'closed' | 'idea'
 11: export type VentureHealth = 'positive' | 'neutral' | 'negative'
 12: 
 13: export interface Venture {
 14:   id: string
 15:   user_id: string
 16:   name: string
 17:   type: VentureType
 18:   status: VentureStatus
 19:   invested: number
 20:   returned: number
 21:   currency: string
 22:   start_date: string
 23:   end_date?: string
 24:   notes?: string
 25:   created_at: string
 26:   updated_at: string
 27: }
 28: 
 29: export interface CreateVentureInput {
 30:   name: string
 31:   type: VentureType
 32:   status?: VentureStatus
 33:   invested?: number
 34:   returned?: number
 35:   currency?: string
 36:   start_date?: string
 37:   end_date?: string
 38:   notes?: string
 39: }
 40: 
 41: export interface UpdateVentureInput extends Partial<CreateVentureInput> {
 42:   id: string
 43: }
 44: 
 45: // ── Transactions ──────────────────────────────────────────────────────────────
 46: 
 47: export type TransactionType = 'income' | 'expense'
 48: 
 49: export interface Transaction {
 50:   id: string
 51:   venture_id: string
 52:   user_id: string
 53:   type: TransactionType
 54:   amount: number
 55:   description?: string
 56:   date: string
 57:   evidence_url?: string
 58:   created_at: string
 59: }
 60: 
 61: export interface CreateTransactionInput {
 62:   venture_id: string
 63:   type: TransactionType
 64:   amount: number
 65:   description?: string
 66:   date: string
 67:   evidence_url?: string
 68: }
 69: 
 70: // ── Household (Fase 2 — tipos preparados, sin UI en MVP) ─────────────────────
 71: 
 72: export interface HouseholdExpense {
 73:   id: string
 74:   created_by: string
 75:   amount: number
 76:   category?: string
 77:   description?: string
 78:   split_ratio: number
 79:   date: string
 80:   created_at: string
 81: }
 82: 
 83: // ── Auth ─────────────────────────────────────────────────────────────────────
 84: 
 85: export interface AuthUser {
 86:   id: string
 87:   email: string
 88:   created_at: string
 89: }
 90: 
 91: // ── User Integrations (Multi-tenant) ─────────────────────────────────────────
 92: 
 93: export type IntegrationProvider = 'whatsapp'
 94: 
 95: export interface WhatsAppConfig {
 96:   phone_number_id: string
 97:   verify_token: string
 98:   default_venture_id?: string
 99: }
100: 
101: export interface UserIntegration {
102:   id: string
103:   user_id: string
104:   provider: IntegrationProvider
105:   config: WhatsAppConfig
106:   encrypted_token: string | null
107:   is_active: boolean
108:   created_at: string
109:   updated_at: string
110: }
111: 
112: export interface SaveWhatsAppIntegrationInput {
113:   phone_number_id: string
114:   access_token: string
115:   verify_token: string
116:   default_venture_id?: string
117: }
118: 
119: // ── WhatsApp Keywords ────────────────────────────────────────────────────────
120: 
121: export interface WhatsAppKeyword {
122:   id: string
123:   user_id: string
124:   keyword: string
125:   maps_to: TransactionType
126:   created_at: string
127: }
128: 
129: export interface CreateKeywordInput {
130:   keyword: string
131:   maps_to: TransactionType
132: }
133: 
134: // ── Rate Limiting ────────────────────────────────────────────────────────────
135: 
136: export interface RateLimitResult {
137:   allowed: boolean
138:   remaining: number
139:   reset_at: string
140: }
141: 
142: // ── API responses ─────────────────────────────────────────────────────────────
143: 
144: export interface ApiError {
145:   code: string
146:   message: string
147: }
148: 
149: export type ApiResult<T> =
150:   | { data: T; error: null }
151:   | { data: null; error: ApiError }
````

## File: backend/_shared/whatsapp.ts
````typescript
  1: // backend/_shared/whatsapp.ts
  2: // ─────────────────────────────────────────────────────────────────────────────
  3: // Helpers para la integración multi-tenant de WhatsApp Business API.
  4: // ─────────────────────────────────────────────────────────────────────────────
  5: 
  6: /**
  7:  * Verifica la firma HMAC SHA-256 del webhook de Meta.
  8:  * Retorna false si la firma no coincide → el request no es de Meta.
  9:  */
 10: export async function verifyWebhookSignature(
 11:   payload: string,
 12:   signature: string,
 13:   appSecret: string
 14: ): Promise<boolean> {
 15:   if (!signature || !signature.startsWith('sha256=')) {
 16:     return false
 17:   }
 18: 
 19:   const expectedSig = signature.slice(7) // quitar 'sha256='
 20: 
 21:   const encoder = new TextEncoder()
 22:   const key = await crypto.subtle.importKey(
 23:     'raw',
 24:     encoder.encode(appSecret),
 25:     { name: 'HMAC', hash: 'SHA-256' },
 26:     false,
 27:     ['sign']
 28:   )
 29: 
 30:   const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
 31:   const computedSig = Array.from(new Uint8Array(sig))
 32:     .map((b) => b.toString(16).padStart(2, '0'))
 33:     .join('')
 34: 
 35:   return computedSig === expectedSig
 36: }
 37: 
 38: /**
 39:  * Descarga un archivo de media desde la Graph API de Meta.
 40:  * Retorna el ArrayBuffer del archivo + su MIME type.
 41:  */
 42: export async function downloadMedia(
 43:   mediaId: string,
 44:   accessToken: string
 45: ): Promise<{ buffer: ArrayBuffer; mimeType: string } | null> {
 46:   try {
 47:     // Paso 1: obtener la URL de descarga
 48:     const urlResponse = await fetch(
 49:       `https://graph.facebook.com/v21.0/${mediaId}`,
 50:       {
 51:         headers: { Authorization: `Bearer ${accessToken}` },
 52:       }
 53:     )
 54: 
 55:     if (!urlResponse.ok) {
 56:       console.error('[WhatsApp] Failed to get media URL:', urlResponse.status)
 57:       return null
 58:     }
 59: 
 60:     const { url, mime_type } = await urlResponse.json()
 61: 
 62:     // Paso 2: descargar el archivo binario
 63:     const mediaResponse = await fetch(url, {
 64:       headers: { Authorization: `Bearer ${accessToken}` },
 65:     })
 66: 
 67:     if (!mediaResponse.ok) {
 68:       console.error('[WhatsApp] Failed to download media:', mediaResponse.status)
 69:       return null
 70:     }
 71: 
 72:     const buffer = await mediaResponse.arrayBuffer()
 73:     return { buffer, mimeType: mime_type }
 74:   } catch (err) {
 75:     console.error('[WhatsApp] downloadMedia error:', err)
 76:     return null
 77:   }
 78: }
 79: 
 80: // ── Tipos del payload de WhatsApp ──────────────────────────────────────────
 81: 
 82: export interface WhatsAppWebhookPayload {
 83:   object: string
 84:   entry: WhatsAppEntry[]
 85: }
 86: 
 87: export interface WhatsAppEntry {
 88:   id: string
 89:   changes: WhatsAppChange[]
 90: }
 91: 
 92: export interface WhatsAppChange {
 93:   value: {
 94:     messaging_product: string
 95:     metadata: {
 96:       display_phone_number: string
 97:       phone_number_id: string
 98:     }
 99:     messages?: WhatsAppMessage[]
100:   }
101:   field: string
102: }
103: 
104: export interface WhatsAppMessage {
105:   from: string
106:   id: string
107:   timestamp: string
108:   type: 'text' | 'image' | 'document' | 'audio' | 'video'
109:   text?: { body: string }
110:   image?: {
111:     id: string
112:     mime_type: string
113:     caption?: string
114:   }
115: }
116: 
117: // ── Parser de keywords ──────────────────────────────────────────────────────
118: 
119: export interface ParsedTransaction {
120:   type: 'income' | 'expense'
121:   amount: number
122:   description: string
123: }
124: 
125: /**
126:  * Parsea un mensaje de WhatsApp buscando keywords conocidas.
127:  * Formato esperado: "{keyword} {monto} {descripción}"
128:  * Ejemplo: "gasto 500 renta casa" → { type: 'expense', amount: 500, description: 'renta casa' }
129:  */
130: export function parseMessageWithKeywords(
131:   message: string,
132:   keywords: Array<{ keyword: string; maps_to: 'income' | 'expense' }>
133: ): ParsedTransaction | null {
134:   const text = message.trim().toLowerCase()
135: 
136:   for (const kw of keywords) {
137:     if (text.startsWith(kw.keyword.toLowerCase())) {
138:       const rest = text.slice(kw.keyword.length).trim()
139: 
140:       // Buscar el monto (primer número en el texto restante)
141:       const amountMatch = rest.match(/^(\d+(?:\.\d{1,2})?)/)
142:       if (!amountMatch) continue
143: 
144:       const amount = parseFloat(amountMatch[1])
145:       if (isNaN(amount) || amount <= 0) continue
146: 
147:       const description = rest.slice(amountMatch[0].length).trim()
148: 
149:       return {
150:         type: kw.maps_to,
151:         amount,
152:         description: description || `${kw.keyword} via WhatsApp`,
153:       }
154:     }
155:   }
156: 
157:   return null
158: }
````

## File: backend/supabase/functions/transactions/index.ts
````typescript
  1: // ── Inline CORS ──
  2: const corsHeaders = {
  3:   'Access-Control-Allow-Origin': '*',
  4:   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  5:   'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  6: }
  7: function handleCors(req: Request): Response | null {
  8:   if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  9:   return null
 10: }
 11: 
 12: // ── Inline Rate Limit ──
 13: async function checkRateLimit(supabase: any, key: string, max = 60, window = 60) {
 14:   const { data, error } = await supabase.rpc('check_rate_limit', { p_key: key, p_max_requests: max, p_window_seconds: window })
 15:   if (error) return { allowed: true, headers: { 'X-RateLimit-Limit': String(max) } }
 16:   const r = data as { allowed: boolean; remaining: number; reset_at: string }
 17:   const h: Record<string, string> = { 'X-RateLimit-Limit': String(max), 'X-RateLimit-Remaining': String(r.remaining), 'X-RateLimit-Reset': r.reset_at }
 18:   if (!r.allowed) {
 19:     return { allowed: false, headers: h, response: new Response(
 20:       JSON.stringify({ code: 'RATE_LIMIT_EXCEEDED', message: `Try again after ${r.reset_at}` }),
 21:       { status: 429, headers: { ...corsHeaders, ...h, 'Content-Type': 'application/json', 'Retry-After': String(window) } }
 22:     )}
 23:   }
 24:   return { allowed: true, headers: h }
 25: }
 26: 
 27: import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
 28: 
 29: Deno.serve(async (req: Request) => {
 30:   const cors = handleCors(req)
 31:   if (cors) return cors
 32: 
 33:   try {
 34:     const authHeader = req.headers.get('Authorization')
 35:     if (!authHeader) {
 36:       return new Response(JSON.stringify({ code: 'UNAUTHORIZED', message: 'Missing authorization' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
 37:     }
 38: 
 39:     const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } })
 40:     const { data: { user }, error: authError } = await supabase.auth.getUser()
 41:     if (authError || !user) {
 42:       return new Response(JSON.stringify({ code: 'UNAUTHORIZED', message: 'Invalid token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
 43:     }
 44: 
 45:     const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
 46:     const rl = await checkRateLimit(admin, `user:tx:${user.id}`, 60, 60)
 47:     if (!rl.allowed && rl.response) return rl.response
 48: 
 49:     const url = new URL(req.url)
 50:     const parts = url.pathname.split('/').filter(Boolean)
 51:     const txId = parts.length > 1 ? parts[parts.length - 1] : null
 52:     const method = req.method
 53:     const rh = { ...corsHeaders, ...rl.headers, 'Content-Type': 'application/json' }
 54: 
 55:     // GET — listar transacciones (opcionalmente filtradas por venture_id)
 56:     if (method === 'GET') {
 57:       const ventureId = url.searchParams.get('venture_id')
 58:       let query = supabase.from('transactions').select('*').order('date', { ascending: false })
 59:       if (ventureId) query = query.eq('venture_id', ventureId)
 60:       const { data, error } = await query
 61:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
 62:       return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
 63:     }
 64: 
 65:     // POST — crear transacción
 66:     if (method === 'POST') {
 67:       const contentType = req.headers.get('content-type') || ''
 68:       let body: { venture_id: string; type: string; amount: number; description?: string; date: string; evidence_url?: string }
 69:       let evidenceUrl: string | null = null
 70: 
 71:       if (contentType.includes('multipart/form-data')) {
 72:         const fd = await req.formData()
 73:         body = {
 74:           venture_id: fd.get('venture_id') as string,
 75:           type: fd.get('type') as string,
 76:           amount: parseFloat(fd.get('amount') as string),
 77:           description: (fd.get('description') as string) || undefined,
 78:           date: fd.get('date') as string,
 79:         }
 80:         const file = fd.get('evidence') as File | null
 81:         if (file) {
 82:           const ext = file.name.split('.').pop() || 'jpg'
 83:           const path = `${user.id}/${body.venture_id}/${crypto.randomUUID()}.${ext}`
 84:           const { error: upErr } = await supabase.storage.from('evidence').upload(path, file, { contentType: file.type })
 85:           if (!upErr) evidenceUrl = path
 86:           else console.error('[Tx] Upload error:', upErr.message)
 87:         }
 88:       } else {
 89:         body = await req.json()
 90:       }
 91: 
 92:       if (!body.venture_id || !body.type || !body.amount || !body.date) {
 93:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'venture_id, type, amount, date required' }), { status: 400, headers: rh })
 94:       }
 95:       if (!['income', 'expense'].includes(body.type)) {
 96:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'type must be income or expense' }), { status: 400, headers: rh })
 97:       }
 98:       if (body.amount <= 0) {
 99:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'amount must be > 0' }), { status: 400, headers: rh })
100:       }
101: 
102:       // Verificar que el venture pertenece al usuario
103:       const { data: v, error: vErr } = await supabase.from('ventures').select('id').eq('id', body.venture_id).single()
104:       if (vErr || !v) {
105:         return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Venture not found' }), { status: 404, headers: rh })
106:       }
107: 
108:       const { data, error } = await supabase.from('transactions').insert({
109:         venture_id: body.venture_id, user_id: user.id, type: body.type,
110:         amount: body.amount, description: body.description || null,
111:         date: body.date, evidence_url: evidenceUrl || body.evidence_url || null,
112:       }).select().single()
113: 
114:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
115: 
116:       // Recalcular totales del venture
117:       const { data: totals } = await admin.from('transactions').select('type, amount').eq('venture_id', body.venture_id)
118:       if (totals) {
119:         const invested = totals.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)
120:         const returned = totals.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0)
121:         await admin.from('ventures').update({ invested, returned }).eq('id', body.venture_id)
122:       }
123: 
124:       return new Response(JSON.stringify({ data }), { status: 201, headers: rh })
125:     }
126: 
127:     // DELETE — eliminar transacción
128:     if (method === 'DELETE') {
129:       if (!txId || txId === 'transactions') {
130:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Transaction ID required' }), { status: 400, headers: rh })
131:       }
132: 
133:       const { data: existing } = await supabase.from('transactions').select('evidence_url, venture_id').eq('id', txId).single()
134:       const { error } = await supabase.from('transactions').delete().eq('id', txId)
135:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
136: 
137:       // Limpiar evidencia de Storage
138:       if (existing?.evidence_url) {
139:         await supabase.storage.from('evidence').remove([existing.evidence_url]).catch(() => {})
140:       }
141: 
142:       // Recalcular totales del venture
143:       if (existing?.venture_id) {
144:         const { data: totals } = await admin.from('transactions').select('type, amount').eq('venture_id', existing.venture_id)
145:         if (totals) {
146:           const invested = totals.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)
147:           const returned = totals.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0)
148:           await admin.from('ventures').update({ invested, returned }).eq('id', existing.venture_id)
149:         }
150:       }
151: 
152:       return new Response(JSON.stringify({ message: 'Transaction deleted' }), { status: 200, headers: rh })
153:     }
154: 
155:     return new Response(JSON.stringify({ code: 'METHOD_NOT_ALLOWED' }), { status: 405, headers: rh })
156:   } catch (err) {
157:     console.error('[Transactions] Error:', err)
158:     return new Response(JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Unexpected error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
159:   }
160: })
````

## File: backend/supabase/functions/user-settings/index.ts
````typescript
  1: const corsHeaders = {
  2:   'Access-Control-Allow-Origin': '*',
  3:   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  4:   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  5: }
  6: function handleCors(req: Request): Response | null {
  7:   if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  8:   return null
  9: }
 10: 
 11: async function checkRateLimit(supabase: any, key: string, max = 30, window = 60) {
 12:   const { data, error } = await supabase.rpc('check_rate_limit', { p_key: key, p_max_requests: max, p_window_seconds: window })
 13:   if (error) return { allowed: true, headers: { 'X-RateLimit-Limit': String(max) } }
 14:   const r = data as { allowed: boolean; remaining: number; reset_at: string }
 15:   const h: Record<string, string> = { 'X-RateLimit-Limit': String(max), 'X-RateLimit-Remaining': String(r.remaining), 'X-RateLimit-Reset': r.reset_at }
 16:   if (!r.allowed) {
 17:     return { allowed: false, headers: h, response: new Response(
 18:       JSON.stringify({ code: 'RATE_LIMIT_EXCEEDED', message: `Try again after ${r.reset_at}` }),
 19:       { status: 429, headers: { ...corsHeaders, ...h, 'Content-Type': 'application/json', 'Retry-After': String(window) } }
 20:     )}
 21:   }
 22:   return { allowed: true, headers: h }
 23: }
 24: 
 25: import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
 26: 
 27: Deno.serve(async (req: Request) => {
 28:   const cors = handleCors(req)
 29:   if (cors) return cors
 30: 
 31:   try {
 32:     const authHeader = req.headers.get('Authorization')
 33:     if (!authHeader) {
 34:       return new Response(JSON.stringify({ code: 'UNAUTHORIZED', message: 'Missing authorization' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
 35:     }
 36: 
 37:     const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } })
 38:     const { data: { user }, error: authError } = await supabase.auth.getUser()
 39:     if (authError || !user) {
 40:       return new Response(JSON.stringify({ code: 'UNAUTHORIZED', message: 'Invalid token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
 41:     }
 42: 
 43:     const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
 44:     const rl = await checkRateLimit(admin, `user:settings:${user.id}`, 30, 60)
 45:     if (!rl.allowed && rl.response) return rl.response
 46: 
 47:     const url = new URL(req.url)
 48:     const path = url.pathname
 49:     const method = req.method
 50:     const rh = { ...corsHeaders, ...rl.headers, 'Content-Type': 'application/json' }
 51: 
 52:     // ================================================================
 53:     // INTEGRATIONS: /user-settings/integrations/whatsapp
 54:     // ================================================================
 55:     if (path.includes('integrations')) {
 56: 
 57:       // GET — obtener config de WhatsApp del usuario
 58:       if (method === 'GET') {
 59:         const { data, error } = await supabase
 60:           .from('user_integrations')
 61:           .select('id, provider, config, is_active, created_at, updated_at')
 62:           .eq('provider', 'whatsapp')
 63:           .single()
 64: 
 65:         if (error || !data) {
 66:           return new Response(JSON.stringify({
 67:             data: null,
 68:             message: 'No WhatsApp integration configured',
 69:             webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-webhook`,
 70:           }), { status: 200, headers: rh })
 71:         }
 72: 
 73:         return new Response(JSON.stringify({
 74:           data: {
 75:             ...data,
 76:             webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-webhook`,
 77:           },
 78:         }), { status: 200, headers: rh })
 79:       }
 80: 
 81:       // PUT — guardar/actualizar config de WhatsApp
 82:       if (method === 'PUT') {
 83:         const body = await req.json()
 84:         const { phone_number_id, access_token, verify_token, default_venture_id } = body
 85: 
 86:         if (!phone_number_id || !access_token || !verify_token) {
 87:           return new Response(JSON.stringify({
 88:             code: 'VALIDATION_ERROR',
 89:             message: 'phone_number_id, access_token, and verify_token are required',
 90:           }), { status: 400, headers: rh })
 91:         }
 92: 
 93:         // Encriptar el access_token
 94:         const encryptionKey = Deno.env.get('ENCRYPTION_KEY') || 'finova-default-key'
 95:         const { data: encrypted } = await admin.rpc('encrypt_token', {
 96:           p_token: access_token,
 97:           p_key: encryptionKey,
 98:         })
 99: 
100:         // Upsert: crear o actualizar
101:         const { data, error } = await admin
102:           .from('user_integrations')
103:           .upsert({
104:             user_id: user.id,
105:             provider: 'whatsapp',
106:             config: {
107:               phone_number_id,
108:               verify_token,
109:               default_venture_id: default_venture_id || null,
110:             },
111:             encrypted_token: encrypted,
112:             is_active: true,
113:           }, { onConflict: 'user_id,provider' })
114:           .select('id, provider, config, is_active, updated_at')
115:           .single()
116: 
117:         if (error) {
118:           return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
119:         }
120: 
121:         return new Response(JSON.stringify({
122:           data,
123:           webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-webhook`,
124:           message: 'WhatsApp integration saved. Use the webhook_url in your Meta Business dashboard.',
125:         }), { status: 200, headers: rh })
126:       }
127: 
128:       // DELETE — desactivar integración
129:       if (method === 'DELETE') {
130:         const { error } = await supabase
131:           .from('user_integrations')
132:           .update({ is_active: false })
133:           .eq('provider', 'whatsapp')
134: 
135:         if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
136:         return new Response(JSON.stringify({ message: 'WhatsApp integration deactivated' }), { status: 200, headers: rh })
137:       }
138:     }
139: 
140:     // ================================================================
141:     // KEYWORDS: /user-settings/keywords
142:     // ================================================================
143:     if (path.includes('keywords')) {
144:       const parts = path.split('/').filter(Boolean)
145:       const keywordId = parts[parts.length - 1] !== 'keywords' ? parts[parts.length - 1] : null
146: 
147:       // GET — listar keywords del usuario
148:       if (method === 'GET') {
149:         const { data, error } = await supabase
150:           .from('whatsapp_keywords')
151:           .select('*')
152:           .order('maps_to')
153:           .order('keyword')
154: 
155:         if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
156:         return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
157:       }
158: 
159:       // POST — agregar keyword
160:       if (method === 'POST') {
161:         const body = await req.json()
162:         if (!body.keyword || !body.maps_to) {
163:           return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'keyword and maps_to required' }), { status: 400, headers: rh })
164:         }
165:         if (!['income', 'expense'].includes(body.maps_to)) {
166:           return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'maps_to must be income or expense' }), { status: 400, headers: rh })
167:         }
168: 
169:         const { data, error } = await supabase
170:           .from('whatsapp_keywords')
171:           .insert({ user_id: user.id, keyword: body.keyword.toLowerCase().trim(), maps_to: body.maps_to })
172:           .select()
173:           .single()
174: 
175:         if (error) {
176:           if (error.code === '23505') {
177:             return new Response(JSON.stringify({ code: 'DUPLICATE', message: 'Keyword already exists' }), { status: 409, headers: rh })
178:           }
179:           return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
180:         }
181:         return new Response(JSON.stringify({ data }), { status: 201, headers: rh })
182:       }
183: 
184:       // DELETE — eliminar keyword
185:       if (method === 'DELETE') {
186:         if (!keywordId) {
187:           return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Keyword ID required' }), { status: 400, headers: rh })
188:         }
189:         const { error } = await supabase.from('whatsapp_keywords').delete().eq('id', keywordId)
190:         if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
191:         return new Response(JSON.stringify({ message: 'Keyword deleted' }), { status: 200, headers: rh })
192:       }
193:     }
194: 
195:     return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Use /user-settings/integrations or /user-settings/keywords' }), { status: 404, headers: rh })
196:   } catch (err) {
197:     console.error('[UserSettings] Error:', err)
198:     return new Response(JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Unexpected error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
199:   }
200: })
````

## File: backend/supabase/functions/ventures/index.ts
````typescript
  1: // ── Inline CORS ──
  2: const corsHeaders = {
  3:   'Access-Control-Allow-Origin': '*',
  4:   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  5:   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  6: }
  7: 
  8: function handleCors(req: Request): Response | null {
  9:   if (req.method === 'OPTIONS') {
 10:     return new Response('ok', { headers: corsHeaders })
 11:   }
 12:   return null
 13: }
 14: 
 15: // ── Inline Rate Limit ──
 16: interface RateLimitResult { allowed: boolean; remaining: number; reset_at: string }
 17: 
 18: async function checkRateLimit(
 19:   supabase: any,
 20:   key: string,
 21:   maxRequests = 60,
 22:   windowSeconds = 60
 23: ): Promise<{ allowed: boolean; headers: Record<string, string>; response?: Response }> {
 24:   const { data, error } = await supabase.rpc('check_rate_limit', {
 25:     p_key: key, p_max_requests: maxRequests, p_window_seconds: windowSeconds,
 26:   })
 27:   if (error) {
 28:     console.error('[RateLimit] Error:', error.message)
 29:     return { allowed: true, headers: { 'X-RateLimit-Limit': String(maxRequests) } }
 30:   }
 31:   const result = data as RateLimitResult
 32:   const headers: Record<string, string> = {
 33:     'X-RateLimit-Limit': String(maxRequests),
 34:     'X-RateLimit-Remaining': String(result.remaining),
 35:     'X-RateLimit-Reset': result.reset_at,
 36:   }
 37:   if (!result.allowed) {
 38:     return {
 39:       allowed: false, headers,
 40:       response: new Response(
 41:         JSON.stringify({ code: 'RATE_LIMIT_EXCEEDED', message: `Try again after ${result.reset_at}` }),
 42:         { status: 429, headers: { ...corsHeaders, ...headers, 'Content-Type': 'application/json', 'Retry-After': String(windowSeconds) } }
 43:       ),
 44:     }
 45:   }
 46:   return { allowed: true, headers }
 47: }
 48: 
 49: // ── Main Handler ──
 50: import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
 51: 
 52: Deno.serve(async (req: Request) => {
 53:   const cors = handleCors(req)
 54:   if (cors) return cors
 55: 
 56:   try {
 57:     const authHeader = req.headers.get('Authorization')
 58:     console.log('[Ventures] Auth Header present:', !!authHeader)
 59:     if (authHeader) {
 60:       console.log('[Ventures] Auth Header prefix:', authHeader.slice(0, 15))
 61:     }
 62:     if (!authHeader) {
 63:       return new Response(
 64:         JSON.stringify({ code: 'UNAUTHORIZED', message: 'Missing authorization header' }),
 65:         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
 66:       )
 67:     }
 68: 
 69:     const supabase = createClient(
 70:       Deno.env.get('SUPABASE_URL')!,
 71:       Deno.env.get('SUPABASE_ANON_KEY')!,
 72:       { global: { headers: { Authorization: authHeader } } }
 73:     )
 74: 
 75:     const { data: { user }, error: authError } = await supabase.auth.getUser()
 76:     if (authError || !user) {
 77:       console.error('[Ventures] Auth Error:', authError?.message || 'No user found')
 78:       return new Response(
 79:         JSON.stringify({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' }),
 80:         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
 81:       )
 82:     }
 83: 
 84:     const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
 85:     const rl = await checkRateLimit(admin, `user:ventures:${user.id}`, 60, 60)
 86:     if (!rl.allowed && rl.response) return rl.response
 87: 
 88:     const url = new URL(req.url)
 89:     const parts = url.pathname.split('/').filter(Boolean)
 90:     const ventureId = parts.length > 1 ? parts[parts.length - 1] : null
 91:     const method = req.method
 92:     const rh = { ...corsHeaders, ...rl.headers, 'Content-Type': 'application/json' }
 93: 
 94:     // GET
 95:     if (method === 'GET') {
 96:       if (ventureId && ventureId !== 'ventures') {
 97:         const { data, error } = await supabase.from('ventures').select('*').eq('id', ventureId).single()
 98:         if (error) return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Venture not found' }), { status: 404, headers: rh })
 99:         return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
100:       }
101:       const { data, error } = await supabase.from('ventures').select('*').order('created_at', { ascending: false })
102:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
103:       return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
104:     }
105: 
106:     // POST
107:     if (method === 'POST') {
108:       const body = await req.json()
109:       if (!body.name || !body.type) {
110:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'name and type are required' }), { status: 400, headers: rh })
111:       }
112:       const validTypes = ['software', 'physical', 'investment', 'mixed']
113:       if (!validTypes.includes(body.type)) {
114:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: `type must be: ${validTypes.join(', ')}` }), { status: 400, headers: rh })
115:       }
116:       const { data, error } = await supabase.from('ventures').insert({
117:         user_id: user.id, name: body.name, type: body.type,
118:         status: body.status || 'active', invested: body.invested || 0,
119:         returned: body.returned || 0, currency: body.currency || 'MXN',
120:         start_date: body.start_date || new Date().toISOString().split('T')[0],
121:         end_date: body.end_date || null, notes: body.notes || null,
122:       }).select().single()
123:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
124:       return new Response(JSON.stringify({ data }), { status: 201, headers: rh })
125:     }
126: 
127:     // PUT
128:     if (method === 'PUT') {
129:       if (!ventureId || ventureId === 'ventures') {
130:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Venture ID required in path' }), { status: 400, headers: rh })
131:       }
132:       const body = await req.json()
133:       const { id: _id, ...fields } = body
134:       const { data, error } = await supabase.from('ventures').update(fields).eq('id', ventureId).select().single()
135:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
136:       return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
137:     }
138: 
139:     // DELETE
140:     if (method === 'DELETE') {
141:       if (!ventureId || ventureId === 'ventures') {
142:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Venture ID required in path' }), { status: 400, headers: rh })
143:       }
144:       const { error } = await supabase.from('ventures').delete().eq('id', ventureId)
145:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
146:       return new Response(JSON.stringify({ message: 'Venture deleted' }), { status: 200, headers: rh })
147:     }
148: 
149:     return new Response(JSON.stringify({ code: 'METHOD_NOT_ALLOWED', message: `${method} not supported` }), { status: 405, headers: rh })
150:   } catch (err) {
151:     console.error('[Ventures] Error:', err)
152:     return new Response(JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Unexpected error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
153:   }
154: })
````

## File: backend/supabase/functions/whatsapp-webhook/index.ts
````typescript
  1: // WhatsApp Webhook — Multi-tenant receiver
  2: // JWT deshabilitado: Meta no envía JWT, usa HMAC signature
  3: 
  4: const corsHeaders = {
  5:   'Access-Control-Allow-Origin': '*',
  6:   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-hub-signature-256',
  7:   'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  8: }
  9: 
 10: // HMAC verification
 11: async function verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
 12:   if (!signature || !signature.startsWith('sha256=')) return false
 13:   const expected = signature.slice(7)
 14:   const enc = new TextEncoder()
 15:   const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
 16:   const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
 17:   const computed = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
 18:   return computed === expected
 19: }
 20: 
 21: // Parse keywords from message
 22: function parseMessage(
 23:   text: string,
 24:   keywords: Array<{ keyword: string; maps_to: 'income' | 'expense' }>
 25: ): { type: 'income' | 'expense'; amount: number; description: string } | null {
 26:   const msg = text.trim().toLowerCase()
 27:   for (const kw of keywords) {
 28:     if (msg.startsWith(kw.keyword.toLowerCase())) {
 29:       const rest = msg.slice(kw.keyword.length).trim()
 30:       const match = rest.match(/^(\d+(?:\.\d{1,2})?)/)
 31:       if (!match) continue
 32:       const amount = parseFloat(match[1])
 33:       if (isNaN(amount) || amount <= 0) continue
 34:       const desc = rest.slice(match[0].length).trim()
 35:       return { type: kw.maps_to, amount, description: desc || `${kw.keyword} via WhatsApp` }
 36:     }
 37:   }
 38:   return null
 39: }
 40: 
 41: import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
 42: 
 43: Deno.serve(async (req: Request) => {
 44:   if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
 45: 
 46:   const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
 47:   const rh = { ...corsHeaders, 'Content-Type': 'application/json' }
 48: 
 49:   try {
 50:     // ============================================================
 51:     // GET: Webhook verification challenge (Meta setup)
 52:     // ============================================================
 53:     if (req.method === 'GET') {
 54:       const url = new URL(req.url)
 55:       const mode = url.searchParams.get('hub.mode')
 56:       const token = url.searchParams.get('hub.verify_token')
 57:       const challenge = url.searchParams.get('hub.challenge')
 58: 
 59:       if (mode !== 'subscribe' || !token || !challenge) {
 60:         return new Response('Invalid verification request', { status: 400 })
 61:       }
 62: 
 63:       // Buscar un usuario con este verify_token
 64:       const { data: integration } = await admin
 65:         .from('user_integrations')
 66:         .select('id')
 67:         .eq('provider', 'whatsapp')
 68:         .eq('is_active', true)
 69:         .filter('config->>verify_token', 'eq', token)
 70:         .single()
 71: 
 72:       if (!integration) {
 73:         return new Response('Verification token not found', { status: 403 })
 74:       }
 75: 
 76:       // Meta espera el challenge en texto plano
 77:       return new Response(challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } })
 78:     }
 79: 
 80:     // ============================================================
 81:     // POST: Recibir mensajes de WhatsApp
 82:     // ============================================================
 83:     if (req.method === 'POST') {
 84:       const rawBody = await req.text()
 85: 
 86:       // Rate limit por IP (webhooks no tienen user auth)
 87:       const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
 88:       const { data: rlData } = await admin.rpc('check_rate_limit', {
 89:         p_key: `webhook:${clientIP}`,
 90:         p_max_requests: 30,
 91:         p_window_seconds: 60,
 92:       })
 93:       if (rlData && !rlData.allowed) {
 94:         return new Response(JSON.stringify({ code: 'RATE_LIMIT_EXCEEDED' }), { status: 429, headers: rh })
 95:       }
 96: 
 97:       // Parsear payload
 98:       let payload: any
 99:       try {
100:         payload = JSON.parse(rawBody)
101:       } catch {
102:         return new Response('Invalid JSON', { status: 400 })
103:       }
104: 
105:       // Verificar que es un evento de mensajes de WhatsApp
106:       if (payload.object !== 'whatsapp_business_account') {
107:         return new Response('OK', { status: 200 })
108:       }
109: 
110:       // Responder 200 inmediatamente (Meta espera respuesta rápida)
111:       // y procesar en background
112:       const entry = payload.entry?.[0]
113:       const change = entry?.changes?.[0]
114:       const value = change?.value
115: 
116:       if (!value?.messages?.[0]) {
117:         // Status update, no message — acknowledge
118:         return new Response('OK', { status: 200 })
119:       }
120: 
121:       const message = value.messages[0]
122:       const phoneNumberId = value.metadata?.phone_number_id
123: 
124:       if (!phoneNumberId) {
125:         return new Response('OK', { status: 200 })
126:       }
127: 
128:       // Identify tenant by phone_number_id
129:       const { data: integration } = await admin
130:         .from('user_integrations')
131:         .select('id, user_id, config, encrypted_token')
132:         .eq('provider', 'whatsapp')
133:         .eq('is_active', true)
134:         .filter('config->>phone_number_id', 'eq', phoneNumberId)
135:         .single()
136: 
137:       if (!integration) {
138:         console.warn(`[WA] No integration found for phone_number_id: ${phoneNumberId}`)
139:         return new Response('OK', { status: 200 })
140:       }
141: 
142:       // Verify HMAC if app secret is configured
143:       const appSecret = Deno.env.get('WHATSAPP_APP_SECRET')
144:       if (appSecret) {
145:         const signature = req.headers.get('x-hub-signature-256') || ''
146:         const valid = await verifySignature(rawBody, signature, appSecret)
147:         if (!valid) {
148:           console.error('[WA] Invalid HMAC signature')
149:           return new Response('Invalid signature', { status: 403 })
150:         }
151:       }
152: 
153:       const userId = integration.user_id
154:       const config = integration.config as { phone_number_id: string; verify_token: string; default_venture_id?: string }
155: 
156:       // Get user's keywords
157:       const { data: keywords } = await admin
158:         .from('whatsapp_keywords')
159:         .select('keyword, maps_to')
160:         .eq('user_id', userId)
161: 
162:       if (!keywords || keywords.length === 0) {
163:         console.warn(`[WA] No keywords for user ${userId}`)
164:         return new Response('OK', { status: 200 })
165:       }
166: 
167:       // Extract text from message
168:       let textContent = ''
169:       if (message.type === 'text' && message.text?.body) {
170:         textContent = message.text.body
171:       } else if (message.type === 'image' && message.image?.caption) {
172:         textContent = message.image.caption
173:       } else {
174:         // Unsupported message type, skip
175:         return new Response('OK', { status: 200 })
176:       }
177: 
178:       // Parse with keywords
179:       const parsed = parseMessage(textContent, keywords as Array<{ keyword: string; maps_to: 'income' | 'expense' }>)
180:       if (!parsed) {
181:         console.log(`[WA] No keyword match for: "${textContent}"`)
182:         return new Response('OK', { status: 200 })
183:       }
184: 
185:       // Determine venture
186:       let ventureId = config.default_venture_id
187:       if (!ventureId) {
188:         // Find first active venture of the user
189:         const { data: venture } = await admin
190:           .from('ventures')
191:           .select('id')
192:           .eq('user_id', userId)
193:           .eq('status', 'active')
194:           .order('created_at', { ascending: false })
195:           .limit(1)
196:           .single()
197: 
198:         if (!venture) {
199:           console.warn(`[WA] No active venture for user ${userId}`)
200:           return new Response('OK', { status: 200 })
201:         }
202:         ventureId = venture.id
203:       }
204: 
205:       // Handle image if present
206:       let evidenceUrl: string | null = null
207:       if (message.type === 'image' && message.image?.id) {
208:         try {
209:           // Decrypt access token
210:           const encKey = Deno.env.get('ENCRYPTION_KEY') || 'finova-default-key'
211:           const { data: token } = await admin.rpc('decrypt_token', {
212:             p_encrypted: integration.encrypted_token,
213:             p_key: encKey,
214:           })
215: 
216:           if (token) {
217:             // Get media URL
218:             const mediaRes = await fetch(`https://graph.facebook.com/v21.0/${message.image.id}`, {
219:               headers: { Authorization: `Bearer ${token}` },
220:             })
221:             if (mediaRes.ok) {
222:               const { url } = await mediaRes.json()
223:               // Download image
224:               const imgRes = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
225:               if (imgRes.ok) {
226:                 const buffer = await imgRes.arrayBuffer()
227:                 const ext = (message.image.mime_type || 'image/jpeg').split('/')[1] || 'jpg'
228:                 const filePath = `${userId}/${ventureId}/${crypto.randomUUID()}.${ext}`
229:                 const { error: upErr } = await admin.storage.from('evidence').upload(filePath, buffer, {
230:                   contentType: message.image.mime_type || 'image/jpeg',
231:                 })
232:                 if (!upErr) evidenceUrl = filePath
233:               }
234:             }
235:           }
236:         } catch (err) {
237:           console.error('[WA] Image processing error:', err)
238:           // Don't block transaction creation if image fails
239:         }
240:       }
241: 
242:       // Create transaction
243:       const { data: tx, error: txError } = await admin
244:         .from('transactions')
245:         .insert({
246:           venture_id: ventureId,
247:           user_id: userId,
248:           type: parsed.type,
249:           amount: parsed.amount,
250:           description: parsed.description,
251:           date: new Date().toISOString().split('T')[0],
252:           evidence_url: evidenceUrl,
253:         })
254:         .select()
255:         .single()
256: 
257:       if (txError) {
258:         console.error('[WA] Transaction insert error:', txError.message)
259:         return new Response('OK', { status: 200 })
260:       }
261: 
262:       // Recalculate venture totals
263:       const { data: totals } = await admin.from('transactions').select('type, amount').eq('venture_id', ventureId)
264:       if (totals) {
265:         const invested = totals.filter((t: any) => t.type === 'expense').reduce((s: number, t: any) => s + Number(t.amount), 0)
266:         const returned = totals.filter((t: any) => t.type === 'income').reduce((s: number, t: any) => s + Number(t.amount), 0)
267:         await admin.from('ventures').update({ invested, returned }).eq('id', ventureId)
268:       }
269: 
270:       console.log(`[WA] Transaction created: ${parsed.type} $${parsed.amount} - ${parsed.description}`)
271:       return new Response('OK', { status: 200 })
272:     }
273: 
274:     return new Response('Method not allowed', { status: 405 })
275:   } catch (err) {
276:     console.error('[WA Webhook] Error:', err)
277:     return new Response('OK', { status: 200 }) // Always 200 for Meta
278:   }
279: })
````

## File: frontend/src/app/Layout.tsx
````typescript
  1: // app/Layout.tsx — Layout principal monocromático premium
  2: import { useState } from 'react'
  3: import { NavLink, Outlet, useNavigate } from 'react-router-dom'
  4: import { useAuth } from '@/features/auth/hooks/useAuth'
  5: 
  6: const navItems = [
  7:   {
  8:     to: '/dashboard',
  9:     label: 'Dashboard',
 10:     icon: (
 11:       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
 12:         <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
 13:       </svg>
 14:     ),
 15:   },
 16:   {
 17:     to: '/ventures',
 18:     label: 'Ventures',
 19:     icon: (
 20:       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
 21:         <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
 22:       </svg>
 23:     ),
 24:   },
 25: ]
 26: 
 27: export function Layout() {
 28:   const { user, signOut } = useAuth()
 29:   const navigate = useNavigate()
 30:   const [settingsOpen, setSettingsOpen] = useState(false)
 31:   const [sidebarOpen, setSidebarOpen] = useState(false)
 32: 
 33:   const handleSignOut = async () => {
 34:     await signOut()
 35:     navigate('/auth')
 36:   }
 37: 
 38:   return (
 39:     <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', backgroundColor: '#fafafa' }}>
 40:       {/* ── Top Header ── */}
 41:       <header style={{
 42:         position: 'sticky',
 43:         top: 0,
 44:         zIndex: 50,
 45:         backgroundColor: '#0a0a0a',
 46:         borderBottom: '1px solid #1a1a1a',
 47:       }}>
 48:         <div style={{
 49:           display: 'flex',
 50:           alignItems: 'center',
 51:           justifyContent: 'space-between',
 52:           height: '64px',
 53:           padding: '0 20px',
 54:           maxWidth: '1440px',
 55:           margin: '0 auto',
 56:           width: '100%',
 57:         }}>
 58:           {/* Left: Hamburger & Brand */}
 59:           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
 60:             {/* Menu button */}
 61:             <button
 62:               onClick={() => setSidebarOpen(!sidebarOpen)}
 63:               style={{
 64:                 padding: '8px',
 65:                 marginLeft: '-8px',
 66:                 borderRadius: '8px',
 67:                 color: '#d4d4d4',
 68:                 background: 'none',
 69:                 border: 'none',
 70:                 cursor: 'pointer',
 71:                 display: 'flex',
 72:                 transition: 'all 0.15s',
 73:                 backgroundColor: sidebarOpen ? 'rgba(255,255,255,0.1)' : 'transparent',
 74:               }}
 75:               onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fafafa' }}
 76:               onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = sidebarOpen ? 'rgba(255,255,255,0.1)' : 'transparent'; e.currentTarget.style.color = '#d4d4d4' }}
 77:             >
 78:               {sidebarOpen ? (
 79:                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
 80:                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
 81:                 </svg>
 82:               ) : (
 83:                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
 84:                   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
 85:                 </svg>
 86:               )}
 87:             </button>
 88: 
 89:             {/* Brand */}
 90:             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
 91:               <div style={{
 92:                 width: '32px',
 93:                 height: '32px',
 94:                 borderRadius: '8px',
 95:                 backgroundColor: 'rgba(255,255,255,0.06)',
 96:                 border: '1px solid rgba(255,255,255,0.08)',
 97:                 display: 'flex',
 98:                 alignItems: 'center',
 99:                 justifyContent: 'center',
100:               }}>
101:                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#fafafa" strokeWidth={1.5}>
102:                   <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
103:                 </svg>
104:               </div>
105:               <h1 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0, color: '#fafafa' }}>Finova</h1>
106:             </div>
107:           </div>
108: 
109:           {/* Right: User Settings */}
110:           <div style={{ position: 'relative' }}>
111:             <button
112:               onClick={() => setSettingsOpen(!settingsOpen)}
113:               style={{
114:                 display: 'flex',
115:                 alignItems: 'center',
116:                 gap: '8px',
117:                 padding: '4px 8px',
118:                 borderRadius: '32px',
119:                 transition: 'all 0.15s',
120:                 color: '#d4d4d4',
121:                 backgroundColor: settingsOpen ? 'rgba(255,255,255,0.1)' : 'transparent',
122:                 border: '1px solid rgba(255,255,255,0.05)',
123:                 cursor: 'pointer',
124:               }}
125:               onMouseEnter={(e) => { if (!settingsOpen) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fafafa' } }}
126:               onMouseLeave={(e) => { if (!settingsOpen) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#d4d4d4' } }}
127:             >
128:               <div style={{
129:                 width: '24px',
130:                 height: '24px',
131:                 borderRadius: '50%',
132:                 backgroundColor: 'rgba(255,255,255,0.1)',
133:                 display: 'flex',
134:                 alignItems: 'center',
135:                 justifyContent: 'center',
136:                 fontSize: '11px',
137:                 fontWeight: 600,
138:                 color: '#fafafa',
139:               }}>
140:                 {user?.email?.[0]?.toUpperCase() || 'U'}
141:               </div>
142:               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
143:                 <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
144:               </svg>
145:             </button>
146: 
147:             {/* Settings dropdown panel */}
148:             {settingsOpen && (
149:               <>
150:                 <div
151:                   style={{ position: 'fixed', inset: 0, zIndex: 40 }}
152:                   onClick={() => setSettingsOpen(false)}
153:                 />
154:                 <div className="animate-slide-down" style={{
155:                   position: 'absolute',
156:                   right: 0,
157:                   top: '100%',
158:                   marginTop: '12px',
159:                   width: '280px',
160:                   backgroundColor: '#0a0a0a',
161:                   borderRadius: '14px',
162:                   boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px #262626',
163:                   zIndex: 50,
164:                   overflow: 'hidden',
165:                 }}>
166:                   <div style={{ padding: '16px', borderBottom: '1px solid #1a1a1a' }}>
167:                     <p style={{
168:                       fontSize: '13px',
169:                       fontWeight: 500,
170:                       color: '#fafafa',
171:                       overflow: 'hidden',
172:                       textOverflow: 'ellipsis',
173:                       whiteSpace: 'nowrap',
174:                       margin: 0,
175:                     }}>
176:                       {user?.email || 'Usuario'}
177:                     </p>
178:                     <p style={{ fontSize: '11px', color: '#737373', margin: '2px 0 0' }}>Integraciones y preferencias</p>
179:                   </div>
180:                   <nav style={{ padding: '8px' }}>
181:                     <NavLink
182:                       to="/settings/whatsapp"
183:                       onClick={() => setSettingsOpen(false)}
184:                       style={{
185:                         display: 'flex',
186:                         alignItems: 'center',
187:                         gap: '12px',
188:                         padding: '10px 12px',
189:                         borderRadius: '10px',
190:                         fontSize: '14px',
191:                         color: '#d4d4d4',
192:                         textDecoration: 'none',
193:                         transition: 'background-color 0.15s',
194:                       }}
195:                       onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)' }}
196:                       onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
197:                     >
198:                       <span style={{
199:                         width: '32px',
200:                         height: '32px',
201:                         borderRadius: '8px',
202:                         backgroundColor: '#f0fdf4',
203:                         display: 'flex',
204:                         alignItems: 'center',
205:                         justifyContent: 'center',
206:                       }}>
207:                         <svg className="w-4 h-4" style={{ color: '#16a34a' }} viewBox="0 0 24 24" fill="currentColor">
208:                           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
209:                         </svg>
210:                       </span>
211:                       <div>
212:                         <p style={{ fontWeight: 500, margin: 0 }}>WhatsApp</p>
213:                       </div>
214:                     </NavLink>
215:                     <NavLink
216:                       to="/settings/keywords"
217:                       onClick={() => setSettingsOpen(false)}
218:                       style={{
219:                         display: 'flex',
220:                         alignItems: 'center',
221:                         gap: '12px',
222:                         padding: '10px 12px',
223:                         borderRadius: '10px',
224:                         fontSize: '14px',
225:                         color: '#d4d4d4',
226:                         textDecoration: 'none',
227:                         transition: 'background-color 0.15s',
228:                       }}
229:                       onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)' }}
230:                       onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
231:                     >
232:                       <span style={{
233:                         width: '32px',
234:                         height: '32px',
235:                         borderRadius: '8px',
236:                         backgroundColor: 'rgba(255,255,255,0.1)',
237:                         display: 'flex',
238:                         alignItems: 'center',
239:                         justifyContent: 'center',
240:                       }}>
241:                         <svg className="w-4 h-4" style={{ color: '#fafafa' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
242:                           <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
243:                           <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
244:                         </svg>
245:                       </span>
246:                       <div>
247:                         <p style={{ fontWeight: 500, margin: 0 }}>Palabras clave</p>
248:                       </div>
249:                     </NavLink>
250:                   </nav>
251:                   
252:                   <div style={{ padding: '8px', borderTop: '1px solid #1a1a1a' }}>
253:                     <button
254:                       onClick={handleSignOut}
255:                       style={{
256:                         width: '100%',
257:                         padding: '10px 12px',
258:                         borderRadius: '10px',
259:                         color: '#ef4444',
260:                         background: 'none',
261:                         border: 'none',
262:                         cursor: 'pointer',
263:                         transition: 'all 0.15s',
264:                         display: 'flex',
265:                         alignItems: 'center',
266:                         gap: '12px',
267:                         fontSize: '14px',
268:                         fontWeight: 500,
269:                       }}
270:                       onMouseEnter={(e) => {
271:                         e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
272:                       }}
273:                       onMouseLeave={(e) => {
274:                         e.currentTarget.style.backgroundColor = 'transparent'
275:                       }}
276:                     >
277:                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
278:                         <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
279:                       </svg>
280:                       Cerrar sesión
281:                     </button>
282:                   </div>
283:                 </div>
284:               </>
285:             )}
286:           </div>
287:         </div>
288:       </header>
289: 
290:       {/* ── Slide-Down Navigation Panel ── */}
291:       {sidebarOpen && (
292:         <div style={{
293:           position: 'fixed',
294:           top: '64px',
295:           left: 0,
296:           right: 0,
297:           bottom: 0,
298:           zIndex: 40,
299:         }}>
300:           {/* Backdrop */}
301:           <div
302:             className="animate-fade-in"
303:             style={{
304:               position: 'absolute',
305:               inset: 0,
306:               backgroundColor: 'rgba(0,0,0,0.5)',
307:               backdropFilter: 'blur(8px)',
308:             }}
309:             onClick={() => setSidebarOpen(false)}
310:           />
311:           {/* Menu */}
312:           <div className="animate-panel-slide" style={{
313:             position: 'absolute',
314:             top: 0,
315:             left: 0,
316:             right: 0,
317:             backgroundColor: '#0a0a0a',
318:             borderBottomLeftRadius: '24px',
319:             borderBottomRightRadius: '24px',
320:             borderBottom: '1px solid #262626',
321:             boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
322:             overflow: 'hidden',
323:           }}>
324:             <nav style={{ padding: '24px' }}>
325:               <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '1400px', margin: '0 auto' }}>
326:                 <p style={{ fontSize: '11px', fontWeight: 600, color: '#525252', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '12px' }}>
327:                   Navegación
328:                 </p>
329:                 {navItems.map((item) => (
330:                   <NavLink
331:                     key={item.to}
332:                     to={item.to}
333:                     onClick={() => setSidebarOpen(false)}
334:                     style={({ isActive }) => ({
335:                       display: 'flex',
336:                       alignItems: 'center',
337:                       gap: '16px',
338:                       padding: '14px 16px',
339:                       borderRadius: '16px',
340:                       fontSize: '15px',
341:                       fontWeight: 500,
342:                       textDecoration: 'none',
343:                       transition: 'all 0.15s ease',
344:                       color: isActive ? '#fafafa' : '#a3a3a3',
345:                       backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
346:                     })}
347:                     onMouseEnter={(e) => {
348:                       if (e.currentTarget.style.backgroundColor !== 'rgba(255, 255, 255, 0.08)') {
349:                         e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
350:                         e.currentTarget.style.color = '#fafafa';
351:                       }
352:                     }}
353:                     onMouseLeave={(e) => {
354:                       if (e.currentTarget.style.backgroundColor !== 'rgba(255, 255, 255, 0.08)') {
355:                         e.currentTarget.style.backgroundColor = 'transparent';
356:                         e.currentTarget.style.color = '#a3a3a3';
357:                       }
358:                     }}
359:                   >
360:                     <div style={{ color: 'inherit' }}>{item.icon}</div>
361:                     {item.label}
362:                   </NavLink>
363:                 ))}
364:               </div>
365:             </nav>
366:           </div>
367:         </div>
368:       )}
369: 
370:       {/* ── Main Content ── */}
371:       <main style={{ flex: 1, padding: '24px 16px', position: 'relative', zIndex: 10 }}>
372:         <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
373:           <Outlet />
374:         </div>
375:       </main>
376:     </div>
377:   )
378: }
````

## File: frontend/src/app/ProtectedRoute.tsx
````typescript
 1: // app/ProtectedRoute.tsx — Protección de rutas con auth
 2: import { Navigate } from 'react-router-dom'
 3: import { useAuth } from '@/features/auth/hooks/useAuth'
 4: 
 5: export function ProtectedRoute({ children }: { children: React.ReactNode }) {
 6:   const { isAuthenticated, loading } = useAuth()
 7: 
 8:   if (loading) {
 9:     return (
10:       <div className="min-h-dvh flex items-center justify-center bg-surface-50">
11:         <div className="text-center animate-fade-in">
12:           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
13:             <svg className="w-6 h-6 text-white animate-spin" viewBox="0 0 24 24" fill="none">
14:               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
15:               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
16:             </svg>
17:           </div>
18:           <p className="text-sm text-surface-500">Cargando sesión…</p>
19:         </div>
20:       </div>
21:     )
22:   }
23: 
24:   if (!isAuthenticated) {
25:     return <Navigate to="/auth" replace />
26:   }
27: 
28:   return <>{children}</>
29: }
````

## File: frontend/src/features/auth/hooks/useAuth.ts
````typescript
 1: // features/auth/hooks/useAuth.ts — Hook central de autenticación
 2: import { useEffect } from 'react'
 3: import { supabase } from '@/shared/lib/supabase'
 4: import { useAuthStore } from '../store'
 5: 
 6: export function useAuth() {
 7:   const { user, session, loading, setAuth, clear } = useAuthStore()
 8: 
 9:   useEffect(() => {
10:     // Obtener sesión actual
11:     supabase.auth.getSession().then(({ data: { session: s } }) => {
12:       setAuth(s?.user ?? null, s)
13:     })
14: 
15:     // Escuchar cambios de auth
16:     const { data: { subscription } } = supabase.auth.onAuthStateChange(
17:       (_event, s) => {
18:         setAuth(s?.user ?? null, s)
19:       }
20:     )
21: 
22:     return () => subscription.unsubscribe()
23:   }, [setAuth])
24: 
25:   const signInWithEmail = async (email: string, password: string) => {
26:     const { error } = await supabase.auth.signInWithPassword({ email, password })
27:     if (error) throw error
28:   }
29: 
30:   const signUpWithEmail = async (email: string, password: string) => {
31:     const { error } = await supabase.auth.signUp({ email, password })
32:     if (error) throw error
33:   }
34: 
35:   const signInWithGoogle = async () => {
36:     const { error } = await supabase.auth.signInWithOAuth({
37:       provider: 'google',
38:       options: {
39:         redirectTo: `${window.location.origin}/dashboard`,
40:       },
41:     })
42:     if (error) throw error
43:   }
44: 
45:   const signOut = async () => {
46:     await supabase.auth.signOut()
47:     clear()
48:   }
49: 
50:   return {
51:     user,
52:     session,
53:     loading,
54:     isAuthenticated: !!user,
55:     signInWithEmail,
56:     signUpWithEmail,
57:     signInWithGoogle,
58:     signOut,
59:   }
60: }
````

## File: frontend/src/features/auth/pages/AuthPage.tsx
````typescript
 1: // pages/AuthPage.tsx — shell de auth
 2: import { useEffect } from 'react'
 3: import { useNavigate } from 'react-router-dom'
 4: import { AuthForm } from '@/features/auth/components/AuthForm'
 5: import { useAuth } from '@/features/auth/hooks/useAuth'
 6: 
 7: export default function AuthPage() {
 8:   const { isAuthenticated, loading } = useAuth()
 9:   const navigate = useNavigate()
10: 
11:   useEffect(() => {
12:     if (!loading && isAuthenticated) {
13:       navigate('/dashboard', { replace: true })
14:     }
15:   }, [isAuthenticated, loading, navigate])
16: 
17:   return <AuthForm />
18: }
````

## File: frontend/src/features/auth/store.ts
````typescript
 1: // features/auth/store.ts — Zustand store para autenticación
 2: import { create } from 'zustand'
 3: import type { User, Session } from '@supabase/supabase-js'
 4: 
 5: interface AuthState {
 6:   user: User | null
 7:   session: Session | null
 8:   loading: boolean
 9:   setAuth: (user: User | null, session: Session | null) => void
10:   setLoading: (loading: boolean) => void
11:   clear: () => void
12: }
13: 
14: export const useAuthStore = create<AuthState>((set) => ({
15:   user: null,
16:   session: null,
17:   loading: true,
18:   setAuth: (user, session) => set({ user, session, loading: false }),
19:   setLoading: (loading) => set({ loading }),
20:   clear: () => set({ user: null, session: null, loading: false }),
21: }))
````

## File: frontend/src/features/auth/types.ts
````typescript
1: // apps/web/src/features/auth/types.ts
2: // Re-exporta tipos de auth desde la fuente de verdad (backend)
3: 
4: export type { AuthUser } from '@backend/_shared/types'
````

## File: frontend/src/features/dashboard/components/MetricCard.tsx
````typescript
 1: // features/dashboard/components/MetricCard.tsx — Monochrome premium card
 2: interface MetricCardProps {
 3:   title: string
 4:   value: string
 5:   subtitle?: string
 6:   icon: React.ReactNode
 7:   trend?: { value: string; positive: boolean }
 8:   delay?: number
 9: }
10: 
11: export function MetricCard({ title, value, subtitle, icon, trend, delay = 0 }: MetricCardProps) {
12:   return (
13:     <div
14:       className="animate-fade-in"
15:       style={{
16:         backgroundColor: '#fff',
17:         borderRadius: '14px',
18:         padding: '20px',
19:         border: '1px solid #e5e5e5',
20:         transition: 'box-shadow 0.2s, border-color 0.2s',
21:         animationDelay: `${delay}ms`,
22:         cursor: 'default',
23:       }}
24:       onMouseEnter={(e) => {
25:         e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)'
26:         e.currentTarget.style.borderColor = '#d4d4d4'
27:       }}
28:       onMouseLeave={(e) => {
29:         e.currentTarget.style.boxShadow = 'none'
30:         e.currentTarget.style.borderColor = '#e5e5e5'
31:       }}
32:     >
33:       <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
34:         <div style={{
35:           width: '40px',
36:           height: '40px',
37:           borderRadius: '10px',
38:           backgroundColor: '#f5f5f5',
39:           display: 'flex',
40:           alignItems: 'center',
41:           justifyContent: 'center',
42:           color: '#525252',
43:         }}>
44:           {icon}
45:         </div>
46:         {trend && (
47:           <span style={{
48:             display: 'inline-flex',
49:             alignItems: 'center',
50:             gap: '2px',
51:             fontSize: '12px',
52:             fontWeight: 500,
53:             padding: '2px 8px',
54:             borderRadius: '999px',
55:             backgroundColor: trend.positive ? '#f0fdf4' : '#fef2f2',
56:             color: trend.positive ? '#16a34a' : '#dc2626',
57:           }}>
58:             <svg style={{ width: '12px', height: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
59:               <path strokeLinecap="round" strokeLinejoin="round"
60:                 d={trend.positive ? 'M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25' : 'M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25'} />
61:             </svg>
62:             {trend.value}
63:           </span>
64:         )}
65:       </div>
66:       <p style={{ fontSize: '24px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>{value}</p>
67:       <p style={{ fontSize: '13px', color: '#737373', margin: '2px 0 0' }}>{title}</p>
68:       {subtitle && <p style={{ fontSize: '12px', color: '#a3a3a3', margin: '4px 0 0' }}>{subtitle}</p>}
69:     </div>
70:   )
71: }
````

## File: frontend/src/features/dashboard/components/MonthlyChart.tsx
````typescript
 1: // features/dashboard/components/MonthlyChart.tsx — Monochrome bar chart
 2: import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
 3: import type { Transaction } from '@backend/_shared/types'
 4: 
 5: interface MonthlyChartProps {
 6:   transactions: Transaction[]
 7: }
 8: 
 9: interface MonthData {
10:   month: string
11:   income: number
12:   expense: number
13: }
14: 
15: const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
16: 
17: function aggregateByMonth(transactions: Transaction[]): MonthData[] {
18:   const now = new Date()
19:   const months: MonthData[] = []
20: 
21:   for (let i = 5; i >= 0; i--) {
22:     const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
23:     const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
24:     const month = MONTH_NAMES[d.getMonth()]
25: 
26:     const income = transactions
27:       .filter((t) => t.type === 'income' && t.date.startsWith(key))
28:       .reduce((sum, t) => sum + t.amount, 0)
29:     const expense = transactions
30:       .filter((t) => t.type === 'expense' && t.date.startsWith(key))
31:       .reduce((sum, t) => sum + t.amount, 0)
32: 
33:     months.push({ month, income, expense })
34:   }
35: 
36:   return months
37: }
38: 
39: export function MonthlyChart({ transactions }: MonthlyChartProps) {
40:   const data = aggregateByMonth(transactions)
41: 
42:   return (
43:     <div
44:       className="animate-fade-in"
45:       style={{
46:         backgroundColor: '#fff',
47:         borderRadius: '14px',
48:         padding: '20px',
49:         border: '1px solid #e5e5e5',
50:         animationDelay: '200ms',
51:       }}
52:     >
53:       <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 16px' }}>
54:         Flujo mensual — Últimos 6 meses
55:       </h3>
56:       <div style={{ height: '256px' }}>
57:         <ResponsiveContainer width="100%" height="100%">
58:           <BarChart data={data} barGap={4}>
59:             <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
60:             <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} />
61:             <YAxis
62:               tick={{ fontSize: 12, fill: '#737373' }}
63:               axisLine={false}
64:               tickLine={false}
65:               tickFormatter={(val: number) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : String(val)}
66:             />
67:             <Tooltip
68:               contentStyle={{
69:                 backgroundColor: '#fff',
70:                 border: '1px solid #e5e5e5',
71:                 borderRadius: '10px',
72:                 fontSize: '13px',
73:                 boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
74:               }}
75:               formatter={(value, name) => [
76:                 `$${Number(value).toLocaleString('es-MX')}`,
77:                 name === 'income' ? 'Ingresos' : 'Gastos',
78:               ]}
79:             />
80:             <Legend
81:               formatter={(value: string) => (value === 'income' ? 'Ingresos' : 'Gastos')}
82:               wrapperStyle={{ fontSize: '12px' }}
83:             />
84:             <Bar dataKey="income" fill="#171717" radius={[6, 6, 0, 0]} />
85:             <Bar dataKey="expense" fill="#d4d4d4" radius={[6, 6, 0, 0]} />
86:           </BarChart>
87:         </ResponsiveContainer>
88:       </div>
89:     </div>
90:   )
91: }
````

## File: frontend/src/features/dashboard/components/RedVentures.tsx
````typescript
  1: // features/dashboard/components/RedVentures.tsx — Monochrome premium
  2: import { formatCurrency } from '@/shared/lib/formatters'
  3: import { calculateROI } from '@/features/ventures/utils'
  4: import type { Venture } from '@backend/_shared/types'
  5: 
  6: interface RedVenturesProps {
  7:   ventures: Venture[]
  8: }
  9: 
 10: export function RedVentures({ ventures }: RedVenturesProps) {
 11:   const red = ventures.filter((v) => v.invested > v.returned && v.status !== 'closed')
 12: 
 13:   if (red.length === 0) {
 14:     return (
 15:       <div
 16:         className="animate-fade-in"
 17:         style={{
 18:           backgroundColor: '#fff',
 19:           borderRadius: '14px',
 20:           padding: '20px',
 21:           border: '1px solid #e5e5e5',
 22:           animationDelay: '300ms',
 23:         }}
 24:       >
 25:         <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 12px' }}>Ventures en rojo</h3>
 26:         <div style={{
 27:           display: 'flex',
 28:           alignItems: 'center',
 29:           gap: '10px',
 30:           padding: '14px',
 31:           borderRadius: '10px',
 32:           backgroundColor: '#f0fdf4',
 33:           color: '#16a34a',
 34:           fontSize: '13px',
 35:           fontWeight: 500,
 36:         }}>
 37:           <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
 38:             <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 39:           </svg>
 40:           ¡Todos tus ventures están en positivo!
 41:         </div>
 42:       </div>
 43:     )
 44:   }
 45: 
 46:   return (
 47:     <div
 48:       className="animate-fade-in"
 49:       style={{
 50:         backgroundColor: '#fff',
 51:         borderRadius: '14px',
 52:         padding: '20px',
 53:         border: '1px solid #e5e5e5',
 54:         animationDelay: '300ms',
 55:       }}
 56:     >
 57:       <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
 58:         <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: 0 }}>Ventures en rojo</h3>
 59:         <span style={{
 60:           padding: '1px 8px',
 61:           borderRadius: '999px',
 62:           backgroundColor: '#fef2f2',
 63:           color: '#dc2626',
 64:           fontSize: '11px',
 65:           fontWeight: 500,
 66:         }}>
 67:           {red.length}
 68:         </span>
 69:       </div>
 70:       <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
 71:         {red.map((v) => {
 72:           const roi = calculateROI(v.invested, v.returned)
 73:           const loss = v.invested - v.returned
 74:           return (
 75:             <div key={v.id} style={{
 76:               display: 'flex',
 77:               alignItems: 'center',
 78:               justifyContent: 'space-between',
 79:               padding: '10px 12px',
 80:               borderRadius: '10px',
 81:               backgroundColor: '#fafafa',
 82:               transition: 'background-color 0.15s',
 83:             }}
 84:               onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
 85:               onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fafafa' }}
 86:             >
 87:               <div style={{ minWidth: 0 }}>
 88:                 <p style={{ fontSize: '13px', fontWeight: 500, color: '#171717', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</p>
 89:                 <p style={{ fontSize: '12px', color: '#737373', margin: '2px 0 0' }}>
 90:                   Falta: {formatCurrency(loss)}
 91:                 </p>
 92:               </div>
 93:               <span style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626', flexShrink: 0 }}>
 94:                 {roi.toFixed(1)}%
 95:               </span>
 96:             </div>
 97:           )
 98:         })}
 99:       </div>
100:     </div>
101:   )
102: }
````

## File: frontend/src/features/dashboard/pages/DashboardPage.tsx
````typescript
1: // pages/DashboardPage.tsx — shell de la feature dashboard
2: import { DashboardView } from '@/features/dashboard/components/DashboardView'
3: 
4: export default function DashboardPage() {
5:   return <DashboardView />
6: }
````

## File: frontend/src/features/settings/pages/SettingsKeywordsPage.tsx
````typescript
1: // pages/SettingsKeywordsPage.tsx — shell
2: import { KeywordsManager } from '@/features/settings/components/KeywordsManager'
3: 
4: export default function SettingsKeywordsPage() {
5:   return <KeywordsManager />
6: }
````

## File: frontend/src/features/settings/pages/SettingsWhatsAppPage.tsx
````typescript
1: // pages/SettingsWhatsAppPage.tsx — shell
2: import { WhatsAppSettings } from '@/features/settings/components/WhatsAppSettings'
3: 
4: export default function SettingsWhatsAppPage() {
5:   return <WhatsAppSettings />
6: }
````

## File: frontend/src/features/transactions/components/TransactionForm.tsx
````typescript
  1: import { useState, useRef, type FormEvent } from 'react'
  2: import { SlidePanel } from '@/shared/components/SlidePanel'
  3: 
  4: interface TransactionFormProps {
  5:   ventureId: string
  6:   onSubmit: (input: { venture_id: string; type: 'income' | 'expense'; amount: number; description: string; date: string }, evidence?: File) => Promise<void>
  7:   onClose: () => void
  8: }
  9: 
 10: const inputStyle: React.CSSProperties = {
 11:   width: '100%',
 12:   padding: '10px 14px',
 13:   borderRadius: '8px',
 14:   backgroundColor: '#171717',
 15:   border: '1px solid #2a2a2a',
 16:   color: '#fafafa',
 17:   fontSize: '14px',
 18:   outline: 'none',
 19:   fontFamily: 'inherit',
 20:   transition: 'border-color 0.15s, box-shadow 0.15s',
 21: }
 22: 
 23: export function TransactionForm({ ventureId, onSubmit, onClose }: TransactionFormProps) {
 24:   const [type, setType] = useState<'income' | 'expense'>('expense')
 25:   const [amount, setAmount] = useState('')
 26:   const [description, setDescription] = useState('')
 27:   const [date, setDate] = useState(new Date().toISOString().split('T')[0])
 28:   const [evidence, setEvidence] = useState<File | null>(null)
 29:   const [submitting, setSubmitting] = useState(false)
 30:   const [error, setError] = useState<string | null>(null)
 31:   const fileRef = useRef<HTMLInputElement>(null)
 32: 
 33:   const handleSubmit = async (e: FormEvent) => {
 34:     e.preventDefault()
 35:     const numAmount = parseFloat(amount)
 36:     if (!amount || isNaN(numAmount) || numAmount <= 0) { setError('Monto inválido'); return }
 37:     if (!date) { setError('Fecha requerida'); return }
 38: 
 39:     setError(null)
 40:     setSubmitting(true)
 41:     try {
 42:       await onSubmit(
 43:         {
 44:           venture_id: ventureId,
 45:           type,
 46:           amount: numAmount,
 47:           description: description.trim() || `${type === 'income' ? 'Ingreso' : 'Gasto'} manual`,
 48:           date,
 49:         },
 50:         evidence || undefined
 51:       )
 52:       onClose()
 53:     } catch (err: unknown) {
 54:       setError(err instanceof Error ? err.message : 'Error inesperado')
 55:     } finally {
 56:       setSubmitting(false)
 57:     }
 58:   }
 59: 
 60:   return (
 61:     <SlidePanel isOpen={true} onClose={onClose} title="Nueva transacción">
 62:       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 63:         {/* Type toggle */}
 64:         <div style={{ display: 'flex', borderRadius: '10px', backgroundColor: '#171717', padding: '4px', border: '1px solid #2a2a2a' }}>
 65:           {(['expense', 'income'] as const).map((t) => (
 66:             <button
 67:               key={t}
 68:               type="button"
 69:               onClick={() => setType(t)}
 70:               style={{
 71:                 flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
 72:                 border: 'none', cursor: 'pointer', fontFamily: 'inherit',
 73:                 transition: 'all 0.15s',
 74:                 backgroundColor: type === t ? '#262626' : 'transparent',
 75:                 color: type === t
 76:                   ? (t === 'expense' ? '#ef4444' : '#22c55e')
 77:                   : '#a3a3a3',
 78:                 boxShadow: type === t ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
 79:               }}
 80:             >
 81:               {t === 'expense' ? '💸 Gasto' : '💰 Ingreso'}
 82:             </button>
 83:           ))}
 84:         </div>
 85: 
 86:         {/* Amount */}
 87:         <div>
 88:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Monto</label>
 89:           <div style={{ position: 'relative' }}>
 90:             <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#737373', fontSize: '14px' }}>$</span>
 91:             <input
 92:               type="number" step="0.01" min="0" value={amount}
 93:               onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
 94:               style={{ ...inputStyle, paddingLeft: '28px' }}
 95:               onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
 96:               onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
 97:             />
 98:           </div>
 99:         </div>
100: 
101:         {/* Description */}
102:         <div>
103:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Descripción</label>
104:           <input
105:             value={description} onChange={(e) => setDescription(e.target.value)}
106:             placeholder="Ej: Pago de servidor, Venta de producto..."
107:             style={inputStyle}
108:             onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
109:             onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
110:           />
111:         </div>
112: 
113:         {/* Date */}
114:         <div>
115:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Fecha</label>
116:           <input
117:             type="date" value={date} onChange={(e) => setDate(e.target.value)}
118:             style={{...inputStyle, colorScheme: 'dark'}}
119:             onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
120:             onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
121:           />
122:         </div>
123: 
124:         {/* Evidence */}
125:         <div>
126:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>
127:             Evidencia <span style={{ color: '#737373' }}>(opcional)</span>
128:           </label>
129:           <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={(e) => setEvidence(e.target.files?.[0] || null)} style={{ display: 'none' }} />
130:           <button
131:             type="button"
132:             onClick={() => fileRef.current?.click()}
133:             style={{
134:               width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
135:               padding: '12px 14px', borderRadius: '8px',
136:               border: '1px dashed #404040', backgroundColor: 'transparent',
137:               fontSize: '13px', color: '#a3a3a3',
138:               cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
139:             }}
140:             onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#737373'; e.currentTarget.style.color = '#fafafa' }}
141:             onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#404040'; e.currentTarget.style.color = '#a3a3a3' }}
142:           >
143:             <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
144:               <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
145:             </svg>
146:             {evidence ? evidence.name : 'Subir foto o PDF'}
147:           </button>
148:         </div>
149: 
150:         {error && (
151:           <div className="animate-fade-in" style={{
152:             display: 'flex',
153:             alignItems: 'flex-start',
154:             gap: '10px',
155:             padding: '12px',
156:             borderRadius: '8px',
157:             backgroundColor: 'rgba(239,68,68,0.1)',
158:             border: '1px solid rgba(239,68,68,0.2)',
159:             fontSize: '13px',
160:             color: '#f87171',
161:           }}>
162:             <svg width="16" height="16" style={{ flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
163:               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
164:             </svg>
165:             {error}
166:           </div>
167:         )}
168: 
169:         <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
170:           <button
171:             type="button" onClick={onClose}
172:             style={{
173:               flex: 1, padding: '10px 16px', borderRadius: '10px', border: '1px solid #2a2a2a',
174:               backgroundColor: 'transparent', color: '#a3a3a3', fontSize: '14px', fontWeight: 500,
175:               cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
176:             }}
177:             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#171717'; e.currentTarget.style.color = '#fafafa' }}
178:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a3a3a3' }}
179:           >
180:             Cancelar
181:           </button>
182:           <button
183:             type="submit" disabled={submitting}
184:             style={{
185:               flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none',
186:               backgroundColor: '#fafafa', color: '#0a0a0a', fontSize: '14px', fontWeight: 600,
187:               cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
188:               opacity: submitting ? 0.5 : 1, display: 'flex', alignItems: 'center',
189:               justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
190:             }}
191:             onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#e5e5e5' }}
192:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fafafa' }}
193:             onMouseDown={(e) => { if (!submitting) e.currentTarget.style.transform = 'scale(0.98)' }}
194:             onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
195:           >
196:             {submitting && (
197:               <svg className="animate-spin" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
198:                 <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
199:                 <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
200:               </svg>
201:             )}
202:             Registrar transacción
203:           </button>
204:         </div>
205:       </form>
206:     </SlidePanel>
207:   )
208: }
````

## File: frontend/src/features/transactions/types.ts
````typescript
1: // apps/web/src/features/transactions/types.ts
2: // Re-exporta tipos de transactions desde la fuente de verdad (backend)
3: 
4: export type {
5:   Transaction,
6:   TransactionType,
7:   CreateTransactionInput,
8: } from '@backend/_shared/types'
````

## File: frontend/src/features/ventures/components/VentureCard.tsx
````typescript
  1: // features/ventures/components/VentureCard.tsx — Monochrome premium card
  2: import { useNavigate } from 'react-router-dom'
  3: import { formatCurrency, formatROI } from '@/shared/lib/formatters'
  4: import { VENTURE_TYPE_LABELS, VENTURE_STATUS_LABELS } from '@/shared/lib/constants'
  5: import { calculateROI, ventureHealth } from '../utils'
  6: import type { Venture } from '../types'
  7: 
  8: interface VentureCardProps {
  9:   venture: Venture
 10:   delay?: number
 11: }
 12: 
 13: const statusDotColors: Record<string, string> = {
 14:   active: '#22c55e',
 15:   paused: '#eab308',
 16:   closed: '#a3a3a3',
 17:   idea: '#737373',
 18: }
 19: 
 20: export function VentureCard({ venture, delay = 0 }: VentureCardProps) {
 21:   const navigate = useNavigate()
 22:   const roi = calculateROI(venture.invested, venture.returned)
 23:   const health = ventureHealth(roi)
 24: 
 25:   const healthBg = health === 'positive' ? '#f0fdf4' : health === 'negative' ? '#fef2f2' : '#f5f5f5'
 26:   const healthColor = health === 'positive' ? '#16a34a' : health === 'negative' ? '#dc2626' : '#525252'
 27: 
 28:   return (
 29:     <button
 30:       onClick={() => navigate(`/ventures/${venture.id}`)}
 31:       className="animate-fade-in"
 32:       style={{
 33:         width: '100%',
 34:         textAlign: 'left',
 35:         backgroundColor: '#fff',
 36:         borderRadius: '14px',
 37:         padding: '20px',
 38:         border: '1px solid #e5e5e5',
 39:         cursor: 'pointer',
 40:         transition: 'all 0.2s ease',
 41:         animationDelay: `${delay}ms`,
 42:         display: 'block',
 43:         fontFamily: 'inherit',
 44:       }}
 45:       onMouseEnter={(e) => {
 46:         e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
 47:         e.currentTarget.style.borderColor = '#d4d4d4'
 48:         e.currentTarget.style.transform = 'translateY(-2px)'
 49:       }}
 50:       onMouseLeave={(e) => {
 51:         e.currentTarget.style.boxShadow = 'none'
 52:         e.currentTarget.style.borderColor = '#e5e5e5'
 53:         e.currentTarget.style.transform = 'translateY(0)'
 54:       }}
 55:     >
 56:       {/* Header */}
 57:       <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
 58:         <div style={{ minWidth: 0, flex: 1 }}>
 59:           <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
 60:             {venture.name}
 61:           </h3>
 62:           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
 63:             <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusDotColors[venture.status] || '#a3a3a3' }} />
 64:             <span style={{ fontSize: '12px', color: '#737373' }}>{VENTURE_STATUS_LABELS[venture.status]}</span>
 65:             <span style={{ fontSize: '12px', color: '#d4d4d4' }}>·</span>
 66:             <span style={{ fontSize: '12px', color: '#737373' }}>{VENTURE_TYPE_LABELS[venture.type]}</span>
 67:           </div>
 68:         </div>
 69:         <span style={{
 70:           fontSize: '13px',
 71:           fontWeight: 700,
 72:           padding: '4px 10px',
 73:           borderRadius: '8px',
 74:           backgroundColor: healthBg,
 75:           color: healthColor,
 76:         }}>
 77:           {formatROI(roi)}
 78:         </span>
 79:       </div>
 80: 
 81:       {/* Financials */}
 82:       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
 83:         <div>
 84:           <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 2px' }}>Invertido</p>
 85:           <p style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>{formatCurrency(venture.invested)}</p>
 86:         </div>
 87:         <div>
 88:           <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 2px' }}>Retornado</p>
 89:           <p style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>{formatCurrency(venture.returned)}</p>
 90:         </div>
 91:       </div>
 92: 
 93:       {/* Progress bar */}
 94:       <div style={{ marginTop: '12px' }}>
 95:         <div style={{ height: '4px', backgroundColor: '#f5f5f5', borderRadius: '999px', overflow: 'hidden' }}>
 96:           <div
 97:             style={{
 98:               height: '100%',
 99:               borderRadius: '999px',
100:               transition: 'width 0.5s ease',
101:               backgroundColor: health === 'positive' ? '#22c55e' : health === 'negative' ? '#ef4444' : '#a3a3a3',
102:               width: `${Math.min(100, venture.invested > 0 ? (venture.returned / venture.invested) * 100 : 0)}%`,
103:             }}
104:           />
105:         </div>
106:       </div>
107:     </button>
108:   )
109: }
````

## File: frontend/src/features/ventures/components/VentureForm.tsx
````typescript
  1: import { useState, type FormEvent } from 'react'
  2: import type { CreateVentureInput, VentureType, VentureStatus, Venture } from '../types'
  3: import { VENTURE_TYPE_LABELS, VENTURE_STATUS_LABELS } from '@/shared/lib/constants'
  4: import { SlidePanel } from '@/shared/components/SlidePanel'
  5: 
  6: interface VentureFormProps {
  7:   onSubmit: (input: CreateVentureInput) => Promise<void>
  8:   onClose: () => void
  9:   venture?: Venture
 10:   title?: string
 11: }
 12: 
 13: const inputStyle: React.CSSProperties = {
 14:   width: '100%',
 15:   padding: '10px 14px',
 16:   borderRadius: '8px',
 17:   backgroundColor: '#171717',
 18:   border: '1px solid #2a2a2a',
 19:   color: '#fafafa',
 20:   fontSize: '14px',
 21:   outline: 'none',
 22:   fontFamily: 'inherit',
 23:   transition: 'border-color 0.15s, box-shadow 0.15s',
 24: }
 25: 
 26: export function VentureForm({ onSubmit, onClose, venture, title }: VentureFormProps) {
 27:   const formTitle = title || (venture ? 'Editar venture' : 'Nuevo venture')
 28:   const [name, setName] = useState(venture?.name || '')
 29:   const [type, setType] = useState<VentureType>(venture?.type || 'software')
 30:   const [status, setStatus] = useState<VentureStatus>(venture?.status || 'idea')
 31:   const [invested, setInvested] = useState(venture?.invested?.toString() || '0')
 32:   const [returned, setReturned] = useState(venture?.returned?.toString() || '0')
 33:   const [notes, setNotes] = useState(venture?.notes || '')
 34:   const [submitting, setSubmitting] = useState(false)
 35:   const [error, setError] = useState<string | null>(null)
 36: 
 37:   const handleSubmit = async (e: FormEvent) => {
 38:     e.preventDefault()
 39:     if (!name.trim()) { setError('Nombre es requerido'); return }
 40:     setError(null)
 41:     setSubmitting(true)
 42:     try {
 43:       await onSubmit({
 44:         name: name.trim(),
 45:         type,
 46:         status,
 47:         invested: parseFloat(invested) || 0,
 48:         returned: parseFloat(returned) || 0,
 49:         notes: notes.trim() || undefined,
 50:       })
 51:       onClose()
 52:     } catch (err: unknown) {
 53:       setError(err instanceof Error ? err.message : 'Error inesperado')
 54:     } finally {
 55:       setSubmitting(false)
 56:     }
 57:   }
 58: 
 59:   return (
 60:     <SlidePanel isOpen={true} onClose={onClose} title={formTitle}>
 61:       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 62:         <div>
 63:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Nombre</label>
 64:           <input
 65:             value={name}
 66:             onChange={(e) => setName(e.target.value)}
 67:             placeholder="Ej: Mi tienda online"
 68:             style={inputStyle}
 69:             onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
 70:             onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
 71:           />
 72:         </div>
 73: 
 74:         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
 75:           <div>
 76:             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Tipo</label>
 77:             <select
 78:               value={type}
 79:               onChange={(e) => setType(e.target.value as VentureType)}
 80:               style={{ ...inputStyle, cursor: 'pointer' }}
 81:               onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
 82:               onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
 83:             >
 84:               {Object.entries(VENTURE_TYPE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
 85:             </select>
 86:           </div>
 87:           <div>
 88:             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Estado</label>
 89:             <select
 90:               value={status}
 91:               onChange={(e) => setStatus(e.target.value as VentureStatus)}
 92:               style={{ ...inputStyle, cursor: 'pointer' }}
 93:               onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
 94:               onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
 95:             >
 96:               {Object.entries(VENTURE_STATUS_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
 97:             </select>
 98:           </div>
 99:         </div>
100: 
101:         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
102:           <div>
103:             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Invertido ($)</label>
104:             <input
105:               type="number"
106:               step="0.01"
107:               min="0"
108:               value={invested}
109:               onChange={(e) => setInvested(e.target.value)}
110:               style={inputStyle}
111:               onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
112:               onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
113:             />
114:           </div>
115:           <div>
116:             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Retornado ($)</label>
117:             <input
118:               type="number"
119:               step="0.01"
120:               min="0"
121:               value={returned}
122:               onChange={(e) => setReturned(e.target.value)}
123:               style={inputStyle}
124:               onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
125:               onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
126:             />
127:           </div>
128:         </div>
129: 
130:         <div>
131:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>
132:             Notas <span style={{ color: '#737373' }}>(opcional)</span>
133:           </label>
134:           <textarea
135:             value={notes}
136:             onChange={(e) => setNotes(e.target.value)}
137:             placeholder="Notas sobre este venture..."
138:             rows={3}
139:             style={{ ...inputStyle, resize: 'vertical' }}
140:             onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
141:             onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
142:           />
143:         </div>
144: 
145:         {error && (
146:           <div className="animate-fade-in" style={{
147:             display: 'flex',
148:             alignItems: 'flex-start',
149:             gap: '10px',
150:             padding: '12px',
151:             borderRadius: '8px',
152:             backgroundColor: 'rgba(239,68,68,0.1)',
153:             border: '1px solid rgba(239,68,68,0.2)',
154:             fontSize: '13px',
155:             color: '#f87171',
156:           }}>
157:             <svg width="16" height="16" style={{ flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
158:               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
159:             </svg>
160:             {error}
161:           </div>
162:         )}
163: 
164:         <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
165:           <button
166:             type="button"
167:             onClick={onClose}
168:             style={{
169:               flex: 1, padding: '10px 16px', borderRadius: '10px', border: '1px solid #2a2a2a',
170:               backgroundColor: 'transparent', color: '#a3a3a3', fontSize: '14px', fontWeight: 500,
171:               cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
172:             }}
173:             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#171717'; e.currentTarget.style.color = '#fafafa' }}
174:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a3a3a3' }}
175:           >
176:             Cancelar
177:           </button>
178:           <button
179:             type="submit"
180:             disabled={submitting}
181:             style={{
182:               flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none',
183:               backgroundColor: '#fafafa', color: '#0a0a0a', fontSize: '14px', fontWeight: 600,
184:               cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
185:               opacity: submitting ? 0.5 : 1, display: 'flex', alignItems: 'center',
186:               justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
187:             }}
188:             onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#e5e5e5' }}
189:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fafafa' }}
190:             onMouseDown={(e) => { if (!submitting) e.currentTarget.style.transform = 'scale(0.98)' }}
191:             onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
192:           >
193:             {submitting && (
194:               <svg className="animate-spin" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
195:                 <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
196:                 <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
197:               </svg>
198:             )}
199:             Guardar venture
200:           </button>
201:         </div>
202:       </form>
203:     </SlidePanel>
204:   )
205: }
````

## File: frontend/src/features/ventures/components/VenturesList.tsx
````typescript
  1: // features/ventures/components/VenturesList.tsx — Lista de ventures monochrome
  2: import { useState } from 'react'
  3: import { useVentures } from '../hooks/useVentures'
  4: import { VentureCard } from './VentureCard'
  5: import { VentureForm } from './VentureForm'
  6: import type { CreateVentureInput } from '../types'
  7: 
  8: export function VenturesList() {
  9:   const { ventures, loading, error, createVenture } = useVentures()
 10:   const [showForm, setShowForm] = useState(false)
 11:   const [filter, setFilter] = useState<string>('all')
 12: 
 13:   const filtered = filter === 'all'
 14:     ? ventures
 15:     : ventures.filter((v) => v.status === filter)
 16: 
 17:   const handleCreate = async (input: CreateVentureInput) => {
 18:     await createVenture(input)
 19:   }
 20: 
 21:   const filters = [
 22:     { key: 'all', label: 'Todos' },
 23:     { key: 'active', label: 'Activos' },
 24:     { key: 'paused', label: 'Pausados' },
 25:     { key: 'idea', label: 'Ideas' },
 26:     { key: 'closed', label: 'Cerrados' },
 27:   ]
 28: 
 29:   if (loading) {
 30:     return (
 31:       <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
 32:         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
 33:           <div>
 34:             <div className="skeleton" style={{ height: '28px', width: '128px', marginBottom: '4px' }} />
 35:             <div className="skeleton" style={{ height: '16px', width: '200px' }} />
 36:           </div>
 37:           <div className="skeleton" style={{ height: '40px', width: '144px', borderRadius: '10px' }} />
 38:         </div>
 39:         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
 40:           {[...Array(6)].map((_, i) => (
 41:             <div key={i} className="skeleton" style={{ height: '180px', borderRadius: '14px' }} />
 42:           ))}
 43:         </div>
 44:       </div>
 45:     )
 46:   }
 47: 
 48:   return (
 49:     <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
 50:       {/* Header */}
 51:       <div className="animate-fade-in" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
 52:         <div>
 53:           <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>Ventures</h1>
 54:           <p style={{ fontSize: '14px', color: '#737373', margin: '2px 0 0' }}>
 55:             {ventures.length} proyecto{ventures.length !== 1 ? 's' : ''} registrado{ventures.length !== 1 ? 's' : ''}
 56:           </p>
 57:         </div>
 58:         <button
 59:           onClick={() => setShowForm(true)}
 60:           style={{
 61:             display: 'inline-flex',
 62:             alignItems: 'center',
 63:             gap: '8px',
 64:             padding: '10px 16px',
 65:             borderRadius: '10px',
 66:             backgroundColor: '#0a0a0a',
 67:             color: '#fafafa',
 68:             fontSize: '14px',
 69:             fontWeight: 500,
 70:             border: 'none',
 71:             cursor: 'pointer',
 72:             transition: 'all 0.15s',
 73:           }}
 74:           onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#262626' }}
 75:           onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a0a0a' }}
 76:           onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
 77:           onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
 78:         >
 79:           <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 80:             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
 81:           </svg>
 82:           Nuevo venture
 83:         </button>
 84:       </div>
 85: 
 86:       {/* Filters */}
 87:       <div className="animate-fade-in" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', animationDelay: '50ms' }}>
 88:         {filters.map((f) => (
 89:           <button
 90:             key={f.key}
 91:             onClick={() => setFilter(f.key)}
 92:             style={{
 93:               padding: '6px 14px',
 94:               borderRadius: '8px',
 95:               fontSize: '13px',
 96:               fontWeight: 500,
 97:               border: filter === f.key ? 'none' : '1px solid #e5e5e5',
 98:               backgroundColor: filter === f.key ? '#0a0a0a' : '#fff',
 99:               color: filter === f.key ? '#fafafa' : '#525252',
100:               cursor: 'pointer',
101:               transition: 'all 0.15s',
102:             }}
103:           >
104:             {f.label}
105:           </button>
106:         ))}
107:       </div>
108: 
109:       {/* Error */}
110:       {error && (
111:         <div className="animate-fade-in" style={{
112:           padding: '14px',
113:           borderRadius: '10px',
114:           backgroundColor: '#fef2f2',
115:           color: '#dc2626',
116:           fontSize: '13px',
117:           border: '1px solid #fecaca',
118:         }}>
119:           {error}
120:         </div>
121:       )}
122: 
123:       {/* Grid */}
124:       {filtered.length === 0 ? (
125:         <div className="animate-fade-in" style={{ textAlign: 'center', padding: '80px 0' }}>
126:           <div style={{
127:             width: '64px',
128:             height: '64px',
129:             borderRadius: '14px',
130:             backgroundColor: '#f5f5f5',
131:             display: 'flex',
132:             alignItems: 'center',
133:             justifyContent: 'center',
134:             margin: '0 auto 16px',
135:           }}>
136:             <svg style={{ width: '28px', height: '28px', color: '#a3a3a3' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
137:               <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
138:             </svg>
139:           </div>
140:           <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>No hay ventures {filter !== 'all' ? 'con este filtro' : 'aún'}</p>
141:           {filter === 'all' && (
142:             <button
143:               onClick={() => setShowForm(true)}
144:               style={{
145:                 marginTop: '12px',
146:                 fontSize: '14px',
147:                 color: '#171717',
148:                 fontWeight: 500,
149:                 background: 'none',
150:                 border: 'none',
151:                 cursor: 'pointer',
152:                 textDecoration: 'underline',
153:                 textUnderlineOffset: '4px',
154:                 padding: 0,
155:               }}
156:             >
157:               Crear tu primer venture →
158:             </button>
159:           )}
160:         </div>
161:       ) : (
162:         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
163:           {filtered.map((v, i) => (
164:             <VentureCard key={v.id} venture={v} delay={i * 50} />
165:           ))}
166:         </div>
167:       )}
168: 
169:       {/* Create modal */}
170:       {showForm && (
171:         <VentureForm
172:           onSubmit={handleCreate}
173:           onClose={() => setShowForm(false)}
174:         />
175:       )}
176:     </div>
177:   )
178: }
````

## File: frontend/src/features/ventures/pages/VentureDetailPage.tsx
````typescript
1: // pages/VentureDetailPage.tsx — shell del detalle de venture
2: import { VentureDetail } from '@/features/ventures/components/VentureDetail'
3: 
4: export default function VentureDetailPage() {
5:   return <VentureDetail />
6: }
````

## File: frontend/src/features/ventures/pages/VenturesPage.tsx
````typescript
1: // pages/VenturesPage.tsx — shell de la feature ventures
2: import { VenturesList } from '@/features/ventures/components/VenturesList'
3: 
4: export default function VenturesPage() {
5:   return <VenturesList />
6: }
````

## File: frontend/src/features/ventures/store.ts
````typescript
 1: // features/ventures/store.ts — Zustand store para ventures
 2: import { create } from 'zustand'
 3: import type { Venture } from './types'
 4: 
 5: interface VenturesState {
 6:   ventures: Venture[]
 7:   loading: boolean
 8:   error: string | null
 9:   setVentures: (ventures: Venture[]) => void
10:   addVenture: (venture: Venture) => void
11:   updateVenture: (venture: Venture) => void
12:   removeVenture: (id: string) => void
13:   setLoading: (loading: boolean) => void
14:   setError: (error: string | null) => void
15: }
16: 
17: export const useVenturesStore = create<VenturesState>((set) => ({
18:   ventures: [],
19:   loading: true,
20:   error: null,
21:   setVentures: (ventures) => set({ ventures, loading: false, error: null }),
22:   addVenture: (venture) => set((s) => ({ ventures: [venture, ...s.ventures] })),
23:   updateVenture: (venture) =>
24:     set((s) => ({
25:       ventures: s.ventures.map((v) => (v.id === venture.id ? venture : v)),
26:     })),
27:   removeVenture: (id) =>
28:     set((s) => ({ ventures: s.ventures.filter((v) => v.id !== id) })),
29:   setLoading: (loading) => set({ loading }),
30:   setError: (error) => set({ error, loading: false }),
31: }))
````

## File: frontend/src/features/ventures/types.ts
````typescript
 1: // apps/web/src/features/ventures/types.ts
 2: // Re-exporta tipos de ventures desde la fuente de verdad (backend)
 3: 
 4: export type {
 5:   Venture,
 6:   VentureType,
 7:   VentureStatus,
 8:   VentureHealth,
 9:   CreateVentureInput,
10:   UpdateVentureInput,
11: } from '@backend/_shared/types'
````

## File: frontend/src/features/ventures/utils.ts
````typescript
 1: // apps/web/src/features/ventures/utils.ts
 2: // Cálculos de negocio de ventures — NUNCA persistir ROI en DB
 3: import type { VentureHealth } from './types'
 4: 
 5: /** ROI en porcentaje. Nunca persistir en DB. */
 6: export const calculateROI = (invested: number, returned: number): number => {
 7:   if (invested === 0) return 0
 8:   return Number(((returned - invested) / invested * 100).toFixed(2))
 9: }
10: 
11: /** Cuánto falta para recuperar la inversión. */
12: export const breakEven = (invested: number, returned: number): number => {
13:   return Math.max(0, invested - returned)
14: }
15: 
16: /** Estado de salud del venture basado en ROI. */
17: export const ventureHealth = (roi: number): VentureHealth => {
18:   if (roi > 0) return 'positive'
19:   if (roi === 0) return 'neutral'
20:   return 'negative'
21: }
22: 
23: /** Ganancia neta del venture. */
24: export const netProfit = (invested: number, returned: number): number => {
25:   return returned - invested
26: }
````

## File: frontend/src/shared/lib/constants.ts
````typescript
 1: // apps/web/src/shared/lib/constants.ts
 2: 
 3: export const DEFAULT_CURRENCY = 'MXN'
 4: export const LOCALE = 'es-MX'
 5: 
 6: export const VENTURE_TYPE_LABELS: Record<string, string> = {
 7:   software: 'Software',
 8:   physical: 'Físico',
 9:   investment: 'Inversión',
10:   mixed: 'Mixto',
11: }
12: 
13: export const VENTURE_STATUS_LABELS: Record<string, string> = {
14:   active: 'Activo',
15:   paused: 'Pausado',
16:   closed: 'Cerrado',
17:   idea: 'Idea',
18: }
````

## File: frontend/src/shared/lib/formatters.ts
````typescript
 1: // apps/web/src/shared/lib/formatters.ts
 2: 
 3: export function formatCurrency(
 4:   amount: number,
 5:   currency = 'MXN',
 6:   locale = 'es-MX'
 7: ): string {
 8:   return new Intl.NumberFormat(locale, {
 9:     style: 'currency',
10:     currency,
11:     minimumFractionDigits: 2,
12:   }).format(amount)
13: }
14: 
15: export function formatDate(dateStr: string, locale = 'es-MX'): string {
16:   return new Intl.DateTimeFormat(locale, {
17:     day: '2-digit',
18:     month: 'short',
19:     year: 'numeric',
20:   }).format(new Date(dateStr))
21: }
22: 
23: export function formatROI(roi: number): string {
24:   const sign = roi > 0 ? '+' : ''
25:   return `${sign}${roi.toFixed(2)}%`
26: }
````

## File: frontend/src/shared/lib/supabase.ts
````typescript
 1: // apps/web/src/shared/lib/supabase.ts
 2: // Cliente Supabase para el frontend — SOLO anon key, protegido por RLS
 3: import { createClient } from '@supabase/supabase-js'
 4: 
 5: const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
 6: const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
 7: 
 8: if (!supabaseUrl || !supabaseAnonKey) {
 9:   throw new Error('Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY')
10: }
11: 
12: export const supabase = createClient(supabaseUrl, supabaseAnonKey)
````

## File: frontend/src/shared/types/index.ts
````typescript
 1: // apps/web/src/shared/types/index.ts
 2: // Tipos primitivos globales del frontend (no de dominio)
 3: 
 4: export type UUID = string
 5: export type ISODate = string // formato 'YYYY-MM-DD'
 6: export type ISOTimestamp = string // formato ISO 8601
 7: 
 8: // Re-exporta tipos de dominio desde la fuente de verdad (backend)
 9: export type {
10:   Venture,
11:   VentureType,
12:   VentureStatus,
13:   VentureHealth,
14:   CreateVentureInput,
15:   UpdateVentureInput,
16:   Transaction,
17:   TransactionType,
18:   CreateTransactionInput,
19:   HouseholdExpense,
20:   AuthUser,
21:   ApiError,
22:   ApiResult,
23: } from '@backend/_shared/types'
````

## File: frontend/src/App.tsx
````typescript
1: import { RouterProvider } from 'react-router-dom'
2: import { router } from './app/router'
3: 
4: function App() {
5:   return <RouterProvider router={router} />
6: }
7: 
8: export default App
````

## File: frontend/src/main.tsx
````typescript
 1: import { StrictMode } from 'react'
 2: import { createRoot } from 'react-dom/client'
 3: import './index.css'
 4: import App from './App.tsx'
 5: 
 6: createRoot(document.getElementById('root')!).render(
 7:   <StrictMode>
 8:     <App />
 9:   </StrictMode>,
10: )
````

## File: frontend/package.json
````json
 1: {
 2:   "name": "web",
 3:   "private": true,
 4:   "version": "0.0.0",
 5:   "type": "module",
 6:   "scripts": {
 7:     "dev": "vite",
 8:     "build": "tsc -b && vite build",
 9:     "lint": "eslint .",
10:     "preview": "vite preview"
11:   },
12:   "dependencies": {
13:     "@supabase/supabase-js": "^2.101.1",
14:     "react": "^19.2.4",
15:     "react-dom": "^19.2.4",
16:     "react-router-dom": "^7.14.0",
17:     "recharts": "^3.8.1",
18:     "zustand": "^5.0.12"
19:   },
20:   "devDependencies": {
21:     "@eslint/js": "^9.39.4",
22:     "@tailwindcss/vite": "^4.2.2",
23:     "@types/node": "^24.12.0",
24:     "@types/react": "^19.2.14",
25:     "@types/react-dom": "^19.2.3",
26:     "@vitejs/plugin-react": "^6.0.1",
27:     "eslint": "^9.39.4",
28:     "eslint-plugin-react-hooks": "^7.0.1",
29:     "eslint-plugin-react-refresh": "^0.5.2",
30:     "globals": "^17.4.0",
31:     "tailwindcss": "^4.2.2",
32:     "typescript": "~5.9.3",
33:     "typescript-eslint": "^8.57.0",
34:     "vite": "^8.0.1"
35:   }
36: }
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

## File: frontend/src/app/router.tsx
````typescript
 1: // app/router.tsx — Rutas con protección auth y layout
 2: import { createBrowserRouter, Navigate } from 'react-router-dom'
 3: import { Layout } from './Layout'
 4: import { ProtectedRoute } from './ProtectedRoute'
 5: import AuthPage from '../features/auth/pages/AuthPage'
 6: import DashboardPage from '../features/dashboard/pages/DashboardPage'
 7: import VenturesPage from '../features/ventures/pages/VenturesPage'
 8: import VentureDetailPage from '../features/ventures/pages/VentureDetailPage'
 9: import SettingsWhatsAppPage from '../features/settings/pages/SettingsWhatsAppPage'
10: import SettingsKeywordsPage from '../features/settings/pages/SettingsKeywordsPage'
11: 
12: export const router = createBrowserRouter([
13:   {
14:     path: '/auth',
15:     element: <AuthPage />,
16:   },
17:   {
18:     path: '/',
19:     element: (
20:       <ProtectedRoute>
21:         <Layout />
22:       </ProtectedRoute>
23:     ),
24:     children: [
25:       { index: true, element: <Navigate to="/dashboard" replace /> },
26:       { path: 'dashboard', element: <DashboardPage /> },
27:       { path: 'ventures', element: <VenturesPage /> },
28:       { path: 'ventures/:id', element: <VentureDetailPage /> },
29:       { path: 'settings/whatsapp', element: <SettingsWhatsAppPage /> },
30:       { path: 'settings/keywords', element: <SettingsKeywordsPage /> },
31:     ],
32:   },
33: ])
````

## File: frontend/src/features/auth/components/AuthForm.tsx
````typescript
  1: // features/auth/components/AuthForm.tsx — Rediseño estilo Supabase (monocromático + responsive)
  2: import { useState, useEffect, type FormEvent } from 'react'
  3: import { useAuth } from '../hooks/useAuth'
  4: 
  5: type AuthMode = 'login' | 'register'
  6: 
  7: const MOTIVATIONAL_QUOTES = [
  8:   {
  9:     text: 'No se trata de cuánto ganas, sino de cuánto conservas y cómo lo haces crecer.',
 10:     author: 'Robert Kiyosaki',
 11:   },
 12:   {
 13:     text: 'El mejor momento para invertir fue ayer. El segundo mejor momento es hoy.',
 14:     author: 'Warren Buffett',
 15:   },
 16:   {
 17:     text: 'Las oportunidades vienen disfrazadas de trabajo duro, por eso la mayoría no las reconoce.',
 18:     author: 'Ann Landers',
 19:   },
 20:   {
 21:     text: 'No pongas todos los huevos en la misma canasta — diversifica tus ventures.',
 22:     author: 'Finova',
 23:   },
 24:   {
 25:     text: 'El ROI más importante es el retorno sobre tu tiempo invertido.',
 26:     author: 'Finova',
 27:   },
 28: ]
 29: 
 30: function GoogleIcon() {
 31:   return (
 32:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
 33:       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
 34:       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
 35:       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
 36:       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
 37:     </svg>
 38:   )
 39: }
 40: 
 41: function EyeIcon({ open }: { open: boolean }) {
 42:   if (open) {
 43:     return (
 44:       <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
 45:         <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
 46:         <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 47:       </svg>
 48:     )
 49:   }
 50:   return (
 51:     <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
 52:       <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
 53:     </svg>
 54:   )
 55: }
 56: 
 57: export function AuthForm() {
 58:   const [mode, setMode] = useState<AuthMode>('login')
 59:   const [email, setEmail] = useState('')
 60:   const [password, setPassword] = useState('')
 61:   const [confirmPassword, setConfirmPassword] = useState('')
 62:   const [showPassword, setShowPassword] = useState(false)
 63:   const [error, setError] = useState<string | null>(null)
 64:   const [success, setSuccess] = useState<string | null>(null)
 65:   const [submitting, setSubmitting] = useState(false)
 66:   const [quoteIndex, setQuoteIndex] = useState(0)
 67:   const [quoteFading, setQuoteFading] = useState(false)
 68:   const [focusedField, setFocusedField] = useState<string | null>(null)
 69: 
 70:   const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
 71: 
 72:   useEffect(() => {
 73:     const interval = setInterval(() => {
 74:       setQuoteFading(true)
 75:       setTimeout(() => {
 76:         setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)
 77:         setQuoteFading(false)
 78:       }, 400)
 79:     }, 8000)
 80:     return () => clearInterval(interval)
 81:   }, [])
 82: 
 83:   const handleSubmit = async (e: FormEvent) => {
 84:     e.preventDefault()
 85:     setError(null)
 86:     setSuccess(null)
 87: 
 88:     if (!email || !password) {
 89:       setError('Ingresa tu email y contraseña')
 90:       return
 91:     }
 92:     if (mode === 'register' && password !== confirmPassword) {
 93:       setError('Las contraseñas no coinciden')
 94:       return
 95:     }
 96:     if (password.length < 6) {
 97:       setError('La contraseña debe tener al menos 6 caracteres')
 98:       return
 99:     }
100: 
101:     setSubmitting(true)
102:     try {
103:       if (mode === 'login') {
104:         await signInWithEmail(email, password)
105:       } else {
106:         await signUpWithEmail(email, password)
107:         setSuccess('¡Cuenta creada! Revisa tu email para confirmar.')
108:       }
109:     } catch (err: unknown) {
110:       const message = err instanceof Error ? err.message : 'Error inesperado'
111:       setError(message)
112:     } finally {
113:       setSubmitting(false)
114:     }
115:   }
116: 
117:   const handleGoogleSignIn = async () => {
118:     setError(null)
119:     try {
120:       await signInWithGoogle()
121:     } catch (err: unknown) {
122:       const message = err instanceof Error ? err.message : 'Error al conectar con Google'
123:       setError(message)
124:     }
125:   }
126: 
127:   const toggleMode = () => {
128:     setMode(mode === 'login' ? 'register' : 'login')
129:     setError(null)
130:     setSuccess(null)
131:   }
132: 
133:   const inputStyle = (fieldName: string): React.CSSProperties => ({
134:     width: '100%',
135:     padding: '10px 14px',
136:     borderRadius: '8px',
137:     backgroundColor: '#171717',
138:     border: `1px solid ${focusedField === fieldName ? '#555' : '#2a2a2a'}`,
139:     color: '#fafafa',
140:     fontSize: '14px',
141:     outline: 'none',
142:     transition: 'border-color 0.15s, box-shadow 0.15s',
143:     boxShadow: focusedField === fieldName ? '0 0 0 2px rgba(82,82,82,0.3)' : 'none',
144:   })
145: 
146:   const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex]
147: 
148:   return (
149:     <div style={{
150:       minHeight: '100dvh',
151:       display: 'flex',
152:       flexDirection: 'row',
153:       justifyContent: 'center',
154:       backgroundColor: '#0a0a0a',
155:       fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
156:       color: '#fafafa',
157:     }}>
158:       {/* ── Left Panel: Auth Form ── */}
159:       <div style={{
160:         width: '100%',
161:         maxWidth: '520px',
162:         display: 'flex',
163:         flexDirection: 'column',
164:         justifyContent: 'space-between',
165:         padding: 'clamp(24px, 5vw, 48px)',
166:         minHeight: '100dvh',
167:         margin: '0 auto', /* Center on mobile/tablet */
168:       }}>
169:         {/* Logo */}
170:         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
171:           <div
172:             style={{
173:               width: '32px',
174:               height: '32px',
175:               borderRadius: '8px',
176:               backgroundColor: 'rgba(255,255,255,0.08)',
177:               border: '1px solid rgba(255,255,255,0.06)',
178:               display: 'flex',
179:               alignItems: 'center',
180:               justifyContent: 'center',
181:             }}
182:           >
183:             <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fafafa" strokeWidth={2}>
184:               <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
185:             </svg>
186:           </div>
187:           <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.02em' }}>Finova</span>
188:         </div>
189: 
190:         {/* Form Area — Centered */}
191:         <div style={{ maxWidth: '360px', width: '100%' }}>
192:           <h1 style={{
193:             fontSize: 'clamp(20px, 3vw, 24px)',
194:             fontWeight: 600,
195:             letterSpacing: '-0.02em',
196:             margin: '0 0 6px 0',
197:           }}>
198:             {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
199:           </h1>
200:           <p style={{ color: '#a3a3a3', fontSize: 'clamp(13px, 1.5vw, 14px)', margin: '0 0 32px 0' }}>
201:             {mode === 'login'
202:               ? 'Inicia sesión para administrar tus ventures'
203:               : 'Comienza a controlar tus inversiones'}
204:           </p>
205: 
206:           {/* Google Sign-In Button */}
207:           <button
208:             type="button"
209:             onClick={handleGoogleSignIn}
210:             style={{
211:               width: '100%',
212:               padding: '10px 16px',
213:               borderRadius: '8px',
214:               backgroundColor: 'transparent',
215:               color: '#fafafa',
216:               fontSize: '14px',
217:               fontWeight: 500,
218:               border: '1px solid #2a2a2a',
219:               cursor: 'pointer',
220:               transition: 'background-color 0.15s, border-color 0.15s',
221:               display: 'flex',
222:               alignItems: 'center',
223:               justifyContent: 'center',
224:               gap: '12px',
225:             }}
226:             onMouseEnter={(e) => {
227:               e.currentTarget.style.backgroundColor = '#171717'
228:               e.currentTarget.style.borderColor = '#404040'
229:             }}
230:             onMouseLeave={(e) => {
231:               e.currentTarget.style.backgroundColor = 'transparent'
232:               e.currentTarget.style.borderColor = '#2a2a2a'
233:             }}
234:           >
235:             <GoogleIcon />
236:             Continuar con Google
237:           </button>
238: 
239:           {/* Divider */}
240:           <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
241:             <div style={{ flex: 1, height: '1px', backgroundColor: '#262626' }} />
242:             <span style={{ fontSize: '12px', color: '#525252', textTransform: 'uppercase', letterSpacing: '0.08em' }}>o</span>
243:             <div style={{ flex: 1, height: '1px', backgroundColor: '#262626' }} />
244:           </div>
245: 
246:           {/* Email/Password Form */}
247:           <form onSubmit={handleSubmit}>
248:             {/* Email */}
249:             <div style={{ marginBottom: '16px' }}>
250:               <label htmlFor="auth-email" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>
251:                 Email
252:               </label>
253:               <input
254:                 id="auth-email"
255:                 type="email"
256:                 value={email}
257:                 onChange={(e) => setEmail(e.target.value)}
258:                 placeholder="tu@email.com"
259:                 autoComplete="email"
260:                 style={inputStyle('email')}
261:                 onFocus={() => setFocusedField('email')}
262:                 onBlur={() => setFocusedField(null)}
263:               />
264:             </div>
265: 
266:             {/* Password */}
267:             <div style={{ marginBottom: '16px' }}>
268:               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
269:                 <label htmlFor="auth-password" style={{ fontSize: '13px', fontWeight: 500, color: '#a3a3a3' }}>
270:                   Contraseña
271:                 </label>
272:                 {mode === 'login' && (
273:                   <button
274:                     type="button"
275:                     style={{ fontSize: '12px', color: '#737373', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
276:                     onMouseEnter={(e) => { e.currentTarget.style.color = '#fafafa' }}
277:                     onMouseLeave={(e) => { e.currentTarget.style.color = '#737373' }}
278:                   >
279:                     ¿Olvidaste tu contraseña?
280:                   </button>
281:                 )}
282:               </div>
283:               <div style={{ position: 'relative' }}>
284:                 <input
285:                   id="auth-password"
286:                   type={showPassword ? 'text' : 'password'}
287:                   value={password}
288:                   onChange={(e) => setPassword(e.target.value)}
289:                   placeholder="••••••••"
290:                   autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
291:                   style={{ ...inputStyle('password'), paddingRight: '40px' }}
292:                   onFocus={() => setFocusedField('password')}
293:                   onBlur={() => setFocusedField(null)}
294:                 />
295:                 <button
296:                   type="button"
297:                   onClick={() => setShowPassword(!showPassword)}
298:                   style={{
299:                     position: 'absolute',
300:                     right: '12px',
301:                     top: '50%',
302:                     transform: 'translateY(-50%)',
303:                     background: 'none',
304:                     border: 'none',
305:                     cursor: 'pointer',
306:                     padding: 0,
307:                     color: '#525252',
308:                     display: 'flex',
309:                   }}
310:                   tabIndex={-1}
311:                 >
312:                   <EyeIcon open={showPassword} />
313:                 </button>
314:               </div>
315:             </div>
316: 
317:             {/* Confirm Password (register only) */}
318:             {mode === 'register' && (
319:               <div style={{ marginBottom: '16px' }} className="animate-fade-in">
320:                 <label htmlFor="auth-confirm" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>
321:                   Confirmar contraseña
322:                 </label>
323:                 <input
324:                   id="auth-confirm"
325:                   type="password"
326:                   value={confirmPassword}
327:                   onChange={(e) => setConfirmPassword(e.target.value)}
328:                   placeholder="••••••••"
329:                   autoComplete="new-password"
330:                   style={inputStyle('confirm')}
331:                   onFocus={() => setFocusedField('confirm')}
332:                   onBlur={() => setFocusedField(null)}
333:                 />
334:               </div>
335:             )}
336: 
337:             {/* Error */}
338:             {error && (
339:               <div
340:                 className="animate-fade-in"
341:                 style={{
342:                   display: 'flex',
343:                   alignItems: 'flex-start',
344:                   gap: '10px',
345:                   padding: '12px',
346:                   borderRadius: '8px',
347:                   backgroundColor: 'rgba(239,68,68,0.1)',
348:                   border: '1px solid rgba(239,68,68,0.2)',
349:                   fontSize: '13px',
350:                   color: '#f87171',
351:                   marginBottom: '16px',
352:                 }}
353:               >
354:                 <svg width="16" height="16" style={{ flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
355:                   <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
356:                 </svg>
357:                 {error}
358:               </div>
359:             )}
360: 
361:             {/* Success */}
362:             {success && (
363:               <div
364:                 className="animate-fade-in"
365:                 style={{
366:                   display: 'flex',
367:                   alignItems: 'flex-start',
368:                   gap: '10px',
369:                   padding: '12px',
370:                   borderRadius: '8px',
371:                   backgroundColor: 'rgba(16,185,129,0.1)',
372:                   border: '1px solid rgba(16,185,129,0.2)',
373:                   fontSize: '13px',
374:                   color: '#34d399',
375:                   marginBottom: '16px',
376:                 }}
377:               >
378:                 <svg width="16" height="16" style={{ flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
379:                   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
380:                 </svg>
381:                 {success}
382:               </div>
383:             )}
384: 
385:             {/* Submit */}
386:             <button
387:               type="submit"
388:               disabled={submitting}
389:               style={{
390:                 width: '100%',
391:                 padding: '10px 16px',
392:                 borderRadius: '8px',
393:                 backgroundColor: '#fafafa',
394:                 color: '#0a0a0a',
395:                 fontSize: '14px',
396:                 fontWeight: 600,
397:                 border: 'none',
398:                 cursor: submitting ? 'not-allowed' : 'pointer',
399:                 transition: 'background-color 0.15s, transform 0.1s',
400:                 display: 'flex',
401:                 alignItems: 'center',
402:                 justifyContent: 'center',
403:                 gap: '8px',
404:                 opacity: submitting ? 0.4 : 1,
405:               }}
406:               onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#e5e5e5' }}
407:               onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fafafa' }}
408:               onMouseDown={(e) => { if (!submitting) e.currentTarget.style.transform = 'scale(0.98)' }}
409:               onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
410:             >
411:               {submitting && (
412:                 <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
413:                   <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
414:                   <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
415:                 </svg>
416:               )}
417:               {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
418:             </button>
419:           </form>
420: 
421:           {/* Toggle Mode */}
422:           <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#737373' }}>
423:             {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
424:             <button
425:               onClick={toggleMode}
426:               style={{
427:                 background: 'none',
428:                 border: 'none',
429:                 color: '#fafafa',
430:                 fontWeight: 500,
431:                 cursor: 'pointer',
432:                 textDecoration: 'underline',
433:                 textUnderlineOffset: '4px',
434:                 fontSize: '14px',
435:                 padding: 0,
436:               }}
437:             >
438:               {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
439:             </button>
440:           </p>
441:         </div>
442: 
443:         {/* Footer */}
444:         <p style={{ fontSize: '11px', color: '#525252' }}>
445:           © {new Date().getFullYear()} Finova. Gestión financiera inteligente.
446:         </p>
447:       </div>
448: 
449:       {/* ── Right Panel: Branding + Motivational Quotes ── */}
450:       <div
451:         className="auth-right-panel"
452:         style={{
453:           flex: 1,
454:           position: 'relative',
455:           overflow: 'hidden',
456:           backgroundColor: '#111111',
457:         }}
458:       >
459:         {/* Dot pattern background */}
460:         <div
461:           style={{
462:             position: 'absolute',
463:             inset: 0,
464:             opacity: 0.04,
465:             backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
466:             backgroundSize: '32px 32px',
467:           }}
468:         />
469: 
470:         {/* Gradient overlay */}
471:         <div
472:           style={{
473:             position: 'absolute',
474:             inset: 0,
475:             background: 'linear-gradient(135deg, #111111 0%, transparent 50%, rgba(10,10,10,0.8) 100%)',
476:           }}
477:         />
478: 
479:         {/* Content */}
480:         <div
481:           style={{
482:             position: 'relative',
483:             zIndex: 10,
484:             display: 'flex',
485:             flexDirection: 'column',
486:             justifyContent: 'center',
487:             height: '100%',
488:             padding: '0 clamp(40px, 6vw, 80px)',
489:             maxWidth: '640px',
490:           }}
491:         >
492:           {/* Quote mark */}
493:           <svg width="48" height="48" fill="#262626" viewBox="0 0 24 24" style={{ marginBottom: '32px' }}>
494:             <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11h4v10H0z" />
495:           </svg>
496: 
497:           {/* Motivational Quote */}
498:           <div
499:             style={{
500:               transition: 'opacity 0.4s ease, transform 0.4s ease',
501:               opacity: quoteFading ? 0 : 1,
502:               transform: quoteFading ? 'translateY(8px)' : 'translateY(0)',
503:             }}
504:           >
505:             <blockquote
506:               style={{
507:                 fontSize: 'clamp(18px, 2.5vw, 24px)',
508:                 fontWeight: 500,
509:                 color: 'rgba(255,255,255,0.88)',
510:                 lineHeight: 1.5,
511:                 letterSpacing: '-0.02em',
512:                 margin: 0,
513:                 padding: 0,
514:               }}
515:             >
516:               {currentQuote.text}
517:             </blockquote>
518:             <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
519:               <div style={{ width: '32px', height: '1px', backgroundColor: '#333' }} />
520:               <span style={{ fontSize: '14px', color: '#737373', fontWeight: 500 }}>
521:                 {currentQuote.author}
522:               </span>
523:             </div>
524:           </div>
525: 
526:           {/* Quote indicators */}
527:           <div style={{ display: 'flex', gap: '6px', marginTop: '40px' }}>
528:             {MOTIVATIONAL_QUOTES.map((_, i) => (
529:               <div
530:                 key={i}
531:                 style={{
532:                   height: '3px',
533:                   borderRadius: '2px',
534:                   transition: 'all 0.5s ease',
535:                   width: i === quoteIndex ? '24px' : '8px',
536:                   backgroundColor: i === quoteIndex ? '#fafafa' : '#333',
537:                 }}
538:               />
539:             ))}
540:           </div>
541:         </div>
542: 
543:         {/* Bottom branding */}
544:         <div
545:           style={{
546:             position: 'absolute',
547:             bottom: '40px',
548:             left: 'clamp(40px, 6vw, 80px)',
549:             display: 'flex',
550:             alignItems: 'center',
551:             gap: '12px',
552:             color: '#333',
553:           }}
554:         >
555:           <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
556:             <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
557:           </svg>
558:           <span style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
559:             Finova — Gestión Financiera
560:           </span>
561:         </div>
562:       </div>
563:     </div>
564:   )
565: }
````

## File: frontend/src/features/dashboard/components/DashboardView.tsx
````typescript
  1: // features/dashboard/components/DashboardView.tsx — Vista principal monochrome
  2: import { useEffect } from 'react'
  3: import { useVentures } from '@/features/ventures/hooks/useVentures'
  4: import { useTransactions } from '@/features/transactions/hooks/useTransactions'
  5: import { calculateROI } from '@/features/ventures/utils'
  6: import { formatCurrency, formatROI } from '@/shared/lib/formatters'
  7: import { MetricCard } from './MetricCard'
  8: import { MonthlyChart } from './MonthlyChart'
  9: import { RedVentures } from './RedVentures'
 10: 
 11: export function DashboardView() {
 12:   const { ventures, loading: venturesLoading } = useVentures()
 13:   const { transactions, loading: txLoading, fetchTransactions } = useTransactions()
 14: 
 15:   useEffect(() => {
 16:     fetchTransactions()
 17:   }, [fetchTransactions])
 18: 
 19:   const loading = venturesLoading || txLoading
 20: 
 21:   if (loading) {
 22:     return (
 23:       <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
 24:         <div>
 25:           <div className="skeleton" style={{ height: '28px', width: '160px', marginBottom: '4px' }} />
 26:           <div className="skeleton" style={{ height: '16px', width: '260px' }} />
 27:         </div>
 28:         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 29:           {[...Array(4)].map((_, i) => (
 30:             <div key={i} className="skeleton" style={{ height: '128px', borderRadius: '14px' }} />
 31:           ))}
 32:         </div>
 33:         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 34:           <div className="skeleton" style={{ height: '320px', borderRadius: '14px' }} />
 35:           <div className="skeleton" style={{ height: '320px', borderRadius: '14px' }} />
 36:         </div>
 37:       </div>
 38:     )
 39:   }
 40: 
 41:   if (ventures.length === 0) {
 42:     return (
 43:       <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '80vh', alignItems: 'center', justifyContent: 'center' }}>
 44:         <div style={{
 45:           width: '80px',
 46:           height: '80px',
 47:           borderRadius: '20px',
 48:           backgroundColor: '#171717',
 49:           border: '1px solid #2a2a2a',
 50:           display: 'flex',
 51:           alignItems: 'center',
 52:           justifyContent: 'center',
 53:           marginBottom: '24px',
 54:           boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
 55:         }}>
 56:           <svg style={{ width: '32px', height: '32px', color: '#a3a3a3' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
 57:             <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
 58:           </svg>
 59:         </div>
 60:         <h1 style={{ fontSize: 'clamp(24px, 3vw, 28px)', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', margin: '0 0 12px 0', textAlign: 'center' }}>
 61:           Bienvenido a Finova
 62:         </h1>
 63:         <p style={{ fontSize: '15px', color: '#737373', maxWidth: '400px', textAlign: 'center', margin: '0 0 32px 0', lineHeight: 1.6 }}>
 64:           Aún no tienes ventures registrados. Comienza tu viaje financiero creando tu primer venture para empezar a monitorear tus transacciones.
 65:         </p>
 66:         <button
 67:           onClick={() => window.location.href = '/ventures'}
 68:           style={{
 69:             display: 'inline-flex',
 70:             alignItems: 'center',
 71:             gap: '8px',
 72:             padding: '12px 24px',
 73:             borderRadius: '12px',
 74:             backgroundColor: '#0a0a0a',
 75:             color: '#fafafa',
 76:             fontSize: '15px',
 77:             fontWeight: 500,
 78:             border: 'none',
 79:             cursor: 'pointer',
 80:             transition: 'all 0.15s',
 81:             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
 82:           }}
 83:           onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#262626' }}
 84:           onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a0a0a' }}
 85:           onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
 86:           onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
 87:         >
 88:           <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 89:             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
 90:           </svg>
 91:           Crear tu primer venture
 92:         </button>
 93:       </div>
 94:     )
 95:   }
 96: 
 97:   const totalInvested = ventures.reduce((sum, v) => sum + v.invested, 0)
 98:   const totalReturned = ventures.reduce((sum, v) => sum + v.returned, 0)
 99:   const activeVentures = ventures.filter((v) => v.status === 'active')
100:   const rois = activeVentures.map((v) => calculateROI(v.invested, v.returned))
101:   const avgROI = rois.length > 0 ? rois.reduce((a, b) => a + b, 0) / rois.length : 0
102:   const netProfitVal = totalReturned - totalInvested
103: 
104:   return (
105:     <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
106:       {/* Header */}
107:       <div className="animate-fade-in">
108:         <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>
109:           Dashboard
110:         </h1>
111:         <p style={{ fontSize: '14px', color: '#737373', margin: '2px 0 0' }}>
112:           Resumen de {ventures.length} venture{ventures.length !== 1 ? 's' : ''} · {transactions.length} transacciones
113:         </p>
114:       </div>
115: 
116:       {/* Metric Cards */}
117:       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
118:         <MetricCard
119:           title="Total invertido"
120:           value={formatCurrency(totalInvested)}
121:           icon={
122:             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
123:               <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
124:             </svg>
125:           }
126:           delay={0}
127:         />
128:         <MetricCard
129:           title="Total retornado"
130:           value={formatCurrency(totalReturned)}
131:           icon={
132:             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
133:               <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
134:             </svg>
135:           }
136:           delay={50}
137:         />
138:         <MetricCard
139:           title="Ganancia neta"
140:           value={formatCurrency(netProfitVal)}
141:           trend={{
142:             value: formatROI(avgROI),
143:             positive: netProfitVal >= 0,
144:           }}
145:           icon={
146:             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
147:               <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
148:             </svg>
149:           }
150:           delay={100}
151:         />
152:         <MetricCard
153:           title="Ventures activos"
154:           value={String(activeVentures.length)}
155:           subtitle={`de ${ventures.length} totales`}
156:           icon={
157:             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
158:               <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
159:             </svg>
160:           }
161:           delay={150}
162:         />
163:       </div>
164: 
165:       {/* Charts row */}
166:       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
167:         <MonthlyChart transactions={transactions} />
168:         <RedVentures ventures={ventures} />
169:       </div>
170:     </div>
171:   )
172: }
````

## File: frontend/src/features/settings/components/KeywordsManager.tsx
````typescript
  1: // features/settings/components/KeywordsManager.tsx — Gestión monocromática
  2: import { useState, useEffect } from 'react'
  3: import { supabase } from '@/shared/lib/supabase'
  4: 
  5: interface Keyword {
  6:   id: string
  7:   keyword: string
  8:   type: 'income' | 'expense'
  9: }
 10: 
 11: const inputStyle: React.CSSProperties = {
 12:   padding: '10px 14px',
 13:   borderRadius: '8px',
 14:   backgroundColor: '#fafafa',
 15:   border: '1px solid #e5e5e5',
 16:   color: '#171717',
 17:   fontSize: '14px',
 18:   outline: 'none',
 19:   fontFamily: 'inherit',
 20:   transition: 'border-color 0.15s',
 21: }
 22: 
 23: export function KeywordsManager() {
 24:   const [keywords, setKeywords] = useState<Keyword[]>([])
 25:   const [loading, setLoading] = useState(true)
 26:   const [newKeyword, setNewKeyword] = useState('')
 27:   const [newType, setNewType] = useState<'income' | 'expense'>('expense')
 28:   const [saving, setSaving] = useState(false)
 29: 
 30:   useEffect(() => {
 31:     const fetchKeywords = async () => {
 32:       const { data, error } = await supabase.functions.invoke('user-settings/keywords', {
 33:         method: 'GET',
 34:       })
 35:       if (!error && data) {
 36:         setKeywords(data.data || [])
 37:       }
 38:       setLoading(false)
 39:     }
 40:     fetchKeywords()
 41:   }, [])
 42: 
 43:   const addKeyword = async () => {
 44:     if (!newKeyword.trim()) return
 45:     setSaving(true)
 46:     const { data, error } = await supabase.functions.invoke('user-settings/keywords', {
 47:       method: 'POST',
 48:       body: { keyword: newKeyword.trim().toLowerCase(), type: newType },
 49:     })
 50:     if (!error && data) {
 51:       setKeywords((prev) => [...prev, data.data])
 52:       setNewKeyword('')
 53:     }
 54:     setSaving(false)
 55:   }
 56: 
 57:   const removeKeyword = async (id: string) => {
 58:     await supabase.functions.invoke(`user-settings/keywords/${id}`, {
 59:       method: 'DELETE',
 60:     })
 61:     setKeywords((prev) => prev.filter((k) => k.id !== id))
 62:   }
 63: 
 64:   const incomeKeywords = keywords.filter((k) => k.type === 'income')
 65:   const expenseKeywords = keywords.filter((k) => k.type === 'expense')
 66: 
 67:   if (loading) {
 68:     return (
 69:       <div style={{ maxWidth: '480px' }}>
 70:         <div className="skeleton" style={{ height: '28px', width: '180px', marginBottom: '12px' }} />
 71:         <div className="skeleton" style={{ height: '280px', borderRadius: '14px' }} />
 72:       </div>
 73:     )
 74:   }
 75: 
 76:   return (
 77:     <div className="animate-fade-in" style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
 78:       {/* Header */}
 79:       <div>
 80:         <button
 81:           onClick={() => window.history.back()}
 82:           style={{
 83:             display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#737373',
 84:             background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '4px',
 85:             transition: 'color 0.15s',
 86:           }}
 87:           onMouseEnter={(e) => { e.currentTarget.style.color = '#0a0a0a' }}
 88:           onMouseLeave={(e) => { e.currentTarget.style.color = '#737373' }}
 89:         >
 90:           <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 91:             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
 92:           </svg>
 93:           Atrás
 94:         </button>
 95:         <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>Palabras clave</h1>
 96:         <p style={{ fontSize: '14px', color: '#737373', margin: '2px 0 0' }}>
 97:           Cuando envíes un mensaje por WhatsApp con estas palabras, se clasificará automáticamente como ingreso o gasto.
 98:         </p>
 99:       </div>
100: 
101:       {/* Add keyword */}
102:       <div style={{
103:         backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5', padding: '20px',
104:       }}>
105:         <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 12px' }}>Agregar palabra clave</h3>
106:         <div style={{ display: 'flex', gap: '8px' }}>
107:           <input
108:             value={newKeyword}
109:             onChange={(e) => setNewKeyword(e.target.value)}
110:             placeholder="Ej: venta, compra, pago..."
111:             style={{ ...inputStyle, flex: 1 }}
112:             onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
113:             onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
114:             onKeyDown={(e) => { if (e.key === 'Enter') addKeyword() }}
115:           />
116:           <select
117:             value={newType}
118:             onChange={(e) => setNewType(e.target.value as 'income' | 'expense')}
119:             style={{ ...inputStyle, cursor: 'pointer', width: 'auto' }}
120:           >
121:             <option value="expense">Gasto</option>
122:             <option value="income">Ingreso</option>
123:           </select>
124:           <button
125:             onClick={addKeyword}
126:             disabled={saving || !newKeyword.trim()}
127:             style={{
128:               padding: '10px 16px', borderRadius: '8px', border: 'none',
129:               backgroundColor: '#0a0a0a', color: '#fafafa', fontSize: '14px', fontWeight: 600,
130:               cursor: (saving || !newKeyword.trim()) ? 'not-allowed' : 'pointer',
131:               transition: 'all 0.15s', opacity: (saving || !newKeyword.trim()) ? 0.4 : 1,
132:             }}
133:             onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#262626' }}
134:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a0a0a' }}
135:           >
136:             {saving ? '...' : '+'}
137:           </button>
138:         </div>
139:       </div>
140: 
141:       {/* Keywords lists */}
142:       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
143:         {/* Income */}
144:         <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5', padding: '20px' }}>
145:           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
146:             <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
147:             <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>Ingresos</h3>
148:             <span style={{ fontSize: '12px', color: '#a3a3a3' }}>({incomeKeywords.length})</span>
149:           </div>
150:           <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
151:             {incomeKeywords.length === 0 ? (
152:               <p style={{ fontSize: '13px', color: '#a3a3a3' }}>Sin keywords de ingreso</p>
153:             ) : incomeKeywords.map((k) => (
154:               <div key={k.id} style={{
155:                 display: 'flex', alignItems: 'center', justifyContent: 'space-between',
156:                 padding: '8px 12px', borderRadius: '8px', backgroundColor: '#f0fdf4',
157:                 transition: 'background-color 0.15s',
158:               }}>
159:                 <span style={{ fontSize: '13px', color: '#166534', fontWeight: 500 }}>{k.keyword}</span>
160:                 <button
161:                   onClick={() => removeKeyword(k.id)}
162:                   style={{
163:                     padding: '2px', background: 'none', border: 'none', cursor: 'pointer',
164:                     color: '#a3a3a3', display: 'flex', transition: 'color 0.15s',
165:                   }}
166:                   onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626' }}
167:                   onMouseLeave={(e) => { e.currentTarget.style.color = '#a3a3a3' }}
168:                 >
169:                   <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
170:                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
171:                   </svg>
172:                 </button>
173:               </div>
174:             ))}
175:           </div>
176:         </div>
177: 
178:         {/* Expense */}
179:         <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5', padding: '20px' }}>
180:           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
181:             <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
182:             <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>Gastos</h3>
183:             <span style={{ fontSize: '12px', color: '#a3a3a3' }}>({expenseKeywords.length})</span>
184:           </div>
185:           <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
186:             {expenseKeywords.length === 0 ? (
187:               <p style={{ fontSize: '13px', color: '#a3a3a3' }}>Sin keywords de gasto</p>
188:             ) : expenseKeywords.map((k) => (
189:               <div key={k.id} style={{
190:                 display: 'flex', alignItems: 'center', justifyContent: 'space-between',
191:                 padding: '8px 12px', borderRadius: '8px', backgroundColor: '#fef2f2',
192:                 transition: 'background-color 0.15s',
193:               }}>
194:                 <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: 500 }}>{k.keyword}</span>
195:                 <button
196:                   onClick={() => removeKeyword(k.id)}
197:                   style={{
198:                     padding: '2px', background: 'none', border: 'none', cursor: 'pointer',
199:                     color: '#a3a3a3', display: 'flex', transition: 'color 0.15s',
200:                   }}
201:                   onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626' }}
202:                   onMouseLeave={(e) => { e.currentTarget.style.color = '#a3a3a3' }}
203:                 >
204:                   <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
205:                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
206:                   </svg>
207:                 </button>
208:               </div>
209:             ))}
210:           </div>
211:         </div>
212:       </div>
213:     </div>
214:   )
215: }
````

## File: frontend/src/features/transactions/hooks/useTransactions.ts
````typescript
 1: // features/transactions/hooks/useTransactions.ts — Hook para CRUD de transacciones
 2: import { useState, useCallback } from 'react'
 3: import { supabase } from '@/shared/lib/supabase'
 4: import type { Transaction, CreateTransactionInput } from '../types'
 5: import { useAuthStore } from '@/features/auth/store'
 6: 
 7: export function useTransactions(ventureId?: string) {
 8:   const [transactions, setTransactions] = useState<Transaction[]>([])
 9:   const [loading, setLoading] = useState(true)
10:   const [error, setError] = useState<string | null>(null)
11:   const { session } = useAuthStore()
12: 
13:   const fetchTransactions = useCallback(async (vid?: string) => {
14:     const id = vid || ventureId
15:     setLoading(true)
16:     setError(null)
17: 
18:     if (!session?.access_token) {
19:       setError('No active session')
20:       setLoading(false)
21:       return
22:     }
23: 
24:     const { data, error: invokeError } = await supabase.functions.invoke('transactions' + (id ? `?venture_id=${id}` : ''), {
25:       method: 'GET',
26:       headers: { Authorization: `Bearer ${session.access_token}` }
27:     })
28: 
29:     if (invokeError) { setError(invokeError.message); setLoading(false); return }
30:     setTransactions(data?.data ?? [])
31:     setLoading(false)
32:   }, [ventureId, session])
33: 
34:   const createTransaction = async (input: CreateTransactionInput, evidence?: File) => {
35:     if (!session?.access_token) throw new Error('No active session')
36: 
37:     let responseData
38:     let invokeError
39: 
40:     if (evidence) {
41:       const formData = new FormData()
42:       formData.append('venture_id', input.venture_id)
43:       formData.append('type', input.type)
44:       formData.append('amount', String(input.amount))
45:       formData.append('date', input.date)
46:       if (input.description) formData.append('description', input.description)
47:       formData.append('evidence', evidence)
48: 
49:       const { data, error } = await supabase.functions.invoke('transactions', {
50:         method: 'POST',
51:         headers: { Authorization: `Bearer ${session.access_token}` },
52:         body: formData,
53:       })
54:       responseData = data
55:       invokeError = error
56:     } else {
57:       const { data, error } = await supabase.functions.invoke('transactions', {
58:         method: 'POST',
59:         headers: { Authorization: `Bearer ${session.access_token}` },
60:         body: input,
61:       })
62:       responseData = data
63:       invokeError = error
64:     }
65: 
66:     if (invokeError) throw new Error(invokeError.message || 'Error creating transaction')
67:     setTransactions((prev) => [responseData.data, ...prev])
68:     return responseData.data
69:   }
70: 
71:   const deleteTransaction = async (id: string) => {
72:     if (!session?.access_token) throw new Error('No active session')
73: 
74:     const { error } = await supabase.functions.invoke(`transactions/${id}`, {
75:       method: 'DELETE',
76:       headers: { Authorization: `Bearer ${session.access_token}` },
77:     })
78:     
79:     if (error) {
80:       throw new Error(error.message || 'Error deleting transaction')
81:     }
82:     setTransactions((prev) => prev.filter((t) => t.id !== id))
83:   }
84: 
85:   return {
86:     transactions,
87:     loading,
88:     error,
89:     fetchTransactions,
90:     createTransaction,
91:     deleteTransaction,
92:   }
93: }
````

## File: frontend/src/features/settings/components/WhatsAppSettings.tsx
````typescript
  1: import { useState, useEffect, type FormEvent } from 'react'
  2: import { supabase } from '@/shared/lib/supabase'
  3: import { useAuthStore } from '@/features/auth/store'
  4: 
  5: const inputStyle: React.CSSProperties = {
  6:   width: '100%',
  7:   padding: '10px 14px',
  8:   borderRadius: '8px',
  9:   backgroundColor: '#fafafa',
 10:   border: '1px solid #e5e5e5',
 11:   color: '#171717',
 12:   fontSize: '14px',
 13:   outline: 'none',
 14:   fontFamily: 'inherit',
 15:   transition: 'border-color 0.15s',
 16: }
 17: 
 18: export function WhatsAppSettings() {
 19:   const [phoneNumberId, setPhoneNumberId] = useState('')
 20:   const [accessToken, setAccessToken] = useState('')
 21:   const [verifyToken, setVerifyToken] = useState('')
 22:   const [saving, setSaving] = useState(false)
 23:   const [loading, setLoading] = useState(true)
 24:   const [success, setSuccess] = useState<string | null>(null)
 25:   const [error, setError] = useState<string | null>(null)
 26:   const session = useAuthStore((s) => s.session)
 27: 
 28:   useEffect(() => {
 29:     const fetchSettings = async () => {
 30:       const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
 31:       const { data, error } = await supabase.functions.invoke('user-settings/integrations', {
 32:         method: 'GET',
 33:         headers,
 34:       })
 35:       if (!error && data) {
 36:         const d = data.data
 37:         if (d) {
 38:           setPhoneNumberId(d.whatsapp_phone_number_id || '')
 39:           setVerifyToken(d.whatsapp_verify_token || '')
 40:           setAccessToken(d.has_access_token ? '••••••••' : '')
 41:         }
 42:       }
 43:       setLoading(false)
 44:     }
 45:     if (session?.access_token) {
 46:       fetchSettings()
 47:     } else {
 48:       setLoading(false)
 49:     }
 50:   }, [session?.access_token])
 51: 
 52:   const handleSubmit = async (e: FormEvent) => {
 53:     e.preventDefault()
 54:     setError(null)
 55:     setSuccess(null)
 56:     setSaving(true)
 57:     try {
 58:       const body: Record<string, string> = {
 59:         whatsapp_phone_number_id: phoneNumberId,
 60:         whatsapp_verify_token: verifyToken,
 61:       }
 62:       if (accessToken && !accessToken.startsWith('•')) {
 63:         body.whatsapp_access_token = accessToken
 64:       }
 65: 
 66:       const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
 67:       const { error } = await supabase.functions.invoke('user-settings/integrations', {
 68:         method: 'PUT',
 69:         body,
 70:         headers,
 71:       })
 72:       
 73:       if (error) {
 74:         throw new Error(error.message || 'Error saving settings')
 75:       }
 76:       setSuccess('Configuración guardada')
 77:     } catch (err: unknown) {
 78:       setError(err instanceof Error ? err.message : 'Error al guardar')
 79:     } finally {
 80:       setSaving(false)
 81:     }
 82:   }
 83: 
 84:   if (loading) {
 85:     return (
 86:       <div style={{ maxWidth: '480px' }}>
 87:         <div className="skeleton" style={{ height: '28px', width: '180px', marginBottom: '12px' }} />
 88:         <div className="skeleton" style={{ height: '280px', borderRadius: '14px' }} />
 89:       </div>
 90:     )
 91:   }
 92: 
 93:   return (
 94:     <div className="animate-fade-in" style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
 95:       {/* Header */}
 96:       <div>
 97:         <button
 98:           onClick={() => window.history.back()}
 99:           style={{
100:             display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#737373',
101:             background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '4px',
102:             transition: 'color 0.15s',
103:           }}
104:           onMouseEnter={(e) => { e.currentTarget.style.color = '#0a0a0a' }}
105:           onMouseLeave={(e) => { e.currentTarget.style.color = '#737373' }}
106:         >
107:           <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
108:             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
109:           </svg>
110:           Atrás
111:         </button>
112:         <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>API de WhatsApp</h1>
113:         <p style={{ fontSize: '14px', color: '#737373', margin: '2px 0 0' }}>
114:           Conecta tu número de Meta Business para recibir transacciones vía WhatsApp
115:         </p>
116:       </div>
117: 
118:       {/* Form card */}
119:       <div style={{
120:         backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5', padding: '24px',
121:       }}>
122:         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
123:           <div>
124:             <label htmlFor="wa-phone-id" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Phone Number ID</label>
125:             <input
126:               id="wa-phone-id" value={phoneNumberId} onChange={(e) => setPhoneNumberId(e.target.value)}
127:               placeholder="1234567890" style={inputStyle}
128:               onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
129:               onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
130:             />
131:           </div>
132:           <div>
133:             <label htmlFor="wa-token" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Access Token</label>
134:             <input
135:               id="wa-token" type="password" value={accessToken}
136:               onFocus={() => { if (accessToken.startsWith('•')) setAccessToken('') }}
137:               onChange={(e) => setAccessToken(e.target.value)}
138:               placeholder="EAAxxxxxxx..." style={inputStyle}
139:             />
140:             <p style={{ fontSize: '12px', color: '#a3a3a3', margin: '4px 0 0' }}>Se almacena encriptado en la base de datos</p>
141:           </div>
142:           <div>
143:             <label htmlFor="wa-verify" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Verify Token</label>
144:             <input
145:               id="wa-verify" value={verifyToken} onChange={(e) => setVerifyToken(e.target.value)}
146:               placeholder="mi_token_secreto" style={inputStyle}
147:               onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
148:               onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
149:             />
150:             <p style={{ fontSize: '12px', color: '#a3a3a3', margin: '4px 0 0' }}>Usado por Meta para verificar tu webhook</p>
151:           </div>
152: 
153:           {error && (
154:             <div className="animate-fade-in" style={{
155:               padding: '12px', borderRadius: '8px', backgroundColor: '#fef2f2',
156:               color: '#dc2626', fontSize: '13px', border: '1px solid #fecaca',
157:             }}>
158:               {error}
159:             </div>
160:           )}
161:           {success && (
162:             <div className="animate-fade-in" style={{
163:               padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4',
164:               color: '#16a34a', fontSize: '13px', border: '1px solid #bbf7d0',
165:             }}>
166:               {success}
167:             </div>
168:           )}
169: 
170:           <button
171:             type="submit" disabled={saving}
172:             style={{
173:               width: '100%', padding: '10px 16px', borderRadius: '10px', border: 'none',
174:               backgroundColor: '#0a0a0a', color: '#fafafa', fontSize: '14px', fontWeight: 600,
175:               cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
176:               opacity: saving ? 0.5 : 1, display: 'flex', alignItems: 'center',
177:               justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
178:             }}
179:             onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#262626' }}
180:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a0a0a' }}
181:           >
182:             {saving && (
183:               <svg className="animate-spin" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
184:                 <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
185:                 <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
186:               </svg>
187:             )}
188:             Guardar configuración
189:           </button>
190:         </form>
191:       </div>
192: 
193:       {/* Webhook URL info */}
194:       <div style={{
195:         backgroundColor: '#f5f5f5', borderRadius: '14px', padding: '20px',
196:         border: '1px solid #e5e5e5',
197:       }}>
198:         <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 8px' }}>URL del Webhook</h3>
199:         <code style={{
200:           display: 'block', padding: '10px 14px', borderRadius: '8px',
201:           backgroundColor: '#fff', border: '1px solid #e5e5e5',
202:           fontSize: '12px', color: '#525252', wordBreak: 'break-all',
203:           fontFamily: 'monospace',
204:         }}>
205:           {import.meta.env.VITE_SUPABASE_URL}/functions/v1/whatsapp-webhook
206:         </code>
207:         <p style={{ fontSize: '12px', color: '#737373', margin: '8px 0 0' }}>
208:           Configura esta URL en tu app de Meta Business como endpoint del webhook de WhatsApp.
209:         </p>
210:       </div>
211:     </div>
212:   )
213: }
````

## File: frontend/src/features/ventures/components/VentureDetail.tsx
````typescript
  1: // features/ventures/components/VentureDetail.tsx — Vista de detalle monochrome
  2: import { useEffect, useState } from 'react'
  3: import { useParams, useNavigate } from 'react-router-dom'
  4: import { supabase } from '@/shared/lib/supabase'
  5: import { useTransactions } from '@/features/transactions/hooks/useTransactions'
  6: import { useAuthStore } from '@/features/auth/store'
  7: import { TransactionForm } from '@/features/transactions/components/TransactionForm'
  8: import { formatCurrency, formatDate, formatROI } from '@/shared/lib/formatters'
  9: import { VENTURE_TYPE_LABELS, VENTURE_STATUS_LABELS } from '@/shared/lib/constants'
 10: import { calculateROI, breakEven, netProfit, ventureHealth } from '../utils'
 11: import { VentureForm } from './VentureForm'
 12: import type { Venture, CreateVentureInput } from '../types'
 13: 
 14: export function VentureDetail() {
 15:   const { id } = useParams<{ id: string }>()
 16:   const navigate = useNavigate()
 17:   const [venture, setVenture] = useState<Venture | null>(null)
 18:   const [loading, setLoading] = useState(true)
 19:   const [showTxForm, setShowTxForm] = useState(false)
 20:   const [showEditForm, setShowEditForm] = useState(false)
 21:   const session = useAuthStore((s) => s.session)
 22: 
 23:   const { transactions, loading: txLoading, fetchTransactions, createTransaction, deleteTransaction } = useTransactions(id)
 24: 
 25:   useEffect(() => {
 26:     if (!id) return
 27:     const fetchVenture = async () => {
 28:       setLoading(true)
 29:       const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
 30:       const { data, error } = await supabase.functions.invoke(`ventures/${id}`, {
 31:         method: 'GET',
 32:         headers,
 33:       })
 34:       if (error || !data) { navigate('/ventures'); return }
 35:       setVenture(data.data)
 36:       setLoading(false)
 37:     }
 38:     if (session?.access_token) {
 39:       fetchVenture()
 40:       fetchTransactions(id)
 41:     }
 42:   }, [id, navigate, fetchTransactions, session?.access_token])
 43: 
 44:   const handleEditVenture = async (input: CreateVentureInput) => {
 45:     if (!id) return
 46:     const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
 47:     const { data, error } = await supabase.functions.invoke(`ventures/${id}`, {
 48:       method: 'PUT',
 49:       body: input,
 50:       headers,
 51:     })
 52:     if (error) throw new Error(error.message || 'Error updating venture')
 53:     setVenture(data.data)
 54:   }
 55: 
 56:   const handleDeleteVenture = async () => {
 57:     if (!id || !confirm('¿Eliminar este venture y todas sus transacciones?')) return
 58:     const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
 59:     await supabase.functions.invoke(`ventures/${id}`, {
 60:       method: 'DELETE',
 61:       headers,
 62:     })
 63:     navigate('/ventures')
 64:   }
 65: 
 66:   if (loading || !venture) {
 67:     return (
 68:       <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
 69:         <div className="skeleton" style={{ height: '28px', width: '180px' }} />
 70:         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 71:           {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '14px' }} />)}
 72:         </div>
 73:         <div className="skeleton" style={{ height: '320px', borderRadius: '14px' }} />
 74:       </div>
 75:     )
 76:   }
 77: 
 78:   const roi = calculateROI(venture.invested, venture.returned)
 79:   const health = ventureHealth(roi)
 80:   const net = netProfit(venture.invested, venture.returned)
 81:   const remaining = breakEven(venture.invested, venture.returned)
 82: 
 83:   const healthColor = health === 'positive' ? '#16a34a' : health === 'negative' ? '#dc2626' : '#525252'
 84:   const netColor = net >= 0 ? '#16a34a' : '#dc2626'
 85: 
 86:   return (
 87:     <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
 88:       {/* Header */}
 89:       <div className="animate-fade-in" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
 90:         <div>
 91:           <button
 92:             onClick={() => navigate('/ventures')}
 93:             style={{
 94:               display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#737373',
 95:               background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '4px',
 96:               transition: 'color 0.15s',
 97:             }}
 98:             onMouseEnter={(e) => { e.currentTarget.style.color = '#0a0a0a' }}
 99:             onMouseLeave={(e) => { e.currentTarget.style.color = '#737373' }}
100:           >
101:             <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
102:               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
103:             </svg>
104:             Ventures
105:           </button>
106:           <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>{venture.name}</h1>
107:           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
108:             <span style={{ fontSize: '13px', color: '#737373' }}>{VENTURE_TYPE_LABELS[venture.type]}</span>
109:             <span style={{ color: '#d4d4d4' }}>·</span>
110:             <span style={{ fontSize: '13px', color: '#737373' }}>{VENTURE_STATUS_LABELS[venture.status]}</span>
111:             {venture.notes && (
112:               <>
113:                 <span style={{ color: '#d4d4d4' }}>·</span>
114:                 <span style={{ fontSize: '13px', color: '#a3a3a3' }}>{venture.notes}</span>
115:               </>
116:             )}
117:           </div>
118:         </div>
119:         <div style={{ display: 'flex', gap: '8px' }}>
120:           <button
121:             onClick={() => setShowEditForm(true)}
122:             style={{
123:               padding: '8px 14px', borderRadius: '10px', border: '1px solid #e5e5e5',
124:               backgroundColor: '#fff', color: '#525252', fontSize: '13px', fontWeight: 500,
125:               cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
126:             }}
127:             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
128:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff' }}
129:           >
130:             Editar
131:           </button>
132:           <button
133:             onClick={handleDeleteVenture}
134:             style={{
135:               padding: '8px 14px', borderRadius: '10px', border: '1px solid #fecaca',
136:               backgroundColor: '#fff', color: '#dc2626', fontSize: '13px', fontWeight: 500,
137:               cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
138:             }}
139:             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2' }}
140:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff' }}
141:           >
142:             Eliminar
143:           </button>
144:         </div>
145:       </div>
146: 
147:       {/* Stats grid */}
148:       <div className="animate-fade-in grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ animationDelay: '50ms' }}>
149:         {[
150:           { label: 'Invertido', value: formatCurrency(venture.invested), color: '#0a0a0a' },
151:           { label: 'Retornado', value: formatCurrency(venture.returned), color: '#0a0a0a' },
152:           { label: 'ROI', value: formatROI(roi), color: healthColor },
153:           { label: net >= 0 ? 'Ganancia' : 'Por recuperar', value: formatCurrency(net >= 0 ? net : remaining), color: netColor },
154:         ].map((stat) => (
155:           <div key={stat.label} style={{
156:             backgroundColor: '#fff', borderRadius: '14px', padding: '16px 20px',
157:             border: '1px solid #e5e5e5',
158:           }}>
159:             <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 4px' }}>{stat.label}</p>
160:             <p style={{ fontSize: '18px', fontWeight: 700, color: stat.color, margin: 0, letterSpacing: '-0.02em' }}>{stat.value}</p>
161:           </div>
162:         ))}
163:       </div>
164: 
165:       {/* Transactions */}
166:       <div className="animate-fade-in" style={{
167:         backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5',
168:         overflow: 'hidden', animationDelay: '100ms',
169:       }}>
170:         <div style={{
171:           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
172:           padding: '16px 20px', borderBottom: '1px solid #f5f5f5',
173:         }}>
174:           <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>
175:             Transacciones
176:             <span style={{ color: '#a3a3a3', fontWeight: 400, marginLeft: '6px' }}>({transactions.length})</span>
177:           </h2>
178:           <button
179:             onClick={() => setShowTxForm(true)}
180:             style={{
181:               display: 'inline-flex', alignItems: 'center', gap: '6px',
182:               padding: '6px 12px', borderRadius: '8px',
183:               backgroundColor: '#f5f5f5', color: '#525252', fontSize: '13px', fontWeight: 500,
184:               border: 'none', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
185:             }}
186:             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e5e5e5'; e.currentTarget.style.color = '#0a0a0a' }}
187:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.color = '#525252' }}
188:           >
189:             <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
190:               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
191:             </svg>
192:             Agregar
193:           </button>
194:         </div>
195: 
196:         {txLoading ? (
197:           <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
198:             {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '48px', borderRadius: '10px' }} />)}
199:           </div>
200:         ) : transactions.length === 0 ? (
201:           <div style={{ textAlign: 'center', padding: '56px 20px' }}>
202:             <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>Sin transacciones aún</p>
203:             <button
204:               onClick={() => setShowTxForm(true)}
205:               style={{
206:                 marginTop: '8px', fontSize: '14px', color: '#0a0a0a', fontWeight: 500,
207:                 background: 'none', border: 'none', cursor: 'pointer', padding: 0,
208:                 textDecoration: 'underline', textUnderlineOffset: '4px',
209:               }}
210:             >
211:               Registrar la primera →
212:             </button>
213:           </div>
214:         ) : (
215:           <div>
216:             {transactions.map((tx, i) => (
217:               <div
218:                 key={tx.id}
219:                 style={{
220:                   display: 'flex', alignItems: 'center', gap: '14px',
221:                   padding: '12px 20px', transition: 'background-color 0.15s',
222:                   borderTop: i > 0 ? '1px solid #fafafa' : 'none',
223:                 }}
224:                 onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fafafa' }}
225:                 onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
226:               >
227:                 <div style={{
228:                   width: '32px', height: '32px', borderRadius: '8px',
229:                   display: 'flex', alignItems: 'center', justifyContent: 'center',
230:                   fontSize: '14px', flexShrink: 0,
231:                   backgroundColor: tx.type === 'income' ? '#f0fdf4' : '#fef2f2',
232:                   color: tx.type === 'income' ? '#16a34a' : '#dc2626',
233:                 }}>
234:                   {tx.type === 'income' ? '↑' : '↓'}
235:                 </div>
236:                 <div style={{ flex: 1, minWidth: 0 }}>
237:                   <p style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
238:                     {tx.description || 'Sin descripción'}
239:                   </p>
240:                   <p style={{ fontSize: '12px', color: '#a3a3a3', margin: '2px 0 0' }}>{formatDate(tx.date)}</p>
241:                 </div>
242:                 <p style={{
243:                   fontSize: '13px', fontWeight: 600, flexShrink: 0, margin: 0,
244:                   color: tx.type === 'income' ? '#16a34a' : '#dc2626',
245:                 }}>
246:                   {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
247:                 </p>
248:                 <button
249:                   onClick={() => deleteTransaction(tx.id)}
250:                   style={{
251:                     padding: '4px', borderRadius: '6px', background: 'none', border: 'none',
252:                     cursor: 'pointer', color: '#d4d4d4', display: 'flex',
253:                     transition: 'color 0.15s',
254:                     opacity: 0,
255:                   }}
256:                   onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.opacity = '1' }}
257:                   onMouseLeave={(e) => { e.currentTarget.style.color = '#d4d4d4'; e.currentTarget.style.opacity = '0' }}
258:                   title="Eliminar"
259:                   className="group-hover:opacity-100"
260:                 >
261:                   <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
262:                     <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
263:                   </svg>
264:                 </button>
265:               </div>
266:             ))}
267:           </div>
268:         )}
269:       </div>
270: 
271:       {/* Modals */}
272:       {showTxForm && (
273:         <TransactionForm
274:           ventureId={venture.id}
275:           onSubmit={createTransaction}
276:           onClose={() => setShowTxForm(false)}
277:         />
278:       )}
279:       {showEditForm && (
280:         <VentureForm
281:           venture={venture}
282:           onSubmit={handleEditVenture}
283:           onClose={() => setShowEditForm(false)}
284:         />
285:       )}
286:     </div>
287:   )
288: }
````

## File: frontend/src/features/ventures/hooks/useVentures.ts
````typescript
 1: // features/ventures/hooks/useVentures.ts — Hook para CRUD de ventures
 2: import { useEffect, useCallback } from 'react'
 3: import { supabase } from '@/shared/lib/supabase'
 4: import { useVenturesStore } from '../store'
 5: import { useAuthStore } from '@/features/auth/store'
 6: import type { CreateVentureInput, UpdateVentureInput } from '../types'
 7: 
 8: export function useVentures() {
 9:   const ventures = useVenturesStore((s) => s.ventures)
10:   const loading = useVenturesStore((s) => s.loading)
11:   const error = useVenturesStore((s) => s.error)
12:   const setVentures = useVenturesStore((s) => s.setVentures)
13:   const addVentureAction = useVenturesStore((s) => s.addVenture)
14:   const updateVentureAction = useVenturesStore((s) => s.updateVenture)
15:   const removeVentureAction = useVenturesStore((s) => s.removeVenture)
16:   const setLoading = useVenturesStore((s) => s.setLoading)
17:   const setError = useVenturesStore((s) => s.setError)
18: 
19:   // Observar sesión del auth store para saber cuándo está lista
20:   const session = useAuthStore((s) => s.session)
21: 
22:   const fetchVentures = useCallback(async () => {
23:     setLoading(true)
24:     setError(null)
25: 
26:     const headers = session?.access_token 
27:       ? { Authorization: `Bearer ${session.access_token}` }
28:       : undefined
29: 
30:     const { data, error: invokeError } = await supabase.functions.invoke('ventures', {
31:       method: 'GET',
32:       headers,
33:     })
34: 
35:     if (invokeError) {
36:       setError(invokeError.message || 'Error fetching ventures')
37:       setLoading(false)
38:       return
39:     }
40:     setVentures(data?.data ?? [])
41:     setLoading(false)
42:   }, [session, setLoading, setError, setVentures])
43: 
44:   // Solo hacer fetch cuando la sesión esté disponible
45:   useEffect(() => {
46:     if (session?.access_token) {
47:       fetchVentures()
48:     }
49:   }, [session?.access_token, fetchVentures])
50: 
51:   const createVenture = async (input: CreateVentureInput) => {
52:     const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
53:     const { data, error } = await supabase.functions.invoke('ventures', {
54:       method: 'POST',
55:       body: input,
56:       headers,
57:     })
58: 
59:     if (error) throw new Error(error.message || 'Error creating venture')
60:     addVentureAction(data.data)
61:     return data.data
62:   }
63: 
64:   const updateVenture = async (id: string, input: Partial<UpdateVentureInput>) => {
65:     const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
66:     const { data, error } = await supabase.functions.invoke(`ventures/${id}`, {
67:       method: 'PUT',
68:       body: input,
69:       headers,
70:     })
71: 
72:     if (error) throw new Error(error.message || 'Error updating venture')
73:     updateVentureAction(data.data)
74:     return data.data
75:   }
76: 
77:   const deleteVenture = async (id: string) => {
78:     const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
79:     const { error } = await supabase.functions.invoke(`ventures/${id}`, {
80:       method: 'DELETE',
81:       headers,
82:     })
83: 
84:     if (error) {
85:       throw new Error(error.message || 'Error deleting venture')
86:     }
87:     removeVentureAction(id)
88:   }
89: 
90:   return {
91:     ventures,
92:     loading,
93:     error,
94:     fetchVentures,
95:     createVenture,
96:     updateVenture,
97:     deleteVenture,
98:   }
99: }
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
 25: | **Supabase Schema** | ✅ Listo | ventures, transactions, household_expenses, user_integrations, whatsapp_keywords (con RLS) |
 26: | **Edge Functions (Backend)** | ✅ Desplegado | ventures, transactions, keywords, whatsapp-config, whatsapp-webhook |
 27: | **Auth (Frontend)** | ✅ Listo | Monochrome split layout (Supabase style) + Google OAuth |
 28: | **Layout (Frontend)** | ✅ Listo | Top-Down Nav layout, Slide-Down menú de navegación, unificación de Avatar/Settings |
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
201: │       ├── 004_user_integrations.sql
202: │       └── 005_whatsapp_keywords.sql
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
296: ### 004_user_integrations.sql
297: ```sql
298: create table user_integrations (
299:   id uuid primary key default gen_random_uuid(),
300:   user_id uuid references auth.users not null,
301:   provider text not null,
302:   config jsonb not null,
303:   encrypted_token text,
304:   is_active boolean default true,
305:   created_at timestamptz default now(),
306:   updated_at timestamptz default now(),
307:   unique(user_id, provider)
308: );
309: ```
310: 
311: ### 005_whatsapp_keywords.sql
312: ```sql
313: create table whatsapp_keywords (
314:   id uuid primary key default gen_random_uuid(),
315:   user_id uuid references auth.users not null,
316:   keyword text not null,
317:   maps_to text check (maps_to in ('income','expense')) not null,
318:   venture_id uuid references ventures(id) on delete set null,
319:   created_at timestamptz default now()
320: );
321: 
322: -- RPC Functions
323: -- encrypt_token(p_token text, p_key text) returns text
324: -- decrypt_token(p_encrypted_token text, p_key text) returns text
325: ```
326: 
327: ---
328: 
329: ## Variables de entorno
330: 
331: | Variable | Ubicación | Acceso |
332: |----------|-----------|--------|
333: | `VITE_SUPABASE_URL` | `frontend/.env` | Frontend — pública, protegida por RLS |
334: | `VITE_SUPABASE_ANON_KEY` | `frontend/.env` | Frontend — pública, protegida por RLS |
335: | `SUPABASE_URL` | Supabase secrets | Edge Functions únicamente |
336: | `SUPABASE_SERVICE_ROLE_KEY` | Supabase secrets | Edge Functions únicamente — **NUNCA en frontend** |
337: 
338: > El `service_role_key` bypasea RLS. Si llega al frontend, cualquier usuario puede leer todos los datos.
339: 
340: ---
341: 
342: ## Cálculos de negocio
343: 
344: ```typescript
345: // features/ventures/utils.ts — NUNCA persistir en DB
346: 
347: export const calculateROI = (invested: number, returned: number): number => {
348:   if (invested === 0) return 0
349:   return Number(((returned - invested) / invested * 100).toFixed(2))
350: }
351: 
352: export const breakEven = (invested: number, returned: number): number => {
353:   return Math.max(0, invested - returned)
354: }
355: 
356: export type VentureHealth = 'positive' | 'neutral' | 'negative'
357: export const ventureHealth = (roi: number): VentureHealth => {
358:   if (roi > 0) return 'positive'
359:   if (roi === 0) return 'neutral'
360:   return 'negative'
361: }
362: ```
363: 
364: ---
365: 
366: ## Reglas del agente
367: 
368: 1. Leer `CLAUDE.md` completo antes de cualquier acción
369: 2. Correr `npm run ctx` para obtener contexto actualizado del código
370: 3. No crear UI de Hogar en Fase 1
371: 4. ROI nunca se persiste — solo se calcula en frontend (`ventures/utils.ts`)
372: 5. Cada cambio a DB requiere su migration SQL versionada
373: 6. No usar `any` en TypeScript
374: 7. `service_role_key` nunca en `frontend/`
375: 8. Un feature = un commit atómico
376: 9. Nunca importar una feature desde otra feature — usar `shared/` si hay lógica común
377: 10. Tipos de dominio solo en `backend/_shared/types.ts`
378: 11. `pages/` son shells: sin lógica propia, solo montan features
379: 12. Cada feature tiene su propio `store.ts` de Zustand — sin store global
380: 13. Todas las peticiones al backend van via `VITE_SUPABASE_URL/functions/v1/{edge-function}`
381: 14. **Crucial:** El JWT de Supabase debe incluirse **manualmente** en `Authorization: Bearer` dentro de las llamadas a `supabase.functions.invoke`, ya que el SDK no lo persiste automáticamente en este método.
382: 15. Seguridad WhatsApp: Webhooks usan HMAC signature verification (Meta standard).
383: 
384: ---
385: 
386: ## Comandos
387: 
388: ```bash
389: # Frontend
390: npm run dev          # Levanta frontend en desarrollo (Vite)
391: npm run build        # Build de producción (tsc + vite build)
392: npm run lint         # ESLint en todo el monorepo
393: npm run ctx          # Genera repomix-output.md para agentes
394: 
395: # Supabase
396: npx supabase start   # DB local para desarrollo
397: npx supabase db push # Aplica migrations a Supabase producción
398: npx supabase functions deploy <name>  # Despliega Edge Function
399: ```
400: 
401: ---
402: 
403: ## Desarrollo y DX (Developer Experience)
404: 
405: - **Editor (VS Code/Cursor):** Se requiere el uso del archivo `.vscode/settings.json` para habilitar el soporte de Deno exclusivamente en `backend/supabase/functions`, evitando errores de tipado falsos en el frontend.
406: - **Extensiones recomendadas:** `denoland.vscode-deno`.
407: 
408: ---
409: 
410: ## Checklist MVP — Fase 1
411: 
412: ### Setup base
413: - [x] Monorepo con npm workspaces
414: - [x] `frontend` — Vite + React + TypeScript
415: - [x] Tailwind CSS v4
416: - [x] Path aliases configurados (`@/` → `src/`, `@backend/` → `../backend/`)
417: - [x] repomix + script `ctx`
418: - [x] `.gitignore` — bloquea todos los `.env`
419: - [x] Limpieza de archivos Vite default (App.css, svgs, hero.png)
420: - [x] Limpieza de MockData y shared/ui no usados
421: - [x] Configuración `.vscode/settings.json` para Deno support
422: 
423: ### Supabase
424: - [x] Proyecto creado en Supabase
425: - [x] Migration 001 aplicada (ventures + RLS)
426: - [x] Migration 002 aplicada (transactions + RLS)
427: - [x] Migration 003 aplicada (household_expenses — solo tabla)
428: - [x] Migration 004 aplicada (user_integrations + RLS)
429: - [x] Migration 005 aplicada (whatsapp_keywords + RLS)
430: - [x] Edge Functions desplegadas (ventures, transactions, keywords, whatsapp-config, whatsapp-webhook)
431: - [x] Rate limiting en Edge Functions
432: - [ ] Supabase Storage bucket para evidencias
433: - [x] RLS verificado
434: - [x] Verificación HMAC para WhatsApp Webhook
435: 
436: ### Auth
437: - [x] Pantalla login / registro (monochrome split UI)
438: - [x] Integración Google OAuth
439: - [x] Protección de rutas (ProtectedRoute)
440: - [x] Hook `useAuth` (Zustand + Supabase listener)
441: - [x] Persistencia de sesión
442: - [x] Inyección de Authorization Header en `supabase.functions.invoke`
443: 
444: ### Módulo Ventures
445: - [x] Listado de ventures con ROI calculado
446: - [x] Crear venture (form validado)
447: - [x] Editar venture
448: - [x] Detalle de venture con historial de transacciones
449: - [x] Agregar transacción (income / expense)
450: - [x] Upload de evidencia (form con file input)
451: 
452: ### Dashboard
453: - [x] 4 métricas globales (cards con animación)
454: - [x] Indicador ventures en rojo
455: - [x] Flujo del mes (ingresos vs gastos)
456: - [x] Historial mensual últimos 6 meses (Recharts bar chart)
457: 
458: ### Settings
459: - [x] WhatsApp API config (token, phone_number_id, verify_token)
460: - [x] Keywords manager (income/expense con venture opcional)
461: 
462: ### Deploy
463: - [ ] Variables de entorno configuradas en Vercel
464: - [ ] Deploy automático desde rama `main`
465: 
466: ---
467: 
468: ## Próximos pasos (por prioridad)
469: 
470: 1. **Storage bucket** — Crear bucket `evidence` en Supabase para evidence_url
471: 2. **Deploy Vercel** — Configurar env vars + CI/CD
472: 3. **Hogar (Fase 2)** — UI de gastos compartidos (esquema ya existe)
473: 4. **Webhooks (Fase 3)** — Mercado Pago + Stripe
````
