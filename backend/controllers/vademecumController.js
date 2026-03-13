const db = require("../config/db");

// ── GET /api/vademecums ───────────────────────────────────────
exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT v.id, v.nombre, v.descripcion, v.activo,
             (SELECT COUNT(*) FROM vademecum_productos WHERE vademecum_id = v.id) AS cant_productos
      FROM vademecums v
      ORDER BY v.nombre
    `);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/vademecums/:id ───────────────────────────────────
exports.obtener = async (req, res) => {
  try {
    const [[v]] = await db.query(
      "SELECT id, nombre, descripcion, activo FROM vademecums WHERE id = ?",
      [req.params.id]
    );
    if (!v) return res.status(404).json({ error: "Vademécum no encontrado" });

    const [productos] = await db.query(
      `SELECT vp.producto_id, vp.prioridad, vp.observacion, p.nombre AS producto_nombre, p.codigo_barras
       FROM vademecum_productos vp
       JOIN productos p ON p.id = vp.producto_id
       WHERE vp.vademecum_id = ?
       ORDER BY vp.prioridad IS NULL, vp.prioridad, p.nombre`,
      [req.params.id]
    );

    res.json({
      ok: true,
      data: {
        ...v,
        productos,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/vademecums ──────────────────────────────────────
exports.crear = async (req, res) => {
  try {
    const { nombre, descripcion, activo } = req.body;
    const [r] = await db.query(
      "INSERT INTO vademecums (nombre, descripcion, activo) VALUES (?, ?, ?)",
      [nombre?.trim() || "", descripcion?.trim() || null, activo !== undefined ? (activo ? 1 : 0) : 1]
    );
    res.status(201).json({ ok: true, id: r.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/vademecums/:id ────────────────────────────────────
exports.actualizar = async (req, res) => {
  try {
    const { nombre, descripcion, activo } = req.body;
    const updates = [];
    const params = [];
    if (nombre !== undefined) {
      updates.push("nombre = ?");
      params.push(nombre.trim());
    }
    if (descripcion !== undefined) {
      updates.push("descripcion = ?");
      params.push(descripcion?.trim() || null);
    }
    if (activo !== undefined) {
      updates.push("activo = ?");
      params.push(activo ? 1 : 0);
    }
    if (updates.length === 0) return res.status(400).json({ error: "Sin campos a actualizar" });
    params.push(req.params.id);
    await db.query(`UPDATE vademecums SET ${updates.join(", ")} WHERE id = ?`, params);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/vademecums/:id ─────────────────────────────────
exports.eliminar = async (req, res) => {
  try {
    const [r] = await db.query("DELETE FROM vademecums WHERE id = ?", [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: "Vademécum no encontrado" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/vademecums/:id/productos ──────────────────────────
exports.listarProductos = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT vp.producto_id, vp.prioridad, vp.observacion, p.nombre AS producto_nombre, p.codigo_barras, p.precio_venta
       FROM vademecum_productos vp
       JOIN productos p ON p.id = vp.producto_id
       WHERE vp.vademecum_id = ?
       ORDER BY vp.prioridad IS NULL, vp.prioridad, p.nombre`,
      [req.params.id]
    );
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/vademecums/:id/productos ─────────────────────────
exports.agregarProducto = async (req, res) => {
  try {
    const { producto_id, prioridad, observacion } = req.body;
    if (!producto_id) return res.status(400).json({ error: "producto_id es requerido" });
    await db.query(
      `INSERT INTO vademecum_productos (vademecum_id, producto_id, prioridad, observacion)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE prioridad = VALUES(prioridad), observacion = VALUES(observacion)`,
      [req.params.id, producto_id, prioridad || null, observacion?.trim() || null]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2")
      return res.status(400).json({ error: "Vademécum o producto no existe" });
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/vademecums/:id/productos/:producto_id ───────────
exports.quitarProducto = async (req, res) => {
  try {
    const [r] = await db.query(
      "DELETE FROM vademecum_productos WHERE vademecum_id = ? AND producto_id = ?",
      [req.params.id, req.params.producto_id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ error: "Asociación no encontrada" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
