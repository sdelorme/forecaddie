-- Add slot column (1|2|3) to picks for 1 locked + 2 options per tournament.
-- Slot 1 = locked (OAD consumes player); slots 2,3 = options (do not consume).

-- Add slot column with default 1
ALTER TABLE public.picks ADD COLUMN IF NOT EXISTS slot integer DEFAULT 1;

-- Backfill existing picks to slot=1
UPDATE public.picks SET slot = 1 WHERE slot IS NULL;

-- Enforce slot not null
ALTER TABLE public.picks ALTER COLUMN slot SET NOT NULL;
ALTER TABLE public.picks ALTER COLUMN slot SET DEFAULT 1;

-- Drop old unique constraints/indexes (constraint-backed index must be dropped via ALTER TABLE)
ALTER TABLE public.picks DROP CONSTRAINT IF EXISTS picks_plan_id_event_id_key;
ALTER TABLE public.picks DROP CONSTRAINT IF EXISTS picks_plan_event_unique;
DROP INDEX IF EXISTS public.picks_plan_id_event_id_key;
DROP INDEX IF EXISTS public.picks_plan_event_unique;

-- New unique: one pick per (plan, event, slot)
CREATE UNIQUE INDEX IF NOT EXISTS picks_plan_event_slot_unique
  ON public.picks USING btree (plan_id, event_id, slot);

-- OAD: player uniqueness only for slot=1 (locked). Drop old, create partial.
ALTER TABLE public.picks DROP CONSTRAINT IF EXISTS picks_plan_player_unique;
DROP INDEX IF EXISTS public.picks_plan_player_unique;

CREATE UNIQUE INDEX IF NOT EXISTS picks_plan_player_slot1_unique
  ON public.picks USING btree (plan_id, player_dg_id)
  WHERE (player_dg_id IS NOT NULL AND slot = 1);
