 NovaBank (Simulated Banking)

This repo contains a simple MERN + TypeScript banking demo with simulated balances.

## Structure
- `server/` Express + MongoDB API
- `client/` React + Vite UI

## Requirements
- Node.js 18+
- MongoDB
- Brevo API key for transactional email

## Setup

### Server
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Client
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Notes
- All balances are stored in cents.
- No real money transactions or payment gateways are used.