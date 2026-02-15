# Dentiguide — MDR Documentation System

EU MDR Annex XIII documentation system for custom-made dental devices.

## Setup (15 minutes)

### 1. Create a Supabase account (free)
1. Go to **https://supabase.com** → Sign up (use GitHub or email)
2. Click **New Project** → Name it "dentiguide" → Set a database password → Region: Frankfurt
3. Wait ~2 minutes for it to spin up
4. Go to **SQL Editor** (left sidebar) → Paste everything from `supabase/schema.sql` → Click **Run**
5. Go to **Settings → API** → Copy your:
   - Project URL (looks like `https://abcdef.supabase.co`)
   - `anon` public key (long string starting with `eyJ...`)

### 2. Create a GitHub account (free) 
1. Go to **https://github.com** → Sign up
2. Click **New Repository** → Name it "dentiguide-app" → Make it Private
3. Upload all files from this project folder (or use `git push` from terminal)

### 3. Deploy on Vercel (free)
1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **Import Project** → Select your "dentiguide-app" repo
3. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
4. Click **Deploy** → Wait ~1 minute
5. Your app is live at `https://dentiguide-app.vercel.app`

### 4. Create your account
1. Open your app URL → Click "Sign up"
2. Use your email + a password
3. Check email for confirmation link → Click it
4. You're in! Go to Settings to fill in your company details.

### Optional: Custom domain
In Vercel → Settings → Domains → Add `app.dentiguide.de` → Update DNS as instructed.

## Architecture
- **Next.js 14** (App Router) — React + server rendering
- **Supabase** (PostgreSQL) — Database, authentication, row-level security
- **Tailwind CSS** — Styling
- **Vercel** — Hosting with auto-deploys from GitHub

## Security
- Row Level Security (RLS) ensures each user only sees their own data
- Auth handled by Supabase with secure cookie sessions
- No sensitive data stored in frontend code
