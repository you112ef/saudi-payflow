'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { PaymentProvider } from '@/types/payment'

interface ProgressBarProps {
  provider: PaymentProvider
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ provider, currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100

  if (provider === 'tamara') {
    return (
      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>الخطوة {currentStep} من {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-tamara rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    )
  }

  if (provider === 'tabby') {
    return (
      <div className="flex items-center justify-center space-x-3 space-x-reverse">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex items-center">
            <motion.div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold",
                i < currentStep
                  ? "bg-tabby text-white"
                  : "bg-gray-200 text-gray-600"
              )}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              {i + 1}
            </motion.div>
            {i < totalSteps - 1 && (
              <div
                className={cn(
                  "w-12 h-1 mx-2",
                  i < currentStep - 1 ? "bg-tabby" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  return null
}
