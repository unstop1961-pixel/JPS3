# Vercel Deployment Guide

Your Digital Museum Guide is now configured for **Vercel deployment** with serverless functions!

## What Changed

✅ Created `/api` folder with serverless functions
✅ Created `vercel.json` configuration
✅ Updated frontend to use relative API paths
✅ Created `.vercelignore` to exclude unnecessary files

## Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add Vercel configuration"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Via Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: Via Vercel Dashboard**
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Import Project"
4. Select your JPS3 repository
5. Click "Deploy"

### Step 3: Your App is Live!
After deployment, you'll get a URL like:
```
https://your-app-name.vercel.app
```

## Architecture

```
Project Root (/)
├── frontend/              ← Static files (HTML, CSS, JS, images)
├── api/                   ← Serverless functions
│   ├── index.js          ← GET /api
│   ├── museums.js        ← GET /api/museums
│   ├── auth/[...slug].js ← POST /api/auth/signup, /api/auth/login
│   ├── user/[username].js ← GET /api/user/{username}
│   └── [...slug].js      ← Catch-all for routing
└── data/                  ← Data files (museums.json, quiz.json, etc.)
```

## API Endpoints (Vercel)

```
GET  /api/museums           → List all museums
POST /api/auth/signup       → User signup
POST /api/auth/login        → User login
GET  /api/user/{username}   → Get user data
```

## Important Notes

⚠️ **Limitations on Vercel Free Tier:**
- Serverless functions have 10-second timeout
- File system is read-only (use database for persistence)
- User data saved to `data/users.json` may not persist between deployments

### Recommended for Production:
Use a database instead of JSON files. Options:
- **Firebase Realtime Database** (easiest)
- **PostgreSQL** (most reliable)
- **MongoDB** (flexible)
- **Supabase** (PostgreSQL + easy setup)

## To Use a Database

1. Choose a database provider (Firebase recommended)
2. Get connection credentials
3. Create environment variables in Vercel:
   - Go to Vercel dashboard
   - Project settings → Environment Variables
   - Add: `DATABASE_URL`, `API_KEY`, etc.
4. Update `api/auth/[...slug].js` to use database instead of JSON files

## Testing Locally Before Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Test locally
vercel dev
# Visit http://localhost:3000
```

## Troubleshooting

**Issue: 404 Not Found**
- Check `vercel.json` is in root directory
- Verify `api/` folder structure
- Check Vercel deployment logs

**Issue: API endpoints not working**
- Verify `vercel.json` routes are correct
- Check browser console for actual API URL
- Test API directly: `curl https://your-app.vercel.app/api/museums`

**Issue: User data not persisting**
- Expected on Vercel (file system is read-only)
- Use a database for production

**Issue: Images not loading**
- Verify images are in `frontend/images/`
- Check file paths in script.js

## Next Steps

1. ✅ Files configured
2. Push to GitHub (if not done)
3. Deploy to Vercel
4. Test all features
5. (Optional) Migrate to database for user persistence

---

**Need help?** Check the Vercel docs: https://vercel.com/docs
