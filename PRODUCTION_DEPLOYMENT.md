# Production Deployment Guide

## Overview
This guide covers deploying the Digital Museum Guide to production environments.

## Pre-Deployment Checklist

### 1. Security
- [ ] Change JWT_SECRET in `.env` to a strong random value
- [ ] Set NODE_ENV to `production`
- [ ] Configure ALLOWED_ORIGINS for CORS
- [ ] Use HTTPS only in production
- [ ] Review and update security headers
- [ ] Implement rate limiting if needed
- [ ] Use strong passwords for any admin accounts

### 2. Environment Setup
- [ ] Node.js 18+ installed
- [ ] All dependencies installed: `npm install`
- [ ] `.env` file configured with production values
- [ ] Data directory writable for user.json
- [ ] Logs directory configured (optional)

### 3. Performance
- [ ] Enable caching where appropriate
- [ ] Configure CDN for static assets if needed
- [ ] Optimize images in `/data` folder
- [ ] Monitor server memory usage
- [ ] Set up automated backups

## Deployment Options

### Option 1: Traditional Server (Linux/Ubuntu)

#### 1. Clone Repository
```bash
cd /var/www
git clone https://github.com/unstop1961-pixel/JPS3.git
cd JPS3
npm install
```

#### 2. Configure Environment
```bash
cp .env.production .env
# Edit .env with your production values
nano .env
```

#### 3. Install Process Manager (PM2)
```bash
npm install -g pm2
pm2 start backend/server.js --name "museum-guide"
pm2 startup
pm2 save
```

#### 4. Set Up Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 5. Enable SSL Certificate (Let's Encrypt)
```bash
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com
```

### Option 2: Vercel Deployment

#### 1. Push to GitHub
```bash
git add .
git commit -m "Production deployment"
git push origin main
```

#### 2. Connect to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import from GitHub
4. Select JPS3 repository
5. Set environment variables:
   - `NODE_ENV=production`
   - `ALLOWED_ORIGINS=your-vercel-domain.vercel.app`

#### 3. Deploy
```bash
vercel --prod
```

### Option 3: Docker Containerization

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t museum-guide:latest .
docker run -d --name museum-guide \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  museum-guide:latest
```

## Monitoring & Maintenance

### Health Checks
```bash
# Check server status
curl https://your-domain.com/health

# Get API status
curl https://your-domain.com/api/status
```

### Logging
Monitor server logs:
```bash
# With PM2
pm2 logs museum-guide

# With Docker
docker logs -f museum-guide
```

### Backup Strategy
```bash
# Backup user data daily
0 2 * * * tar -czf /backups/museum-guide-$(date +%Y%m%d).tar.gz /var/www/JPS3/data/
```

## Performance Optimization

### 1. Enable Caching
Update backend/server.js:
```javascript
const cacheControl = (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
};
app.use('/data', cacheControl, express.static(...));
```

### 2. Compression
Add to backend/server.js:
```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Database Optimization
Consider migrating user data to a database for production.

## Troubleshooting

### Port Already in Use
```bash
# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Memory Issues
```bash
# Increase Node memory
NODE_OPTIONS="--max_old_space_size=2048" npm start
```

### CORS Errors
Update `ALLOWED_ORIGINS` in `.env` with your actual domain.

## Security Best Practices

1. **Always use HTTPS** in production
2. **Keep dependencies updated**: `npm audit fix`
3. **Use environment variables** for sensitive data
4. **Enable rate limiting** for API endpoints
5. **Implement request validation** for all inputs
6. **Use strong session tokens**
7. **Monitor server logs** for suspicious activity
8. **Regular security audits**

## Support
For issues or questions, contact: Digital Museum Guide Team

---
Last Updated: December 2024
