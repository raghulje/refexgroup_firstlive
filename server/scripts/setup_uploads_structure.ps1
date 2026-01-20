# Refex Group CMS - Uploads Folder Structure Setup Script
# Creates organized directory structure for media assets

param(
    [string]$BaseDir = ".\uploads"
)

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Refex Group CMS - Uploads Folder Setup              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Define the folder structure
$folders = @(
    # Images folder structure
    "images/home/hero",
    "images/home/about",
    "images/home/business",
    "images/home/awards",
    "images/home/newsroom",
    "images/home/careers",
    "images/home/cta",
    
    # About page
    "images/about/hero",
    "images/about/leadership",
    "images/about/core-values",
    "images/about/milestones",
    
    # ESG page
    "images/esg/hero",
    "images/esg/sdg-cards",
    "images/esg/policies",
    "images/esg/initiatives",
    
    # Business pages
    "images/refrigerants/hero",
    "images/refrigerants/products",
    "images/renewables/hero",
    "images/renewables/projects",
    "images/ash-coal/hero",
    "images/medtech/hero",
    "images/medtech/products",
    "images/mobility/hero",
    "images/capital/hero",
    "images/airports/hero",
    "images/pharma/hero",
    "images/venwind/hero",
    
    # Other pages
    "images/careers/hero",
    "images/careers/benefits",
    "images/newsroom/articles",
    "images/newsroom/thumbnails",
    "images/contact/hero",
    "images/diversity/hero",
    "images/diversity/initiatives",
    "images/investments/hero",
    "images/investments/portfolio",
    
    # Gallery folders by year
    "images/gallery/2020",
    "images/gallery/2021",
    "images/gallery/2022",
    "images/gallery/2023",
    "images/gallery/2024",
    "images/gallery/2025",
    "images/gallery/albums",
    
    # Header & Footer
    "images/header/logo",
    "images/header/mega-menu",
    "images/footer/logo",
    "images/footer/social-icons",
    
    # Icons & SVGs
    "icons/ui",
    "icons/social",
    "icons/business",
    "icons/sdg",
    
    # Documents folder structure
    "documents/policies",
    "documents/reports",
    "documents/brochures",
    "documents/presentations",
    "documents/esg",
    "documents/sustainability",
    
    # Temporary uploads
    "temp"
)

$createdCount = 0
$existingCount = 0

Write-Host "Creating folder structure..." -ForegroundColor Yellow
Write-Host ""

foreach ($folder in $folders) {
    $fullPath = Join-Path $BaseDir $folder
    
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "  ✓ Created: $folder" -ForegroundColor Green
        $createdCount++
    }
    else {
        Write-Host "  - Exists:  $folder" -ForegroundColor Gray
        $existingCount++
    }
}

# Create .gitkeep files to preserve empty folders in Git
Write-Host ""
Write-Host "Creating .gitkeep files..." -ForegroundColor Yellow

foreach ($folder in $folders) {
    $fullPath = Join-Path $BaseDir $folder
    $gitkeepPath = Join-Path $fullPath ".gitkeep"
    
    if (-not (Test-Path $gitkeepPath)) {
        New-Item -ItemType File -Path $gitkeepPath -Force | Out-Null
    }
}

# Create README file
$readmePath = Join-Path $BaseDir "README.md"
$readmeContent = @"
# Uploads Folder Structure

This folder contains all media assets uploaded through the CMS.

## Folder Organization

### Images
- **home/** - Home page images (hero, about, business cards, etc.)
- **about/** - About page images (leadership, core values, etc.)
- **esg/** - ESG page images (SDG cards, policies, initiatives)
- **[business-name]/** - Business vertical pages (refrigerants, renewables, etc.)
- **gallery/** - Gallery images organized by year
- **header/** - Header images (logo, mega menu images)
- **footer/** - Footer images (logo, social icons)

### Icons
- **ui/** - UI icons (arrows, menu, close, etc.)
- **social/** - Social media icons
- **business/** - Business vertical icons
- **sdg/** - Sustainable Development Goals icons

### Documents
- **policies/** - Policy documents (PDF)
- **reports/** - Annual reports, sustainability reports
- **brochures/** - Marketing brochures
- **presentations/** - Presentation files
- **esg/** - ESG-related documents
- **sustainability/** - Sustainability reports and documents

## File Naming Conventions

### Images
- Use lowercase with hyphens
- Include descriptive names
- Add date for time-sensitive content
- Examples:
  - `hero-sustainability-2025.jpg`
  - `leadership-john-doe.jpg`
  - `sdg-goal-1-icon.svg`

### Documents
- Use descriptive names
- Include version numbers if applicable
- Add year for annual documents
- Examples:
  - `esg-policy-2024-v2.pdf`
  - `sustainability-report-2024.pdf`
  - `company-brochure.pdf`

## File Size Guidelines

- **Hero Images**: < 500KB (optimize before upload)
- **Thumbnails**: < 100KB
- **Icons/SVGs**: < 50KB
- **PDFs**: < 5MB (compress if larger)

## Backup

This folder is automatically backed up by the backup script.
Run: `.\scripts\backup_and_migrate.ps1`

## Important Notes

1. **Do not manually edit files** - Use the CMS upload interface
2. **Optimize images** before uploading for better performance
3. **Use descriptive filenames** for easier management
4. **Keep backups** before major updates
5. **Set proper permissions** on production servers

## Permissions (Linux/Production)

```bash
chown -R www-data:www-data uploads/
chmod -R 755 uploads/
```

---

Last Updated: $(Get-Date -Format "yyyy-MM-dd")
"@

Set-Content -Path $readmePath -Value $readmeContent -Encoding UTF8

Write-Host "  ✓ Created: README.md" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Setup Complete!                                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Yellow
Write-Host "   - Folders created: $createdCount" -ForegroundColor Green
Write-Host "   - Folders existing: $existingCount" -ForegroundColor Gray
Write-Host "   - Total folders: $($createdCount + $existingCount)" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 Base directory: $BaseDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Folder structure is ready for use!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Upload images through CMS admin panel" -ForegroundColor White
Write-Host "  2. Images will be organized automatically" -ForegroundColor White
Write-Host "  3. Use backup script to migrate to production" -ForegroundColor White
Write-Host ""

# Open the uploads folder
Start-Process explorer.exe -ArgumentList (Resolve-Path $BaseDir)
