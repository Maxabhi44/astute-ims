# 🚀 ASTUTE IMS — COMPLETE DEPLOYMENT GUIDE
### Apna Project Live Karo — Step by Step (Free Mein!)

---

## 📦 Project Structure (Jo Tumhare Paas Hai)

```
astute-ims/
├── pages/
│   ├── index.tsx          ← Login page
│   ├── dashboard.tsx      ← Main dashboard
│   ├── claims.tsx         ← Claims management
│   ├── surveyors.tsx      ← Surveyor coordination
│   ├── documents.tsx      ← Document management
│   ├── reports.tsx        ← AI report generator
│   ├── followups.tsx      ← Follow-up tracker
│   ├── emails.tsx         ← Email log
│   └── api/
│       ├── claims.ts      ← REST API (secure)
│       └── generate-report.ts ← AI API (rate limited)
├── components/
│   ├── Layout.tsx         ← Sidebar + navigation
│   ├── StatsGrid.tsx      ← Dashboard stats
│   └── RecentClaims.tsx   ← Dashboard widgets
├── lib/
│   ├── supabase.ts        ← Database client
│   └── security.ts        ← Rate limiter + sanitization
├── styles/globals.css
├── supabase-schema.sql    ← Database tables
├── package.json
└── .env.local.example
```

---

## STEP 1 — GitHub Account Banao (Free)

1. **https://github.com** pe jao
2. "Sign Up" karo — email + password
3. Account verify karo

---

## STEP 2 — Project GitHub pe Upload Karo

### Option A: GitHub Desktop (Easiest — No Commands)

1. **https://desktop.github.com** se GitHub Desktop download karo
2. Install karo + sign in karo
3. "Create New Repository" click karo
4. Name: `astute-ims`
5. `astute-ims` folder wali saari files wahan copy karo
6. "Commit to main" → "Publish repository" click karo
7. ✅ Done — code GitHub pe hai!

### Option B: Command Line (Agar VS Code Use Karte Ho)

```bash
cd astute-ims
git init
git add .
git commit -m "Initial commit - Astute IMS"
git branch -M main
git remote add origin https://github.com/TUMHARA_USERNAME/astute-ims.git
git push -u origin main
```

---

## STEP 3 — Supabase Setup (Free Database)

### 3.1 — Account Banao
1. **https://supabase.com** pe jao
2. "Start your project" → GitHub se sign in karo
3. "New Project" click karo
4. Project name: `astute-ims`
5. Database password: **Strong password likho aur save karo!**
6. Region: **South Asia (Singapore)** select karo
7. "Create new project" — 2 minute wait karo

### 3.2 — Database Tables Banao
1. Left menu mein **SQL Editor** click karo
2. "New query" click karo
3. `supabase-schema.sql` file kholo — saara SQL copy karo
4. Paste karo SQL Editor mein
5. **"Run"** button dabao (ya Ctrl+Enter)
6. ✅ "Success" message aana chahiye

### 3.3 — API Keys Copy Karo
1. Left menu mein **Settings** → **API** jao
2. Ye 3 cheezein copy karke safe rakh do:
   - **Project URL** (jaise: https://xyzxyz.supabase.co)
   - **anon public** key
   - **service_role** key (secret rakh!)

---

## STEP 4 — Anthropic API Key Lo (AI Reports Ke Liye)

1. **https://console.anthropic.com** pe jao
2. Sign up karo
3. "API Keys" → "Create Key"
4. Key copy karke safe rakh do
5. Free credits milenge — kaafi hain demo ke liye!

---

## STEP 5 — Vercel Pe Deploy Karo (Free Hosting)

1. **https://vercel.com** pe jao
2. "Sign Up" → GitHub se sign in karo
3. "New Project" click karo
4. `astute-ims` repository select karo
5. "Import" click karo

### Environment Variables Add Karo:
"Environment Variables" section mein ye sab add karo:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Tumhara Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tumhara anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Tumhara service role key |
| `ANTHROPIC_API_KEY` | Tumhara Anthropic key |
| `NEXTAUTH_SECRET` | Koi bhi 32+ char random string |

6. **"Deploy"** click karo
7. 2-3 minute wait karo
8. ✅ Tumhara URL milega: `https://astute-ims-xyz.vercel.app`

---

## STEP 6 — Test Karo

1. Apna Vercel URL browser mein kholo
2. **Sign Up** karo — naya account banao
3. Supabase mein `auth.users` table mein dekho — tumhara user dikhega
4. Dashboard pe jao — saare features test karo
5. Reports mein "Generate with AI" dabao — real AI report aayegi!

---

## 🔐 Security Features Jo Tumhare Project Mein Hain

✅ **Authentication** — Supabase JWT tokens, no password stored in plain text
✅ **Row Level Security** — Har user sirf authorized data dekh sakta hai
✅ **Rate Limiting** — API pe 30 requests/minute limit (brute force protection)
✅ **Input Sanitization** — XSS attacks se protection
✅ **Security Headers** — X-Frame-Options, CSP, HSTS (next.config.js mein)
✅ **Environment Variables** — Keys kabhi frontend mein expose nahi hote
✅ **HTTPS** — Vercel automatic SSL certificate deta hai

---

## 💼 Interview Mein Kya Bolna Hai

**"Kaunsa tech stack use kiya?"**
> "Next.js with TypeScript frontend, Supabase PostgreSQL database, Vercel hosting, aur Anthropic Claude AI for report generation."

**"Security kaise handle ki?"**
> "JWT authentication, Row Level Security policies in database, server-side rate limiting, input sanitization against XSS, and secure HTTP headers."

**"API kaise banaya?"**
> "RESTful API routes with Next.js API Routes — claims GET/POST with auth middleware, rate limiting, and input validation."

**"AI integration kaise hai?"**
> "Anthropic Claude API se connect kiya — user report type select karta hai, claim data backend pe process hoti hai, AI professional report generate karta hai."

---

## 🛠 Common Errors & Fix

| Error | Fix |
|-------|-----|
| `Module not found` | `npm install` run karo |
| `Supabase connection failed` | .env.local mein URL check karo |
| `AI report not generating` | ANTHROPIC_API_KEY check karo Vercel mein |
| `Build failed on Vercel` | Vercel logs mein exact error dekho |
| `401 Unauthorized` | Supabase RLS policies check karo |

---

## 📱 Custom Domain (Optional — Free!)

1. Vercel dashboard → tumhara project → "Settings" → "Domains"
2. `astute-ims.vercel.app` already free milega
3. Ya free `.tk` domain ke liye **freenom.com** try karo

---

**Total Cost: ₹0/month** 🎉
Vercel Free + Supabase Free + Anthropic Free Credits

---
*Built for Astute Insurance Surveyors & Loss Assessors Pvt. Ltd.*
