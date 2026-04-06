// backend/_shared/rateLimit.ts
// ─────────────────────────────────────────────────────────────────────────────
// Middleware de rate limiting usando Postgres (sin dependencias externas).
// Llama a check_rate_limit() de la DB y agrega headers estándar.
// ─────────────────────────────────────────────────────────────────────────────
import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from './cors.ts'
import type { RateLimitResult } from './types.ts'

interface RateLimitOptions {
  /** Identificador único: 'user:{uid}' o 'ip:{address}' o 'phone:{id}' */
  key: string
  /** Máximo de requests por ventana. Default: 60 */
  maxRequests?: number
  /** Duración de la ventana en segundos. Default: 60 */
  windowSeconds?: number
}

/**
 * Verifica rate limits contra la función SQL check_rate_limit().
 * Retorna headers para agregar al Response + si fue bloqueado.
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  options: RateLimitOptions
): Promise<{
  allowed: boolean
  headers: Record<string, string>
  response?: Response
}> {
  const { key, maxRequests = 60, windowSeconds = 60 } = options

  const { data, error } = await supabase.rpc('check_rate_limit', {
    p_key: key,
    p_max_requests: maxRequests,
    p_window_seconds: windowSeconds,
  })

  if (error) {
    // Si falla el rate limiter, permitir el request (fail-open)
    // pero loguear el error
    console.error('[RateLimit] Error checking rate limit:', error.message)
    return {
      allowed: true,
      headers: {
        'X-RateLimit-Limit': String(maxRequests),
        'X-RateLimit-Remaining': 'unknown',
      },
    }
  }

  const result = data as RateLimitResult

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(maxRequests),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': result.reset_at,
  }

  if (!result.allowed) {
    return {
      allowed: false,
      headers,
      response: new Response(
        JSON.stringify({
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Rate limit exceeded. Try again after ${result.reset_at}`,
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            ...headers,
            'Content-Type': 'application/json',
            'Retry-After': String(windowSeconds),
          },
        }
      ),
    }
  }

  return { allowed: true, headers }
}

/**
 * Extrae la IP del request (para rate limiting de webhooks anónimos).
 */
export function getClientIP(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}
