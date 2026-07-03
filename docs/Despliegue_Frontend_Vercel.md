# Guía de Despliegue del Frontend en Vercel — "La Spirit"

Pasos para desplegar el frontend (React + Vite) en **Vercel** y conectarlo con el backend en Render.

## Requisitos previos

- El código del frontend subido a GitHub (carpeta `frontend/` del repositorio).
- El **backend ya desplegado en Render** y su URL pública a mano (por ejemplo, `https://la-spirit-backend.onrender.com`).

## Paso 1: Confirmar el archivo `.gitignore` del frontend

Antes de subir, verificar que el frontend no suba archivos innecesarios. El `.gitignore` debe incluir:

```
node_modules
dist
.env
```

## Paso 2: Crear cuenta en Vercel

1. Entrar a [https://vercel.com](https://vercel.com).
2. Iniciar sesión con la cuenta de **GitHub** (permite importar repositorios directamente).

## Paso 3: Importar el proyecto

1. En el Dashboard: **Add New** → **Project**.
2. Seleccionar el repositorio `La-Spirit`.

## Paso 4: Configurar el build

Como el repositorio contiene el backend y el frontend juntos, hay que indicarle a Vercel que el proyecto está en la subcarpeta `frontend`.

| Campo | Valor |
|---|---|
| **Root Directory** | `frontend` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

> El **Root Directory** en `frontend` es clave: sin esto, Vercel no encuentra el proyecto de React y el despliegue falla.

## Paso 5: Configurar la variable de entorno

En la sección **Environment Variables**, agregar la URL del backend en Render:

| Clave | Valor |
|---|---|
| `VITE_API_URL` | `https://la-spirit-backend.onrender.com/api` |

> En Vite, las variables deben comenzar con el prefijo `VITE_` para que el frontend pueda leerlas.

## Paso 6: Desplegar

1. Presionar **Deploy**.
2. Vercel ejecutará `npm install` y `npm run build`.
3. Al finalizar, entrega una **URL pública**, por ejemplo:
   `https://la-spirit.vercel.app`

## Paso 7: Actualizar CORS en el backend

Ahora que se conoce la URL final del frontend, hay que autorizarla en el backend:

1. Ir al servicio del backend en **Render** → **Environment**.
2. Editar la variable `FRONTEND_URL` con la URL de Vercel:
   ```
   FRONTEND_URL=https://la-spirit.vercel.app
   ```
3. Guardar. Render reinicia el servicio automáticamente para aplicar el cambio.

## Paso 8: Verificación final de extremo a extremo

1. Abrir la URL del frontend en Vercel.
2. Verificar que el listado de clientes/productos cargue datos reales desde MongoDB Atlas.
3. Crear un registro desde el formulario y confirmar que aparece en el listado.
4. Editar y eliminar un registro desde la interfaz.

Si todo funciona, el sistema completo queda operativo en producción:

```
Usuario → Frontend (Vercel) → Backend (Render) → MongoDB Atlas
```

## Nota

Guardar la URL pública de Vercel: es uno de los entregables de la evaluación (URL pública del sistema funcionando).
