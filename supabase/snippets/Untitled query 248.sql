-- Confirm the bucket id itself is exactly right (catches typos/case mismatches)
select id, name, public
from storage.buckets
where id ilike '%portfolio%';