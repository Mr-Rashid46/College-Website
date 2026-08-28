# Hosting, Infrastructure & Deployment Operational Guide

This document details the exact hosting topology, environment variable specifications, process manager configurations, and domain DNS setup for the NKTT College CMS platform.

---

## 1. System Architecture Overview

- **Frontend Client**: React 18, Vite, TailwindCSS, React-Helmet-Async (Hosted on Vercel / Netlify or served via Nginx static bundle).
- **Backend API**: Node.js, Express 4, Helmet, JWT, Multer (Managed via PM2 on Ubuntu Linux VPS or Render/DigitalOcean App Platform).
- **Database**: MongoDB Atlas Cluster (Replica Set with TLS encryption).
- **Media Uploads**: Local persistent volume (`/server/uploads`) or Cloudinary CDN storage.

---

## 2. Environment Variables Configuration (`.env`)

### Server Environment (`server/.env`)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+size://admin:<PASSWORD>@nktt-cluster.mongodb.net/college-cms?retryWrites=true&w=majority
JWT_SECRET=production_super_secure_jwt_secret_key_nktt_2026
JWT_EXPIRE=8h
CLIENT_URL=https://nkttcollege.edu.in
```

### Client Environment (`client/.env`)
```env
VITE_API_URL=https://api.nkttcollege.edu.in/api
```

---

## 3. Server Deployment using PM2 & Nginx

### Step 1: Install Dependencies & Process Manager
```bash
sudo apt update && sudo apt install -y nodejs npm nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

### Step 2: PM2 Ecosystem File (`server/ecosystem.config.js`)
```javascript
module.exports = {
  apps: [
    {
      name: 'nktt-cms-api',
      script: 'server.js',
      cwd: '/var/www/college-cms/server',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    },
    {
      name: 'nktt-cms-backup-cron',
      script: 'scripts/db-backup.js',
      cwd: '/var/www/college-cms/server',
      cron_restart: '0 2 * * *', // Runs daily at 2:00 AM
      autorestart: false,
    },
  ],
};
```

### Step 3: Nginx Reverse Proxy & SSL Setup (`/etc/nginx/sites-available/nkttcollege`)
```nginx
server {
    server_name nkttcollege.edu.in www.nkttcollege.edu.in;

    location / {
        root /var/www/college-cms/client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /uploads {
        alias /var/www/college-cms/server/uploads;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

### Step 4: Enable HTTPS Certificate (Let's Encrypt / Certbot)
```bash
sudo certbot --nginx -d nkttcollege.edu.in -d www.nkttcollege.edu.in
```

---

## 4. DNS Mapping Records

| Type | Name / Host | Target / Points To | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `192.0.2.1` (Server IP) | 3600 | Apex Domain Routing |
| **CNAME** | `www` | `nkttcollege.edu.in` | 3600 | WWW Subdomain Canonical |
| **CNAME** | `api` | `nkttcollege.edu.in` | 3600 | REST API Endpoint Routing |
| **TXT** | `@` | `google-site-verification=...` | 3600 | Google Search Console |

---

## 5. Daily Backup Verification & Restore Command

To restore database from backup JSON or mongodump:
```bash
# Restore via mongorestore CLI:
mongorestore --uri="mongodb+srv://admin:<PASSWORD>@nktt-cluster.mongodb.net/college-cms" /var/www/college-cms/server/backups/backup-2026-08-26/college-cms
```
