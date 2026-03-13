-- ============================================================
-- VADEMÉCUMS — Consultas de ejemplo
-- ============================================================
-- Reemplazar :plan_id, :vademecum_id, :producto_id por valores reales.

-- -----------------------------------------------------------------------
-- 1. Dado un plan de obra social: ¿tiene vademécum? ¿qué beneficio aplica?
-- -----------------------------------------------------------------------
SELECT
  pv.id,
  pv.os_programa_id,
  v.nombre AS vademecum_nombre,
  pv.tipo_beneficio,
  pv.valor_beneficio
FROM programa_vademecum pv
JOIN vademecums v ON v.id = pv.vademecum_id
WHERE pv.os_programa_id = :plan_id
  AND pv.activo = 1
  AND v.activo = 1;

-- -----------------------------------------------------------------------
-- 2. Productos incluidos en un vademécum
-- -----------------------------------------------------------------------
SELECT
  p.id,
  p.nombre,
  p.codigo_barras,
  p.precio_venta,
  vp.prioridad,
  vp.observacion
FROM productos p
JOIN vademecum_productos vp ON vp.producto_id = p.id
WHERE vp.vademecum_id = :vademecum_id
  AND p.activo = 1
ORDER BY vp.prioridad IS NULL, vp.prioridad, p.nombre;

-- -----------------------------------------------------------------------
-- 3. Dado un plan y un producto: ¿está en el vademécum del plan? ¿qué beneficio aplica?
-- -----------------------------------------------------------------------
SELECT
  pv.tipo_beneficio,
  pv.valor_beneficio,
  v.nombre AS vademecum_nombre
FROM programa_vademecum pv
JOIN vademecums v ON v.id = pv.vademecum_id
JOIN vademecum_productos vp ON vp.vademecum_id = pv.vademecum_id AND vp.producto_id = :producto_id
WHERE pv.os_programa_id = :plan_id
  AND pv.activo = 1
  AND v.activo = 1
LIMIT 1;

-- -----------------------------------------------------------------------
-- 4. Planes que usan un vademécum dado
-- -----------------------------------------------------------------------
SELECT
  pv.id,
  os.nombre AS obra_social,
  op.nombre AS programa,
  pv.tipo_beneficio,
  pv.valor_beneficio
FROM programa_vademecum pv
JOIN os_programas op ON op.id = pv.os_programa_id
JOIN obras_sociales os ON os.id = op.os_id
WHERE pv.vademecum_id = :vademecum_id
  AND pv.activo = 1;

-- -----------------------------------------------------------------------
-- 5. Vademécums en los que está un producto
-- -----------------------------------------------------------------------
SELECT
  v.id,
  v.nombre,
  vp.prioridad,
  vp.observacion
FROM vademecums v
JOIN vademecum_productos vp ON vp.vademecum_id = v.id
WHERE vp.producto_id = :producto_id
  AND v.activo = 1;
