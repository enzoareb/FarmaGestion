const express  = require("express");
const multer   = require("multer");
const auth     = require("../middleware/auth");

const productos    = require("../controllers/productosController");
const facturacion  = require("../controllers/facturacionController");
const general      = require("../controllers/generalController");
const authCtrl     = require("../controllers/authController");
const vademecum    = require("../controllers/vademecumController");
const prestadores  = require("../controllers/prestadoresController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ── AUTH (sin token) ──────────────────────────────────────────
router.post("/auth/login",   authCtrl.login);
router.post("/auth/usuario", authCtrl.crearUsuario);   // solo en setup inicial

// ── DASHBOARD ─────────────────────────────────────────────────
router.get("/dashboard", auth, general.dashboard);

// ── PRODUCTOS ─────────────────────────────────────────────────
router.get   ("/productos",                        auth, productos.listar);
router.get   ("/productos/precios/historial",      auth, productos.historialPrecios);
router.get   ("/productos/:id",                    auth, productos.obtener);
router.post  ("/productos",                        auth, productos.crear);
router.put   ("/productos/:id",                    auth, productos.actualizar);
router.delete("/productos/:id",                    auth, productos.eliminar);
router.post  ("/productos/precios/porcentaje",     auth, productos.actualizarPorcentaje);
router.post  ("/productos/precios/csv",
               auth, upload.single("archivo"),     productos.actualizarCSV);

// ── FACTURAS ──────────────────────────────────────────────────
router.get ("/facturas",              auth, facturacion.listar);
router.get ("/facturas/resumen/hoy",  auth, facturacion.resumenHoy);
router.get ("/facturas/:id",          auth, facturacion.obtener);
router.post("/facturas",              auth, facturacion.crear);
router.put ("/facturas/:id/anular",   auth, facturacion.anular);

// ── CLIENTES ──────────────────────────────────────────────────
router.get ("/clientes",      auth, general.listarClientes);
router.post("/clientes",      auth, general.crearCliente);
router.put ("/clientes/:id",  auth, general.actualizarCliente);

// ── OBRAS SOCIALES ────────────────────────────────────────────
router.get("/obras-sociales",       auth, general.listarOS);
router.post("/obras-sociales",      auth, general.crearOS);
router.put ("/obras-sociales/:id",  auth, general.actualizarOS);

// ── VADEMÉCUMS ─────────────────────────────────────────────────
router.get   ("/vademecums",                              auth, vademecum.listar);
router.get   ("/vademecums/:id",                          auth, vademecum.obtener);
router.post  ("/vademecums",                              auth, vademecum.crear);
router.put   ("/vademecums/:id",                          auth, vademecum.actualizar);
router.delete("/vademecums/:id",                          auth, vademecum.eliminar);
router.get   ("/vademecums/:id/productos",                auth, vademecum.listarProductos);
router.post  ("/vademecums/:id/productos",                auth, vademecum.agregarProducto);
router.delete("/vademecums/:id/productos/:producto_id",    auth, vademecum.quitarProducto);

// ── PRESTADORES ────────────────────────────────────────────────
// Nota: para que el frontend actual (sin login/token) pueda persistir,
// estas rutas quedan sin middleware `auth`.
router.get   ("/prestadores",                             prestadores.listar);
router.get   ("/prestadores/:id",                         prestadores.obtener);
router.post  ("/prestadores",                             prestadores.crear);
router.put   ("/prestadores/:id",                         prestadores.actualizar);
router.delete("/prestadores/:id",                         prestadores.eliminar);
router.get   ("/prestadores/:id/planes",                  prestadores.listarPlanes);
router.post  ("/prestadores/:id/planes",                  prestadores.agregarPlan);
router.delete("/prestadores/:id/planes/:plan_id",        prestadores.quitarPlan);

// ── WEB SERVICE prestador ─────────────────────────────────────
router.get   ("/prestadores/:id/webservice",                               prestadores.obtenerWebService);
router.post  ("/prestadores/:id/webservice",                               prestadores.guardarWebService);
router.delete("/prestadores/:id/webservice",                               prestadores.eliminarWebService);
router.post  ("/prestadores/:id/webservice/urls",                          prestadores.agregarWebUrl);
router.delete("/prestadores/:id/webservice/urls/:url_id",                  prestadores.quitarWebUrl);

// ── CAJA ──────────────────────────────────────────────────────
router.post("/caja/abrir",               auth, general.abrirCaja);
router.put ("/caja/:id/cerrar",          auth, general.cerrarCaja);
router.get ("/caja/movimientos",         auth, general.movimientosCaja);
router.post("/caja/movimiento",          auth, general.agregarMovimiento);

// ── PROVEEDORES & PEDIDOS ─────────────────────────────────────
router.get ("/proveedores",              auth, general.listarProveedores);
router.get ("/pedidos",                  auth, general.listarPedidos);
router.post("/pedidos",                  auth, general.crearPedido);
router.put ("/pedidos/:id/recibir",      auth, general.recibirPedido);

module.exports = router;
