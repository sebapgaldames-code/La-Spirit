# API de Clientes — Botillería "La Spirit"

Documentación de los endpoints del CRUD de Clientes del backend.

## Información general

- **Recurso base:** `/api/clientes`
- **Formato:** JSON
- **URL local:** `http://localhost:5000/api/clientes`
- **URL producción (Render):** `https://<nombre-del-backend>.onrender.com/api/clientes`

> Reemplazar `<nombre-del-backend>` por la URL real una vez desplegado el backend en Render.

## Modelo de datos (Cliente)

| Campo | Tipo | Obligatorio | Reglas |
|---|---|---|---|
| `rut` | String | Sí | Único |
| `nombre` | String | Sí | — |
| `apellido` | String | Sí | — |
| `email` | String | Sí | Único, formato de email válido |
| `telefono` | String | No | — |
| `direccion` | String | No | — |
| `fechaRegistro` | Date | No | Se asigna automáticamente |
| `createdAt` / `updatedAt` | Date | No | Se generan automáticamente |

Ejemplo de documento:

```json
{
  "_id": "6650a1b2c3d4e5f6a7b8c9d0",
  "rut": "18765432-1",
  "nombre": "Camila",
  "apellido": "Rojas",
  "email": "camila.rojas@correo.cl",
  "telefono": "+56912345678",
  "direccion": "Av. Libertad 123, Viña del Mar",
  "fechaRegistro": "2026-07-03T14:20:00.000Z",
  "createdAt": "2026-07-03T14:20:00.000Z",
  "updatedAt": "2026-07-03T14:20:00.000Z"
}
```

## Endpoints

### 1. Obtener todos los clientes

```
GET /api/clientes
```

**Respuesta 200 (OK):** arreglo con todos los clientes.

```json
[
  {
    "_id": "6650a1b2c3d4e5f6a7b8c9d0",
    "rut": "18765432-1",
    "nombre": "Camila",
    "apellido": "Rojas",
    "email": "camila.rojas@correo.cl",
    "telefono": "+56912345678",
    "direccion": "Av. Libertad 123, Viña del Mar",
    "fechaRegistro": "2026-07-03T14:20:00.000Z"
  }
]
```

### 2. Obtener un cliente por ID

```
GET /api/clientes/:id
```

| Parámetro | Ubicación | Descripción |
|---|---|---|
| `id` | URL | ID del cliente (`_id`) |

**Respuesta 200 (OK):** el cliente solicitado.
**Respuesta 404 (Not Found):**

```json
{ "error": "Cliente no encontrado" }
```

### 3. Crear un cliente

```
POST /api/clientes
```

**Body (JSON):**

```json
{
  "rut": "18765432-1",
  "nombre": "Camila",
  "apellido": "Rojas",
  "email": "camila.rojas@correo.cl",
  "telefono": "+56912345678",
  "direccion": "Av. Libertad 123, Viña del Mar"
}
```

**Respuesta 201 (Created):** el cliente creado, con su `_id`.
**Respuesta 400 (Bad Request):** datos inválidos o faltantes (por ejemplo, falta un campo obligatorio o el `rut`/`email` ya existe).

```json
{ "error": "El email es obligatorio" }
```

### 4. Actualizar un cliente

```
PUT /api/clientes/:id
```

| Parámetro | Ubicación | Descripción |
|---|---|---|
| `id` | URL | ID del cliente a actualizar |

**Body (JSON):** los campos a modificar. Ejemplo:

```json
{ "telefono": "+56987654321", "direccion": "Calle Nueva 456, Valparaíso" }
```

**Respuesta 200 (OK):** el cliente ya actualizado.
**Respuesta 404 (Not Found):** el cliente no existe.
**Respuesta 400 (Bad Request):** datos inválidos.

### 5. Eliminar un cliente

```
DELETE /api/clientes/:id
```

| Parámetro | Ubicación | Descripción |
|---|---|---|
| `id` | URL | ID del cliente a eliminar |

**Respuesta 200 (OK):**

```json
{ "mensaje": "Cliente eliminado" }
```

**Respuesta 404 (Not Found):** el cliente no existe.

## Resumen de códigos de estado

| Código | Significado | Cuándo ocurre |
|---|---|---|
| 200 | OK | Consulta, actualización o eliminación exitosa |
| 201 | Created | Cliente creado correctamente |
| 400 | Bad Request | Datos inválidos o faltantes al crear/actualizar |
| 404 | Not Found | No existe un cliente con ese ID |
| 500 | Internal Server Error | Error inesperado del servidor |

## Cómo probar los endpoints

Se recomienda usar **Thunder Client** (extensión de VS Code) o **Postman**:

1. Levantar el backend en local: dentro de la carpeta `backend`, ejecutar `npm run dev`.
2. Verificar que aparezca el mensaje "Servidor corriendo en puerto 5000".
3. Hacer una petición `GET` a `http://localhost:5000/api/clientes`.
4. Probar en orden: `POST` (crear), `GET` (listar y por ID), `PUT` (actualizar), `DELETE` (eliminar).
