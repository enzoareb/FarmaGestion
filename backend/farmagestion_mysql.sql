-- ============================================================
--  FarmaGestión — Schema MySQL completo
--  Motor: InnoDB | Charset: utf8mb4
--  Versión 2.0 | 2026-03-06
-- ============================================================

CREATE DATABASE IF NOT EXISTS farmagestion
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE farmagestion;

-- ============================================================
-- TABLA: usuarios del sistema
-- ============================================================
CREATE TABLE usuarios (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario       VARCHAR(60)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombre        VARCHAR(120) NOT NULL,
  rol           ENUM('admin','farmaceutico','cajero') NOT NULL DEFAULT 'cajero',
  activo        TINYINT(1)  NOT NULL DEFAULT 1,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Usuario inicial: admin / admin123  (cambiar en producción)
-- password_hash generado con bcrypt rounds=12
INSERT INTO usuarios (usuario, password_hash, nombre, rol) VALUES
  ('admin', '$2a$12$K8GpYzLzSjNmK.oQ3RV2A.rq2yXvFJlMNuFHtqC8pPj5E3h.j3Oru', 'Administrador', 'admin');

-- ============================================================
-- TABLA: categorías de productos
-- ============================================================
CREATE TABLE categorias (
  id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: laboratorios
-- ============================================================
CREATE TABLE laboratorios (
  id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  pais   VARCHAR(60)
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: obras_sociales
-- ============================================================
CREATE TABLE obras_sociales (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo           VARCHAR(20)  NOT NULL UNIQUE,
  nombre           VARCHAR(100) NOT NULL,
  mandataria       VARCHAR(100),
  telefono         VARCHAR(30),
  descuento        DECIMAL(5,2) NOT NULL DEFAULT 0,
  coseguro         DECIMAL(5,2) NOT NULL DEFAULT 100,
  requiere_receta  TINYINT(1)  NOT NULL DEFAULT 1,
  activa           TINYINT(1)  NOT NULL DEFAULT 1,
  observaciones    TEXT,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: programas de obras sociales
-- ============================================================
CREATE TABLE os_programas (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  os_id           INT UNSIGNED NOT NULL,
  nombre          VARCHAR(120) NOT NULL,
  descuento       DECIMAL(5,2) NOT NULL DEFAULT 0,
  coseguro        DECIMAL(10,2) NOT NULL DEFAULT 0,
  tope            DECIMAL(12,2),          -- NULL = sin tope
  requiere_receta TINYINT(1) NOT NULL DEFAULT 1,
  activo          TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (os_id) REFERENCES obras_sociales(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: prestadores (cada farmacia puede tener un código distinto por prestador)
-- ============================================================
CREATE TABLE prestadores (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre           VARCHAR(120) NOT NULL,
  codigo_prestador VARCHAR(40)  NOT NULL,
  activo           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_prestador_codigo (codigo_prestador)
) ENGINE=InnoDB;

-- Relación muchos a muchos: prestador ↔ planes de OS
CREATE TABLE prestador_planes (
  prestador_id   INT UNSIGNED NOT NULL,
  os_programa_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (prestador_id, os_programa_id),
  FOREIGN KEY (prestador_id)   REFERENCES prestadores(id)  ON DELETE CASCADE,
  FOREIGN KEY (os_programa_id) REFERENCES os_programas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: productos
-- ============================================================
CREATE TABLE productos (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo_barras   VARCHAR(30)   NOT NULL UNIQUE,
  codigo_barras2  VARCHAR(30)   DEFAULT NULL,
  codigo_barras3  VARCHAR(30)   DEFAULT NULL,
  codigo_alfabeta VARCHAR(30),
  codigo_sud      VARCHAR(30)   DEFAULT NULL,
  codigo_suizo    VARCHAR(30)   DEFAULT NULL,
  codigo_asopro   VARCHAR(30)   DEFAULT NULL,
  troquel         VARCHAR(30),
  nombre          VARCHAR(200)  NOT NULL,
  droga           VARCHAR(200),
  accion_terapeutica VARCHAR(200),
  laboratorio_id  INT UNSIGNED,
  categoria_id    INT UNSIGNED,
  presentacion    VARCHAR(100),
  precio_compra   DECIMAL(12,2) NOT NULL DEFAULT 0,
  precio_venta    DECIMAL(12,2) NOT NULL DEFAULT 0,
  stock_actual    INT           NOT NULL DEFAULT 0,
  stock_minimo    INT           NOT NULL DEFAULT 5,
  stock_maximo    INT,
  requiere_receta TINYINT(1)   NOT NULL DEFAULT 0,
  activo          TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (laboratorio_id) REFERENCES laboratorios(id),
  FOREIGN KEY (categoria_id)   REFERENCES categorias(id)
) ENGINE=InnoDB;

CREATE INDEX idx_producto_nombre   ON productos(nombre);
CREATE INDEX idx_producto_barras   ON productos(codigo_barras);
CREATE INDEX idx_producto_alfabeta ON productos(codigo_alfabeta);
CREATE INDEX idx_producto_activo   ON productos(activo);

-- ============================================================
-- TABLA: historial de precios
-- ============================================================
CREATE TABLE historial_precios (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  producto_id     INT UNSIGNED NOT NULL,
  precio_anterior DECIMAL(12,2) NOT NULL,
  precio_nuevo    DECIMAL(12,2) NOT NULL,
  motivo          ENUM('manual','porcentaje','csv','drogueria') NOT NULL,
  porcentaje      DECIMAL(6,2),
  usuario         VARCHAR(80),
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: vademécums (cada fila = un vademécum, ej. PAMI, IOMA Crónicos)
-- ============================================================
CREATE TABLE vademecums (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(120) NOT NULL,
  descripcion   VARCHAR(255) DEFAULT NULL,
  activo        TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: vademécum ↔ productos (muchos a muchos)
-- ============================================================
CREATE TABLE vademecum_productos (
  vademecum_id  INT UNSIGNED NOT NULL,
  producto_id   INT UNSIGNED NOT NULL,
  prioridad     INT UNSIGNED DEFAULT NULL COMMENT 'orden opcional dentro del vademécum',
  observacion   VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (vademecum_id, producto_id),
  FOREIGN KEY (vademecum_id) REFERENCES vademecums(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id)  REFERENCES productos(id)  ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_vademecum_productos_producto ON vademecum_productos(producto_id);

-- ============================================================
-- TABLA: plan de obra social ↔ vademécum (beneficio % o monto fijo)
-- No todos los planes tienen vademécum asociado.
-- ============================================================
CREATE TABLE programa_vademecum (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  os_programa_id   INT UNSIGNED NOT NULL COMMENT 'plan de obra social',
  vademecum_id     INT UNSIGNED NOT NULL,
  tipo_beneficio   ENUM('porcentaje','monto_fijo') NOT NULL,
  valor_beneficio  DECIMAL(12,2) NOT NULL COMMENT 'ej: 40 = 40% o $40 según tipo',
  activo           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_programa_vademecum (os_programa_id, vademecum_id),
  FOREIGN KEY (os_programa_id) REFERENCES os_programas(id) ON DELETE CASCADE,
  FOREIGN KEY (vademecum_id)   REFERENCES vademecums(id)   ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: clientes
-- ============================================================
CREATE TABLE clientes (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  apellido    VARCHAR(120) NOT NULL,
  dni         VARCHAR(20)  UNIQUE,
  fecha_nac   DATE,
  telefono    VARCHAR(30),
  email       VARCHAR(120),
  direccion   VARCHAR(200),
  saldo_cc    DECIMAL(12,2) NOT NULL DEFAULT 0,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: relación cliente <-> obra social
-- ============================================================
CREATE TABLE cliente_os (
  cliente_id   INT UNSIGNED NOT NULL,
  os_id        INT UNSIGNED NOT NULL,
  nro_afiliado VARCHAR(40),
  vencimiento  DATE,
  PRIMARY KEY (cliente_id, os_id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (os_id)      REFERENCES obras_sociales(id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: legajos de clientes (topes de compra por OS/programa)
-- ============================================================
CREATE TABLE legajos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cliente_id  INT UNSIGNED NOT NULL,
  os_id       INT UNSIGNED NOT NULL,
  programa_id INT UNSIGNED,
  nombre      VARCHAR(150) NOT NULL,
  tope_total  DECIMAL(12,2),
  tope_mensual DECIMAL(12,2),
  consumido   DECIMAL(12,2) NOT NULL DEFAULT 0,
  vencimiento DATE,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id)  REFERENCES clientes(id) ON DELETE CASCADE,
  FOREIGN KEY (os_id)       REFERENCES obras_sociales(id),
  FOREIGN KEY (programa_id) REFERENCES os_programas(id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: medicamentos autorizados por legajo
-- ============================================================
CREATE TABLE legajo_medicamentos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  legajo_id   INT UNSIGNED NOT NULL,
  producto_id INT UNSIGNED,
  nombre      VARCHAR(200) NOT NULL,
  troquel     VARCHAR(30),
  cantidad_mensual INT NOT NULL DEFAULT 1,
  FOREIGN KEY (legajo_id)  REFERENCES legajos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: proveedores / droguerías
-- ============================================================
CREATE TABLE proveedores (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(120) NOT NULL,
  cuit        VARCHAR(20),
  contacto    VARCHAR(100),
  telefono    VARCHAR(30),
  email       VARCHAR(120),
  direccion   VARCHAR(200),
  saldo_deuda DECIMAL(12,2) NOT NULL DEFAULT 0,
  activo      TINYINT(1) NOT NULL DEFAULT 1,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: pedidos a droguerías
-- ============================================================
CREATE TABLE pedidos (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  proveedor_id    INT UNSIGNED NOT NULL,
  fecha_pedido    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_recepcion DATETIME,
  estado          ENUM('borrador','enviado','recibido','cancelado') NOT NULL DEFAULT 'borrador',
  total_estimado  DECIMAL(12,2),
  observaciones   TEXT,
  usuario         VARCHAR(80),
  FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
) ENGINE=InnoDB;

CREATE TABLE pedido_items (
  id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  pedido_id         INT UNSIGNED NOT NULL,
  producto_id       INT UNSIGNED NOT NULL,
  cantidad          INT NOT NULL,
  precio_compra     DECIMAL(12,2),
  cantidad_recibida INT,
  FOREIGN KEY (pedido_id)   REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: caja
-- ============================================================
CREATE TABLE cajas (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  fecha            DATE NOT NULL UNIQUE,
  monto_apertura   DECIMAL(12,2) NOT NULL DEFAULT 0,
  monto_cierre     DECIMAL(12,2),
  estado           ENUM('abierta','cerrada') NOT NULL DEFAULT 'abierta',
  usuario_apertura VARCHAR(80),
  usuario_cierre   VARCHAR(80),
  observaciones    TEXT
) ENGINE=InnoDB;

CREATE TABLE movimientos_caja (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  caja_id     INT UNSIGNED NOT NULL,
  hora        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  descripcion VARCHAR(200) NOT NULL,
  tipo        ENUM('apertura','ingreso','egreso','cierre') NOT NULL,
  monto       DECIMAL(12,2) NOT NULL,
  referencia  VARCHAR(50),
  usuario     VARCHAR(80),
  FOREIGN KEY (caja_id) REFERENCES cajas(id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: facturas (ventas)
-- ============================================================
CREATE TABLE facturas (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  numero        VARCHAR(20)  NOT NULL UNIQUE,
  tipo          ENUM('A','B','C','ticket') NOT NULL DEFAULT 'B',
  fecha         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cliente_id    INT UNSIGNED,
  os_id         INT UNSIGNED,
  programa_id   INT UNSIGNED,
  nro_receta    VARCHAR(50),
  codigo_autorizacion VARCHAR(50),
  subtotal      DECIMAL(12,2) NOT NULL,
  descuento_os  DECIMAL(12,2) NOT NULL DEFAULT 0,
  coseguro      DECIMAL(12,2) NOT NULL DEFAULT 0,
  total         DECIMAL(12,2) NOT NULL,
  estado        ENUM('pagada','pendiente','anulada') NOT NULL DEFAULT 'pagada',
  caja_id       INT UNSIGNED,
  usuario       VARCHAR(80),
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id)  REFERENCES clientes(id),
  FOREIGN KEY (os_id)       REFERENCES obras_sociales(id),
  FOREIGN KEY (programa_id) REFERENCES os_programas(id),
  FOREIGN KEY (caja_id)     REFERENCES cajas(id)
) ENGINE=InnoDB;

CREATE INDEX idx_factura_fecha    ON facturas(fecha);
CREATE INDEX idx_factura_cliente  ON facturas(cliente_id);
CREATE INDEX idx_factura_estado   ON facturas(estado);

CREATE TABLE factura_items (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  factura_id    INT UNSIGNED NOT NULL,
  producto_id   INT UNSIGNED NOT NULL,
  cantidad      INT NOT NULL,
  precio_unit   DECIMAL(12,2) NOT NULL,
  descuento_pct DECIMAL(5,2)  NOT NULL DEFAULT 0,
  subtotal      DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (factura_id)  REFERENCES facturas(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: pagos (múltiples medios por factura)
-- ============================================================
CREATE TABLE pagos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  factura_id  INT UNSIGNED NOT NULL,
  forma_pago  ENUM('efectivo','debito','credito','transferencia',
                   'mercadopago','naranjax','cheque','os',
                   'cuenta_corriente','vale') NOT NULL,
  cuotas      INT NOT NULL DEFAULT 1,
  recargo_pct DECIMAL(5,2) NOT NULL DEFAULT 0,
  monto_base  DECIMAL(12,2) NOT NULL,
  monto_final DECIMAL(12,2) NOT NULL,
  referencia  VARCHAR(100),
  FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- DATOS INICIALES
-- ============================================================
INSERT INTO categorias (nombre) VALUES
  ('Analgésico'),('Antibiótico'),('Gastro'),('Cardiovascular'),
  ('Diabetología'),('Dermatología'),('Respiratorio'),('Vitaminas'),('Varios');

INSERT INTO laboratorios (nombre) VALUES
  ('Bago'),('Roemmers'),('Gador'),('Pfizer'),('Abbott'),('Bagó');

INSERT INTO obras_sociales (codigo, nombre, mandataria, telefono) VALUES
  ('OSDE',   'OSDE',          'Medifé',        '0800-888-6733'),
  ('IOMA',   'IOMA',          'Iosper',         '0800-222-4662'),
  ('SWMED',  'Swiss Medical', 'Swiss Farma',    '0810-888-7946'),
  ('PAMI',   'PAMI',          'PAMI Farmacia',  '0800-222-7264'),
  ('GALENO', 'Galeno',        'Galeno Farma',   '0800-345-2040');

INSERT INTO os_programas (os_id, nombre, descuento, coseguro, tope, requiere_receta) VALUES
  (1, 'Plan 210',              40,  0,   15000, 1),
  (1, 'Plan 310',              55,  500, 20000, 1),
  (1, 'Plan 410',              70,  200, 30000, 1),
  (1, 'Medicamentos crónicos', 80,  0,   50000, 1),
  (2, 'Básico',                50,  0,   12000, 1),
  (2, 'Crónico/Especial',      70,  300, 25000, 1),
  (2, 'Oncológico',            100, 0,   NULL,  1),
  (3, 'Plan SMG20',            35,  0,   10000, 0),
  (3, 'Plan SMG30',            50,  400, 18000, 1),
  (3, 'Programa Crónico',      65,  200, 28000, 1),
  (4, 'Vademécum básico',      70,  0,   20000, 1),
  (4, 'Crónicas priorizadas',  100, 0,   NULL,  1),
  (4, 'Programa RENACER',      80,  500, 35000, 1),
  (5, 'Plan Base',             40,  0,   10000, 0),
  (5, 'Plan Plus',             60,  300, 22000, 1);

INSERT INTO proveedores (nombre, contacto, telefono) VALUES
  ('Droguería del Sud', 'Martín Pérez', '11-4000-1234'),
  ('Rofina S.A.',       'Sandra Gómez', '11-4100-5678'),
  ('Drofarma',          'Carlos Ruiz',  '11-4200-9012');

-- ============================================================
-- VISTAS
-- ============================================================

-- Productos con stock bajo mínimo
CREATE VIEW v_stock_critico AS
  SELECT p.id, p.codigo_barras, p.codigo_alfabeta, p.nombre,
         l.nombre AS laboratorio, c.nombre AS categoria,
         p.stock_actual, p.stock_minimo,
         (p.stock_minimo - p.stock_actual) AS unidades_faltantes,
         p.precio_venta
  FROM productos p
  LEFT JOIN laboratorios l ON p.laboratorio_id = l.id
  LEFT JOIN categorias   c ON p.categoria_id   = c.id
  WHERE p.stock_actual <= p.stock_minimo AND p.activo = 1;

-- Resumen de caja del día actual
CREATE VIEW v_resumen_caja_hoy AS
  SELECT
    SUM(CASE WHEN tipo = 'ingreso'  THEN monto ELSE 0 END) AS total_ingresos,
    SUM(CASE WHEN tipo = 'egreso'   THEN monto ELSE 0 END) AS total_egresos,
    SUM(CASE WHEN tipo = 'apertura' THEN monto ELSE 0 END) AS monto_apertura,
    COUNT(CASE WHEN tipo = 'ingreso' THEN 1 END)           AS cant_ventas
  FROM movimientos_caja mc
  JOIN cajas ca ON mc.caja_id = ca.id
  WHERE ca.fecha = CURDATE();

-- Ventas por obra social del mes corriente
CREATE VIEW v_ventas_por_os AS
  SELECT os.nombre,
         COUNT(f.id)          AS cant_facturas,
         SUM(f.total)         AS total_facturado,
         SUM(f.descuento_os)  AS total_a_cobrar_os
  FROM facturas f
  JOIN obras_sociales os ON f.os_id = os.id
  WHERE MONTH(f.fecha) = MONTH(CURDATE())
    AND YEAR(f.fecha)  = YEAR(CURDATE())
    AND f.estado != 'anulada'
  GROUP BY os.id, os.nombre;

-- ============================================================
-- STORED PROCEDURE: actualizar precios por porcentaje
-- ============================================================
DELIMITER $$

CREATE PROCEDURE sp_actualizar_precios_pct(
  IN p_categoria_id INT,
  IN p_porcentaje   DECIMAL(6,2),
  IN p_campo        ENUM('venta','compra','ambos'),
  IN p_usuario      VARCHAR(80)
)
BEGIN
  DECLARE v_where VARCHAR(100) DEFAULT '';

  IF p_categoria_id IS NOT NULL THEN
    SET v_where = CONCAT(' AND categoria_id = ', p_categoria_id);
  END IF;

  -- Historial
  IF p_campo IN ('venta', 'ambos') THEN
    SET @sql = CONCAT(
      'INSERT INTO historial_precios (producto_id, precio_anterior, precio_nuevo, motivo, porcentaje, usuario) ',
      'SELECT id, precio_venta, ROUND(precio_venta*(1+', p_porcentaje, '/100),2), ''porcentaje'', ', p_porcentaje, ', ''', p_usuario, ''' ',
      'FROM productos WHERE activo=1', v_where
    );
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
  END IF;

  -- Aplicar a precio de venta
  IF p_campo IN ('venta', 'ambos') THEN
    SET @sql = CONCAT(
      'UPDATE productos SET precio_venta=ROUND(precio_venta*(1+', p_porcentaje, '/100),2) WHERE activo=1', v_where
    );
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
  END IF;

  -- Aplicar a precio de compra
  IF p_campo IN ('compra', 'ambos') THEN
    SET @sql = CONCAT(
      'UPDATE productos SET precio_compra=ROUND(precio_compra*(1+', p_porcentaje, '/100),2) WHERE activo=1', v_where
    );
    PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
  END IF;

  SELECT ROW_COUNT() AS productos_actualizados;
END$$

DELIMITER ;

-- ============================================================
-- STORED PROCEDURE: registrar venta completa (transaccional)
-- ============================================================
DELIMITER $$

CREATE PROCEDURE sp_registrar_venta(
  IN p_numero      VARCHAR(20),
  IN p_cliente_id  INT,
  IN p_os_id       INT,
  IN p_subtotal    DECIMAL(12,2),
  IN p_descuento   DECIMAL(12,2),
  IN p_coseguro    DECIMAL(12,2),
  IN p_total       DECIMAL(12,2),
  IN p_caja_id     INT,
  IN p_usuario     VARCHAR(80)
)
BEGIN
  DECLARE v_factura_id INT;

  INSERT INTO facturas
    (numero, cliente_id, os_id, subtotal, descuento_os, coseguro, total, caja_id, usuario)
  VALUES
    (p_numero, p_cliente_id, p_os_id, p_subtotal, p_descuento, p_coseguro, p_total, p_caja_id, p_usuario);

  SET v_factura_id = LAST_INSERT_ID();

  IF p_caja_id IS NOT NULL THEN
    INSERT INTO movimientos_caja (caja_id, descripcion, tipo, monto, referencia, usuario)
    VALUES (p_caja_id, CONCAT('Venta ', p_numero), 'ingreso', p_total, p_numero, p_usuario);
  END IF;

  SELECT v_factura_id AS factura_id;
END$$

DELIMITER ;
