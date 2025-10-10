# Deployment Guide

This guide covers deploying Geosynth to production.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps

1. **Connect Repository**
   ```bash
   # Install Vercel CLI (optional)
   npm install -g vercel
   ```

2. **Configure Project**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**
   Add in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   ```bash
   # Via CLI
   vercel --prod

   # Or push to main branch (auto-deploy)
   git push origin main
   ```

### Option 2: Netlify

#### Steps

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - New site from Git
   - Select your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   Add in Netlify dashboard:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - Push to main branch
   - Auto-deploys on every push

### Option 3: Custom Server

#### Prerequisites
- Node.js server
- Nginx or Apache
- SSL certificate

#### Steps

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Serve Static Files**
   ```bash
   # Using serve
   npm install -g serve
   serve -s dist -l 3000
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       root /path/to/geosynth/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Gzip compression
       gzip on;
       gzip_types text/plain text/css application/json application/javascript;
   }
   ```

## 🔐 Environment Setup

### Production Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Security Checklist

- ✅ Use HTTPS
- ✅ Enable CORS properly
- ✅ Set secure headers
- ✅ Never commit `.env` file
- ✅ Use environment-specific keys
- ✅ Enable rate limiting
- ✅ Set up monitoring

## 📊 Supabase Setup

### 1. Database Migrations

```bash
# Run migrations
npx supabase db push

# Or manually in Supabase dashboard
# SQL Editor → Run migrations from supabase/migrations/
```

### 2. Row Level Security

Ensure RLS is enabled:
```sql
-- Enable RLS on tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Policies already defined in migrations
```

### 3. Authentication

Configure in Supabase dashboard:
- Enable Email/Password
- Enable Google OAuth
- Set redirect URLs
- Configure email templates

## 🔍 Post-Deployment Checklist

### Functionality
- [ ] Homepage loads correctly
- [ ] 3D globe renders
- [ ] Authentication works
- [ ] Country search functional
- [ ] Wishlist saves data
- [ ] Dark mode toggles
- [ ] All routes accessible

### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Assets compressed (gzip/brotli)
- [ ] Images optimized
- [ ] Bundle size reasonable

### SEO
- [ ] Meta tags present
- [ ] Open Graph tags
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Canonical URLs set

### Security
- [ ] HTTPS enabled
- [ ] Security headers set
- [ ] API keys not exposed
- [ ] CORS configured
- [ ] Rate limiting active

## 📈 Monitoring

### Recommended Tools

- **Vercel Analytics** - Built-in analytics
- **Sentry** - Error tracking
- **Google Analytics** - User analytics
- **Supabase Dashboard** - Database monitoring

### Setup Sentry (Optional)

```bash
npm install @sentry/react
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Restart dev server after changes
- Check Vercel/Netlify dashboard

### 404 on Refresh

Configure rewrites:
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Assets Not Loading

- Check public folder structure
- Verify asset paths are relative
- Enable gzip compression

## 📞 Support

- Check [documentation](./README.md)
- Review [architecture](./ARCHITECTURE.md)
- Open GitHub issue

---

**Happy Deploying! 🚀**
