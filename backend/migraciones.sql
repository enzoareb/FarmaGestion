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

-- 2026-03-XX: tablas vademécums (solo si no existen)
CREATE TABLE IF NOT EXISTS vademecums (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  descripcion   VARCHAR(255) DEFAULT NULL,
  activo        TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vademecum_productos (
  vademecum_id  INT UNSIGNED NOT NULL,
  producto_id   INT UNSIGNED NOT NULL,
  prioridad     INT UNSIGNED DEFAULT NULL,
  observacion   VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (vademecum_id, producto_id),
  FOREIGN KEY (vademecum_id) REFERENCES vademecums(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id)  REFERENCES productos(id)  ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS programa_vademecum (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  os_programa_id   INT UNSIGNED NOT NULL,
  vademecum_id     INT UNSIGNED NOT NULL,
  tipo_beneficio   ENUM('porcentaje','monto_fijo') NOT NULL,
  valor_beneficio  DECIMAL(12,2) NOT NULL,
  activo           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_programa_vademecum (os_programa_id, vademecum_id),
  FOREIGN KEY (os_programa_id) REFERENCES os_programas(id) ON DELETE CASCADE,
  FOREIGN KEY (vademecum_id)   REFERENCES vademecums(id)   ON DELETE CASCADE
) ENGINE=InnoDB;

-- 2026-03-XX: tablas prestadores (solo si no existen)
CREATE TABLE IF NOT EXISTS prestadores (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre           VARCHAR(120) NOT NULL,
  codigo_prestador VARCHAR(40)  NOT NULL,
  activo           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_prestador_codigo (codigo_prestador)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS prestador_planes (
  prestador_id   INT UNSIGNED NOT NULL,
  os_programa_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (prestador_id, os_programa_id),
  FOREIGN KEY (prestador_id)   REFERENCES prestadores(id)  ON DELETE CASCADE,
  FOREIGN KEY (os_programa_id) REFERENCES os_programas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

