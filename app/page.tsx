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
  const [selectedDesign, setSelectedDesign] = useState<'default' | 'minimal' | 'premium' | 'dark'>('premium')

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
          design: selectedDesign,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Save to localStorage
        clientStorage.setPayment(data.data)

        // Update recent links
        setRecentLinks(clientStorage.getPayments().slice(0, 5))

        // Show success with link
        alert(`تم إنشاء الرابط بنجاح!\n\nالرابط: ${data.data.payment_url}\n\nالتصميم: ${selectedDesign}`)

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-tamara">
            SaudiPayFlow
          </h1>
          <p className="text-lg text-gray-600 font-arabic">
            إنشاء روابط دفع منفصلة لتمارا وتابي
          </p>
        </motion.div>

        <Card className="mb-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-tamara">إنشاء رابط دفع جديد</CardTitle>
            <CardDescription className="font-arabic">
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

            <div className="space-y-2">
              <Label>اختر تصميم رابط الدفع</Label>
              <div className="relative">
                <select
                  value={selectedDesign}
                  onChange={(e) => setSelectedDesign(e.target.value as any)}
                  className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:border-tamara focus:ring-2 focus:ring-tamara/20 bg-white appearance-none cursor-pointer font-arabic"
                >
                  <option value="premium" className="font-arabic">✨ ثيم بريميوم - ألوان متدرجة متقدمة</option>
                  <option value="default" className="font-arabic">🎨 ثيم افتراضي - تصميم نظيف وبسيط</option>
                  <option value="minimal" className="font-arabic">⚪ ثيم مينيمال - أقل قدر من التفاصيل</option>
                  <option value="dark" className="font-arabic">🌙 ثيم داكن - للاستخدام الليلي</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-arabic">
                سيتم تطبيق التصميم المحدد على رابط الدفع
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-tamara/5 to-tamara-light/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-4 relative">
                <div className="mx-auto w-32 h-32 bg-tamara-gradient rounded-2xl flex items-center justify-center mb-4 shadow-2xl transform group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="tamara-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                          <circle cx="10" cy="10" r="2" fill="white"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#tamara-pattern)" />
                    </svg>
                  </div>
                  <div className="text-4xl font-bold text-white font-tamara relative z-10">تمارا</div>
                </div>
                <CardTitle className="font-tamara text-2xl text-tamara-dark">دفع مع تمارا</CardTitle>
                <CardDescription className="font-arabic text-gray-600">
                  ادفع لاحقاً أو بأقساط مريحة
                </CardDescription>

                {/* Features */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-tamara" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-arabic">تقسيط حتى 12 شهر</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-tamara" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-arabic">بدون فوائد</span>
                  </div>
                </div>
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
            <Card className="h-full shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-tabby/5 to-tabby-light/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="text-center pb-4 relative">
                <div className="mx-auto w-32 h-32 bg-tabby-green rounded-full flex items-center justify-center mb-4 shadow-tabby transform group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="tabby-pattern" width="15" height="15" patternUnits="userSpaceOnUse">
                          <rect x="0" y="0" width="15" height="15" fill="none"/>
                          <circle cx="7.5" cy="7.5" r="2" fill="white"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#tabby-pattern)" />
                    </svg>
                  </div>
                  <div className="text-4xl font-bold text-tabby-dark font-tabby relative z-10">تابي</div>
                </div>
                <CardTitle className="font-tabby text-2xl text-tabby-dark">دفع مع تابي</CardTitle>
                <CardDescription className="font-arabic text-gray-600">
                  اشتري الآن وادفع لاحقاً
                </CardDescription>

                {/* Features */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-tabby-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-arabic">دفع سريع وآمن</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-tabby-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-arabic">موافقة فورية</span>
                  </div>
                </div>
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
