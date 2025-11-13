# Деплой на Vercel - Покрокова інструкція

## Переваги Vercel для Telegram Webhook

✅ **Не потрібен ngrok** - Vercel надає HTTPS URL автоматично  
✅ **Безкоштовний HTTPS** - для webhook  
✅ **Автоматичний деплой** - з GitHub  
✅ **Environment Variables** - безпечне зберігання токенів  

---

## Крок 1: Підготовка проекту

### 1.1. Переконайтеся, що проект готовий до деплою

```bash
npm run build
```

Якщо build успішний - все готово!

### 1.2. Створіть `.vercelignore` (опціонально)

```bash
# .vercelignore
.env*.local
node_modules
.next
```

---

## Крок 2: Підключення до Vercel

### Варіант 1: Через Vercel CLI (рекомендовано)

1. **Встановіть Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Увійдіть в Vercel:**
   ```bash
   vercel login
   ```

3. **Задеплойте проект:**
   ```bash
   vercel
   ```
   
   Відповідайте на питання:
   - Set up and deploy? **Yes**
   - Which scope? **Ваш акаунт**
   - Link to existing project? **No** (для першого деплою)
   - Project name? **products_shop** (або інше)
   - Directory? **./** (поточний каталог)
   - Override settings? **No**

4. **Після деплою ви побачите URL:**
   ```
   https://your-project.vercel.app
   ```

### Варіант 2: Через GitHub (рекомендовано для автоматичного деплою)

1. **Завантажте проект на GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/products_shop.git
   git push -u origin main
   ```

2. **Підключіть до Vercel:**
   - Відкрийте: https://vercel.com/new
   - Натисніть "Import Git Repository"
   - Оберіть ваш репозиторій
   - Натисніть "Import"

3. **Налаштуйте проект:**
   - Framework Preset: **Next.js** (визначиться автоматично)
   - Root Directory: **./**
   - Build Command: `npm run build` (за замовчуванням)
   - Output Directory: `.next` (за замовчуванням)

---

## Крок 3: Налаштування Environment Variables

### 3.1. Відкрийте налаштування проекту

1. Перейдіть на https://vercel.com/dashboard
2. Оберіть ваш проект
3. Перейдіть в **Settings** → **Environment Variables**

### 3.2. Додайте змінні оточення

Додайте наступні змінні:

| Key | Value | Environment |
|-----|-------|-------------|
| `TELEGRAM_BOT_TOKEN` | Ваш токен бота | Production, Preview, Development |
| `TELEGRAM_OWNER_CHAT_ID` | Ваш Chat ID | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | Production, Preview, Development |

**Важливо:** 
- `NEXT_PUBLIC_SITE_URL` має бути ваш Vercel URL
- Після додавання змінних потрібно **передеплоїти** проект

### 3.3. Передеплойте проект

Після додавання змінних:
- Натисніть **Deployments** → **Redeploy** (якщо через CLI)
- Або зробіть новий commit (якщо через GitHub)

---

## Крок 4: Налаштування Webhook на Vercel

### 4.1. Отримайте ваш Vercel URL

Після деплою ви отримаєте URL:
```
https://your-project.vercel.app
```

### 4.2. Налаштуйте webhook

**Варіант 1: Через HTML інтерфейс**

1. Відкрийте: `https://your-project.vercel.app/telegram-webhook-setup.html`
2. В полі "URL Webhook" вставте:
   ```
   https://your-project.vercel.app/api/telegram/webhook
   ```
3. Натисніть "✅ Налаштувати Webhook"

**Варіант 2: Через API**

```bash
curl -X POST https://your-project.vercel.app/api/telegram/setup-webhook \
  -H "Content-Type: application/json" \
  -d '{"webhookUrl":"https://your-project.vercel.app/api/telegram/webhook"}'
```

**Варіант 3: Через PowerShell**

```powershell
Invoke-WebRequest -Uri "https://your-project.vercel.app/api/telegram/setup-webhook" -Method POST -ContentType "application/json" -Body '{"webhookUrl":"https://your-project.vercel.app/api/telegram/webhook"}'
```

### 4.3. Перевірте webhook

Відкрийте:
```
https://your-project.vercel.app/api/telegram/setup-webhook
```

Має показати:
```json
{
  "currentWebhook": {
    "url": "https://your-project.vercel.app/api/telegram/webhook"
  }
}
```

---

## Крок 5: Тестування

1. **Відкрийте сайт:** `https://your-project.vercel.app`
2. **Відкрийте чат** і надішліть тестове повідомлення
3. **Перевірте Telegram** - має прийти повідомлення
4. **Відповідь через Reply** в Telegram
5. **Перевірте сайт** - відповідь має з'явитися в чаті

---

## Важливі зауваження

### ⚠️ In-Memory Storage

Поточний код використовує in-memory storage (`global.sessionMessages`). На Vercel:
- ✅ Працює для тестування
- ⚠️ Дані втрачаються при перезапуску сервера
- ⚠️ Не працює між різними serverless функціями

**Для production рекомендується:**
- Використовувати базу даних (PostgreSQL, MongoDB)
- Або Redis для зберігання повідомлень

### 🔄 Автоматичний деплой

Якщо підключили GitHub:
- Кожен push в `main` автоматично деплоїться
- Pull requests створюють Preview deployments

### 📝 Логи

Переглянути логи можна в:
- Vercel Dashboard → **Deployments** → **Functions** → **View Function Logs**

---

## Troubleshooting

### Проблема: Build fails

**Рішення:**
- Перевірте, чи всі залежності в `package.json`
- Перевірте, чи немає помилок в коді: `npm run build`

### Проблема: Webhook не працює

**Рішення:**
1. Перевірте Environment Variables
2. Перевірте, чи webhook налаштований правильно
3. Перевірте логи в Vercel Dashboard

### Проблема: Повідомлення не зберігаються

**Рішення:**
- Це нормально для in-memory storage на serverless
- Для production потрібна база даних

---

## Корисні посилання

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/environment-variables)

---

## Після успішного деплою

✅ Ваш сайт доступний за HTTPS  
✅ Webhook працює без ngrok  
✅ Автоматичний деплой з GitHub  
✅ Готово до production (з базою даних)  

🎉 **Вітаємо з успішним деплоєм!**

