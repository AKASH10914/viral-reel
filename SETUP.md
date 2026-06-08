# ViralReel AI — Setup Guide

## Prerequisites
- Bun >= 1.1  
- Supabase project  
- Cloudflare R2 bucket  
- Stripe account  
- OpenAI API key  
- FastAPI backend deployed

## 1. Environment variables

```bash
cp .env.example .env
```

## 2. Supabase setup

1. Create a project at supabase.com
2. Run migrations
3. Enable Realtime for `jobs` table
4. Enable Google OAuth

## 3. Cloudflare R2

1. Create bucket: `viralreel-videos`
2. Set CORS settings
3. Create API token with R2 read+write

## 4. Stripe

1. Create products for Creator and Studio tiers
2. Copy price IDs to env
3. Register webhook

## 5. Install & run

```bash
npm install
npm run dev
```

## 6. Deploy to Vercel

```bash
vercel --prod
```
