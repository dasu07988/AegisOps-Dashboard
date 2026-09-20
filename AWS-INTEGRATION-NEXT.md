# AWS Integration Next Step

Do not put AWS access keys in the React frontend.

Use:
React Dashboard
  -> API Gateway
  -> Lambda
  -> DynamoDB AegisOps-Incidents

The current UI is already separated from the data layer in:
src/services/incidentService.js

When the API is available, implement:
GET /api/incidents
GET /api/incidents/{incident_id}

Optional:
PATCH /api/incidents/{incident_id}
for controlled status changes.

For a production dashboard, add authentication/authorization before exposing incident data.
