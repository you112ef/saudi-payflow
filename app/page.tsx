'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ProviderButton from '@/components/providers/provider-button'
import { clientStorage } from '@/lib/storage'
import { Copy, Link as LinkIcon } from 'lucide-react'

export default function Home() {
  const [amount, setAmount] = useState('')
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [recentLinks, setRecentLinks] = useState<any[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    // Load recent links from localStorage
    setRecentLinks(clientStorage.getPayments().slice(0, 5))
  }, [])

  const createPayment = async (provider: 'tamara' | 'tabby') => {
    if (!amount) {
      alert('يرجى إدخال المبلغ')
      return
    }

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          amount: parseFloat(amount),
          currency: 'SAR',
          customer_name: productName,
          order_id: `${provider.toUpperCase()}_${Date.now()}`,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Save to localStorage
        clientStorage.setPayment(data.data)

        // Update recent links
        setRecentLinks(clientStorage.getPayments().slice(0, 5))

        // Show success with link
        alert(`تم إنشاء الرابط بنجاح!\n\nالرابط: ${data.data.payment_url}`)

        // Reset form
        setAmount('')
        setProductName('')
        setProductDescription('')
      }
    } catch (error) {
      console.error('Error creating payment:', error)
      alert('حدث خطأ أثناء إنشاء الرابط')
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
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
            إنشاء روابط دفع منفصلة لتمارا وتابي
          </p>
        </motion.div>

        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">إنشاء رابط دفع جديد</CardTitle>
            <CardDescription>
              املأ بيانات المنتج لإنشاء رابط دفع قابل للمشاركة
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

        <div className="grid md:grid-cols-2 gap-6 mb-8">
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

        {recentLinks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <LinkIcon className="w-5 h-5" />
                  الروابط الحديثة
                </CardTitle>
                <CardDescription>
                  آخر 5 روابط دفع تم إنشاؤها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              link.provider === 'tamara'
                                ? 'bg-tamara/10 text-tamara'
                                : 'bg-tabby/10 text-tabby'
                            }`}
                          >
                            {link.provider === 'tamara' ? 'تمارا' : 'تابي'}
                          </span>
                          <span className="text-sm text-gray-600">
                            {link.amount} {link.currency}
                          </span>
                        </div>
                        <p className="text-sm font-mono text-gray-800 break-all">
                          {link.payment_url}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(link.payment_url, link.id)}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                        title="نسخ الرابط"
                      >
                        {copied === link.id ? (
                          <span className="text-green-600 text-xs">تم!</span>
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

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
