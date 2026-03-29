-- Allow any authenticated user to upsert tournament purse data.
-- Purses are non-sensitive global data (crowdsourced).

DROP POLICY IF EXISTS "tournament_purses: service role write" ON tournament_purses;

CREATE POLICY "tournament_purses: authenticated write" ON tournament_purses
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
