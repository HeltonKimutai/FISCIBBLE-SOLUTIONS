require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Environment variables (see .env.example)
const {
  MPESA_CONSUMER_KEY,
  MPESA_CONSUMER_SECRET,
  MPESA_SHORTCODE,
  MPESA_PASSKEY,
  MPESA_CALLBACK_URL,
  MPESA_SIMULATE,
  MPESA_ENV
} = process.env;

// Automatically choose base URL based on environment (sandbox by default)
const MPESA_BASE = MPESA_ENV === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke';

// Server-side toggle to disable outgoing STK pushes entirely (useful for testing)
const DISABLE_STK = process.env.DISABLE_STK === 'true';

// Basic env validation and helpful messaging
(function validateEnv() {
  const required = ['MPESA_CONSUMER_KEY', 'MPESA_CONSUMER_SECRET', 'MPESA_SHORTCODE', 'MPESA_PASSKEY', 'MPESA_CALLBACK_URL'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) {
    console.warn(`⚠️ Missing required MPESA env vars: ${missing.join(', ')}.`);
    console.warn('Create a .env file from server/.env.example and set sandbox values, or enable MPESA_SIMULATE=true for local testing.');
    if (process.env.MPESA_ENV === 'production') {
      console.error('Required env vars missing in production; exiting.');
      process.exit(1);
    }
  }
})();

// In-memory store for transactions (checkoutRequestId -> tx)
const transactions = new Map();

let tokenCache = { token: null, expiresAt: 0 };

async function getAccessToken() {
  // Return cached token if still valid
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) return tokenCache.token;

  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
    throw new Error('Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET in env');
  }
  const keySecret = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');

  const url = `${MPESA_BASE}/oauth/v1/generate?grant_type=client_credentials`;
  const res = await axios.get(url, { headers: { Authorization: `Basic ${keySecret}` } });

  const token = res.data.access_token;
  const expiresIn = parseInt(res.data.expires_in || '3599', 10);
  // cache with a small buffer to avoid expiry during requests
  tokenCache = { token, expiresAt: Date.now() + (expiresIn - 30) * 1000 };
  return token;
}

// Public endpoint to fetch a (cached) access token for debugging or client use
app.get('/api/mpesa/token', async (req, res) => {
  try {
    const token = await getAccessToken();
    return res.json({ access_token: token, expires_in: Math.max(0, Math.floor((tokenCache.expiresAt - Date.now()) / 1000)) });
  } catch (err) {
    console.error('Token error', err?.response?.data || err.message || err);
    return res.status(500).json({ error: 'Failed to fetch access token', detail: err?.response?.data || err.message });
  }
});

