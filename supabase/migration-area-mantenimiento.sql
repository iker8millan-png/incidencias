-- Añade el área A.M (Mantenimiento) a incidencias existentes.
-- Ejecuta en Supabase → SQL Editor si ya tienes la base desplegada.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'area_code') THEN
    ALTER TYPE public.area_code ADD VALUE IF NOT EXISTS 'A.M';
  END IF;
END $$;

ALTER TABLE public.incidencias
  DROP CONSTRAINT IF EXISTS incidencias_de_check,
  DROP CONSTRAINT IF EXISTS incidencias_a_check;

ALTER TABLE public.incidencias
  ADD CONSTRAINT incidencias_de_check CHECK (
    de <@ ARRAY['A.D', 'A.S', 'A.T', 'P.R', 'EQ', 'A.C', 'A.L', 'A.R', 'A.CO', 'A.M']::text[]
  ),
  ADD CONSTRAINT incidencias_a_check CHECK (
    a <@ ARRAY['A.D', 'A.S', 'A.T', 'P.R', 'EQ', 'A.C', 'A.L', 'A.R', 'A.CO', 'A.M']::text[]
  );
