'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { clientStorage } from '@/lib/storage'
import TamaraLogo from '@/components/providers/tamara-logo'
import TabbyLogo from '@/components/providers/tabby-logo'
import { CheckCircle2, CreditCard, User } from 'lucide-react'

export default function PaymentLinkPage() {
  const params = useParams()
  const router = useRouter()
  const uuid = params.uuid as string

  const [payment, setPayment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'details' | 'customer' | 'card' | 'success'>('details')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  useEffect(() => {
    // Try to get from localStorage first (client-side)
    if (typeof window !== 'undefined') {
      const localPayment = clientStorage.getPayment(uuid)
      if (localPayment) {
        setPayment(localPayment)
        setLoading(false)
        return
      }
    }

    // If not found locally, try API
    fetchPayment()
  }, [uuid])

  const fetchPayment = async () => {
    try {
      const response = await fetch(`/api/payments/${uuid}`)
      const data = await response.json()

      if (data.success) {
        setPayment(data.data)
        // Save to localStorage
        clientStorage.setPayment(data.data)
      } else {
        alert('الرابط غير صحيح')
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching payment:', error)
      alert('حدث خطأ')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (step === 'details') setStep('customer')
    else if (step === 'customer') setStep('card')
    else if (step === 'card') {
      // Simulate payment
      clientStorage.updatePaymentStatus(uuid, 'completed')
      setStep('success')
      // Update local state
      if (payment) {
        setPayment({ ...payment, status: 'completed' })
      }
    }
  }

  const handleBack = () => {
    if (step === 'customer') setStep('details')
    else if (step === 'card') setStep('customer')
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

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-8 px-4">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="text-center max-w-md mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <CheckCircle2 className="w-24 h-24 text-green-600 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-4xl font-bold text-green-700 mb-2">تم الدفع بنجاح!</h1>
          <p className="text-lg text-green-600 mb-6">شكراً لك على ثقتك</p>
          <p className="text-sm text-gray-600">
            رقم الطلب: {payment.order_id}
          </p>
          <Button
            onClick={() => router.push('/')}
            className="mt-6"
          >
            العودة للرئيسية
          </Button>
        </motion.div>
      </div>
    )
  }

  const isTamara = payment.provider === 'tamara'
  const Logo = isTamara ? TamaraLogo : TabbyLogo

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Logo />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isTamara ? 'دفع مع تمارا' : 'دفع مع تابي'}
          </h2>
          <p className="text-gray-600">رابط دفع آمن ومشفر</p>
        </div>

        {step === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  تفاصيل الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">المبلغ الإجمالي</span>
                    <span className="text-2xl font-bold">
                      {payment.amount.toFixed(2)} {payment.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>رقم الطلب</span>
                    <span className="font-mono">{payment.order_id}</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700 text-center">
                    هذه عملية تجريبية - لا يتم خصم أي مبلغ
                  </p>
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full h-12 text-lg"
                  style={{
                    backgroundColor: isTamara ? '#00b496' : '#6f4df5',
                  }}
                >
                  متابعة
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'customer' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  بيانات المستلم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    placeholder="مثال: عبدالله أحمد"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الجوال</Label>
                  <Input
                    id="phone"
                    placeholder="+966 5X XXX XXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    placeholder="المدينة، الحي، الشارع"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 h-12"
                  >
                    رجوع
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 h-12"
                    style={{
                      backgroundColor: isTamara ? '#00b496' : '#6f4df5',
                    }}
                  >
                    متابعة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 'card' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  بيانات البطاقة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700 text-center">
                    مشفر باستخدام 256-bit SSL - آمن 100%
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1 h-12"
                  >
                    رجوع
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 h-12"
                    style={{
                      backgroundColor: isTamara ? '#00b496' : '#6f4df5',
                    }}
                  >
                    تأكيد الدفع
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
