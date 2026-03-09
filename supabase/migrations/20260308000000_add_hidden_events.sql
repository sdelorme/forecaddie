-- Add hidden_events column to season_plans for hiding irrelevant tournaments.
-- Stores an array of event_id strings that should be hidden from the plan view.

ALTER TABLE public.season_plans
  ADD COLUMN IF NOT EXISTS hidden_events text[] DEFAULT '{}';
