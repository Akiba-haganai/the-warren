-- 1. Enable Row Level Security on the episodes table
ALTER TABLE IF EXISTS public.episodes ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous and authenticated read access to all podcast episodes
DROP POLICY IF EXISTS "public read episodes" ON public.episodes;
CREATE POLICY "public read episodes"
ON public.episodes
FOR SELECT
USING (true);

-- Indexes for performant ordering and category filtering
CREATE INDEX IF NOT EXISTS idx_episodes_published_date ON public.episodes (published_date DESC);
CREATE INDEX IF NOT EXISTS idx_episodes_category ON public.episodes (category);

-- 2. Aggregation View for Poll Results (avoids downloading raw votes to client)
CREATE OR REPLACE VIEW public.poll_results AS
SELECT
  poll_id,
  option_index,
  count(*)::int AS vote_count
FROM public.poll_votes
GROUP BY poll_id, option_index;

-- Allow public read access to the poll_results view
GRANT SELECT ON public.poll_results TO anon, authenticated;
