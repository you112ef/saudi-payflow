'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ProviderButton from '@/components/providers/provider-button'
import ProgressBar from '@/components/providers/progress-bar'
import TamaraLogo from '@/components/providers/tamara-logo'
import TabbyLogo from '@/components/providers/tabby-logo'
import { Payment, PaymentProvider } from '@/types/payment'
import { ShoppingBag } from 'lucide-react'

export default function PaymentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const provider = params.provider as PaymentProvider
  const uuid = params.uuid as string

  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayment()
  }, [uuid])

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

  const handleContinue = () => {
    router.push(`/payment/${provider}/${uuid}/recipient`)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          {provider === 'tamara' ? <TamaraLogo /> : <TabbyLogo />}
        </div>

        <ProgressBar provider={provider} currentStep={1} totalSteps={4} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ShoppingBag className="w-5 h-5" />
                تفاصيل الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">طلب دفع</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {payment.order_id || `طلب رقم ${uuid.substring(0, 8)}`}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">المبلغ الإجمالي</span>
                  <span className="text-2xl font-bold">
                    {payment.amount.toFixed(2)} {payment.currency}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p>هذه عملية تجريبية لمحاكاة تجربة الدفع فقط</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <ProviderButton
              provider={provider}
              onClick={handleContinue}
              className="w-full h-12 text-lg"
            >
              متابعة إلى بيانات المستلم
            </ProviderButton>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
