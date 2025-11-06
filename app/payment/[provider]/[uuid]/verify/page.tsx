'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProviderButton from '@/components/providers/provider-button'
import ProgressBar from '@/components/providers/progress-bar'
import TamaraLogo from '@/components/providers/tamara-logo'
import TabbyLogo from '@/components/providers/tabby-logo'
import OtpInput from '@/components/providers/otp-input'
import { Payment, PaymentProvider } from '@/types/payment'
import { CheckCircle2, Smartphone } from 'lucide-react'

export default function VerifyPage() {
  const params = useParams()
  const router = useRouter()
  const provider = params.provider as PaymentProvider
  const uuid = params.uuid as string

  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    fetchPayment()
  }, [uuid])

  useEffect(() => {
    if (timeLeft > 0 && !success) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, success])

  const fetchPayment = async () => {
    try {
      const response = await fetch(`/api/payments/${uuid}`)
      const data = await response.json()

      if (data.success) {
        setPayment(data.data)
      }
    } catch (error) {
      console.error('Error fetching payment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (code: string) => {
    setOtp(code)

    if (code.length === 6) {
      if (code === payment?.verification_code) {
        try {
          await fetch(`/api/payments/${uuid}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'completed'
            }),
          })

          setSuccess(true)

          setTimeout(() => {
            router.push('/?success=true')
          }, 2000)
        } catch (error) {
          console.error('Error completing payment:', error)
          setError('حدث خطأ أثناء تأكيد الدفع')
        }
      } else {
        setError('رمز التحقق غير صحيح')
      }
    }
  }

  const handleResend = () => {
    setTimeLeft(60)
    setError('')
    setOtp('')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tamara mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">لم يتم العثور على الطلب</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-8 px-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <CheckCircle2 className="w-24 h-24 text-green-600 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold text-green-700 mb-2">تم الدفع بنجاح!</h1>
          <p className="text-lg text-green-600">شكراً لك على ثقتك</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          {provider === 'tamara' ? <TamaraLogo /> : <TabbyLogo />}
        </div>

        <ProgressBar provider={provider} currentStep={4} totalSteps={4} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Smartphone className="w-5 h-5" />
                رمز التحقق
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  تم إرسال رمز التحقق إلى رقم الجوال
                </p>
                <p className="font-semibold text-lg">{payment.customer_phone}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 text-center">
                  الرمز التجريبي: <span className="font-mono font-bold">{payment.verification_code}</span>
                </p>
              </div>

              <OtpInput
                provider={provider}
                length={6}
                onComplete={handleVerify}
              />

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                  >
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-sm text-gray-500">
                    يمكنك إعادة الإرسال خلال {timeLeft} ثانية
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-sm text-tamara hover:underline"
                  >
                    إعادة إرسال الرمز
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
