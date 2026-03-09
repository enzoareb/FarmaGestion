require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const routes  = require("./routes/index");

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────
app.get("/health", (req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV, ts: new Date() })
);

// ── API ───────────────────────────────────────────────────────
app.use("/api", routes);

// ── 404 ───────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

// ── Error global ──────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("Error no manejado:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`\n🚀  FarmaGestión API corriendo en http://localhost:${PORT}`);
  console.log(`📋  Health: http://localhost:${PORT}/health`);
  console.log(`📦  Entorno: ${process.env.NODE_ENV}\n`);
});
