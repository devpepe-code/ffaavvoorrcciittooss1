#!/bin/bash
cd "$(dirname "$0")"

echo "=========================================="
echo "  SUBIR FAVORCITOS A GITHUB - FIX COMPLETO"
echo "=========================================="
echo ""
echo "Esto subirá TODO el proyecto correcto a:"
echo "https://github.com/devpepe-code/favorcitossss"
echo ""
echo "¿Continuar? (escribe si y Enter)"
read CONFIRM

if [ "$CONFIRM" != "si" ]; then
  echo "Cancelado."
  read -p "Enter para cerrar..."
  exit 0
fi

echo ""
echo "Subiendo..."

git init 2>/dev/null
git add .
git commit -m "Fix completo: estructura correcta para Vercel" 2>/dev/null || git commit -m "Fix" 2>/dev/null
git branch -M main
git remote remove origin 2>/dev/null
git remote add origin https://github.com/devpepe-code/favorcitossss.git
git push -u origin main --force

if [ $? -eq 0 ]; then
  echo ""
  echo "✓ LISTO. En Vercel:"
  echo "  1. Root Directory = favorcitos-github"
  echo "  2. Redeploy"
  echo ""
  echo "La página debería funcionar en unos minutos."
else
  echo ""
  echo "Error. ¿Tienes acceso al repo?"
fi

echo ""
read -p "Presiona Enter para cerrar..."
