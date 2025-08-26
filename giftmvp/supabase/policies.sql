-- Additional hardening examples (apply after schema.sql as needed)

-- Allow reading wishlist content by share_id via PostgREST rpc could be added,
-- but for simplicity, API routes handle access using share_id tokens server-side.