-- ============================================================
-- Migración SOLO Prestadores
-- Ejecutar sobre la base: farmagestion
-- ============================================================

USE farmagestion;

-- Crear prestadores si no existe
CREATE TABLE IF NOT EXISTS prestadores (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre           VARCHAR(120) NOT NULL,
  codigo_prestador VARCHAR(40)  NOT NULL,
  provincia       VARCHAR(60)  NOT NULL DEFAULT 'Buenos Aires',
  tipo_liquidacion VARCHAR(30) NOT NULL DEFAULT 'por renglon',
  activo           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_prestador_codigo (codigo_prestador)
) ENGINE=InnoDB;

-- Agregar columnas faltantes (si la tabla existía vieja)
SET @__col := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'prestadores'
    AND COLUMN_NAME = 'provincia'
);
SET @__sql = IF(@__col = 0,
  'ALTER TABLE prestadores ADD COLUMN provincia VARCHAR(60) NOT NULL DEFAULT ''Buenos Aires'';',
  'SELECT 1;'
);
PREPARE stmt FROM @__sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @__col := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'prestadores'
    AND COLUMN_NAME = 'tipo_liquidacion'
);
SET @__sql = IF(@__col = 0,
  'ALTER TABLE prestadores ADD COLUMN tipo_liquidacion VARCHAR(30) NOT NULL DEFAULT ''por renglon'';',
  'SELECT 1;'
);
PREPARE stmt FROM @__sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Preparar prestador_planes con esquema nuevo (codigo/nombre/activo/id)
SET @__table_exists := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'prestador_planes'
);

SET @__has_codigo := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'prestador_planes'
    AND COLUMN_NAME = 'codigo'
);

-- Si ya existía pero era del esquema viejo, renombramos a legacy y recreamos
SET @__do_rename := IF(@__table_exists > 0 AND @__has_codigo = 0, 1, 0);
SET @__sql = IF(@__do_rename = 1,
  'RENAME TABLE prestador_planes TO prestador_planes_legacy',
  'SELECT 1'
);
PREPARE stmt FROM @__sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS prestador_planes (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  prestador_id  INT UNSIGNED NOT NULL,
  codigo        VARCHAR(40) NOT NULL,
  nombre        VARCHAR(120) NOT NULL,
  activo        TINYINT(1) NOT NULL DEFAULT 1,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_prestador_codigo (prestador_id, codigo),
  FOREIGN KEY (prestador_id) REFERENCES prestadores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- Web service del prestador (1 a 1) + URLs
-- ============================================================
CREATE TABLE IF NOT EXISTS prestador_webservice (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  prestador_id     INT UNSIGNED NOT NULL,
  usuario          VARCHAR(120) DEFAULT NULL,
  contrasena       VARCHAR(255) DEFAULT NULL,
  id_organizacion  VARCHAR(80)  DEFAULT NULL,
  codigo_prestador VARCHAR(40)  NOT NULL,
  wsu_id           VARCHAR(80)  DEFAULT NULL,
  activo           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_prestador_webservice (prestador_id),
  FOREIGN KEY (prestador_id) REFERENCES prestadores(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Compatibilidad para bases donde estas columnas existían NOT NULL
SET @__col_nullable := (
  SELECT IS_NULLABLE
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'prestador_webservice'
    AND COLUMN_NAME = 'usuario'
  LIMIT 1
);
SET @__sql = IF(@__col_nullable = 'NO',
  'ALTER TABLE prestador_webservice MODIFY COLUMN usuario VARCHAR(120) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @__sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @__col_nullable := (
  SELECT IS_NULLABLE
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'prestador_webservice'
    AND COLUMN_NAME = 'contrasena'
  LIMIT 1
);
SET @__sql = IF(@__col_nullable = 'NO',
  'ALTER TABLE prestador_webservice MODIFY COLUMN contrasena VARCHAR(255) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @__sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @__col_nullable := (
  SELECT IS_NULLABLE
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'prestador_webservice'
    AND COLUMN_NAME = 'id_organizacion'
  LIMIT 1
);
SET @__sql = IF(@__col_nullable = 'NO',
  'ALTER TABLE prestador_webservice MODIFY COLUMN id_organizacion VARCHAR(80) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @__sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @__col_nullable := (
  SELECT IS_NULLABLE
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'prestador_webservice'
    AND COLUMN_NAME = 'wsu_id'
  LIMIT 1
);
SET @__sql = IF(@__col_nullable = 'NO',
  'ALTER TABLE prestador_webservice MODIFY COLUMN wsu_id VARCHAR(80) NULL',
  'SELECT 1'
);
PREPARE stmt FROM @__sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS prestador_webservice_urls (
  id                    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  prestador_webservice_id INT UNSIGNED NOT NULL,
  tipo                  VARCHAR(60)  NOT NULL,
  link                  VARCHAR(500) NOT NULL,
  activo                TINYINT(1)   NOT NULL DEFAULT 1,
  created_at            DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (prestador_webservice_id) REFERENCES prestador_webservice(id) ON DELETE CASCADE
) ENGINE=InnoDB;

