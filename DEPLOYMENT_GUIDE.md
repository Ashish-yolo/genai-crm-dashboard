# 🚀 Production Deployment Guide

## Overview
This guide walks you through deploying the GenAI CRM Dashboard with a secure backend on Render.

## 📋 Prerequisites
- Render account ([render.com](https://render.com))
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com))
- GitHub repository with your code

## 🎯 Deployment Steps

### 1. Deploy Backend API to Render

1. **Create Web Service on Render**:
   - Go to [render.com/dashboard](https://render.com/dashboard)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend Service**:
   ```
   Name: genai-crm-backend
   Runtime: Node
   Build Command: cd server && npm install
   Start Command: cd server && npm start
   ```

3. **Set Environment Variables**:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-domain.com
   ```

4. **Deploy Backend** - Render will build and deploy automatically

### 2. Deploy Frontend

**Option A: Deploy to Render (Static Site)**
1. Create new Static Site on Render
2. Configure:
   ```
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
3. Set environment variable:
   ```
   REACT_APP_API_BASE_URL=https://your-backend-domain.onrender.com
   ```

**Option B: Deploy to Netlify (Alternative)**
1. Connect GitHub repository to Netlify
2. Set build settings:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
3. Set environment variable:
   ```
   REACT_APP_API_BASE_URL=https://your-backend-domain.onrender.com
   ```

### 3. Update Configuration

Once deployed, update your `render.yaml` with actual URLs:

```yaml
services:
  - type: web
    name: genai-crm-backend
    # ... backend config
    envVars:
      - key: FRONTEND_URL
        value: https://your-actual-frontend-url.com

  - type: web  
    name: genai-crm-frontend
    # ... frontend config
    envVars:
      - key: REACT_APP_API_BASE_URL
        value: https://your-actual-backend-url.onrender.com
```

## 🔧 Environment Variables Summary

### Backend (Render Web Service)
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
PORT=10000
```

### Frontend (Render Static Site or Netlify)
```
REACT_APP_API_BASE_URL=https://your-backend-domain.onrender.com
```

## 🧪 Testing Deployment

### 1. Test Backend API
Visit: `https://your-backend-domain.onrender.com/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:00:00.000Z",
  "version": "1.0.0"
}
```

### 2. Test Anthropic Integration
Visit: `https://your-backend-domain.onrender.com/api/ai/test`

Should return:
```json
{
  "success": true
}
```

### 3. Test Frontend
1. Open your frontend URL
2. Go to AI Assistant page
3. Should show "Anthropic Connected" status
4. Try submitting a query with repositories selected

## 🚨 Security Checklist

- ✅ API key is only in backend environment (not frontend)
- ✅ CORS is configured for your frontend domain
- ✅ HTTPS is enabled (automatic with Render)
- ✅ Helmet security headers are enabled
- ✅ Request validation is in place

## 🔄 Development vs Production

| Environment | API Calls | API Key Location | CORS |
|-------------|-----------|------------------|------|
| Development | Direct to Anthropic | Frontend `.env` | Disabled |
| Production | Via Backend Proxy | Backend Environment | Enabled |

## 🛠 Troubleshooting

### "API Key Missing" Error
- Check backend environment variables in Render dashboard
- Ensure `ANTHROPIC_API_KEY` is set correctly
- Restart backend service

### CORS Errors
- Verify `FRONTEND_URL` matches your actual frontend domain
- Check browser network tab for exact error
- Ensure both HTTP and HTTPS are handled

### "Backend Connection Failed"
- Check `REACT_APP_API_BASE_URL` in frontend environment
- Verify backend service is running
- Test backend health endpoint directly

### Repository Modal Not Working
- Repositories are saved in browser localStorage
- No backend storage required for basic functionality
- Check browser console for JavaScript errors

## 📊 Monitoring

### Backend Health
- Health endpoint: `/health`
- API test endpoint: `/api/ai/test` 
- Check Render service logs

### Frontend Performance
- Check build size in deployment logs
- Monitor Core Web Vitals
- Test responsive design

## 💰 Cost Considerations

### Render Pricing
- Backend: ~$7/month for basic plan
- Static site: Free tier available

### Anthropic API
- Pay per token usage
- Monitor usage in Anthropic console
- Set usage alerts

## 🚀 Going Live

1. ✅ Deploy backend to Render
2. ✅ Configure environment variables
3. ✅ Deploy frontend
4. ✅ Test all functionality
5. ✅ Configure custom domain (optional)
6. ✅ Set up monitoring
7. ✅ Share with users!

Your GenAI CRM Dashboard is now production-ready with secure Anthropic Claude integration! 🎉