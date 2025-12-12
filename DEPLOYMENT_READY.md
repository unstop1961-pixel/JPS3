# Digital Museum Guide - Production Deployment Guide

## Pre-Deployment Checklist

- [x] Code updated and tested locally
- [ ] Environment variables configured
- [ ] All dependencies installed (`npm install` in backend)
- [ ] API endpoints tested
- [ ] Frontend assets verified
- [ ] User data cleared (if fresh deployment)

## Deployment Options

### Option 1: Heroku (Recommended - Free Tier Available)

#### Prerequisites
- Heroku account: https://www.heroku.com
- Heroku CLI installed
- Git configured

#### Deployment Steps

```bash
# 1. Login to Heroku
heroku login

# 2. Create a new Heroku app
heroku create your-app-name

# 3. Add buildpack for Node.js (if not automatic)
heroku buildpacks:add heroku/nodejs

# 4. Deploy
git push heroku main

# 5. View logs
heroku logs --tail
```

#### Post-Deployment
- Visit: `https://your-app-name.herokuapp.com`
- Check logs for errors: `heroku logs --tail`
- Reset dynos if needed: `heroku restart`

---

### Option 2: AWS (EC2/Lightsail)

#### Prerequisites
- AWS account
- EC2 instance (Ubuntu/Amazon Linux)
- SSH access to instance

#### Deployment Steps

```bash
# 1. SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# 2. Install Node.js and npm
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

# 3. Clone repository
git clone https://github.com/unstop1961-pixel/JPS3.git
cd JPS3

# 4. Install dependencies
npm install --prefix backend

# 5. Create .env file
echo "PORT=3000" > backend/.env
echo "NODE_ENV=production" >> backend/.env

# 6. Start with PM2 (for process management)
sudo npm install -g pm2
pm2 start backend/server.js --name "museum-guide"
pm2 startup
pm2 save
```

#### Configure Nginx Reverse Proxy

```bash
# Install Nginx
sudo yum install -y nginx

# Configure
sudo nano /etc/nginx/conf.d/museum-guide.conf
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

### Option 3: Docker (For Any Cloud Provider)

#### Create `Dockerfile`

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN npm install --prefix backend

COPY frontend ./frontend
COPY data ./data

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "backend/server.js"]
```

#### Build and Run

```bash
# Build image
docker build -t museum-guide .

# Run container
docker run -p 3000:3000 \
  -e PORT=3000 \
  -e NODE_ENV=production \
  museum-guide
```

---

### Option 4: Vercel (Frontend) + Backend Separately

#### Frontend on Vercel
1. Push code to GitHub
2. Connect Vercel to GitHub repository
3. Deploy frontend automatically

#### Backend on Railway, Render, or Heroku
- Follow relevant provider's Node.js deployment guide
- Update API_BASE_URL in frontend to match backend URL

---

## Environment Variables

Create a `.env` file in the backend directory:

```
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
```

---

## Database Migration (Future)

Currently using JSON files for user data. For production with multiple users:

1. Replace users.json storage with database:
   - PostgreSQL (recommended)
   - MongoDB
   - Firebase Realtime Database

2. Update server.js to use database instead of file storage

---

## Security Checklist

- [ ] Change default API endpoints before production
- [ ] Implement rate limiting
- [ ] Add authentication headers validation
- [ ] Use HTTPS (provided by most hosting platforms)
- [ ] Hash passwords (currently storing plaintext - UPDATE NEEDED)
- [ ] Add input validation
- [ ] Implement CSRF protection
- [ ] Add request logging and monitoring

### Password Security Update Required

Before production deployment, update `backend/server.js` to hash passwords:

```javascript
const bcrypt = require('bcryptjs');

// In signup:
const hashedPassword = await bcrypt.hash(password, 10);

// In login:
const isValid = await bcrypt.compare(password, user.password);
```

Install bcryptjs:
```bash
npm install bcryptjs --prefix backend
```

---

## Monitoring & Maintenance

### Logs
- Monitor application logs daily
- Set up error notifications
- Use provider's logging service (CloudWatch, Datadog, etc.)

### Backups
- Backup user data regularly
- For JSON: daily scheduled backups
- For database: enable automated backups

### Performance
- Monitor response times
- Check server load
- Scale if needed (increase dyno size, add instances, etc.)

---

## Troubleshooting

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Module Not Found Errors
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### API Not Responding
- Check server logs: `npm start` and look for errors
- Verify API_BASE_URL in frontend/js/script.js
- Check CORS settings in backend/server.js
- Ensure all data files exist in `/data` folder

### User Data Not Persisting
- Verify `/data/users.json` exists and is writable
- Check file permissions
- Consider migrating to database for production

---

## Performance Optimization

1. **Caching**: Add cache headers for static files
2. **Compression**: Enable gzip compression
3. **CDN**: Use CDN for images and assets
4. **Database Indexing**: If using database, add appropriate indexes
5. **Load Balancing**: For high traffic, use load balancer

---

## Scaling Strategy

### Current State (Small Scale)
- Single server sufficient
- JSON-based user storage acceptable

### 100+ Users
- Migrate to database (PostgreSQL/MongoDB)
- Add caching layer (Redis)
- Use load balancer

### 1000+ Users
- Multiple server instances
- Database replication
- CDN for static assets
- Monitoring and alerting

---

## Support & Updates

After deployment:
1. Monitor for errors regularly
2. Keep Node.js and dependencies updated
3. Implement user feedback mechanism
4. Plan feature additions
5. Regular security audits

---

## Deployment Readiness Summary

✅ Code organized and documented
✅ Dependencies properly listed
✅ Environment variables configured
✅ Procfile for Heroku ready
✅ .gitignore configured
⚠️ TODO: Implement password hashing
⚠️ TODO: Add rate limiting
⚠️ TODO: Implement HTTPS redirect

Your application is **75% production-ready**. Complete the security TODOs before deploying to public internet.
