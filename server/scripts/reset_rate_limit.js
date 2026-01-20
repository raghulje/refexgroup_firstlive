/**
 * This script provides information about rate limiting
 * Note: express-rate-limit uses in-memory store by default,
 * so restarting the server will clear all rate limits
 */

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Rate Limit Reset Information');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\nThe rate limiter uses an in-memory store by default.');
console.log('To reset rate limits, simply restart your server:\n');
console.log('1. Stop the server (Ctrl+C)');
console.log('2. Start it again (npm start or npm run dev)');
console.log('\nThis will clear all rate limit counters.\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\nUpdated Rate Limit Settings:');
console.log('- Max attempts: 10 per 15 minutes');
console.log('- Successful logins: NOT counted');
console.log('- Failed logins: Counted towards limit');
console.log('- Window: 15 minutes\n');

