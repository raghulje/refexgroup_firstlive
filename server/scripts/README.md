# Database Seeding Scripts

These scripts populate the database with initial data for all pages and sections.

## Run All Seeds

```bash
npm run seed
```

This will seed all data:
- Pages
- Home page sections (Hero slides, About, Careers, CTA)
- Business cards
- Awards
- Newsroom items
- Leaders
- Core values
- SDG cards
- Navigation menus
- Footer sections
- Social links
- Contact info
- Global settings

## Run Individual Seeds

```bash
npm run seed:pages          # Seed all pages
npm run seed:home           # Seed home page sections
npm run seed:business        # Seed business cards
npm run seed:awards          # Seed awards
npm run seed:newsroom        # Seed newsroom items
npm run seed:leaders         # Seed leadership team
npm run seed:core-values     # Seed core values
npm run seed:sdg             # Seed SDG cards
npm run seed:navigation      # Seed navigation menus
npm run seed:footer          # Seed footer sections
npm run seed:social          # Seed social links
npm run seed:contact         # Seed contact info
npm run seed:settings        # Seed global settings
```

## What Gets Seeded

### Home Page
- 6 Hero slides
- About section with content
- Careers section with content
- CTA section with 3 cards
- Business cards (9 cards)
- Awards (12 standard + 4 laurel + 1 certification)
- Newsroom items (3 press releases + 2 events)

### About Page
- Core values (PACE - 4 values)
- Leadership team (8 leaders)

### ESG Page
- SDG cards (8 cards)

### Site Configuration
- Navigation menus (header + footer)
- Footer sections
- Social links (5 platforms)
- Contact info
- Global settings

## Notes

- Scripts use `findOrCreate` to avoid duplicates
- All data is based on the actual content from the client pages
- Image URLs point to existing Refex Group assets
- You can run seeds multiple times safely (idempotent)

