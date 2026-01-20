# Quick Database Setup Guide

## Step 1: Create the Database

### Using MySQL Command Line:
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE refex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Or use the setup script:
```bash
mysql -u root -p < server/database/setup.sql
```

## Step 2: Update Database Credentials

Edit `server/config/config.json`:

```json
{
  "development": {
    "username": "root",
    "password": "YOUR_MYSQL_PASSWORD",
    "database": "refex_db",
    "host": "localhost",
    "port": 3306,
    "dialect": "mysql"
  }
}
```

## Step 3: Start the Server

```bash
cd server
npm install
npm run dev
```

**That's it!** Sequelize will automatically create all tables when the server starts.

## Verify Database Creation

After starting the server, you should see:
```
Database synced successfully
Server is running on port 5000.
```

You can verify tables were created:
```sql
USE refex_db;
SHOW TABLES;
```

You should see all 22 tables listed!

