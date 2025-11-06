import { Payment } from '@/types/payment'

const STORAGE_KEY = 'saudi_payflow_payments'

// In-memory storage for server-side
let serverPayments: Map<string, Payment> = new Map()

export interface PaymentLink {
  id: string
  provider: 'tamara' | 'tabby'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'cancelled'
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  customer_address?: string
  order_id?: string
  created_at: string
  updated_at: string
  payment_url: string
}

// Client-side storage
export const clientStorage = {
  getPayments: (): PaymentLink[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  },

  setPayment: (payment: PaymentLink) => {
    if (typeof window === 'undefined') return
    const payments = clientStorage.getPayments()
    const existingIndex = payments.findIndex(p => p.id === payment.id)

    if (existingIndex >= 0) {
      payments[existingIndex] = payment
    } else {
      payments.push(payment)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payments))
  },

  getPayment: (id: string): PaymentLink | null => {
    const payments = clientStorage.getPayments()
    return payments.find(p => p.id === id) || null
  },

  getPaymentsByProvider: (provider: 'tamara' | 'tabby'): PaymentLink[] => {
    return clientStorage.getPayments().filter(p => p.provider === provider)
  },

  updatePaymentStatus: (id: string, status: PaymentLink['status']) => {
    const payment = clientStorage.getPayment(id)
    if (payment) {
      payment.status = status
      payment.updated_at = new Date().toISOString()
      clientStorage.setPayment(payment)
    }
  }
}

// Server-side storage
export const serverStorage = {
  setPayment: (payment: PaymentLink) => {
    serverPayments.set(payment.id, payment)
  },

  getPayment: (id: string): PaymentLink | null => {
    return serverPayments.get(id) || null
  },

  getAllPayments: (): PaymentLink[] => {
    return Array.from(serverPayments.values())
  },

  updatePayment: (id: string, updates: Partial<PaymentLink>) => {
    const payment = serverPayments.get(id)
    if (payment) {
      const updated = { ...payment, ...updates, updated_at: new Date().toISOString() }
      serverPayments.set(id, updated)
      return updated
    }
    return null
  },

  clearAll: () => {
    serverPayments.clear()
  }
}

// Export for API routes
export const getStorage = () => {
  return typeof window === 'undefined' ? serverStorage : clientStorage
}
