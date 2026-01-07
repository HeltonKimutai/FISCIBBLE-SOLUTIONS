# FISCIBBLE SOLUTIONS M-Pesa Sandbox Server

This is a small Express server to help test M-Pesa Daraja STK push integration in sandbox mode for FISCIBBLE SOLUTIONS.

Features:
- `POST /api/initiate-stk` — initiates an STK push (calls Daraja sandbox or simulates callback)
- `POST /api/stk-callback` — endpoint to receive callbacks from Daraja (register this in Daraja dashboard)
- `POST /api/mock-callback/:checkoutRequestID` — manually trigger a callback for local testing
- `GET /api/transactions/:checkoutRequestID` — check transaction status

Setup
1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies: `npm install`
3. Run: `npm run dev`

Notes
- For quick local testing without exposing a public callback URL, set `MPESA_SIMULATE=true` in `.env`. The server will simulate a success callback about 5s after initiating STK.
- To test with the real sandbox, set `MPESA_SIMULATE=false`, provide valid sandbox creds and a publicly reachable `MPESA_CALLBACK_URL` (use ngrok during local development).

API Reference
- POST /api/mpesa/stkpush
  - Body: { amount, phone (254...), accountReference?, transactionDesc?, transactionType? }
  - Response: { tx, response } where `tx.checkoutRequestID` or `response.CheckoutRequestID` will identify the transaction.

- POST /api/initiate-stk (backwards-compatible)
  - Body: { amount, phone, loanAmount? }

- POST /api/stk-callback and POST /api/mpesa/callback
  - Daraja will POST to your callback URL (see `MPESA_CALLBACK_URL`) with the payment result JSON.

- GET /api/mpesa/token
  - Returns cached access token for testing/debugging.

Testing tools
- `npm run test-stkpush -- 254773532309 1` — initiate a sandbox STK push to the test number (or set `MPESA_SIMULATE=true` to simulate)
- `npm run simulate-callback -- <checkoutRequestID>` — trigger the mock callback endpoint for a given checkoutRequestID

Security
- Keep your `MPESA_CONSUMER_KEY` / `MPESA_CONSUMER_SECRET` / `MPESA_PASSKEY` private and never commit them to source control.
- For production, ensure you use HTTPS for callbacks and consider whitelisting Safaricom IPs on your webhook endpoint.
