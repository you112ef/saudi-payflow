'use client'

import { motion } from 'framer-motion'
import { PaymentProvider } from '@/types/payment'

interface CreditCardPreviewProps {
  provider: PaymentProvider
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
}

export default function CreditCardPreview({
  provider,
  cardNumber,
  cardHolder,
  expiryDate,
  cvv
}: CreditCardPreviewProps) {
  const gradientClass =
    provider === 'tamara'
      ? 'bg-gradient-to-br from-tamara to-tamara-dark'
      : 'bg-gradient-to-br from-tabby-light to-tabby-dark'

  return (
    <motion.div
      className={`relative w-full max-w-md h-56 ${gradientClass} rounded-2xl p-6 text-white shadow-2xl mx-auto`}
      initial={{ rotateY: 0 }}
      animate={{ rotateY: 360 }}
      transition={{ duration: 0.6 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-xs opacity-80">صاحب البطاقة</p>
          <p className="text-sm font-semibold">{cardHolder || 'الاسم بالكامل'}</p>
        </div>
        <div className="text-right">
          {provider === 'tamara' ? (
            <div className="text-2xl font-bold">تمارا</div>
          ) : (
            <div className="text-2xl font-bold">تابي</div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs opacity-80">رقم البطاقة</p>
          <p className="text-xl font-mono tracking-wider">
            {cardNumber || '•••• •••• •••• ••••'}
          </p>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="text-xs opacity-80">تاريخ الانتهاء</p>
            <p className="text-sm font-semibold">{expiryDate || 'MM/YY'}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">CVV</p>
            <p className="text-sm font-semibold">{cvv || '•••'}</p>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <div className="w-12 h-8 bg-yellow-400 rounded opacity-80" />
      </div>
    </motion.div>
  )
}
