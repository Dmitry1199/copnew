# 🏋️‍♂️ TrainerPro - SaaS для персональних тренерів

> Професійна платформа для управління клієнтами, тренуваннями, платежами та розкладом персональних тренерів з інтеграцією LiqPay та real-time оновленнями.

## 🌐 Live Demo

**🚀 Демо сайт**: https://same-mhi2mupctx0-latest.netlify.app

**👤 Тестові облікові дані**:
- Email: `demo@trainerpro.com`
- Пароль: `password123`

## ✨ Основні функції

### 🔐 Аутентифікація
- Реєстрація та логін тренерів
- Захищені маршрути
- Управління сесіями з Supabase Auth

### 📊 Dashboard
- Статистика доходів та клієнтів
- Розклад на сьогодні
- Real-time оновлення платежів
- Швидкі дії для управління

### 👥 Управління клієнтами
- Повний CRUD функціонал
- Пошук та фільтрація клієнтів
- Профілі з фітнес цілями та медичною інформацією
- Відстеження рівня підготовки

### 💳 Платежна система
- **Інтеграція з LiqPay** для прийому платежів
- Створення інвойсів з автоматичним підрахунком
- Webhook для real-time оновлення статусів
- Підтримка карток, Apple Pay, Google Pay
- Тестування webhook'ів у демо режимі

### 📅 Календар та розклад
- Планування тренувань
- Управління розкладом
- Відстеження статусів сесій

### 🏃‍♂️ Тренувальні програми
- Категоризовані програми за складністю
- Відстеження прогресу клієнтів
- Гнучке ціноутворення

### ⚙️ Налаштування
- Профіль тренера з бізнес інформацією
- Налаштування LiqPay ключів
- Персоналізація інтерфейсу

## 🛠️ Технічний стек

### Frontend
- **Next.js 15** (App Router)
- **React 18** з TypeScript
- **Tailwind CSS** для стилізації
- **shadcn/ui** компоненти
- **Lucide React** іконки

### Backend & Database
- **Supabase** (PostgreSQL + Auth + Real-time)
- **Row Level Security** (RLS) політики
- API Routes для webhook'ів

### Платежі
- **LiqPay API** інтеграція
- **Crypto-js** для підписів webhook'ів
- Підтримка всіх популярних методів оплати

### DevOps
- **Bun** як package manager та runtime
- **Netlify** для хостингу та CI/CD
- **TypeScript** з суворою типізацією
- **ESLint** + **Biome** для code quality

## 🚀 Локальна розробка

### Передумови
- Node.js 18+ або Bun
- Git

### Встановлення

1. **Клонування репозиторію**
```bash
git clone <repository-url>
cd trainer-saas
```

2. **Встановлення залежностей**
```bash
bun install
```

3. **Налаштування змінних середовища**
```bash
cp .env.example .env.local
```

Додайте ваші ключі Supabase та LiqPay:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
LIQPAY_PUBLIC_KEY=your_liqpay_public_key
LIQPAY_PRIVATE_KEY=your_liqpay_private_key
```

4. **Запуск в dev режимі**
```bash
bun dev
```

Відкрийте http://localhost:3000 у браузері.

### Налаштування бази даних

1. Створіть проект у [Supabase](https://supabase.com)
2. Виконайте SQL з файлу `supabase-schema.sql` у SQL Editor
3. Налаштуйте RLS політики для безпеки

## 📦 Деплоймент

### Netlify (рекомендовано)

1. **Підключіть GitHub репозиторій до Netlify**

2. **Налаштування білда**:
   - Build command: `bun run build`
   - Publish directory: `.next`

3. **Змінні середовища**:
   Додайте всі необхідні змінні в Netlify Environment Variables

4. **Автоматичний деплой** спрацює при push в main branch

### Інші платформи
- **Vercel**: Природна підтримка Next.js
- **Railway**: Простий деплой з GitHub
- **DigitalOcean App Platform**: Скалювання за потребою

## 🧪 Тестування LiqPay

### Webhook симулятор
1. Увійдіть в систему з demo обліковими даними
2. Перейдіть на сторінку "Платежі"
3. Натисніть "Тестувати Webhook"
4. Налаштуйте параметри тестування:
   - Order ID (або згенеруйте новий)
   - Статус платежу (success, failure, processing, etc.)
   - Суму та валюту
5. Відправте тестовий webhook
6. Спостерігайте за real-time оновленнями на dashboard

### Тестові картки LiqPay
- **Visa**: `4149 4399 4999 4999`
- **Mastercard**: `5168 7555 5555 5556`
- **CVV**: будь-який 3-значний код
- **Термін**: будь-яка майбутня дата

## 📊 Архітектура проекту

```
trainer-saas/
├── src/
│   ├── app/                 # Next.js App Router сторінки
│   │   ├── (auth)/         # Групування auth сторінок
│   │   ├── api/            # API endpoints
│   │   └── globals.css     # Глобальні стилі
│   ├── components/         # React компоненти
│   │   ├── ui/            # shadcn/ui базові компоненти
│   │   └── ...            # Кастомні компоненти
│   ├── contexts/          # React Context провайдери
│   ├── hooks/            # Кастомні React hooks
│   └── lib/              # Утиліти та API
│       ├── api/          # Supabase API функції
│       ├── supabase.ts   # Supabase клієнт
│       └── liqpay.ts     # LiqPay інтеграція
├── supabase/
│   └── schema.sql        # Схема бази даних
└── public/              # Статичні файли
```

## 🔐 Безпека

- **Row Level Security**: Кожен тренер бачить тільки свої дані
- **Webhook валідація**: Перевірка підписів від LiqPay
- **Type safety**: TypeScript для виявлення помилок на етапі розробки
- **Env змінні**: Сенситивні дані зберігаються в environment variables

## 🤝 Внесок у проект

1. Fork репозиторію
2. Створіть feature branch (`git checkout -b feature/amazing-feature`)
3. Commit змін (`git commit -m 'Add amazing feature'`)
4. Push до branch (`git push origin feature/amazing-feature`)
5. Відкрийте Pull Request

## 📄 Ліцензія

Цей проект розповсюджується під ліцензією MIT. Дивіться файл `LICENSE` для додаткової інформації.

## 💬 Підтримка

Якщо у вас виникли питання або проблеми:

1. Перевірте [Issues](../../issues) на GitHub
2. Створіть новий Issue з детальним описом
3. Додайте лейбли для кращої категоризації

## 🏆 Автори

Розроблено з ❤️ для спільноти персональних тренерів

---

**TrainerPro** - ваш надійний помічник у управлінні фітнес бізнесом! 🚀
