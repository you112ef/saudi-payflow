'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { clientStorage } from '@/lib/storage'
import { Search, Filter, CreditCard, CheckCircle, XCircle, Clock, DollarSign, Link as LinkIcon, Copy } from 'lucide-react'

export default function AdminPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [providerFilter, setProviderFilter] = useState<'tamara' | 'tabby' | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<'pending' | 'completed' | 'cancelled' | 'all'>('all')
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    // Load from localStorage
    const allPayments = clientStorage.getPayments()
    setPayments(allPayments)
    setLoading(false)
  }, [])

  useEffect(() => {
    // Filter payments
    let filtered = clientStorage.getPayments()

    if (providerFilter !== 'all') {
      filtered = filtered.filter(p => p.provider === providerFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        (p.customer_name && p.customer_name.includes(searchTerm)) ||
        (p.customer_email && p.customer_email.includes(searchTerm)) ||
        (p.order_id && p.order_id.includes(searchTerm))
      )
    }

    setPayments(filtered)
  }, [searchTerm, providerFilter, statusFilter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-gray-600" />
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'مكتمل'
      case 'failed':
        return 'فاشل'
      case 'cancelled':
        return 'ملغي'
      case 'processing':
        return 'قيد المعالجة'
      default:
        return 'معلق'
    }
  }

  const getProviderBadge = (provider: string) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          provider === 'tamara'
            ? 'bg-tamara/10 text-tamara'
            : 'bg-tabby/10 text-tabby'
        }`}
      >
        {provider === 'tamara' ? 'تمارا' : 'تابي'}
      </span>
    )
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tamara mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">لوحة الإدارة</h1>
          <p className="text-gray-600">إدارة روابط الدفع المنفصلة</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                البحث والفلترة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="البحث بالاسم أو البريد أو رقم الطلب..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>

                <select
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value as any)}
                  className="h-9 px-3 rounded-md border border-input bg-transparent"
                >
                  <option value="all">جميع المزودين</option>
                  <option value="tamara">تمارا</option>
                  <option value="tabby">تابي</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="h-9 px-3 rounded-md border border-input bg-transparent"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="pending">معلق</option>
                  <option value="completed">مكتمل</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">إجمالي الروابط</p>
                    <p className="text-2xl font-bold">{payments.length}</p>
                  </div>
                  <LinkIcon className="w-10 h-10 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">المعاملات المكتملة</p>
                    <p className="text-2xl font-bold">
                      {payments.filter(p => p.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">معدل النجاح</p>
                    <p className="text-2xl font-bold">
                      {payments.length > 0
                        ? Math.round(
                            (payments.filter(p => p.status === 'completed').length / payments.length) * 100
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>قائمة روابط الدفع</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-12">
                  <LinkIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد روابط دفع</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2 mb-2">
                            {getProviderBadge(payment.provider)}
                            {getStatusIcon(payment.status)}
                            <span className="text-sm font-medium">
                              {getStatusText(payment.status)}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg">{payment.customer_name || 'غير محدد'}</h3>
                          <p className="text-sm text-gray-600">{payment.customer_email || 'لا يوجد بريد'}</p>
                          <p className="text-sm text-gray-500 mt-1">رقم الطلب: {payment.order_id}</p>
                        </div>

                        <div className="text-left">
                          <p className="text-2xl font-bold text-gray-900">
                            {payment.amount.toFixed(2)} {payment.currency}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.created_at).toLocaleString('ar-SA')}
                          </p>
                        </div>

                        <div className="w-full md:w-auto md:min-w-[300px]">
                          <div className="bg-gray-50 rounded p-2 mb-2">
                            <div className="flex items-center gap-2">
                              <LinkIcon className="w-4 h-4 text-gray-600" />
                              <p className="text-xs text-gray-600 font-mono break-all">
                                {payment.payment_url}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => copyToClipboard(payment.payment_url, payment.id)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                          >
                            {copied === payment.id ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                <span>تم النسخ!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>نسخ الرابط</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-8"
        >
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            العودة للرئيسية
          </a>
        </motion.div>
      </div>
    </div>
  )
}
