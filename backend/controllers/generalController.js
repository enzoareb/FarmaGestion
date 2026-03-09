const db = require("../config/db");

// ════════════════════════════════════════════════════════════
//  CLIENTES
// ════════════════════════════════════════════════════════════
exports.listarClientes = async (req, res) => {
  try {
    const { buscar } = req.query;
    let sql = `
      SELECT c.*,
             GROUP_CONCAT(os.nombre ORDER BY os.nombre SEPARATOR ' | ') AS obras_sociales
      FROM clientes c
      LEFT JOIN cliente_os cos ON c.id = cos.cliente_id
      LEFT JOIN obras_sociales os ON cos.os_id = os.id
      WHERE c.activo = 1
    `;
    const params = [];
    if (buscar) {
      sql += " AND (c.nombre LIKE ? OR c.apellido LIKE ? OR c.dni LIKE ?)";
      params.push(`%${buscar}%`, `%${buscar}%`, `%${buscar}%`);
    }
    sql += " GROUP BY c.id ORDER BY c.apellido ASC";
    const [rows] = await db.query(sql, params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crearCliente = async (req, res) => {
  try {
    const { nombre, apellido, dni, fecha_nac, telefono, email, direccion, obras_sociales } = req.body;
    const [r] = await db.query(
      "INSERT INTO clientes (nombre, apellido, dni, fecha_nac, telefono, email, direccion) VALUES (?,?,?,?,?,?,?)",
      [nombre, apellido, dni, fecha_nac || null, telefono, email, direccion]
    );
    const cliente_id = r.insertId;
    if (obras_sociales?.length) {
      for (const os of obras_sociales) {
        await db.query(
          "INSERT INTO cliente_os (cliente_id, os_id, nro_afiliado) VALUES (?,?,?)",
          [cliente_id, os.os_id, os.nro_afiliado || null]
        );
      }
    }
    res.status(201).json({ ok: true, id: cliente_id });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "DNI ya registrado" });
    res.status(500).json({ error: err.message });
  }
};

exports.actualizarCliente = async (req, res) => {
  try {
    const campos = ["nombre","apellido","dni","fecha_nac","telefono","email","direccion"];
    const sets   = campos.filter(c => req.body[c] !== undefined).map(c => `${c}=?`);
    const vals   = campos.filter(c => req.body[c] !== undefined).map(c => req.body[c]);
    if (sets.length) {
      await db.query(`UPDATE clientes SET ${sets.join(",")} WHERE id=?`, [...vals, req.params.id]);
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════
//  OBRAS SOCIALES
// ════════════════════════════════════════════════════════════
exports.listarOS = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM obras_sociales ORDER BY nombre");
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crearOS = async (req, res) => {
  try {
    const { codigo, nombre, descuento, coseguro, requiere_receta } = req.body;
    const [r] = await db.query(
      "INSERT INTO obras_sociales (codigo, nombre, descuento, coseguro, requiere_receta) VALUES (?,?,?,?,?)",
      [codigo, nombre, descuento, coseguro, requiere_receta ?? 1]
    );
    res.status(201).json({ ok: true, id: r.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizarOS = async (req, res) => {
  try {
    const { nombre, descuento, coseguro, activa, requiere_receta } = req.body;
    await db.query(
      "UPDATE obras_sociales SET nombre=?, descuento=?, coseguro=?, activa=?, requiere_receta=? WHERE id=?",
      [nombre, descuento, coseguro, activa, requiere_receta, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════
//  CAJA
// ════════════════════════════════════════════════════════════
exports.abrirCaja = async (req, res) => {
  try {
    const { monto_apertura } = req.body;
    const usuario = req.user?.nombre || "sistema";
    const hoy = new Date().toISOString().slice(0, 10);

    const [[existe]] = await db.query("SELECT id FROM cajas WHERE fecha=?", [hoy]);
    if (existe) return res.status(409).json({ error: "La caja ya está abierta hoy" });

    const [r] = await db.query(
      "INSERT INTO cajas (fecha, monto_apertura, usuario_apertura) VALUES (?,?,?)",
      [hoy, monto_apertura || 0, usuario]
    );
    await db.query(
      "INSERT INTO movimientos_caja (caja_id, descripcion, tipo, monto, usuario) VALUES (?,?,?,?,?)",
      [r.insertId, "Apertura de caja", "apertura", monto_apertura || 0, usuario]
    );
    res.status(201).json({ ok: true, id: r.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cerrarCaja = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto_cierre, observaciones } = req.body;
    const usuario = req.user?.nombre || "sistema";

    await db.query(
      "UPDATE cajas SET estado='cerrada', monto_cierre=?, usuario_cierre=?, observaciones=? WHERE id=?",
      [monto_cierre, usuario, observaciones || null, id]
    );
    await db.query(
      "INSERT INTO movimientos_caja (caja_id, descripcion, tipo, monto, usuario) VALUES (?,?,?,?,?)",
      [id, "Cierre de caja", "cierre", monto_cierre, usuario]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.movimientosCaja = async (req, res) => {
  try {
    const hoy = new Date().toISOString().slice(0, 10);
    const [[caja]] = await db.query(
      "SELECT * FROM cajas WHERE fecha=?", [req.query.fecha || hoy]
    );
    if (!caja) return res.json({ ok: true, data: [], caja: null });

    const [movs] = await db.query(
      "SELECT * FROM movimientos_caja WHERE caja_id=? ORDER BY hora ASC", [caja.id]
    );
    res.json({ ok: true, data: movs, caja });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.agregarMovimiento = async (req, res) => {
  try {
    const { caja_id, descripcion, tipo, monto, referencia } = req.body;
    const usuario = req.user?.nombre || "sistema";
    await db.query(
      "INSERT INTO movimientos_caja (caja_id, descripcion, tipo, monto, referencia, usuario) VALUES (?,?,?,?,?,?)",
      [caja_id, descripcion, tipo, monto, referencia || null, usuario]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════
//  PEDIDOS A DROGUERÍAS
// ════════════════════════════════════════════════════════════
exports.listarPedidos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, pv.nombre AS proveedor_nombre,
             COUNT(pi.id) AS cant_items
      FROM pedidos p
      JOIN proveedores pv ON p.proveedor_id = pv.id
      LEFT JOIN pedido_items pi ON p.id = pi.pedido_id
      GROUP BY p.id
      ORDER BY p.fecha_pedido DESC LIMIT 50
    `);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crearPedido = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { proveedor_id, items, observaciones } = req.body;
    const usuario = req.user?.nombre || "sistema";

    const [r] = await conn.query(
      "INSERT INTO pedidos (proveedor_id, observaciones, usuario) VALUES (?,?,?)",
      [proveedor_id, observaciones || null, usuario]
    );
    const pedido_id = r.insertId;

    for (const item of items) {
      await conn.query(
        "INSERT INTO pedido_items (pedido_id, producto_id, cantidad) VALUES (?,?,?)",
        [pedido_id, item.producto_id, item.cantidad]
      );
    }

    await conn.commit();
    res.status(201).json({ ok: true, id: pedido_id });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

exports.recibirPedido = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { items } = req.body; // [{ pedido_item_id, cantidad_recibida }]

    for (const item of items) {
      const [[pi]] = await conn.query(
        "SELECT * FROM pedido_items WHERE id=?", [item.pedido_item_id]
      );
      await conn.query(
        "UPDATE pedido_items SET cantidad_recibida=? WHERE id=?",
        [item.cantidad_recibida, item.pedido_item_id]
      );
      await conn.query(
        "UPDATE productos SET stock_actual = stock_actual + ? WHERE id=?",
        [item.cantidad_recibida, pi.producto_id]
      );
    }

    await conn.query(
      "UPDATE pedidos SET estado='recibido', fecha_recepcion=NOW() WHERE id=?",
      [req.params.id]
    );
    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// ════════════════════════════════════════════════════════════
//  PROVEEDORES
// ════════════════════════════════════════════════════════════
exports.listarProveedores = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM proveedores WHERE activo=1 ORDER BY nombre");
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ════════════════════════════════════════════════════════════
//  DASHBOARD
// ════════════════════════════════════════════════════════════
exports.dashboard = async (req, res) => {
  try {
    const [[ventasHoy]]    = await db.query(`SELECT COUNT(*) AS cant, COALESCE(SUM(total),0) AS total FROM facturas WHERE DATE(fecha)=CURDATE() AND estado!='anulada'`);
    const [[stockCritico]] = await db.query(`SELECT COUNT(*) AS cant FROM productos WHERE stock_actual <= stock_minimo AND activo=1`);
    const [[cajaHoy]]      = await db.query(`SELECT COALESCE(SUM(CASE WHEN tipo='ingreso' THEN monto WHEN tipo='egreso' THEN -monto WHEN tipo='apertura' THEN monto ELSE 0 END),0) AS saldo FROM movimientos_caja mc JOIN cajas c ON mc.caja_id=c.id WHERE c.fecha=CURDATE()`);
    const [ultimasVentas]  = await db.query(`SELECT f.numero, f.fecha, f.total, f.estado, CONCAT(COALESCE(cl.apellido,'Mostrador'),COALESCE(', ',''),'') AS cliente FROM facturas f LEFT JOIN clientes cl ON f.cliente_id=cl.id ORDER BY f.id DESC LIMIT 5`);

    res.json({
      ok: true,
      data: {
        ventas_hoy:    { cantidad: ventasHoy.cant,       total: ventasHoy.total },
        stock_critico: { cantidad: stockCritico.cant },
        caja_saldo:    { saldo: cajaHoy.saldo },
        ultimas_ventas: ultimasVentas,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
