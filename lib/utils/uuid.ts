import { v4 as uuidv4 } from 'uuid'

export function generateUUID(): string {
  return uuidv4()
}

export function generateOrderId(provider: 'tamara' | 'tabby'): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `${provider}_${timestamp}_${random}`
}
