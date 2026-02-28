-- Tournament purse data: total prize money per event per season.
-- Seeded once per season when purse amounts are announced.
-- Keyed by DataGolf event_id + season for stable lookups.

CREATE TABLE IF NOT EXISTS tournament_purses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  dg_event_id text NOT NULL,
  season integer NOT NULL,
  event_name text NOT NULL,
  purse integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (dg_event_id, season)
);

-- Public read access (no auth required — purse data is not sensitive)
ALTER TABLE tournament_purses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tournament_purses: public read" ON tournament_purses
  FOR SELECT USING (true);

-- Only service role can insert/update (via migrations or admin scripts)
CREATE POLICY "tournament_purses: service role write" ON tournament_purses
  FOR ALL USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Index for the primary lookup pattern: all purses for a season
CREATE INDEX idx_tournament_purses_season ON tournament_purses (season);

-- ============================================================
-- 2026 PGA Tour season seed data
-- Verified purses: pgatour.com 2026 schedule
-- Carry-forward purses: prior season amounts (marked below)
-- DataGolf event IDs: from /get-schedule?tour=pga
-- ============================================================

INSERT INTO tournament_purses (dg_event_id, season, event_name, purse) VALUES
  -- All purses verified from pgatour.com 2026 schedule unless noted
  ('6',   2026, 'Sony Open in Hawaii',                               9100000),
  ('2',   2026, 'The American Express',                              9200000),
  ('4',   2026, 'Farmers Insurance Open',                            9600000),
  ('3',   2026, 'WM Phoenix Open',                                   9600000),
  ('5',   2026, 'AT&T Pebble Beach Pro-Am',                         20000000),
  ('7',   2026, 'The Genesis Invitational',                          20000000),
  ('10',  2026, 'Cognizant Classic in The Palm Beaches',              9600000),
  ('9',   2026, 'Arnold Palmer Invitational presented by Mastercard',20000000),
  ('483', 2026, 'Puerto Rico Open',                                   4000000),
  ('11',  2026, 'THE PLAYERS Championship',                          25000000),
  ('475', 2026, 'Valspar Championship',                               9100000),
  ('20',  2026, 'Texas Children''s Houston Open',                     9900000),
  ('41',  2026, 'Valero Texas Open',                                  9800000),
  ('12',  2026, 'RBC Heritage',                                      20000000),
  ('18',  2026, 'Zurich Classic of New Orleans',                      9500000),
  ('556', 2026, 'Cadillac Championship',                             20000000),
  ('480', 2026, 'Truist Championship',                               20000000),
  ('553', 2026, 'ONEflight Myrtle Beach Classic',                     4000000),
  ('19',  2026, 'THE CJ CUP Byron Nelson',                          10300000),
  ('21',  2026, 'Charles Schwab Challenge',                           9900000),
  ('23',  2026, 'the Memorial Tournament presented by Workday',      20000000),
  ('32',  2026, 'RBC Canadian Open',                                  9800000),
  ('34',  2026, 'Travelers Championship',                            20000000),
  ('30',  2026, 'John Deere Classic',                                 8800000),
  ('541', 2026, 'Genesis Scottish Open',                              9000000),
  ('518', 2026, 'ISCO Championship',                                  4000000),
  ('522', 2026, 'Corales Puntacana Championship',                     4000000),
  ('525', 2026, '3M Open',                                            8800000),
  ('524', 2026, 'Rocket Classic',                                    10000000),
  ('13',  2026, 'Wyndham Championship',                               8500000),
  ('27',  2026, 'FedEx St. Jude Championship',                      20000000),
  ('28',  2026, 'BMW Championship',                                  20000000),
  ('60',  2026, 'TOUR Championship',                                 40000000),
  ('557', 2026, 'Biltmore Championship Asheville',                    5000000),
  ('554', 2026, 'Bank of Utah Championship',                          6000000),
  ('527', 2026, 'Baycurrent Classic',                                 8000000),
  ('528', 2026, 'Butterfield Bermuda Championship',                   6000000),
  ('540', 2026, 'VidantaWorld Mexico Open',                           6000000),
  ('457', 2026, 'World Wide Technology Championship',                 6000000),
  ('558', 2026, 'Good Good Championship',                             6000000),
  ('493', 2026, 'The RSM Classic',                                    7400000),

  -- PGA Tour shows "-" for these (purse not publicly disclosed).
  -- Prior-year estimates; update when announced.
  ('33',  2026, 'PGA Championship',                                  19000000),
  ('26',  2026, 'U.S. Open',                                        21500000),
  ('100', 2026, 'The Open Championship',                             17000000)

  -- Not seeded (no purse disclosed or not applicable):
  -- '14'  Masters Tournament (PGA Tour shows "-")
  -- '500' Presidents Cup (team event, no individual purse)
  -- '478' Hero World Challenge (invitational, PGA Tour shows "-")

ON CONFLICT (dg_event_id, season) DO UPDATE SET
  event_name = EXCLUDED.event_name,
  purse = EXCLUDED.purse;
