// backend/_shared/whatsapp.ts
// ─────────────────────────────────────────────────────────────────────────────
// Helpers para la integración multi-tenant de WhatsApp Business API.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verifica la firma HMAC SHA-256 del webhook de Meta.
 * Retorna false si la firma no coincide → el request no es de Meta.
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  appSecret: string
): Promise<boolean> {
  if (!signature || !signature.startsWith('sha256=')) {
    return false
  }

  const expectedSig = signature.slice(7) // quitar 'sha256='

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(appSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const computedSig = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return computedSig === expectedSig
}

/**
 * Descarga un archivo de media desde la Graph API de Meta.
 * Retorna el ArrayBuffer del archivo + su MIME type.
 */
export async function downloadMedia(
  mediaId: string,
  accessToken: string
): Promise<{ buffer: ArrayBuffer; mimeType: string } | null> {
  try {
    // Paso 1: obtener la URL de descarga
    const urlResponse = await fetch(
      `https://graph.facebook.com/v21.0/${mediaId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )

    if (!urlResponse.ok) {
      console.error('[WhatsApp] Failed to get media URL:', urlResponse.status)
      return null
    }

    const { url, mime_type } = await urlResponse.json()

    // Paso 2: descargar el archivo binario
    const mediaResponse = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!mediaResponse.ok) {
      console.error('[WhatsApp] Failed to download media:', mediaResponse.status)
      return null
    }

    const buffer = await mediaResponse.arrayBuffer()
    return { buffer, mimeType: mime_type }
  } catch (err) {
    console.error('[WhatsApp] downloadMedia error:', err)
    return null
  }
}

// ── Tipos del payload de WhatsApp ──────────────────────────────────────────

export interface WhatsAppWebhookPayload {
  object: string
  entry: WhatsAppEntry[]
}

export interface WhatsAppEntry {
  id: string
  changes: WhatsAppChange[]
}

export interface WhatsAppChange {
  value: {
    messaging_product: string
    metadata: {
      display_phone_number: string
      phone_number_id: string
    }
    messages?: WhatsAppMessage[]
  }
  field: string
}

export interface WhatsAppMessage {
  from: string
  id: string
  timestamp: string
  type: 'text' | 'image' | 'document' | 'audio' | 'video'
  text?: { body: string }
  image?: {
    id: string
    mime_type: string
    caption?: string
  }
}

// ── Parser de keywords ──────────────────────────────────────────────────────

export interface ParsedTransaction {
  type: 'income' | 'expense'
  amount: number
  description: string
}

/**
 * Parsea un mensaje de WhatsApp buscando keywords conocidas.
 * Formato esperado: "{keyword} {monto} {descripción}"
 * Ejemplo: "gasto 500 renta casa" → { type: 'expense', amount: 500, description: 'renta casa' }
 */
export function parseMessageWithKeywords(
  message: string,
  keywords: Array<{ keyword: string; maps_to: 'income' | 'expense' }>
): ParsedTransaction | null {
  const text = message.trim().toLowerCase()

  for (const kw of keywords) {
    if (text.startsWith(kw.keyword.toLowerCase())) {
      const rest = text.slice(kw.keyword.length).trim()

      // Buscar el monto (primer número en el texto restante)
      const amountMatch = rest.match(/^(\d+(?:\.\d{1,2})?)/)
      if (!amountMatch) continue

      const amount = parseFloat(amountMatch[1])
      if (isNaN(amount) || amount <= 0) continue

      const description = rest.slice(amountMatch[0].length).trim()

      return {
        type: kw.maps_to,
        amount,
        description: description || `${kw.keyword} via WhatsApp`,
      }
    }
  }

  return null
}
