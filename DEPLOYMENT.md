# Deployment & Hosting Guide

## Local Deployment (Already Done!)

Your Digital Museum Guide is ready to run locally. See QUICKSTART.md for instructions.

---

## Cloud Deployment Options

### Option 1: Heroku (Recommended for Beginners)

#### Step 1: Prepare Application

1. Create `.gitignore` file in root directory:
```
node_modules/
data/users.json
.env
.DS_Store
```

2. Create `.env` file in backend:
```
PORT=3000
NODE_ENV=production
```

3. Update `backend/package.json` with Heroku start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  }
}
```

#### Step 2: Deploy

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

2. Create Heroku app:
```bash
heroku login
heroku create museum-guide-app
```

3. Deploy code:
```bash
git push heroku main
```

4. Your app is live at: `https://museum-guide-app.herokuapp.com`

#### Step 3: Update Frontend API URL

Edit `frontend/js/script.js`:
```javascript
// Change from:
const API_BASE_URL = 'http://localhost:3000/api';

// To:
const API_BASE_URL = 'https://museum-guide-app.herokuapp.com/api';
```

---

### Option 2: AWS (Scalable Solution)

#### Components Needed:
- **EC2** for backend server
- **S3** for static frontend
- **RDS** for database (optional)
- **CloudFront** for CDN

#### Setup Steps:

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Install Node.js and npm
   - Clone repository
   - Run backend server

2. **Upload Frontend to S3**
   - Create S3 bucket
   - Upload all frontend files
   - Enable static website hosting
   - Update CORS settings

3. **Configure CloudFront**
   - Create distribution
   - Point to S3 bucket
   - Setup SSL certificate

4. **Setup RDS Database**
   - Create PostgreSQL instance
   - Configure security groups
   - Update backend connection string

---

### Option 3: DigitalOcean (Cost-Effective)

#### Step 1: Create Droplet

1. Sign up: https://www.digitalocean.com
2. Create new Droplet:
   - Choose Ubuntu 20.04
   - Select $5/month plan
   - Choose nearest region

#### Step 2: Configure Server

```bash
# SSH into droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Clone your repository
git clone your_repo_url
cd your_repo/backend
npm install

# Start application
pm2 start server.js
pm2 startup
pm2 save
```

#### Step 3: Setup Nginx (Reverse Proxy)

```bash
# Install Nginx
apt install -y nginx

# Edit config
nano /etc/nginx/sites-available/default
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/your_app/frontend;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Restart Nginx
systemctl restart nginx

# Setup SSL with Let's Encrypt
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your_domain.com
```

---

### Option 4: Docker Containerization

#### Create Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production

  frontend:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./frontend:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
```

#### Run with Docker

```bash
docker-compose up -d
```

---

## Database Migration (Production)

### Switch from JSON to MongoDB

#### Install MongoDB

```bash
# Local installation
npm install mongodb

# Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
```

#### Update backend/server.js

```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  await client.connect();
  return client.db('museum_guide');
}

// Replace JSON file operations with MongoDB queries
```

### Example MongoDB Collections

```javascript
// users collection
{
  _id: ObjectId(),
  email: "user@example.com",
  username: "User Name",
  password: "hashed_password",
  createdAt: ISODate(),
  wishlist: [1, 2, 3],
  visitedLog: [{museumId: 1, visitDate: "2025-01-15"}],
  reviewDiary: [{museumId: 1, rating: 5, notes: "Great!"}],
  quizScores: [{score: 8, total: 12, date: ISODate()}]
}

// museums collection (copy from museums.json)
// quizzes collection (copy from quiz.json)
```

---

## Security Setup

### 1. Install HTTPS/SSL

```bash
# Using Let's Encrypt (Free)
apt install certbot
certbot certonly --standalone -d yourdomain.com
```

### 2. Environment Variables

Create `.env` file:
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/museum
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=https://yourdomain.com
```

### 3. Update backend/server.js

```javascript
require('dotenv').config();

const cors = require('cors');
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Use environment variables
const PORT = process.env.PORT || 3000;
```

### 4. Hash Passwords (Production)

```bash
npm install bcrypt
```

