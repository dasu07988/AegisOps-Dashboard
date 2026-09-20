# AegisOps AI — Cloud Operations Dashboard

A professional React/Vite dashboard for the AegisOps AI autonomous cloud operations project.

## What is included

- Executive operations overview
- Active incident table
- Severity and status badges
- CPU utilization chart with alarm threshold
- Incident detail view
- AI analysis sections
- Evidence vs hypothesis presentation
- RAG / runbook intelligence panel
- Incident timeline
- DynamoDB-oriented incident data model
- Search and filters
- Responsive desktop/mobile layout
- Clean service abstraction for connecting the real AWS API

## Current data mode

The dashboard starts in **mock-data mode** so it runs immediately.

The integration point is:

`src/services/incidentService.js`

When your API is ready, replace `getIncidents()` with your API call and set `useMockData` to `false`.

Recommended backend endpoint:

`GET /api/incidents`

Response:

```json
{
  "incidents": []
}
```

## Run locally

```bash
npm install
npm run dev
```

Then open the URL shown by Vite, normally:

`http://localhost:5173`

## Build

```bash
npm run build
```

## AWS integration next

The current Lambda writes incidents to:

`AegisOps-Incidents`

The frontend should NOT access DynamoDB directly from the browser using AWS credentials.

Recommended architecture:

Browser
  ↓
React Dashboard
  ↓
API Gateway
  ↓
Lambda / Incident API
  ↓
DynamoDB
  ↓
AegisOps-Incidents

This keeps AWS credentials and database permissions on the server side.

## Important metric note

The backend currently stores values such as `0.51`. The dashboard displays the stored value as `51%` for the demo. Before production use, standardize the representation at the API boundary so the UI cannot accidentally misinterpret CloudWatch percentage values.

## Main routes

- `/` — Overview
- `/incidents` — Incident list
- `/incidents/:id` — Incident details
- `/infrastructure`
- `/runbooks`
- `/ai-analysis`
- `/activity`
- `/settings`
