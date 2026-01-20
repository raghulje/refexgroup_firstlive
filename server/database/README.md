# Database Setup

## Quick Setup

### Option 1: Using MySQL Command Line

1. Open MySQL command line or MySQL Workbench
2. Run the setup script:
```bash
mysql -u root -p < database/setup.sql
```

Or in MySQL:
```sql
SOURCE database/setup.sql;
```

### Option 2: Manual Creation

1. Connect to MySQL:
```bash
mysql -u root -p
```

2. Create the database:
```sql
CREATE DATABASE refex_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. Exit MySQL:
```sql
EXIT;
```

### Option 3: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create a new schema named `refex_db`
4. Set character set to `utf8mb4` and collation to `utf8mb4_unicode_ci`

## Configuration

After creating the database, update `config/config.json` with your credentials:

```json
{
  "development": {
    "username": "root",
    "password": "your_password",
    "database": "refex_db",
    "host": "localhost",
    "port": 3306,
    "dialect": "mysql"
  }
}
```

## Auto Table Creation

When you start the server, Sequelize will automatically:
- Create all tables based on the models
- Set up relationships (foreign keys)
- Create indexes

Just run:
```bash
npm run dev
```

The tables will be created automatically on first run!

## Database Name

Default database name: `refex_db`

You can change this in:
- `config/config.json` (database field)
- Or use environment variables

