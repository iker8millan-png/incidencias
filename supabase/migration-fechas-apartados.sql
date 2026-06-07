-- Periodos Desde/Hasta por apartado (Dieta, Tratamiento, Proceso)
-- Ejecutar en Supabase → SQL Editor si la tabla incidencias ya existía

ALTER TABLE public.incidencias
  ADD COLUMN IF NOT EXISTS dieta_desde text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS dieta_hasta text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS tratamiento_desde text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS tratamiento_hasta text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS proceso_desde text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS proceso_hasta text NOT NULL DEFAULT '';

-- Migrar fechas simples antiguas → desde (hasta queda vacío)
UPDATE public.incidencias
SET
  dieta_desde = COALESCE(NULLIF(dieta_desde, ''), dieta_fecha, ''),
  tratamiento_desde = COALESCE(
    NULLIF(tratamiento_desde, ''),
    NULLIF(tratamiento_fecha, ''),
    NULLIF(desde, ''),
    ''
  ),
  tratamiento_hasta = COALESCE(NULLIF(tratamiento_hasta, ''), NULLIF(hasta, ''), ''),
  proceso_desde = COALESCE(NULLIF(proceso_desde, ''), proceso_fecha, '')
WHERE dieta_fecha <> ''
   OR tratamiento_fecha <> ''
   OR proceso_fecha <> ''
   OR desde <> ''
   OR hasta <> '';