function getTimestamp() {
  const d = new Date();
  const YYYY = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const DD = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${YYYY}${MM}${DD}${hh}${mm}${ss}`;
}

function makePassword(shortcode, passkey, timestamp) {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}

async function initiateStkPush({ amount, phone, accountReference = 'Payment', transactionDesc = 'Payment', transactionType = 'CustomerPayBillOnline', metadata = {} }) {
  if (!amount || !phone) throw { status: 400, message: 'amount and phone are required' };
  if (!/^254\d{9}$/.test(phone)) throw { status: 400, message: 'phone must be in format 2547XXXXXXXX' };

  const txId = uuidv4();
  const tx = {
    id: txId,
    checkoutRequestID: `SIM_${txId}`,
    merchantRequestID: `SIM_M_${txId}`,
    amount,
    phone,
    status: 'pending',
    createdAt: Date.now(),
    meta: metadata,
  };

  transactions.set(tx.checkoutRequestID, tx);

  if (MPESA_SIMULATE === 'true') {
    // simulate callback after a short delay
    setTimeout(() => {
      const t = transactions.get(tx.checkoutRequestID);
      if (!t) return;
      t.status = 'success';
      t.confirmation = {
        ResultCode: 0,
        ResultDesc: 'The service request is processed successfully.',
        CheckoutRequestID: t.checkoutRequestID,
      };
      transactions.set(tx.checkoutRequestID, t);
      console.log(`Simulated STK callback for ${tx.checkoutRequestID}`);
    }, 5000); // 5 seconds

    return { tx, simulated: true };
  }

  const token = await getAccessToken();
  const timestamp = getTimestamp();
  const password = makePassword(MPESA_SHORTCODE, MPESA_PASSKEY, timestamp);

  const body = {
    BusinessShortCode: MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: transactionType,
    Amount: amount,
    PartyA: phone,
    PartyB: MPESA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: MPESA_CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc,
  };

  const response = await axios.post(`${MPESA_BASE}/mpesa/stkpush/v1/processrequest`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const { MerchantRequestID, CheckoutRequestID } = response.data;
  tx.merchantRequestID = MerchantRequestID;
  tx.checkoutRequestID = CheckoutRequestID;
  transactions.set(tx.checkoutRequestID, tx);

  return { tx, response: response.data };
}

// New, clearer STK Push endpoint
app.post('/api/mpesa/stkpush', async (req, res) => {
  if (DISABLE_STK) {
    return res.status(200).json({ simulated: true, message: 'STK push disabled by server (DISABLE_STK=true)' });
  }

  try {
    const { amount, phone, accountReference, transactionDesc, transactionType, metadata } = req.body;
    const result = await initiateStkPush({ amount, phone, accountReference, transactionDesc, transactionType, metadata });
    return res.json(result);
  } catch (err) {
    console.error('STK push error', err?.response?.data || err.message || err);
    const status = err?.status || 500;
    return res.status(status).json({ error: err?.message || 'Failed to initiate STK push', detail: err?.response?.data || err.message });
  }
});

// Backwards compatible route
// Backwards compatible route
app.post('/api/initiate-stk', async (req, res) => {
  if (DISABLE_STK) {
    return res.status(200).json({ simulated: true, message: 'STK push disabled by server (DISABLE_STK=true)' });
  }

  try {
    const { amount, phone, loanAmount, accountReference } = req.body;
    const { tx, response, simulated } = await initiateStkPush({ amount, phone, accountReference: accountReference || 'FISCIBBLE_SOLUTIONS', transactionDesc: 'Processing fee', metadata: { loanAmount } });
    return res.json({ tx, response, simulated });
  } catch (err) {
    console.error(err?.response?.data || err.message || err);
    const status = err?.status || 500;
    return res.status(status).json({ error: err?.message || 'Failed to initiate STK push', detail: err?.response?.data || err.message });
  }
});

function processStkCallback(rawBody) {
  const cb = rawBody?.Body?.stkCallback;
  if (!cb) throw { status: 400, message: 'Invalid callback payload' };
  const { CheckoutRequestID, MerchantRequestID, ResultCode, ResultDesc } = cb;
  const tx = transactions.get(CheckoutRequestID);
  if (!tx) {
    // store unknown tx for debugging
    const newTx = { id: uuidv4(), checkoutRequestID: CheckoutRequestID, status: ResultCode === 0 ? 'success' : 'failed', confirmation: cb, createdAt: Date.now() };
    transactions.set(CheckoutRequestID, newTx);
    console.warn('Received callback for unknown CheckoutRequestID', CheckoutRequestID);
    return newTx;
  }

  tx.status = ResultCode === 0 ? 'success' : 'failed';
  tx.confirmation = cb;
  transactions.set(CheckoutRequestID, tx);
  console.log(`Updated tx ${CheckoutRequestID} status=${tx.status}`);
  return tx;
}

// Endpoint to receive STK push callbacks from Safaricom
app.post('/api/stk-callback', (req, res) => {
  try {
    const result = processStkCallback(req.body);
    return res.json({ success: true, tx: result });
  } catch (err) {
    console.error('Error handling callback', err);
    return res.status(err?.status || 500).json({ error: err?.message || 'Failed to process callback' });
  }
});

// Alternate path for Daraja/production: keep both endpoints supported
app.post('/api/mpesa/callback', (req, res) => {
  try {
    const result = processStkCallback(req.body);
    return res.json({ success: true, tx: result });
  } catch (err) {
    console.error('Error handling callback', err);
    return res.status(err?.status || 500).json({ error: err?.message || 'Failed to process callback' });
  }
});

// Manual mock callback (for local testing) - POST /api/mock-callback/:checkoutRequestID { status: 'success'|'failed' }
app.post('/api/mock-callback/:checkoutRequestID', (req, res) => {
  const id = req.params.checkoutRequestID;
  const { status } = req.body;
  const tx = transactions.get(id);
  if (!tx) return res.status(404).json({ error: 'tx not found' });
  tx.status = status === 'success' ? 'success' : 'failed';
  tx.confirmation = { ResultCode: status === 'success' ? 0 : 1, ResultDesc: `Mock ${status}` };
  transactions.set(id, tx);
  return res.json({ success: true, tx });
});

app.get('/api/transactions/:checkoutRequestID', (req, res) => {
  const id = req.params.checkoutRequestID;
  const tx = transactions.get(id);
  if (!tx) return res.status(404).json({ error: 'tx not found' });
  return res.json(tx);
});

app.listen(PORT, () => {
  console.log(`MPesa sandbox server listening on http://localhost:${PORT}`);
  console.log(`Simulation mode: ${MPESA_SIMULATE === 'true' ? 'ON' : 'OFF'}`);
});