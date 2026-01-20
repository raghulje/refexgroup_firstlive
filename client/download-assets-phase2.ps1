# download-assets-phase2.ps1 - Download remaining external assets
# Run this script with: .\download-assets-phase2.ps1

# Remaining assets to download for Phase 2
$assets = @(
    # ===== REFRIGERANTS PAGE =====
    # Product Images
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/R32-1024x1024.jpg"
        Dest = "public\assets\business\refrigerants\r32.jpg"
        Description = "Refrigerants - R32 Product"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/R134a-Background-Removed-Medium.png"
        Dest = "public\assets\business\refrigerants\r134a.png"
        Description = "Refrigerants - R134a Product"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/R404a-Background-Removed-Medium.png"
        Dest = "public\assets\business\refrigerants\r404a.png"
        Description = "Refrigerants - R404a Product"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/R407c-Background-Removed-Medium.png"
        Dest = "public\assets\business\refrigerants\r407c.png"
        Description = "Refrigerants - R407c Product"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/R410a-Background-Removed-Medium.png"
        Dest = "public\assets\business\refrigerants\r410a.png"
        Description = "Refrigerants - R410a Product"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/R22-can-Background-Removed-Medium-1.png"
        Dest = "public\assets\business\refrigerants\r22-can.png"
        Description = "Refrigerants - R22 Can"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/03/R22-cylinder-Background-Removed-1024x1024.png"
        Dest = "public\assets\business\refrigerants\r22-cylinder.png"
        Description = "Refrigerants - R22 Cylinder"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/R152a-cylinder-Medium.png"
        Dest = "public\assets\business\refrigerants\r152a.png"
        Description = "Refrigerants - R152a Product"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/600a-Background-Removed-Medium.png"
        Dest = "public\assets\business\refrigerants\600a.png"
        Description = "Refrigerants - 600a Product"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/03/Quality-check-1-1024x538.jpg"
        Dest = "public\assets\business\refrigerants\quality-check.jpg"
        Description = "Refrigerants - Quality Check"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/03/Safety-Check-Large-1024x682.jpeg"
        Dest = "public\assets\business\refrigerants\safety-check.jpeg"
        Description = "Refrigerants - Safety Check"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/03/Storage-tank-Front-side-Large.jpeg"
        Dest = "public\assets\business\refrigerants\storage-tank.jpeg"
        Description = "Refrigerants - Storage Tank"
    },
    
    # ===== RENEWABLES PAGE =====
    # Bhilai Project
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Renewables-Projects-Bhilai-1.jpg"
        Dest = "public\assets\business\renewables\bhilai-1.jpg"
        Description = "Renewables - Bhilai Project 1"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Renewables-Projects-Bhilai-2-300x225.jpg"
        Dest = "public\assets\business\renewables\bhilai-2.jpg"
        Description = "Renewables - Bhilai Project 2"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Renewables-Projects-Bhilai-3.jpg"
        Dest = "public\assets\business\renewables\bhilai-3.jpg"
        Description = "Renewables - Bhilai Project 3"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Renewables-Projects-Bhilai-4.jpg"
        Dest = "public\assets\business\renewables\bhilai-4.jpg"
        Description = "Renewables - Bhilai Project 4"
    },
    # Leh-Ladak Project
    @{
        Url = "https://refex.group/wp-content/uploads/2023/02/Renewables-Projects-Leh-Ladak-1-300x225.jpg"
        Dest = "public\assets\business\renewables\leh-ladak-1.jpg"
        Description = "Renewables - Leh-Ladak Project 1"
    },
    @{
        Url = "https://refex.group/wp-content/uploads/2023/02/Renewables-Projects-Leh-Ladak-3.jpg"
        Dest = "public\assets\business\renewables\leh-ladak-3.jpg"
        Description = "Renewables - Leh-Ladak Project 3"
    },
    @{
        Url = "https://refex.group/wp-content/uploads/2023/02/Renewables-Projects-Leh-Ladak-6.jpg"
        Dest = "public\assets\business\renewables\leh-ladak-6.jpg"
        Description = "Renewables - Leh-Ladak Project 6"
    },
    # Diwana Project
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Diwana_1-Medium.jpeg"
        Dest = "public\assets\business\renewables\diwana-1.jpeg"
        Description = "Renewables - Diwana Project 1"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Diwana_2-Medium.jpeg"
        Dest = "public\assets\business\renewables\diwana-2.jpeg"
        Description = "Renewables - Diwana Project 2"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Diwana_3-Medium.jpeg"
        Dest = "public\assets\business\renewables\diwana-3.jpeg"
        Description = "Renewables - Diwana Project 3"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Diwana_4-Medium.jpeg"
        Dest = "public\assets\business\renewables\diwana-4.jpeg"
        Description = "Renewables - Diwana Project 4"
    },
    
    # ===== AIRPORTS PAGE =====
    @{
        Url = "https://www.refex.group/wp-content/uploads/2024/01/Refex-Airports-Landing-Page-Hero-1.png"
        Dest = "public\assets\business\airports\landing-hero-1.png"
        Description = "Airports - Landing Hero 1"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2024/01/Refex-Airports-Landing-Page-Hero-2.png"
        Dest = "public\assets\business\airports\landing-hero-2.png"
        Description = "Airports - Landing Hero 2"
    },
    
    # ===== CAPITAL PAGE =====
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/REFEX-Logo@2x-8-1.png"
        Dest = "public\assets\business\capital\refex-logo-capital.png"
        Description = "Capital - Refex Logo in Hero"
    },
    
    # ===== ASH & COAL PAGE =====
    @{
        Url = "https://refex.group/wp-content/uploads/2023/03/Heap-making-at-Yard-Trough-PC-_-Loader.jpeg"
        Dest = "public\assets\business\ash-coal\heap-making-yard.jpeg"
        Description = "Ash & Coal - Heap Making at Yard"
    },
    @{
        Url = "https://refex.group/wp-content/uploads/2023/03/Water-Sprinkling-in-smoke-coal-and-shifting.jpeg"
        Dest = "public\assets\business\ash-coal\water-sprinkling.jpeg"
        Description = "Ash & Coal - Water Sprinkling"
    },
    
    # ===== MOBILITY ADDITIONAL =====
    @{
        Url = "https://www.refex.group/wp-content/uploads/2024/01/Strategic-Advantages-of-Electric-Fleets-1.jpg"
        Dest = "public\assets\business\mobility\fleet-advantage-1.jpg"
        Description = "Mobility - Fleet Advantage 1"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2024/01/Strategic-Advantages-of-Electric-Fleets-2.jpg"
        Dest = "public\assets\business\mobility\fleet-advantage-2.jpg"
        Description = "Mobility - Fleet Advantage 2"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/08/eWheelz-CTA-image-e1704363936888-1-scaled.jpg"
        Dest = "public\assets\business\mobility\ewheelz-cta.jpg"
        Description = "Mobility - eWheelz CTA"
    },
    @{
        Url = "https://refex.group/wp-content/uploads/2025/08/eWheelz-CTA-image-e1704363936888-1-1-scaled.jpg"
        Dest = "public\assets\business\mobility\cta-bg.jpg"
        Description = "Mobility - CTA Background"
    },
    
    # ===== HOME PAGE =====
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Gallery-REFEX-Awards-7.jpg"
        Dest = "public\assets\heroes\home-awards.jpg"
        Description = "Home - Awards Image"
    },
    
    # ===== GALLERY PAGE =====
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Gallery-20-th.-Anniversary-1.jpg"
        Dest = "public\assets\gallery\anniversary-1.jpg"
        Description = "Gallery - 20th Anniversary 1"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Gallery-20-th.-Anniversary-2.jpg"
        Dest = "public\assets\gallery\anniversary-2.jpg"
        Description = "Gallery - 20th Anniversary 2"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/02/Gallery-20-th.-Anniversary-3.jpg"
        Dest = "public\assets\gallery\anniversary-3.jpg"
        Description = "Gallery - 20th Anniversary 3"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2023/03/Office-Group-Photo-comp-1-1024x576.jpg"
        Dest = "public\assets\gallery\office-group-photo.jpg"
        Description = "Gallery - Office Group Photo"
    },
    
    # ===== NEWSROOM PAGE =====
    @{
        Url = "https://refex.co.in/wp-content/uploads/2025/11/newsroom-thumbnail-video.jpg"
        Dest = "public\assets\newsroom\thumbnail-video.jpg"
        Description = "Newsroom - Video Thumbnail"
    },
    @{
        Url = "https://refex.co.in/wp-content/uploads/2025/07/press-release02.jpg"
        Dest = "public\assets\newsroom\press-release-02.jpg"
        Description = "Newsroom - Press Release 02"
    },
    @{
        Url = "https://refex.co.in/wp-content/uploads/2025/07/press-release04.jpg"
        Dest = "public\assets\newsroom\press-release-04.jpg"
        Description = "Newsroom - Press Release 04"
    },
    @{
        Url = "https://refex.co.in/wp-content/uploads/2025/11/Refex-Mobility-expands.jpg"
        Dest = "public\assets\newsroom\mobility-expands.jpg"
        Description = "Newsroom - Mobility Expands"
    },
    @{
        Url = "https://refex.co.in/wp-content/uploads/2023/02/Refex-Gheun-Tak-A-Womenss-Ultimate-Frisbee-Tournament.jpg"
        Dest = "public\assets\newsroom\gheun-tak-tournament.jpg"
        Description = "Newsroom - Gheun Tak Tournament"
    },
    @{
        Url = "https://refex.co.in/wp-content/uploads/2023/01/Refex-Group-Road-Safety-Awareness-event.jpg"
        Dest = "public\assets\newsroom\road-safety-event.jpg"
        Description = "Newsroom - Road Safety Event"
    },
    
    # ===== INVESTMENTS PAGE =====
    @{
        Url = "https://refex.group/wp-content/uploads/2023/02/Investments-e1677567598400.jpg"
        Dest = "public\assets\heroes\investments-hero.jpg"
        Description = "Investments - Hero Background"
    },
    @{
        Url = "https://refex.group/wp-content/uploads/2023/02/Anil.png"
        Dest = "public\assets\team\anil-jain.png"
        Description = "Investments - Anil Jain Photo"
    },
    @{
        Url = "https://www.refex.group/wp-content/uploads/2025/03/down.png"
        Dest = "public\assets\icons\down-arrow.png"
        Description = "Icons - Down Arrow"
    }
)

