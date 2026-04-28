# Appwrite — Setup & Deployment

This project uses **Appwrite** for database, auth, storage, and functions.
All private credentials are loaded by **Coolify** as environment variables.

## 1. Required environment variables

### Frontend (Coolify build env, exposed to Vite — safe to be public)
```
VITE_APPWRITE_ENDPOINT=https://api.cosentini.it/v1
VITE_APPWRITE_PROJECT_ID=69ee63d10023cad5bb3a
VITE_APPWRITE_PROJECT_NAME=Studio Legale Cosentini
```

### Setup script (one-shot, only when provisioning)
```
APPWRITE_ENDPOINT=https://api.cosentini.it/v1
APPWRITE_PROJECT_ID=69ee63d10023cad5bb3a
APPWRITE_API_KEY=<server API key — needs databases.* + buckets.*>
```

### Functions (Coolify env, on each function)
```
RESEND_API_KEY=<your Resend key>
```

## 2. Provision the project (one time)

```bash
bun add -d node-appwrite
APPWRITE_ENDPOINT=... APPWRITE_PROJECT_ID=... APPWRITE_API_KEY=... \
  bun run scripts/setup-appwrite.ts
```

The script is idempotent (re-runs are safe). It creates:
- Database `main`
- Collections: `team_members`, `articles`, `commented_sentences`, `consultation_requests`, `linkedin_articles`
- Buckets: `team-photos`, `sentences-pdfs`
- All attributes, indexes and permissions

## 3. Create admin user

1. Appwrite console → **Auth → Users → Create user** (email + password).
2. Open the user → **Labels** tab → add label `admin`.
   That label is what unlocks dashboard reads/writes on `consultation_requests` and write access elsewhere.

## 4. Deploy functions

Two functions live in `/functions`:
- `send-consultation-email` — execute access: **users** (anonymous sessions OK)
- `send-status-email` — execute access: **label:admin**

Runtime: **Node 20+** (or higher). Entrypoint: `src/main.js`. Set `RESEND_API_KEY` as env var on each function.

## 5. Architecture notes

- The consultation form creates a **short-lived anonymous session** before writing
  the document and invoking the email function. This keeps the function locked
  down (only authenticated sessions can execute) while letting the public form
  work without credentials. Per-document permissions on the new request restrict
  read/update/delete to the `admin` label.
- File storage uses Appwrite's per-file public-read URL via `/files/{id}/view`.
- The `useAuth` hook treats anonymous sessions (empty email) as logged-out,
  so the dashboard guard still works.
