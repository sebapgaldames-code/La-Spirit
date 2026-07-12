# API de Productos — Botillería "La Spirit"

Documentación de los endpoints del CRUD de Productos del backend.

## Información general

- **Recurso base:** `/api/productos`
- **Formato:** JSON
- **URL local:** `http://localhost:5000/api/productos`
- **URL producción (Render):** `https://la-spirit-backend-ds8g.onrender.com/api/productos`

## Modelo de datos (Producto)

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `nombre` | String | Sí | — |
| `descripcion` | String | No | — |
| `precio` | Number | Sí | — |
| `cantidad` | Number | No | Stock disponible. Por defecto `0` |
| `categoria` | String | No | Ej. "Piscos", "Vinos", "Cervezas" |
| `createdAt` / `updatedAt` | Date | No | Se generan/actualizan automáticamente |

Ejemplo de documento:

```json
{
  "_id": "6650b1c2d3e4f5a6b7c8d9e0",
  "nombre": "Pisco Alto del Carmen 35°",
  "descripcion": "Botella 750ml",
  "precio": 8990,
  "cantidad": 24,
  "categoria": "Piscos",
  "createdAt": "2026-07-03T14:20:00.000Z",
  "updatedAt": "2026-07-03T14:20:00.000Z"
}
```

> **Nota importante:** el campo de inventario se llama `cantidad`, no `stock`. Es el único campo que representa el stock disponible de un producto, y es el que descuentan/reponen automáticamente los endpoints de `/api/ventas` al registrar o anular una venta.

## Endpoints

### 1. Obtener todos los productos

```
GET /api/productos
```

**Respuesta 200 (OK):** arreglo con todos los productos.

### 2. Obtener un producto por ID

```
GET /api/productos/:id
```

**Respuesta 200 (OK):** el producto solicitado.
**Respuesta 404 (Not Found):**

```json
{ "error": "Producto no encontrado" }
```

### 3. Crear un producto

```
POST /api/productos
```

**Body (JSON):**

```json
{
  "nombre": "Pisco Alto del Carmen 35°",
  "descripcion": "Botella 750ml",
  "precio": 8990,
  "cantidad": 24,
  "categoria": "Piscos"
}
```

**Respuesta 201 (Created):** el producto creado, con su `_id`.
**Respuesta 400 (Bad Request):** datos inválidos o faltantes (por ejemplo, falta `nombre` o `precio`).

### 4. Actualizar un producto

```
PUT /api/productos/:id
```

**Body (JSON):** los campos a modificar. Ejemplo:

```json
{ "precio": 9490, "cantidad": 18 }
```

**Respuesta 200 (OK):** el producto ya actualizado.
**Respuesta 404 (Not Found):** el producto no existe.
**Respuesta 400 (Bad Request):** datos inválidos.

### 5. Eliminar un producto

```
DELETE /api/productos/:id
```

**Respuesta 200 (OK):**

```json
{ "mensaje": "Producto eliminado" }
```

**Respuesta 404 (Not Found):** el producto no existe.

## Relación con otros recursos

- `POST /api/ventas` descuenta automáticamente `cantidad` de cada producto vendido (ver [`API_Ventas.md`](API_Ventas.md)).
- `PUT /api/ventas/:id/anular` repone `cantidad` de cada producto de la venta anulada.
- `GET /api/reportes/stock-critico` lista productos con `cantidad` baja (ver [`API_Reportes.md`](API_Reportes.md)).
