# dev — Proyecto web (Platohedro)

Instancia de desarrollo del sitio web construida con React + Next.js.

**Archivos clave**
- [package.json](package.json)
- [postcss.config.mjs](postcss.config.mjs)
- [.github/workflows/ci.yml](.github/workflows/ci.yml)

## Resumen técnico
- Framework: React + Next.js (App Router)
- Renderizado: server-side rendering para la ruta principal, con componentes interactivos en cliente
- Estilos: Tailwind CSS (PostCSS) + CSS custom
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
- `pnpm dev` — Inicia el servidor de desarrollo de Next.js.
- `pnpm build` — Compila la aplicación para producción.
- `pnpm start` — Sirve el build de producción.
- `pnpm audit` — Ejecuta auditoría de seguridad (moderate).
- `pnpm format` — Formatea código (si Prettier está instalado).

## Ejecución y despliegue (importante)

Este proyecto es una aplicación **Next.js SSR**. No se debe abrir con Live Server,
Vite ni servir una carpeta `dist/`: esos flujos no hidratan la aplicación actual y
los botones no responderán.

Para desarrollo abre únicamente la URL que imprime `pnpm dev` (por defecto,
`http://localhost:3000`). Para producción ejecuta `pnpm build` y `pnpm start`, o
despliega en una plataforma compatible con Next.js. El repositorio usa solo pnpm;
no ejecutes `npm install` ni conserves `package-lock.json`.

## Ambientes de ejecución

El proyecto debe operar con tres ambientes separados:

- `local`: desarrollo en el equipo, usando `.env.local`.
- `staging`: rama `staging` o deploy previews de Netlify, conectado a un proyecto Supabase de pruebas.
- `production`: rama `main`, conectado al proyecto Supabase de producción.

En Netlify configura las variables por contexto, sin guardarlas en Git:

