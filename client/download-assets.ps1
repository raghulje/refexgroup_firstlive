# download-assets.ps1 - Download critical external assets locally
# Run this script with: .\download-assets.ps1

# Critical assets to download
$assets = @(
    # Main Logos
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/REFEX-Logo@2x-8-1.png"
        Dest = "public\assets\logos\refex-logo.png"
        Description = "Main Refex Logo"
    },
    
    # Business Logos
    @{
        Url = "https://www.refex.group/wp-content/uploads/2024/01/Refex-Airports-Logo-W.png"
        Dest = "public\assets\logos\business\airports-logo-white.png"
        Description = "Airports Logo White"
    },
    @{
        Url = "https://refex.group/wp-content/uploads/2023/03/Refex-Capital-logo.png"
        Dest = "public\assets\logos\business\capital-logo.png"
        Description = "Capital Logo"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/03/3i-MedTech-new-Logo-e1679395253850-858x1024.png"
        Dest = "public\assets\logos\business\3i-medtech-logo.png"
        Description = "3i MedTech Logo"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/03/Adonis-logo-1024x666.png"
        Dest = "public\assets\logos\business\adonis-logo.png"
        Description = "Adonis Logo"
    },
    
    # Hero/Background Images
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Businesses-BG.jpg"
        Dest = "public\assets\heroes\business-bg.jpg"
        Description = "Business Background"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Gallery-20-th.-Anniversary-10.jpg"
        Dest = "public\assets\heroes\about-anniversary.jpg"
        Description = "About Anniversary Image"
    },
    @{
        Url = "https://refex.group/wp-content/uploads/2023/02/Capital-Hero-Banner-white.jpg"
        Dest = "public\assets\heroes\capital-hero.jpg"
        Description = "Capital Hero Banner"
    },
    @{
        Url = "https://refex.group/wp-content/uploads/2023/02/Renewables-Projects-Leh-Ladak-2.jpg"
        Dest = "public\assets\heroes\renewables-hero.jpg"
        Description = "Renewables Hero"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/03/venwind-banner.jpg"
        Dest = "public\assets\heroes\venwind-banner.jpg"
        Description = "Venwind Banner"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/08/top-banner-img.png"
        Dest = "public\assets\heroes\mobility-banner.png"
        Description = "Mobility Banner"
    },
    @{
        Url = "https://refex.group/wp-content/uploads/2024/01/Refex-Airports-Hero.png"
        Dest = "public\assets\heroes\airports-hero.png"
        Description = "Airports Hero"
    },
    
    # Key Business Images
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/08/reliable.png"
        Dest = "public\assets\business\mobility\reliable.png"
        Description = "Mobility Reliable Icon"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/08/Why-Opt-for-Refex-Green-Mobility.png"
        Dest = "public\assets\business\mobility\why-opt.png"
        Description = "Mobility Why Opt"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/05/medtech-images-new.png"
        Dest = "public\assets\business\medtech\hero-image.png"
        Description = "MedTech Hero Image"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/04/our-specialities.avif"
        Dest = "public\assets\business\medtech\specialities.avif"
        Description = "MedTech Specialities"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/REFEX-Capital-About--768x525.jpg"
        Dest = "public\assets\business\capital\about.jpg"
        Description = "Capital About Image"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Capital-Areas-BG-1.jpg"
        Dest = "public\assets\business\capital\areas-bg.jpg"
        Description = "Capital Areas Background"
    },
    @{
        Url = "https://refex.group/wp-content/uploads/2023/02/Sun-BG-Icon.png"
        Dest = "public\assets\icons\sun-bg.png"
        Description = "Sun Background Icon"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2024/01/airport-terminal-Large-1024x683.jpeg"
        Dest = "public\assets\business\airports\terminal.jpeg"
        Description = "Airport Terminal"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2024/01/Refex-Airport-Retail-1.png"
        Dest = "public\assets\business\airports\retail.png"
        Description = "Airport Retail"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2024/01/Refex-Advantage-1.jpg"
        Dest = "public\assets\business\airports\advantage.jpg"
        Description = "Airport Advantage"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/03/home-image-840x968-1.jpg"
        Dest = "public\assets\business\venwind\home-image.jpg"
        Description = "Venwind Home Image"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/03/gallery-img03.jpg"
        Dest = "public\assets\business\venwind\gallery.jpg"
        Description = "Venwind Gallery"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/03/about-usbg-630x630-1.jpg"
        Dest = "public\assets\business\venwind\about-bg.jpg"
        Description = "Venwind About Background"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/03/sustainability-banner.jpg"
        Dest = "public\assets\business\venwind\sustainability.jpg"
        Description = "Venwind Sustainability"
    },
    @{
        Url = "https://refex.group/wp-content/uploads/2023/03/pushing-at-th2.jpeg"
        Dest = "public\assets\business\ash-coal\pushing.jpeg"
        Description = "Ash & Coal Pushing"
    },
    @{
        Url = "https://refex.group/wp-content/uploads/2023/03/Heap-Making-5293.jpeg"
        Dest = "public\assets\business\ash-coal\heap-making.jpeg"
        Description = "Ash & Coal Heap Making"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/08/Integrated-Electric-Fleet-Solutions01.jpg"
        Dest = "public\assets\business\mobility\solutions-01.jpg"
        Description = "Mobility Solutions 01"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/08/Integrated-Electric-Fleet-Solutions-02.jpg"
        Dest = "public\assets\business\mobility\solutions-02.jpg"
        Description = "Mobility Solutions 02"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/08/Integrated-Electric-Fleet-Solutions-03.jpg"
        Dest = "public\assets\business\mobility\solutions-03.jpg"
        Description = "Mobility Solutions 03"
    }
)

Write-Host "🚀 Starting download of $($assets.Count) critical assets...`n" -ForegroundColor Cyan

$successCount = 0
$failCount = 0

foreach ($asset in $assets) {
    try {
        # Create directory if it doesn't exist
        $dir = Split-Path -Parent $asset.Dest
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Force -Path $dir | Out-Null
        }

        # Download file
        Invoke-WebRequest -Uri $asset.Url -OutFile $asset.Dest -ErrorAction Stop
        Write-Host "✅ Downloaded: $($asset.Description) -> $($asset.Dest)" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "❌ Failed: $($asset.Description) - $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "`n📊 Download Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Success: $successCount" -ForegroundColor Green
Write-Host "   ❌ Failed: $failCount" -ForegroundColor Red
Write-Host "   📁 Total: $($assets.Count)" -ForegroundColor Yellow
