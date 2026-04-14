const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}
function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  return null
}

async function checkRateLimit(supabase: any, key: string, max = 30, window = 60) {
  const { data, error } = await supabase.rpc('check_rate_limit', { p_key: key, p_max_requests: max, p_window_seconds: window })
  if (error) return { allowed: true, headers: { 'X-RateLimit-Limit': String(max) } }
  const r = data as { allowed: boolean; remaining: number; reset_at: string }
  const h: Record<string, string> = { 'X-RateLimit-Limit': String(max), 'X-RateLimit-Remaining': String(r.remaining), 'X-RateLimit-Reset': r.reset_at }
  if (!r.allowed) {
    return { allowed: false, headers: h, response: new Response(
      JSON.stringify({ code: 'RATE_LIMIT_EXCEEDED', message: `Try again after ${r.reset_at}` }),
      { status: 429, headers: { ...corsHeaders, ...h, 'Content-Type': 'application/json', 'Retry-After': String(window) } }
    )}
  }
  return { allowed: true, headers: h }
}

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  const cors = handleCors(req)
  if (cors) return cors

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ code: 'UNAUTHORIZED', message: 'Missing authorization' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } })
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ code: 'UNAUTHORIZED', message: 'Invalid token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const rl = await checkRateLimit(admin, `user:settings:${user.id}`, 30, 60)
    if (!rl.allowed && rl.response) return rl.response

    const url = new URL(req.url)
    const path = url.pathname
    const method = req.method
    const rh = { ...corsHeaders, ...rl.headers, 'Content-Type': 'application/json' }

    // ================================================================
    // INTEGRATIONS: /user-settings/integrations/whatsapp
    // ================================================================
    if (path.includes('integrations')) {

      // GET — obtener config de WhatsApp del usuario
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('user_integrations')
          .select('id, provider, config, is_active, created_at, updated_at')
          .eq('provider', 'whatsapp')
          .single()

        if (error || !data) {
          return new Response(JSON.stringify({
            data: null,
            message: 'No WhatsApp integration configured',
            webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-webhook`,
          }), { status: 200, headers: rh })
        }

        return new Response(JSON.stringify({
          data: {
            ...data,
            webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-webhook`,
          },
        }), { status: 200, headers: rh })
      }

      // PUT — guardar/actualizar config de WhatsApp
      if (method === 'PUT') {
        const body = await req.json()
        const { phone_number_id, access_token, verify_token, default_venture_id } = body

        if (!phone_number_id || !access_token || !verify_token) {
          return new Response(JSON.stringify({
            code: 'VALIDATION_ERROR',
            message: 'phone_number_id, access_token, and verify_token are required',
          }), { status: 400, headers: rh })
        }

        // Encriptar el access_token
        const encryptionKey = Deno.env.get('ENCRYPTION_KEY') || 'finova-default-key'
        const { data: encrypted } = await admin.rpc('encrypt_token', {
          p_token: access_token,
          p_key: encryptionKey,
        })

        // Upsert: crear o actualizar
        const { data, error } = await admin
          .from('user_integrations')
          .upsert({
            user_id: user.id,
            provider: 'whatsapp',
            config: {
              phone_number_id,
              verify_token,
              default_venture_id: default_venture_id || null,
            },
            encrypted_token: encrypted,
            is_active: true,
          }, { onConflict: 'user_id,provider' })
          .select('id, provider, config, is_active, updated_at')
          .single()

        if (error) {
          return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        }

        return new Response(JSON.stringify({
          data,
          webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/whatsapp-webhook`,
          message: 'WhatsApp integration saved. Use the webhook_url in your Meta Business dashboard.',
        }), { status: 200, headers: rh })
      }

      // DELETE — desactivar integración
      if (method === 'DELETE') {
        const { error } = await supabase
          .from('user_integrations')
          .update({ is_active: false })
          .eq('provider', 'whatsapp')

        if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        return new Response(JSON.stringify({ message: 'WhatsApp integration deactivated' }), { status: 200, headers: rh })
      }
    }

    // ================================================================
    // KEYWORDS: /user-settings/keywords
    // ================================================================
    if (path.includes('keywords')) {
      const parts = path.split('/').filter(Boolean)
      const keywordId = parts[parts.length - 1] !== 'keywords' ? parts[parts.length - 1] : null

      // GET — listar keywords del usuario
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('whatsapp_keywords')
          .select('*')
          .order('maps_to')
          .order('keyword')

        if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
      }

      // POST — agregar keyword
      if (method === 'POST') {
        const body = await req.json()
        if (!body.keyword || !body.maps_to) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'keyword and maps_to required' }), { status: 400, headers: rh })
        }
        if (!['income', 'expense'].includes(body.maps_to)) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'maps_to must be income or expense' }), { status: 400, headers: rh })
        }

        const { data, error } = await supabase
          .from('whatsapp_keywords')
          .insert({ user_id: user.id, keyword: body.keyword.toLowerCase().trim(), maps_to: body.maps_to })
          .select()
          .single()

        if (error) {
          if (error.code === '23505') {
            return new Response(JSON.stringify({ code: 'DUPLICATE', message: 'Keyword already exists' }), { status: 409, headers: rh })
          }
          return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        }
        return new Response(JSON.stringify({ data }), { status: 201, headers: rh })
      }

      // DELETE — eliminar keyword
      if (method === 'DELETE') {
        if (!keywordId) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Keyword ID required' }), { status: 400, headers: rh })
        }
        const { error } = await supabase.from('whatsapp_keywords').delete().eq('id', keywordId)
        if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        return new Response(JSON.stringify({ message: 'Keyword deleted' }), { status: 200, headers: rh })
      }
    }

    // ================================================================
    // CONTEXTS: /user-settings/contexts
    // ================================================================
    if (path.includes('contexts')) {
      const parts = path.split('/').filter(Boolean)
      const contextId = parts[parts.length - 1] !== 'contexts' ? parts[parts.length - 1] : null

      // GET — listar contextos del sistema + propios
      if (method === 'GET') {
        const { data, error } = await supabase
          .from('venture_contexts')
          .select('*')
          .or(`user_id.is.null,user_id.eq.${user.id}`)
          .order('sort_order')

        if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
      }

      // POST — crear contexto personalizado
      if (method === 'POST') {
        const body = await req.json()
        if (!body.name || !body.slug) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'name and slug are required' }), { status: 400, headers: rh })
        }
        if (body.name.length > 50) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'name must be 50 characters or less' }), { status: 400, headers: rh })
        }
        if (!/^[a-z0-9_]+$/.test(body.slug)) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'slug must be lowercase letters, numbers and underscores only' }), { status: 400, headers: rh })
        }

        const { data, error } = await supabase
          .from('venture_contexts')
          .insert({
            user_id: user.id,
            name: body.name.trim(),
            slug: body.slug.toLowerCase().trim(),
            description: body.description || null,
            icon: body.icon || null,
            color: body.color || null,
            is_system: false,  // NUNCA confiar en el body
            sort_order: body.sort_order || 99,
          })
          .select()
          .single()

        if (error) {
          if (error.code === '23505') {
            return new Response(JSON.stringify({ code: 'DUPLICATE', message: 'A context with this slug already exists' }), { status: 409, headers: rh })
          }
          return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        }
        return new Response(JSON.stringify({ data }), { status: 201, headers: rh })
      }

      // DELETE — eliminar contexto propio (no sistema)
      if (method === 'DELETE') {
        if (!contextId) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Context ID required' }), { status: 400, headers: rh })
        }

        // Verificar que no es del sistema
        const { data: ctx } = await supabase.from('venture_contexts').select('is_system, user_id').eq('id', contextId).single()
        if (!ctx) return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Context not found' }), { status: 404, headers: rh })
        if (ctx.is_system) return new Response(JSON.stringify({ code: 'FORBIDDEN', message: 'System contexts cannot be deleted' }), { status: 403, headers: rh })
        if (ctx.user_id !== user.id) return new Response(JSON.stringify({ code: 'FORBIDDEN', message: 'Cannot delete another user context' }), { status: 403, headers: rh })

        // Verificar si hay ventures asociados
        const { count } = await supabase.from('ventures').select('id', { count: 'exact', head: true }).eq('context_id', contextId)
        if (count && count > 0) {
          return new Response(JSON.stringify({ code: 'CONFLICT', message: `Cannot delete: ${count} venture(s) still use this context. Reassign them first.` }), { status: 409, headers: rh })
        }

        const { error } = await supabase.from('venture_contexts').delete().eq('id', contextId)
        if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        return new Response(JSON.stringify({ message: 'Context deleted' }), { status: 200, headers: rh })
      }
    }

    // ================================================================
    // CATEGORIES: /user-settings/categories
    // ================================================================
    if (path.includes('categories')) {
      const parts = path.split('/').filter(Boolean)
      const categoryId = parts[parts.length - 1] !== 'categories' ? parts[parts.length - 1] : null

      // GET — listar categorías del sistema + propias, con filtros
      if (method === 'GET') {
        let query = supabase
          .from('transaction_categories')
          .select('*')
          .or(`user_id.is.null,user_id.eq.${user.id}`)
          .order('accounting_type')
          .order('name')

        const contextSlug = url.searchParams.get('context_slug')
        const direction = url.searchParams.get('direction')

        if (contextSlug) {
          // Filtrar: categorías cuyo context_slugs contiene el slug, O es vacío (aplica a todos)
          query = query.or(`context_slugs.cs.{${contextSlug}},context_slugs.eq.{}`)
        }
        if (direction && ['income', 'expense'].includes(direction)) {
          query = query.or(`transaction_direction.eq.${direction},transaction_direction.eq.both`)
        }

        const { data, error } = await query
        if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        return new Response(JSON.stringify({ data }), { status: 200, headers: rh })
      }

      // POST — crear categoría personalizada
      if (method === 'POST') {
        const body = await req.json()
        if (!body.name || !body.accounting_type) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'name and accounting_type are required' }), { status: 400, headers: rh })
        }
        if (body.name.length > 50) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'name must be 50 characters or less' }), { status: 400, headers: rh })
        }
        if (!['income', 'expense', 'capital'].includes(body.accounting_type)) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'accounting_type must be income, expense, or capital' }), { status: 400, headers: rh })
        }

        const txDirection = body.transaction_direction || 'both'
        if (!['income', 'expense', 'both'].includes(txDirection)) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'transaction_direction must be income, expense, or both' }), { status: 400, headers: rh })
        }

        const { data, error } = await supabase
          .from('transaction_categories')
          .insert({
            user_id: user.id,
            name: body.name.trim(),
            accounting_type: body.accounting_type,
            icon: body.icon || null,
            color: body.color || null,
            is_system: false,
            context_slugs: Array.isArray(body.context_slugs) ? body.context_slugs : [],
            scope: body.scope || 'global',
            transaction_direction: txDirection,
          })
          .select()
          .single()

        if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        return new Response(JSON.stringify({ data }), { status: 201, headers: rh })
      }

      // DELETE — eliminar categoría propia (no sistema)
      if (method === 'DELETE') {
        if (!categoryId) {
          return new Response(JSON.stringify({ code: 'VALIDATION_ERROR', message: 'Category ID required' }), { status: 400, headers: rh })
        }

        // Verificar que no es del sistema
        const { data: cat } = await supabase.from('transaction_categories').select('is_system, user_id').eq('id', categoryId).single()
        if (!cat) return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Category not found' }), { status: 404, headers: rh })
        if (cat.is_system) return new Response(JSON.stringify({ code: 'FORBIDDEN', message: 'System categories cannot be deleted' }), { status: 403, headers: rh })
        if (cat.user_id !== user.id) return new Response(JSON.stringify({ code: 'FORBIDDEN', message: 'Cannot delete another user category' }), { status: 403, headers: rh })

        // Verificar transacciones asociadas
        const { count } = await supabase.from('transactions').select('id', { count: 'exact', head: true }).eq('category_id', categoryId)
        if (count && count > 0) {
          return new Response(JSON.stringify({ code: 'CONFLICT', message: `Cannot delete: ${count} transaction(s) still use this category.` }), { status: 409, headers: rh })
        }

        const { error } = await supabase.from('transaction_categories').delete().eq('id', categoryId)
        if (error) return new Response(JSON.stringify({ code: 'DB_ERROR', message: error.message }), { status: 500, headers: rh })
        return new Response(JSON.stringify({ message: 'Category deleted' }), { status: 200, headers: rh })
      }
    }

    return new Response(JSON.stringify({ code: 'NOT_FOUND', message: 'Use /user-settings/integrations, /user-settings/keywords, /user-settings/contexts, or /user-settings/categories' }), { status: 404, headers: rh })
  } catch (err) {
    console.error('[UserSettings] Error:', err)
    return new Response(JSON.stringify({ code: 'INTERNAL_ERROR', message: 'Unexpected error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
