'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ProviderButton from '@/components/providers/provider-button'
import { generateUUID } from '@/lib/utils/uuid'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [amount, setAmount] = useState('')
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const router = useRouter()

  const createPayment = async (provider: 'tamara' | 'tabby') => {
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          amount: parseFloat(amount) || 0,
          currency: 'SAR',
          order_id: `ORDER_${Date.now()}`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/payment/${provider}/${data.data.id}/details`)
      }
    } catch (error) {
      console.error('Error creating payment:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SaudiPayFlow
          </h1>
          <p className="text-lg text-gray-600">
            منصة محاكاة واقعية لتجربة الدفع مع تمارا وتابي
          </p>
        </motion.div>

        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">إنشاء طلب دفع جديد</CardTitle>
            <CardDescription>
              املأ بيانات المنتج والعميل لإنشاء رابط دفع
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="productName">اسم المنتج</Label>
              <Input
                id="productName"
                placeholder="مثال: ساعة ذكية"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productDescription">وصف المنتج</Label>
              <Input
                id="productDescription"
                placeholder="مثال: ساعة ذكية مقاومة للماء"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">المبلغ (ريال سعودي)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="مثال: 250.75"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-24 h-24 bg-tamara/10 rounded-full flex items-center justify-center mb-4">
                  <div className="text-3xl font-bold text-tamara">تمارا</div>
                </div>
                <CardTitle>دفع مع تمارا</CardTitle>
                <CardDescription>
                  ادفع لاحقاً أو بأقساط مريحة
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProviderButton
                  provider="tamara"
                  onClick={() => createPayment('tamara')}
                  className="w-full"
                >
                  إنشاء رابط تمارا
                </ProviderButton>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-24 h-24 bg-tabby/10 rounded-full flex items-center justify-center mb-4">
                  <div className="text-3xl font-bold text-tabby">تابي</div>
                </div>
                <CardTitle>دفع مع تابي</CardTitle>
                <CardDescription>
                  اشتري الآن وادفع لاحقاً
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProviderButton
                  provider="tabby"
                  onClick={() => createPayment('tabby')}
                  className="w-full"
                >
                  إنشاء رابط تابي
                </ProviderButton>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-8"
        >
          <a
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            لوحة الإدارة
          </a>
        </motion.div>
      </div>
    </div>
  )
}
