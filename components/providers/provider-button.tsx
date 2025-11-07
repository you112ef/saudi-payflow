'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { PaymentProvider } from '@/types/payment'
import { cn } from '@/lib/utils/cn'

interface ProviderButtonProps {
  provider: PaymentProvider
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}

export default function ProviderButton({
  provider,
  children,
  onClick,
  type = 'button',
  disabled = false,
  className
}: ProviderButtonProps) {
  // Real Tamara Design: Gradient purple to pink, rounded buttons
  const tamaraClasses = "h-12 px-8 rounded-lg font-semibold text-white shadow-lg font-tamara"

  // Real Tabby Design: Pill-shaped (24px radius), neon green, subtle shadow
  const tabbyClasses = "h-12 px-8 rounded-[24px] font-semibold text-tabby-dark font-tabby shadow-tabby border border-tabby-green hover:shadow-tabby-lg transition-all duration-300"

  const providerClasses =
    provider === 'tamara'
      ? 'bg-tamara-gradient hover:opacity-90'
      : 'bg-tabby-green hover:bg-tabby-light active:scale-95'

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(provider === 'tamara' ? tamaraClasses : tabbyClasses, providerClasses, className)}
    >
      <Button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-full h-full",
          provider === 'tamara'
            ? "bg-transparent font-tamara"
            : "bg-transparent font-tabby"
        )}
      >
        {children}
      </Button>
    </motion.div>
  )
}
