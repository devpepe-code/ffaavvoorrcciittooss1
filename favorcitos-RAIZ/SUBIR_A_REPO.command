#!/bin/bash
cd "$(dirname "$0")"

echo "=========================================="
echo "  SUBIR FAVORCITOS - Root Directory VACÍO"
echo "=========================================="
echo ""
echo "Este proyecto va en la RAÍZ del repo."
echo "En Vercel: Root Directory = VACÍO"
echo ""
echo "Pega la URL del repo de GitHub:"
echo "(ej: https://github.com/devpepe-code/ffaavvoorrcciittooss1)"
read REPO_URL

if [ -z "$REPO_URL" ]; then
  echo "Error: Necesitas la URL."
  read -p "Enter para cerrar..."
  exit 1
fi

# Quitar .git si viene en la URL
REPO_URL="${REPO_URL%.git}"
REPO_URL="${REPO_URL}.git"

echo ""
echo "Subiendo..."

git init 2>/dev/null
git add .
git commit -m "Favorcitos - proyecto completo" 2>/dev/null || git commit -m "Initial commit" 2>/dev/null
git branch -M main
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"
git push -u origin main --force

if [ $? -eq 0 ]; then
  echo ""
  echo "✓ LISTO."
  echo "  En Vercel: Root Directory = VACÍO"
  echo "  Redeploy"
else
  echo ""
  echo "Error al subir. ¿URL correcta? ¿Tienes permisos?"
fi

echo ""
read -p "Enter para cerrar..."
