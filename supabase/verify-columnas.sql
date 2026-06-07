-- Comprobar columnas de incidencias (ejecutar en SQL Editor)
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'incidencias'
ORDER BY ordinal_position;

-- Debe aparecer dieta_desde, dieta_hasta, tratamiento_desde, etc.
-- Si no aparecen, ejecuta migration-fechas-apartados.sql en ESTE mismo proyecto.
