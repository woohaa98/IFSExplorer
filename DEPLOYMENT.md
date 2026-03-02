# Vercel + Railway Deployment Guide

## Prerequisites
- Vercel account (free): https://vercel.com
- Railway account (free): https://railway.app
- GitHub account (you already have this)

---

## Step 1: Deploy Backend to Railway

1. Go to **https://railway.app**
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `IFSExplorer` repository
4. Railway will detect the Node.js server in `/server`
5. Add environment variable:
   - **Key:** `REACT_APP_ANTHROPIC_KEY`
   - **Value:** Your actual API key from Anthropic
6. Click **Deploy**
7. Once deployed, copy your **Railway URL** (looks like `https://your-service-railway.app`)
8. Save this URL for Step 2

---

## Step 2: Deploy Frontend to Vercel

1. Go to **https://vercel.com**
2. Click **New Project** → **Import your GitHub repo** → Select `IFSExplorer`
3. In the **Project Settings**:
   - Root Directory: leave as `.` (root)
   - Framework: `Create React App`
4. Add environment variables:
   - **Key:** `REACT_APP_API_ENDPOINT`
   - **Value:** Your Railway URL from Step 1 (e.g., `https://your-service-railway.app`)
5. Click **Deploy**
6. Once deployed, your app is live! 🎉

---

## Step 3: Verify It Works

1. Go to your Vercel URL (e.g., `https://parts-of-me.vercel.app`)
2. The app should load and communicate with your Railway backend
3. Your API key stays secure on the Railway server

---

## Updating Your App

Any time you push to GitHub:
- **Vercel** automatically redeploys your frontend
- **Railway** automatically redeploys your backend

No manual steps needed!

---

## Troubleshooting

**Frontend says "can't reach API":**
- Check that `REACT_APP_API_ENDPOINT` on Vercel matches your Railway URL exactly
- Make sure Railway backend is running (check Railway dashboard)

**Backend errors:**
- Check Railway logs in the dashboard
- Make sure `REACT_APP_ANTHROPIC_KEY` is set on Railway
