# SAGE Educational Session (Sage Academic)

Online Tutorial with live tutorial question and answer platform. Built with Next.js App Router, TypeScript, and Tailwind CSS 4, connecting to the Laravel backend API.

## Backend Endpoint

- **Production API Endpoint**: `https://sage-endpoint.onrender.com/api`
- **Root Health / Info**: `https://sage-endpoint.onrender.com/`

## Getting started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Available scripts

- `npm run dev` — start the local development server
- `npm run lint` — run ESLint
- `npm run build` — create the production build
- `npm run start` — serve the production build

## Configuration

Set the backend API URL in `.env.local` or environment variables:

```env
NEXT_PUBLIC_API_URL=https://sage-endpoint.onrender.com/api
```