Write-Host "🚀 Starting Phase 2 download of $($assets.Count) remaining assets...`n" -ForegroundColor Cyan

$successCount = 0
$failCount = 0
$totalSize = 0

foreach ($asset in $assets) {
    try {
        # Create directory if it doesn't exist
        $dir = Split-Path -Parent $asset.Dest
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Force -Path $dir | Out-Null
        }

        # Download file
        Invoke-WebRequest -Uri $asset.Url -OutFile $asset.Dest -ErrorAction Stop
        
        # Get file size
        $fileSize = (Get-Item $asset.Dest).Length
        $totalSize += $fileSize
        $fileSizeKB = [math]::Round($fileSize / 1KB, 2)
        
        Write-Host "✅ Downloaded: $($asset.Description) ($fileSizeKB KB)" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "❌ Failed: $($asset.Description) - $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

$totalSizeMB = [math]::Round($totalSize / 1MB, 2)

Write-Host "`n📊 Phase 2 Download Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Success: $successCount" -ForegroundColor Green
Write-Host "   ❌ Failed: $failCount" -ForegroundColor Red
Write-Host "   📁 Total: $($assets.Count)" -ForegroundColor Yellow
Write-Host "   💾 Total Size: $totalSizeMB MB" -ForegroundColor Magenta
Write-Host "`n🎉 Phase 2 Complete! Ready to update code references." -ForegroundColor Green
