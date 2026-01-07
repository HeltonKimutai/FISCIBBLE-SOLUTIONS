const fetch = require('node-fetch');

async function run() {
  const [,, checkout, status] = process.argv;
  if (!checkout) {
    console.error('Usage: node tools/simulate-callback.js <checkoutRequestID> [success|failed]');
    process.exit(2);
  }
  const s = status === 'failed' ? 'failed' : 'success';
  const url = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3001}`;
  const endpoint = `${url}/api/mock-callback/${checkout}`;
  console.log(`Calling ${endpoint} with status=${s}`);
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: s }) });
  const body = await res.json();
  console.log('Response:', body);
}

run().catch(err => { console.error(err); process.exit(1); });