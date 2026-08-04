# dev — Proyecto web (Platohedro)

Instancia de desarrollo del sitio web (SPA) construida con React + Vite.

**Archivos clave**
- [package.json](package.json)
- [vite.config.ts](vite.config.ts)
- [postcss.config.mjs](postcss.config.mjs)
- [.github/workflows/ci.yml](.github/workflows/ci.yml)

## Resumen técnico
- Framework: React (SPA)
- Bundler / dev server: Vite
- Estilos: Tailwind CSS (configurado vía `@tailwindcss/vite`) + CSS custom
- Gestor de paquetes: pnpm (recomendado)

## Requisitos / Entorno
- Node.js >= 18
- pnpm (se usa en CI y local). Alternativa: Yarn (ver nota de migración abajo).

## Instalación (local)
1. Instalar Node.js (recomendado 18+).
2. Activar Corepack y pnpm (opcional):
```bash
corepack enable
corepack prepare pnpm@latest --activate
```
3. Instalar dependencias:
```bash
pnpm install
```

Si prefieres Yarn, elimina `pnpm-lock.yaml` y `node_modules`, activa Corepack para Yarn y ejecuta `yarn install`.

## Scripts útiles
- `pnpm dev` — Inicia servidor de desarrollo (vite).
- `pnpm build` — Compila para producción.
- `pnpm preview` — Sirve build de producción localmente.
- `pnpm audit` — Ejecuta auditoría de seguridad (moderate).
- `pnpm format` — Formatea código (si Prettier está instalado).

## Flujo de build y CI
- Hay un workflow de CI en [.github/workflows/ci.yml](.github/workflows/ci.yml) que: checkout, instala pnpm, instala dependencias (`pnpm install --frozen-lockfile`), ejecuta `pnpm build` y `pnpm audit`. Recomendado para PRs y pushes a `main`.

## Configuración destacada
- `vite.config.ts` incluye un plugin especial `figma-asset-resolver` para importar activos con `figma:asset/<name>`. Mantén los assets en `src/assets`.
- Alias `@` resuelve a `./src`.
- PostCSS: `postcss.config.mjs` está vacío porque `@tailwindcss/vite` autoconfigura PostCSS; añade plugins ahí si los necesitas.

## Dependencias y estado de mantenimiento
- Muchas dependencias se mantienen actualizadas a parches seguros; algunos paquetes tienen majors disponibles (ej. `recharts`, `react` mayor, `vite` mayor).
- `react` y `react-dom` aparecen como `peerDependencies` en `package.json`. Asegúrate de que tu entorno de despliegue tenga `react` y `react-dom` instalados (recomendado React 18.x o migrar a 19.x con pruebas).

## Seguridad
- Se ejecuta `pnpm audit` en CI; resuelve rápidamente alertas de alta severidad.
- Si utilizas el dev server en entornos accesibles públicamente, limita el acceso y aplica cabeceras CSP apropiadas en producción.

## Recomendaciones para producción y escalabilidad
- Añadir testing automatizado (unit + e2e) y linting (`eslint + vitest`).
- Automatizar deploy a staging (Vercel/Netlify) con rewrites para SPA (404 → index.html), cabeceras, y compresión (Brotli/Gzip).
- Planificar upgrades mayores de paquetes críticos (por ejemplo `recharts@3.x`, `react@19`, `vite@8+`) en una rama de feature y ejecutar pruebas completas.

## Notas de migración a Yarn
- Pasos básicos: eliminar `pnpm-lock.yaml` y `node_modules`, activar Corepack para Yarn, añadir `workspaces` en `package.json` si haces monorepo, luego `yarn install`.
- Revisa `node_modules` layout y prueba builds; pnpm y yarn difieren en cómo resuelven dependencias.

## Contacto / mantenimiento
Incluye en este repositorio instrucciones de despliegue y responsables del mantenimiento en la documentación interna (por ejemplo, `guidelines/Guidelines.md`).

---
Generado automáticamente: resumen técnico y recomendaciones para despliegue. Si quieres que agregue secciones adicionales (diagramas de arquitectura, comandos CI para un host específico, o ejemplo de `Dockerfile`), dime cuál y lo añado.
