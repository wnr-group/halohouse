# HaloHouse Supabase Backup

**Created:** 2026-04-10
**Reason:** Deleting the HaloHouse Supabase project (ref: `iywvylvtpujhkyiahxka`) to save costs. This backup contains everything needed to restore the project on a new Supabase instance.

---

## What's Backed Up

| File | Description |
|---|---|
| `restore.sql` | Full DB schema — 4 tables (`jobs`, `job_applications`, `contact_messages`, `book_sessions`) + RLS policies |
| `restore.sh` | Automated restore script (schema + data + storage) |
| `jobs.json` | 2 job listings |
| `job_applications.json` | 6 applications |
| `contact_messages.json` | 6 contact form messages |
| `book_sessions.json` | 3 session bookings |
| `resumes/applications/` | 12 PDF resume files from the `resumes` storage bucket |

---

## How to Restore (3 steps)

### 1. Create a new Supabase project and link it

```bash
supabase link --project-ref <NEW_PROJECT_REF>
```

### 2. Apply the database schema

```bash
cp supabase-backup/restore.sql supabase/migrations/00000000000000_restore.sql
supabase db push
```

### 3. Run the restore script (data + storage bucket + resume files)

```bash
cd supabase-backup
./restore.sh <NEW_PROJECT_REF> <SERVICE_ROLE_KEY> <ANON_KEY>
```

This will:
- Create the `resumes` storage bucket (public)
- Upload all 12 resume PDFs
- Insert all data into the 4 tables
- Update resume URLs in `job_applications` to point to the new project

### 4. Update the HaloHouse frontend `.env`

```
VITE_SUPABASE_URL=https://<NEW_PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<NEW_ANON_KEY>
```

Redeploy on Vercel and you're back online.
