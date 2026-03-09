const db      = require("../config/db");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    if (!usuario || !password)
      return res.status(400).json({ error: "Usuario y contraseña requeridos" });

    const [[user]] = await db.query(
      "SELECT * FROM usuarios WHERE usuario=? AND activo=1", [usuario]
    );
    if (!user) return res.status(401).json({ error: "Credenciales incorrectas" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales incorrectas" });

    const token = jwt.sign(
      { id: user.id, usuario: user.usuario, nombre: user.nombre, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    res.json({ ok: true, token, usuario: { id: user.id, nombre: user.nombre, rol: user.rol } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const { usuario, password, nombre, rol } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const [r] = await db.query(
      "INSERT INTO usuarios (usuario, password_hash, nombre, rol) VALUES (?,?,?,?)",
      [usuario, hash, nombre, rol || "cajero"]
    );
    res.status(201).json({ ok: true, id: r.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "El usuario ya existe" });
    res.status(500).json({ error: err.message });
  }
};
