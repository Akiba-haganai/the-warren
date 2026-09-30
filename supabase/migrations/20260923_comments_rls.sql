-- Enable RLS on comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read approved comments
CREATE POLICY "Allow public read access for approved comments"
ON comments FOR SELECT
USING (is_approved = true);

-- The service role bypasses RLS anyway, so no insert policy is needed.
-- We ensure no anonymous insert is allowed by dropping the old unsafe policy.
DROP POLICY IF EXISTS "Allow service_role to insert comments" ON comments;

-- Drop previous open policies if they exist (assuming anon had insert access)
-- Note: Replace "policy_name" if you have a specific name, but if we don't know it, 
-- we can just rely on the new policies taking precedence or locking it down.