```javascript
const bcrypt = require('bcrypt');

// On signup:
const hashedPassword = await bcrypt.hash(password, 10);

// On login:
const isMatch = await bcrypt.compare(password, storedHash);
```

---

## Performance Optimization

### 1. Enable Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Add Caching Headers

```javascript
app.use(express.static('frontend', {
  maxAge: '1d'
}));
```

### 3. Setup CDN

- Use Cloudflare (free tier available)
- Cache static assets
- Enable GZIP compression

### 4. Database Indexing

```javascript
// Create indexes for faster queries
db.collection('users').createIndex({ email: 1 });
db.collection('museums').createIndex({ name: 1 });
```

---

## Monitoring & Logging

### 1. Setup PM2 Monitoring

```bash
npm install -g pm2-logrotate
pm2 install pm2-logrotate

# View logs
pm2 logs

# Monitor CPU/Memory
pm2 monit
```

### 2. Add Application Logging

```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('User logged in', { email: user.email });
```

---

## Backup Strategy

### 1. Database Backup

```bash
# MongoDB backup
mongodump --uri "mongodb://..." --out ./backup

# Restore
mongorestore --uri "mongodb://..." ./backup
```

### 2. Automated Backups

```bash
# Create backup script (backup.sh)
#!/bin/bash
mongodump --uri "$MONGODB_URI" --out /backups/$(date +%Y%m%d)

# Schedule with cron (daily at 2 AM)
0 2 * * * /home/ubuntu/backup.sh
```

---

## Scaling Checklist

### For 100+ Users
- [ ] Setup database (MongoDB/PostgreSQL)
- [ ] Add Redis caching
- [ ] Enable session storage (Redis)
- [ ] Setup load balancer (Nginx)
- [ ] Add monitoring (PM2/Datadog)

### For 1000+ Users
- [ ] Database replication/sharding
- [ ] CDN for static assets
- [ ] Microservices architecture
- [ ] API rate limiting
- [ ] Advanced monitoring
- [ ] Auto-scaling setup

### For 10000+ Users
- [ ] Kubernetes orchestration
- [ ] Multi-region deployment
- [ ] Advanced caching strategy
- [ ] Database optimization
- [ ] Real-time analytics
- [ ] Disaster recovery plan

---

## Cost Estimation

### Monthly Hosting Costs (USD)

| Provider | Setup | Monthly | Notes |
|----------|-------|---------|-------|
| **Heroku** | Free | $7 | Easiest deployment |
| **DigitalOcean** | $0 | $5-20 | Great value |
| **AWS** | $0 | $10-50 | Most scalable |
| **Vercel** | Free | Free* | Frontend only |

*Free tier with paid options

---

## Post-Deployment Checklist

- [ ] Test all features in production
- [ ] Verify database backups working
- [ ] Setup monitoring/alerts
- [ ] Configure SSL/HTTPS
- [ ] Update documentation
- [ ] Create user guide
- [ ] Setup error tracking (Sentry)
- [ ] Monitor performance metrics
- [ ] Setup automated tests
- [ ] Configure CI/CD pipeline

---

## Troubleshooting Production

### High Memory Usage
```bash
# Check memory
free -h

# Increase Node heap
NODE_OPTIONS=--max-old-space-size=2048 npm start
```

### Database Connection Issues
```
- Check connection string
- Verify security groups/firewall
- Check database user permissions
- Review logs for errors
```

### API Rate Limiting
```bash
npm install express-rate-limit

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));
```

### Cache Invalidation
```javascript
// Clear cache when data changes
app.post('/api/user/review', async (req, res) => {
  // ... save review
  cache.del(`user_${email}`);  // Invalidate cache
});
```

---

## Support Resources

- **Node.js Docs**: https://nodejs.org/docs
- **Express.js Docs**: https://expressjs.com
- **Heroku Docs**: https://devcenter.heroku.com
- **DigitalOcean Docs**: https://docs.digitalocean.com
- **AWS Docs**: https://docs.aws.amazon.com
- **MongoDB Docs**: https://docs.mongodb.com

---

*This guide covers various deployment options from local to production scale.*
*Choose the option that best fits your needs and budget.*
