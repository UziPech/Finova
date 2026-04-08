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
      loans/
        index.ts
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
          Dashboard.view.tsx
          DashboardLoans.tsx
          MetricCard.tsx
          MonthlyChart.tsx
          SmartAlerts.view.tsx
          TypeDistributionChart.tsx
          VentureROIChart.tsx
          VentureStatusList.view.tsx
        hooks/
          useDashboardMetrics.ts
          useSmartAlerts.ts
          useVentureStatus.ts
        pages/
          DashboardPage.tsx
      loans/
        components/
          LoanForm.tsx
          LoansSection.view.tsx
        hooks/
          useLoans.ts
        types.ts
      settings/
        components/
          KeywordsManager.view.tsx
          WhatsAppSettings.view.tsx
        hooks/
          useKeywords.ts
          useWhatsAppSettings.ts
        pages/
          SettingsKeywordsPage.tsx
          SettingsWhatsAppPage.tsx
      transactions/
        components/
          TransactionForm.tsx
        hooks/
          useCategories.ts
          useTransactions.ts
        types.ts
      ventures/
        components/
          VentureCard.tsx
          VentureDetail.view.tsx
          VentureForm.tsx
          VenturesList.view.tsx
        hooks/
          useVentureDetail.ts
          useVentures.ts
        pages/
          VentureDetailPage.tsx
          VenturesPage.tsx
        store.ts
        types.ts
    shared/
      components/
        SlidePanel.tsx
      lib/
        constants.ts
        formatters.ts
        metrics.ts
        supabase.ts
      types/
        index.ts
    App.tsx
    main.tsx
    vite-env.d.ts
  package.json
CLAUDE.md
package.json
```

# Files

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

## File: backend/supabase/functions/loans/index.ts
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
 58:     if (!authHeader) {
 59:       return new Response(
 60:         JSON.stringify({ code: 'UNAUTHORIZED', message: 'Missing authorization header' }),
 61:         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
 62:       )
 63:     }
 64: 
 65:     const supabase = createClient(
 66:       Deno.env.get('SUPABASE_URL')!,
 67:       Deno.env.get('SUPABASE_ANON_KEY')!,
 68:       { global: { headers: { Authorization: authHeader } } }
 69:     )
 70: 
 71:     const { data: { user }, error: authError } = await supabase.auth.getUser()
 72:     if (authError || !user) {
 73:       console.error('[Loans] Auth Error:', authError?.message || 'No user found')
 74:       return new Response(
 75:         JSON.stringify({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' }),
 76:         { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
 77:       )
 78:     }
 79: 
 80:     const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
 81:     const rl = await checkRateLimit(admin, `user:loans:${user.id}`, 60, 60)
 82:     if (!rl.allowed && rl.response) return rl.response
 83: 
 84:     const url = new URL(req.url)
 85:     const parts = url.pathname.split('/').filter(Boolean)
 86:     const loanId = parts.length > 1 ? parts[parts.length - 1] : null
 87:     const method = req.method
 88:     const ventureIdParams = url.searchParams.get('venture_id')
 89:     const rh = { ...corsHeaders, ...rl.headers, 'Content-Type': 'application/json' }
 90: 
 91:     // GET
 92:     if (method === 'GET') {
 93:       if (loanId && loanId !== 'loans') {
 94:         const { data, error } = await supabase.from('loans').select('*, loan_payments(*)').eq('id', loanId).single()
 95:         if (error) return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Loan not found' }), { status: 404, headers: rh })
 96:         return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
 97:       }
 98:       
 99:       let query = supabase.from('loans').select('*, loan_payments(*)').order('created_at', { ascending: false })
100:       if (ventureIdParams) {
101:         query = query.eq('venture_id', ventureIdParams)
102:       }
103:       
104:       const { data, error } = await query
105:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
106:       return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
107:     }
108: 
109:     // POST
110:     if (method === 'POST') {
111:       const body = await req.json()
112:       if (!body.name || !body.principal || !body.start_date || !body.venture_id) {
113:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'name, principal, start_date and venture_id are required' }), { status: 400, headers: rh })
114:       }
115:       
116:       const { data, error } = await supabase.from('loans').insert({
117:         user_id: user.id,
118:         venture_id: body.venture_id,
119:         name: body.name,
120:         principal: body.principal,
121:         interest_rate: body.interest_rate || 0,
122:         start_date: body.start_date,
123:         end_date: body.end_date || null,
124:         status: body.status || 'active',
125:         notes: body.notes || null,
126:       }).select().single()
127:       
128:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
129:       
130:       // Automatic payment generation logic (simplified)
131:       if (body.generate_payments && body.payment_count > 0 && body.payment_amount) {
132:           const payments = [];
133:           let currentDate = new Date(body.start_date);
134:           for(let i = 0; i < body.payment_count; i++) {
135:               currentDate.setMonth(currentDate.getMonth() + 1);
136:               payments.push({
137:                   loan_id: data.id,
138:                   user_id: user.id,
139:                   amount: body.payment_amount,
140:                   due_date: currentDate.toISOString().split('T')[0],
141:                   status: 'pending'
142:               });
143:           }
144:           const { error: paymentError } = await supabase.from('loan_payments').insert(payments);
145:           if (paymentError) {
146:               console.error("[Loans] Error generating payments:", paymentError);
147:           }
148:       }
149:       
150:       return new Response(JSON.stringify({ data }), { status: 201, headers: rh })
151:     }
152: 
153:     // PUT
154:     if (method === 'PUT') {
155:       if (!loanId || loanId === 'loans') {
156:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Loan ID required in path' }), { status: 400, headers: rh })
157:       }
158:       const body = await req.json()
159:       const { id: _id, ...fields } = body
160:       const { data, error } = await supabase.from('loans').update(fields).eq('id', loanId).select().single()
161:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
162:       return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
163:     }
164: 
165:     // DELETE
166:     if (method === 'DELETE') {
167:       if (!loanId || loanId === 'loans') {
168:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Loan ID required in path' }), { status: 400, headers: rh })
169:       }
170:       const { error } = await supabase.from('loans').delete().eq('id', loanId)
171:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
172:       return new Response(JSON.stringify({ message: 'Loan deleted' }), { status: 200, headers: rh })
173:     }
174: 
175:     return new Response(JSON.stringify({ code: 'METHOD_NOT_ALLOWED', message: `${method} not supported` }), { status: 405, headers: rh })
176:   } catch (err) {
177:     console.error('[Loans] Error:', err)
178:     return new Response(JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Unexpected error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
179:   }
180: })
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

## File: frontend/src/features/dashboard/components/Dashboard.view.tsx
````typescript
  1: // features/dashboard/components/DashboardView.tsx — Centro de mando financiero
  2: import { useEffect } from 'react'
  3: import { useVentures } from '@/features/ventures/hooks/useVentures'
  4: import { useTransactions } from '@/features/transactions/hooks/useTransactions'
  5: import { useDashboardMetrics } from '../hooks/useDashboardMetrics'
  6: import { formatCurrency, formatROI } from '@/shared/lib/formatters'
  7: import { MetricCard } from './MetricCard'
  8: import { MonthlyChart } from './MonthlyChart'
  9: import { VentureROIChart } from './VentureROIChart'
 10: import { TypeDistributionChart } from './TypeDistributionChart'
 11: import { VentureStatusList } from './VentureStatusList.view'
 12: import { SmartAlerts } from './SmartAlerts.view'
 13: import { DashboardLoans } from './DashboardLoans'
 14: 
 15: export function DashboardView() {
 16:   const { ventures, loading: venturesLoading } = useVentures()
 17:   const { transactions, loading: txLoading, fetchTransactions } = useTransactions()
 18: 
 19:   useEffect(() => {
 20:     fetchTransactions()
 21:   }, [fetchTransactions])
 22: 
 23:   // — Cálculos de métricas delegados al hook —
 24:   const {
 25:     totalInvested,
 26:     totalReturned,
 27:     activeVenturesCount,
 28:     isPersonalMajority,
 29:     avgMetric,
 30:     metricTitle,
 31:     trendText,
 32:     monthTxCount,
 33:     flujoLibre,
 34:     flujoTrendText,
 35:     capitalActivo
 36:   } = useDashboardMetrics(ventures, transactions)
 37: 
 38:   const loading = venturesLoading || txLoading
 39: 
 40:   if (loading) {
 41:     return (
 42:       <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
 43:         <div>
 44:           <div className="skeleton" style={{ height: '28px', width: '160px', marginBottom: '4px' }} />
 45:           <div className="skeleton" style={{ height: '16px', width: '260px' }} />
 46:         </div>
 47:         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 48:           {[...Array(4)].map((_, i) => (
 49:             <div key={i} className="skeleton" style={{ height: '128px', borderRadius: '14px' }} />
 50:           ))}
 51:         </div>
 52:         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 53:           <div className="skeleton" style={{ height: '320px', borderRadius: '14px' }} />
 54:           <div className="skeleton" style={{ height: '320px', borderRadius: '14px' }} />
 55:         </div>
 56:       </div>
 57:     )
 58:   }
 59: 
 60:   if (ventures.length === 0) {
 61:     return (
 62:       <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', minHeight: '80vh', alignItems: 'center', justifyContent: 'center' }}>
 63:         <div style={{
 64:           width: '80px',
 65:           height: '80px',
 66:           borderRadius: '20px',
 67:           backgroundColor: '#171717',
 68:           border: '1px solid #2a2a2a',
 69:           display: 'flex',
 70:           alignItems: 'center',
 71:           justifyContent: 'center',
 72:           marginBottom: '24px',
 73:           boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
 74:         }}>
 75:           <svg style={{ width: '32px', height: '32px', color: '#a3a3a3' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
 76:             <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
 77:           </svg>
 78:         </div>
 79:         <h1 style={{ fontSize: 'clamp(24px, 3vw, 28px)', fontWeight: 600, color: '#0a0a0a', letterSpacing: '-0.02em', margin: '0 0 12px 0', textAlign: 'center' }}>
 80:           Resumen Ejecutivo
 81:         </h1>
 82:         <p style={{ fontSize: '15px', color: '#737373', maxWidth: '400px', textAlign: 'center', margin: '0 0 32px 0', lineHeight: 1.6 }}>
 83:           No existen proyectos registrados en el portafolio. Para habilitar las métricas de análisis, registre un nuevo venture.
 84:         </p>
 85:         <button
 86:           onClick={() => window.location.href = '/ventures'}
 87:           style={{
 88:             display: 'inline-flex',
 89:             alignItems: 'center',
 90:             gap: '8px',
 91:             padding: '12px 24px',
 92:             borderRadius: '12px',
 93:             backgroundColor: '#0a0a0a',
 94:             color: '#fafafa',
 95:             fontSize: '15px',
 96:             fontWeight: 500,
 97:             border: 'none',
 98:             cursor: 'pointer',
 99:             transition: 'all 0.15s',
100:             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
101:           }}
102:           onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#262626' }}
103:           onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a0a0a' }}
104:           onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
105:           onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
106:         >
107:           <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
108:             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
109:           </svg>
110:           Crear tu primer venture
111:         </button>
112:       </div>
113:     )
114:   }
115: 
116: 
117:   return (
118:     <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
119:       {/* Header */}
120:       <div className="animate-fade-in">
121:         <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>
122:           Centro de mando
123:         </h1>
124:         <p style={{ fontSize: '14px', color: '#737373', margin: '2px 0 0' }}>
125:           {ventures.length} venture{ventures.length !== 1 ? 's' : ''} · {monthTxCount} transacciones este mes
126:         </p>
127:       </div>
128: 
129:       {/* Metric Cards */}
130:       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
131:         <MetricCard
132:           title="Flujo libre este mes"
133:           value={`${flujoLibre >= 0 ? '+' : ''}${formatCurrency(flujoLibre)}`}
134:           valueColor={flujoLibre >= 0 ? '#16a34a' : '#dc2626'}
135:           trend={{ value: flujoTrendText, positive: flujoLibre >= 0 }}
136:           delay={0}
137:         />
138:         <MetricCard
139:           title="Capital total activo"
140:           value={formatCurrency(capitalActivo)}
141:           subtitle={`en ${activeVenturesCount} venture${activeVenturesCount !== 1 ? 's' : ''} activo${activeVenturesCount !== 1 ? 's' : ''}`}
142:           delay={50}
143:         />
144:         <MetricCard
145:           title={metricTitle}
146:           value={isPersonalMajority ? `${avgMetric.toFixed(0)}%` : formatROI(avgMetric)}
147:           valueColor={isPersonalMajority ? (avgMetric > 20 ? '#16a34a' : '#dc2626') : (avgMetric > 0 ? '#16a34a' : avgMetric < 0 ? '#dc2626' : undefined)}
148:           trend={{ value: trendText, positive: isPersonalMajority ? avgMetric > 20 : avgMetric >= 0 }}
149:           delay={100}
150:         />
151:         <MetricCard
152:           title="Total invertido"
153:           value={formatCurrency(totalInvested)}
154:           subtitle={`${formatCurrency(totalReturned)} retornado`}
155:           delay={150}
156:         />
157:       </div>
158: 
159:       {/* Fila A: Charts principales */}
160:       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
161:         <div className="lg:col-span-2">
162:           <MonthlyChart transactions={transactions} />
163:         </div>
164:         <TypeDistributionChart ventures={ventures} />
165:       </div>
166: 
167:       {/* Fila B: ROI Comparativo + Estado de Ventures */}
168:       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
169:         <VentureROIChart ventures={ventures} />
170:         <VentureStatusList ventures={ventures} />
171:       </div>
172: 
173:       {/* Fila C: Préstamos Globales */}
174:       <DashboardLoans />
175: 
176:       {/* Fila D: Alertas inteligentes */}
177:       <SmartAlerts ventures={ventures} transactions={transactions} />
178: 
179:       {/* Guía de colores — UX info */}
180:       <div
181:         className="animate-fade-in"
182:         style={{
183:           backgroundColor: '#fafafa',
184:           borderRadius: '14px',
185:           padding: '16px 20px',
186:           border: '1px solid #f0f0f0',
187:           animationDelay: '500ms',
188:         }}
189:       >
190:         <p style={{ fontSize: '12px', fontWeight: 600, color: '#a3a3a3', margin: '0 0 10px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
191:           Guía de indicadores
192:         </p>
193:         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 28px', fontSize: '12px', color: '#525252' }}>
194:           <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
195:             <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
196:             Verde = {isPersonalMajority ? 'Presupuesto saludable' : 'ROI positivo o rentable'}
197:           </span>
198:           <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
199:             <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eab308' }} />
200:             Amarillo = {isPersonalMajority ? 'Presupuesto ajustado' : 'Neutral, vigilar'}
201:           </span>
202:           <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
203:             <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
204:             Rojo = {isPersonalMajority ? 'Presupuesto agotado' : 'En pérdida, revisar'}
205:           </span>
206:           <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
207:             <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }} />
208:             Azul = Informativo
209:           </span>
210:           <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
211:             <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#a3a3a3' }} />
212:             Gris = Pausado o sin datos
213:           </span>
214:         </div>
215:       </div>
216:     </div>
217:   )
218: }
````

## File: frontend/src/features/dashboard/components/SmartAlerts.view.tsx
````typescript
  1: // features/dashboard/components/SmartAlerts.tsx — Tarjetas horizontales de alerta
  2: import { useEffect } from 'react'
  3: import type { Venture, Transaction } from '@backend/_shared/types'
  4: import { useSmartAlerts } from '../hooks/useSmartAlerts'
  5: import { useLoans } from '@/features/loans/hooks/useLoans'
  6: 
  7: interface SmartAlertsProps {
  8:   ventures: Venture[]
  9:   transactions: Transaction[]
 10: }
 11: 
 12: 
 13: 
 14: export function SmartAlerts({ ventures, transactions }: SmartAlertsProps) {
 15:   const { loans, fetchLoans } = useLoans()
 16: 
 17:   useEffect(() => {
 18:     fetchLoans()
 19:   }, [fetchLoans])
 20: 
 21:   const { displayAlerts } = useSmartAlerts(ventures, transactions, loans)
 22: 
 23:   if (displayAlerts.length === 0) {
 24:     return (
 25:       <div
 26:         className="animate-fade-in"
 27:         style={{
 28:           backgroundColor: '#fff',
 29:           borderRadius: '14px',
 30:           padding: '20px',
 31:           border: '1px solid #e5e5e5',
 32:           animationDelay: '400ms',
 33:         }}
 34:       >
 35:         <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 12px' }}>
 36:           Alertas inteligentes
 37:         </h3>
 38:         <div
 39:           style={{
 40:             display: 'flex',
 41:             alignItems: 'center',
 42:             gap: '8px',
 43:             padding: '12px',
 44:             backgroundColor: '#f0fdf4',
 45:             borderRadius: '10px',
 46:           }}
 47:         >
 48:           <svg
 49:             style={{ width: '18px', height: '18px', color: '#16a34a', flexShrink: 0 }}
 50:             fill="none"
 51:             viewBox="0 0 24 24"
 52:             stroke="currentColor"
 53:             strokeWidth={2}
 54:           >
 55:             <path
 56:               strokeLinecap="round"
 57:               strokeLinejoin="round"
 58:               d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
 59:             />
 60:           </svg>
 61:           <span style={{ fontSize: '14px', color: '#166534', fontWeight: 500 }}>
 62:             Todo en orden. No hay alertas críticas.
 63:           </span>
 64:         </div>
 65:       </div>
 66:     )
 67:   }
 68: 
 69:   return (
 70:     <div
 71:       className="animate-fade-in"
 72:       style={{
 73:         backgroundColor: '#fff',
 74:         borderRadius: '14px',
 75:         padding: '20px',
 76:         border: '1px solid #e5e5e5',
 77:         animationDelay: '400ms',
 78:       }}
 79:     >
 80:       <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 12px' }}>
 81:         Alertas inteligentes
 82:       </h3>
 83: 
 84:       <div
 85:         style={{
 86:           display: 'grid',
 87:           gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
 88:           gap: '12px',
 89:         }}
 90:       >
 91:         {displayAlerts.map((alert) => (
 92:           <div
 93:             key={alert.id}
 94:             style={{
 95:               borderLeft: `3px solid ${alert.borderColor}`,
 96:               backgroundColor: alert.bgColor,
 97:               borderRadius: '0 10px 10px 0',
 98:               padding: '14px 16px',
 99:               display: 'flex',
100:               flexDirection: 'column',
101:               gap: '6px',
102:             }}
103:           >
104:             <p
105:               style={{
106:                 fontSize: '13px',
107:                 fontWeight: 600,
108:                 color: alert.titleColor,
109:                 margin: 0,
110:                 lineHeight: 1.3,
111:               }}
112:             >
113:               {alert.title}
114:             </p>
115:             <p
116:               style={{
117:                 fontSize: '12px',
118:                 color: '#525252',
119:                 margin: 0,
120:                 lineHeight: 1.4,
121:               }}
122:             >
123:               {alert.description}
124:             </p>
125:             <span
126:               style={{
127:                 fontSize: '12px',
128:                 fontWeight: 600,
129:                 color: alert.actionColor,
130:                 marginTop: '4px',
131:                 cursor: 'pointer',
132:               }}
133:             >
134:               {alert.actionLabel}
135:             </span>
136:           </div>
137:         ))}
138:       </div>
139:     </div>
140:   )
141: }
````

## File: frontend/src/features/dashboard/components/TypeDistributionChart.tsx
````typescript
  1: // features/dashboard/components/TypeDistributionChart.tsx
  2: import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
  3: import type { Venture } from '@backend/_shared/types'
  4: import { VENTURE_TYPE_LABELS } from '@/shared/lib/constants'
  5: import { formatCurrency } from '@/shared/lib/formatters'
  6: 
  7: interface TypeDistributionChartProps {
  8:   ventures: Venture[]
  9: }
 10: 
 11: const TYPE_COLORS: Record<string, string> = {
 12:   software: '#7F77DD',
 13:   physical: '#1D9E75',
 14:   investment: '#378ADD',
 15:   mixed: '#EF9F27',
 16: }
 17: 
 18: export function TypeDistributionChart({ ventures }: TypeDistributionChartProps) {
 19:   const totalInvested = ventures.reduce((sum, v) => sum + v.invested, 0)
 20: 
 21:   if (totalInvested === 0) {
 22:     return (
 23:       <div 
 24:         className="animate-fade-in"
 25:         style={{ 
 26:           backgroundColor: '#fff', 
 27:           border: '1px solid #e5e5e5', 
 28:           borderRadius: '14px', 
 29:           padding: '20px',
 30:           display: 'flex',
 31:           flexDirection: 'column',
 32:           alignItems: 'center',
 33:           justifyContent: 'center',
 34:           height: '315px',
 35:           animationDelay: '300ms'
 36:         }}
 37:       >
 38:         <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>Sin capital registrado aún</p>
 39:       </div>
 40:     )
 41:   }
 42: 
 43:   // Agrupar por type
 44:   const typeMap = ventures.reduce((acc, v) => {
 45:     if (!acc[v.type]) acc[v.type] = 0
 46:     acc[v.type] += v.invested
 47:     return acc
 48:   }, {} as Record<string, number>)
 49: 
 50:   const data = Object.entries(typeMap)
 51:     .map(([type, value]) => ({
 52:       type,
 53:       name: VENTURE_TYPE_LABELS[type] || type,
 54:       value,
 55:       percentage: (value / totalInvested) * 100
 56:     }))
 57:     .filter(d => d.value > 0)
 58:     .sort((a, b) => b.value - a.value)
 59: 
 60:   return (
 61:     <div
 62:       className="animate-fade-in"
 63:       style={{
 64:         backgroundColor: '#fff',
 65:         borderRadius: '14px',
 66:         padding: '20px',
 67:         border: '1px solid #e5e5e5',
 68:         animationDelay: '300ms',
 69:         display: 'flex',
 70:         flexDirection: 'column',
 71:       }}
 72:     >
 73:       <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 16px' }}>
 74:         Distribución por tipo
 75:       </h3>
 76:       
 77:       <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
 78:         <div style={{ height: '180px', width: '100%', position: 'relative' }}>
 79:           <ResponsiveContainer width="100%" height="100%">
 80:             <PieChart>
 81:               <Pie
 82:                 data={data}
 83:                 cx="50%"
 84:                 cy="50%"
 85:                 innerRadius="55%"
 86:                 outerRadius="80%"
 87:                 paddingAngle={2}
 88:                 dataKey="value"
 89:                 stroke="none"
 90:               >
 91:                 {data.map((entry, index) => (
 92:                   <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.type] || '#a3a3a3'} />
 93:                 ))}
 94:               </Pie>
 95:               <Tooltip
 96:                 contentStyle={{
 97:                   backgroundColor: '#fff',
 98:                   border: '1px solid #e5e5e5',
 99:                   borderRadius: '10px',
100:                   fontSize: '13px',
101:                   boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
102:                 }}
103:                 formatter={(value: any) => [formatCurrency(Number(value)), 'Capital']}
104:               />
105:             </PieChart>
106:           </ResponsiveContainer>
107:         </div>
108: 
109:         <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
110:           {data.map((item, i) => (
111:             <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px' }}>
112:               <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
113:                 <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: TYPE_COLORS[item.type] || '#a3a3a3' }} />
114:                 <span style={{ color: '#525252' }}>{item.name}</span>
115:                 <span style={{ color: '#a3a3a3', fontSize: '11px' }}>{item.percentage.toFixed(1)}%</span>
116:               </div>
117:               <span style={{ fontWeight: 500, color: '#171717' }}>{formatCurrency(item.value)}</span>
118:             </div>
119:           ))}
120:         </div>
121:       </div>
122:     </div>
123:   )
124: }
````

## File: frontend/src/features/dashboard/components/VentureStatusList.view.tsx
````typescript
  1: // features/dashboard/components/VentureStatusList.tsx
  2: import type { Venture } from '@backend/_shared/types'
  3: import { formatROI } from '@/shared/lib/formatters'
  4: import { VENTURE_TYPE_LABELS } from '@/shared/lib/constants'
  5: import { useVentureStatus, formatTimeSince, getDotColor } from '../hooks/useVentureStatus'
  6: 
  7: interface VentureStatusListProps {
  8:   ventures: Venture[]
  9: }
 10: 
 11: export function VentureStatusList({ ventures }: VentureStatusListProps) {
 12:   const { ventureData, redCount } = useVentureStatus(ventures)
 13: 
 14:   if (ventureData.length === 0) {
 15:     return (
 16:       <div
 17:         className="animate-fade-in"
 18:         style={{
 19:           backgroundColor: '#fff',
 20:           border: '1px solid #e5e5e5',
 21:           borderRadius: '14px',
 22:           padding: '20px',
 23:           display: 'flex',
 24:           alignItems: 'center',
 25:           justifyContent: 'center',
 26:           minHeight: '200px',
 27:           animationDelay: '300ms',
 28:         }}
 29:       >
 30:         <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>
 31:           Sin ventures activos
 32:         </p>
 33:       </div>
 34:     )
 35:   }
 36: 
 37:   return (
 38:     <div
 39:       className="animate-fade-in"
 40:       style={{
 41:         backgroundColor: '#fff',
 42:         borderRadius: '14px',
 43:         padding: '20px',
 44:         border: '1px solid #e5e5e5',
 45:         animationDelay: '300ms',
 46:         display: 'flex',
 47:         flexDirection: 'column',
 48:       }}
 49:     >
 50:       {/* Header */}
 51:       <div
 52:         style={{
 53:           display: 'flex',
 54:           alignItems: 'center',
 55:           justifyContent: 'space-between',
 56:           marginBottom: '16px',
 57:         }}
 58:       >
 59:         <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: 0 }}>
 60:           Estado de ventures
 61:         </h3>
 62:         {redCount > 0 && (
 63:           <span
 64:             style={{
 65:               fontSize: '11px',
 66:               fontWeight: 600,
 67:               padding: '3px 12px',
 68:               borderRadius: '999px',
 69:               backgroundColor: '#fef2f2',
 70:               color: '#dc2626',
 71:               border: '1px solid #fecaca',
 72:             }}
 73:           >
 74:             {redCount} en rojo
 75:           </span>
 76:         )}
 77:       </div>
 78: 
 79:       {/* List */}
 80:       <div style={{ display: 'flex', flexDirection: 'column' }}>
 81:         {ventureData.map(({ venture, isPersonal, metricValue, health, days, badge }, idx) => (
 82:           <div
 83:             key={venture.id}
 84:             style={{
 85:               display: 'flex',
 86:               alignItems: 'center',
 87:               gap: '12px',
 88:               padding: '12px 0',
 89:               borderBottom: idx < ventureData.length - 1 ? '1px solid #f5f5f5' : 'none',
 90:             }}
 91:           >
 92:             {/* Dot */}
 93:             <span
 94:               style={{
 95:                 width: '10px',
 96:                 height: '10px',
 97:                 borderRadius: '50%',
 98:                 backgroundColor: getDotColor(health),
 99:                 flexShrink: 0,
100:               }}
101:             />
102: 
103:             {/* Info */}
104:             <div style={{ flex: 1, minWidth: 0 }}>
105:               <p
106:                 style={{
107:                   fontSize: '15px',
108:                   fontWeight: 700,
109:                   color: '#171717',
110:                   margin: 0,
111:                   whiteSpace: 'nowrap',
112:                   overflow: 'hidden',
113:                   textOverflow: 'ellipsis',
114:                 }}
115:               >
116:                 {venture.name}
117:               </p>
118:               <p style={{ fontSize: '12px', color: '#a3a3a3', margin: '1px 0 0' }}>
119:                 {VENTURE_TYPE_LABELS[venture.type] || venture.type} · {formatTimeSince(days)}
120:               </p>
121:             </div>
122: 
123:             {/* ROI / Health */}
124:             <span
125:               style={{
126:                 fontSize: '14px',
127:                 fontWeight: 700,
128:                 color:
129:                   health === 'positive'
130:                     ? '#16a34a'
131:                     : health === 'negative'
132:                       ? '#dc2626'
133:                       : '#a16207',
134:                 whiteSpace: 'nowrap',
135:               }}
136:             >
137:               {isPersonal ? `${metricValue}%` : formatROI(metricValue)}
138:             </span>
139: 
140:             {/* Action Badge */}
141:             <span
142:               style={{
143:                 fontSize: '11px',
144:                 fontWeight: 600,
145:                 padding: '3px 12px',
146:                 borderRadius: '999px',
147:                 backgroundColor: badge.bg,
148:                 color: badge.color,
149:                 border: `1px solid ${badge.border}`,
150:                 whiteSpace: 'nowrap',
151:                 flexShrink: 0,
152:               }}
153:             >
154:               {badge.label}
155:             </span>
156:           </div>
157:         ))}
158:       </div>
159:     </div>
160:   )
161: }
````

## File: frontend/src/features/dashboard/hooks/useDashboardMetrics.ts
````typescript
 1: import { useMemo } from 'react'
 2: import type { Venture, Transaction } from '@backend/_shared/types'
 3: import { calculateHealth, calculateROI } from '@/shared/lib/metrics'
 4: 
 5: export function useDashboardMetrics(ventures: Venture[], transactions: Transaction[]) {
 6:   return useMemo(() => {
 7:     const totalInvested = ventures.reduce((sum, v) => sum + v.invested, 0)
 8:     const totalReturned = ventures.reduce((sum, v) => sum + v.returned, 0)
 9:     const activeVentures = ventures.filter((v) => v.status === 'active')
10:     const businessVentures = activeVentures.filter(v => v.mode === 'business')
11:     const personalVentures = activeVentures.filter(v => v.mode === 'personal')
12: 
13:     const isPersonalMajority = personalVentures.length > businessVentures.length
14: 
15:     let avgMetric = 0
16:     let positiveCount = 0
17:     let metricTitle = 'ROI promedio'
18:     let trendText = ''
19: 
20:     if (isPersonalMajority) {
21:       const healths = personalVentures.map(v => calculateHealth(v.invested, v.returned))
22:       avgMetric = healths.length > 0 ? healths.reduce((a, b) => a + b, 0) / healths.length : 0
23:       positiveCount = healths.filter(h => h > 20).length
24:       metricTitle = 'Salud Promedio'
25:       trendText = `${positiveCount} proyecto${positiveCount !== 1 ? 's' : ''} saludable${positiveCount !== 1 ? 's' : ''}`
26:     } else {
27:       const rois = businessVentures.map(v => calculateROI(v.invested, v.returned))
28:       avgMetric = rois.length > 0 ? rois.reduce((a, b) => a + b, 0) / rois.length : 0
29:       positiveCount = rois.filter((r) => r > 0).length
30:       metricTitle = 'ROI Promedio'
31:       trendText = `${positiveCount} venture${positiveCount !== 1 ? 's' : ''} positivo${positiveCount !== 1 ? 's' : ''}`
32:     }
33: 
34:     const today = new Date()
35:     const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
36:     const monthTx = transactions.filter((t) => t.date.startsWith(currentMonthKey))
37:     const flujoLibre = monthTx.reduce(
38:       (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
39:       0
40:     )
41: 
42:     const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
43:     const prevMonthKey = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`
44:     const prevFlujo = transactions
45:       .filter((t) => t.date.startsWith(prevMonthKey))
46:       .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0)
47: 
48:     const flujoTrendText =
49:       prevFlujo !== 0
50:         ? `${flujoLibre >= prevFlujo ? '+' : ''}${(((flujoLibre - prevFlujo) / Math.abs(prevFlujo)) * 100).toFixed(0)}% vs mes anterior`
51:         : flujoLibre >= 0
52:           ? 'Positivo'
53:           : 'Negativo'
54: 
55:     const capitalActivo = activeVentures.reduce((sum, v) => sum + v.invested, 0)
56: 
57:     return {
58:       totalInvested,
59:       totalReturned,
60:       activeVenturesCount: activeVentures.length,
61:       isPersonalMajority,
62:       avgMetric,
63:       metricTitle,
64:       trendText,
65:       monthTxCount: monthTx.length,
66:       flujoLibre,
67:       flujoTrendText,
68:       capitalActivo
69:     }
70:   }, [ventures, transactions])
71: }
````

