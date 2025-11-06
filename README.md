# SaudiPayFlow v2.0.0 - Realistic UI Clone for Tamara & Tabby

تطبيق واقعي يحاكي تجربة الدفع الحقيقية لتمارا وتابي بتصميم مطابق بصريًا، يتضمن 4 صفحات دفع متتالية (تفاصيل - مستلم - بطاقة - تحقق).

## ✨ المميزات

- 🎨 **واجهة مطابقة تماماً** للتجربة الأصلية لتمارا وتابي
- 🏗️ **4 مراحل دفع متتالية**: تفاصيل → مستلم → بطاقة → تحقق
- 🌙 **دعم الوضع الليلي والفاتح** مع تدرجات ألوان مخصصة
- 🇸🇦 **دعم كامل للغة العربية** مع اتجاه RTL
- ✨ **رسوم متحركة سلسة** باستخدام Framer Motion
- 🎭 **تصميم متجاوب** يعمل على جميع الأجهزة
- 🔒 **قاعدة بيانات آمنة** مع Supabase
- 📊 **لوحة إدارة شاملة** لمراجعة المعاملات
- 🔐 **تشفير وأمان** للبيانات الحساسة

## 🛠️ التقنيات

### Frontend
- **Next.js 14** - React framework مع App Router
- **TypeScript** - للتطوير الآمن
- **Tailwind CSS** - للتصميم المرن
- **Framer Motion** - للرسوم المتحركة
- **Shadcn/UI** - مكونات واجهة مستخدم متقدمة
- **Radix UI** - مكونات أساسية قابلة للوصول

### Backend
- **Supabase** - PostgreSQL database
- **Supabase Edge Functions** - خوادم API

### التصميم
- **خطوط عربية**: Noto Kufi Arabic
- **خطوط إنجليزية**: Inter & Urbanist
- **ألوان تمارا**: `#00b496`
- **ألوان تابي**: `#6f4df5`

## 📋 المتطلبات

- Node.js 18+
- npm أو yarn
- حساب Supabase (اختياري - يعمل مع mock mode افتراضياً)

## 🚀 التثبيت والتشغيل

### 1. نسخ المستودع
```bash
cd saudi-payflow
npm install
```

### 2. إعداد متغيرات البيئة
```bash
cp .env.example .env.local
```

أضف مفاتيح Supabase في `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**ملاحظة**: يمكن تشغيل التطبيق بدون Supabase - سيعمل في وضع المحاكاة

### 3. إنشاء قاعدة البيانات

انسخ محتوى `lib/database.sql` وشغّله في محرر SQL في Supabase.

### 4. تشغيل الخادم المحلي
```bash
npm run dev
```

سيتم تشغيل التطبيق على `http://localhost:3000`

## 🎯 مسار الدفع (Payment Flow)

### المرحلة 1: تفاصيل الطلب
- عرض بيانات المنتج والعميل
- المبلغ الإجمالي
- زر متابعة

### المرحلة 2: بيانات المستلم
- الاسم الكامل
- البريد الإلكتروني
- رقم الجوال
- العنوان

### المرحلة 3: بيانات البطاقة
- معاينة البطاقة التفاعلية
- رقم البطاقة
- تاريخ الانتهاء
- CVV
- اسم حامل البطاقة

### المرحلة 4: رمز التحقق
- إدخال OTP (6 أرقام)
- عداد إعادة الإرسال
- تأكيد النجاح

## 📊 لوحة الإدارة

اذهب إلى `/admin` لمراجعة:
- جميع المعاملات
- البحث والفلترة
- إحصائيات المبيعات
- معدل النجاح

## 🎨 التخصيص

### ألوان المزودين

يمكن تخصيص الألوان في `tailwind.config.ts`:

```typescript
colors: {
  tamara: {
    DEFAULT: '#00b496',
    light: '#33c4ad',
    dark: '#008f75',
  },
  tabby: {
    DEFAULT: '#6f4df5',
    light: '#8a6df8',
    dark: '#5a3dc4',
  },
}
```

### الخطوط

```typescript
fontFamily: {
  'arabic': ['Noto Kufi Arabic', 'sans-serif'],
  'inter': ['Inter', 'sans-serif'],
  'urbanist': ['Urbanist', 'sans-serif'],
}
```

## 🔧 API Endpoints

### POST /api/payments
إنشاء عملية دفع جديدة

**Request:**
```json
{
  "provider": "tamara",
  "amount": 250.75,
  "currency": "SAR",
  "customer_name": "عبدالله",
  "customer_email": "abdullah@example.com",
  "customer_phone": "+966500000000"
}
```

### GET /api/payments
جلب قائمة المعاملات

**Query Parameters:**
- `provider` - فلترة حسب المزود
- `status` - فلترة حسب الحالة
- `search` - البحث في الأسماء والبريد

### GET /api/payments/[uuid]
جلب معاملة محددة

### PUT /api/payments/[uuid]
تحديث معاملة

### POST /api/webhooks/tamara
Webhook لمعالجة تحديثات تمارا

### POST /api/webhooks/tabby
Webhook لمعالجة تحديثات تابي

## 🗄️ قاعدة البيانات

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider VARCHAR(10) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'SAR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  order_id TEXT,
  session_id TEXT,
  verification_code TEXT,
  payment_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 النشر على Vercel

1. ارفع المشروع إلى GitHub
2. اربط مستودع GitHub بحساب Vercel
3. أضف متغيرات البيئة في إعدادات Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. انشر!

## 🎓 حالات الاستخدام

### للمطورين
- تعلم كيفية بناء تدفقات دفع واقعية
- فهم تكامل Supabase
- تطبيق أفضل الممارسات في React/Next.js

### للتجار
- اختبار تجربة المستخدم
- عرض واجهات الدفع للعملاء
- التدريب على استخدام أنظمة الدفع

### للطلاب
- دراسة تصميم واجهات المستخدم
- تعلم TypeScript وNext.js
- فهم قواعد البيانات

## ⚠️ تنبيه مهم

**هذا التطبيق مخصص للأغراض التعليمية والتوضيحية فقط**

- لا يعالج مدفوعات حقيقية
- لا يستخدم APIs حقيقية لتمارا أو تابي
- جميع البيانات في وضع المحاكاة

للاستخدام التجاري، يجب:
1. الحصول على حساب تاجر من تمارا وتابي
2. التكامل مع APIs الرسمية
3. إضافة معالجات دفع حقيقية
4. تطبيق معايير الأمان المطلوبة (PCI DSS)

## 📝 الترخيص

MIT License

## 🤝 المساهمة

مرحب بالمساهمات! يرجى:
1. فتح issue لمناقشة التغيير
2. إنشاء fork للمستودع
3. إنشاء branch جديد
4. إرسال pull request

## 📧 الدعم

للحصول على الدعم، يرجى فتح issue في GitHub

---

**تم تطويره بـ ❤️ في السعودية**
