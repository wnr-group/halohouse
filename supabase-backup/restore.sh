#!/bin/bash
# HaloHouse Restore Script
# Usage: ./restore.sh <PROJECT_REF> <SERVICE_ROLE_KEY> <ANON_KEY>
#
# Prerequisites:
#   1. Create a new Supabase project
#   2. Run: supabase link --project-ref <PROJECT_REF>
#   3. Run this script

set -e

PROJECT_REF="$1"
SERVICE_KEY="$2"
ANON_KEY="$3"
SUPABASE_URL="https://${PROJECT_REF}.supabase.co"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -z "$PROJECT_REF" ] || [ -z "$SERVICE_KEY" ] || [ -z "$ANON_KEY" ]; then
  echo "Usage: ./restore.sh <PROJECT_REF> <SERVICE_ROLE_KEY> <ANON_KEY>"
  exit 1
fi

echo "=== Step 1: Apply schema migration ==="
echo "Copy restore.sql to supabase/migrations/ and run: supabase db push"
echo "Press Enter after you've done that..."
read -r

echo "=== Step 2: Create resumes storage bucket ==="
curl -s -X POST "${SUPABASE_URL}/storage/v1/bucket" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"id":"resumes","name":"resumes","public":true}'
echo ""
echo "Bucket created."

echo "=== Step 3: Upload resume files ==="
for file in "$SCRIPT_DIR/resumes/applications/"*.pdf; do
  filename=$(basename "$file")
  echo "Uploading $filename..."
  curl -s -X POST "${SUPABASE_URL}/storage/v1/object/resumes/applications/${filename}" \
    -H "Authorization: Bearer ${SERVICE_KEY}" \
    -H "Content-Type: application/pdf" \
    --data-binary "@${file}"
  echo ""
done

echo "=== Step 4: Restore table data ==="
for table in jobs contact_messages book_sessions; do
  echo "Restoring $table..."
  curl -s -X POST "${SUPABASE_URL}/rest/v1/${table}" \
    -H "Authorization: Bearer ${SERVICE_KEY}" \
    -H "apikey: ${ANON_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d @"$SCRIPT_DIR/${table}.json"
  echo " done."
done

# job_applications needs special handling — update resume_url to new project
echo "Restoring job_applications (with updated resume URLs)..."
python3 -c "
import json, sys
data = json.load(open('$SCRIPT_DIR/job_applications.json'))
for row in data:
    if row.get('resume_url'):
        row['resume_url'] = row['resume_url'].replace(
            'iywvylvtpujhkyiahxka.supabase.co',
            '${PROJECT_REF}.supabase.co'
        )
json.dump(data, sys.stdout)
" | curl -s -X POST "${SUPABASE_URL}/rest/v1/job_applications" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d @-
echo " done."

echo ""
echo "=== Step 5: Update HaloHouse .env ==="
echo "Set these in your HaloHouse project's .env:"
echo "  VITE_SUPABASE_URL=${SUPABASE_URL}"
echo "  VITE_SUPABASE_ANON_KEY=${ANON_KEY}"
echo ""
echo "=== Restore complete! ==="
