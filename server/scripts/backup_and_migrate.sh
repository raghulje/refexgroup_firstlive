#!/bin/bash

###############################################################################
# Refex Group CMS - Media Backup & Migration Script
# Purpose: Backup database and uploads folder for easy migration
###############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$SERVER_DIR/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Database configuration (update these)
DB_NAME="refex_db"
DB_USER="raghul"
DB_PASS="RefexAdmin@123"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Refex Group CMS - Backup & Migration Tool           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Backup Database
echo -e "${YELLOW}[1/3]${NC} Backing up database..."
DB_BACKUP_FILE="$BACKUP_DIR/refex_db_backup_$DATE.sql"

if mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$DB_BACKUP_FILE" 2>/dev/null; then
    DB_SIZE=$(du -h "$DB_BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✓${NC} Database backed up: $DB_BACKUP_FILE ($DB_SIZE)"
else
    echo -e "${RED}✗${NC} Database backup failed!"
    echo -e "${YELLOW}Note:${NC} You may need to run this with proper MySQL credentials"
    exit 1
fi

# Step 2: Backup Uploads Folder
echo -e "${YELLOW}[2/3]${NC} Backing up uploads folder..."
UPLOADS_BACKUP_FILE="$BACKUP_DIR/uploads_backup_$DATE.tar.gz"

if tar -czf "$UPLOADS_BACKUP_FILE" -C "$SERVER_DIR" uploads/ 2>/dev/null; then
    UPLOADS_SIZE=$(du -h "$UPLOADS_BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✓${NC} Uploads backed up: $UPLOADS_BACKUP_FILE ($UPLOADS_SIZE)"
else
    echo -e "${RED}✗${NC} Uploads backup failed!"
    exit 1
fi

# Step 3: Create Migration Package
echo -e "${YELLOW}[3/3]${NC} Creating migration package..."
MIGRATION_PACKAGE="$BACKUP_DIR/refex_cms_migration_$DATE.tar.gz"

cd "$BACKUP_DIR"
tar -czf "$MIGRATION_PACKAGE" \
    "refex_db_backup_$DATE.sql" \
    "uploads_backup_$DATE.tar.gz" \
    2>/dev/null

if [ -f "$MIGRATION_PACKAGE" ]; then
    PACKAGE_SIZE=$(du -h "$MIGRATION_PACKAGE" | cut -f1)
    echo -e "${GREEN}✓${NC} Migration package created: $MIGRATION_PACKAGE ($PACKAGE_SIZE)"
else
    echo -e "${RED}✗${NC} Migration package creation failed!"
    exit 1
fi

# Summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Backup Complete!                                     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "📦 ${YELLOW}Backup Location:${NC} $BACKUP_DIR"
echo ""
echo -e "📄 ${YELLOW}Files Created:${NC}"
echo -e "   1. Database: refex_db_backup_$DATE.sql ($DB_SIZE)"
echo -e "   2. Uploads:  uploads_backup_$DATE.tar.gz ($UPLOADS_SIZE)"
echo -e "   3. Package:  refex_cms_migration_$DATE.tar.gz ($PACKAGE_SIZE)"
echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Next Steps for Production Migration:${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "1. Transfer migration package to production server:"
echo -e "   ${GREEN}scp $MIGRATION_PACKAGE user@uat.refex.group:/tmp/${NC}"
echo ""
echo -e "2. SSH into production server:"
echo -e "   ${GREEN}ssh user@uat.refex.group${NC}"
echo ""
echo -e "3. Extract and import:"
echo -e "   ${GREEN}cd /tmp${NC}"
echo -e "   ${GREEN}tar -xzf refex_cms_migration_$DATE.tar.gz${NC}"
echo -e "   ${GREEN}mysql -u username -p refex_db_production < refex_db_backup_$DATE.sql${NC}"
echo -e "   ${GREEN}tar -xzf uploads_backup_$DATE.tar.gz -C /var/www/RefexGroup_Prod/server/${NC}"
echo ""
echo -e "4. Set permissions:"
echo -e "   ${GREEN}chown -R www-data:www-data /var/www/RefexGroup_Prod/server/uploads/${NC}"
echo -e "   ${GREEN}chmod -R 755 /var/www/RefexGroup_Prod/server/uploads/${NC}"
echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}"
echo ""
