Documentación Técnica del Backend — "La Spirit"
Documento actualizado del estado técnico del backend. Complementa a `API_Clientes.md` (detalle del CRUD de Clientes) y a las guías de despliegue.
Arquitectura general
Stack: Node.js + Express + Mongoose, conectado a MongoDB Atlas (cluster `La-Spirit`).
Sistema de módulos: el proyecto usa ES Modules (`import`/`export`) de forma unificada, declarado con `"type": "module"` en el `package.json`. No mezclar con `require`/`module.exports` — el proyecto no arranca si se mezclan estilos.
Configuración: las credenciales y URLs se manejan por variables de entorno (archivo `.env`, no versionado). Ver plantilla en `backend/.env.example`.
CORS: habilitado para permitir el consumo desde el frontend.
Estructura de carpetas
```
backend/
├── src/
│   ├── config/db.js          ← conexión a MongoDB Atlas
│   ├── models/               ← Schemas de Mongoose (Cliente, Producto, Pedido, Venta)
│   ├── controllers/          ← lógica de cada recurso
│   ├── routes/               ← definición de endpoints
│   ├── app.js                ← configuración de Express y montaje de rutas
│   └── server.js             ← arranque del servidor
├── .env.example              ← plantilla de variables de entorno
└── package.json
```
Endpoints disponibles
Base local: `http://localhost:5000` — Base producción: URL de Render (pendiente de despliegue).
Clientes (`/api/clientes`)
Método	Ruta	Descripción
GET	`/api/clientes`	Listar todos los clientes
GET	`/api/clientes/:id`	Obtener un cliente por ID
POST	`/api/clientes`	Crear cliente
PUT	`/api/clientes/:id`	Actualizar cliente
DELETE	`/api/clientes/:id`	Eliminar cliente
Detalle completo con ejemplos en `docs/API_Clientes.md`.
Productos (`/api/productos`)
Método	Ruta	Descripción
GET	`/api/productos`	Listar todos los productos
GET	`/api/productos/:id`	Obtener un producto por ID
POST	`/api/productos`	Crear producto
PUT	`/api/productos/:id`	Actualizar producto
DELETE	`/api/productos/:id`	Eliminar producto
Campos del modelo Producto: `nombre` (requerido), `descripcion`, `precio` (requerido), `cantidad`, `categoria`.
Pedidos (`/api/pedidos`)
Método	Ruta	Descripción
GET	`/api/pedidos`	Listar todos los pedidos
GET	`/api/pedidos/:id`	Obtener un pedido por ID
POST	`/api/pedidos`	Crear pedido
PUT	`/api/pedidos/:id`	Actualizar pedido
DELETE	`/api/pedidos/:id`	Eliminar pedido
Ventas (`/api/ventas`)
Método	Ruta	Descripción
GET	`/api/ventas`	Listar todas las ventas
GET	`/api/ventas/:id`	Obtener una venta por ID
POST	`/api/ventas`	Registrar venta
PUT	`/api/ventas/:id/anular`	Anular una venta (endpoint específico; no hay eliminación directa)
Verificación de conexión con la base de datos
La conexión backend ↔ MongoDB Atlas fue verificada de extremo a extremo:
El servidor conecta al iniciar (`Conectado a MongoDB`).
Documento creado vía `POST /api/clientes` (201) visible en el cluster mediante Browse Collections.
La base `la-spirit` contiene las colecciones: `clientes`, `pedidos`, `productos`, `ventas`.
> Nota de red: en redes que bloquean consultas DNS SRV, usar la cadena de conexión **legacy** (`mongodb://` con los tres nodos) en lugar de `mongodb+srv://`.
Estado y pendientes conocidos
Reportes: existen `routes/reporteRoutes.js` y `controllers/reporteController.js` (ventas por período, productos más vendidos, stock crítico, ventas por categoría, clientes frecuentes), pero aún no están montados en `app.js`, por lo que sus endpoints no están activos. Pendiente: agregar `import reporteRoutes from './routes/reporteRoutes.js'` y `app.use('/api/reportes', reporteRoutes)`.
Middlewares globales (`errorHandler`, `notFound`): pendientes de implementación (SCRUM-18).
Despliegue en Render: pendiente; al realizarlo, configurar `MONGODB_URI` y `FRONTEND_URL` en el panel de Render (ver `docs/Despliegue_Backend_Render.md`).
