const express = require('express');
const router = express.Router();
const { getStatesOfCountry, getCitiesOfState } = require('@countrystatecity/countries');

const INDIA_COUNTRY_CODE = 'IN';
let cityCache = null;
let cacheLoadedAt = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

async function loadIndiaCities() {
  const now = Date.now();
  if (cityCache && now - cacheLoadedAt < CACHE_TTL_MS) {
    return cityCache;
  }

  const states = await getStatesOfCountry(INDIA_COUNTRY_CODE);
  const cityGroups = await Promise.all(
    states.map(async (state) => {
      const stateCode = state?.iso2;
      if (!stateCode) return [];
      const cities = await getCitiesOfState(INDIA_COUNTRY_CODE, stateCode);
      return cities.map((city) => `${city.name}, ${state.name}`);
    })
  );

  const uniqueSorted = Array.from(new Set(cityGroups.flat())).sort((a, b) =>
    a.localeCompare(b, 'en', { sensitivity: 'base' })
  );
  cityCache = uniqueSorted;
  cacheLoadedAt = now;
  return cityCache;
}

router.get('/india-cities', async (_req, res) => {
  try {
    const cities = await loadIndiaCities();
    return res.json({ success: true, data: cities });
  } catch (error) {
    console.error('Failed to load India cities:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load India cities',
    });
  }
});

module.exports = router;
