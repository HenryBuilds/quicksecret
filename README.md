# 🔐 QuickSecret

> **Secure, self-destructing notes that vanish after reading**

[![Live Demo](https://img.shields.io/badge/🌍_Live_Demo-quicksecret.vercel.app-blue?style=for-the-badge)](https://quicksecret.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

**Try it live:** [quicksecret.vercel.app](https://quicksecret.vercel.app/)

---

## ✨ Features

- 🔥 **Self-Destructing Notes** - Notes automatically delete after being read
- 🔒 **Password Protection** - Optional AES-256 encryption for sensitive content
- ⏰ **Auto-Expiration** - Set custom expiration times (minutes, hours, days)
- 👀 **View Limits** - Control how many times a note can be viewed (1-10)
- 🌙 **Dark Mode** - Beautiful light and dark themes
- 📱 **Mobile Responsive** - Works perfectly on all devices

---

## 🛠️ Tech Stack

- **Next.js 14** with TypeScript
- **Tailwind CSS** + shadcn/ui components
- **Elysia** backend with Bun
- **Prisma** + PostgreSQL
- **AES-256 encryption**
- **Deployed on Vercel**

---

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/yourusername/quicksecret.git
cd quicksecret
npm install

# Setup environment
cp .env.example .env.local
# Add your DATABASE_URL

# Setup database
npx prisma generate
npx prisma migrate dev

# Start development
npm run dev
```

---

## 🔒 Security

- **AES-256-CBC encryption** with PBKDF2 key derivation
- **No password storage** - passwords never saved
- **Auto-cleanup** - expired notes automatically deleted
- **Rate limiting** and input validation

---

## 📋 API

### Create Note
```http
POST /api/notes
{
  "content": "Your secret message",
  "password": "optional-password",
  "expiresIn": 3600000,
  "maxViews": 1
}
```

### Read Note
```http
GET /api/notes/{id}?password=optional-password
```

### Note Status
```http
GET /api/notes/{id}/status
```

---

## 📄 License & Usage

This project is **free to use** for everyone! Feel free to:
- ✅ Use it for personal or commercial projects
- ✅ Modify and customize it
- ✅ Host your own instance
- ✅ Contribute improvements

Licensed under MIT - do whatever you want with it! 🎉

---