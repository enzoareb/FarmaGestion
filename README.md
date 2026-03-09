# 💊 FarmaGestión — Sistema de Gestión para Farmacia

Sistema completo: frontend React + Vite y backend Node.js + Express + **MySQL**.

---

## 📁 Estructura

```
farmagestion-src/
├── frontend/
│   ├── src/
│   │   ├── main.jsx          ← Entry point React
│   │   └── App.jsx           ← Aplicación completa (2821 líneas)
│   ├── index.html
│   ├── vite.config.js        ← Proxy /api → :3001
│   └── package.json
│
├── backend/
│   ├── server.js             ← Express, puerto 3001
│   ├── farmagestion_mysql.sql ← Schema + datos iniciales + vistas + SPs
│   ├── .env.example          ← Variables de entorno
│   ├── config/db.js          ← Pool mysql2
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── facturacionController.js
│   │   ├── generalController.js
│   │   └── productosController.js
│   ├── middleware/auth.js     ← JWT
│   ├── routes/index.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Instalación

### Requisitos
- Node.js 18+
- MySQL 8+

---

### 1. Base de datos

```bash
mysql -u root -p -e "CREATE DATABASE farmagestion CHARACTER SET utf8mb4;"
mysql -u root -p farmagestion < backend/farmagestion_mysql.sql
```

**Usuario inicial:** `admin` / `admin123` ← cambiar en producción.

---

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env        # editar con tus credenciales MySQL
npm run dev                 # → http://localhost:3001
```

---

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                 # → http://localhost:5173
```

---

## 🧩 Módulos

| Módulo | Descripción |
|--------|-------------|
| 📊 Dashboard | KPIs, ventas del día, alertas de stock |
| 🧾 Facturación | Venta con OS/programas, validación de recetas |
| 📦 Stock | ABM productos (barras, alfabeta, troquel) |
| 💲 Precios | Actualización masiva e individual con historial |
| 🏥 Obras Sociales | ABM con programas, descuentos y topes |
| 👤 Clientes | ABM con legajos y medicamentos autorizados |
| 🚚 Proveedores | Gestión de pedidos a droguerías |
| 💰 Caja | Apertura/cierre con movimientos del día |

---

## 🛠 Stack

- **Frontend:** React 18, Vite 5
- **Backend:** Node.js, Express 4, mysql2
- **Base de datos:** MySQL 8 (InnoDB, utf8mb4)
- **Auth:** JWT (bcryptjs)

---

## 🔧 Correcciones aplicadas (v2)

- ID duplicado en `guardarLeg` resuelto
- `Stock`, `Proveedores` y `Dashboard` conectados al estado global
- Wrappers de módulos eliminados en `App` (`renderModulo` con switch)
- Número de factura incremental
- `useMemo` en filtros de Facturación y Precios
- Componente `<Overlay>` con Escape y click-fuera en todos los modales
