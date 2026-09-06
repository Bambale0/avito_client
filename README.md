# Avito Management Dashboard

> **React/TypeScript dashboard for marketplace operations** · listings · analytics · messenger · OAuth · API automation
>
> Repository codename: `avito_client`.

Avito Management Dashboard is a web client for operating Avito-related workflows through a backend API. It covers listings, analytics, promotion actions, customer messages and account-level operations in a single interface.

## What this project demonstrates

- React + TypeScript application architecture.
- Vite build pipeline.
- Material UI component system.
- React Router navigation.
- Axios-based API layer.
- Analytics charts with Recharts.
- OAuth-oriented account connection flow.
- Responsive desktop/tablet/mobile UI.
- Integration with a separate backend service rather than embedding marketplace credentials in the browser.

## Product areas

### Dashboard

- high-level listing/account statistics;
- views and contact metrics;
- system/API status;
- visual analytics.

### Listings

- active listing management;
- price updates;
- promotion actions;
- bulk operations.

### Messenger

- customer conversations;
- incoming-message handling;
- sending messages and images;
- webhook-oriented notification flow.

### Analytics

- views and contacts;
- conversion indicators;
- geography/time trends;
- chart-based reporting.

## Architecture

```text
React / TypeScript client
          |
          v
      API service layer
          |
          v
   Backend Avito service
          |
          +--> Avito Messenger API
          +--> Listings / Ads API
          +--> statistics / promotion APIs
          +--> OAuth/account integration
```

Production credentials belong to the backend/service environment and are not part of this public repository.

## Stack

| Area | Technology |
| --- | --- |
| UI | React 18, TypeScript |
| Build | Vite |
| Components | Material UI |
| Routing | React Router |
| API client | Axios |
| Charts | Recharts |
| Quality | ESLint / Prettier |
| Deployment | static production build / Docker-compatible serving |

## Repository layout

```text
src/
├── components/
├── pages/
├── services/
├── types/
├── utils/
└── main.tsx
```

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run lint
npm run build
```

## Portfolio note

This repository is included as a frontend/API-integration case. The more backend-heavy production projects on this profile demonstrate FastAPI, PostgreSQL, Redis, billing and worker architecture; this one shows the client side of an operational business dashboard.
