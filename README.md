# Favorcitos - Deploy a Vercel

Plataforma de servicios del hogar para Latinoamérica. Lista para desplegar en Vercel.

## Requisitos previos

1. **Cuenta en Vercel** – [vercel.com](https://vercel.com)
2. **Base de datos PostgreSQL** – Opciones gratuitas:
   - [Vercel Postgres](https://vercel.com/storage/postgres)
   - [Neon](https://neon.tech)
   - [Supabase](https://supabase.com)
   - [Railway](https://railway.app)

## Pasos para desplegar

### 1. Crear base de datos PostgreSQL

Crea una base de datos en cualquiera de los proveedores anteriores y copia la URL de conexión. Debe tener este formato:

```
postgresql://user:password@host:5432/database?sslmode=require
```

### 2. Subir a Vercel

**Opción A: Desde la interfaz de Vercel**

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa el repositorio o sube la carpeta `favorcitos-vercel`
3. Configura las variables de entorno (ver paso 3)
4. Haz clic en Deploy

**Opción B: Con Vercel CLI**

```bash
cd favorcitos-vercel
npm i -g vercel
vercel
```

### 3. Variables de entorno en Vercel (IMPORTANTE)

**Debes configurar estas variables ANTES del primer deploy.** Ve a tu proyecto en Vercel → Settings → Environment Variables:

| Variable | Valor | Notas |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://...` | **Obligatoria.** URL de tu base de datos PostgreSQL |
| `NEXTAUTH_SECRET` | Cadena aleatoria | Genera con: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://tu-dominio.vercel.app` | Tu URL de producción (ej: https://favorcitos.vercel.app) |

⚠️ Si no configuras `DATABASE_URL`, el build puede completarse pero la app no funcionará (errores de base de datos).

### 4. Después del primer deploy

1. Ejecuta el seed para crear usuarios de prueba (opcional):

```bash
# Con DATABASE_URL configurada localmente en .env
cd favorcitos-vercel
npm install
npx prisma db seed
```

2. Credenciales de prueba:
   - **Cliente:** cliente@test.com / password123
   - **Tasker:** tasker@test.com / password123
   - **Admin:** admin@favorcitos.com / password123

## Estructura del proyecto

```
favorcitos-vercel/
├── prisma/           # Schema y migraciones PostgreSQL
├── src/
│   ├── app/          # Rutas Next.js (App Router)
│   ├── components/   # Componentes React
│   └── lib/          # Auth, DB, utils
├── .env.example      # Variables de ejemplo
├── vercel.json       # Configuración Vercel
└── package.json
```

## Solución de problemas

### El deploy no inicia o falla

1. **Usa Git (recomendado):** Vercel funciona mejor con repositorios Git que con subida de ZIP.
   ```bash
   cd favorcitos-vercel
   git init
   git add .
   git commit -m "Initial commit"
   # Crea un repo en GitHub y haz push
   git remote add origin https://github.com/tu-usuario/favorcitos.git
   git push -u origin main
   ```
   Luego en [vercel.com/new](https://vercel.com/new) → Import Git Repository.

2. **Revisa los logs:** Vercel → Tu proyecto → Deployments → clic en el deploy fallido → Building. Copia el error exacto.

3. **Variables de entorno:** Configúralas ANTES del primer deploy en Settings → Environment Variables. Si faltan, el build puede fallar.

4. **Framework:** En Project Settings → General, verifica que "Framework Preset" sea **Next.js**.

5. **Build Command:** Debe estar vacío (usa el de package.json) o ser `npm run build`.

### "No muestra nada" / Página en blanco

- Asegúrate de tener `DATABASE_URL`, `NEXTAUTH_SECRET` y `NEXTAUTH_URL` configuradas
- `NEXTAUTH_URL` debe ser exactamente tu URL de Vercel (ej: https://favorcitos-xxx.vercel.app)

### Después del deploy: crear tablas en la base de datos

Si el deploy funciona pero la app da errores de base de datos, ejecuta una vez:

```bash
cd favorcitos-vercel
# Crea .env con tu DATABASE_URL de producción
echo 'DATABASE_URL="postgresql://..."' > .env
npx prisma db push
npx prisma db seed  # opcional: usuarios de prueba
```
