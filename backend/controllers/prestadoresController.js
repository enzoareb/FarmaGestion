const db = require("../config/db");

// ── GET /api/prestadores ───────────────────────────────────────
exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.id, p.nombre, p.codigo_prestador, p.provincia, p.tipo_liquidacion, p.activo,
             COUNT(pp.id) AS cant_planes,
             CASE
               WHEN EXISTS (SELECT 1 FROM prestador_webservice w WHERE w.prestador_id = p.id) THEN 1
               ELSE 0
             END AS tiene_webservice,
             COALESCE((
               SELECT COUNT(*)
               FROM prestador_webservice w
               LEFT JOIN prestador_webservice_urls u ON u.prestador_webservice_id = w.id
               WHERE w.prestador_id = p.id
             ), 0) AS cant_web_urls
      FROM prestadores p
      LEFT JOIN prestador_planes pp ON pp.prestador_id = p.id
      GROUP BY p.id, p.nombre, p.codigo_prestador, p.provincia, p.tipo_liquidacion, p.activo
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
      `SELECT
         id, nombre, codigo_prestador, provincia, tipo_liquidacion, activo,
         CASE
           WHEN EXISTS (SELECT 1 FROM prestador_webservice w WHERE w.prestador_id = ?) THEN 1
           ELSE 0
         END AS tiene_webservice,
         COALESCE((
           SELECT COUNT(*)
           FROM prestador_webservice w
           LEFT JOIN prestador_webservice_urls u ON u.prestador_webservice_id = w.id
           WHERE w.prestador_id = ?
         ), 0) AS cant_web_urls
       FROM prestadores
       WHERE id = ?`,
      [req.params.id, req.params.id, req.params.id]
    );
    if (!prestador) return res.status(404).json({ error: "Prestador no encontrado" });

    const [planes] = await db.query(
      `SELECT id, codigo, nombre, activo
       FROM prestador_planes
       WHERE prestador_id = ?
       ORDER BY nombre`,
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
    const { nombre, codigo_prestador, provincia, tipo_liquidacion, activo } = req.body;
    if (!nombre || !codigo_prestador) {
      return res.status(400).json({ error: "nombre y codigo_prestador son requeridos" });
    }
    const [r] = await db.query(
      "INSERT INTO prestadores (nombre, codigo_prestador, provincia, tipo_liquidacion, activo) VALUES (?,?,?,?,?)",
      [
        nombre.trim(),
        codigo_prestador.trim(),
        (provincia || "Buenos Aires").trim(),
        (tipo_liquidacion || "por renglon").trim(),
        activo !== undefined ? (activo ? 1 : 0) : 1
      ]
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
    const { nombre, codigo_prestador, provincia, tipo_liquidacion, activo } = req.body;
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
    if (provincia !== undefined) {
      sets.push("provincia=?");
      vals.push((provincia || "Buenos Aires").trim());
    }
    if (tipo_liquidacion !== undefined) {
      sets.push("tipo_liquidacion=?");
      vals.push((tipo_liquidacion || "por renglon").trim());
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
      `SELECT id, codigo, nombre, activo
       FROM prestador_planes
       WHERE prestador_id = ?
       ORDER BY nombre`,
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
    const { codigo, nombre, activo } = req.body;
    if (!(codigo || "").trim() || !(nombre || "").trim()) {
      return res.status(400).json({ error: "codigo y nombre son requeridos" });
    }
    await db.query(
      `INSERT INTO prestador_planes (prestador_id, codigo, nombre, activo)
       VALUES (?, ?, ?, ?)`,
      [req.params.id, codigo.trim(), nombre.trim(), activo !== undefined ? (activo ? 1 : 0) : 1]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El código de plan ya existe para este prestador" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/prestadores/:id/planes/:os_programa_id ─────────
exports.quitarPlan = async (req, res) => {
  try {
    const [r] = await db.query(
      "DELETE FROM prestador_planes WHERE prestador_id = ? AND id = ?",
      [req.params.id, req.params.plan_id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ error: "Asociación no encontrada" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── GET /api/prestadores/:id/webservice ─────────────────────────
exports.obtenerWebService = async (req, res) => {
  try {
    const [[ws]] = await db.query(
      `SELECT w.id,
              w.usuario,
              w.contrasena,
              w.id_organizacion,
              w.codigo_prestador,
              w.wsu_id,
              w.activo
       FROM prestador_webservice w
       WHERE w.prestador_id = ?`,
      [req.params.id]
    );

    if (!ws) return res.status(404).json({ error: "Web service no configurado" });

    const [urls] = await db.query(
      `SELECT id, tipo, link, activo
       FROM prestador_webservice_urls
       WHERE prestador_webservice_id = ?
       ORDER BY tipo, link`,
      [ws.id]
    );

    res.json({ ok: true, data: { ...ws, urls } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/prestadores/:id/webservice ───────────────────────
// Upsert: crea si no existe, o actualiza si ya existe
exports.guardarWebService = async (req, res) => {
  try {
    const {
      usuario,
      contrasena,
      id_organizacion,
      codigo_prestador,
      wsu_id,
      activo,
    } = req.body;

    // Regla de negocio:
    // - El web service puede existir aunque no tenga credenciales completas.
    // - Solo garantizamos lo necesario para referenciarlo correctamente.
    const usuarioT = (usuario || "").trim();
    const contrasenaT = (contrasena || "").trim();
    const idOrgT = (id_organizacion || "").trim();
    const codigoPrestadorT = (codigo_prestador || "").trim();
    const wsuIdT = (wsu_id || "").trim();

    if (!codigoPrestadorT) {
      return res.status(400).json({ error: "codigo_prestador es requerido" });
    }

    await db.query(
      `INSERT INTO prestador_webservice
        (prestador_id, usuario, contrasena, id_organizacion, codigo_prestador, wsu_id, activo)
       VALUES (?,?,?,?,?,?,?)
       ON DUPLICATE KEY UPDATE
         usuario = VALUES(usuario),
         contrasena = VALUES(contrasena),
         id_organizacion = VALUES(id_organizacion),
         codigo_prestador = VALUES(codigo_prestador),
         wsu_id = VALUES(wsu_id),
         activo = VALUES(activo)`,
      [
        req.params.id,
        usuarioT,
        contrasenaT,
        idOrgT,
        codigoPrestadorT,
        wsuIdT,
        activo !== undefined ? (activo ? 1 : 0) : 1,
      ]
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/prestadores/:id/webservice ──────────────────────
exports.eliminarWebService = async (req, res) => {
  try {
    await db.query("DELETE FROM prestador_webservice WHERE prestador_id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/prestadores/:id/webservice/urls ───────────────────
exports.agregarWebUrl = async (req, res) => {
  try {
    const { tipo, link, activo } = req.body;
    if (!(tipo || "").trim() || !(link || "").trim()) {
      return res.status(400).json({ error: "tipo y link son requeridos" });
    }

    // El web service puede no tener credenciales: solo debe existir para poder agregar URLs.
    const [[ws]] = await db.query(
      `SELECT id
       FROM prestador_webservice
       WHERE prestador_id = ?`,
      [req.params.id]
    );
    if (!ws) return res.status(404).json({ error: "Primero configura el web service" });

    await db.query(
      `INSERT INTO prestador_webservice_urls (prestador_webservice_id, tipo, link, activo)
       VALUES (?,?,?,?)`,
      [ws.id, tipo.trim(), link.trim(), activo !== undefined ? (activo ? 1 : 0) : 1]
    );

    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /api/prestadores/:id/webservice/urls/:url_id ────────
exports.quitarWebUrl = async (req, res) => {
  try {
    const [r] = await db.query(
      `DELETE FROM prestador_webservice_urls
       WHERE id = ? AND prestador_webservice_id = (SELECT id FROM prestador_webservice WHERE prestador_id = ?)`,
      [req.params.url_id, req.params.id]
    );
    if (r.affectedRows === 0) return res.status(404).json({ error: "URL no encontrada" });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

