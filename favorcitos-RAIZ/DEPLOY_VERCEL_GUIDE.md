# Guía: Subir Favorcitos a GitHub y desplegar en Vercel

Sigue estos pasos en orden. El proyecto correcto está en la carpeta **`favorcitos-vercel`**.

---

## Parte 1: Preparar el código

### 1.1 Ubicación del proyecto

El código listo para Vercel está en:

```
/Users/enriqueguasp/cb/favorcitos-vercel
```

### 1.2 Verificar que el build funciona localmente

```bash
cd /Users/enriqueguasp/cb/favorcitos-vercel
npm run build
```

Si termina sin errores, puedes continuar.

---

## Parte 2: Crear el repositorio en GitHub

### 2.1 Crear un repositorio nuevo

1. Entra a [github.com](https://github.com) y haz clic en **New repository**
2. Nombre del repo: `favorcitos` (o el que prefieras)
3. **Importante:** déjalo **vacío** (sin README, sin .gitignore)
4. Haz clic en **Create repository**

### 2.2 Subir el código desde la terminal

Abre la terminal y ejecuta:

```bash
cd /Users/enriqueguasp/cb/favorcitos-vercel

# Inicializar git (si no está inicializado)
git init

# Añadir todos los archivos
git add .

# Primer commit
git commit -m "Initial commit - Favorcitos para Vercel"

# Conectar con tu repo (reemplaza TU_USUARIO y TU_REPO con tus datos)
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git

# Subir a la rama main
git branch -M main
git push -u origin main
```

**Ejemplo:** si tu usuario es `devpepe-code` y el repo es `favorcitos`:

```bash
git remote add origin https://github.com/devpepe-code/favorcitos.git
```

### 2.3 Comprobar la estructura en GitHub

En la página del repo en GitHub, en la raíz deberías ver:

- `package.json`
- `src/` (carpeta)
- `prisma/` (carpeta)
- `next.config.mjs`
- `README.md`

Si ves otra carpeta (por ejemplo `favorcitos-vercel`) como único contenido, subiste el directorio equivocado. La raíz del repo debe ser el contenido de `favorcitos-vercel`, no la carpeta en sí.

---

## Parte 3: Desplegar en Vercel

### 3.1 Importar el proyecto

1. Entra a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **Add New...** → **Project**
3. Importa el repositorio de GitHub que acabas de crear
4. **Root Directory:** déjalo vacío (Vercel usará la raíz del repo)
5. Haz clic en **Deploy**

### 3.2 Variables de entorno (antes o después del primer deploy)

En el proyecto de Vercel: **Settings** → **Environment Variables** y añade:

| Variable | Valor | Notas |
|----------|-------|-------|
| `DATABASE_URL` | `postgresql://...` | URL de PostgreSQL (Neon, Supabase, Vercel Postgres, etc.) |
| `NEXTAUTH_SECRET` | (genera uno) | Ejecuta: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://tu-dominio.vercel.app` | URL de tu app en Vercel |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | (opcional) | Para mapas en /buscar |

Si no configuras `DATABASE_URL` y `NEXTAUTH_SECRET`, el build puede fallar o la app no funcionará bien.

### 3.3 Redeploy después de añadir variables

Si añadiste variables después del primer deploy:

1. Ve a la pestaña **Deployments**
2. En el último deployment, abre el menú (⋯) → **Redeploy**

---

## Parte 4: Si aparece 404

### Posibles causas

1. **Raíz del repo incorrecta**  
   Si en GitHub la raíz no tiene `package.json` y `src/`, Vercel no encontrará la app.  
   - Solución: sube de nuevo el contenido de `favorcitos-vercel` como raíz del repo.

2. **Root Directory en Vercel**  
   Si el proyecto está en una subcarpeta del repo:
   - En Vercel: **Settings** → **General** → **Root Directory**
   - Pon la ruta a la carpeta del proyecto (ej. `favorcitos-vercel`) y guarda.

3. **Build fallido**  
   Revisa los logs del deployment en Vercel para ver errores de build.

---

## Resumen rápido

```
1. cd favorcitos-vercel
2. git init && git add . && git commit -m "Initial commit"
3. git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
4. git push -u origin main
5. En Vercel: Import Project → seleccionar el repo → Deploy
6. Añadir DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
7. Redeploy si hiciste cambios en variables
```
