'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { PaymentProvider } from '@/types/payment'

interface OtpInputProps {
  provider: PaymentProvider
  length?: number
  onComplete: (otp: string) => void
}

export default function OtpInput({ provider, length = 6, onComplete }: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < length - 1) {
      setActiveIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((digit) => digit !== '')) {
      onComplete(newOtp.join(''))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      setActiveIndex(index - 1)
      inputRefs.current[index - 1]?.focus()
    }
  }

  const inputClass =
    provider === 'tamara'
      ? 'w-12 h-12 text-center text-xl font-bold border-2 border-tamara rounded-lg focus:border-tamara-dark focus:ring-2 focus:ring-tamara/20'
      : 'w-12 h-12 text-center text-xl font-bold border-2 border-tabby-light rounded-xl bg-white/10 backdrop-blur-sm focus:border-tabby focus:ring-2 focus:ring-tabby/20 focus:bg-white/20'

  return (
    <div className="flex justify-center gap-2 space-x-reverse">
      {otp.map((digit, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Input
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={inputClass}
          />
        </motion.div>
      ))}
    </div>
  )
}
