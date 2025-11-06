# دليل النشر - SaudiPayFlow v2.0.0

## نشر على Vercel (الطريقة الموصى بها)

### الخطوة 1: تحضير المستودع

```bash
git init
git add .
git commit -m "Initial commit - SaudiPayFlow v2.0.0"
git remote add origin <your-git-repo-url>
git push -u origin main
```

### الخطوة 2: ربط Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخولك بحساب GitHub
3. اضغط "New Project"
4. اختر مستودع saudi-payflow
5. اضغط "Import"

### الخطوة 3: إعداد متغيرات البيئة

في إعدادات المشروع في Vercel، أضف:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### الخطوة 4: نشر

1. اضغط "Deploy"
2. انتظر حتى اكتمال البناء (2-3 دقائق)
3. ستحصل على رابط مثل: `https://saudi-payflow.vercel.app`

## إعداد Supabase

### 1. إنشاء حساب

اذهب إلى [supabase.com](https://supabase.com) وأنشئ حساب جديد

### 2. إنشاء مشروع جديد

1. اضغط "New Project"
2. اختر organization
3. أدخل اسم المشروع: `saudi-payflow`
4. أدخل كلمة مرور قاعدة البيانات
5. اختر منطقة (أقرب لمنطقة العملاء)
6. اضغط "Create new project"

### 3. إنشاء الجدول

1. اذهب إلى SQL Editor
2. انسخ محتوى `lib/database.sql`
3. اضغط "Run" لتنفيذ الاستعلام

### 4. الحصول على مفاتيح API

1. اذهب إلى Settings > API
2. انسخ:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## اختبار التطبيق

### 1. إنشاء معاملة تمارا

```bash
# افتح المتصفح واذهب إلى:
https://your-app-url.com

# اضغط "إنشاء رابط تمارا"
# املأ البيانات
# اضغط "متابعة"
```

### 2. إكمال التدفق

- **المرحلة 1**: تفاصيل الطلب
- **المرحلة 2**: بيانات المستلم
- **المرحلة 3**: بيانات البطاقة (استخدم أرقام تجريبية)
- **المرحلة 4**: رمز التحقق (استخدم الرمز المعروض)

### 3. مراجعة في لوحة الإدارة

```
https://your-app-url.com/admin
```

## الأوامر المفيدة

### تشغيل محلي
```bash
npm run dev
```

### بناء للإنتاج
```bash
npm run build
npm start
```

### فحص الأخطاء
```bash
npm run lint
```

## استكشاف الأخطاء

### خطأ: اتصال Supabase فاشل

**الحل:**
1. تأكد من صحة متغيرات البيئة
2. تأكد من إنشاء الجدول في Supabase
3. تحقق من Network في DevTools

### خطأ: TypeScript errors

**الحل:**
```bash
npm install
# أو
rm -rf node_modules .next
npm install
npm run dev
```

### خطأ: Tailwind CSS لا يعمل

**الحل:**
تأكد من وجود ملف `tailwind.config.ts` في الجذر

## مراقبة الأداء

### Vercel Analytics

1. اذهب إلى Analytics في لوحة تحكم Vercel
2. راقب:
   - Page Views
   - Core Web Vitals
   - API Response Times

### Supabase Dashboard

1. راقب:
   - Database size
   - API requests
   - Active connections

## النسخ الاحتياطي

### قاعدة البيانات

```bash
# تصدير البيانات
pg_dump -h your-host -U postgres -d your-db > backup.sql

# استيراد البيانات
psql -h your-host -U postgres -d your-db < backup.sql
```

### الكود المصدري

```bash
# إنشاء tag للإصدار
git tag -a v2.0.0 -m "Release v2.0.0"
git push origin v2.0.0
```

## ترقية الإصدار

```bash
# إنشاء branch جديد
git checkout -b feature/new-feature

# تطوير الميزة الجديدة
git add .
git commit -m "Add new feature"

# دمج مع main
git checkout main
git merge feature/new-feature

# نشر
git push origin main
```

## الأمان

### 1. متغيرات البيئة

- لا تشارك مفاتيح API
- استخدم متغيرات البيئة دائماً
- راجع دورياً المفاتيح المستخدمة

### 2. قاعدة البيانات

- فعّل RLS (Row Level Security)
- استخدم policies للوصول
- راجع الأذونات بانتظام

### 3. HTTPS

- Vercel يوفر HTTPS مجاناً
- تأكد من استخدام HTTPS فقط
- فعّل HSTS

## الأداء

### تحسين الصور

```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com'],
  },
}
```

### تحسين الكود

```bash
# تحليل حجم الحزم
npm run build
npx @next/bundle-analyzer
```

### التخزين المؤقت

```typescript
// استخدام cache في API routes
export async function GET() {
  const data = await fetch('https://api.example.com', {
    next: { revalidate: 3600 } // cache لمدة ساعة
  })
}
```

## الدعم والصيانة

### مراقبة الأخطاء

1. فعّل Sentry أو خدمة مراقبة مشابهة
2. راجع logs بانتظام
3. أنشئ إنذارات للأخطاء الحرجة

### النسخ الدوري

- قاعدة البيانات: يومياً
- الكود: مع كل commit
- الإعدادات: عند كل تغيير

### التحديثات

- Next.js: شهرياً
- Dependencies: أسبوعياً
- Security patches: فورياً

---

**نصيحة**: احتفظ بهذا الدليل في مكان آمن للمراجعة المستقبلية
