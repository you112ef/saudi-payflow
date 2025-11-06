export type PaymentProvider = 'tamara' | 'tabby'

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

export interface Payment {
  id: string
  provider: PaymentProvider
  amount: number
  currency: string
  status: PaymentStatus
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  customer_address?: string
  order_id?: string
  session_id?: string
  verification_code?: string
  payment_link?: string
  created_at: string
  updated_at: string
}

export interface CreatePaymentRequest {
  provider: PaymentProvider
  amount: number
  currency: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  customer_address?: string
  order_id?: string
}

export interface PaymentDetails {
  id: string
  title: string
  price: number
  description: string
  image?: string
}

export interface CustomerInfo {
  fullName: string
  email: string
  phone: string
  address: string
}

export interface CardInfo {
  number: string
  expiry: string
  cvv: string
  holderName: string
}

export interface PaymentFlow {
  step: 1 | 2 | 3 | 4
  provider: PaymentProvider
  uuid: string
  payment?: Payment
  details?: PaymentDetails
  customer?: CustomerInfo
  card?: CardInfo
}
