# Refex Group CMS - Media Backup & Migration Script (PowerShell)
# Purpose: Backup database and uploads folder for easy migration

param(
    [string]$DbName = "refex_db",
    [string]$DbUser = "raghul",
    [string]$DbPassword = "RefexAdmin@123"
)

# Configuration
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ServerDir = Split-Path -Parent $ScriptDir
$BackupDir = Join-Path $ServerDir "backups"
$Date = Get-Date -Format "yyyyMMdd_HHmmss"

# Create backup directory
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   Refex Group CMS - Backup & Migration Tool           ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Step 1: Backup Database
Write-Host "[1/3] Backing up database..." -ForegroundColor Yellow
$DbBackupFile = Join-Path $BackupDir "refex_db_backup_$Date.sql"

try {
    # Try using mysqldump
    $mysqldumpPath = "mysqldump"
    & $mysqldumpPath -u $DbUser -p"$DbPassword" $DbName | Out-File -FilePath $DbBackupFile -Encoding UTF8
    
    $DbSize = (Get-Item $DbBackupFile).Length / 1MB
    Write-Host "✓ Database backed up: $DbBackupFile ($([math]::Round($DbSize, 2)) MB)" -ForegroundColor Green
} catch {
    Write-Host "✗ Database backup failed!" -ForegroundColor Red
    Write-Host "Note: Make sure MySQL is in your PATH or use full path to mysqldump" -ForegroundColor Yellow
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Backup Uploads Folder
Write-Host "[2/3] Backing up uploads folder..." -ForegroundColor Yellow
$UploadsBackupFile = Join-Path $BackupDir "uploads_backup_$Date.zip"
$UploadsPath = Join-Path $ServerDir "uploads"

try {
    if (Test-Path $UploadsPath) {
        Compress-Archive -Path $UploadsPath -DestinationPath $UploadsBackupFile -Force
        $UploadsSize = (Get-Item $UploadsBackupFile).Length / 1MB
        Write-Host "✓ Uploads backed up: $UploadsBackupFile ($([math]::Round($UploadsSize, 2)) MB)" -ForegroundColor Green
    } else {
        Write-Host "⚠ Uploads folder not found: $UploadsPath" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Uploads backup failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Step 3: Create Migration Package
Write-Host "[3/3] Creating migration package..." -ForegroundColor Yellow
$MigrationPackage = Join-Path $BackupDir "refex_cms_migration_$Date.zip"

try {
    $filesToPackage = @($DbBackupFile, $UploadsBackupFile)
    Compress-Archive -Path $filesToPackage -DestinationPath $MigrationPackage -Force
    
    $PackageSize = (Get-Item $MigrationPackage).Length / 1MB
    Write-Host "✓ Migration package created: $MigrationPackage ($([math]::Round($PackageSize, 2)) MB)" -ForegroundColor Green
} catch {
    Write-Host "✗ Migration package creation failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Summary
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   Backup Complete!                                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Backup Location: " -NoNewline -ForegroundColor Yellow
Write-Host $BackupDir
Write-Host ""
Write-Host "📄 Files Created:" -ForegroundColor Yellow
Write-Host "   1. Database: refex_db_backup_$Date.sql ($([math]::Round($DbSize, 2)) MB)"
Write-Host "   2. Uploads:  uploads_backup_$Date.zip ($([math]::Round($UploadsSize, 2)) MB)"
Write-Host "   3. Package:  refex_cms_migration_$Date.zip ($([math]::Round($PackageSize, 2)) MB)"
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "Next Steps for Production Migration:" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Transfer migration package to production server:"
Write-Host "   scp $MigrationPackage user@uat.refex.group:/tmp/" -ForegroundColor Green
Write-Host ""
Write-Host "2. SSH into production server:"
Write-Host "   ssh user@uat.refex.group" -ForegroundColor Green
Write-Host ""
Write-Host "3. Extract and import on production:"
Write-Host "   cd /tmp" -ForegroundColor Green
Write-Host "   unzip refex_cms_migration_$Date.zip" -ForegroundColor Green
Write-Host "   mysql -u username -p refex_db_production < refex_db_backup_$Date.sql" -ForegroundColor Green
Write-Host "   unzip uploads_backup_$Date.zip -d /var/www/RefexGroup_Prod/server/" -ForegroundColor Green
Write-Host ""
Write-Host "4. Set permissions:"
Write-Host "   chown -R www-data:www-data /var/www/RefexGroup_Prod/server/uploads/" -ForegroundColor Green
Write-Host "   chmod -R 755 /var/www/RefexGroup_Prod/server/uploads/" -ForegroundColor Green
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

# Open backup folder
Write-Host "Opening backup folder..." -ForegroundColor Cyan
Start-Process explorer.exe -ArgumentList $BackupDir
