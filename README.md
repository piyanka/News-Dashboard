# 📰 News & Blog Dashboard

A full-stack admin dashboard built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, allowing you to fetch, filter, analyze, and export news and blog data.

![image](https://github.com/user-attachments/assets/e45fbb50-1576-4ce5-8eac-378b8857ff39)


## ✨ Features

- OAuth login via Google
- Admin vs non-admin role-based access
- Fetches articles from:
  - [NewsAPI](https://newsapi.org/)
  - [Dev.to API](https://dev.to/api/)
- Filters by author, date range, and type
- Dynamic analytics charts (Bar + Pie)
- Admin-only payout view with custom rates
- Export reports as:
  - PDF
  - CSV
  - Google Sheets

## 🚀 Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Chart.js + react-chartjs-2
- NextAuth.js (Google OAuth)
- NewsAPI + Dev.to API

## 🔐 Admin Access

By default, only selected emails are treated as admins.

### 🧪 Test Admin Mode (no login required):

> For demo/evaluation purposes:

```

http://localhost:3000/dashboard?demo=true
http://localhost:3000/dashboard/payout?demo=true     // to view admin only payout page 

````

✅ This enables admin access without an actual admin email.

---

## 🛠️ Local Setup

1. **Clone the repo**

```bash
git clone https://github.com/piyanka/News-Dashboard.git
cd your-repo-name
````

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env.local`**

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEWS_API_KEY=your_newsapi_key
```

4. **Run the app**

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
/app
  /dashboard
    page.tsx             → Main dashboard with auth + exports
  /api/news              → Fetch & enrich news + blog articles

/src
  /components            → Reusable UI components
  /hooks/useIsAdmin.ts   → Admin access logic
  /utils/exportUtils.ts  → Export logic for PDF, CSV, Google Sheets
```

---

## 📦 Export Options

* 📄 Export as PDF
* 📁 Export as CSV
* 📊 Export to Google Sheets

Click the "📤 Export Payout Report" button on the dashboard.

---

## 🔐 Admin Email List

```ts
const ADMINS = [
  "yadavpriyanka97181019@gmail.com",
  "admin@example.com"
];
```

You can modify this in: `src/hooks/useIsAdmin.ts`

---
