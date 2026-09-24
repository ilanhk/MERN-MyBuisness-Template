# NestJS Backend Migration

This is the new NestJS backend for MyBusiness. The existing Express backend in `../backend` remains the active fallback during migration.

## Development

```powershell
npm install
Copy-Item .env.example .env
npm run start:dev
```

The initial health endpoint is available at `http://localhost:5000/api/health`.

## Migration rules

- Preserve existing API paths and response contracts.
- Do not change the existing `backend/` project while migrating features.
- Add feature modules and integration tests before switching the active backend.
