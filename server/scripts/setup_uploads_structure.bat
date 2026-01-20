@echo off
REM Refex Group CMS - Uploads Folder Structure Setup (Batch Script)
REM Creates organized directory structure for media assets

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   Refex Group CMS - Uploads Folder Setup              ║
echo ╚════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0.."

REM Create main folders
mkdir "uploads\images\home\hero" 2>nul
mkdir "uploads\images\home\about" 2>nul
mkdir "uploads\images\home\business" 2>nul
mkdir "uploads\images\home\awards" 2>nul
mkdir "uploads\images\home\newsroom" 2>nul
mkdir "uploads\images\home\careers" 2>nul
mkdir "uploads\images\home\cta" 2>nul

REM About page
mkdir "uploads\images\about\hero" 2>nul
mkdir "uploads\images\about\leadership" 2>nul
mkdir "uploads\images\about\core-values" 2>nul
mkdir "uploads\images\about\milestones" 2>nul

REM ESG page
mkdir "uploads\images\esg\hero" 2>nul
mkdir "uploads\images\esg\sdg-cards" 2>nul
mkdir "uploads\images\esg\policies" 2>nul
mkdir "uploads\images\esg\initiatives" 2>nul

REM Business pages
mkdir "uploads\images\refrigerants\hero" 2>nul
mkdir "uploads\images\refrigerants\products" 2>nul
mkdir "uploads\images\renewables\hero" 2>nul
mkdir "uploads\images\renewables\projects" 2>nul
mkdir "uploads\images\ash-coal\hero" 2>nul
mkdir "uploads\images\medtech\hero" 2>nul
mkdir "uploads\images\medtech\products" 2>nul
mkdir "uploads\images\mobility\hero" 2>nul
mkdir "uploads\images\capital\hero" 2>nul
mkdir "uploads\images\airports\hero" 2>nul
mkdir "uploads\images\pharma\hero" 2>nul
mkdir "uploads\images\venwind\hero" 2>nul

REM Other pages
mkdir "uploads\images\careers\hero" 2>nul
mkdir "uploads\images\careers\benefits" 2>nul
mkdir "uploads\images\newsroom\articles" 2>nul
mkdir "uploads\images\newsroom\thumbnails" 2>nul
mkdir "uploads\images\contact\hero" 2>nul
mkdir "uploads\images\diversity\hero" 2>nul
mkdir "uploads\images\diversity\initiatives" 2>nul
mkdir "uploads\images\investments\hero" 2>nul
mkdir "uploads\images\investments\portfolio" 2>nul

REM Gallery folders by year
mkdir "uploads\images\gallery\2020" 2>nul
mkdir "uploads\images\gallery\2021" 2>nul
mkdir "uploads\images\gallery\2022" 2>nul
mkdir "uploads\images\gallery\2023" 2>nul
mkdir "uploads\images\gallery\2024" 2>nul
mkdir "uploads\images\gallery\2025" 2>nul
mkdir "uploads\images\gallery\albums" 2>nul

REM Header & Footer
mkdir "uploads\images\header\logo" 2>nul
mkdir "uploads\images\header\mega-menu" 2>nul
mkdir "uploads\images\footer\logo" 2>nul
mkdir "uploads\images\footer\social-icons" 2>nul

REM Icons & SVGs
mkdir "uploads\icons\ui" 2>nul
mkdir "uploads\icons\social" 2>nul
mkdir "uploads\icons\business" 2>nul
mkdir "uploads\icons\sdg" 2>nul

REM Documents
mkdir "uploads\documents\policies" 2>nul
mkdir "uploads\documents\reports" 2>nul
mkdir "uploads\documents\brochures" 2>nul
mkdir "uploads\documents\presentations" 2>nul
mkdir "uploads\documents\esg" 2>nul
mkdir "uploads\documents\sustainability" 2>nul

REM Temporary uploads
mkdir "uploads\temp" 2>nul

echo.
echo ✓ Folder structure created successfully!
echo.
echo 📁 Base directory: uploads\
echo.
echo Next steps:
echo   1. Upload images through CMS admin panel
echo   2. Images will be organized automatically
echo   3. Use backup script to migrate to production
echo.

pause
