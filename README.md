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

## 🧷 Escenarios de instalación

### A. Instalación desde cero (nuevo entorno)

1. **Clonar el proyecto**
   ```bash
   git clone https://github.com/enzoareb/FarmaGestion.git
   cd FarmaGestion   # o la carpeta donde quede el repo
   ```
2. **Crear base de datos y esquema**
   - Opción rápida por consola:
     ```bash
     mysql -u root -p -e "CREATE DATABASE farmagestion CHARACTER SET utf8mb4;"
     mysql -u root -p farmagestion < backend/farmagestion_mysql.sql
     mysql -u root -p farmagestion < backend/migraciones.sql  # si existe
     ```
   - O phpMyAdmin: ver detalles en la sección **1. Base de datos** más abajo.
3. **Configurar y levantar backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env        # editar con tus credenciales MySQL
   npm run dev                 # → http://localhost:3001
   ```
4. **Levantar frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev                 # → http://localhost:5173
   ```
5. **Login inicial**
   - Usuario: `admin`
   - Password: `admin123`  (cambiar en producción)

### B. Actualizar un entorno existente (ya tenés la base creada)

Si ya tenés la base `farmagestion` funcionando y en el repo aparecen cambios de esquema:

1. **Actualizar código**
   ```bash
   git pull
   ```
2. **Aplicar migraciones de BD (nuevos campos/tablas)**
   ```bash
   mysql -u root -p farmagestion < backend/migraciones.sql
   ```
   - Ejecuta solo las migraciones que todavía no aplicaste.
   - Si preferís phpMyAdmin: pegar los `ALTER TABLE ...` allí y ejecutarlos.
3. **Reiniciar backend** (si estaba corriendo) para que recoja posibles cambios en controladores.

Con esto, tu entorno existente queda alineado con los cambios del proyecto (código + base).

---

### 1. Base de datos

**Opción A — Línea de comandos (CMD / PowerShell):**
```bash
mysql -u root -p -e "CREATE DATABASE farmagestion CHARACTER SET utf8mb4;"
mysql -u root -p farmagestion < backend/farmagestion_mysql.sql
```

**Opción B — phpMyAdmin (interfaz web):**
1. Abrir phpMyAdmin (ej: `http://localhost/phpmyadmin`)
2. Crear base de datos: nombre `farmagestion`, cotejamiento `utf8mb4_unicode_ci`
3. Seleccionar la base → pestaña **Importar**
4. Elegir archivo `backend/farmagestion_mysql.sql` → **Continuar**

**Usuario inicial:** `admin` / `admin123` ← cambiar en producción.

| Método | Ventaja |
|--------|---------|
| **CMD/PowerShell** | Rápido, sin interfaz, útil para scripts y automatización |
| **phpMyAdmin** | Interfaz gráfica, ver tablas y datos al instante, más amigable |

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

Orden sugerido: operación diaria → datos maestros → compras → análisis.

| Módulo | Descripción |
|--------|-------------|
| 📊 Dashboard | KPIs, ventas del día, alertas de stock |
| 🧾 Facturación | Venta con OS/programas, validación de recetas |
| 💰 Caja | Apertura/cierre con movimientos del día |
| 📦 Stock | ABM productos (barras, alfabeta, troquel) |
| 💲 Precios | Actualización masiva e individual con historial |
| 🏥 Obras Sociales | ABM con programas, descuentos y topes |
| 👤 Clientes | ABM con legajos y medicamentos autorizados |
| 🚚 Proveedores | Gestión de pedidos a droguerías |
| 📈 Reportes | Ventas por período, rentabilidad, distribución |

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
