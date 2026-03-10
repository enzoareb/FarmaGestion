-- ============================================================
-- Migraciones manuales FarmaGestión
-- Ejecutar estas sentencias DESPUÉS de farmagestion_mysql.sql
-- ============================================================

-- 2026-03-10: agregar códigos adicionales de barras y códigos internos
ALTER TABLE productos
  ADD COLUMN codigo_barras2 VARCHAR(30) DEFAULT NULL AFTER codigo_barras,
  ADD COLUMN codigo_barras3 VARCHAR(30) DEFAULT NULL AFTER codigo_barras2,
  ADD COLUMN codigo_sud     VARCHAR(30) DEFAULT NULL AFTER codigo_alfabeta,
  ADD COLUMN codigo_suizo   VARCHAR(30) DEFAULT NULL AFTER codigo_sud,
  ADD COLUMN codigo_asopro  VARCHAR(30) DEFAULT NULL AFTER codigo_suizo;

