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
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className={`absolute inset-0 ${isTamara ? 'bg-tamara-gradient' : 'bg-tabby-green'} rounded-full opacity-20 animate-ping`}></div>
              <div className={`relative w-full h-full ${isTamara ? 'bg-tamara-gradient' : 'bg-tabby-green'} rounded-full flex items-center justify-center shadow-2xl`}>
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
            </div>
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-4xl font-bold mb-2 ${isTamara ? 'text-tamara-dark' : 'text-tabby-dark'} font-${isTamara ? 'tamara' : 'tabby'}`}
          >
            تم الدفع بنجاح! 🎉
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-600 mb-6 font-arabic"
          >
            شكراً لك على ثقتك
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg p-4 shadow-lg mb-6"
          >
            <p className="text-sm text-gray-500 font-arabic">رقم الطلب</p>
            <p className="text-lg font-mono font-tabby">{payment.order_id}</p>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              onClick={() => router.push('/')}
              className={`${isTamara ? 'bg-tamara-gradient hover:opacity-90' : 'bg-tabby-green hover:bg-tabby-light'} text-white font-${isTamara ? 'tamara' : 'tabby'} px-8 py-3 rounded-lg font-semibold transition-all`}
            >
              العودة للرئيسية
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  const isTamara = payment.provider === 'tamara'
  const Logo = isTamara ? TamaraLogo : TabbyLogo

  return (
    <div className={`min-h-screen ${isTamara ? 'bg-gradient-to-br from-purple-50 via-white to-pink-50' : 'bg-gradient-to-br from-green-50 via-white to-blue-50'} py-8 px-4`}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Logo />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-6"
        >
          <h2 className={`text-3xl font-bold mb-2 ${isTamara ? 'text-tamara-dark' : 'text-tabby-dark'} font-${isTamara ? 'tamara' : 'tabby'}`}>
            {isTamara ? 'دفع مع تمارا' : 'دفع مع تابي'}
          </h2>
          <p className="text-gray-600 font-arabic">رابط دفع آمن ومشفر</p>
        </motion.div>

        {step === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-2xl border-0 overflow-hidden">
              <div className={`h-2 ${isTamara ? 'bg-tamara-gradient' : 'bg-tabby-gradient'}`}></div>
              <CardHeader className="bg-white">
                <CardTitle className={`flex items-center gap-2 text-xl ${isTamara ? 'text-tamara-dark' : 'text-tabby-dark'} font-${isTamara ? 'tamara' : 'tabby'}`}>
                  <CreditCard className={`w-5 h-5 ${isTamara ? 'text-tamara' : 'text-tabby-green'}`} />
                  تفاصيل الطلب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Product Image Placeholder */}
                <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl group">
                  {/* Background with pattern */}
                  <div className={`absolute inset-0 ${isTamara ? 'bg-tamara-gradient' : 'bg-tabby-gradient'} opacity-90`}></div>

                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex items-center justify-center">
                    <div className="text-center text-white">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-4"
                      >
                        {isTamara ? (
                          <svg className="w-24 h-24 mx-auto opacity-90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="45" fill="white" opacity="20"/>
                            <path d="M30 50h40M30 40h40M30 60h40" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                            <circle cx="35" cy="50" r="3" fill="white"/>
                            <circle cx="50" cy="50" r="3" fill="white"/>
                            <circle cx="65" cy="50" r="3" fill="white"/>
                          </svg>
                        ) : (
                          <svg className="w-24 h-24 mx-auto opacity-90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="25" y="35" width="50" height="35" rx="5" fill="white" opacity="20"/>
                            <rect x="30" y="45" width="40" height="3" fill="white" opacity="0.6"/>
                            <rect x="30" y="52" width="30" height="3" fill="white" opacity="0.6"/>
                            <rect x="30" y="59" width="25" height="3" fill="white" opacity="0.6"/>
                            <circle cx="50" cy="30" r="8" fill="white" opacity="30"/>
                          </svg>
                        )}
                      </motion.div>
                      <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className={`font-${isTamara ? 'tamara' : 'tabby'} text-2xl font-semibold mb-2`}
                      >
                        {isTamara ? 'تمارا باي' : 'تابي باي'}
                      </motion.p>
                      <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="font-arabic text-sm opacity-80"
                      >
                        متجر إلكتروني آمن
                      </motion.p>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-4 right-4"
                  >
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-4 left-4"
                  >
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.div>
                </div>

                {/* Order Details */}
                <div className={`p-6 ${isTamara ? 'bg-purple-50' : 'bg-green-50'} rounded-xl border ${isTamara ? 'border-tamara/20' : 'border-tabby/20'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-gray-700 font-arabic">المبلغ الإجمالي</span>
                    <span className={`text-3xl font-bold ${isTamara ? 'text-tamara' : 'text-tabby-dark'} font-${isTamara ? 'tamara' : 'tabby'}`}>
                      {payment.amount.toFixed(2)} {payment.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-arabic">رقم الطلب</span>
                    <span className="font-mono font-tabby text-tabby-dark">{payment.order_id}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className={`${isTamara ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'} border rounded-xl p-4 flex items-center gap-3`}>
                  <div className={`w-10 h-10 ${isTamara ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center`}>
                    <svg className={`w-5 h-5 ${isTamara ? 'text-blue-600' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${isTamara ? 'text-blue-800' : 'text-green-800'} font-arabic`}>دفع آمن ومشفر</p>
                    <p className={`text-xs ${isTamara ? 'text-blue-600' : 'text-green-600'} font-arabic`}>حماية SSL 256-bit</p>
                  </div>
                </div>

                <div className={`bg-gradient-to-r ${isTamara ? 'from-purple-100 to-pink-100' : 'from-green-100 to-blue-100'} border ${isTamara ? 'border-purple-200' : 'border-green-200'} rounded-xl p-4`}>
                  <p className={`text-sm ${isTamara ? 'text-purple-700' : 'text-green-700'} text-center font-arabic`}>
                    💡 هذه عملية تجريبية - لا يتم خصم أي مبلغ
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleNext}
                    className={`w-full h-14 text-lg font-semibold ${isTamara ? 'bg-tamara-gradient hover:opacity-90 text-white' : 'bg-tabby-green hover:bg-tabby-light text-tabby-dark shadow-tabby'} rounded-lg font-${isTamara ? 'tamara' : 'tabby'} transition-all duration-300 shadow-lg`}
                  >
                    متابعة إلى بيانات المستلم
                  </Button>
                </motion.div>
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
            <Card className="shadow-2xl border-0 overflow-hidden">
              <div className={`h-2 ${isTamara ? 'bg-tamara-gradient' : 'bg-tabby-gradient'}`}></div>
              <CardHeader className="bg-white">
                <CardTitle className={`flex items-center gap-2 text-xl ${isTamara ? 'text-tamara-dark' : 'text-tabby-dark'} font-${isTamara ? 'tamara' : 'tabby'}`}>
                  <User className={`w-5 h-5 ${isTamara ? 'text-tamara' : 'text-tabby-green'}`} />
                  بيانات المستلم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-arabic font-semibold">الاسم الكامل</Label>
                  <Input
                    id="name"
                    placeholder="مثال: عبدالله أحمد"
                    className={`h-12 ${isTamara ? 'border-tamara/30 focus:border-tamara' : 'border-tabby-gray focus:border-tabby-green'} font-arabic`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-arabic font-semibold">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className={`h-12 ${isTamara ? 'border-tamara/30 focus:border-tamara' : 'border-tabby-gray focus:border-tabby-green'} font-tabby`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-arabic font-semibold">رقم الجوال</Label>
                  <Input
                    id="phone"
                    placeholder="+966 5X XXX XXXX"
                    className={`h-12 ${isTamara ? 'border-tamara/30 focus:border-tamara' : 'border-tabby-gray focus:border-tabby-green'} font-tabby`}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700 font-arabic font-semibold">العنوان</Label>
                  <Input
                    id="address"
                    placeholder="المدينة، الحي، الشارع"
                    className={`h-12 ${isTamara ? 'border-tamara/30 focus:border-tamara' : 'border-tabby-gray focus:border-tabby-green'} font-arabic`}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className={`w-full h-12 font-${isTamara ? 'tamara' : 'tabby'} ${isTamara ? 'border-tamara/30 text-tamara hover:bg-tamara/5' : 'border-tabby-gray text-tabby-dark hover:bg-tabby/5'}`}
                    >
                      رجوع
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleNext}
                      className={`w-full h-12 text-lg font-semibold ${isTamara ? 'bg-tamara-gradient hover:opacity-90 text-white' : 'bg-tabby-green hover:bg-tabby-light text-tabby-dark shadow-tabby'} rounded-lg font-${isTamara ? 'tamara' : 'tabby'} transition-all duration-300 shadow-lg`}
                    >
                      متابعة إلى بيانات البطاقة
                    </Button>
                  </motion.div>
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
            <Card className="shadow-2xl border-0 overflow-hidden">
              <div className={`h-2 ${isTamara ? 'bg-tamara-gradient' : 'bg-tabby-gradient'}`}></div>
              <CardHeader className="bg-white">
                <CardTitle className={`flex items-center gap-2 text-xl ${isTamara ? 'text-tamara-dark' : 'text-tabby-dark'} font-${isTamara ? 'tamara' : 'tabby'}`}>
                  <CreditCard className={`w-5 h-5 ${isTamara ? 'text-tamara' : 'text-tabby-green'}`} />
                  بيانات البطاقة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Credit Card Preview */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`relative h-48 rounded-2xl overflow-hidden ${isTamara ? 'bg-tamara-gradient' : 'bg-gradient-to-br from-tabby-green to-tabby-light'} shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300`}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative p-6 h-full flex flex-col justify-between text-white">
                    <div className="flex justify-between items-start">
                      <div className={`text-xs font-tabby opacity-90`}>
                        {isTamara ? 'TAMARA' : 'TABBY'}
                      </div>
                      <div className={`text-xs font-${isTamara ? 'tamara' : 'tabby'} font-semibold`}>
                        {isTamara ? 'تمارا' : 'تابي'}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="text-2xl font-mono tracking-wider">
                        {formData.cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-70 font-arabic">حامل البطاقة</div>
                          <div className="text-sm font-tamara">
                            {formData.name || 'الاسم الكامل'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs opacity-70 font-arabic">صالح حتى</div>
                          <div className="text-sm font-mono">
                            {formData.expiry || 'MM/YY'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20" cy="20" r="18" fill="white" opacity="0.3"/>
                      <path d="M12 20h16M16 16h8M16 24h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </motion.div>

                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="text-gray-700 font-arabic font-semibold">رقم البطاقة</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`h-12 ${isTamara ? 'border-tamara/30 focus:border-tamara' : 'border-tabby-gray focus:border-tabby-green'} font-mono text-lg tracking-wider`}
                    value={formData.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\D/g, '') })}
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="text-gray-700 font-arabic font-semibold">تاريخ الانتهاء</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`h-12 ${isTamara ? 'border-tamara/30 focus:border-tamara' : 'border-tabby-gray focus:border-tabby-green'} font-mono`}
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
                    <Label htmlFor="cvv" className="text-gray-700 font-arabic font-semibold">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      maxLength={3}
                      className={`h-12 ${isTamara ? 'border-tamara/30 focus:border-tamara' : 'border-tabby-gray focus:border-tabby-green'} font-mono`}
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>

                {/* Security Badges */}
                <div className={`${isTamara ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'} border rounded-xl p-4`}>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <svg className={`w-5 h-5 ${isTamara ? 'text-blue-600' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className={`text-sm font-semibold ${isTamara ? 'text-blue-800' : 'text-green-800'} font-arabic`}>256-bit SSL</span>
                    </div>
                    <div className={`w-1 h-1 rounded-full ${isTamara ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                    <div className="flex items-center gap-2">
                      <svg className={`w-5 h-5 ${isTamara ? 'text-blue-600' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className={`text-sm font-semibold ${isTamara ? 'text-blue-800' : 'text-green-800'} font-arabic`}>آمن 100%</span>
                    </div>
                    <div className={`w-1 h-1 rounded-full ${isTamara ? 'bg-blue-400' : 'bg-green-400'}`}></div>
                    <div className="flex items-center gap-2">
                      <svg className={`w-5 h-5 ${isTamara ? 'text-blue-600' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className={`text-sm font-semibold ${isTamara ? 'text-blue-800' : 'text-green-800'} font-arabic`}>PCI Compliant</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className={`w-full h-12 font-${isTamara ? 'tamara' : 'tabby'} ${isTamara ? 'border-tamara/30 text-tamara hover:bg-tamara/5' : 'border-tabby-gray text-tabby-dark hover:bg-tabby/5'}`}
                    >
                      رجوع
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleNext}
                      className={`w-full h-12 text-lg font-semibold ${isTamara ? 'bg-tamara-gradient hover:opacity-90 text-white' : 'bg-tabby-green hover:bg-tabby-light text-tabby-dark shadow-tabby'} rounded-lg font-${isTamara ? 'tamara' : 'tabby'} transition-all duration-300 shadow-lg`}
                    >
                      تأكيد الدفع
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
