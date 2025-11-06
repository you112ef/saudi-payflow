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
  const baseClasses = "h-12 px-8 rounded-lg font-semibold text-white shadow-lg"

  const providerClasses =
    provider === 'tamara'
      ? 'bg-tamara hover:bg-tamara-dark'
      : 'bg-gradient-to-r from-tabby-light to-tabby hover:from-tabby hover:to-tabby-dark'

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cn(baseClasses, providerClasses, className)}
      >
        {children}
      </Button>
    </motion.div>
  )
}
