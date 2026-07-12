# API de Reportes — Botillería "La Spirit"

Documentación de los endpoints de consultas avanzadas (`aggregate()`) usados por el Dashboard y la sección de Reportes del frontend.

## Información general

- **Recurso base:** `/api/reportes`
- **Formato:** JSON
- **URL local:** `http://localhost:5000/api/reportes`
- **URL producción (Render):** `https://la-spirit-backend-ds8g.onrender.com/api/reportes`

Todos los endpoints de este recurso son de solo lectura (`GET`) y usan el pipeline de `aggregate()` de MongoDB sobre las colecciones `productos` y `ventas`.

## Endpoints

### 1. Ventas por periodo

```
GET /api/reportes/ventas-por-periodo?periodo=dia
```

| Parámetro | Ubicación | Valores | Descripción |
|---|---|---|---|
| `periodo` | Query | `dia`, `semana`, `mes` (opcional) | Si se omite, agrega todas las ventas históricas |

**Respuesta 200 (OK):**

```json
{
  "periodo": "dia",
  "desde": "2026-07-12T00:00:00.000Z",
  "reporte": {
    "totalVentas": 4,
    "totalIngresos": 35960,
    "promedioVenta": 8990
  }
}
```

Solo considera ventas con `anulada: false`.

### 2. Productos más vendidos

```
GET /api/reportes/productos-mas-vendidos?limite=5
```

| Parámetro | Ubicación | Descripción |
|---|---|---|
| `limite` | Query (opcional) | Cantidad de productos a devolver. Por defecto `5` |

**Respuesta 200 (OK):** arreglo ordenado de mayor a menor por unidades vendidas.

```json
[
  {
    "productoId": "6650b1c2d3e4f5a6b7c8d9e0",
    "nombre": "Pisco Alto del Carmen 35°",
    "categoria": "Piscos",
    "totalVendido": 12,
    "ingresosGenerados": 107880
  }
]
```

### 3. Stock crítico

```
GET /api/reportes/stock-critico?umbral=5
```

| Parámetro | Ubicación | Descripción |
|---|---|---|
| `umbral` | Query (opcional) | Cantidad máxima para considerar el stock "crítico". Por defecto `5` |

**Respuesta 200 (OK):**

```json
{
  "umbral": 5,
  "totalProductosCriticos": 2,
  "productos": [
    {
      "productoId": "6650b1c2d3e4f5a6b7c8d9e0",
      "nombre": "Pisco Alto del Carmen 35°",
      "cantidad": 3,
      "precio": 8990,
      "categoria": "Piscos",
      "nivelCritico": "Bajo stock"
    }
  ]
}
```

`nivelCritico` es `"Sin stock"` cuando `cantidad` es `0`, y `"Bajo stock"` en cualquier otro caso por debajo del umbral.

### 4. Ventas por categoría

```
GET /api/reportes/ventas-por-categoria
```

**Respuesta 200 (OK):** arreglo ordenado de mayor a menor por ingresos.

```json
[
  { "categoria": "Piscos", "totalVendido": 20, "ingresos": 179800 },
  { "categoria": "Vinos", "totalVendido": 8, "ingresos": 64000 }
]
```

### 5. Clientes frecuentes

```
GET /api/reportes/clientes-frecuentes?limite=10
```

| Parámetro | Ubicación | Descripción |
|---|---|---|
| `limite` | Query (opcional) | Cantidad de clientes a devolver. Por defecto `10` |

**Respuesta 200 (OK):** arreglo ordenado de mayor a menor por número de compras.

```json
[
  {
    "clienteId": "6650a1b2c3d4e5f6a7b8c9d0",
    "nombre": "Camila",
    "apellido": "Rojas",
    "email": "camila.rojas@correo.cl",
    "totalCompras": 6,
    "totalGastado": 53940
  }
]
```

## Notas técnicas

- Todos los reportes se apoyan en los campos reales del esquema: el inventario es `cantidad` (no `stock`) y la fecha de venta es `fechaVenta` (no `fecha`); ver [`API_Productos.md`](API_Productos.md) y [`API_Ventas.md`](API_Ventas.md).
- `productos-mas-vendidos` y `ventas-por-categoria` usan `$unwind` sobre el array `productos` de cada venta y `$lookup` contra la colección `productos` para traer nombre/categoría — el equivalente de un `JOIN` en MongoDB.
- Estos endpoints son los que alimentan el Dashboard del frontend (KPIs, alertas de stock crítico y ranking de productos más vendidos).
