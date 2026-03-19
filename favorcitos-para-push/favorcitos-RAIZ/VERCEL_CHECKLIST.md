# Checklist Vercel - Si ves 404, 401 o Build Failed

## Si ves 401 Unauthorized
**Settings → Deployment Protection** → Pon el nivel en **"None"** para que la web sea pública.

## En Vercel Dashboard → Tu Proyecto → Settings

### 1. General → Build & Development Settings
- **Framework Preset:** Debe ser **Next.js** (no "Other")
- **Build Command:** `npm run build` (o vacío para usar el default)
- **Output Directory:** vacío (Next.js usa .next automáticamente)
- **Install Command:** vacío (usa `npm install`)

### 2. General → Root Directory
- Si tu repo tiene la app en una subcarpeta (ej: `favorcitos-para-subir`), ponla aquí
- Si `package.json` está en la raíz del repo, déjalo **vacío**

### 3. Environment Variables
Añade estas variables para **Production** y **Preview**:
- `DATABASE_URL` = tu URL de PostgreSQL
- `NEXTAUTH_SECRET` = genera con `openssl rand -base64 32`
- `NEXTAUTH_URL` = `https://favssss.vercel.app` (o tu dominio)

### 4. Redeploy
Después de cambiar settings: Deployments → ⋯ → Redeploy
