const fetch = require('node-fetch');

async function run() {
  const [,, phone = '254773532309', amount = '1'] = process.argv;
  const url = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 3001}`;
  const endpoint = `${url}/api/mpesa/stkpush`;
  console.log(`Initiating STK push to ${endpoint} phone=${phone} amount=${amount}`);
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, amount }) });
  const body = await res.json();
  console.log('Response:', JSON.stringify(body, null, 2));
  if (body?.tx?.checkoutRequestID) {
    console.log('You can simulate callback: npm run simulate-callback -- <checkoutRequestID>');
  }
}

run().catch(err => { console.error(err); process.exit(1); });