# API de Ventas — Botillería "La Spirit"

Documentación de los endpoints de Ventas del backend. Es el recurso que usa el **Punto de Venta (POS)** para registrar una venta y descontar stock automáticamente.

## Información general

- **Recurso base:** `/api/ventas`
- **Formato:** JSON
- **URL local:** `http://localhost:5000/api/ventas`
- **URL producción (Render):** `https://la-spirit-backend-ds8g.onrender.com/api/ventas`

## Modelo de datos (Venta)

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `cliente` | ObjectId (ref. `Cliente`) | Sí | — |
| `productos` | Array de `{ producto, cantidad, precioUnitario, subtotal }` | Sí | `cantidad` mínima 1; `precioUnitario` y `subtotal` no negativos. Se calculan en el servidor |
| `total` | Number | Sí | Se calcula en el servidor a partir de los subtotales |
| `metodoPago` | String | Sí | Uno de: `Efectivo`, `Tarjeta Débito`, `Tarjeta Crédito`, `Transferencia`, `QR` |
| `fechaVenta` | Date | No | Se asigna automáticamente |
| `anulada` | Boolean | No | Por defecto `false` |

A diferencia de un pedido, en una venta **el precio, el subtotal y el total no se envían desde el cliente**: el backend los calcula a partir del `precio` actual de cada producto en la base de datos, para evitar que el frontend manipule los montos.

## Endpoints

### 1. Obtener todas las ventas

```
GET /api/ventas
```

Devuelve solo las ventas **no anuladas** (`anulada: false`), con `cliente` y `productos.producto` expandidos.

**Respuesta 200 (OK):** arreglo de ventas.

### 2. Obtener una venta por ID

```
GET /api/ventas/:id
```

**Respuesta 200 (OK):** la venta solicitada.
**Respuesta 404 (Not Found):**

```json
{ "mensaje": "Venta no encontrada" }
```

### 3. Crear una venta (registra la venta y descuenta stock)

```
POST /api/ventas
```

**Body (JSON):**

```json
{
  "cliente": "6650a1b2c3d4e5f6a7b8c9d0",
  "productos": [
    { "producto": "6650b1c2d3e4f5a6b7c8d9e0", "cantidad": 2 }
  ],
  "metodoPago": "Efectivo"
}
```

Solo se envían `producto` y `cantidad` por línea; el backend obtiene el `precio` vigente de cada producto y calcula `subtotal` y `total`.

**Flujo interno:**
1. Valida que cada producto exista y que `cantidad` (campo del modelo `Producto`) sea suficiente.
2. Calcula `subtotal` de cada línea y el `total` de la venta.
3. Crea el documento de la venta.
4. **Descuenta el stock**: por cada línea, resta la cantidad vendida del campo `cantidad` del producto correspondiente (operación atómica con `$inc`).
5. Devuelve la venta creada con `cliente` y `productos.producto` expandidos.

**Respuesta 201 (Created):** la venta creada.
**Respuesta 400 (Bad Request):** stock insuficiente para algún producto.

```json
{ "mensaje": "Stock insuficiente para Pisco Alto del Carmen 35°. Disponible: 1" }
```

**Respuesta 404 (Not Found):** algún producto del carrito no existe.

### 4. Anular una venta (repone stock)

```
PUT /api/ventas/:id/anular
```

Marca la venta como `anulada: true` y **repone el stock** de cada producto vendido (`$inc` positivo sobre `cantidad`). La venta anulada deja de aparecer en `GET /api/ventas`, pero sigue existiendo en la base de datos para trazabilidad.

**Respuesta 200 (OK):**

```json
{ "mensaje": "Venta anulada y stock repuesto correctamente" }
```

**Respuesta 400 (Bad Request):** la venta ya estaba anulada.
**Respuesta 404 (Not Found):** la venta no existe.

## Cómo probar el flujo completo

1. Crear un cliente (`POST /api/clientes`) y al menos un producto con `cantidad` > 0 (`POST /api/productos`).
2. Registrar una venta (`POST /api/ventas`) usando esos IDs.
3. Confirmar que `GET /api/productos/:id` muestra la `cantidad` ya descontada.
4. Anular la venta (`PUT /api/ventas/:id/anular`) y confirmar que la `cantidad` del producto vuelve a su valor original.
