# APP Incidencias

App web para registro de incidencias en centros de atención, basada en la plantilla Word del centro.

## Arrancar en local

```bash
npm install
cp .env.example .env
```

Edita `.env` y define `VITE_APP_PASSWORD` con la contraseña del centro. Luego:

```bash
npm run dev
```

Abre `http://localhost:5173` en el navegador.

> **Importante:** el archivo `.env` no se sube a Git. Cada entorno (local, Cloudflare Pages, etc.) debe tener su propia contraseña configurada.

## Conectar Supabase (recomendado en producción)

1. Rellena en `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_AUTH_EMAIL` (opcional)
2. Crea tablas equivalentes a `personas` e `incidencias` y usuarios en Supabase Auth.

Si Supabase está configurado, la app usa autenticación del servidor en lugar de la contraseña local.

## Despliegue Cloudflare Pages

```bash
npm run build
```

Sube la carpeta `dist` a Cloudflare Pages y configura estas variables de entorno en el panel:

- `VITE_APP_PASSWORD` (modo local)
- o `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (modo Supabase)
