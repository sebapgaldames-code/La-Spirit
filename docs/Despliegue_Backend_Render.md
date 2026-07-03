# Guía de Despliegue del Backend en Render — "La Spirit"

Pasos para desplegar el backend (Node.js + Express) en **Render** y dejarlo accesible desde Internet.

## Requisitos previos

- El código del backend subido a GitHub (carpeta `backend/` del repositorio).
- Un cluster de **MongoDB Atlas** creado y su cadena de conexión (URI) a mano.
- En Atlas, **Network Access** con la IP `0.0.0.0/0` permitida (para que Render pueda conectarse).

## Paso 1: Crear cuenta en Render

1. Entrar a [https://render.com](https://render.com).
2. Iniciar sesión con la cuenta de **GitHub** (simplifica la conexión del repositorio).

## Paso 2: Crear el Web Service

1. En el Dashboard: **New** → **Web Service**.
2. Conectar el repositorio de GitHub `La-Spirit`.
3. Seleccionar la rama `main`.

## Paso 3: Configurar el servicio

Como el repositorio contiene el backend y el frontend juntos, hay que indicarle a Render que el proyecto está en la subcarpeta `backend`.

| Campo | Valor |
|---|---|
| **Name** | `la-spirit-backend` |
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

> El **Root Directory** en `backend` es clave: sin esto, Render no encuentra el `package.json` y el despliegue falla.

## Paso 4: Configurar las variables de entorno

En la sección **Environment** del servicio, agregar las mismas variables que se usan en el `.env` local:

| Clave | Valor |
|---|---|
| `MONGODB_URI` | La cadena de conexión de MongoDB Atlas |
| `FRONTEND_URL` | La URL del frontend en Vercel (se completa después de desplegar el frontend) |

> No es necesario definir `PORT`: Render asigna su propio puerto automáticamente, y el `server.js` ya lo toma con `process.env.PORT`.

> Nunca se sube el archivo `.env` a GitHub. Las credenciales van solo aquí, en Render.

## Paso 5: Desplegar

1. Presionar **Create Web Service**.
2. Render ejecutará automáticamente: `git clone` → `npm install` → `npm start`.
3. El proceso puede tardar algunos minutos.
4. Al finalizar, Render entrega una **URL pública**, por ejemplo:
   `https://la-spirit-backend.onrender.com`

## Paso 6: Verificar el despliegue

1. Abrir en el navegador la URL pública. Debe responder:
   ```json
   { "mensaje": "API de Botillería \"La Spirit\" funcionando" }
   ```
2. Probar un endpoint real con el navegador o Thunder Client / Postman:
   ```
   GET https://la-spirit-backend.onrender.com/api/clientes
   ```

## Notas importantes

- **Plan gratuito:** Render "duerme" el servicio tras un período de inactividad. La primera petición después de ese tiempo puede tardar varios segundos mientras el servicio despierta. Es normal.
- **CORS:** una vez desplegado el frontend en Vercel, hay que registrar su URL en la variable `FRONTEND_URL` para que el navegador permita la comunicación (ver guía de despliegue del frontend).
- Guardar la URL pública de Render: se necesita para configurar el frontend y para la entrega final.
