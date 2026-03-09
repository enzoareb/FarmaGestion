const db = require("../config/db");

// Generar número de factura correlativo
async function nextNumero(conn) {
  const [[row]] = await conn.query(
    "SELECT numero FROM facturas ORDER BY id DESC LIMIT 1 FOR UPDATE"
  );
  if (!row) return "F-0001";
  const n = parseInt(row.numero.replace("F-","")) + 1;
  return "F-" + String(n).padStart(4, "0");
}

// ── GET /api/facturas ─────────────────────────────────────────
exports.listar = async (req, res) => {
  try {
    const { desde, hasta, cliente_id, estado } = req.query;
    let sql = `
      SELECT f.id, f.numero, f.fecha, f.total, f.estado,
             CONCAT(c.apellido,', ',c.nombre) AS cliente,
             os.nombre AS obra_social
      FROM facturas f
      LEFT JOIN clientes c ON f.cliente_id = c.id
      LEFT JOIN obras_sociales os ON f.os_id = os.id
      WHERE 1=1
    `;
    const params = [];
    if (desde)      { sql += " AND DATE(f.fecha) >= ?"; params.push(desde); }
    if (hasta)      { sql += " AND DATE(f.fecha) <= ?"; params.push(hasta); }
    if (cliente_id) { sql += " AND f.cliente_id = ?";   params.push(cliente_id); }
    if (estado)     { sql += " AND f.estado = ?";       params.push(estado); }
    sql += " ORDER BY f.id DESC LIMIT 100";

    const [rows] = await db.query(sql, params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/facturas/:id ─────────────────────────────────────
exports.obtener = async (req, res) => {
  try {
    const [[factura]] = await db.query(
      `SELECT f.*, CONCAT(c.apellido,', ',c.nombre) AS cliente_nombre,
              os.nombre AS obra_social_nombre
       FROM facturas f
       LEFT JOIN clientes c ON f.cliente_id = c.id
       LEFT JOIN obras_sociales os ON f.os_id = os.id
       WHERE f.id = ?`, [req.params.id]
    );
    if (!factura) return res.status(404).json({ error: "Factura no encontrada" });

    const [items] = await db.query(
      `SELECT fi.*, p.nombre AS producto_nombre, p.codigo_barras
       FROM factura_items fi
       JOIN productos p ON fi.producto_id = p.id
       WHERE fi.factura_id = ?`, [req.params.id]
    );
    const [pagos] = await db.query(
      "SELECT * FROM pagos WHERE factura_id = ?", [req.params.id]
    );
    res.json({ ok: true, data: { ...factura, items, pagos } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/facturas ────────────────────────────────────────
exports.crear = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { cliente_id, os_id, items, pagos, subtotal,
            descuento_os, coseguro, total, caja_id } = req.body;
    const usuario = req.user?.nombre || "sistema";

    if (!items?.length) return res.status(400).json({ error: "Sin items" });

    // Verificar stock
    for (const item of items) {
      const [[p]] = await conn.query(
        "SELECT stock_actual FROM productos WHERE id=? FOR UPDATE", [item.producto_id]
      );
      if (!p) throw new Error(`Producto ${item.producto_id} no encontrado`);
      if (p.stock_actual < item.cantidad)
        throw new Error(`Stock insuficiente para producto ${item.producto_id}`);
    }

    const numero = await nextNumero(conn);

    // Insertar factura
    const [facRes] = await conn.query(
      `INSERT INTO facturas (numero, cliente_id, os_id, subtotal, descuento_os,
        coseguro, total, caja_id, usuario)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [numero, cliente_id || null, os_id || null,
       subtotal, descuento_os || 0, coseguro, total, caja_id || null, usuario]
    );
    const factura_id = facRes.insertId;

    // Items + descuento stock
    for (const item of items) {
      await conn.query(
        `INSERT INTO factura_items (factura_id, producto_id, cantidad, precio_unit, subtotal)
         VALUES (?,?,?,?,?)`,
        [factura_id, item.producto_id, item.cantidad,
         item.precio_unit, item.precio_unit * item.cantidad]
      );
      await conn.query(
        "UPDATE productos SET stock_actual = stock_actual - ? WHERE id = ?",
        [item.cantidad, item.producto_id]
      );
    }

    // Formas de pago
    if (pagos?.length) {
      for (const pago of pagos) {
        await conn.query(
          "INSERT INTO pagos (factura_id, forma_pago, cuotas, monto) VALUES (?,?,?,?)",
          [factura_id, pago.forma_pago, pago.cuotas || 1, pago.monto]
        );
      }
    }

    // Movimiento en caja
    if (caja_id) {
      await conn.query(
        `INSERT INTO movimientos_caja (caja_id, descripcion, tipo, monto, referencia, usuario)
         VALUES (?,?,?,?,?,?)`,
        [caja_id, `Venta ${numero}`, "ingreso", total, numero, usuario]
      );
    }

    await conn.commit();
    res.status(201).json({ ok: true, id: factura_id, numero });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// ── PUT /api/facturas/:id/anular ──────────────────────────────
exports.anular = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [[f]] = await conn.query(
      "SELECT * FROM facturas WHERE id=? FOR UPDATE", [req.params.id]
    );
    if (!f) return res.status(404).json({ error: "No encontrada" });
    if (f.estado === "anulada") return res.status(400).json({ error: "Ya anulada" });

    // Devolver stock
    const [items] = await conn.query(
      "SELECT * FROM factura_items WHERE factura_id=?", [f.id]
    );
    for (const item of items) {
      await conn.query(
        "UPDATE productos SET stock_actual = stock_actual + ? WHERE id=?",
        [item.cantidad, item.producto_id]
      );
    }

    await conn.query("UPDATE facturas SET estado='anulada' WHERE id=?", [f.id]);
    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// ── GET /api/facturas/resumen/hoy ─────────────────────────────
exports.resumenHoy = async (req, res) => {
  try {
    const [[resumen]] = await db.query(`
      SELECT
        COUNT(*) AS cant_facturas,
        SUM(total) AS total_ventas,
        SUM(descuento_os) AS total_descuento_os,
        SUM(CASE WHEN estado='pendiente' THEN 1 ELSE 0 END) AS pendientes
      FROM facturas
      WHERE DATE(fecha) = CURDATE() AND estado != 'anulada'
    `);
    res.json({ ok: true, data: resumen });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
