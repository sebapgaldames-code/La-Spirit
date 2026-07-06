Instrucciones para desplegar el frontend en Vercel

1) Variables de entorno en Vercel
- Abre tu proyecto en Vercel -> Settings -> Environment Variables.
- Añade la variable:
  - Key: VITE_API_URL
  - Value: https://mi-backend.example.com/api  (reemplaza por la URL real de tu backend)
  - Environment: Production (y Preview si quieres que las previews también apunten al backend de preview)

2) Ejemplos de valores
- Producción (ejemplo): https://api.laspirit.com/api
- Staging/Preview (opcional): https://staging-api.laspirit.com/api
- Local (desarrollo): crea `.env.local` con `VITE_API_URL=http://localhost:5000/api`

3) Notas importantes
- En el frontend hemos cambiado los fallbacks a `'/api'`, por lo que si no defines `VITE_API_URL` en Vercel la app intentará usar rutas relativas (útil si proxificas o sirves frontend y backend desde el mismo dominio).
- Asegúrate de que el backend permita CORS desde el dominio de Vercel o que sirva la API en el mismo dominio.

4) Comandos útiles (desde la carpeta `frontend`)
```powershell
npm install
npm run build
npm run preview
```

5) Verificación rápida
- Tras desplegar en Vercel, abre la consola del navegador y comprueba que las llamadas XHR/Fetch van a la URL indicada por `VITE_API_URL`.
- Si la app usa rutas relativas (`/api`), verifica que el backend esté accesible desde el mismo dominio donde se sirve el frontend.

Si quieres, puedo añadir estos pasos al `README.md` raíz o crear instrucciones para configurar CORS en tu backend.
 
6) Si Vercel intenta construir desde la raíz del repo
- Opción A (aplicada en este repo): añadir un `package.json` en la raíz que delegue el build al subdirectorio `frontend`. Este repo incluye ahora un `package.json` raíz con el script `build` que ejecuta `cd frontend && npm install --include=dev && npm run build`.
- Opción B (en Vercel): en Project Settings → General → Root Directory, establece `frontend` como el directorio del proyecto para que Vercel ejecute `npm install` y `npm run build` desde `frontend`.

Ambas opciones evitan el error `Could not read package.json` cuando el proyecto principal está en un subdirectorio.
 
7) Cómo obtener `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` y añadirlos a GitHub
- `VERCEL_TOKEN` (token personal):
  1. Entra a https://vercel.com/dashboard
  2. Menú -> Settings -> Tokens -> Create Token
  3. Copia el token generado.
  4. En GitHub: Repository → Settings → Secrets and variables → Actions → New repository secret.
     - Name: `VERCEL_TOKEN`
     - Value: (pega aquí el token)

- `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` (opcional, útil para despliegues desde CI):
  1. En Vercel, abre el proyecto y en la URL verás el `project` id como parte de la ruta o en Project Settings.
  2. Para el `org id`, ve a https://vercel.com/dashboard/teams y abre la organización; el id aparece en la URL o en los settings de la organización.
  3. Añade ambos valores como secrets en GitHub (Repository → Settings → Secrets and variables → Actions):
     - Name: `VERCEL_ORG_ID`  Value: (tu org id)
     - Name: `VERCEL_PROJECT_ID` Value: (tu project id)

Notas:
- El workflow de despliegue incluido en este repo usa `VERCEL_TOKEN` y opcionalmente `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` si están definidos como secrets.
- No compartas `VERCEL_TOKEN` públicamente; trátalo como una credencial secreta.