## File: frontend/src/features/dashboard/hooks/useSmartAlerts.ts
````typescript
  1: import { useMemo } from 'react'
  2: import type { Venture, Transaction } from '@backend/_shared/types'
  3: import type { Loan } from '@/features/loans/types'
  4: import { calculateROI } from '@/shared/lib/metrics'
  5: import { formatROI, formatCurrency, formatDate } from '@/shared/lib/formatters'
  6: 
  7: export interface AlertData {
  8:   id: string
  9:   title: string
 10:   description: string
 11:   actionLabel: string
 12:   borderColor: string
 13:   bgColor: string
 14:   titleColor: string
 15:   actionColor: string
 16: }
 17: 
 18: export function useSmartAlerts(ventures: Venture[], transactions: Transaction[], loans: Loan[]) {
 19:   return useMemo(() => {
 20:     const alerts: AlertData[] = []
 21:     const activeVentures = ventures.filter((v) => v.status === 'active')
 22:     const now = new Date()
 23: 
 24:     // 1. Alerta Roja: Venture negativo por más de 60 días
 25:     activeVentures.forEach((v) => {
 26:       const roi = calculateROI(v.invested, v.returned)
 27:       const startDate = new Date(v.start_date)
 28:       const diffDays = Math.ceil(
 29:         Math.abs(now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
 30:       )
 31:       const months = Math.floor(diffDays / 30)
 32: 
 33:       if (roi < 0 && diffDays > 60) {
 34:         const lost = v.invested - v.returned
 35:         alerts.push({
 36:           id: `red_${v.id}`,
 37:           title: `${v.name} lleva ${months > 0 ? `${months} ${months === 1 ? 'mes' : 'meses'}` : `${diffDays} días`} en déficit`,
 38:           description: `Pérdida acumulada de ${formatCurrency(lost)}. Se sugiere revisión de rentabilidad.`,
 39:           actionLabel: 'Analizar',
 40:           borderColor: '#ef4444',
 41:           bgColor: '#FCEBEB',
 42:           titleColor: '#991b1b',
 43:           actionColor: '#b91c1c',
 44:         })
 45:       }
 46:     })
 47: 
 48:     // 2. Alerta Verde: Mejor venture (ROI positivo)
 49:     if (activeVentures.length > 0) {
 50:       let bestVenture = activeVentures[0]
 51:       let bestROI = calculateROI(bestVenture.invested, bestVenture.returned)
 52: 
 53:       for (let i = 1; i < activeVentures.length; i++) {
 54:         const currentROI = calculateROI(activeVentures[i].invested, activeVentures[i].returned)
 55:         if (currentROI > bestROI) {
 56:           bestROI = currentROI
 57:           bestVenture = activeVentures[i]
 58:         }
 59:       }
 60: 
 61:       if (bestROI > 0) {
 62:         alerts.push({
 63:           id: 'green_best',
 64:           title: `${bestVenture.name} tiene el mayor rendimiento (${formatROI(bestROI)})`,
 65:           description: `Venture con mejor desempeño histórico. Evaluar escalabilidad.`,
 66:           actionLabel: 'Escalar',
 67:           borderColor: '#22c55e',
 68:           bgColor: '#EAF3DE',
 69:           titleColor: '#14532d',
 70:           actionColor: '#15803d',
 71:         })
 72:       }
 73:     }
 74: 
 75:     // 3. Alerta Amarilla: Gastos mensuales elevados
 76:     const expensesByMonth: Record<string, number> = {}
 77:     transactions
 78:       .filter((t) => t.type === 'expense')
 79:       .forEach((t) => {
 80:         const key = t.date.substring(0, 7)
 81:         expensesByMonth[key] = (expensesByMonth[key] || 0) + t.amount
 82:       })
 83: 
 84:     const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
 85:     const currentExpenses = expensesByMonth[currentMonthKey] || 0
 86: 
 87:     let past3Sum = 0
 88:     let past3Count = 0
 89:     for (let i = 1; i <= 3; i++) {
 90:       const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
 91:       const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
 92:       if (expensesByMonth[k] !== undefined) {
 93:         past3Sum += expensesByMonth[k]
 94:         past3Count++
 95:       }
 96:     }
 97: 
 98:     if (past3Count > 0) {
 99:       const avg = past3Sum / past3Count
100:       if (avg > 0 && currentExpenses > avg * 1.15) {
101:         const pctOver = (((currentExpenses - avg) / avg) * 100).toFixed(0)
102:         alerts.push({
103:           id: 'yellow_expense',
104:           title: `Incremento de gasto mensual (${pctOver}%)`,
105:           description: `Gasto actual: ${formatCurrency(currentExpenses)} vs Histórico: ${formatCurrency(avg)}. Se requiere revisión.`,
106:           actionLabel: 'Revisar',
107:           borderColor: '#eab308',
108:           bgColor: '#FAEEDA',
109:           titleColor: '#713f12',
110:           actionColor: '#a16207',
111:         })
112:       }
113:     }
114: 
115:     // 5. Alerta Gris/Azul: Proyectos en fase de IDEA o CERRADO
116:     const ideaCount = ventures.filter((v) => v.status === 'idea').length
117:     const closedCount = ventures.filter((v) => v.status === 'closed').length
118: 
119:     if (ideaCount > 0) {
120:       alerts.push({
121:         id: 'info_idea',
122:         title: `Proyectos en fase de validación (${ideaCount})`,
123:         description: 'Métricas excluidas del cálculo de ROI global actual.',
124:         actionLabel: 'Ver proyectos',
125:         borderColor: '#a3a3a3',
126:         bgColor: '#fafafa',
127:         titleColor: '#525252',
128:         actionColor: '#737373',
129:       })
130:     }
131: 
132:     if (closedCount > 0) {
133:       alerts.push({
134:         id: 'info_closed',
135:         title: `Proyectos inactivos / cerrados (${closedCount})`,
136:         description: 'Cuentas archivadas. Excluidas del cálculo de flujo activo.',
137:         actionLabel: 'Ver archivo',
138:         borderColor: '#a3a3a3',
139:         bgColor: '#f5f5f5',
140:         titleColor: '#737373',
141:         actionColor: '#a3a3a3',
142:       })
143:     }
144: 
145:     // 6. Alerta Naranja/Roja: Préstamos por vencer
146:     loans.filter(l => l.status !== 'paid').forEach((loan) => {
147:       if (!loan.loan_payments) return
148:       const nextPayment = loan.loan_payments.find(p => p.status === 'pending')
149:       if (nextPayment) {
150:         const dueDate = new Date(nextPayment.due_date)
151:         const diffMs = dueDate.getTime() - now.getTime()
152:         const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
153: 
154:         if (diffDays <= 0) {
155:           alerts.unshift({
156:             id: `loan_danger_${loan.id}`,
157:             title: `Pago Vencido: ${loan.name}`,
158:             description: `Se debió pagar ${formatCurrency(nextPayment.amount)} el ${formatDate(nextPayment.due_date)}.`,
159:             actionLabel: 'Pagar ahora',
160:             borderColor: '#dc2626',
161:             bgColor: '#fef2f2',
162:             titleColor: '#991b1b',
163:             actionColor: '#b91c1c',
164:           })
165:         } else if (diffDays <= 7) {
166:           alerts.unshift({
167:             id: `loan_warning_${loan.id}`,
168:             title: `Próximo pago: ${loan.name}`,
169:             description: `Vence en ${diffDays} día${diffDays !== 1 ? 's' : ''}. Monto: ${formatCurrency(nextPayment.amount)}.`,
170:             actionLabel: 'Preparar pago',
171:             borderColor: '#f97316',
172:             bgColor: '#fff7ed',
173:             titleColor: '#9a3412',
174:             actionColor: '#c2410c',
175:           })
176:         }
177:       }
178:     })
179: 
180:     const displayAlerts = alerts.slice(0, 4)
181:     return { displayAlerts }
182:   }, [ventures, transactions, loans])
183: }
````

## File: frontend/src/features/dashboard/hooks/useVentureStatus.ts
````typescript
 1: import { useMemo } from 'react'
 2: import type { Venture } from '@backend/_shared/types'
 3: import { calculateROI, ventureHealth, calculateHealth } from '@/shared/lib/metrics'
 4: 
 5: export type ActionBadge = {
 6:   label: string
 7:   bg: string
 8:   color: string
 9:   border: string
10: }
11: 
12: export function getActionBadge(roi: number, diffDays: number, status: string, isPersonal: boolean): ActionBadge {
13:   if (status === 'paused')
14:     return { label: 'Pausado', bg: '#f5f5f5', color: '#737373', border: '#e5e5e5' }
15:     
16:   if (isPersonal) {
17:     if (roi < 10) return { label: 'Crítico', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
18:     if (roi < 30) return { label: 'Cuidado', bg: '#fefce8', color: '#a16207', border: '#fde68a' }
19:     return { label: 'Saludable', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' }
20:   } else {
21:     if (roi < -30 || (roi < 0 && diffDays > 120))
22:       return { label: 'Revisar', bg: '#fef2f2', color: '#dc2626', border: '#fecaca' }
23:     if (roi < 0)
24:       return { label: 'En rojo', bg: '#fef2f2', color: '#ef4444', border: '#fecaca' }
25:     if (roi >= 0 && roi < 15)
26:       return { label: 'Vigilar', bg: '#fefce8', color: '#a16207', border: '#fde68a' }
27:     if (roi >= 15 && roi < 40)
28:       return { label: 'Mantener', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' }
29:     return { label: 'Escalar', bg: '#f0fdf4', color: '#15803d', border: '#86efac' }
30:   }
31: }
32: 
33: export function getDotColor(health: string): string {
34:   if (health === 'positive') return '#22c55e'
35:   if (health === 'negative') return '#ef4444'
36:   return '#eab308'
37: }
38: 
39: export function getDaysActive(startDate: string): number {
40:   const start = new Date(startDate)
41:   const now = new Date()
42:   return Math.ceil(Math.abs(now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
43: }
44: 
45: export function formatTimeSince(days: number): string {
46:   if (days < 30) return `${days} días`
47:   const months = Math.floor(days / 30)
48:   return `${months} ${months === 1 ? 'mes' : 'meses'}`
49: }
50: 
51: export interface VentureStatusData {
52:   venture: Venture
53:   isPersonal: boolean
54:   metricValue: number
55:   health: string
56:   days: number
57:   badge: ActionBadge
58: }
59: 
60: export function useVentureStatus(ventures: Venture[]) {
61:   return useMemo(() => {
62:     const relevantVentures = ventures.filter(
63:       (v) => v.status === 'active' || v.status === 'paused'
64:     )
65: 
66:     const redCount = relevantVentures.filter((v) => {
67:       const isPersonal = v.mode === 'personal'
68:       if (isPersonal) {
69:         const health = calculateHealth(v.invested, v.returned)
70:         return health < 20 && v.status === 'active'
71:       } else {
72:         const roi = calculateROI(v.invested, v.returned)
73:         return roi < 0 && v.status === 'active'
74:       }
75:     }).length
76: 
77:     const ventureData: VentureStatusData[] = relevantVentures
78:       .map((v) => {
79:         const isPersonal = v.mode === 'personal'
80:         const metricValue = isPersonal 
81:           ? calculateHealth(v.invested, v.returned)
82:           : calculateROI(v.invested, v.returned)
83:           
84:         const health = isPersonal
85:           ? (metricValue > 20 ? 'positive' : (metricValue > 0 ? 'neutral' : 'negative'))
86:           : ventureHealth(metricValue)
87:           
88:         const days = getDaysActive(v.start_date)
89:         const badge = getActionBadge(metricValue, days, v.status, isPersonal)
90:         return { venture: v, isPersonal, metricValue, health, days, badge }
91:       })
92:       .sort((a, b) => b.metricValue - a.metricValue)
93: 
94:     return { ventureData, redCount }
95:   }, [ventures])
96: }
````

## File: frontend/src/features/loans/components/LoansSection.view.tsx
````typescript
  1: import { useState, useEffect } from 'react'
  2: import { useLoans } from '../hooks/useLoans'
  3: import { LoanForm } from './LoanForm'
  4: import { formatCurrency, formatDate } from '@/shared/lib/formatters'
  5: 
  6: interface LoansSectionProps {
  7:   ventureId: string
  8: }
  9: 
 10: export function LoansSection({ ventureId }: LoansSectionProps) {
 11:   const { loans, loading, fetchLoans, createLoan, deleteLoan } = useLoans(ventureId)
 12:   const [showForm, setShowForm] = useState(false)
 13:   const [expandedLoanId, setExpandedLoanId] = useState<string | null>(null)
 14: 
 15:   useEffect(() => {
 16:     fetchLoans()
 17:   }, [fetchLoans])
 18: 
 19:   const handleCreate = async (input: any) => {
 20:     await createLoan(input)
 21:   }
 22: 
 23:   const toggleExpand = (id: string) => {
 24:     setExpandedLoanId((prev) => (prev === id ? null : id))
 25:   }
 26: 
 27:   return (
 28:     <div className="animate-fade-in" style={{
 29:       backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5',
 30:       overflow: 'hidden', animationDelay: '150ms', marginTop: '24px'
 31:     }}>
 32:       <div style={{
 33:         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
 34:         padding: '16px 20px', borderBottom: '1px solid #f5f5f5',
 35:       }}>
 36:         <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>
 37:           Préstamos & Financiación
 38:           <span style={{ color: '#a3a3a3', fontWeight: 400, marginLeft: '6px' }}>({loans.length})</span>
 39:         </h2>
 40:         <button
 41:           onClick={() => setShowForm(true)}
 42:           style={{
 43:             display: 'inline-flex', alignItems: 'center', gap: '6px',
 44:             padding: '6px 12px', borderRadius: '8px',
 45:             backgroundColor: '#f5f5f5', color: '#525252', fontSize: '13px', fontWeight: 500,
 46:             border: 'none', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
 47:           }}
 48:           onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e5e5e5'; e.currentTarget.style.color = '#0a0a0a' }}
 49:           onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.color = '#525252' }}
 50:         >
 51:           <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 52:             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
 53:           </svg>
 54:           Nuevo Préstamo
 55:         </button>
 56:       </div>
 57: 
 58:       {loading ? (
 59:         <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
 60:           {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: '64px', borderRadius: '10px' }} />)}
 61:         </div>
 62:       ) : loans.length === 0 ? (
 63:         <div style={{ textAlign: 'center', padding: '56px 20px' }}>
 64:           <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>No hay préstamos registrados</p>
 65:         </div>
 66:       ) : (
 67:         <div style={{ display: 'grid', gap: '12px', padding: '16px' }}>
 68:           {loans.map((loan) => {
 69:             const hasPayments = loan.loan_payments && loan.loan_payments.length > 0;
 70:             const nextPayment = hasPayments ? loan.loan_payments?.find(p => p.status === 'pending') : null;
 71:             const isExpanded = expandedLoanId === loan.id;
 72: 
 73:             return (
 74:               <div
 75:                 key={loan.id}
 76:                 style={{
 77:                   border: '1px solid #f0f0f0', borderRadius: '12px',
 78:                   backgroundColor: '#fafafa', overflow: 'hidden',
 79:                   transition: 'box-shadow 0.2s',
 80:                 }}
 81:               >
 82:                 {/* Cabecera del préstamo */}
 83:                 <div 
 84:                   onClick={() => toggleExpand(loan.id)}
 85:                   style={{
 86:                     padding: '16px 20px', display: 'grid', gridTemplateColumns: 'minmax(200px, 1.5fr) 1fr 1fr auto', gap: '24px',
 87:                     alignItems: 'center', cursor: 'pointer', transition: 'background-color 0.15s'
 88:                   }}
 89:                   onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fdfdfd' }}
 90:                   onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
 91:                 >
 92:                   <div style={{ display: 'flex', flexDirection: 'column' }}>
 93:                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
 94:                       <p style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
 95:                         {loan.name}
 96:                       </p>
 97:                       <span style={{ 
 98:                         fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, letterSpacing: '0.04em',
 99:                         backgroundColor: loan.status === 'active' ? '#e0e7ff' : loan.status === 'paid' ? '#dcfce7' : '#fee2e2',
100:                         color: loan.status === 'active' ? '#4338ca' : loan.status === 'paid' ? '#15803d' : '#b91c1c'
101:                       }}>
102:                         {loan.status === 'active' ? 'ACTIVO' : loan.status === 'paid' ? 'PAGADO' : 'MORA'}
103:                       </span>
104:                     </div>
105:                     <p style={{ fontSize: '12px', color: '#737373', margin: 0 }}>
106:                       Tasa: {loan.interest_rate}% <span style={{ margin: '0 4px', color: '#e5e5e5' }}>|</span> Inició: {formatDate(loan.start_date)}
107:                     </p>
108:                   </div>
109:                   
110:                   <div style={{ display: 'flex', flexDirection: 'column' }}>
111:                     <span style={{ fontSize: '11px', color: '#a3a3a3', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Monto Restante</span>
112:                     <span style={{ fontSize: '14px', fontWeight: 600, color: '#171717' }}>{formatCurrency(loan.principal)}</span>
113:                   </div>
114:                   
115:                   <div>
116:                     {nextPayment ? (
117:                       <div style={{ display: 'flex', flexDirection: 'column' }}>
118:                         <span style={{ fontSize: '11px', color: '#c2410c', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
119:                           <span style={{ width: '6px', height: '6px', backgroundColor: '#f97316', borderRadius: '50%' }} />
120:                           Próx ({formatDate(nextPayment.due_date)})
121:                         </span>
122:                         <span style={{ fontSize: '14px', fontWeight: 600, color: '#b45309' }}>{formatCurrency(nextPayment.amount)}</span>
123:                       </div>
124:                     ) : hasPayments ? (
125:                       <div style={{ display: 'flex', flexDirection: 'column' }}>
126:                         <span style={{ fontSize: '11px', color: '#16a34a', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
127:                           <span style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%' }} />
128:                           Al día
129:                         </span>
130:                         <span style={{ fontSize: '14px', fontWeight: 500, color: '#15803d' }}>Completado</span>
131:                       </div>
132:                     ) : (
133:                       <div style={{ display: 'flex', flexDirection: 'column' }}>
134:                         <span style={{ fontSize: '11px', color: '#737373', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Estado</span>
135:                         <span style={{ fontSize: '14px', fontWeight: 500, color: '#525252' }}>Sin cuotas</span>
136:                       </div>
137:                     )}
138:                   </div>
139: 
140:                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
141:                     <button
142:                       onClick={(e) => { e.stopPropagation(); deleteLoan(loan.id); }}
143:                       style={{
144:                         padding: '6px', borderRadius: '6px', background: 'transparent', border: 'none',
145:                         cursor: 'pointer', color: '#d4d4d4', transition: 'all 0.15s', display: 'flex', alignItems: 'center',
146:                       }}
147:                       onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2' }}
148:                       onMouseLeave={(e) => { e.currentTarget.style.color = '#d4d4d4'; e.currentTarget.style.backgroundColor = 'transparent' }}
149:                       title="Eliminar"
150:                     >
151:                       <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
152:                         <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
153:                       </svg>
154:                     </button>
155:                     <div style={{ color: '#a3a3a3', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
156:                       <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
157:                         <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
158:                       </svg>
159:                     </div>
160:                   </div>
161:                 </div>
162: 
163:                 {/* Detalles Expandidos (Cronograma) */}
164:                 {isExpanded && (
165:                   <div style={{ borderTop: '1px solid #f0f0f0', backgroundColor: '#fff', padding: '16px' }}>
166:                     <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#171717', margin: '0 0 12px' }}>
167:                       Historial y Próximas Cuotas
168:                     </h4>
169:                     {hasPayments ? (
170:                       <div style={{ display: 'grid', gap: '8px' }}>
171:                         {loan.loan_payments!.map((payment) => (
172:                           <div key={payment.id} style={{
173:                             display: 'flex', alignItems: 'center', justifyContent: 'space-between',
174:                             padding: '10px 12px', border: '1px solid #f5f5f5', borderRadius: '8px',
175:                             backgroundColor: payment.status === 'paid' ? '#fcfcfc' : payment.status === 'pending' ? '#fff' : '#fef2f2',
176:                             opacity: payment.status === 'paid' ? 0.7 : 1
177:                           }}>
178:                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
179:                               <div style={{
180:                                 width: '8px', height: '8px', borderRadius: '50%',
181:                                 backgroundColor: payment.status === 'paid' ? '#16a34a' : payment.status === 'pending' ? '#f97316' : '#dc2626'
182:                               }} />
183:                               <div>
184:                                 <p style={{ fontSize: '12px', color: '#525252', margin: 0, fontWeight: 500 }}>
185:                                   {formatDate(payment.due_date)} {payment.payment_date && `(Pagado: ${formatDate(payment.payment_date)})`}
186:                                 </p>
187:                                 <p style={{ fontSize: '11px', color: '#a3a3a3', margin: '2px 0 0' }}>
188:                                   Monto total: {formatCurrency(payment.amount)}
189:                                 </p>
190:                               </div>
191:                             </div>
192:                             <div style={{ textAlign: 'right' }}>
193:                               <p style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: 0 }}>
194:                                 {formatCurrency(payment.amount)}
195:                               </p>
196:                               <p style={{ fontSize: '11px', color: payment.status === 'paid' ? '#16a34a' : payment.status === 'pending' ? '#f97316' : '#dc2626', margin: '2px 0 0', fontWeight: 500 }}>
197:                                 {payment.status === 'paid' ? 'Pagado' : payment.status === 'pending' ? 'Pendiente' : 'Atrasado'}
198:                               </p>
199:                             </div>
200:                           </div>
201:                         ))}
202:                       </div>
203:                     ) : (
204:                       <p style={{ fontSize: '13px', color: '#737373', margin: 0, fontStyle: 'italic' }}>
205:                         No hay cuotas programadas para este préstamo.
206:                       </p>
207:                     )}
208:                   </div>
209:                 )}
210:               </div>
211:             )
212:           })}
213:         </div>
214:       )}
215: 
216:       {showForm && (
217:         <LoanForm 
218:           ventureId={ventureId} 
219:           onSubmit={handleCreate} 
220:           onClose={() => setShowForm(false)} 
221:         />
222:       )}
223:     </div>
224:   )
225: }
````

## File: frontend/src/features/loans/hooks/useLoans.ts
````typescript
 1: import { useState, useCallback } from 'react'
 2: import { supabase } from '@/shared/lib/supabase'
 3: import { useAuthStore } from '@/features/auth/store'
 4: import type { Loan, CreateLoanInput } from '../types'
 5: 
 6: export function useLoans(ventureId?: string) {
 7:   const [loans, setLoans] = useState<Loan[]>([])
 8:   const [loading, setLoading] = useState(true)
 9:   const [error, setError] = useState<string | null>(null)
10:   const { session } = useAuthStore()
11: 
12:   const fetchLoans = useCallback(async (id?: string) => {
13:     const vId = id || ventureId
14: 
15:     setLoading(true)
16:     setError(null)
17: 
18:     if (!session?.access_token) {
19:       setError('No active session')
20:       setLoading(false)
21:       return
22:     }
23: 
24:     const endpoint = vId ? `loans?venture_id=${vId}` : 'loans'
25:     const { data, error: invokeError } = await supabase.functions.invoke(endpoint, {
26:       method: 'GET',
27:       headers: { Authorization: `Bearer ${session.access_token}` }
28:     })
29: 
30:     if (invokeError) {
31:       setError(invokeError.message)
32:       setLoading(false)
33:       return
34:     }
35: 
36:     setLoans(data?.data ?? [])
37:     setLoading(false)
38:   }, [ventureId, session])
39: 
40:   const createLoan = async (input: CreateLoanInput) => {
41:     if (!session?.access_token) throw new Error('No active session')
42: 
43:     const { data, error } = await supabase.functions.invoke('loans', {
44:       method: 'POST',
45:       headers: { Authorization: `Bearer ${session.access_token}` },
46:       body: input,
47:     })
48: 
49:     if (error) throw new Error(error.message || 'Error creating loan')
50:     setLoans((prev) => [data.data, ...prev])
51:     return data.data
52:   }
53: 
54:   const deleteLoan = async (id: string) => {
55:     if (!session?.access_token) throw new Error('No active session')
56: 
57:     const { error } = await supabase.functions.invoke(`loans/${id}`, {
58:       method: 'DELETE',
59:       headers: { Authorization: `Bearer ${session.access_token}` },
60:     })
61: 
62:     if (error) throw new Error(error.message || 'Error deleting loan')
63:     setLoans((prev) => prev.filter((l) => l.id !== id))
64:   }
65: 
66:   return {
67:     loans,
68:     loading,
69:     error,
70:     fetchLoans,
71:     createLoan,
72:     deleteLoan
73:   }
74: }
````

## File: frontend/src/features/loans/types.ts
````typescript
 1: export interface Loan {
 2:   id: string;
 3:   user_id: string;
 4:   venture_id: string;
 5:   name: string;
 6:   principal: number;
 7:   interest_rate: number;
 8:   start_date: string;
 9:   end_date?: string | null;
10:   status: 'active' | 'paid' | 'defaulted';
11:   notes?: string | null;
12:   created_at: string;
13:   updated_at: string;
14:   loan_payments?: LoanPayment[];
15: }
16: 
17: export interface LoanPayment {
18:   id: string;
19:   loan_id: string;
20:   user_id: string;
21:   amount: number;
22:   payment_date?: string | null;
23:   due_date: string;
24:   status: 'pending' | 'paid' | 'late';
25:   evidence_url?: string | null;
26:   created_at: string;
27: }
28: 
29: export interface CreateLoanInput {
30:   venture_id: string;
31:   name: string;
32:   principal: number;
33:   interest_rate?: number;
34:   start_date: string;
35:   end_date?: string;
36:   status?: string;
37:   notes?: string;
38:   generate_payments?: boolean;
39:   payment_count?: number;
40:   payment_amount?: number;
41: }
````

## File: frontend/src/features/settings/components/KeywordsManager.view.tsx
````typescript
  1: // features/settings/components/KeywordsManager.tsx — Gestión monocromática
  2: import { useState, useEffect } from 'react'
  3: import { useKeywords } from '../hooks/useKeywords'
  4: 
  5: const inputStyle: React.CSSProperties = {
  6:   padding: '10px 14px',
  7:   borderRadius: '8px',
  8:   backgroundColor: '#fafafa',
  9:   border: '1px solid #e5e5e5',
 10:   color: '#171717',
 11:   fontSize: '14px',
 12:   outline: 'none',
 13:   fontFamily: 'inherit',
 14:   transition: 'border-color 0.15s',
 15: }
 16: 
 17: export function KeywordsManager() {
 18:   const { incomeKeywords, expenseKeywords, loading, saving, addKeyword, removeKeyword } = useKeywords()
 19:   const [newKeyword, setNewKeyword] = useState('')
 20:   const [newType, setNewType] = useState<'income' | 'expense'>('expense')
 21: 
 22:   const handleAdd = async () => {
 23:     const success = await addKeyword(newKeyword, newType)
 24:     if (success) {
 25:       setNewKeyword('')
 26:     }
 27:   }
 28: 
 29:   if (loading) {
 30:     return (
 31:       <div style={{ maxWidth: '480px' }}>
 32:         <div className="skeleton" style={{ height: '28px', width: '180px', marginBottom: '12px' }} />
 33:         <div className="skeleton" style={{ height: '280px', borderRadius: '14px' }} />
 34:       </div>
 35:     )
 36:   }
 37: 
 38:   return (
 39:     <div className="animate-fade-in" style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
 40:       {/* Header */}
 41:       <div>
 42:         <button
 43:           onClick={() => window.history.back()}
 44:           style={{
 45:             display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#737373',
 46:             background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '4px',
 47:             transition: 'color 0.15s',
 48:           }}
 49:           onMouseEnter={(e) => { e.currentTarget.style.color = '#0a0a0a' }}
 50:           onMouseLeave={(e) => { e.currentTarget.style.color = '#737373' }}
 51:         >
 52:           <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 53:             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
 54:           </svg>
 55:           Atrás
 56:         </button>
 57:         <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>Palabras clave</h1>
 58:         <p style={{ fontSize: '14px', color: '#737373', margin: '2px 0 0' }}>
 59:           Cuando envíes un mensaje por WhatsApp con estas palabras, se clasificará automáticamente como ingreso o gasto.
 60:         </p>
 61:       </div>
 62: 
 63:       {/* Add keyword */}
 64:       <div style={{
 65:         backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5', padding: '20px',
 66:       }}>
 67:         <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 12px' }}>Agregar palabra clave</h3>
 68:         <div style={{ display: 'flex', gap: '8px' }}>
 69:           <input
 70:             value={newKeyword}
 71:             onChange={(e) => setNewKeyword(e.target.value)}
 72:             placeholder="Ej: venta, compra, pago..."
 73:             style={{ ...inputStyle, flex: 1 }}
 74:             onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
 75:             onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
 76:             onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
 77:           />
 78:           <select
 79:             value={newType}
 80:             onChange={(e) => setNewType(e.target.value as 'income' | 'expense')}
 81:             style={{ ...inputStyle, cursor: 'pointer', width: 'auto' }}
 82:           >
 83:             <option value="expense">Gasto</option>
 84:             <option value="income">Ingreso</option>
 85:           </select>
 86:           <button
 87:             onClick={handleAdd}
 88:             disabled={saving || !newKeyword.trim()}
 89:             style={{
 90:               padding: '10px 16px', borderRadius: '8px', border: 'none',
 91:               backgroundColor: '#0a0a0a', color: '#fafafa', fontSize: '14px', fontWeight: 600,
 92:               cursor: (saving || !newKeyword.trim()) ? 'not-allowed' : 'pointer',
 93:               transition: 'all 0.15s', opacity: (saving || !newKeyword.trim()) ? 0.4 : 1,
 94:             }}
 95:             onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#262626' }}
 96:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a0a0a' }}
 97:           >
 98:             {saving ? '...' : '+'}
 99:           </button>
100:         </div>
101:       </div>
102: 
103:       {/* Keywords lists */}
104:       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
105:         {/* Income */}
106:         <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5', padding: '20px' }}>
107:           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
108:             <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
109:             <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>Ingresos</h3>
110:             <span style={{ fontSize: '12px', color: '#a3a3a3' }}>({incomeKeywords.length})</span>
111:           </div>
112:           <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
113:             {incomeKeywords.length === 0 ? (
114:               <p style={{ fontSize: '13px', color: '#a3a3a3' }}>Sin keywords de ingreso</p>
115:             ) : incomeKeywords.map((k) => (
116:               <div key={k.id} style={{
117:                 display: 'flex', alignItems: 'center', justifyContent: 'space-between',
118:                 padding: '8px 12px', borderRadius: '8px', backgroundColor: '#f0fdf4',
119:                 transition: 'background-color 0.15s',
120:               }}>
121:                 <span style={{ fontSize: '13px', color: '#166534', fontWeight: 500 }}>{k.keyword}</span>
122:                 <button
123:                   onClick={() => removeKeyword(k.id)}
124:                   style={{
125:                     padding: '2px', background: 'none', border: 'none', cursor: 'pointer',
126:                     color: '#a3a3a3', display: 'flex', transition: 'color 0.15s',
127:                   }}
128:                   onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626' }}
129:                   onMouseLeave={(e) => { e.currentTarget.style.color = '#a3a3a3' }}
130:                 >
131:                   <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
132:                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
133:                   </svg>
134:                 </button>
135:               </div>
136:             ))}
137:           </div>
138:         </div>
139: 
140:         {/* Expense */}
141:         <div style={{ backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5', padding: '20px' }}>
142:           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
143:             <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
144:             <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>Gastos</h3>
145:             <span style={{ fontSize: '12px', color: '#a3a3a3' }}>({expenseKeywords.length})</span>
146:           </div>
147:           <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
148:             {expenseKeywords.length === 0 ? (
149:               <p style={{ fontSize: '13px', color: '#a3a3a3' }}>Sin keywords de gasto</p>
150:             ) : expenseKeywords.map((k) => (
151:               <div key={k.id} style={{
152:                 display: 'flex', alignItems: 'center', justifyContent: 'space-between',
153:                 padding: '8px 12px', borderRadius: '8px', backgroundColor: '#fef2f2',
154:                 transition: 'background-color 0.15s',
155:               }}>
156:                 <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: 500 }}>{k.keyword}</span>
157:                 <button
158:                   onClick={() => removeKeyword(k.id)}
159:                   style={{
160:                     padding: '2px', background: 'none', border: 'none', cursor: 'pointer',
161:                     color: '#a3a3a3', display: 'flex', transition: 'color 0.15s',
162:                   }}
163:                   onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626' }}
164:                   onMouseLeave={(e) => { e.currentTarget.style.color = '#a3a3a3' }}
165:                 >
166:                   <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
167:                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
168:                   </svg>
169:                 </button>
170:               </div>
171:             ))}
172:           </div>
173:         </div>
174:       </div>
175:     </div>
176:   )
177: }
````

## File: frontend/src/features/settings/components/WhatsAppSettings.view.tsx
````typescript
  1: import { useWhatsAppSettings } from '../hooks/useWhatsAppSettings'
  2: 
  3: const inputStyle: React.CSSProperties = {
  4:   width: '100%',
  5:   padding: '10px 14px',
  6:   borderRadius: '8px',
  7:   backgroundColor: '#fafafa',
  8:   border: '1px solid #e5e5e5',
  9:   color: '#171717',
 10:   fontSize: '14px',
 11:   outline: 'none',
 12:   fontFamily: 'inherit',
 13:   transition: 'border-color 0.15s',
 14: }
 15: 
 16: export function WhatsAppSettings() {
 17:   const {
 18:     phoneNumberId, setPhoneNumberId,
 19:     accessToken, setAccessToken,
 20:     verifyToken, setVerifyToken,
 21:     saving,
 22:     loading,
 23:     success,
 24:     error,
 25:     saveSettings
 26:   } = useWhatsAppSettings()
 27: 
 28:   if (loading) {
 29:     return (
 30:       <div style={{ maxWidth: '480px' }}>
 31:         <div className="skeleton" style={{ height: '28px', width: '180px', marginBottom: '12px' }} />
 32:         <div className="skeleton" style={{ height: '280px', borderRadius: '14px' }} />
 33:       </div>
 34:     )
 35:   }
 36: 
 37:   return (
 38:     <div className="animate-fade-in" style={{ maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
 39:       {/* Header */}
 40:       <div>
 41:         <button
 42:           onClick={() => window.history.back()}
 43:           style={{
 44:             display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#737373',
 45:             background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '4px',
 46:             transition: 'color 0.15s',
 47:           }}
 48:           onMouseEnter={(e) => { e.currentTarget.style.color = '#0a0a0a' }}
 49:           onMouseLeave={(e) => { e.currentTarget.style.color = '#737373' }}
 50:         >
 51:           <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 52:             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
 53:           </svg>
 54:           Atrás
 55:         </button>
 56:         <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>API de WhatsApp</h1>
 57:         <p style={{ fontSize: '14px', color: '#737373', margin: '2px 0 0' }}>
 58:           Conecta tu número de Meta Business para recibir transacciones vía WhatsApp
 59:         </p>
 60:       </div>
 61: 
 62:       {/* Form card */}
 63:       <div style={{
 64:         backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5', padding: '24px',
 65:       }}>
 66:         <form onSubmit={saveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 67:           <div>
 68:             <label htmlFor="wa-phone-id" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Phone Number ID</label>
 69:             <input
 70:               id="wa-phone-id" value={phoneNumberId} onChange={(e) => setPhoneNumberId(e.target.value)}
 71:               placeholder="1234567890" style={inputStyle}
 72:               onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
 73:               onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
 74:             />
 75:           </div>
 76:           <div>
 77:             <label htmlFor="wa-token" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Access Token</label>
 78:             <input
 79:               id="wa-token" type="password" value={accessToken}
 80:               onFocus={() => { if (accessToken.startsWith('•')) setAccessToken('') }}
 81:               onChange={(e) => setAccessToken(e.target.value)}
 82:               placeholder="EAAxxxxxxx..." style={inputStyle}
 83:             />
 84:             <p style={{ fontSize: '12px', color: '#a3a3a3', margin: '4px 0 0' }}>Se almacena encriptado en la base de datos</p>
 85:           </div>
 86:           <div>
 87:             <label htmlFor="wa-verify" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#525252', marginBottom: '6px' }}>Verify Token</label>
 88:             <input
 89:               id="wa-verify" value={verifyToken} onChange={(e) => setVerifyToken(e.target.value)}
 90:               placeholder="mi_token_secreto" style={inputStyle}
 91:               onFocus={(e) => { e.currentTarget.style.borderColor = '#a3a3a3' }}
 92:               onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e5e5' }}
 93:             />
 94:             <p style={{ fontSize: '12px', color: '#a3a3a3', margin: '4px 0 0' }}>Usado por Meta para verificar tu webhook</p>
 95:           </div>
 96: 
 97:           {error && (
 98:             <div className="animate-fade-in" style={{
 99:               padding: '12px', borderRadius: '8px', backgroundColor: '#fef2f2',
100:               color: '#dc2626', fontSize: '13px', border: '1px solid #fecaca',
101:             }}>
102:               {error}
103:             </div>
104:           )}
105:           {success && (
106:             <div className="animate-fade-in" style={{
107:               padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4',
108:               color: '#16a34a', fontSize: '13px', border: '1px solid #bbf7d0',
109:             }}>
110:               {success}
111:             </div>
112:           )}
113: 
114:           <button
115:             type="submit" disabled={saving}
116:             style={{
117:               width: '100%', padding: '10px 16px', borderRadius: '10px', border: 'none',
118:               backgroundColor: '#0a0a0a', color: '#fafafa', fontSize: '14px', fontWeight: 600,
119:               cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
120:               opacity: saving ? 0.5 : 1, display: 'flex', alignItems: 'center',
121:               justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
122:             }}
123:             onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#262626' }}
124:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0a0a0a' }}
125:           >
126:             {saving && (
127:               <svg className="animate-spin" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
128:                 <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
129:                 <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
130:               </svg>
131:             )}
132:             Guardar configuración
133:           </button>
134:         </form>
135:       </div>
136: 
137:       {/* Webhook URL info */}
138:       <div style={{
139:         backgroundColor: '#f5f5f5', borderRadius: '14px', padding: '20px',
140:         border: '1px solid #e5e5e5',
141:       }}>
142:         <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 8px' }}>URL del Webhook</h3>
143:         <code style={{
144:           display: 'block', padding: '10px 14px', borderRadius: '8px',
145:           backgroundColor: '#fff', border: '1px solid #e5e5e5',
146:           fontSize: '12px', color: '#525252', wordBreak: 'break-all',
147:           fontFamily: 'monospace',
148:         }}>
149:           {import.meta.env.VITE_SUPABASE_URL}/functions/v1/whatsapp-webhook
150:         </code>
151:         <p style={{ fontSize: '12px', color: '#737373', margin: '8px 0 0' }}>
152:           Configura esta URL en tu app de Meta Business como endpoint del webhook de WhatsApp.
153:         </p>
154:       </div>
155:     </div>
156:   )
157: }
````

## File: frontend/src/features/settings/hooks/useKeywords.ts
````typescript
 1: import { useState, useEffect, useCallback } from 'react'
 2: import { supabase } from '@/shared/lib/supabase'
 3: 
 4: export interface Keyword {
 5:   id: string
 6:   keyword: string
 7:   type: 'income' | 'expense'
 8: }
 9: 
10: export function useKeywords() {
11:   const [keywords, setKeywords] = useState<Keyword[]>([])
12:   const [loading, setLoading] = useState(true)
13:   const [saving, setSaving] = useState(false)
14: 
15:   const fetchKeywords = useCallback(async () => {
16:     setLoading(true)
17:     const { data, error } = await supabase.functions.invoke('user-settings/keywords', { method: 'GET' })
18:     if (!error && data) {
19:       setKeywords(data.data || [])
20:     }
21:     setLoading(false)
22:   }, [])
23: 
24:   useEffect(() => {
25:     fetchKeywords()
26:   }, [fetchKeywords])
27: 
28:   const addKeyword = async (keyword: string, type: 'income' | 'expense') => {
29:     if (!keyword.trim()) return false
30:     setSaving(true)
31:     const { data, error } = await supabase.functions.invoke('user-settings/keywords', {
32:       method: 'POST',
33:       body: { keyword: keyword.trim().toLowerCase(), type },
34:     })
35:     setSaving(false)
36:     if (!error && data) {
37:       setKeywords((prev) => [...prev, data.data])
38:       return true
39:     }
40:     return false
41:   }
42: 
43:   const removeKeyword = async (id: string) => {
44:     await supabase.functions.invoke(`user-settings/keywords/${id}`, { method: 'DELETE' })
45:     setKeywords((prev) => prev.filter((k) => k.id !== id))
46:   }
47: 
48:   return {
49:     keywords,
50:     incomeKeywords: keywords.filter(k => k.type === 'income'),
51:     expenseKeywords: keywords.filter(k => k.type === 'expense'),
52:     loading,
53:     saving,
54:     addKeyword,
55:     removeKeyword
56:   }
57: }
````

## File: frontend/src/features/settings/hooks/useWhatsAppSettings.ts
````typescript
 1: import { useState, useEffect, useCallback } from 'react'
 2: import { supabase } from '@/shared/lib/supabase'
 3: import { useAuthStore } from '@/features/auth/store'
 4: 
 5: export function useWhatsAppSettings() {
 6:   const [phoneNumberId, setPhoneNumberId] = useState('')
 7:   const [accessToken, setAccessToken] = useState('')
 8:   const [verifyToken, setVerifyToken] = useState('')
 9:   const [saving, setSaving] = useState(false)
10:   const [loading, setLoading] = useState(true)
11:   const [success, setSuccess] = useState<string | null>(null)
12:   const [error, setError] = useState<string | null>(null)
13:   
14:   const session = useAuthStore((s) => s.session)
15: 
16:   const fetchSettings = useCallback(async () => {
17:     if (!session?.access_token) {
18:       setLoading(false)
19:       return
20:     }
21:     const headers = { Authorization: `Bearer ${session.access_token}` }
22:     const { data, error: err } = await supabase.functions.invoke('user-settings/integrations', {
23:       method: 'GET',
24:       headers,
25:     })
26:     if (!err && data) {
27:       const d = data.data
28:       if (d) {
29:         setPhoneNumberId(d.whatsapp_phone_number_id || '')
30:         setVerifyToken(d.whatsapp_verify_token || '')
31:         setAccessToken(d.has_access_token ? '••••••••' : '')
32:       }
33:     }
34:     setLoading(false)
35:   }, [session?.access_token])
36: 
37:   useEffect(() => {
38:     fetchSettings()
39:   }, [fetchSettings])
40: 
41:   const saveSettings = async (e: React.FormEvent) => {
42:     e.preventDefault()
43:     setError(null)
44:     setSuccess(null)
45:     setSaving(true)
46:     try {
47:       const body: Record<string, string> = {
48:         whatsapp_phone_number_id: phoneNumberId,
49:         whatsapp_verify_token: verifyToken,
50:       }
51:       if (accessToken && !accessToken.startsWith('•')) {
52:         body.whatsapp_access_token = accessToken
53:       }
54: 
55:       const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
56:       const { error: err } = await supabase.functions.invoke('user-settings/integrations', {
57:         method: 'PUT',
58:         body,
59:         headers,
60:       })
61:       
62:       if (err) {
63:         throw new Error(err.message || 'Error saving settings')
64:       }
65:       setSuccess('Configuración guardada')
66:     } catch (err: unknown) {
67:       setError(err instanceof Error ? err.message : 'Error al guardar')
68:     } finally {
69:       setSaving(false)
70:     }
71:   }
72: 
73:   return {
74:     phoneNumberId, setPhoneNumberId,
75:     accessToken, setAccessToken,
76:     verifyToken, setVerifyToken,
77:     saving,
78:     loading,
79:     success,
80:     error,
81:     saveSettings
82:   }
83: }
````

## File: frontend/src/features/transactions/hooks/useCategories.ts
````typescript
 1: import { create } from 'zustand'
 2: import { supabase } from '@/shared/lib/supabase'
 3: 
 4: export interface TransactionCategory {
 5:   id: string
 6:   user_id: string | null
 7:   name: string
 8:   type: 'income' | 'expense' | 'capital'
 9:   icon: string | null
10:   color: string | null
11:   is_system: boolean
12:   created_at: string
13: }
14: 
15: interface CategoriesState {
16:   categories: TransactionCategory[]
17:   loading: boolean
18:   error: string | null
19:   fetched: boolean
20:   fetchCategories: (force?: boolean) => Promise<void>
21: }
22: 
23: export const useCategoriesStore = create<CategoriesState>((set, get) => ({
24:   categories: [],
25:   loading: false,
26:   error: null,
27:   fetched: false,
28:   fetchCategories: async (force = false) => {
29:     const state = get()
30:     if (state.fetched && !force) return // Use cached data if already fetched
31: 
32:     set({ loading: true, error: null })
33:     try {
34:       const { data, error } = await supabase
35:         .from('transaction_categories')
36:         .select('*')
37:         .order('name')
38: 
39:       if (error) throw error
40: 
41:       set({ categories: data as TransactionCategory[], fetched: true, loading: false })
42:     } catch (err: any) {
43:       console.error('[Categories Store] Error fetching categories:', err)
44:       set({ error: err.message, loading: false })
45:     }
46:   },
47: }))
48: 
49: export function useCategories() {
50:   const store = useCategoriesStore()
51:   return {
52:     categories: store.categories,
53:     loading: store.loading,
54:     error: store.error,
55:     fetchCategories: store.fetchCategories,
56:   }
57: }
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

## File: frontend/src/features/ventures/components/VentureDetail.view.tsx
````typescript
  1: // features/ventures/components/VentureDetail.tsx — Vista de detalle monochrome
  2: import { useEffect, useState } from 'react'
  3: import { useParams, useNavigate } from 'react-router-dom'
  4: 
  5: import { useTransactions } from '@/features/transactions/hooks/useTransactions'
  6: import { useAuthStore } from '@/features/auth/store'
  7: import { TransactionForm } from '@/features/transactions/components/TransactionForm'
  8: import { formatCurrency, formatDate, formatROI } from '@/shared/lib/formatters'
  9: import { VENTURE_TYPE_LABELS, VENTURE_STATUS_LABELS } from '@/shared/lib/constants'
 10: import { useVentureDetail } from '../hooks/useVentureDetail'
 11: import { VentureForm } from './VentureForm'
 12: import { LoansSection } from '@/features/loans/components/LoansSection.view'
 13: 
 14: 
 15: export function VentureDetail() {
 16:   const { id } = useParams<{ id: string }>()
 17:   const [showTxForm, setShowTxForm] = useState(false)
 18:   const [showEditForm, setShowEditForm] = useState(false)
 19:   
 20:   const { venture, loading, metrics, handleEditVenture, handleDeleteVenture } = useVentureDetail(id)
 21:   const navigate = useNavigate()
 22: 
 23:   const { transactions, loading: txLoading, fetchTransactions, createTransaction, deleteTransaction, total, page, pageSize } = useTransactions(id)
 24:   
 25:   const [searchTerm, setSearchTerm] = useState('')
 26:   const [currentPage, setCurrentPage] = useState(1)
 27: 
 28:   const session = useAuthStore((s) => s.session)
 29: 
 30:   useEffect(() => {
 31:     if (id && session?.access_token) {
 32:       const delay = setTimeout(() => {
 33:         fetchTransactions({ ventureId: id, page: currentPage, pageSize: 10, search: searchTerm })
 34:       }, 300)
 35:       return () => clearTimeout(delay)
 36:     }
 37:   }, [id, currentPage, searchTerm, fetchTransactions, session?.access_token])
 38: 
 39:   if (loading || !venture) {
 40:     return (
 41:       <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
 42:         <div className="skeleton" style={{ height: '28px', width: '180px' }} />
 43:         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
 44:           {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '14px' }} />)}
 45:         </div>
 46:         <div className="skeleton" style={{ height: '320px', borderRadius: '14px' }} />
 47:       </div>
 48:     )
 49:   }
 50: 
 51:   if (!metrics) return null
 52:   const { isPersonal, metricValue, net, remaining, healthColor, netColor, labels } = metrics
 53: 
 54:   return (
 55:     <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
 56:       {/* Header */}
 57:       <div className="animate-fade-in" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
 58:         <div>
 59:           <button
 60:             onClick={() => navigate('/ventures')}
 61:             style={{
 62:               display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#737373',
 63:               background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '4px',
 64:               transition: 'color 0.15s',
 65:             }}
 66:             onMouseEnter={(e) => { e.currentTarget.style.color = '#0a0a0a' }}
 67:             onMouseLeave={(e) => { e.currentTarget.style.color = '#737373' }}
 68:           >
 69:             <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 70:               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
 71:             </svg>
 72:             Ventures
 73:           </button>
 74:           <h1 style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>{venture.name}</h1>
 75:           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
 76:             <span style={{ fontSize: '13px', color: '#737373' }}>{VENTURE_TYPE_LABELS[venture.type]}</span>
 77:             <span style={{ color: '#d4d4d4' }}>·</span>
 78:             <span style={{ fontSize: '13px', color: '#737373' }}>{VENTURE_STATUS_LABELS[venture.status]}</span>
 79:             {venture.notes && (
 80:               <>
 81:                 <span style={{ color: '#d4d4d4' }}>·</span>
 82:                 <span style={{ fontSize: '13px', color: '#a3a3a3' }}>{venture.notes}</span>
 83:               </>
 84:             )}
 85:           </div>
 86:         </div>
 87:         <div style={{ display: 'flex', gap: '8px' }}>
 88:           <button
 89:             onClick={() => setShowEditForm(true)}
 90:             style={{
 91:               padding: '8px 14px', borderRadius: '10px', border: '1px solid #e5e5e5',
 92:               backgroundColor: '#fff', color: '#525252', fontSize: '13px', fontWeight: 500,
 93:               cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
 94:             }}
 95:             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5' }}
 96:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff' }}
 97:           >
 98:             Editar
 99:           </button>
100:           <button
101:             onClick={handleDeleteVenture}
102:             style={{
103:               padding: '8px 14px', borderRadius: '10px', border: '1px solid #fecaca',
104:               backgroundColor: '#fff', color: '#dc2626', fontSize: '13px', fontWeight: 500,
105:               cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
106:             }}
107:             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2' }}
108:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff' }}
109:           >
110:             Eliminar
111:           </button>
112:         </div>
113:       </div>
114: 
115:       {/* Stats grid */}
116:       <div className="animate-fade-in grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ animationDelay: '50ms' }}>
117:         {[
118:           { label: labels.invested, value: formatCurrency(venture.invested), color: '#0a0a0a' },
119:           { label: labels.returned, value: formatCurrency(venture.returned), color: '#0a0a0a' },
120:           { label: labels.roi, value: isPersonal ? `${metricValue}%` : formatROI(metricValue), color: healthColor },
121:           { 
122:             label: isPersonal ? 'Disponible' : (net >= 0 ? 'Ganancia' : 'Por recuperar'), 
123:             value: formatCurrency(isPersonal ? Math.max(0, venture.invested - venture.returned) : (net >= 0 ? net : remaining)), 
124:             color: netColor 
125:           },
126:         ].map((stat) => (
127:           <div key={stat.label} style={{
128:             backgroundColor: '#fff', borderRadius: '14px', padding: '16px 20px',
129:             border: '1px solid #e5e5e5',
130:           }}>
131:             <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 4px' }}>{stat.label}</p>
132:             <p style={{ fontSize: '18px', fontWeight: 700, color: stat.color, margin: 0, letterSpacing: '-0.02em' }}>{stat.value}</p>
133:           </div>
134:         ))}
135:       </div>
136: 
137:       {/* Transactions */}
138:       <div className="animate-fade-in" style={{
139:         backgroundColor: '#fff', borderRadius: '14px', border: '1px solid #e5e5e5',
140:         overflow: 'hidden', animationDelay: '100ms',
141:       }}>
142:         <div style={{
143:           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
144:           padding: '16px 20px', borderBottom: '1px solid #f5f5f5', flexWrap: 'wrap', gap: '12px'
145:         }}>
146:           <div>
147:             <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>
148:               Transacciones
149:               <span style={{ color: '#a3a3a3', fontWeight: 400, marginLeft: '6px' }}>({total})</span>
150:             </h2>
151:           </div>
152:           <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
153:             <input 
154:               type="text" 
155:               placeholder="Buscar..." 
156:               value={searchTerm}
157:               onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
158:               className="form-input"
159:               style={{ padding: '6px 12px', fontSize: '13px', width: '200px' }}
160:             />
161:             <button
162:               onClick={() => setShowTxForm(true)}
163:             style={{
164:               display: 'inline-flex', alignItems: 'center', gap: '6px',
165:               padding: '6px 12px', borderRadius: '8px',
166:               backgroundColor: '#f5f5f5', color: '#525252', fontSize: '13px', fontWeight: 500,
167:               border: 'none', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
168:             }}
169:             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e5e5e5'; e.currentTarget.style.color = '#0a0a0a' }}
170:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.color = '#525252' }}
171:           >
172:             <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
173:               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
174:             </svg>
175:             Agregar
176:           </button>
177:           </div>
178:         </div>
179: 
180:         {txLoading ? (
181:           <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
182:             {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '48px', borderRadius: '10px' }} />)}
183:           </div>
184:         ) : transactions.length === 0 ? (
185:           <div style={{ textAlign: 'center', padding: '56px 20px' }}>
186:             <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>Sin transacciones aún</p>
187:             <button
188:               onClick={() => setShowTxForm(true)}
189:               style={{
190:                 marginTop: '8px', fontSize: '14px', color: '#0a0a0a', fontWeight: 500,
191:                 background: 'none', border: 'none', cursor: 'pointer', padding: 0,
192:                 textDecoration: 'underline', textUnderlineOffset: '4px',
193:               }}
194:             >
195:               Registrar la primera
196:             </button>
197:           </div>
198:         ) : (
199:           <div>
200:             {transactions.map((tx, i) => (
201:               <div
202:                 key={tx.id}
203:                 style={{
204:                   display: 'flex', alignItems: 'center', gap: '14px',
205:                   padding: '12px 20px', transition: 'background-color 0.15s',
206:                   borderTop: i > 0 ? '1px solid #fafafa' : 'none',
207:                 }}
208:                 onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fafafa' }}
209:                 onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
210:               >
211:                 <div style={{
212:                   width: '32px', height: '32px', borderRadius: '8px',
213:                   display: 'flex', alignItems: 'center', justifyContent: 'center',
214:                   fontSize: '11px', flexShrink: 0, fontWeight: 700,
215:                   backgroundColor: tx.type === 'income' ? '#f0fdf4' : '#fef2f2',
216:                   color: tx.type === 'income' ? '#16a34a' : '#dc2626',
217:                 }}>
218:                   {tx.type === 'income' ? 'IN' : 'OUT'}
219:                 </div>
220:                 <div style={{ flex: 1, minWidth: 0 }}>
221:                   <p style={{ fontSize: '13px', fontWeight: 500, color: '#0a0a0a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
222:                     {tx.description || 'Sin descripción'}
223:                   </p>
224:                   <p style={{ fontSize: '12px', color: '#a3a3a3', margin: '2px 0 0' }}>{formatDate(tx.date)}</p>
225:                 </div>
226:                 <p style={{
227:                   fontSize: '13px', fontWeight: 600, flexShrink: 0, margin: 0,
228:                   color: tx.type === 'income' ? '#16a34a' : '#dc2626',
229:                 }}>
230:                   {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
231:                 </p>
232:                 <button
233:                   onClick={() => deleteTransaction(tx.id)}
234:                   style={{
235:                     padding: '4px', borderRadius: '6px', background: 'none', border: 'none',
236:                     cursor: 'pointer', color: '#d4d4d4', display: 'flex',
237:                     transition: 'color 0.15s',
238:                     opacity: 0,
239:                   }}
240:                   onMouseEnter={(e) => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.opacity = '1' }}
241:                   onMouseLeave={(e) => { e.currentTarget.style.color = '#d4d4d4'; e.currentTarget.style.opacity = '0' }}
242:                   title="Eliminar"
243:                   className="group-hover:opacity-100"
244:                 >
245:                   <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
246:                     <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
247:                   </svg>
248:                 </button>
249:               </div>
250:             ))}
251:             
252:             {total > (pageSize || 10) && (
253:               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #f5f5f5' }}>
254:                 <span style={{ fontSize: '12px', color: '#737373' }}>
255:                   Página {page} de {Math.ceil(total / (pageSize || 10))}
256:                 </span>
257:                 <div style={{ display: 'flex', gap: '8px' }}>
258:                   <button 
259:                     disabled={page === 1}
260:                     onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
261:                     style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #e5e5e5', background: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
262:                   >Anterior</button>
263:                   <button 
264:                     disabled={page >= Math.ceil(total / (pageSize || 10))}
265:                     onClick={() => setCurrentPage(p => p + 1)}
266:                     style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #e5e5e5', background: '#fff', cursor: page >= Math.ceil(total / (pageSize || 10)) ? 'not-allowed' : 'pointer', opacity: page >= Math.ceil(total / (pageSize || 10)) ? 0.5 : 1 }}
267:                   >Siguiente</button>
268:                 </div>
269:               </div>
270:             )}
271:           </div>
272:         )}
273:       </div>
274: 
275:       <LoansSection ventureId={venture.id} />
276: 
277:       {/* Modals */}
278:       {showTxForm && (
279:         <TransactionForm
280:           ventureId={venture.id}
281:           onSubmit={createTransaction}
282:           onClose={() => setShowTxForm(false)}
283:         />
284:       )}
285:       {showEditForm && (
286:         <VentureForm
287:           venture={venture}
288:           onSubmit={handleEditVenture}
289:           onClose={() => setShowEditForm(false)}
290:         />
291:       )}
292:     </div>
293:   )
294: }
````

## File: frontend/src/features/ventures/components/VenturesList.view.tsx
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
157:               Crear tu primer venture
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

## File: frontend/src/features/ventures/hooks/useVentureDetail.ts
````typescript
 1: import { useState, useEffect, useCallback, useMemo } from 'react'
 2: import { useNavigate } from 'react-router-dom'
 3: import { supabase } from '@/shared/lib/supabase'
 4: import { useAuthStore } from '@/features/auth/store'
 5: import { calculateROI, breakEven, netProfit, ventureHealth, calculateHealth } from '@/shared/lib/metrics'
 6: import { VENTURE_MODE_METRICS } from '@/shared/lib/constants'
 7: import type { Venture, CreateVentureInput } from '../types'
 8: 
 9: export function useVentureDetail(id: string | undefined) {
10:   const navigate = useNavigate()
11:   const [venture, setVenture] = useState<Venture | null>(null)
12:   const [loading, setLoading] = useState(true)
13:   const session = useAuthStore((s) => s.session)
14: 
15:   const fetchVenture = useCallback(async () => {
16:     if (!id || !session?.access_token) return
17:     setLoading(true)
18:     const headers = { Authorization: `Bearer ${session.access_token}` }
19:     const { data, error } = await supabase.functions.invoke(`ventures/${id}`, {
20:       method: 'GET',
21:       headers,
22:     })
23:     if (error || !data) { navigate('/ventures'); return }
24:     setVenture(data.data)
25:     setLoading(false)
26:   }, [id, session?.access_token, navigate])
27: 
28:   useEffect(() => {
29:     fetchVenture()
30:   }, [fetchVenture])
31: 
32:   const handleEditVenture = async (input: CreateVentureInput) => {
33:     if (!id) return
34:     const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
35:     const { data, error } = await supabase.functions.invoke(`ventures/${id}`, {
36:       method: 'PUT',
37:       body: input,
38:       headers,
39:     })
40:     if (error) throw new Error(error.message || 'Error updating venture')
41:     setVenture(data.data)
42:   }
43: 
44:   const handleDeleteVenture = async () => {
45:     if (!id || !confirm('¿Eliminar este venture y todas sus transacciones?')) return
46:     const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
47:     await supabase.functions.invoke(`ventures/${id}`, {
48:       method: 'DELETE',
49:       headers,
50:     })
51:     navigate('/ventures')
52:   }
53: 
54:   const metrics = useMemo(() => {
55:     if (!venture) return null
56: 
57:     const isPersonal = venture.mode === 'personal'
58:     const metricValue = isPersonal 
59:       ? calculateHealth(venture.invested, venture.returned)
60:       : calculateROI(venture.invested, venture.returned)
61:       
62:     const health = isPersonal
63:       ? (metricValue > 20 ? 'positive' : (metricValue > 0 ? 'neutral' : 'negative'))
64:       : ventureHealth(metricValue)
65:       
66:     const net = netProfit(venture.invested, venture.returned)
67:     const remaining = breakEven(venture.invested, venture.returned)
68: 
69:     const healthColor = health === 'positive' ? '#16a34a' : health === 'negative' ? '#dc2626' : '#525252'
70:     const netColor = isPersonal 
71:       ? (venture.returned > venture.invested ? '#dc2626' : '#16a34a')
72:       : (net >= 0 ? '#16a34a' : '#dc2626')
73: 
74:     const labels = VENTURE_MODE_METRICS[venture.mode || 'business']
75: 
76:     return {
77:       isPersonal,
78:       metricValue,
79:       health,
80:       net,
81:       remaining,
82:       healthColor,
83:       netColor,
84:       labels
85:     }
86:   }, [venture])
87: 
88:   return {
89:     venture,
90:     loading,
91:     metrics,
92:     handleEditVenture,
93:     handleDeleteVenture
94:   }
95: }
````

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

## File: frontend/src/shared/lib/metrics.ts
````typescript
 1: // frontend/src/shared/lib/metrics.ts
 2: // Cálculos de negocio centralizados — NUNCA persistir ROI en DB
 3: import type { VentureHealth } from '@backend/_shared/types'
 4: 
 5: /** ROI en porcentaje. Nunca persistir en DB. */
 6: export const calculateROI = (invested: number, returned: number): number => {
 7:   if (invested === 0) return 0
 8:   if (returned === 0 && invested > 0) return -100
 9:   return Number(((returned - invested) / invested * 100).toFixed(2))
10: }
11: 
12: /** Cuánto falta para recuperar la inversión. */
13: export const breakEven = (invested: number, returned: number): number => {
14:   return Math.max(0, invested - returned)
15: }
16: 
17: /** Estado de salud del venture basado en ROI. */
18: export const ventureHealth = (roi: number): VentureHealth => {
19:   if (roi > 10) return 'positive'
20:   if (roi >= 0) return 'neutral'
21:   return 'negative'
22: }
23: 
24: /** Ganancia neta del venture. */
25: export const netProfit = (invested: number, returned: number): number => {
26:   return returned - invested
27: }
28: 
29: /** Salud del presupuesto en porcentaje (0 = agotado, 100 = intacto). Solo para modo personal. */
30: export const calculateHealth = (budget: number, spent: number): number => {
31:   if (budget <= 0) return 0
32:   const remaining = budget - spent
33:   return Math.max(0, Number(((remaining / budget) * 100).toFixed(2)))
34: }
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

## File: frontend/src/vite-env.d.ts
````typescript
1: /// <reference types="vite/client" />
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
 13: /**
 14:  * business: muestra ROI, inversión, retorno (lógica de negocio)
 15:  * personal: muestra presupuesto, gasto, salud financiera
 16:  */
 17: export type VentureMode = 'business' | 'personal'
 18: 
 19: export interface Venture {
 20:   id: string
 21:   user_id: string
 22:   name: string
 23:   type: VentureType
 24:   status: VentureStatus
 25:   /** Determina etiquetas y métricas en la UI */
 26:   mode: VentureMode
 27:   invested: number
 28:   returned: number
 29:   currency: string
 30:   start_date: string
 31:   end_date?: string
 32:   notes?: string
 33:   created_at: string
 34:   updated_at: string
 35: }
 36: 
 37: export interface CreateVentureInput {
 38:   name: string
 39:   type: VentureType
 40:   status?: VentureStatus
 41:   mode?: VentureMode
 42:   invested?: number
 43:   returned?: number
 44:   currency?: string
 45:   start_date?: string
 46:   end_date?: string
 47:   notes?: string
 48: }
 49: 
 50: export interface UpdateVentureInput extends Partial<CreateVentureInput> {
 51:   id: string
 52: }
 53: 
 54: // ── Transactions ──────────────────────────────────────────────────────────────
 55: 
 56: export type TransactionType = 'income' | 'expense'
 57: 
 58: /**
 59:  * Tipo contable de la categoría:
 60:  * - expense: gasto operativo (afecta flujo de caja)
 61:  * - capital: inversión de capital (activo, afecta análisis de ROI)
 62:  * - income: ingreso
 63:  */
 64: export type AccountingType = 'income' | 'expense' | 'capital'
 65: 
 66: export interface TransactionCategory {
 67:   id: string
 68:   user_id: string | null            // null = categoría del sistema
 69:   name: string
 70:   accounting_type: AccountingType
 71:   icon?: string                      // admite emojis
 72:   color?: string
 73:   is_system: boolean
 74:   created_at: string
 75: }
 76: 
 77: export interface CreateCategoryInput {
 78:   name: string
 79:   accounting_type: AccountingType
 80:   icon?: string
 81:   color?: string
 82: }
 83: 
 84: export interface Transaction {
 85:   id: string
 86:   venture_id: string
 87:   user_id: string
 88:   type: TransactionType
 89:   amount: number
 90:   description?: string
 91:   date: string
 92:   evidence_url?: string
 93:   category_id?: string | null
 94:   category?: TransactionCategory     // join opcional
 95:   created_at: string
 96: }
 97: 
 98: export interface CreateTransactionInput {
 99:   venture_id: string
100:   type: TransactionType
101:   amount: number
102:   description?: string
103:   date: string
104:   evidence_url?: string
105:   category_id?: string | null
106: }
107: 
108: /** Respuesta paginada del endpoint GET /transactions */
109: export interface PaginatedTransactions {
110:   data: Transaction[]
111:   total: number
112:   page: number
113:   page_size: number
114: }
115: 
116: // ── Household (Fase 2 — tipos preparados, sin UI en MVP) ─────────────────────
117: 
118: export interface HouseholdExpense {
119:   id: string
120:   created_by: string
121:   amount: number
122:   category?: string
123:   description?: string
124:   split_ratio: number
125:   date: string
126:   created_at: string
127: }
128: 
129: // ── Auth ─────────────────────────────────────────────────────────────────────
130: 
131: export interface AuthUser {
132:   id: string
133:   email: string
134:   created_at: string
135: }
136: 
137: // ── User Integrations (Multi-tenant) ─────────────────────────────────────────
138: 
139: export type IntegrationProvider = 'whatsapp'
140: 
141: export interface WhatsAppConfig {
142:   phone_number_id: string
143:   verify_token: string
144:   default_venture_id?: string
145: }
146: 
147: export interface UserIntegration {
148:   id: string
149:   user_id: string
150:   provider: IntegrationProvider
151:   config: WhatsAppConfig
152:   encrypted_token: string | null
153:   is_active: boolean
154:   created_at: string
155:   updated_at: string
156: }
157: 
158: export interface SaveWhatsAppIntegrationInput {
159:   phone_number_id: string
160:   access_token: string
161:   verify_token: string
162:   default_venture_id?: string
163: }
164: 
165: // ── WhatsApp Keywords ────────────────────────────────────────────────────────
166: 
167: export interface WhatsAppKeyword {
168:   id: string
169:   user_id: string
170:   keyword: string
171:   maps_to: TransactionType
172:   created_at: string
173: }
174: 
175: export interface CreateKeywordInput {
176:   keyword: string
177:   maps_to: TransactionType
178: }
179: 
180: // ── Loans (Módulo de Préstamos — Fase 2) ─────────────────────────────────────
181: 
182: export type LoanStatus = 'active' | 'paid' | 'overdue'
183: export type LoanPaymentStatus = 'pending' | 'paid' | 'overdue'
184: 
185: export interface Loan {
186:   id: string
187:   user_id: string
188:   venture_id?: string | null
189:   name: string
190:   lender?: string
191:   principal: number
192:   interest_rate: number
193:   start_date: string
194:   end_date?: string
195:   status: LoanStatus
196:   notes?: string
197:   created_at: string
198:   updated_at: string
199: }
200: 
201: export interface LoanPayment {
202:   id: string
203:   loan_id: string
204:   user_id: string
205:   amount: number
206:   due_date: string
207:   paid_date?: string | null
208:   status: LoanPaymentStatus
209:   notes?: string
210:   created_at: string
211: }
212: 
213: export interface CreateLoanInput {
214:   venture_id?: string
215:   name: string
216:   lender?: string
217:   principal: number
218:   interest_rate?: number
219:   start_date: string
220:   end_date?: string
221:   notes?: string
222:   /** Pagos iniciales a crear con el préstamo */
223:   payments?: Array<{ amount: number; due_date: string }>
224: }
225: 
226: // ── Rate Limiting ────────────────────────────────────────────────────────────
227: 
228: export interface RateLimitResult {
229:   allowed: boolean
230:   remaining: number
231:   reset_at: string
232: }
233: 
234: // ── API responses ─────────────────────────────────────────────────────────────
235: 
236: export interface ApiError {
237:   code: string
238:   message: string
239: }
240: 
241: export type ApiResult<T> =
242:   | { data: T; error: null }
243:   | { data: null; error: ApiError }
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

## File: frontend/src/features/dashboard/components/DashboardLoans.tsx
````typescript
 1: // features/dashboard/components/DashboardLoans.tsx — Resumen de Préstamos Activos
 2: import { useEffect } from 'react'
 3: import { useLoans } from '@/features/loans/hooks/useLoans'
 4: import { formatCurrency, formatDate } from '@/shared/lib/formatters'
 5: 
 6: export function DashboardLoans() {
 7:   const { loans, loading, fetchLoans } = useLoans()
 8: 
 9:   useEffect(() => {
10:     fetchLoans()
11:   }, [fetchLoans])
12: 
13:   // Solo mostrar préstamos activos o en mora
14:   const activeLoans = loans.filter(l => l.status !== 'paid')
15: 
16:   if (loading) {
17:     return <div className="skeleton" style={{ height: '140px', borderRadius: '14px', width: '100%' }} />
18:   }
19: 
20:   if (activeLoans.length === 0) {
21:     return (
22:       <div style={{
23:         backgroundColor: '#fff', borderRadius: '14px', padding: '20px', border: '1px solid #e5e5e5', width: '100%',
24:         display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '140px'
25:       }}>
26:         <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 4px' }}>
27:           Préstamos y Financiación
28:         </h3>
29:         <p style={{ fontSize: '13px', color: '#737373', margin: 0 }}>
30:           No tienes préstamos activos por el momento.
31:         </p>
32:       </div>
33:     )
34:   }
35: 
36:   return (
37:     <div
38:       className="animate-fade-in"
39:       style={{
40:         backgroundColor: '#fff',
41:         borderRadius: '14px',
42:         padding: '20px',
43:         border: '1px solid #e5e5e5',
44:         width: '100%'
45:       }}
46:     >
47:       <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 16px' }}>
48:         Préstamos y Financiación Activa
49:       </h3>
50: 
51:       <div style={{ display: 'grid', gap: '12px' }}>
52:         {activeLoans.map((loan) => {
53:           const hasPayments = loan.loan_payments && loan.loan_payments.length > 0
54:           const nextPayment = hasPayments ? loan.loan_payments?.find(p => p.status === 'pending') : null
55: 
56:           return (
57:             <div
58:               key={loan.id}
59:               style={{
60:                 display: 'flex',
61:                 flexWrap: 'wrap',
62:                 gap: '12px',
63:                 padding: '12px 16px',
64:                 backgroundColor: '#fafafa',
65:                 border: '1px solid #f0f0f0',
66:                 borderRadius: '8px',
67:                 alignItems: 'center',
68:                 justifyContent: 'space-between'
69:               }}
70:             >
71:               <div style={{ flex: '1 1 auto', minWidth: '180px' }}>
72:                 <p style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 4px' }}>{loan.name}</p>
73:                 <p style={{ fontSize: '13px', color: '#737373', margin: 0 }}>Restante: {formatCurrency(loan.principal)}</p>
74:               </div>
75: 
76:               {nextPayment && (
77:                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
78:                   <div style={{ textAlign: 'right' }}>
79:                     <p style={{ fontSize: '11px', color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.02em', margin: '0 0 2px' }}>Próx. pago ({formatDate(nextPayment.due_date)})</p>
80:                     <p style={{ fontSize: '14px', fontWeight: 600, color: '#9a3412', margin: 0 }}>{formatCurrency(nextPayment.amount)}</p>
81:                   </div>
82:                 </div>
83:               )}
84:             </div>
85:           )
86:         })}
87:       </div>
88:     </div>
89:   )
90: }
````

## File: frontend/src/features/dashboard/components/MetricCard.tsx
````typescript
 1: // features/dashboard/components/MetricCard.tsx — Premium metric card
 2: interface MetricCardProps {
 3:   title: string
 4:   value: string
 5:   valueColor?: string
 6:   subtitle?: string
 7:   icon?: React.ReactNode
 8:   trend?: { value: string; positive: boolean }
 9:   delay?: number
10: }
11: 
12: export function MetricCard({ title, value, valueColor, subtitle, icon, trend, delay = 0 }: MetricCardProps) {
13:   return (
14:     <div
15:       className="animate-fade-in"
16:       style={{
17:         backgroundColor: '#fff',
18:         borderRadius: '14px',
19:         padding: '20px',
20:         border: '1px solid #e5e5e5',
21:         transition: 'box-shadow 0.2s, border-color 0.2s',
22:         animationDelay: `${delay}ms`,
23:         cursor: 'default',
24:         display: 'flex',
25:         flexDirection: 'column',
26:         gap: '6px',
27:       }}
28:       onMouseEnter={(e) => {
29:         e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)'
30:         e.currentTarget.style.borderColor = '#d4d4d4'
31:       }}
32:       onMouseLeave={(e) => {
33:         e.currentTarget.style.boxShadow = 'none'
34:         e.currentTarget.style.borderColor = '#e5e5e5'
35:       }}
36:     >
37:       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
38:         <p style={{
39:           fontSize: '11px',
40:           fontWeight: 600,
41:           color: '#737373',
42:           letterSpacing: '0.06em',
43:           textTransform: 'uppercase',
44:           margin: 0,
45:         }}>
46:           {title}
47:         </p>
48:         {icon && (
49:           <div style={{
50:             width: '32px',
51:             height: '32px',
52:             borderRadius: '8px',
53:             backgroundColor: '#f5f5f5',
54:             display: 'flex',
55:             alignItems: 'center',
56:             justifyContent: 'center',
57:             color: '#525252',
58:             flexShrink: 0,
59:           }}>
60:             {icon}
61:           </div>
62:         )}
63:       </div>
64: 
65:       <p style={{
66:         fontSize: '28px',
67:         fontWeight: 700,
68:         color: valueColor || '#0a0a0a',
69:         letterSpacing: '-0.03em',
70:         margin: 0,
71:         lineHeight: 1.1,
72:       }}>
73:         {value}
74:       </p>
75: 
76:       {subtitle && (
77:         <p style={{ fontSize: '12px', color: '#a3a3a3', margin: 0 }}>{subtitle}</p>
78:       )}
79: 
80:       {trend && (
81:         <span style={{
82:           display: 'inline-flex',
83:           alignItems: 'center',
84:           alignSelf: 'flex-start',
85:           gap: '4px',
86:           fontSize: '12px',
87:           fontWeight: 500,
88:           padding: '3px 10px',
89:           borderRadius: '999px',
90:           backgroundColor: trend.positive ? '#f0fdf4' : '#fef2f2',
91:           color: trend.positive ? '#16a34a' : '#dc2626',
92:           marginTop: '2px',
93:         }}>
94:           {trend.value}
95:         </span>
96:       )}
97:     </div>
98:   )
99: }
````

## File: frontend/src/features/dashboard/components/MonthlyChart.tsx
````typescript
  1: // features/dashboard/components/MonthlyChart.tsx — Ingresos vs Gastos + Flujo libre
  2: import {
  3:   ComposedChart,
  4:   Bar,
  5:   Line,
  6:   XAxis,
  7:   YAxis,
  8:   CartesianGrid,
  9:   Tooltip,
 10:   ResponsiveContainer,
 11:   Legend,
 12: } from 'recharts'
 13: import type { Transaction } from '@backend/_shared/types'
 14: 
 15: interface MonthlyChartProps {
 16:   transactions: Transaction[]
 17: }
 18: 
 19: interface MonthData {
 20:   month: string
 21:   income: number
 22:   expense: number
 23:   flujoLibre: number
 24: }
 25: 
 26: const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
 27: 
 28: function aggregateByMonth(transactions: Transaction[]): MonthData[] {
 29:   const now = new Date()
 30:   const months: MonthData[] = []
 31: 
 32:   for (let i = 5; i >= 0; i--) {
 33:     const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
 34:     const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
 35:     const month = MONTH_NAMES[d.getMonth()]
 36: 
 37:     const income = transactions
 38:       .filter((t) => t.type === 'income' && t.date.startsWith(key))
 39:       .reduce((sum, t) => sum + t.amount, 0)
 40:     const expense = transactions
 41:       .filter((t) => t.type === 'expense' && t.date.startsWith(key))
 42:       .reduce((sum, t) => sum + t.amount, 0)
 43: 
 44:     months.push({ month, income, expense, flujoLibre: income - expense })
 45:   }
 46: 
 47:   return months
 48: }
 49: 
 50: const LEGEND_MAP: Record<string, string> = {
 51:   income: 'Ingresos',
 52:   expense: 'Gastos',
 53:   flujoLibre: 'Flujo libre',
 54: }
 55: 
 56: export function MonthlyChart({ transactions }: MonthlyChartProps) {
 57:   const data = aggregateByMonth(transactions)
 58: 
 59:   return (
 60:     <div
 61:       className="animate-fade-in"
 62:       style={{
 63:         backgroundColor: '#fff',
 64:         borderRadius: '14px',
 65:         padding: '20px',
 66:         border: '1px solid #e5e5e5',
 67:         animationDelay: '200ms',
 68:       }}
 69:     >
 70:       <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 16px' }}>
 71:         Ingresos vs gastos — últimos 6 meses
 72:       </h3>
 73:       <div style={{ height: '256px' }}>
 74:         <ResponsiveContainer width="100%" height="100%">
 75:           <ComposedChart data={data} barGap={4}>
 76:             <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
 77:             <XAxis
 78:               dataKey="month"
 79:               tick={{ fontSize: 12, fill: '#737373' }}
 80:               axisLine={false}
 81:               tickLine={false}
 82:             />
 83:             <YAxis
 84:               tick={{ fontSize: 12, fill: '#737373' }}
 85:               axisLine={false}
 86:               tickLine={false}
 87:               tickFormatter={(val: number) =>
 88:                 val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`
 89:               }
 90:             />
 91:             <Tooltip
 92:               contentStyle={{
 93:                 backgroundColor: '#fff',
 94:                 border: '1px solid #e5e5e5',
 95:                 borderRadius: '10px',
 96:                 fontSize: '13px',
 97:                 boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
 98:               }}
 99:               formatter={(value: any, name: any) => [
100:                 `$${Number(value).toLocaleString('es-MX')}`,
101:                 LEGEND_MAP[name] || name,
102:               ]}
103:             />
104:             <Legend
105:               formatter={(value: string) => LEGEND_MAP[value] || value}
106:               wrapperStyle={{ fontSize: '12px' }}
107:             />
108:             <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
109:             <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
110:             <Line
111:               type="monotone"
112:               dataKey="flujoLibre"
113:               stroke="#171717"
114:               strokeWidth={2}
115:               strokeDasharray="6 3"
116:               dot={{ r: 3, fill: '#171717', strokeWidth: 0 }}
117:               activeDot={{ r: 5, fill: '#171717', strokeWidth: 0 }}
118:             />
119:           </ComposedChart>
120:         </ResponsiveContainer>
121:       </div>
122:     </div>
123:   )
124: }
````

## File: frontend/src/features/dashboard/pages/DashboardPage.tsx
````typescript
1: // pages/DashboardPage.tsx — shell de la feature dashboard
2: import { DashboardView } from '@/features/dashboard/components/Dashboard.view'
3: 
4: export default function DashboardPage() {
5:   return <DashboardView />
6: }
````

## File: frontend/src/features/loans/components/LoanForm.tsx
````typescript
  1: import { useState, useEffect } from 'react'
  2: import { createPortal } from 'react-dom'
  3: import type { CreateLoanInput } from '../types'
  4: 
  5: interface LoanFormProps {
  6:   ventureId: string
  7:   onSubmit: (input: CreateLoanInput) => Promise<any>
  8:   onClose: () => void
  9: }
 10: 
 11: export function LoanForm({ ventureId, onSubmit, onClose }: LoanFormProps) {
 12:   const [name, setName] = useState('')
 13:   const [principal, setPrincipal] = useState('')
 14:   const [interestRate, setInterestRate] = useState('0')
 15:   const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
 16:   const [generatePayments, setGeneratePayments] = useState(false)
 17:   const [paymentCount, setPaymentCount] = useState('12')
 18:   const [paymentAmount, setPaymentAmount] = useState('')
 19:   
 20:   const [loading, setLoading] = useState(false)
 21:   const [error, setError] = useState<string | null>(null)
 22: 
 23:   const [mounted, setMounted] = useState(false)
 24:   useEffect(() => setMounted(true), []) // ensure hydration matches
 25: 
 26:   const handleSubmit = async (e: React.FormEvent) => {
 27:     e.preventDefault()
 28:     setLoading(true)
 29:     setError(null)
 30:     
 31:     try {
 32:       await onSubmit({
 33:         venture_id: ventureId,
 34:         name,
 35:         principal: parseFloat(principal),
 36:         interest_rate: parseFloat(interestRate || '0'),
 37:         start_date: startDate,
 38:         generate_payments: generatePayments,
 39:         payment_count: generatePayments ? parseInt(paymentCount) : undefined,
 40:         payment_amount: generatePayments ? parseFloat(paymentAmount) : undefined,
 41:       })
 42:       onClose()
 43:     } catch (err: any) {
 44:       setError(err.message)
 45:     } finally {
 46:       setLoading(false)
 47:     }
 48:   }
 49: 
 50:   if (!mounted) return null
 51: 
 52:   return createPortal(
 53:     <div style={{
 54:       position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
 55:       backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
 56:       display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
 57:       padding: '20px'
 58:     }}>
 59:       <div className="animate-scale-in" style={{
 60:         backgroundColor: '#fff', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px',
 61:         maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
 62:       }}>
 63:         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
 64:           <div>
 65:             <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0a0a0a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
 66:               Nuevo Préstamo
 67:             </h2>
 68:             <p style={{ fontSize: '13px', color: '#737373', margin: 0 }}>Registra una nueva obligación financiera o préstamo familiar.</p>
 69:           </div>
 70:           <button onClick={onClose} style={{
 71:             background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: '50%', color: '#737373', cursor: 'pointer', padding: '6px',
 72:             display: 'flex', transition: 'all 0.15s', alignSelf: 'flex-start'
 73:           }}
 74:           onMouseEnter={(e) => { e.currentTarget.style.color = '#0a0a0a'; e.currentTarget.style.backgroundColor = '#e5e5e5' }}
 75:           onMouseLeave={(e) => { e.currentTarget.style.color = '#737373'; e.currentTarget.style.backgroundColor = '#f5f5f5' }}
 76:           >
 77:             <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
 78:               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
 79:             </svg>
 80:           </button>
 81:         </div>
 82: 
 83:         {error && (
 84:           <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '20px', border: '1px solid #fecaca' }}>
 85:             {error}
 86:           </div>
 87:         )}
 88: 
 89:         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
 90:           <div>
 91:             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#171717', marginBottom: '6px' }}>Nombre / Entidad / Acreedor</label>
 92:             <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Préstamo personal, Tarjeta de Crédito..." className="form-input" style={{ width: '100%', padding: '10px 12px' }} />
 93:           </div>
 94:           
 95:           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
 96:             <div>
 97:               <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#171717', marginBottom: '6px' }}>Principal a deber ($)</label>
 98:               <input type="number" required min="0" step="0.01" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="0.00" className="form-input" style={{ width: '100%', padding: '10px 12px' }} />
 99:             </div>
100:             <div>
101:               <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#171717', marginBottom: '6px' }}>Tasa de Interés (%)</label>
102:               <input type="number" min="0" step="0.01" value={interestRate} onChange={e => setInterestRate(e.target.value)} placeholder="0.0" className="form-input" style={{ width: '100%', padding: '10px 12px' }} />
103:             </div>
104:           </div>
105: 
106:           <div>
107:             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#171717', marginBottom: '6px' }}>Fecha de Emisión</label>
108:             <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className="form-input" style={{ width: '100%', padding: '10px 12px' }} />
109:           </div>
110: 
111:           <div style={{ backgroundColor: '#fafafa', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '16px' }}>
112:             <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
113:               <input 
114:                 type="checkbox" 
115:                 id="generatePayments" 
116:                 checked={generatePayments} 
117:                 onChange={e => setGeneratePayments(e.target.checked)} 
118:                 style={{ width: '18px', height: '18px', accentColor: '#0a0a0a', cursor: 'pointer', marginTop: '2px' }}
119:               />
120:               <div>
121:                 <label htmlFor="generatePayments" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#171717', cursor: 'pointer', userSelect: 'none', marginBottom: '4px' }}>
122:                   Generar cronograma de cuotas
123:                 </label>
124:                 <p style={{ fontSize: '12px', color: '#737373', margin: 0, lineHeight: 1.4 }}>
125:                   Calcula y agenda automáticamente los pagos futuros para darle seguimiento mes a mes.
126:                 </p>
127:               </div>
128:             </div>
129: 
130:             {generatePayments && (
131:               <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e5e5' }}>
132:                 <div>
133:                   <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#171717', marginBottom: '6px' }}>Plazo en meses</label>
134:                   <input type="number" required min="1" value={paymentCount} onChange={e => setPaymentCount(e.target.value)} className="form-input" style={{ width: '100%', padding: '10px 12px' }} />
135:                 </div>
136:                 <div>
137:                   <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#171717', marginBottom: '6px' }}>Cuota Mensual Fija ($)</label>
138:                   <input type="number" required min="0.01" step="0.01" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} placeholder="0.00" className="form-input" style={{ width: '100%', padding: '10px 12px' }} />
139:                   <p style={{ fontSize: '11px', color: '#a3a3a3', margin: '4px 0 0' }}>Cap. + Int.</p>
140:                 </div>
141:               </div>
142:             )}
143:           </div>
144: 
145:           <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
146:             <button type="button" onClick={onClose} disabled={loading} style={{
147:               flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e5e5e5', backgroundColor: '#fff',
148:               color: '#525252', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s'
149:             }}>Cancelar</button>
150:             <button type="submit" disabled={loading} style={{
151:               flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#0a0a0a',
152:               color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
153:               opacity: loading ? 0.7 : 1
154:             }}>
155:               {loading ? 'Procesando...' : 'Guardar Préstamo'}
156:             </button>
157:           </div>
158:         </form>
159:       </div>
160:     </div>,
161:     document.body
162:   )
163: }
````

## File: frontend/src/features/settings/pages/SettingsKeywordsPage.tsx
````typescript
1: // pages/SettingsKeywordsPage.tsx — shell
2: import { KeywordsManager } from '@/features/settings/components/KeywordsManager.view'
3: 
4: export default function SettingsKeywordsPage() {
5:   return <KeywordsManager />
6: }
````

## File: frontend/src/features/settings/pages/SettingsWhatsAppPage.tsx
````typescript
1: // pages/SettingsWhatsAppPage.tsx — shell
2: import { WhatsAppSettings } from '@/features/settings/components/WhatsAppSettings.view'
3: 
4: export default function SettingsWhatsAppPage() {
5:   return <WhatsAppSettings />
6: }
````

## File: frontend/src/features/ventures/pages/VentureDetailPage.tsx
````typescript
1: // pages/VentureDetailPage.tsx — shell del detalle de venture
2: import { VentureDetail } from '@/features/ventures/components/VentureDetail.view'
3: 
4: export default function VentureDetailPage() {
5:   return <VentureDetail />
6: }
````

## File: frontend/src/features/ventures/pages/VenturesPage.tsx
````typescript
1: // pages/VenturesPage.tsx — shell de la feature ventures
2: import { VenturesList } from '@/features/ventures/components/VenturesList.view'
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
 9:   hasFetched: boolean
10:   setVentures: (ventures: Venture[]) => void
11:   addVenture: (venture: Venture) => void
12:   updateVenture: (venture: Venture) => void
13:   removeVenture: (id: string) => void
14:   setLoading: (loading: boolean) => void
15:   setError: (error: string | null) => void
16:   setHasFetched: (hasFetched: boolean) => void
17: }
18: 
19: export const useVenturesStore = create<VenturesState>((set) => ({
20:   ventures: [],
21:   loading: true,
22:   error: null,
23:   hasFetched: false,
24:   setVentures: (ventures) => set({ ventures, loading: false, error: null, hasFetched: true }),
25:   addVenture: (venture) => set((s) => ({ ventures: [venture, ...s.ventures] })),
26:   updateVenture: (venture) =>
27:     set((s) => ({
28:       ventures: s.ventures.map((v) => (v.id === venture.id ? venture : v)),
29:     })),
30:   removeVenture: (id) =>
31:     set((s) => ({ ventures: s.ventures.filter((v) => v.id !== id) })),
32:   setLoading: (loading) => set({ loading }),
33:   setError: (error) => set({ error, loading: false }),
34:   setHasFetched: (hasFetched) => set({ hasFetched }),
35: }))
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
 9:   VentureMode,
10:   CreateVentureInput,
11:   UpdateVentureInput,
12: } from '@backend/_shared/types'
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
19: 
20: export const VENTURE_MODE_LABELS: Record<string, string> = {
21:   business: 'Negocio',
22:   personal: 'Personal / Hogar',
23: }
24: 
25: export const VENTURE_MODE_METRICS: Record<string, { invested: string; returned: string; roi: string }> = {
26:   business: { invested: 'Invertido', returned: 'Retornado', roi: 'ROI' },
27:   personal: { invested: 'Presupuesto', returned: 'Gastado', roi: 'Salud' },
28: }
````

## File: frontend/src/features/dashboard/components/VentureROIChart.tsx
````typescript
 1: // features/dashboard/components/VentureROIChart.tsx
 2: import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
 3: import type { Venture } from '@backend/_shared/types'
 4: import { calculateROI, ventureHealth } from '@/shared/lib/metrics'
 5: import { formatROI } from '@/shared/lib/formatters'
 6: 
 7: interface VentureROIChartProps {
 8:   ventures: Venture[]
 9: }
10: 
11: export function VentureROIChart({ ventures }: VentureROIChartProps) {
12:   const activeBusinessVentures = ventures.filter(
13:     (v) => (v.status === 'active' || v.status === 'paused') && v.mode !== 'personal'
14:   )
15:   
16:   if (activeBusinessVentures.length === 0) {
17:     return (
18:       <div 
19:         className="animate-fade-in"
20:         style={{ 
21:           backgroundColor: '#fff', 
22:           border: '1px solid #e5e5e5', 
23:           borderRadius: '14px', 
24:           padding: '20px',
25:           display: 'flex',
26:           flexDirection: 'column',
27:           alignItems: 'center',
28:           justifyContent: 'center',
29:           minHeight: '200px',
30:           animationDelay: '250ms'
31:         }}
32:       >
33:         <p style={{ color: '#737373', fontSize: '14px', margin: 0 }}>No hay negocios activos para medir el ROI</p>
34:       </div>
35:     )
36:   }
37: 
38:   const data = activeBusinessVentures.map(v => {
39:     const roi = calculateROI(v.invested, v.returned)
40:     return {
41:       name: v.name,
42:       roi,
43:       health: ventureHealth(roi)
44:     }
45:   }).sort((a, b) => b.roi - a.roi)
46: 
47:   const minHeight = Math.max((data.length * 44) + 80, 200)
48: 
49:   return (
50:     <div
51:       className="animate-fade-in"
52:       style={{
53:         backgroundColor: '#fff',
54:         borderRadius: '14px',
55:         padding: '20px',
56:         border: '1px solid #e5e5e5',
57:         animationDelay: '250ms',
58:       }}
59:     >
60:       <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#171717', margin: '0 0 16px' }}>
61:         ¿A cuál meterle más? — ranking por ROI
62:       </h3>
63:       <div style={{ height: `${minHeight}px` }}>
64:         <ResponsiveContainer width="100%" height="100%">
65:           <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
66:             <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={true} vertical={false} />
67:             <XAxis type="number" tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}%`} />
68:             <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#171717', fontWeight: 500 }} axisLine={false} tickLine={false} width={100} />
69:             <Tooltip
70:               contentStyle={{
71:                 backgroundColor: '#fff',
72:                 border: '1px solid #e5e5e5',
73:                 borderRadius: '10px',
74:                 fontSize: '13px',
75:                 boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
76:               }}
77:               formatter={(value: any) => [formatROI(Number(value)), 'ROI']}
78:               cursor={{ fill: '#f5f5f5' }}
79:             />
80:             <Bar dataKey="roi" radius={[0, 4, 4, 0]}>
81:               {data.map((entry, index) => {
82:                 let color = '#a3a3a3' // neutral
83:                 if (entry.health === 'positive') color = '#22c55e'
84:                 if (entry.health === 'negative') color = '#ef4444'
85:                 
86:                 return <Cell key={`cell-${index}`} fill={color} />
87:               })}
88:             </Bar>
89:           </BarChart>
90:         </ResponsiveContainer>
91:       </div>
92:     </div>
93:   )
94: }
````

## File: frontend/src/features/transactions/components/TransactionForm.tsx
````typescript
  1: import { useState, useRef, useEffect, type FormEvent } from 'react'
  2: import { useCategories } from '../hooks/useCategories'
  3: import { SlidePanel } from '@/shared/components/SlidePanel'
  4: 
  5: interface TransactionFormProps {
  6:   ventureId: string
  7:   onSubmit: (input: { venture_id: string; type: 'income' | 'expense'; amount: number; description: string; date: string; category_id?: string }, evidence?: File) => Promise<void>
  8:   onClose: () => void
  9: }
 10: 
 11: const inputStyle: React.CSSProperties = {
 12:   width: '100%',
 13:   padding: '10px 14px',
 14:   borderRadius: '8px',
 15:   backgroundColor: '#171717',
 16:   border: '1px solid #2a2a2a',
 17:   color: '#fafafa',
 18:   fontSize: '14px',
 19:   outline: 'none',
 20:   fontFamily: 'inherit',
 21:   transition: 'border-color 0.15s, box-shadow 0.15s',
 22: }
 23: 
 24: export function TransactionForm({ ventureId, onSubmit, onClose }: TransactionFormProps) {
 25:   const [type, setType] = useState<'income' | 'expense'>('expense')
 26:   const [amount, setAmount] = useState('')
 27:   const [description, setDescription] = useState('')
 28:   const [date, setDate] = useState(new Date().toISOString().split('T')[0])
 29:   const [categoryId, setCategoryId] = useState<string>('')
 30:   const [evidence, setEvidence] = useState<File | null>(null)
 31:   
 32:   const { categories, fetchCategories } = useCategories()
 33:   useEffect(() => {
 34:     fetchCategories()
 35:   }, [fetchCategories])
 36:   const [submitting, setSubmitting] = useState(false)
 37:   const [error, setError] = useState<string | null>(null)
 38:   const fileRef = useRef<HTMLInputElement>(null)
 39: 
 40:   const handleSubmit = async (e: FormEvent) => {
 41:     e.preventDefault()
 42:     const numAmount = parseFloat(amount)
 43:     if (!amount || isNaN(numAmount) || numAmount <= 0) { setError('Monto inválido'); return }
 44:     if (!date) { setError('Fecha requerida'); return }
 45: 
 46:     setError(null)
 47:     setSubmitting(true)
 48:     try {
 49:       await onSubmit(
 50:         {
 51:           venture_id: ventureId,
 52:           type,
 53:           amount: numAmount,
 54:           description: description.trim() || `${type === 'income' ? 'Ingreso' : 'Gasto'} manual`,
 55:           date,
 56:           category_id: categoryId || undefined,
 57:         },
 58:         evidence || undefined
 59:       )
 60:       onClose()
 61:     } catch (err: unknown) {
 62:       setError(err instanceof Error ? err.message : 'Error inesperado')
 63:     } finally {
 64:       setSubmitting(false)
 65:     }
 66:   }
 67: 
 68:   return (
 69:     <SlidePanel isOpen={true} onClose={onClose} title="Nueva transacción">
 70:       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 71:         {/* Type toggle */}
 72:         <div style={{ display: 'flex', borderRadius: '10px', backgroundColor: '#171717', padding: '4px', border: '1px solid #2a2a2a' }}>
 73:           {(['expense', 'income'] as const).map((t) => (
 74:             <button
 75:               key={t}
 76:               type="button"
 77:               onClick={() => setType(t)}
 78:               style={{
 79:                 flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
 80:                 border: 'none', cursor: 'pointer', fontFamily: 'inherit',
 81:                 transition: 'all 0.15s',
 82:                 backgroundColor: type === t ? '#262626' : 'transparent',
 83:                 color: type === t
 84:                   ? (t === 'expense' ? '#ef4444' : '#22c55e')
 85:                   : '#a3a3a3',
 86:                 boxShadow: type === t ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
 87:               }}
 88:             >
 89:               {t === 'expense' ? 'Gasto' : 'Ingreso'}
 90:             </button>
 91:           ))}
 92:         </div>
 93: 
 94:         {/* Category */}
 95:         <div>
 96:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Categoría <span style={{ color: '#737373' }}>(opcional)</span></label>
 97:           <select
 98:             value={categoryId}
 99:             onChange={(e) => setCategoryId(e.target.value)}
100:             style={{ ...inputStyle, cursor: 'pointer' }}
101:             onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
102:             onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
103:           >
104:             <option value="">-- Sin categoría --</option>
105:             {categories.map((c) => (
106:               <option key={c.id} value={c.id} style={{ color: c.type === 'capital' ? '#f97316' : 'inherit' }}>
107:                 {c.name} {c.type === 'capital' ? '(Inversión)' : ''}
108:               </option>
109:             ))}
110:           </select>
111:         </div>
112: 
113:         {/* Amount */}
114:         <div>
115:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Monto</label>
116:           <div style={{ position: 'relative' }}>
117:             <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#737373', fontSize: '14px' }}>$</span>
118:             <input
119:               type="number" step="0.01" min="0" value={amount}
120:               onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
121:               style={{ ...inputStyle, paddingLeft: '28px' }}
122:               onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
123:               onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
124:             />
125:           </div>
126:         </div>
127: 
128:         {/* Description */}
129:         <div>
130:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Descripción</label>
131:           <input
132:             value={description} onChange={(e) => setDescription(e.target.value)}
133:             placeholder="Ej: Pago de servidor, Venta de producto..."
134:             style={inputStyle}
135:             onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
136:             onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
137:           />
138:         </div>
139: 
140:         {/* Date */}
141:         <div>
142:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Fecha</label>
143:           <input
144:             type="date" value={date} onChange={(e) => setDate(e.target.value)}
145:             style={{...inputStyle, colorScheme: 'dark'}}
146:             onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
147:             onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
148:           />
149:         </div>
150: 
151:         {/* Evidence */}
152:         <div>
153:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>
154:             Evidencia <span style={{ color: '#737373' }}>(opcional)</span>
155:           </label>
156:           <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={(e) => setEvidence(e.target.files?.[0] || null)} style={{ display: 'none' }} />
157:           <button
158:             type="button"
159:             onClick={() => fileRef.current?.click()}
160:             style={{
161:               width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
162:               padding: '12px 14px', borderRadius: '8px',
163:               border: '1px dashed #404040', backgroundColor: 'transparent',
164:               fontSize: '13px', color: '#a3a3a3',
165:               cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
166:             }}
167:             onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#737373'; e.currentTarget.style.color = '#fafafa' }}
168:             onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#404040'; e.currentTarget.style.color = '#a3a3a3' }}
169:           >
170:             <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
171:               <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
172:             </svg>
173:             {evidence ? evidence.name : 'Subir foto o PDF'}
174:           </button>
175:         </div>
176: 
177:         {error && (
178:           <div className="animate-fade-in" style={{
179:             display: 'flex',
180:             alignItems: 'flex-start',
181:             gap: '10px',
182:             padding: '12px',
183:             borderRadius: '8px',
184:             backgroundColor: 'rgba(239,68,68,0.1)',
185:             border: '1px solid rgba(239,68,68,0.2)',
186:             fontSize: '13px',
187:             color: '#f87171',
188:           }}>
189:             <svg width="16" height="16" style={{ flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
190:               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
191:             </svg>
192:             {error}
193:           </div>
194:         )}
195: 
196:         <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
197:           <button
198:             type="button" onClick={onClose}
199:             style={{
200:               flex: 1, padding: '10px 16px', borderRadius: '10px', border: '1px solid #2a2a2a',
201:               backgroundColor: 'transparent', color: '#a3a3a3', fontSize: '14px', fontWeight: 500,
202:               cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
203:             }}
204:             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#171717'; e.currentTarget.style.color = '#fafafa' }}
205:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a3a3a3' }}
206:           >
207:             Cancelar
208:           </button>
209:           <button
210:             type="submit" disabled={submitting}
211:             style={{
212:               flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none',
213:               backgroundColor: '#fafafa', color: '#0a0a0a', fontSize: '14px', fontWeight: 600,
214:               cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
215:               opacity: submitting ? 0.5 : 1, display: 'flex', alignItems: 'center',
216:               justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
217:             }}
218:             onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#e5e5e5' }}
219:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fafafa' }}
220:             onMouseDown={(e) => { if (!submitting) e.currentTarget.style.transform = 'scale(0.98)' }}
221:             onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
222:           >
223:             {submitting && (
224:               <svg className="animate-spin" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
225:                 <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
226:                 <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
227:               </svg>
228:             )}
229:             Registrar transacción
230:           </button>
231:         </div>
232:       </form>
233:     </SlidePanel>
234:   )
235: }
````

## File: frontend/src/features/ventures/components/VentureCard.tsx
````typescript
  1: // features/ventures/components/VentureCard.tsx — Monochrome premium card
  2: import { useNavigate } from 'react-router-dom'
  3: import { formatCurrency, formatROI } from '@/shared/lib/formatters'
  4: import { VENTURE_TYPE_LABELS, VENTURE_STATUS_LABELS, VENTURE_MODE_METRICS } from '@/shared/lib/constants'
  5: import { calculateROI, ventureHealth, calculateHealth } from '@/shared/lib/metrics'
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
 22:   const isPersonal = venture.mode === 'personal'
 23:   
 24:   const metricValue = isPersonal 
 25:     ? calculateHealth(venture.invested, venture.returned)
 26:     : calculateROI(venture.invested, venture.returned)
 27:     
 28:   // Para personal, health es positivo si queda mucho presupuesto. Para negocio, depende del ROI.
 29:   // Podríamos reutilizar ventureHealth de utils, o adaptarlo
 30:   const health = isPersonal
 31:     ? (metricValue > 20 ? 'positive' : (metricValue > 0 ? 'neutral' : 'negative'))
 32:     : ventureHealth(metricValue)
 33: 
 34:   const healthBg = health === 'positive' ? '#f0fdf4' : health === 'negative' ? '#fef2f2' : '#f5f5f5'
 35:   const healthColor = health === 'positive' ? '#16a34a' : health === 'negative' ? '#dc2626' : '#525252'
 36: 
 37:   const labels = VENTURE_MODE_METRICS[venture.mode || 'business']
 38: 
 39:   return (
 40:     <button
 41:       onClick={() => navigate(`/ventures/${venture.id}`)}
 42:       className="animate-fade-in"
 43:       style={{
 44:         width: '100%',
 45:         textAlign: 'left',
 46:         backgroundColor: '#fff',
 47:         borderRadius: '14px',
 48:         padding: '20px',
 49:         border: '1px solid #e5e5e5',
 50:         cursor: 'pointer',
 51:         transition: 'all 0.2s ease',
 52:         animationDelay: `${delay}ms`,
 53:         display: 'block',
 54:         fontFamily: 'inherit',
 55:       }}
 56:       onMouseEnter={(e) => {
 57:         e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'
 58:         e.currentTarget.style.borderColor = '#d4d4d4'
 59:         e.currentTarget.style.transform = 'translateY(-2px)'
 60:       }}
 61:       onMouseLeave={(e) => {
 62:         e.currentTarget.style.boxShadow = 'none'
 63:         e.currentTarget.style.borderColor = '#e5e5e5'
 64:         e.currentTarget.style.transform = 'translateY(0)'
 65:       }}
 66:     >
 67:       {/* Header */}
 68:       <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
 69:         <div style={{ minWidth: 0, flex: 1 }}>
 70:           <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
 71:             {venture.name}
 72:           </h3>
 73:           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
 74:             <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusDotColors[venture.status] || '#a3a3a3' }} />
 75:             <span style={{ fontSize: '12px', color: '#737373' }}>{VENTURE_STATUS_LABELS[venture.status]}</span>
 76:             <span style={{ fontSize: '12px', color: '#d4d4d4' }}>·</span>
 77:             <span style={{ fontSize: '12px', color: '#737373' }}>{VENTURE_TYPE_LABELS[venture.type]}</span>
 78:           </div>
 79:         </div>
 80:         <span style={{
 81:           fontSize: '13px',
 82:           fontWeight: 700,
 83:           padding: '4px 10px',
 84:           borderRadius: '8px',
 85:           backgroundColor: healthBg,
 86:           color: healthColor,
 87:         }} title={labels.roi}>
 88:           {isPersonal ? `${metricValue}%` : formatROI(metricValue)}
 89:         </span>
 90:       </div>
 91: 
 92:       {/* Financials */}
 93:       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
 94:         <div>
 95:           <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 2px' }}>{labels.invested}</p>
 96:           <p style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>{formatCurrency(venture.invested)}</p>
 97:         </div>
 98:         <div>
 99:           <p style={{ fontSize: '12px', color: '#737373', margin: '0 0 2px' }}>{labels.returned}</p>
100:           <p style={{ fontSize: '14px', fontWeight: 600, color: '#0a0a0a', margin: 0 }}>{formatCurrency(venture.returned)}</p>
101:         </div>
102:       </div>
103: 
104:       {/* Progress bar */}
105:       <div style={{ marginTop: '12px' }}>
106:         <div style={{ height: '4px', backgroundColor: '#f5f5f5', borderRadius: '999px', overflow: 'hidden' }}>
107:           <div
108:             style={{
109:               height: '100%',
110:               borderRadius: '999px',
111:               transition: 'width 0.5s ease',
112:               backgroundColor: health === 'positive' ? '#22c55e' : health === 'negative' ? '#ef4444' : '#a3a3a3',
113:               width: `${Math.min(100, venture.invested > 0 ? (venture.returned / venture.invested) * 100 : 0)}%`,
114:             }}
115:           />
116:         </div>
117:       </div>
118:     </button>
119:   )
120: }
````

## File: frontend/src/features/ventures/components/VentureForm.tsx
````typescript
  1: import { useState, type FormEvent } from 'react'
  2: import type { CreateVentureInput, VentureType, VentureStatus, Venture, VentureMode } from '../types'
  3: import { VENTURE_TYPE_LABELS, VENTURE_STATUS_LABELS, VENTURE_MODE_LABELS } from '@/shared/lib/constants'
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
 30:   const [mode, setMode] = useState<VentureMode>(venture?.mode || 'business')
 31:   const [status, setStatus] = useState<VentureStatus>(venture?.status || 'idea')
 32:   const [invested, setInvested] = useState(venture?.invested?.toString() || '0')
 33:   const [returned, setReturned] = useState(venture?.returned?.toString() || '0')
 34:   const [notes, setNotes] = useState(venture?.notes || '')
 35:   const [submitting, setSubmitting] = useState(false)
 36:   const [error, setError] = useState<string | null>(null)
 37: 
 38:   const handleSubmit = async (e: FormEvent) => {
 39:     e.preventDefault()
 40:     if (!name.trim()) { setError('Nombre es requerido'); return }
 41:     setError(null)
 42:     setSubmitting(true)
 43:     try {
 44:       await onSubmit({
 45:         name: name.trim(),
 46:         type,
 47:         mode,
 48:         status,
 49:         invested: parseFloat(invested) || 0,
 50:         returned: parseFloat(returned) || 0,
 51:         notes: notes.trim() || undefined,
 52:       })
 53:       onClose()
 54:     } catch (err: unknown) {
 55:       setError(err instanceof Error ? err.message : 'Error inesperado')
 56:     } finally {
 57:       setSubmitting(false)
 58:     }
 59:   }
 60: 
 61:   return (
 62:     <SlidePanel isOpen={true} onClose={onClose} title={formTitle}>
 63:       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 64:         <div>
 65:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Nombre</label>
 66:           <input
 67:             value={name}
 68:             onChange={(e) => setName(e.target.value)}
 69:             placeholder="Ej: Mi tienda online"
 70:             style={inputStyle}
 71:             onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
 72:             onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
 73:           />
 74:         </div>
 75: 
 76:         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
 77:           <div>
 78:             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Tipo</label>
 79:             <select
 80:               value={type}
 81:               onChange={(e) => setType(e.target.value as VentureType)}
 82:               style={{ ...inputStyle, cursor: 'pointer' }}
 83:               onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
 84:               onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
 85:             >
 86:               {Object.entries(VENTURE_TYPE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
 87:             </select>
 88:           </div>
 89:           <div>
 90:             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Estado</label>
 91:             <select
 92:               value={status}
 93:               onChange={(e) => setStatus(e.target.value as VentureStatus)}
 94:               style={{ ...inputStyle, cursor: 'pointer' }}
 95:               onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
 96:               onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
 97:             >
 98:               {Object.entries(VENTURE_STATUS_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
 99:             </select>
100:           </div>
101:         </div>
102: 
103:         <div>
104:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Modo de Operación</label>
105:           <select
106:             value={mode}
107:             onChange={(e) => setMode(e.target.value as VentureMode)}
108:             style={{ ...inputStyle, cursor: 'pointer' }}
109:             onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
110:             onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
111:           >
112:             {Object.entries(VENTURE_MODE_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
113:           </select>
114:         </div>
115: 
116:         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
117:           <div>
118:             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Invertido ($)</label>
119:             <input
120:               type="number"
121:               step="0.01"
122:               min="0"
123:               value={invested}
124:               onChange={(e) => setInvested(e.target.value)}
125:               style={inputStyle}
126:               onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
127:               onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
128:             />
129:           </div>
130:           <div>
131:             <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>Retornado ($)</label>
132:             <input
133:               type="number"
134:               step="0.01"
135:               min="0"
136:               value={returned}
137:               onChange={(e) => setReturned(e.target.value)}
138:               style={inputStyle}
139:               onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
140:               onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
141:             />
142:           </div>
143:         </div>
144: 
145:         <div>
146:           <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#a3a3a3', marginBottom: '6px' }}>
147:             Notas <span style={{ color: '#737373' }}>(opcional)</span>
148:           </label>
149:           <textarea
150:             value={notes}
151:             onChange={(e) => setNotes(e.target.value)}
152:             placeholder="Notas sobre este venture..."
153:             rows={3}
154:             style={{ ...inputStyle, resize: 'vertical' }}
155:             onFocus={(e) => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(82,82,82,0.3)' }}
156:             onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
157:           />
158:         </div>
159: 
160:         {error && (
161:           <div className="animate-fade-in" style={{
162:             display: 'flex',
163:             alignItems: 'flex-start',
164:             gap: '10px',
165:             padding: '12px',
166:             borderRadius: '8px',
167:             backgroundColor: 'rgba(239,68,68,0.1)',
168:             border: '1px solid rgba(239,68,68,0.2)',
169:             fontSize: '13px',
170:             color: '#f87171',
171:           }}>
172:             <svg width="16" height="16" style={{ flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
173:               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
174:             </svg>
175:             {error}
176:           </div>
177:         )}
178: 
179:         <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
180:           <button
181:             type="button"
182:             onClick={onClose}
183:             style={{
184:               flex: 1, padding: '10px 16px', borderRadius: '10px', border: '1px solid #2a2a2a',
185:               backgroundColor: 'transparent', color: '#a3a3a3', fontSize: '14px', fontWeight: 500,
186:               cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
187:             }}
188:             onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#171717'; e.currentTarget.style.color = '#fafafa' }}
189:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a3a3a3' }}
190:           >
191:             Cancelar
192:           </button>
193:           <button
194:             type="submit"
195:             disabled={submitting}
196:             style={{
197:               flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none',
198:               backgroundColor: '#fafafa', color: '#0a0a0a', fontSize: '14px', fontWeight: 600,
199:               cursor: submitting ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
200:               opacity: submitting ? 0.5 : 1, display: 'flex', alignItems: 'center',
201:               justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
202:             }}
203:             onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#e5e5e5' }}
204:             onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fafafa' }}
205:             onMouseDown={(e) => { if (!submitting) e.currentTarget.style.transform = 'scale(0.98)' }}
206:             onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
207:           >
208:             {submitting && (
209:               <svg className="animate-spin" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none">
210:                 <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
211:                 <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
212:               </svg>
213:             )}
214:             Guardar venture
215:           </button>
216:         </div>
217:       </form>
218:     </SlidePanel>
219:   )
220: }
````

## File: backend/supabase/functions/transactions/index.ts
````typescript
  1: import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
  2: 
  3: // ── Inline CORS ──
  4: const corsHeaders = {
  5:   'Access-Control-Allow-Origin': '*',
  6:   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  7:   'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  8: }
  9: function handleCors(req: Request): Response | null {
 10:   if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
 11:   return null
 12: }
 13: 
 14: // ── Inline Rate Limit ──
 15: async function checkRateLimit(supabase: SupabaseClient, key: string, max = 60, window = 60) {
 16:   const { data, error } = await supabase.rpc('check_rate_limit', { p_key: key, p_max_requests: max, p_window_seconds: window })
 17:   if (error) return { allowed: true, headers: { 'X-RateLimit-Limit': String(max) } }
 18:   const r = data as { allowed: boolean; remaining: number; reset_at: string }
 19:   const h: Record<string, string> = { 'X-RateLimit-Limit': String(max), 'X-RateLimit-Remaining': String(r.remaining), 'X-RateLimit-Reset': r.reset_at }
 20:   if (!r.allowed) {
 21:     return { allowed: false, headers: h, response: new Response(
 22:       JSON.stringify({ code: 'RATE_LIMIT_EXCEEDED', message: `Try again after ${r.reset_at}` }),
 23:       { status: 429, headers: { ...corsHeaders, ...h, 'Content-Type': 'application/json', 'Retry-After': String(window) } }
 24:     )}
 25:   }
 26:   return { allowed: true, headers: h }
 27: }
 28: 
 29: // Removed duplicate import
 30: 
 31: Deno.serve(async (req: Request) => {
 32:   const cors = handleCors(req)
 33:   if (cors) return cors
 34: 
 35:   try {
 36:     const authHeader = req.headers.get('Authorization')
 37:     if (!authHeader) {
 38:       return new Response(JSON.stringify({ code: 'UNAUTHORIZED', message: 'Missing authorization' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
 39:     }
 40: 
 41:     const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } })
 42:     const { data: { user }, error: authError } = await supabase.auth.getUser()
 43:     if (authError || !user) {
 44:       return new Response(JSON.stringify({ code: 'UNAUTHORIZED', message: 'Invalid token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
 45:     }
 46: 
 47:     const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
 48:     const rl = await checkRateLimit(admin, `user:tx:${user.id}`, 60, 60)
 49:     if (!rl.allowed && rl.response) return rl.response
 50: 
 51:     const url = new URL(req.url)
 52:     const parts = url.pathname.split('/').filter(Boolean)
 53:     const txId = parts.length > 1 ? parts[parts.length - 1] : null
 54:     const method = req.method
 55:     const rh = { ...corsHeaders, ...rl.headers, 'Content-Type': 'application/json' }
 56: 
 57:     // GET — listar transacciones
 58:     // Sin paginación: retorna todo (Dashboard, resúmenes)
 59:     // Con page + page_size: paginado (VentureDetail con búsqueda)
 60:     if (method === 'GET') {
 61:       const ventureId = url.searchParams.get('venture_id')
 62:       const search = url.searchParams.get('search')?.trim()
 63:       const categoryId = url.searchParams.get('category_id')
 64:       const pageParam = url.searchParams.get('page')
 65:       const pageSizeParam = url.searchParams.get('page_size')
 66:       const isPaginated = pageParam !== null && pageSizeParam !== null
 67: 
 68:       // Siempre unir con categoría para enriquecer la respuesta
 69:       let query = supabase
 70:         .from('transactions')
 71:         .select('*, category:transaction_categories(id, name, accounting_type, icon, color)', { count: isPaginated ? 'exact' : undefined })
 72:         .order('date', { ascending: false })
 73: 
 74:       if (ventureId) query = query.eq('venture_id', ventureId)
 75:       if (search) query = query.ilike('description', `%${search}%`)
 76:       if (categoryId) query = query.eq('category_id', categoryId)
 77: 
 78:       if (isPaginated) {
 79:         const page = Math.max(1, parseInt(pageParam!))
 80:         const pageSize = Math.min(100, Math.max(1, parseInt(pageSizeParam!)))
 81:         const from = (page - 1) * pageSize
 82:         const to = from + pageSize - 1
 83:         query = query.range(from, to)
 84:         const { data, error, count } = await query
 85:         if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
 86:         return new Response(JSON.stringify({ data, total: count ?? 0, page, page_size: pageSize }), { status: 200, headers: rh })
 87:       }
 88: 
 89:       // Sin paginación — retorna todo (no rompe Dashboard)
 90:       const { data, error } = await query
 91:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
 92:       return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
 93:     }
 94: 
 95: 
 96:     // POST — crear transacción
 97:     if (method === 'POST') {
 98:       const contentType = req.headers.get('content-type') || ''
 99:       let body: { venture_id: string; type: string; amount: number; description?: string; date: string; evidence_url?: string; category_id?: string }
100:       let evidenceUrl: string | null = null
101: 
102:       if (contentType.includes('multipart/form-data')) {
103:         const fd = await req.formData()
104:         body = {
105:           venture_id: fd.get('venture_id') as string,
106:           type: fd.get('type') as string,
107:           amount: parseFloat(fd.get('amount') as string),
108:           description: (fd.get('description') as string) || undefined,
109:           date: fd.get('date') as string,
110:           category_id: (fd.get('category_id') as string) || undefined,
111:         }
112:         const file = fd.get('evidence') as File | null
113:         if (file) {
114:           const ext = file.name.split('.').pop() || 'jpg'
115:           const path = `${user.id}/${body.venture_id}/${crypto.randomUUID()}.${ext}`
116:           const { error: upErr } = await supabase.storage.from('evidence').upload(path, file, { contentType: file.type })
117:           if (!upErr) evidenceUrl = path
118:           else console.error('[Tx] Upload error:', upErr.message)
119:         }
120:       } else {
121:         body = await req.json()
122:       }
123: 
124:       if (!body.venture_id || !body.type || !body.amount || !body.date) {
125:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'venture_id, type, amount, date required' }), { status: 400, headers: rh })
126:       }
127:       if (!['income', 'expense'].includes(body.type)) {
128:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'type must be income or expense' }), { status: 400, headers: rh })
129:       }
130:       if (body.amount <= 0) {
131:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'amount must be > 0' }), { status: 400, headers: rh })
132:       }
133: 
134:       // Verificar que el venture pertenece al usuario
135:       const { data: v, error: vErr } = await supabase.from('ventures').select('id').eq('id', body.venture_id).single()
136:       if (vErr || !v) {
137:         return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Venture not found' }), { status: 404, headers: rh })
138:       }
139: 
140:       const { data, error } = await supabase.from('transactions').insert({
141:         venture_id: body.venture_id, user_id: user.id, type: body.type,
142:         amount: body.amount, description: body.description || null,
143:         date: body.date, evidence_url: evidenceUrl || body.evidence_url || null,
144:         category_id: body.category_id || null,
145:       }).select().single()
146: 
147:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
148: 
149:       // Recalcular totales del venture
150:       const { data: totals } = await admin.from('transactions').select('type, amount').eq('venture_id', body.venture_id)
151:       if (totals) {
152:         const invested = totals.filter((t: { type: string; amount: number }) => t.type === 'expense').reduce((s: number, t: { type: string; amount: number }) => s + Number(t.amount), 0)
153:         const returned = totals.filter((t: { type: string; amount: number }) => t.type === 'income').reduce((s: number, t: { type: string; amount: number }) => s + Number(t.amount), 0)
154:         await admin.from('ventures').update({ invested, returned }).eq('id', body.venture_id)
155:       }
156: 
157:       return new Response(JSON.stringify({ data }), { status: 201, headers: rh })
158:     }
159: 
160:     // DELETE — eliminar transacción
161:     if (method === 'DELETE') {
162:       if (!txId || txId === 'transactions') {
163:         return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Transaction ID required' }), { status: 400, headers: rh })
164:       }
165: 
166:       const { data: existing } = await supabase.from('transactions').select('evidence_url, venture_id').eq('id', txId).single()
167:       const { error } = await supabase.from('transactions').delete().eq('id', txId)
168:       if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
169: 
170:       // Limpiar evidencia de Storage
171:       if (existing?.evidence_url) {
172:         await supabase.storage.from('evidence').remove([existing.evidence_url]).catch(() => {})
173:       }
174: 
175:       // Recalcular totales del venture
176:       if (existing?.venture_id) {
177:         const { data: totals } = await admin.from('transactions').select('type, amount').eq('venture_id', existing.venture_id)
178:         if (totals) {
179:           const invested = totals.filter((t: { type: string; amount: number }) => t.type === 'expense').reduce((s: number, t: { type: string; amount: number }) => s + Number(t.amount), 0)
180:           const returned = totals.filter((t: { type: string; amount: number }) => t.type === 'income').reduce((s: number, t: { type: string; amount: number }) => s + Number(t.amount), 0)
181:           await admin.from('ventures').update({ invested, returned }).eq('id', existing.venture_id)
182:         }
183:       }
184: 
185:       return new Response(JSON.stringify({ message: 'Transaction deleted' }), { status: 200, headers: rh })
186:     }
187: 
188:     return new Response(JSON.stringify({ code: 'METHOD_NOT_ALLOWED' }), { status: 405, headers: rh })
189:   } catch (err) {
190:     console.error('[Transactions] Error:', err)
191:     return new Response(JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Unexpected error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
192:   }
193: })
````

## File: frontend/src/features/transactions/hooks/useTransactions.ts
````typescript
  1: // features/transactions/hooks/useTransactions.ts — Hook para CRUD de transacciones
  2: import { useState, useCallback } from 'react'
  3: import { supabase } from '@/shared/lib/supabase'
  4: import type { Transaction, CreateTransactionInput } from '../types'
  5: import { useAuthStore } from '@/features/auth/store'
  6: import { useVentures } from '@/features/ventures/hooks/useVentures'
  7: 
  8: export interface TransactionsFetchOptions {
  9:   ventureId?: string;
 10:   page?: number;
 11:   pageSize?: number;
 12:   search?: string;
 13:   categoryId?: string;
 14: }
 15: 
 16: export function useTransactions(ventureId?: string) {
 17:   const [transactions, setTransactions] = useState<Transaction[]>([])
 18:   const [loading, setLoading] = useState(true)
 19:   const [error, setError] = useState<string | null>(null)
 20:   const [total, setTotal] = useState(0)
 21:   const [page, setPage] = useState(1)
 22:   const [pageSize, setPageSize] = useState(20)
 23:   const { session } = useAuthStore()
 24:   const { fetchVentures } = useVentures()
 25: 
 26:   const fetchTransactions = useCallback(async (opts?: string | TransactionsFetchOptions) => {
 27:     const isString = typeof opts === 'string'
 28:     const id = (isString ? opts : opts?.ventureId) || ventureId
 29:     
 30:     setLoading(true)
 31:     setError(null)
 32: 
 33:     if (!session?.access_token) {
 34:       setError('No active session')
 35:       setLoading(false)
 36:       return
 37:     }
 38: 
 39:     const params = new URLSearchParams()
 40:     if (id) params.append('venture_id', id)
 41:     
 42:     if (!isString && opts) {
 43:       if (opts.page) {
 44:         params.append('page', opts.page.toString())
 45:         setPage(opts.page)
 46:       }
 47:       if (opts.pageSize) {
 48:         params.append('page_size', opts.pageSize.toString())
 49:         setPageSize(opts.pageSize)
 50:       }
 51:       if (opts.search) params.append('search', opts.search)
 52:       if (opts.categoryId) params.append('category_id', opts.categoryId)
 53:     }
 54: 
 55:     const qs = params.toString()
 56:     const { data, error: invokeError } = await supabase.functions.invoke('transactions' + (qs ? `?${qs}` : ''), {
 57:       method: 'GET',
 58:       headers: { Authorization: `Bearer ${session.access_token}` }
 59:     })
 60: 
 61:     if (invokeError) { setError(invokeError.message); setLoading(false); return }
 62:     setTransactions(data?.data ?? [])
 63:     if (data?.total !== undefined) setTotal(data.total)
 64:     setLoading(false)
 65:   }, [ventureId, session])
 66: 
 67:   const createTransaction = async (input: CreateTransactionInput, evidence?: File) => {
 68:     if (!session?.access_token) throw new Error('No active session')
 69: 
 70:     let responseData
 71:     let invokeError
 72: 
 73:     if (evidence) {
 74:       const formData = new FormData()
 75:       formData.append('venture_id', input.venture_id)
 76:       formData.append('type', input.type)
 77:       formData.append('amount', String(input.amount))
 78:       formData.append('date', input.date)
 79:       if (input.description) formData.append('description', input.description)
 80:       if (input.category_id) formData.append('category_id', input.category_id)
 81:       formData.append('evidence', evidence)
 82: 
 83:       const { data, error } = await supabase.functions.invoke('transactions', {
 84:         method: 'POST',
 85:         headers: { Authorization: `Bearer ${session.access_token}` },
 86:         body: formData,
 87:       })
 88:       responseData = data
 89:       invokeError = error
 90:     } else {
 91:       const { data, error } = await supabase.functions.invoke('transactions', {
 92:         method: 'POST',
 93:         headers: { Authorization: `Bearer ${session.access_token}` },
 94:         body: input,
 95:       })
 96:       responseData = data
 97:       invokeError = error
 98:     }
 99: 
100:     if (invokeError) throw new Error(invokeError.message || 'Error creating transaction')
101:     setTransactions((prev) => [responseData.data, ...prev])
102:     
103:     // Forzar actualización de ventures para reflejar los nuevos totales (Invertido/Retornado)
104:     fetchVentures(true)
105: 
106:     return responseData.data
107:   }
108: 
109:   const deleteTransaction = async (id: string) => {
110:     if (!session?.access_token) throw new Error('No active session')
111: 
112:     const { error } = await supabase.functions.invoke(`transactions/${id}`, {
113:       method: 'DELETE',
114:       headers: { Authorization: `Bearer ${session.access_token}` },
115:     })
116:     
117:     if (error) {
118:       throw new Error(error.message || 'Error deleting transaction')
119:     }
120:     setTransactions((prev) => prev.filter((t) => t.id !== id))
121:     
122:     // Forzar actualización de ventures
123:     fetchVentures(true)
124:   }
125: 
126:   return {
127:     transactions,
128:     loading,
129:     error,
130:     total,
131:     page,
132:     pageSize,
133:     fetchTransactions,
134:     createTransaction,
135:     deleteTransaction,
136:   }
137: }
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
 12:   const hasFetched = useVenturesStore((s) => s.hasFetched)
 13:   const setVentures = useVenturesStore((s) => s.setVentures)
 14:   const addVentureAction = useVenturesStore((s) => s.addVenture)
 15:   const updateVentureAction = useVenturesStore((s) => s.updateVenture)
 16:   const removeVentureAction = useVenturesStore((s) => s.removeVenture)
 17:   const setLoading = useVenturesStore((s) => s.setLoading)
 18:   const setError = useVenturesStore((s) => s.setError)
 19: 
 20:   // Observar sesión del auth store para saber cuándo está lista
 21:   const session = useAuthStore((s) => s.session)
 22: 
 23:   const fetchVentures = useCallback(async (force = false) => {
 24:     if (hasFetched && !force) return
 25:     setLoading(true)
 26:     setError(null)
 27: 
 28:     const headers = session?.access_token 
 29:       ? { Authorization: `Bearer ${session.access_token}` }
 30:       : undefined
 31: 
 32:     const { data, error: invokeError } = await supabase.functions.invoke('ventures', {
 33:       method: 'GET',
 34:       headers,
 35:     })
 36: 
 37:     if (invokeError) {
 38:       setError(invokeError.message || 'Error fetching ventures')
 39:       setLoading(false)
 40:       return
 41:     }
 42:     setVentures(data?.data ?? [])
 43:     setLoading(false)
 44:   }, [session, setLoading, setError, setVentures, hasFetched])
 45: 
 46:   // Solo hacer fetch cuando la sesión esté disponible y no tengamos datos
 47:   useEffect(() => {
 48:     if (session?.access_token && !hasFetched) {
 49:       fetchVentures()
 50:     }
 51:   }, [session?.access_token, hasFetched, fetchVentures])
 52: 
 53:   const createVenture = async (input: CreateVentureInput) => {
 54:     const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
 55:     const { data, error } = await supabase.functions.invoke('ventures', {
 56:       method: 'POST',
 57:       body: input,
 58:       headers,
 59:     })
 60: 
 61:     if (error) throw new Error(error.message || 'Error creating venture')
 62:     addVentureAction(data.data)
 63:     return data.data
 64:   }
 65: 
 66:   const updateVenture = async (id: string, input: Partial<UpdateVentureInput>) => {
 67:     const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
 68:     const { data, error } = await supabase.functions.invoke(`ventures/${id}`, {
 69:       method: 'PUT',
 70:       body: input,
 71:       headers,
 72:     })
 73: 
 74:     if (error) throw new Error(error.message || 'Error updating venture')
 75:     updateVentureAction(data.data)
 76:     return data.data
 77:   }
 78: 
 79:   const deleteVenture = async (id: string) => {
 80:     const headers = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : undefined
 81:     const { error } = await supabase.functions.invoke(`ventures/${id}`, {
 82:       method: 'DELETE',
 83:       headers,
 84:     })
 85: 
 86:     if (error) {
 87:       throw new Error(error.message || 'Error deleting venture')
 88:     }
 89:     removeVentureAction(id)
 90:   }
 91: 
 92:   return {
 93:     ventures,
 94:     loading,
 95:     error,
 96:     fetchVentures,
 97:     createVenture,
 98:     updateVenture,
 99:     deleteVenture,
100:   }
101: }
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
 29: | **Dashboard (Frontend)** | ✅ Listo | Centro de Mando: 4 métricas contextuales + MonthlyChart compuesto + VentureROIChart + TypeDistributionChart + VentureStatusList + SmartAlerts |
 30: | **Ventures (Frontend)** | ✅ Listo | Cards grid, filtros, crear/editar modal, detalle con transacciones |
 31: | **Transactions (Frontend)** | ✅ Listo | Form con toggle income/expense, file upload, delete |
 32: | **Settings (Frontend)** | ✅ Listo | WhatsApp API config + Keywords manager |
 33: | **Rate Limiting (Backend)** | ✅ Listo | Protección contra ataques DDoS en Edge Functions |
 34: | **Auth & Function Sync** | ✅ Listo | Inyección manual de `Authorization` header en hooks (resolve 401s) |
 35: | **Seguridad Webhook** | ✅ Listo | Verificación HMAC SHA-256 para mensajes de WhatsApp |
 36: | **Limpieza de código** | ✅ Listo | Archivos huérfanos eliminados y corrección de sintaxis en catches |
 37: | **Sistema de Préstamos** | ✅ Listo | Edge Function `loans`, componente `DashboardLoans` y soporte para pagos semanales. |
 38: 
 39: ### 🔲 Pendiente
 40: 
 41: | Módulo | Fase | Descripción |
 42: |--------|------|-------------|
 43: | **Testing E2E** | 1 | Verificar flujo completo auth → ventures → transacciones en local |
 44: | **Deploy Vercel** | 1 | Configurar env vars y CI/CD desde `main` |
 45: | **Hogar** | 2 | UI de gastos compartidos (tablas SQL ya creadas, sin frontend) |
 46: | **Préstamos Avanzados** | 2 | Pagos semanales, Semáforo de Riesgo y Vista Ledger/Timeline |
 47: | **Webhook Mercado Pago** | 3 | Ingreso automático de pagos en ventures |
 48: | **Webhook Stripe** | 3 | Ingreso automático para clientes internacionales |
 49: | **Storage bucket** | 1 | Crear bucket `evidence` en Supabase para evidencias de transacciones |
 50: 
 51: ---
 52: 
 53: ## Módulos
 54: 
 55: ### ✦ Ventures (MVP — Fase 1) ✅
 56: 
 57: Panel de proyectos con ciclo financiero propio.
 58: 
 59: Entidad `Venture`:
 60: - `id`, `user_id`, `name`
 61: - `type`: `software` | `physical` | `investment` | `mixed`
 62: - `status`: `active` | `paused` | `closed` | `idea`
 63: - `invested`: capital total invertido (numérico, MXN por defecto)
 64: - `returned`: retorno total recibido
 65: - `roi`: calculado en frontend — nunca persistido → `((returned - invested) / invested) * 100`
 66: - `currency`: default `MXN`
 67: - `start_date`, `end_date?`, `notes`
 68: 
 69: Entidad `Transaction`:
 70: - `id`, `venture_id`, `user_id`
 71: - `type`: `income` | `expense`
 72: - `amount`, `description`, `date`
 73: - `evidence_url?` — foto de transferencia o referencia (Supabase Storage)
 74: 
 75: ### ✦ Dashboard — Centro de Mando (Fase 2) ✅
 76: 
 77: Vista de salud financiera general con decisiones accionables:
 78: - **Flujo libre este mes** (ingresos - gastos) con tendencia vs mes anterior
 79: - **Capital total activo** en ventures activos
 80: - **ROI promedio** con conteo de ventures positivos
 81: - **Total invertido** con retornado como subtítulo
 82: - Historial mensual: barras ingresos/gastos + línea flujo libre (ComposedChart)
 83: - Distribución de capital por tipo de venture (PieChart donut)
 84: - Ranking comparativo de ROI por venture (BarChart horizontal)
 85: - Lista de estado de ventures con badges de acción (Escalar/Mantener/Vigilar/Revisar)
 86: - Alertas inteligentes: tarjetas horizontales con acciones (riesgo, mejor venture, gasto elevado, diversificación, **proyectos en fase de idea/cerrados**).
 87: - **Guía de Indicadores**: Sección Footer UX con leyenda semántica de colores (Verde, Amarillo, Rojo, Azul, Gris).
 88: 
 89: ### ✦ Settings — WhatsApp + Keywords (MVP — Fase 1) ✅
 90: 
 91: - Config de API WhatsApp por usuario (token, phone_number_id, verify_token)
 92: - Keywords para clasificación automática de transacciones vía WhatsApp
 93: - Webhook endpoint para recibir mensajes de WhatsApp
 94: 
 95: ### ✦ Hogar (Fase 2 — tablas creadas, sin UI)
 96: 
 97: Gastos compartidos del hogar entre ambos usuarios.
 98: - `HouseholdExpense`: gasto compartido con split configurable
 99: - `Category`: categorías (renta, comida, servicios, etc.)
100: - `RecurringExpense`: gastos fijos mensuales
101: 
102: > **Regla:** No construir UI de Hogar en Fase 1. Solo existen las tablas SQL.
103: 
104: ### ✦ Préstamos — Gestión de Deuda (Fase 2) ⚠️
105: Gestión de obligaciones financieras y cronogramas de pago.
106: Entidad `Loan`:
107: - `id`, `user_id`, `venture_id`
108: - `name`, `principal`, `interest_rate`, `start_date`, `status`
109: - `periodicity`: `monthly` | `weekly` (NUEVO)
110: - `risk_level`: `low` | `medium` | `high` (NUEVO)
111: 
112: Entidad `LoanPayment`:
113: - `id`, `loan_id`, `amount`, `due_date`, `status` (`pending`, `paid`)
114: 
115: ### ✦ Integraciones (Fase 3)
116: - Webhook Mercado Pago → registra ingresos automáticamente en el venture correspondiente
117: - Webhook Stripe → mismo flujo para clientes internacionales
118: 
119: ---
120: 
121: ## Stack tecnológico
122: 
123: | Capa | Tecnología | Versión |
124: |------|-----------|---------|
125: | Frontend | React + TypeScript + Vite | React 19, Vite 8 |
126: | Estilos | Tailwind CSS | v4 |
127: | Estado global | Zustand | latest |
128: | Charts | Recharts | latest |
129: | Routing | React Router | v7 |
130: | Backend | Supabase Edge Functions (Deno + TS) | — |
131: | Base de datos | PostgreSQL vía Supabase | — |
132: | Auth | Supabase Auth | — |
133: | Storage | Supabase Storage | — |
134: | Deploy frontend | Vercel (pendiente) | — |
135: | Deploy backend | Supabase (managed) | — |
136: | Package manager | npm workspaces | — |
137: 
138: ---
139: 
140: ## Arquitectura — monorepo con Vertical Slice Design
141: 
142: ```
143: finova/
144: │
145: ├── frontend/                        ← React SPA — deploy en Vercel
146: │   ├── src/
147: │   │   ├── app/                     ← Entrypoint, router, layout, protected route
148: │   │   │   ├── Layout.tsx           ← Sidebar dark + TopBar glass + Outlet
149: │   │   │   ├── ProtectedRoute.tsx   ← Auth guard con branded loading
150: │   │   │   └── router.tsx           ← Todas las rutas
151: │   │   │
152: │   │   ├── features/                ← Vertical slices por dominio
153: │   │   │   ├── auth/
154: │   │   │   │   ├── components/AuthForm.tsx
155: │   │   │   │   ├── hooks/useAuth.ts
156: │   │   │   │   ├── store.ts
157: │   │   │   │   └── types.ts
158: │   │   │   │
159: │   │   │   ├── ventures/
160: │   │   │   │   ├── components/      ← VentureCard, VentureForm, VenturesList, VentureDetail
161: │   │   │   │   ├── hooks/useVentures.ts
162: │   │   │   │   ├── store.ts
163: │   │   │   │   ├── utils.ts         ← calculateROI, breakEven, ventureHealth
164: │   │   │   │   └── types.ts
165: │   │   │   │
166: │   │   │   ├── transactions/
167: │   │   │   │   ├── components/TransactionForm.tsx
168: │   │   │   │   ├── hooks/useTransactions.ts
169: │   │   │   │   └── types.ts
170: │   │   │   │
171: │   │   │   ├── dashboard/
172: │   │   │   │   └── components/      ← DashboardView, MetricCard, MonthlyChart, VentureROIChart, TypeDistributionChart, VentureStatusList, SmartAlerts
173: │   │   │   │
174: │   │   │   └── settings/
175: │   │   │       └── components/      ← WhatsAppSettings, KeywordsManager
176: │   │   │
177: │   │   ├── pages/                   ← Shells: montan features, sin lógica
178: │   │   │   ├── AuthPage.tsx
179: │   │   │   ├── DashboardPage.tsx
180: │   │   │   ├── VenturesPage.tsx
181: │   │   │   ├── VentureDetailPage.tsx
182: │   │   │   ├── SettingsWhatsAppPage.tsx
183: │   │   │   └── SettingsKeywordsPage.tsx
184: │   │   │
185: │   │   └── shared/                  ← Utilidades y types (sin componentes UI activos)
186: │   │       ├── lib/
187: │   │       │   ├── supabase.ts      ← Cliente Supabase (solo anon key)
188: │   │       │   ├── formatters.ts    ← formatCurrency, formatDate, formatROI
189: │   │       │   └── constants.ts     ← Labels de tipos y estados
190: │   │       └── types/
191: │   │           └── index.ts         ← Re-exporta desde backend
192: │   │
193: │   ├── index.html
194: │   ├── vite.config.ts
195: │   ├── tsconfig.app.json           ← include: ["src", "../backend/_shared/types.ts"]
196: │   ├── .env.example                 ← VITE_SUPABASE_URL + ANON_KEY
197: │   └── package.json
198: │
199: ├── backend/                         ← Edge Functions — deploy en Supabase
200: │   └── _shared/
201: │       ├── types.ts                 ← FUENTE DE VERDAD de todos los tipos
202: │       ├── cors.ts                  ← CORS helper
203: │       ├── rateLimit.ts             ← Rate limiting por IP
204: │       ├── supabaseAdmin.ts         ← service_role key — NUNCA en frontend
205: │       └── whatsapp.ts              ← Utilidades para WhatsApp API
206: │
207: ├── supabase/
208: │   ├── functions/                   ← Edge Functions desplegadas
209: │   │   ├── ventures/index.ts
210: │   │   ├── transactions/index.ts
211: │   │   ├── loans/index.ts           ← Gestión de préstamos y cuotas
212: │   │   ├── keywords/index.ts
213: │   │   ├── whatsapp-config/index.ts
214: │   │   └── whatsapp-webhook/index.ts
215: │   └── migrations/
216: │       ├── 001_ventures.sql
217: │       ├── 002_transactions.sql
218: │       ├── 003_household_expenses.sql
219: │       ├── 004_user_integrations.sql
220: │       ├── 005_whatsapp_keywords.sql
221: │       └── 006_loans.sql                ← Préstamos y cronogramas
222: │
223: ├── CLAUDE.md                        ← Este archivo
224: ├── Sugerencias.md                   ← Roadmap y planes futuros detallados
225: ├── repomix.config.json              ← Genera contexto para agentes
226: └── package.json                     ← Workspace root
227: ```
228: 
229: ---
230: 
231: ## Regla de importaciones — Vertical Slice
232: 
233: ```
234: app → pages → features → shared
235: ```
236: 
237: **Nunca importar hacia arriba.** Un feature no importa de otro feature. Si hay lógica compartida, va a `shared/`.
238: 
239: ```typescript
240: // ✓ Correcto
241: import { Venture } from '../types'          // dentro del mismo feature
242: import { formatCurrency } from '@/shared/lib/formatters'
243: 
244: // ✗ Prohibido
245: import { useVentures } from '@/features/ventures/hooks/useVentures'  // cross-feature
246: ```
247: 
248: **Excepción permitida:** `dashboard/` puede importar `calculateROI` desde `ventures/utils.ts` porque dashboard es consumidor de métricas de ventures. No obstante, si más features lo necesitan, mover a `shared/lib/`.
249: 
250: ---
251: 
252: ## Supabase — Schema completo
253: 
254: ### 001_ventures.sql
255: ```sql
256: create table ventures (
257:   id uuid primary key default gen_random_uuid(),
258:   user_id uuid references auth.users not null,
259:   name text not null,
260:   type text check (type in ('software','physical','investment','mixed')) not null,
261:   status text check (status in ('active','paused','closed','idea')) default 'active',
262:   invested numeric(12,2) default 0,
263:   returned numeric(12,2) default 0,
264:   currency text default 'MXN',
265:   start_date date,
266:   end_date date,
267:   notes text,
268:   created_at timestamptz default now(),
269:   updated_at timestamptz default now()
270: );
271: 
272: alter table ventures enable row level security;
273: 
274: create policy "usuarios ven solo sus ventures"
275:   on ventures for all
276:   using (auth.uid() = user_id)
277:   with check (auth.uid() = user_id);
278: ```
279: 
280: ### 002_transactions.sql
281: ```sql
282: create table transactions (
283:   id uuid primary key default gen_random_uuid(),
284:   venture_id uuid references ventures(id) on delete cascade not null,
285:   user_id uuid references auth.users not null,
286:   type text check (type in ('income','expense')) not null,
287:   amount numeric(12,2) not null check (amount > 0),
288:   description text,
289:   date date not null,
290:   evidence_url text,
291:   created_at timestamptz default now()
292: );
293: 
294: alter table transactions enable row level security;
295: 
296: create policy "usuarios ven solo sus transacciones"
297:   on transactions for all
298:   using (auth.uid() = user_id)
299:   with check (auth.uid() = user_id);
300: ```
301: 
302: ### 003_household_expenses.sql (Fase 2 — solo schema)
303: ```sql
304: create table household_expenses (
305:   id uuid primary key default gen_random_uuid(),
306:   created_by uuid references auth.users not null,
307:   amount numeric(12,2) not null,
308:   category text,
309:   description text,
310:   split_ratio numeric(3,2) default 0.50 check (split_ratio between 0 and 1),
311:   date date not null,
312:   created_at timestamptz default now()
313: );
314: ```
315: 
316: ### 004_user_integrations.sql
317: ```sql
318: create table user_integrations (
319:   id uuid primary key default gen_random_uuid(),
320:   user_id uuid references auth.users not null,
321:   provider text not null,
322:   config jsonb not null,
323:   encrypted_token text,
324:   is_active boolean default true,
325:   created_at timestamptz default now(),
326:   updated_at timestamptz default now(),
327:   unique(user_id, provider)
328: );
329: ```
330: 
331: ### 005_whatsapp_keywords.sql
332: ```sql
333: create table whatsapp_keywords (
334:   id uuid primary key default gen_random_uuid(),
335:   user_id uuid references auth.users not null,
336:   keyword text not null,
337:   maps_to text check (maps_to in ('income','expense')) not null,
338:   venture_id uuid references ventures(id) on delete set null,
339:   created_at timestamptz default now()
340: );
341: 
342: -- RPC Functions
343: -- encrypt_token(p_token text, p_key text) returns text
344: -- decrypt_token(p_encrypted_token text, p_key text) returns text
345: ```
346: 
347: ---
348: 
349: ## Variables de entorno
350: 
351: | Variable | Ubicación | Acceso |
352: |----------|-----------|--------|
353: | `VITE_SUPABASE_URL` | `frontend/.env` | Frontend — pública, protegida por RLS |
354: | `VITE_SUPABASE_ANON_KEY` | `frontend/.env` | Frontend — pública, protegida por RLS |
355: | `SUPABASE_URL` | Supabase secrets | Edge Functions únicamente |
356: | `SUPABASE_SERVICE_ROLE_KEY` | Supabase secrets | Edge Functions únicamente — **NUNCA en frontend** |
357: 
358: > El `service_role_key` bypasea RLS. Si llega al frontend, cualquier usuario puede leer todos los datos.
359: 
360: ---
361: 
362: ## Cálculos de negocio
363: 
364: ### Ventures de Negocio (Business)
365: Calculan ROI y Break Even tradicional.
366: 
367: ### Ventures Personales (Personal / Hogar)
368: Métrica: **Salud de Presupuesto** ($1 - \text{Gasto}/\text{Presupuesto}$).
369: Regla: Evitar el término ROI en modo personal para evitar confusiones (ej. -100% al gastar).
370: 
371: ```typescript
372: // features/ventures/utils.ts -> Migrado a shared/lib/metrics.ts
373: export const calculateROI = (invested: number, returned: number): number => {
374:   if (invested === 0) return 0
375:   if (returned === 0 && invested > 0) return -100 // Refleja pérdida total inicial
376:   return Number(((returned - invested) / invested * 100).toFixed(2))
377: }
378: 
379: /** 
380:  * Salud del presupuesto (Modo Personal/Hogar)
381:  * @returns 0-100 (Porcentaje de presupuesto disponible)
382:  */
383: export const calculateHealth = (budget: number, spent: number): number => {
384:   if (budget <= 0) return 0
385:   const remaining = budget - spent
386:   return Math.max(0, Number(((remaining / budget) * 100).toFixed(2)))
387: }
388: 
389: /** 
390:  * Estado Semántico de Salud (Basado en ROI) 
391:  * - Positive: ROI > 10% (Crecimiento real)
392:  * - Neutral: 0% <= ROI <= 10% (Punto de equilibrio o marginal)
393:  * - Negative: ROI < 0% (Pérdida)
394:  */
395: export const ventureHealth = (roi: number): VentureHealth => {
396:   if (roi > 10) return 'positive'
397:   if (roi >= 0) return 'neutral'
398:   return 'negative'
399: }
400: ```
401: 
402: ---
403: 
404: ## Reglas del agente
405: 
406: 1. Leer `CLAUDE.md` completo antes de cualquier acción
407: 2. Correr `npm run ctx` para obtener contexto actualizado del código
408: 3. No crear UI de Hogar en Fase 1
409: 4. ROI nunca se persiste — solo se calcula en frontend (`ventures/utils.ts`)
410: 5. Cada cambio a DB requiere su migration SQL versionada
411: 6. No usar `any` en TypeScript
412: 7. `service_role_key` nunca en `frontend/`
413: 8. Un feature = un commit atómico
414: 9. Nunca importar una feature desde otra feature — usar `shared/` si hay lógica común
415: 10. Tipos de dominio solo en `backend/_shared/types.ts`
416: 11. `pages/` son shells: sin lógica propia, solo montan features
417: 12. Cada feature tiene su propio `store.ts` de Zustand — sin store global
418: 13. Todas las peticiones al backend van via `VITE_SUPABASE_URL/functions/v1/{edge-function}`
419: 14. **Crucial:** El JWT de Supabase debe incluirse **manualmente** en `Authorization: Bearer` dentro de las llamadas a `supabase.functions.invoke`, ya que el SDK no lo persiste automáticamente en este método.
420: 15. Seguridad WhatsApp: Webhooks usan HMAC signature verification (Meta standard).
421: 16. **Seguridad Crítica:** Queda TERMINANTEMENTE PROHIBIDO realizar commit de archivos `.env`. Verificar siempre con `npm run ctx` que no se fuguen secretos en el contexto enviado a agentes.
422: 17. **Mantenimiento de Contexto:** Al finalizar cada turno de trabajo, el agente DEBE actualizar los checklists en `CLAUDE.md`, `PLAN_TAREA.md` e `implementation_plan.md`.
423: 18. **Garantía de Sincronía:** Antes de iniciar una nueva tarea, ejecutar `npm run ctx` para asegurar que el `repomix-output.md` sea el reflejo fiel del código actual.
424: 19. **Estética Monochrome & Sin Emojis:** Queda PROHIBIDO el uso de emojis en el frontend. Se debe usar una estética premium, monocromática y limpia (escala de grises, negro puro, blanco nieve).
425: 20. **Lenguaje Natural:** Priorizar claridad técnica y naturalidad en mensajes y etiquetas.
426: 21. **Separación Vista/Lógica — Componentes Tontos:**
427:     Los archivos en `features/*/components/` son EXCLUSIVAMENTE de renderizado.
428:     Ningún componente puede contener lógica de negocio: filtros por fecha, cálculos
429:     de métricas, agregaciones, comparaciones porcentuales o transformaciones de datos.
430:     
431:     Toda esa lógica vive en:
432:     - `features/*/utils.ts` → funciones puras de cálculo
433:     - `features/*/hooks/use*.ts` → lógica con estado o efectos
434:     
435:     El componente solo recibe datos ya procesados y los renderiza.
436:     
437:     **Convención de Nombres ESTRICTA:**
438:     - Componentes de vista (cascarón de página o sección): `.view.tsx`.
439:     - Componentes de UI unitarios (Botones, Inputs): `.tsx`.
440:     - Hooks de lógica: `use*.ts`.
441:     - Utilidades puras: `*.ts`.
442: 
443:     **Prohibiciones en Vistas (.view.tsx):**
444:     - Prohibido el uso de lógica de negocio (agregaciones, reducciones, filtros complejos).
445:     - Prohibido el uso de `useEffect` para cálculos de dominio (debe ir en un hook).
446:     - Prohibida la declaración de tipos de dominio locales (usar `@backend/_shared/types.ts`).
447:     
448:     VIOLACIÓN DETECTABLE: Si un componente contiene `.filter()`, `.reduce()`,
449:     `.map()` con lógica de dominio (que no sea simple renderizado de lista), o 
450:     construcción de `Record<>` para agrupamiento, ese código debe extraerse a un Hook o Util.
451: 
452:     **Regla de Oro del Vertical Slice:**
453:     Un cambio en un Feature (ej. `ventures`) NUNCA debe requerir cambios en otro Feature 
454:     (ej. `dashboard`) más allá de la actualización de una interfaz en `shared`. Si esto sucede,
455:     la arquitectura está mal acoplada.
456: ---
457: 
458: ## Comandos
459: 
460: ```bash
461: # Frontend
462: npm run dev          # Levanta frontend en desarrollo (Vite)
463: npm run build        # Build de producción (tsc + vite build)
464: npm run lint         # ESLint en todo el monorepo
465: npm run ctx          # Genera repomix-output.md para agentes
466: 
467: # Supabase
468: npx supabase start   # DB local para desarrollo
469: npx supabase db push # Aplica migrations a Supabase producción
470: npx supabase functions deploy <name>  # Despliega Edge Function
471: ```
472: 
473: ---
474: 
475: ## Desarrollo y DX (Developer Experience)
476: 
477: - **Editor (VS Code/Cursor):** Se requiere el uso del archivo `.vscode/settings.json` para habilitar el soporte de Deno exclusivamente en `backend/supabase/functions`, evitando errores de tipado falsos en el frontend.
478: - **Extensiones recomendadas:** `denoland.vscode-deno`.
479: 
480: ---
481: 
482: ## Checklist MVP — Fase 1
483: 
484: ### Setup base
485: - [x] Monorepo con npm workspaces
486: - [x] `frontend` — Vite + React + TypeScript
487: - [x] Tailwind CSS v4
488: - [x] Path aliases configurados (`@/` → `src/`, `@backend/` → `../backend/`)
489: - [x] repomix + script `ctx`
490: - [x] `.gitignore` — bloquea todos los `.env`
491: - [x] Limpieza de archivos Vite default (App.css, svgs, hero.png)
492: - [x] Limpieza de MockData y shared/ui no usados
493: - [x] Configuración `.vscode/settings.json` para Deno support
494: 
495: ### Supabase
496: - [x] Proyecto creado en Supabase
497: - [x] Migration 001 aplicada (ventures + RLS)
498: - [x] Migration 002 aplicada (transactions + RLS)
499: - [x] Migration 003 aplicada (household_expenses — solo tabla)
500: - [x] Migration 004 aplicada (user_integrations + RLS)
501: - [x] Migration 005 aplicada (whatsapp_keywords + RLS)
502: - [x] Edge Functions desplegadas (ventures, transactions, keywords, whatsapp-config, whatsapp-webhook)
503: - [x] Rate limiting en Edge Functions
504: - [ ] Supabase Storage bucket para evidencias
505: - [x] RLS verificado
506: - [x] Verificación HMAC para WhatsApp Webhook
507: - [x] **Saneamiento de seguridad** (Claves rotadas y .gitignore configurado)
508: 
509: ### Auth
510: - [x] Pantalla login / registro (monochrome split UI)
511: - [x] Integración Google OAuth
512: - [x] Protección de rutas (ProtectedRoute)
513: - [x] Hook `useAuth` (Zustand + Supabase listener)
514: - [x] Persistencia de sesión
515: - [x] Inyección de Authorization Header en `supabase.functions.invoke`
516: 
517: ### Módulo Ventures
518: - [x] Listado de ventures con ROI calculado
519: - [x] Crear venture (form validado)
520: - [x] Editar venture
521: - [x] Detalle de venture con historial de transacciones
522: - [x] Agregar transacción (income / expense)
523: - [x] Upload de evidencia (form con file input)
524: 
525: ### Dashboard — Centro de Mando
526: - [x] 4 métricas contextuales (flujo libre, capital activo, ROI promedio, total invertido)
527: - [x] MonthlyChart compuesto (barras + línea flujo libre)
528: - [x] TypeDistributionChart (donut por tipo)
529: - [x] VentureROIChart (ranking horizontal)
530: - [x] VentureStatusList (badges de acción)
531: - [x] SmartAlerts (riesgo, rendimiento, gastos, **notificación de fase idea/cerrado**)
532: 
533: ### Mantenimiento de Contexto
534: - [x] Actualización de `CLAUDE.md` con reglas de Emojis y Salud.
535: - [x] Sincronización de `implementation_plan.md`, `task.md` y `Sugerencias.md`.
536: 
537: ### Módulo Préstamos (En curso)
538: - [x] Edge Function `loans` básica.
539: - [x] Componente `DashboardLoans`.
540: - [ ] Soporte para periodicidad semanal.
541: - [ ] Semáforo de riesgo e integración con flujo libre.
542: - [ ] Vista Ledger / Timeline.
543: 
544: ### Deploy
545: - [ ] Variables de entorno configuradas en Vercel
546: - [ ] Deploy automático desde rama `main`
547: 
548: ---
549: 
550: ## Próximos pasos (por prioridad)
551: 
552: 1. **Storage bucket** — Crear bucket `evidence` en Supabase para evidence_url
553: 2. **Deploy Vercel** — Configurar env vars + CI/CD
554: 3. **Hogar (Fase 2)** — UI de gastos compartidos (esquema ya existe)
555: 4. **Webhooks (Fase 3)** — Mercado Pago + Stripe
````
