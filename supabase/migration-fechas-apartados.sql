-- Periodos Desde/Hasta por apartado (Dieta, Tratamiento, Proceso)
-- Ejecutar en Supabase → SQL Editor si la tabla incidencias ya existía
-- Compatible con esquemas antiguos (solo desde/hasta global) y con dieta_fecha, etc.

ALTER TABLE public.incidencias
  ADD COLUMN IF NOT EXISTS dieta_desde text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS dieta_hasta text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS tratamiento_desde text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS tratamiento_hasta text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS proceso_desde text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS proceso_hasta text NOT NULL DEFAULT '';

-- Migrar datos legacy solo si existen esas columnas en la tabla
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'incidencias' AND column_name = 'dieta_fecha'
  ) THEN
    EXECUTE $sql$
      UPDATE public.incidencias
      SET dieta_desde = dieta_fecha
      WHERE COALESCE(dieta_desde, '') = '' AND COALESCE(dieta_fecha, '') <> ''
    $sql$;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'incidencias' AND column_name = 'tratamiento_fecha'
  ) THEN
    EXECUTE $sql$
      UPDATE public.incidencias
      SET tratamiento_desde = tratamiento_fecha
      WHERE COALESCE(tratamiento_desde, '') = '' AND COALESCE(tratamiento_fecha, '') <> ''
    $sql$;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'incidencias' AND column_name = 'proceso_fecha'
  ) THEN
    EXECUTE $sql$
      UPDATE public.incidencias
      SET proceso_desde = proceso_fecha
      WHERE COALESCE(proceso_desde, '') = '' AND COALESCE(proceso_fecha, '') <> ''
    $sql$;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'incidencias' AND column_name = 'desde'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'incidencias' AND column_name = 'hasta'
  ) THEN
    EXECUTE $sql$
      UPDATE public.incidencias
      SET
        tratamiento_desde = COALESCE(NULLIF(tratamiento_desde, ''), NULLIF(desde, ''), ''),
        tratamiento_hasta = COALESCE(NULLIF(tratamiento_hasta, ''), NULLIF(hasta, ''), '')
      WHERE COALESCE(desde, '') <> '' OR COALESCE(hasta, '') <> ''
    $sql$;
  END IF;
END $$;

-- Refrescar caché de PostgREST (evita "column not found in schema cache")
NOTIFY pgrst, 'reload schema';
