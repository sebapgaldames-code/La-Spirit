# API de Pedidos — Botillería "La Spirit"

Documentación de los endpoints del CRUD de Pedidos del backend.

Un **pedido** representa un encargo de un cliente (presencial, telefónico o por delivery) que se prepara y despacha, y que sigue un flujo de estados hasta su entrega. Es distinto de una **venta** (ver [`API_Ventas.md`](API_Ventas.md)): un pedido no descuenta stock automáticamente ni tiene método de pago asociado.

## Información general

- **Recurso base:** `/api/pedidos`
- **Formato:** JSON
- **URL local:** `http://localhost:5000/api/pedidos`
- **URL producción (Render):** `https://la-spirit-backend-ds8g.onrender.com/api/pedidos`

## Modelo de datos (Pedido)

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `cliente` | ObjectId (ref. `Cliente`) | Sí | — |
| `productos` | Array de `{ producto, cantidad, precioUnitario }` | Sí | `cantidad` mínima 1; `precioUnitario` no negativo |
| `total` | Number | Sí | No negativo |
| `estado` | String | No | Uno de: `Pendiente`, `En preparación`, `Enviado`, `Entregado`, `Cancelado`. Por defecto `Pendiente` |
| `fechaPedido` | Date | No | Se asigna automáticamente |
| `observaciones` | String | No | — |

Los campos `cliente` y `productos.producto` se devuelven expandidos (`populate`) con los datos del cliente y de cada producto.

Ejemplo de documento (respuesta de la API):

```json
{
  "_id": "6650c1d2e3f4a5b6c7d8e9f0",
  "cliente": {
    "_id": "6650a1b2c3d4e5f6a7b8c9d0",
    "nombre": "Camila",
    "apellido": "Rojas",
    "email": "camila.rojas@correo.cl",
    "telefono": "+56912345678"
  },
  "productos": [
    {
      "producto": { "_id": "6650b1c2d3e4f5a6b7c8d9e0", "nombre": "Pisco Alto del Carmen 35°", "precio": 8990, "categoria": "Piscos" },
      "cantidad": 2,
      "precioUnitario": 8990
    }
  ],
  "total": 17980,
  "estado": "Pendiente",
  "fechaPedido": "2026-07-10T18:00:00.000Z",
  "observaciones": "Entregar después de las 19:00"
}
```

## Endpoints

### 1. Obtener todos los pedidos

```
GET /api/pedidos
```

**Respuesta 200 (OK):** arreglo con todos los pedidos, con `cliente` y `productos.producto` expandidos.

### 2. Obtener un pedido por ID

```
GET /api/pedidos/:id
```

**Respuesta 200 (OK):** el pedido solicitado.
**Respuesta 404 (Not Found):**

```json
{ "mensaje": "Pedido no encontrado" }
```

### 3. Crear un pedido

```
POST /api/pedidos
```

**Body (JSON):**

```json
{
  "cliente": "6650a1b2c3d4e5f6a7b8c9d0",
  "productos": [
    { "producto": "6650b1c2d3e4f5a6b7c8d9e0", "cantidad": 2, "precioUnitario": 8990 }
  ],
  "total": 17980,
  "observaciones": "Entregar después de las 19:00"
}
```

**Respuesta 201 (Created):** el pedido creado, con `cliente` y `productos.producto` expandidos.
**Respuesta 500 (Internal Server Error):** error de validación o de servidor.

> El `total` y el `precioUnitario` de cada línea se envían desde el cliente (frontend), que los calcula al armar el pedido. El backend no los recalcula al crear el pedido.

### 4. Actualizar un pedido (por ejemplo, cambiar su estado)

```
PUT /api/pedidos/:id
```

**Body (JSON):** los campos a modificar. Ejemplo, avanzar el estado:

```json
{ "estado": "En preparación" }
```

**Respuesta 200 (OK):** el pedido ya actualizado, con populate.
**Respuesta 404 (Not Found):** el pedido no existe.

### 5. Eliminar un pedido

```
DELETE /api/pedidos/:id
```

**Respuesta 200 (OK):**

```json
{ "mensaje": "Pedido eliminado correctamente" }
```

**Respuesta 404 (Not Found):** el pedido no existe.