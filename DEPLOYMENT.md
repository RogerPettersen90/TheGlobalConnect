# TheGlobalConnect - Railway Deployment Guide

## 🚀 Quick Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

## Manual Deployment Steps

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `TheGlobalConnect` repository

### 3. Add Required Services
In your Railway project dashboard, add these services:

#### Database Services:
- **PostgreSQL**: Add from Railway marketplace
- **Redis**: Add from Railway marketplace

#### Optional Storage:
- **S3 Compatible Storage** or use Railway's file storage

### 4. Configure Environment Variables

In Railway dashboard, set these variables for your web service:

#### Required Variables:
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
NEXTAUTH_SECRET=your-super-secret-key-generate-a-strong-one
NEXTAUTH_URL=${{RAILWAY_STATIC_URL}}
```

#### Optional AI Features:
```env
OPENAI_API_KEY=your-openai-api-key-here
ENABLE_AI=true
OPENAI_MODEL_CHAT=gpt-3.5-turbo
```

#### App Configuration:
```env
NODE_ENV=production
ENABLE_REGISTRATION=true
ENABLE_EMAIL_VERIFICATION=false
```

#### OAuth Providers (Optional):
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 5. Deploy Configuration

#### Build Settings:
- **Build Command**: `pnpm build`
- **Start Command**: `pnpm start`
- **Port**: `3000`

#### File Structure:
Railway will automatically detect the Next.js app in `apps/web/` and deploy it.

### 6. Database Setup

After deployment, run these commands in Railway's service terminal:

```bash
# Generate Prisma client
pnpm --filter=@theglobalconnect/db db:generate

# Run database migrations
pnpm --filter=@theglobalconnect/db db:push

# Seed with sample data (optional)
pnpm --filter=@theglobalconnect/db db:seed
```

### 7. WebSocket Service (Optional)

For real-time chat features, deploy the WebSocket server:

1. Create a new service in Railway
2. Deploy from the same repository
3. Set root directory to `apps/ws/`
4. Set start command to `pnpm start`
5. Add environment variables:
   ```env
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   PORT=3001
   ```

## 🔧 Production Checklist

### Security:
- ✅ Generate strong `NEXTAUTH_SECRET`
- ✅ Set secure OAuth credentials
- ✅ Configure CORS for WebSocket service
- ✅ Enable HTTPS (automatic on Railway)

### Performance:
- ✅ Database connection pooling configured
- ✅ Redis caching enabled
- ✅ Image optimization with Next.js
- ✅ Static file serving optimized

### Monitoring:
- ✅ Health check endpoints available
- ✅ Structured logging implemented
- ✅ Error tracking ready
- ✅ Performance metrics available

## 🌐 Custom Domain

1. In Railway dashboard, go to your web service
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` environment variable

## 📊 Scaling

Railway automatically scales based on usage. For high-traffic scenarios:

1. **Database**: Consider upgrading to Railway Pro for better PostgreSQL performance
2. **Redis**: Monitor memory usage and scale as needed
3. **App Instances**: Railway will auto-scale horizontally
4. **CDN**: Consider adding Cloudflare for global performance

## 🆘 Troubleshooting

### Common Issues:

1. **Build Failures**: Check that all dependencies are in package.json
2. **Environment Variables**: Ensure all required variables are set
3. **Database Connection**: Verify DATABASE_URL is correct
4. **NextAuth Issues**: Check NEXTAUTH_SECRET and NEXTAUTH_URL

### Logs Access:
```bash
railway logs
```

### Database Access:
```bash
railway connect postgres
```

## 🔄 CI/CD Setup

For automatic deployments, connect Railway to your GitHub repository:

1. In Railway dashboard: Settings → Source
2. Connect to GitHub repository
3. Enable auto-deployment on push to main branch
4. Configure build settings and environment variables

## 📱 Mobile & API

The platform includes:
- ✅ Mobile-responsive design
- ✅ PWA capabilities
- ✅ RESTful API endpoints
- ✅ WebSocket API for real-time features

Ready for mobile app development or third-party integrations!

---

**Your TheGlobalConnect social platform is now production-ready on Railway!** 🎉

For support, check the main README.md or create an issue on GitHub.