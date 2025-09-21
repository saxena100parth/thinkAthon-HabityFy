# HabityFy Deployment Guide

## 🚀 Overview

This guide covers deploying the HabityFy application to production environments. The application consists of a React frontend and a Node.js backend with MongoDB database.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or MongoDB instance
- Git
- Domain name (optional)
- SSL certificate (for production)

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account
   - Create a new cluster

2. **Configure Database**
   - Choose a cloud provider and region
   - Select cluster tier (M0 for development, M10+ for production)
   - Configure network access (add your IP addresses)
   - Create database user with read/write permissions

3. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/habityfy
   ```

### Local MongoDB (Alternative)

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb
   
   # macOS with Homebrew
   brew install mongodb
   
   # Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB Service**
   ```bash
   sudo systemctl start mongod
   # or
   mongod --dbpath /var/lib/mongodb
   ```

## 🔧 Environment Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
# Application
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/habityfy

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Email Service (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# CORS
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_NAME=HabityFy
VITE_APP_VERSION=1.0.0
```

## 🖥️ Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Ubuntu/Debian
   curl https://cli-assets.heroku.com/install.sh | sh
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create habityfy-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set EMAIL_HOST=smtp.gmail.com
   heroku config:set EMAIL_PORT=587
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push heroku main
   ```

5. **Seed Database**
   ```bash
   heroku run npm run seed-master-habits
   ```

### Option 2: DigitalOcean App Platform

1. **Create App**
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect your GitHub repository

2. **Configure App**
   - **Source**: Select backend directory
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
   - **Environment Variables**: Add all required variables

3. **Deploy**
   - Click "Create Resources"
   - Wait for deployment to complete

### Option 3: AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Select t3.micro (free tier) or larger
   - Configure security group (ports 22, 80, 443, 5000)

2. **Connect and Setup**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/habityfy.git
   cd habityfy/backend
   
   # Install dependencies
   npm install --production
   
   # Create PM2 ecosystem file
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'habityfy-backend',
       script: 'server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 5000
       }
     }]
   };
   EOF
   
   # Start application
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/habityfy
   ```
   
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/habityfy /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 🌐 Frontend Deployment

### Option 1: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add `VITE_API_URL` with your backend URL

### Option 2: Netlify

1. **Build Application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your GitHub repository

3. **Configure Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add `VITE_API_URL` with your backend URL

### Option 3: AWS S3 + CloudFront

1. **Build Application**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Configure CloudFront**
   - Create CloudFront distribution
   - Set S3 bucket as origin
   - Configure custom domain and SSL certificate

## 🔒 SSL Certificate Setup

### Let's Encrypt (Free)

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Obtain Certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Cloudflare (Recommended)

1. **Add Domain to Cloudflare**
   - Sign up at [Cloudflare](https://cloudflare.com)
   - Add your domain
   - Update nameservers

2. **Configure SSL**
   - Go to SSL/TLS settings
   - Set encryption mode to "Full (strict)"
   - Enable "Always Use HTTPS"

## 📊 Monitoring and Logging

### Application Monitoring

1. **PM2 Monitoring**
   ```bash
   pm2 monit
   pm2 logs
   ```

2. **Nginx Logs**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

### Database Monitoring

1. **MongoDB Atlas Monitoring**
   - Use built-in monitoring dashboard
   - Set up alerts for performance issues

2. **Custom Monitoring**
   ```javascript
   // Add to server.js
   const os = require('os');
   
   setInterval(() => {
     const memUsage = process.memoryUsage();
     const cpuUsage = process.cpuUsage();
     
     console.log('Memory Usage:', memUsage);
     console.log('CPU Usage:', cpuUsage);
   }, 60000); // Every minute
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd backend
          npm ci
          
      - name: Run tests
        run: |
          cd backend
          npm test
          
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "habityfy-backend"
          heroku_email: "your-email@example.com"
          appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Build application
        run: |
          cd frontend
          npm run build
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Check MongoDB connection
   mongo "mongodb+srv://username:password@cluster.mongodb.net/habityfy"
   
   # Check network connectivity
   ping cluster.mongodb.net
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port
   sudo lsof -i :5000
   
   # Kill process
   sudo kill -9 PID
   ```

3. **Memory Issues**
   ```bash
   # Check memory usage
   free -h
   
   # Restart PM2
   pm2 restart all
   ```

4. **SSL Certificate Issues**
   ```bash
   # Check certificate
   openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -text -noout
   
   # Renew certificate
   sudo certbot renew
   ```

### Log Analysis

1. **Application Logs**
   ```bash
   pm2 logs habityfy-backend
   ```

2. **Nginx Logs**
   ```bash
   sudo tail -f /var/log/nginx/error.log | grep habityfy
   ```

3. **System Logs**
   ```bash
   sudo journalctl -u nginx -f
   ```

## 📈 Performance Optimization

### Backend Optimization

1. **Enable Gzip Compression**
   ```javascript
   // In server.js
   const compression = require('compression');
   app.use(compression());
   ```

2. **Database Indexing**
   ```javascript
   // Add indexes for frequently queried fields
   db.habits.createIndex({ "userId": 1, "isActive": 1 });
   db.dailystats.createIndex({ "userId": 1, "date": 1 });
   ```

3. **Caching**
   ```javascript
   // Add Redis caching
   const redis = require('redis');
   const client = redis.createClient();
   
   // Cache frequently accessed data
   app.get('/api/habits', async (req, res) => {
     const cacheKey = `habits:${req.user.id}`;
     const cached = await client.get(cacheKey);
     
     if (cached) {
       return res.json(JSON.parse(cached));
     }
     
     const habits = await Habit.find({ userId: req.user.id });
     await client.setex(cacheKey, 300, JSON.stringify(habits));
     res.json(habits);
   });
   ```

### Frontend Optimization

1. **Code Splitting**
   ```javascript
   // Lazy load components
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   const Landing = lazy(() => import('./pages/Landing'));
   ```

2. **Image Optimization**
   ```javascript
   // Use optimized images
   import { Image } from 'react-optimized-image';
   ```

3. **Service Worker**
   ```javascript
   // Add service worker for caching
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/sw.js');
   }
   ```

## 🔐 Security Checklist

- [ ] Environment variables are properly set
- [ ] Database credentials are secure
- [ ] JWT secret is strong and unique
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented
- [ ] HTTPS is enabled
- [ ] Security headers are set
- [ ] Regular security updates
- [ ] Backup strategy is in place

## 📋 Maintenance

### Daily Tasks
- Monitor application logs
- Check database performance
- Verify backup completion

### Weekly Tasks
- Review security logs
- Update dependencies
- Check disk space

### Monthly Tasks
- Security audit
- Performance review
- Backup restoration test

---

This deployment guide provides comprehensive instructions for deploying the HabityFy application to various platforms. Choose the option that best fits your needs and budget. For additional support, please contact the development team.
