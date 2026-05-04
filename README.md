

# YaNomas - Marketplace

Pequeña aplicación frontend para un marketplace local (demo).

## Clonar el repositorio

1. Abre una terminal y clona el repo (reemplaza la URL por la del remoto si es necesario):

```bash
git clone https://github.com/<usuario>/<repositorio>.git
cd <repositorio>
```

2. Alternativamente, si ya tienes un fork o acceso SSH:

```bash
git clone git@github.com:<usuario>/<repositorio>.git
cd <repositorio>
```

## Instalar dependencias

Este proyecto usa `pnpm` o `npm`. Si usas `pnpm` (recomendado):

```bash
pnpm install
```

Si usas `npm`:

```bash
npm install
```

> Nota: en Windows PowerShell con políticas restrictivas puede ser necesario usar `npm.cmd` o ejecutar la terminal como administrador.

## Ejecutar en desarrollo

Inicia el servidor de desarrollo (Vite):

```bash
pnpm dev
# o
npm run dev
```

Abre en el navegador: http://localhost:5173

## Construir para producción

```bash
pnpm build
# o
npm run build
```

## Previsualizar la build

```bash
pnpm preview
# o
npm run preview
```

## Notas

- Este repo incluye configuraciones de Tailwind + Vite.
- Si el remoto no está configurado, añade uno y haz push:

```bash
git remote add origin <url-del-repo>
git branch -M main
git push -u origin main
```

Si quieres, hago el commit y push de los cambios ahora (necesito confirmación para empujar). 