| Variable | Local | Staging | Production |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_ENV` | `local` | `staging` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | URL de staging | Dominio público |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase local o de desarrollo | Proyecto Supabase staging | Proyecto Supabase production |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave local | Clave staging | Clave production |
| `WOMPI_*` | Sandbox, cuando se implemente | Sandbox | Producción |

La configuración `netlify.toml` asigna automáticamente el ambiente público a los
contextos de branch deploy, deploy preview y production. La rama `staging` debe
configurarse en Netlify como branch deploy. Las migraciones de Supabase deben
probarse primero en staging y luego aplicarse a producción mediante un proceso
aprobado; nunca se deben compartir las bases de datos entre ambientes.

Las migraciones usan un prefijo de fecha estable en el nombre del archivo para
que Supabase las ejecute en un orden determinista. En este repositorio conviven
archivos heredados con formato `YYYYMMDDHHMMSS_nombre.sql` y otros con
`YYYYMMDD_nombre.sql`. Antes de modificar una migración existente, confirma que
aún no haya sido aplicada en un ambiente compartido. El comando
`pnpm test:migrations` valida los nombres, el orden y las dependencias conocidas.
Además, CI inicia una instancia local de Supabase con Docker y ejecuta
`supabase db reset --yes`, comprobando que todas las migraciones puedan aplicarse
desde una base vacía.

## Flujo de build y CI
- Hay un workflow de CI en [.github/workflows/ci.yml](.github/workflows/ci.yml) que: checkout, instala pnpm, instala dependencias (`pnpm install --frozen-lockfile`), ejecuta `pnpm build` y `pnpm audit`. Recomendado para PRs y pushes a `main`.
- Las tareas de operación y recuperación están documentadas en [docs/operations.md](docs/operations.md).

## Configuración destacada
- `src/app/layout.tsx` define el documento, los metadatos y el proveedor de idioma.
- `src/app/page.tsx` es la ruta principal renderizada en servidor; los handlers seguros se añaden en `src/app/api/*/route.ts`.
- Alias `@` resuelve a `./src` mediante `tsconfig.json`.
- PostCSS usa `@tailwindcss/postcss` para compilar los estilos existentes.

## Dependencias y estado de mantenimiento
- Muchas dependencias se mantienen actualizadas a parches seguros; algunos paquetes tienen majors disponibles (ej. `recharts`, `react` mayor, `vite` mayor).
- `react` y `react-dom` aparecen como `peerDependencies` en `package.json`. Asegúrate de que tu entorno de despliegue tenga `react` y `react-dom` instalados (recomendado React 18.x o migrar a 19.x con pruebas).

## Seguridad
- Se ejecuta `pnpm audit` en CI; resuelve rápidamente alertas de alta severidad.
- Si utilizas el dev server en entornos accesibles públicamente, limita el acceso y aplica cabeceras CSP apropiadas en producción.

## Donaciones con Wompi

La integración usa Wompi Web Checkout. El botón de donación solicita una firma al servidor en `POST /api/wompi/checkout` y redirige al checkout alojado por Wompi; ninguna clave secreta llega al navegador.

1. Copia `.env.example` como `.env.local` y configura `WOMPI_PUBLIC_KEY`, `WOMPI_INTEGRITY_SECRET`, `WOMPI_EVENTS_SECRET` y `NEXT_PUBLIC_SITE_URL`.
2. Prueba primero con las credenciales sandbox de Wompi.
3. En el panel de Wompi registra la URL HTTPS `https://TU-DOMINIO/api/wompi/webhook` para los eventos del ambiente correspondiente.
4. Antes de producción, conecta el webhook a una base de datos para conciliar pagos y emitir comprobantes. La ruta actual valida la firma y registra eventos seguros, pero no almacena datos de donantes.

Nunca subas `.env.local` ni secretos de Wompi al repositorio.

## Agenda de eventos con Supabase

- Agenda pública: `/eventos`.
- Panel del equipo de comunicaciones: `/admin/eventos`.
- El acceso al panel usa correo y contraseña administrados por Supabase Auth; la aplicación no almacena contraseñas.

Para activarlo, crea un proyecto Supabase, añade `NEXT_PUBLIC_SUPABASE_URL` y
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en `.env.local`, y aplica todas las
migraciones con `supabase db push` (o `supabase db reset --yes` en local). Crea la
cuenta en Authentication > Users > Add user y autorízala desde el SQL Editor:

```sql
insert into public.user_roles (user_id, role)
select id, 'super_admin'::public.app_role from auth.users
where email = 'comunicaciones@tu-dominio.org'
on conflict do nothing;
```

Los permisos están separados por módulo: `events_admin`, `news_admin`,
`store_admin` y `residency_admin`. `super_admin` conserva acceso total. No asignes
`events_admin` para habilitar tienda o residencias.

Las políticas RLS de la migración permiten que cualquier visitante vea solo
eventos publicados y que únicamente una cuenta de `event_admins` cree, edite,
publique o elimine eventos. Cambia el correo del ejemplo por el real.

El acceso administrativo está en `/admin`: muestra únicamente los módulos que
corresponden al rol de la cuenta. La sesión se crea con Supabase Auth y se conserva
en una cookie segura administrada por el servidor.

La recuperación de contraseña comienza en `/auth/recuperar-clave`. En Supabase,
`Authentication > URL Configuration`, agrega como redirect permitido
`https://platohedro.org/auth/callback` (y `http://localhost:3000/**` para desarrollo).

## Recomendaciones para producción y escalabilidad
- Añadir testing automatizado (unit + e2e) y linting (`eslint + vitest`).
- Automatizar deploy a staging en un host compatible con Next.js, con variables de entorno y cabeceras de seguridad.
- Planificar upgrades mayores de paquetes críticos (por ejemplo `recharts@3.x`, `react@19`, `vite@8+`) en una rama de feature y ejecutar pruebas completas.

## Notas de migración a Yarn
- Pasos básicos: eliminar `pnpm-lock.yaml` y `node_modules`, activar Corepack para Yarn, añadir `workspaces` en `package.json` si haces monorepo, luego `yarn install`.
- Revisa `node_modules` layout y prueba builds; pnpm y yarn difieren en cómo resuelven dependencias.

## Contacto / mantenimiento
Incluye en este repositorio instrucciones de despliegue y responsables del mantenimiento en la documentación interna (por ejemplo, `guidelines/Guidelines.md`).

---
Generado automáticamente: resumen técnico y recomendaciones para despliegue. Si quieres que agregue secciones adicionales (diagramas de arquitectura, comandos CI para un host específico, o ejemplo de `Dockerfile`), dime cuál y lo añado.
