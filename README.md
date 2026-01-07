# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## Local M-Pesa sandbox server (STK push testing)

To test Daraja (M-Pesa) STK push locally we added a small Express server under `/server`.

1. Copy `server/.env.example` → `server/.env` and fill in sandbox credentials (or keep `MPESA_SIMULATE=true` to auto-simulate callbacks).
2. Install and run the server:

```bash
cd server
npm install
npm run dev
```

3. With `MPESA_SIMULATE=true` the server will simulate a successful STK callback ~5s after initiating the STK push. The included UI component `MPesaPay` (on the Index page) will poll for the transaction status and display the result.

4. To test with the real Daraja sandbox, set `MPESA_SIMULATE=false`, put valid sandbox credentials and set `MPESA_CALLBACK_URL` to a public URL (use ngrok) and register that with Safaricom sandbox dashboard.

Quick developer tips
- Environment: copy `server/.env.example` → `server/.env` and fill credentials. Use `MPESA_ENV=sandbox` or `MPESA_ENV=production` when switching.
- Token: GET `/api/mpesa/token` returns a cached access token (useful for debugging).
- Simulate callback: `npm run simulate-callback -- <checkoutRequestID>` (runs against the local server URL; set `SERVER_URL` env var if different).
- Test STK push: `npm run test-stkpush -- 254773532309 1`

If you'd like, I can:
1. Add server-side DB storage for transactions instead of the in-memory Map.
2. Add automated tests (Jest) that mock Daraja endpoints.
3. Harden callback verification (IP whitelisting/signature verification guidance).

Tell me which of those you'd like me to implement next and I will proceed.

