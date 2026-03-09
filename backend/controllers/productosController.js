const db   = require("../config/db");
const csv  = require("csv-parser");
const { Readable } = require("stream");

// ── GET /api/productos ────────────────────────────────────────
exports.listar = async (req, res) => {
  try {
    const { buscar, categoria, alerta_stock } = req.query;
    let sql = `
      SELECT p.id, p.codigo_barras, p.nombre, p.nombre_generico,
             l.nombre AS laboratorio, c.nombre AS categoria,
             p.presentacion, p.precio_compra, p.precio_venta,
             p.stock_actual, p.stock_minimo, p.requiere_receta, p.activo
      FROM productos p
      LEFT JOIN laboratorios l ON p.laboratorio_id = l.id
      LEFT JOIN categorias   c ON p.categoria_id   = c.id
      WHERE p.activo = 1
    `;
    const params = [];

    if (buscar) {
      sql += " AND (p.nombre LIKE ? OR p.codigo_barras LIKE ? OR l.nombre LIKE ?)";
      params.push(`%${buscar}%`, `%${buscar}%`, `%${buscar}%`);
    }
    if (categoria) {
      sql += " AND c.nombre = ?";
      params.push(categoria);
    }
    if (alerta_stock === "1") {
      sql += " AND p.stock_actual <= p.stock_minimo";
    }
    sql += " ORDER BY p.nombre ASC";

    const [rows] = await db.query(sql, params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/productos/:id ────────────────────────────────────
exports.obtener = async (req, res) => {
  try {
    const [[prod]] = await db.query(
      `SELECT p.*, l.nombre AS laboratorio, c.nombre AS categoria
       FROM productos p
       LEFT JOIN laboratorios l ON p.laboratorio_id = l.id
       LEFT JOIN categorias   c ON p.categoria_id   = c.id
       WHERE p.id = ?`, [req.params.id]
    );
    if (!prod) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ ok: true, data: prod });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/productos ───────────────────────────────────────
exports.crear = async (req, res) => {
  try {
    const { codigo_barras, nombre, laboratorio_id, categoria_id,
            presentacion, precio_compra, precio_venta,
            stock_actual, stock_minimo, requiere_receta } = req.body;

    const [result] = await db.query(
      `INSERT INTO productos
         (codigo_barras, nombre, laboratorio_id, categoria_id,
          presentacion, precio_compra, precio_venta,
          stock_actual, stock_minimo, requiere_receta)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [codigo_barras, nombre, laboratorio_id, categoria_id,
       presentacion, precio_compra, precio_venta,
       stock_actual || 0, stock_minimo || 5, requiere_receta || 0]
    );
    res.status(201).json({ ok: true, id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "El código de barras ya existe" });
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/productos/:id ────────────────────────────────────
exports.actualizar = async (req, res) => {
  try {
    const campos = ["nombre","laboratorio_id","categoria_id","presentacion",
                    "precio_compra","precio_venta","stock_actual","stock_minimo","requiere_receta"];
    const sets   = campos.filter(c => req.body[c] !== undefined).map(c => `${c}=?`);
    const vals   = campos.filter(c => req.body[c] !== undefined).map(c => req.body[c]);

    if (sets.length === 0) return res.status(400).json({ error: "Sin campos a actualizar" });

    await db.query(`UPDATE productos SET ${sets.join(",")} WHERE id=?`, [...vals, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/productos/:id (baja lógica) ───────────────────
exports.eliminar = async (req, res) => {
  try {
    await db.query("UPDATE productos SET activo=0 WHERE id=?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/productos/precios/porcentaje ────────────────────
exports.actualizarPorcentaje = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { porcentaje, categoria_id } = req.body;
    const usuario = req.user?.nombre || "sistema";

    if (!porcentaje || isNaN(porcentaje))
      return res.status(400).json({ error: "Porcentaje inválido" });

    // Guardar historial
    let whereCat = categoria_id ? "AND categoria_id = ?" : "";
    const params = categoria_id ? [porcentaje, porcentaje, usuario, categoria_id] : [porcentaje, porcentaje, usuario];

    await conn.query(
      `INSERT INTO historial_precios (producto_id, precio_anterior, precio_nuevo, motivo, porcentaje, usuario)
       SELECT id, precio_venta, ROUND(precio_venta*(1+?/100),2), 'porcentaje', ?, ?
       FROM productos WHERE activo=1 ${whereCat}`,
      params
    );

    // Aplicar
    const updateParams = categoria_id ? [porcentaje, categoria_id] : [porcentaje];
    const [result] = await conn.query(
      `UPDATE productos SET precio_venta=ROUND(precio_venta*(1+?/100),2)
       WHERE activo=1 ${whereCat}`,
      updateParams
    );

    await conn.commit();
    res.json({ ok: true, productos_actualizados: result.affectedRows });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// ── POST /api/productos/precios/csv ───────────────────────────
exports.actualizarCSV = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const usuario = req.user?.nombre || "sistema";
    const rows = [];

    await new Promise((resolve, reject) => {
      Readable.from(req.file.buffer.toString())
        .pipe(csv())
        .on("data", d => rows.push(d))
        .on("end", resolve)
        .on("error", reject);
    });

    let actualizados = 0, noEncontrados = 0;
    for (const row of rows) {
      const codigo = (row.codigo_barras || row.codigo || "").trim();
      const precio = parseFloat(row.precio_nuevo || row.precio || 0);
      if (!codigo || isNaN(precio)) continue;

      const [[prod]] = await conn.query(
        "SELECT id, precio_venta FROM productos WHERE codigo_barras=? AND activo=1", [codigo]
      );
      if (!prod) { noEncontrados++; continue; }

      await conn.query(
        `INSERT INTO historial_precios (producto_id,precio_anterior,precio_nuevo,motivo,usuario)
         VALUES (?,?,?,'csv',?)`,
        [prod.id, prod.precio_venta, precio, usuario]
      );
      await conn.query(
        "UPDATE productos SET precio_venta=? WHERE id=?", [precio, prod.id]
      );
      actualizados++;
    }

    await conn.commit();
    res.json({ ok: true, actualizados, no_encontrados: noEncontrados });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
};

// ── GET /api/productos/precios/historial ──────────────────────
exports.historialPrecios = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT h.*, p.nombre AS producto, p.codigo_barras
       FROM historial_precios h
       JOIN productos p ON h.producto_id = p.id
       ORDER BY h.created_at DESC
       LIMIT 200`
    );
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
