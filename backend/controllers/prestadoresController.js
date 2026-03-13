const db = require("../config/db");

// ── GET /api/prestadores ───────────────────────────────────────
exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.nombre, p.codigo_prestador, p.activo,
             COUNT(pp.os_programa_id) AS cant_planes
      FROM prestadores p
      LEFT JOIN prestador_planes pp ON pp.prestador_id = p.id
      GROUP BY p.id, p.nombre, p.codigo_prestador, p.activo
      ORDER BY p.nombre
    `);
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/prestadores/:id ───────────────────────────────────
exports.obtener = async (req, res) => {
  try {
    const [[prestador]] = await db.query(
      "SELECT id, nombre, codigo_prestador, activo FROM prestadores WHERE id = ?",
      [req.params.id]
    );
    if (!prestador) return res.status(404).json({ error: "Prestador no encontrado" });

    const [planes] = await db.query(
      `SELECT pp.os_programa_id,
              os.nombre AS obra_social,
              op.nombre AS programa
       FROM prestador_planes pp
       JOIN os_programas op ON op.id = pp.os_programa_id
       JOIN obras_sociales os ON os.id = op.os_id
       WHERE pp.prestador_id = ?
       ORDER BY os.nombre, op.nombre`,
      [req.params.id]
    );

    res.json({ ok: true, data: { ...prestador, planes } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/prestadores ──────────────────────────────────────
exports.crear = async (req, res) => {
  try {
    const { nombre, codigo_prestador, activo } = req.body;
    if (!nombre || !codigo_prestador) {
      return res.status(400).json({ error: "nombre y codigo_prestador son requeridos" });
    }
    const [r] = await db.query(
      "INSERT INTO prestadores (nombre, codigo_prestador, activo) VALUES (?,?,?)",
      [nombre.trim(), codigo_prestador.trim(), activo !== undefined ? (activo ? 1 : 0) : 1]
    );
    res.status(201).json({ ok: true, id: r.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "codigo_prestador ya existe" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /api/prestadores/:id ────────────────────────────────────
exports.actualizar = async (req, res) => {
  try {
    const { nombre, codigo_prestador, activo } = req.body;
    const sets = [];
    const vals = [];
    if (nombre !== undefined) {
      sets.push("nombre=?");
      vals.push(nombre.trim());
    }
    if (codigo_prestador !== undefined) {
      sets.push("codigo_prestador=?");
      vals.push(codigo_prestador.trim());
    }
    if (activo !== undefined) {
      sets.push("activo=?");
      vals.push(activo ? 1 : 0);
    }
    if (!sets.length) {
      return res.status(400).json({ error: "Sin campos a actualizar" });
    }
    vals.push(req.params.id);
    await db.query(`UPDATE prestadores SET ${sets.join(",")} WHERE id=?`, vals);
    res.json({ ok: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "codigo_prestador ya existe" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/prestadores/:id ─────────────────────────────────
exports.eliminar = async (req, res) => {
  try {
    const [r] = await db.query("DELETE FROM prestadores WHERE id = ?", [req.params.id]);
    if (r.affectedRows === 0) return res.status(404).json({ error: "Prestador no encontrado" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/prestadores/:id/planes ─────────────────────────────
exports.listarPlanes = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT pp.os_programa_id,
              os.nombre AS obra_social,
              op.nombre AS programa
       FROM prestador_planes pp
       JOIN os_programas op ON op.id = pp.os_programa_id
       JOIN obras_sociales os ON os.id = op.os_id
       WHERE pp.prestador_id = ?
       ORDER BY os.nombre, op.nombre`,
      [req.params.id]
    );
    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/prestadores/:id/planes ───────────────────────────
exports.agregarPlan = async (req, res) => {
  try {
    const { os_programa_id } = req.body;
    if (!os_programa_id) {
      return res.status(400).json({ error: "os_programa_id es requerido" });
    }
    await db.query(
      `INSERT IGNORE INTO prestador_planes (prestador_id, os_programa_id)
       VALUES (?, ?)`,
      [req.params.id, os_programa_id]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({ error: "Prestador o plan no existe" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/prestadores/:id/planes/:os_programa_id ─────────
exports.quitarPlan = async (req, res) => {
  try {
    const [r] = await db.query(
      "DELETE FROM prestador_planes WHERE prestador_id = ? AND os_programa_id = ?",
      [req.params.id, req.params.os_programa_id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ error: "Asociación no encontrada" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

