@echo off
REM Refex Group CMS - Consolidate Static Assets Script
REM Moves all static assets into client/src/wp-content folder

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   Refex Group CMS - Consolidate Static Assets         ║
echo ╚════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0.."

REM Create wp-content directory structure in src
echo [1/4] Creating wp-content directory structure...
mkdir "src\wp-content\assets" 2>nul
mkdir "src\wp-content\svg" 2>nul
mkdir "src\wp-content\uploads" 2>nul
echo   ✓ Directory structure created
echo.

REM Move assets from public/assets to src/wp-content/assets
echo [2/4] Consolidating assets folder...
if exist "public\assets" (
    echo   Moving public/assets/ to src/wp-content/assets/...
    xcopy "public\assets\*" "src\wp-content\assets\" /E /I /Y /Q >nul
    echo   ✓ Assets consolidated
) else (
    echo   ⚠ public/assets/ not found, skipping
)
echo.

REM Move SVGs from public/svg to src/wp-content/svg
echo [3/4] Consolidating svg folder...
if exist "public\svg" (
    echo   Moving public/svg/ to src/wp-content/svg/...
    xcopy "public\svg\*" "src\wp-content\svg\" /E /I /Y /Q >nul
    echo   ✓ SVGs consolidated
) else (
    echo   ⚠ public/svg/ not found, skipping
)
echo.

REM Move wp-content from public to src (if exists)
echo [4/4] Consolidating wp-content folder...
if exist "public\wp-content" (
    echo   Moving public/wp-content/ to src/wp-content/uploads/...
    xcopy "public\wp-content\*" "src\wp-content\uploads\" /E /I /Y /Q >nul
    echo   ✓ wp-content consolidated
) else (
    echo   ⚠ public/wp-content/ not found, skipping
)
echo.

REM Create README in wp-content
echo Creating README...
(
echo # Static Assets - Consolidated
echo.
echo This folder contains all static assets consolidated from:
echo - public/assets/
echo - public/svg/
echo - public/wp-content/
echo.
echo ## Structure
echo.
echo ```
echo wp-content/
echo ├── assets/       # Images, icons, logos from public/assets
echo ├── svg/          # SVG files from public/svg
echo └── uploads/      # Legacy WordPress uploads
echo ```
echo.
echo ## Usage
echo.
echo These are legacy static assets kept for reference.
echo New assets should be uploaded via CMS to server/uploads/
echo.
echo ## Note
echo.
echo This folder is version controlled and should only contain
echo assets that are truly static and rarely change.
echo.
echo For dynamic content (hero images, news articles, etc.^),
echo use the CMS upload feature instead.
) > "src\wp-content\README.md"
echo   ✓ README created
echo.

echo ╔════════════════════════════════════════════════════════╗
echo ║   Consolidation Complete!                              ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 📁 All static assets consolidated to: client/src/wp-content/
echo.
echo 📊 Structure:
echo    client/src/wp-content/
echo    ├── assets/       (from public/assets/)
echo    ├── svg/          (from public/svg/)
echo    └── uploads/      (from public/wp-content/)
echo.
echo ⚠️  Next Steps:
echo    1. Review consolidated assets in src/wp-content/
echo    2. Optionally remove old public/ folders
echo    3. Update import paths if needed
echo    4. Commit changes to Git
echo.
echo 💡 To remove old public folders (optional):
echo    rmdir /s /q public\assets
echo    rmdir /s /q public\svg
echo    rmdir /s /q public\wp-content
echo.

REM Open the wp-content folder
start "" "src\wp-content"

pause
