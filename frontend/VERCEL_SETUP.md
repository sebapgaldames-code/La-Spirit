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