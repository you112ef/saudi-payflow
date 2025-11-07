# SaudiPayFlow - Real Brand Colors & Design

## 🟣 TAMARA - التصميم الحقيقي

### الألوان (HEX):
- **Primary Gradient**: `linear-gradient(104deg, #370A56 0%, #7121AF 29%, #8B00EF 59.79%, #F933A1 96.99%)`
- **Purple Dark**: `#370A56`
- **Purple Mid**: `#7121AF`
- **Purple Bright**: `#8B00EF`
- **Pink**: `#F933A1`

### الخطوط:
- **English**: `IBMPlexSans, sans-serif`
- **Arabic**: `Ibmplexsansarabic, sans-serif`
- **Google Fonts**: Open Sans (300,400,600,700,800)

### الشعارات:
- Black Logo: `tamara-text-logo-black-en.svg`
- White Logo: `tamara-text-logo-white-en.svg`

---

## 🟢 TABBY - التصميم الحقيقي

### الألوان (HEX):
- **Primary Green**: `#3BFF9D` (أخضر نيوني)
- **Light Green**: `#3EEDBF` (شريط التقدم)
- **Dark**: `#131C26` (نص أساسي)
- **White**: `#FFFFFF`
- **Gray Border**: `#DFE5EB`
- **Blue Accent**: `#1976d2`

### الخطوط:
- **Primary**: `IBM Plex Mono, sans-serif`
- **Arabic**: `IBM Plex Sans Arabic, sans-serif`
- **Secondary**: `Inter, sans-serif`
- **Font Weights**: 300, 400, 500, 600, 700

### UI Elements:
- **Button**: `#3BFF9D` background with `#131C26` border
- **Border Radius**: 24px (pill-shaped buttons)
- **Button Height**: 48px
- **Card Shadow**: `0px 0px 4px 0px #131C2620`

---

## 🎨 تطبيق الألوان

### في Tailwind Config:
```typescript
colors: {
  tamara: {
    DEFAULT: '#8B00EF',
    light: '#F933A1',
    dark: '#370A56',
    gradient: 'linear-gradient(104deg, #370A56 0%, #7121AF 29%, #8B00EF 59.79%, #F933A1 96.99%)',
  },
  tabby: {
    DEFAULT: '#3BFF9D',
    light: '#3EEDBF',
    dark: '#131C26',
  },
}
```

### الخطوط:
```typescript
fontFamily: {
  'tamara': ['IBMPlexSans', 'Ibmplexsansarabic', 'Open Sans', 'sans-serif'],
  'tabby': ['IBM Plex Mono', 'IBM Plex Sans Arabic', 'Inter', 'sans-serif'],
  'arabic': ['Ibmplexsansarabic', 'Noto Kufi Arabic', 'sans-serif'],
}
```
