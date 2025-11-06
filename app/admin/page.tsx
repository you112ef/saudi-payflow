'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Payment, PaymentProvider, PaymentStatus } from '@/types/payment'
import { Search, Filter, CreditCard, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

export default function AdminPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [providerFilter, setProviderFilter] = useState<PaymentProvider | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const params = new URLSearchParams()
      if (providerFilter !== 'all') params.append('provider', providerFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/payments?${params}`)
      const data = await response.json()

      if (data.success) {
        setPayments(data.data)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, providerFilter, statusFilter])

  const getStatusIcon = (status: PaymentStatus) => {
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

  const getStatusText = (status: PaymentStatus) => {
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

  const getProviderBadge = (provider: PaymentProvider) => {
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

  const filteredPayments = payments

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
          <p className="text-gray-600">مراجعة وإدارة جميع عمليات الدفع</p>
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
                  onChange={(e) => setProviderFilter(e.target.value as PaymentProvider | 'all')}
                  className="h-9 px-3 rounded-md border border-input bg-transparent"
                >
                  <option value="all">جميع المزودين</option>
                  <option value="tamara">تمارا</option>
                  <option value="tabby">تابي</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'all')}
                  className="h-9 px-3 rounded-md border border-input bg-transparent"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="pending">معلق</option>
                  <option value="processing">قيد المعالجة</option>
                  <option value="completed">مكتمل</option>
                  <option value="failed">فاشل</option>
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
                    <p className="text-sm text-gray-600">إجمالي المعاملات</p>
                    <p className="text-2xl font-bold">{payments.length}</p>
                  </div>
                  <CreditCard className="w-10 h-10 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">المبالغ المحصلة</p>
                    <p className="text-2xl font-bold">
                      {payments
                        .filter(p => p.status === 'completed')
                        .reduce((sum, p) => sum + p.amount, 0)
                        .toFixed(2)} ر.س
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-600" />
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
                  <CheckCircle className="w-10 h-10 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>قائمة المعاملات</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPayments.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد معاملات</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPayments.map((payment) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-4">
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
                        </div>

                        <div className="text-left">
                          <p className="text-2xl font-bold text-gray-900">
                            {payment.amount.toFixed(2)} {payment.currency}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(payment.created_at), 'PPp', { locale: ar })}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">رقم الطلب</p>
                          <p className="font-mono text-sm">{payment.order_id || payment.id.substring(0, 8)}</p>
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
