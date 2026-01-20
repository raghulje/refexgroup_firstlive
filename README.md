# Refex Group Production Website

A comprehensive full-stack web application for Refex Group featuring a modern React/TypeScript frontend with Vite and a robust Express.js backend with MySQL database. The application includes a complete Content Management System (CMS) for dynamic content management.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Building the Application](#building-the-application)
- [Database Setup](#database-setup)
- [Media Files Setup](#media-files-setup)
- [Docker Deployment](#docker-deployment)
- [Verification & Testing](#verification--testing)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

---

## 🎯 Project Overview

This is an enterprise-grade website for Refex Group with the following key features:

- **Full CMS Integration**: Complete content management system for all website content
- **Multi-Page Support**: 20+ pages including business verticals, careers, ESG, gallery, and more
- **Dynamic Content**: All content managed through admin panel (no hardcoded content)
- **Media Management**: Centralized media library with organized folder structure
- **Version Control**: Track all content changes with version history
- **Role-Based Access**: Multiple user roles (Super Admin, Admin, Editor, Viewer)
- **Audit Logging**: Complete audit trail of all system activities
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 7.0.3
- **Routing**: React Router DOM 7.6.3
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: React Hooks + Context API
- **HTTP Client**: Axios 1.13.2
- **Internationalization**: i18next 25.4.1
- **Animations**: AOS (Animate On Scroll) 2.3.4

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.19.2
- **ORM**: Sequelize 6.37.3
- **Database**: MySQL 8.0+
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcrypt 6.0.0
- **File Upload**: Multer 1.4.5-lts.1
- **Email**: Nodemailer 6.10.1
- **Validation**: express-validator 7.0.1
- **Rate Limiting**: express-rate-limit 7.1.5

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MySQL with utf8mb4 encoding
- **File Storage**: Local filesystem (`server/uploads/`)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **MySQL**: v8.0 or higher ([Download](https://dev.mysql.com/downloads/mysql/))
- **Docker**: v20.10 or higher ([Download](https://www.docker.com/get-started))
- **Docker Compose**: v2.0 or higher (comes with Docker Desktop)
- **Git**: Latest version ([Download](https://git-scm.com/downloads))

### Verify Installation

```bash
# Check Node.js version
node --version  # Should be v18.0.0 or higher

# Check npm version
npm --version  # Should be v9.0.0 or higher

# Check MySQL version
mysql --version  # Should be v8.0 or higher

# Check Docker version
docker --version  # Should be v20.10 or higher

# Check Docker Compose version
docker-compose --version  # Should be v2.0 or higher
```

---

## 📁 Project Structure

```
RefexGroup_Prod/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── pages/         # Page components (264 TSX files)
│   │   ├── components/     # Reusable components
│   │   ├── services/      # API service layer
│   │   ├── router/        # Routing configuration
│   │   ├── types/         # TypeScript type definitions
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration files
│   ├── public/            # Static assets (SVG icons, images)
│   ├── out/               # Production build output (generated)
│   └── package.json
│
├── server/                 # Node.js backend API
│   ├── controllers/       # Route controllers (32 files)
│   ├── models/            # Sequelize models (53 files)
│   ├── routes/            # API route definitions (32 files)
│   ├── middlewares/       # Express middlewares
│   ├── services/          # Business logic services
│   ├── scripts/           # Database seeding & migration scripts (104 files)
│   ├── uploads/           # Uploaded files storage (NOT in git - 4GB+)
│   │   ├── images/        # Image uploads organized by page/section
│   │   ├── documents/     # Document uploads
│   │   └── resumes/      # Job application resumes
│   ├── config/            # Database configuration
│   └── package.json
│
├── 02012026.sql           # Database export file (import this)
├── docker-compose.yml     # Docker configuration
└── README.md              # This file
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/raghulje/refexgroup_02012026.git
cd refexgroup_02012026
```

### Step 2: Install Dependencies

#### Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

#### Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

**Note**: This may take a few minutes as it installs all required packages.

---

## ⚙️ Environment Configuration

### Step 3: Configure Backend Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
touch .env  # On Windows: type nul > .env
```

Add the following configuration to `server/.env`:

```env
# Server Configuration
PORT=3002
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=refex_db
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters

# Client Serving (Set to 'true' to serve built client files)
SERVE_CLIENT=true

# Email Configuration (Optional - can be configured via CMS)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_NAME=Refex Group
SMTP_FROM_EMAIL=noreply@refexgroup.com
```

**Important Notes**:
- Replace `your_mysql_username` and `your_mysql_password` with your MySQL credentials
- Replace `your_super_secret_jwt_key_here_minimum_32_characters` with a strong random string (minimum 32 characters)
- Set `SERVE_CLIENT=true` to enable the server to serve the built frontend files
- Email configuration is optional and can be configured later via CMS

### Step 4: Configure Frontend Environment Variables

Create a `.env` file in the `client/` directory:

```bash
cd client
touch .env  # On Windows: type nul > .env
```

Add the following configuration to `client/.env`:

```env
# API Base URL
# For production (when served by same server), this can be empty
# For development, use: http://localhost:3002/api/v1
VITE_API_URL=http://localhost:3002/api/v1
```

**Note**: If `SERVE_CLIENT=true` in server `.env`, the frontend will automatically use the same origin, so `VITE_API_URL` can be left empty or set to the production URL.

---

## 🏗 Building the Application

### Step 5: Build the Frontend

Navigate to the `client/` directory and build the production bundle:

```bash
cd client
npm run build
```

This command will:
- Compile TypeScript to JavaScript
- Bundle and optimize all assets
- Generate production-ready static files
- Create the `out/` directory with optimized build

**Expected Output**:
```
✓ built in X.XXs
```

**Build Output Location**: `client/out/`

**Important**: The build process may take 2-5 minutes depending on your system. Ensure you have sufficient disk space (approximately 500MB for the build output).

---

## 🗄 Database Setup

### Step 6: Create MySQL Database

#### Option A: Using MySQL Command Line

```bash
# Connect to MySQL
mysql -u root -p

# Create the database
CREATE DATABASE refex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit MySQL
EXIT;
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Click "Create a new schema" (or use the SQL tab)
4. Enter schema name: `refex_db`
5. Set character set to `utf8mb4` and collation to `utf8mb4_unicode_ci`
6. Click "Apply"

### Step 7: Import Database

Import the database export file:

```bash
# Using MySQL command line
mysql -u your_mysql_username -p refex_db < 02012026.sql
```

**Or using MySQL Workbench**:
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Select `refex_db` database
4. Go to `Server` → `Data Import`
5. Select "Import from Self-Contained File"
6. Browse and select `02012026.sql`
7. Click "Start Import"

**Expected Time**: The import may take 5-15 minutes depending on database size.

**Verification**: After import, verify the database:

```bash
mysql -u your_mysql_username -p refex_db -e "SHOW TABLES;"
```

You should see multiple tables listed (pages, sections, media, users, etc.).

---

## 📁 Media Files Setup

### Step 8: Transfer Uploads Folder

**Important**: The `server/uploads/` folder is **NOT** included in the git repository due to its large size (4GB+). You need to manually transfer this folder to your server.

#### Option A: Using SCP (Secure Copy)

```bash
# From your local machine or source server
scp -r /path/to/uploads user@your-server-ip:/path/to/RefexGroup_Prod/server/

# Example:
scp -r ./server/uploads user@192.168.1.100:/home/user/refexgroup_02012026/server/
```

#### Option B: Using SFTP

1. Connect to your server using an SFTP client (FileZilla, WinSCP, etc.)
2. Navigate to `server/` directory on the server
3. Upload the entire `uploads/` folder from your local machine

#### Option C: Manual Transfer

1. Compress the `uploads/` folder on the source:
   ```bash
   tar -czf uploads.tar.gz server/uploads/
   ```
2. Transfer the compressed file to the server
3. Extract on the server:
   ```bash
   tar -xzf uploads.tar.gz
   ```

### Step 9: Verify Uploads Folder Structure

After transferring, verify the folder structure:

```bash
cd server
ls -la uploads/
```

You should see:
```
uploads/
├── images/
│   ├── home/
│   ├── about-refex/
│   ├── gallery/
│   └── [other pages]/
├── documents/
└── resumes/
```

**Set Proper Permissions** (Linux/Production):

```bash
# Set ownership (adjust user:group as needed)
sudo chown -R www-data:www-data server/uploads/

# Set permissions
sudo chmod -R 755 server/uploads/
```

---

## 🐳 Docker Deployment

### Step 10: Stop Existing Containers (if any)

Before starting, ensure no existing containers are running:

```bash
docker-compose down
```

This command will:
- Stop all running containers
- Remove containers
- Remove networks (if not external)

### Step 11: Start Docker Containers

Start the application using Docker Compose:

```bash
docker-compose up -d
```

The `-d` flag runs containers in detached mode (background).

**What this does**:
- Pulls the Node.js 23 base image (if not already present)
- Creates a container named `refexgroup-uat`
- Mounts `./server` and `./client` as volumes
- Loads environment variables from `server/.env`
- Starts the server with `npm start`
- Exposes port 3002

**Expected Output**:
```
Creating network "refexgroup_02012026_proxy" ... done
Creating refexgroup-uat ... done
```

### Step 12: Verify Container Status

Check if the container is running:

```bash
docker-compose ps
```

**Expected Output**:
```
NAME                IMAGE      COMMAND       STATUS        PORTS
refexgroup-uat      node:23    "npm start"   Up X seconds  3002/tcp
```

### Step 13: View Container Logs

Monitor the application logs:

```bash
docker-compose logs -f
```

**Expected Log Output**:
```
Server is running on port 3002.
Database connection established.
Tables synchronized successfully.
```

Press `Ctrl+C` to exit log viewing (container continues running).

---

## ✅ Verification & Testing

### Step 14: Check Server Health

Test if the server is responding:

```bash
# Using curl
curl http://localhost:3002/api/v1/health

# Or open in browser
# http://localhost:3002/api/v1/health
```

**Expected Response**: JSON response with server status

### Step 15: Access the Application

#### Frontend (Production Build)

Open your web browser and navigate to:

```
http://localhost:3002
```

**Note**: If you're accessing from a remote server, replace `localhost` with the server's IP address or domain name.

#### Admin CMS Panel

Access the admin panel:

```
http://localhost:3002/admin
```

**Default Credentials** (if not changed):
- Email: Check your database `users` table
- Password: Check your database or contact administrator

### Step 16: Verify Key Features

Test the following to ensure everything is working:

1. **Homepage**: Should load with hero slider, business cards, awards
2. **Navigation**: All menu items should work
3. **Images**: All images should load correctly (check browser console for 404 errors)
4. **CMS Login**: Admin panel should be accessible
5. **API Endpoints**: Test a few API calls:
   ```bash
   curl http://localhost:3002/api/v1/pages
   ```

### Step 17: Check for Errors

#### Check Docker Logs

```bash
docker-compose logs --tail=100
```

Look for:
- ✅ "Server is running on port 3002"
- ✅ "Database connection established"
- ✅ "Tables synchronized successfully"
- ❌ Any error messages (connection errors, missing files, etc.)

#### Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for any JavaScript errors
4. Go to Network tab
5. Check for failed requests (404, 500 errors)

---

## 🔧 Troubleshooting

### Issue: Database Connection Failed

**Symptoms**: Error message about database connection

**Solutions**:
1. Verify MySQL is running:
   ```bash
   # Linux/Mac
   sudo systemctl status mysql
   
   # Windows
   # Check Services panel
   ```

2. Verify database credentials in `server/.env`
3. Verify database exists:
   ```bash
   mysql -u your_username -p -e "SHOW DATABASES;"
   ```

4. Check MySQL user permissions:
   ```sql
   GRANT ALL PRIVILEGES ON refex_db.* TO 'your_username'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Issue: Port Already in Use

**Symptoms**: Error "Port 3002 is already in use"

**Solutions**:
1. Find process using port 3002:
   ```bash
   # Linux/Mac
   lsof -i :3002
   
   # Windows
   netstat -ano | findstr :3002
   ```

2. Kill the process or change port in `server/.env`:
   ```env
   PORT=3003
   ```

### Issue: Images Not Loading

**Symptoms**: Broken image icons, 404 errors for images

**Solutions**:
1. Verify `server/uploads/` folder exists and has correct permissions
2. Check if images were transferred correctly
3. Verify `SERVE_CLIENT=true` in `server/.env`
4. Check server logs for file path errors
5. Verify image paths in database (should start with `/uploads/`)

### Issue: Build Fails

**Symptoms**: `npm run build` fails with errors

**Solutions**:
1. Clear node_modules and reinstall:
   ```bash
   cd client
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. Check Node.js version (must be v18+):
   ```bash
   node --version
   ```

3. Check for TypeScript errors:
   ```bash
   cd client
   npx tsc --noEmit
   ```

### Issue: Docker Container Won't Start

**Symptoms**: Container exits immediately

**Solutions**:
1. Check container logs:
   ```bash
   docker-compose logs refexgroup-uat
   ```

2. Verify `.env` file exists in `server/` directory
3. Check Docker network:
   ```bash
   docker network ls
   # If proxy network doesn't exist:
   docker network create proxy
   ```

4. Rebuild container:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

### Issue: API Returns 500 Errors

**Symptoms**: API endpoints return 500 Internal Server Error

**Solutions**:
1. Check server logs:
   ```bash
   docker-compose logs -f
   ```

2. Verify database connection
3. Check database tables exist:
   ```sql
   USE refex_db;
   SHOW TABLES;
   ```

4. Verify JWT_SECRET is set in `.env`

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Frontend built successfully (`client/out/` exists)
- [ ] Database created and imported
- [ ] Uploads folder transferred and permissions set
- [ ] Docker containers running successfully
- [ ] Application accessible via browser
- [ ] All images loading correctly
- [ ] Admin panel accessible
- [ ] SSL/HTTPS configured (if needed)
- [ ] Firewall rules configured
- [ ] Backup strategy in place

### Production Environment Variables

Ensure production `.env` has:

```env
NODE_ENV=production
SERVE_CLIENT=true
DB_HOST=your_production_db_host
DB_NAME=refex_db
# ... other production values
```

### Reverse Proxy Setup (Optional)

If using nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL/HTTPS Setup

Use Let's Encrypt or your SSL provider:

```bash
# Using certbot (Let's Encrypt)
sudo certbot --nginx -d your-domain.com
```

---

## 📝 Additional Information

### Available Scripts

#### Client Scripts
```bash
cd client
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

#### Server Scripts
```bash
cd server
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm run seed     # Seed database with initial data
```

### Database Management

#### Backup Database
```bash
mysqldump -u your_username -p refex_db > backup_$(date +%Y%m%d).sql
```

#### Restore Database
```bash
mysql -u your_username -p refex_db < backup_20260102.sql
```

### File Structure Notes

- **`client/out/`**: Production build output (generated, can be regenerated)
- **`server/uploads/`**: User-uploaded files (NOT in git, must be transferred manually)
- **`02012026.sql`**: Database export (import this to set up database)
- **`docker-compose.yml`**: Docker configuration

---

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review server logs: `docker-compose logs -f`
- Check browser console for frontend errors
- Verify all environment variables are set correctly

---

## 📄 License

Copyright © Refex Group. All rights reserved.

---

## 🔄 Updates & Maintenance

### Updating the Application

1. Pull latest changes:
   ```bash
   git pull origin main
   ```

2. Rebuild frontend:
   ```bash
   cd client
   npm install  # If package.json changed
   npm run build
   ```

3. Restart containers:
   ```bash
   docker-compose restart
   ```

### Regular Maintenance

- **Database Backups**: Schedule regular database backups
- **Log Rotation**: Configure log rotation for server logs
- **Security Updates**: Keep dependencies updated
- **Disk Space**: Monitor `server/uploads/` folder size

---

**Last Updated**: January 2026  
**Version**: 1.0.0

