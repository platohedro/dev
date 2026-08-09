# Instrucciones para agentes — Platohedro Web

## Objetivo del proyecto

Platohedro Web es una aplicación Next.js con App Router para contenido institucional, eventos, noticias, residencias, tienda y administración.

Stack principal:

- Next.js y React.
- TypeScript.
- pnpm.
- Netlify para despliegue.
- Supabase para Auth, PostgreSQL, RLS y Storage.
- Wompi para pagos cuando se habilite producción.

## Flujo de ramas y ambientes

El proyecto utiliza dos ramas principales:

- `staging`: integración, pruebas y validación.
- `main`: producción.

Flujo obligatorio:

```text
Cambios → staging → pruebas → main → producción
```

Reglas:

1. No trabajar directamente sobre `main` para cambios normales.
2. Implementar y probar los cambios en `staging`.
3. Subir primero los cambios con `git push origin staging`.
4. Solo después de validar staging, integrar a producción:

   ```bash
   git switch main
   git pull
   git merge --no-ff staging
   git push origin main
   ```

5. No usar `git push --force`, `git reset --hard` ni borrar ramas sin autorización explícita.
6. `staging` debe usar un proyecto Supabase diferente al de producción.
7. Netlify debe usar variables de entorno separadas para deploy previews, staging y producción.

## Comandos de desarrollo

Usar únicamente pnpm:

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test:migrations
pnpm test:seo
pnpm build
```

No ejecutar `npm install`, no crear `package-lock.json` y no cambiar de gestor de paquetes sin autorización.

## Validación obligatoria

Antes de cada commit:

```bash
git status
git diff --check
pnpm typecheck
pnpm test:migrations
pnpm test:seo
pnpm build
```

Si `pnpm` falla por el entorno local, ejecutar como mínimo los scripts directamente con Node cuando sea posible y reportar claramente qué validación no pudo ejecutarse. No declarar que una prueba pasó si no fue ejecutada.

El CI debe validar:

- Instalación reproducible con `pnpm install --frozen-lockfile`.
- TypeScript.
- Migraciones.
- SEO.
- Build de producción.
- Auditoría de dependencias.
- Aplicación de migraciones desde una base Supabase limpia.

## Migraciones y base de datos

Las migraciones están en `supabase/migrations/` y usan el formato:

```text
YYYYMMDDHHMMSS_nombre.sql
```

Reglas:

1. Mantener un orden determinista.
2. Probar siempre desde una base limpia.
3. No renombrar una migración que ya haya sido aplicada en un ambiente compartido.
4. Si una migración ya fue aplicada, crear una migración correctiva nueva.
5. Mantener RLS habilitado en tablas públicas con datos administrativos.
6. Probar políticas para `anon` y `authenticated`.
7. No usar claves `service_role` en el navegador ni en componentes cliente.
8. Agregar índices para filtros y ordenamientos públicos de alto uso.

## Seguridad y permisos

Aplicar mínimo privilegio:

- `super_admin`: acceso completo.
- `events_admin`: eventos.
- `news_admin`: noticias.
- `store_admin`: tienda e imágenes de productos.
- `residency_admin`: residencias.

Las políticas RLS son la autoridad final. Las validaciones visuales del panel no reemplazan las políticas de base de datos.

No registrar en logs:

- Contraseñas.
- Tokens.
- Cookies.
- Claves privadas.
- Secretos de Wompi.
- Payloads completos con datos personales.

Los archivos `.env*`, salvo `.env.example`, no deben subirse al repositorio.

## SEO

Toda ruta pública nueva debe incluir, cuando corresponda:

- `title` y `description` específicos.
- URL canónica.
- Open Graph.
- Texto alternativo descriptivo en imágenes.
- Datos estructurados JSON-LD si representa una organización, evento, producto o artículo.
- Inclusión en `src/app/sitemap.ts`.
- Revisión de `src/app/robots.ts`.

Las rutas privadas, de autenticación, API y resultados transaccionales deben tener `noindex` o quedar bloqueadas para rastreo.

## Rendimiento y caché

- Preferir ISR y `revalidate` para contenido público.
- Usar el cliente público de Supabase sin cookies para consultas cacheables.
- Evitar `select("*")` en rutas públicas.
- Usar paginación o límites razonables.
- Optimizar imágenes.
- No usar `force-dynamic` en páginas públicas salvo justificación técnica.

## Observabilidad y operación

- Mantener disponible `GET /api/health`.
- No exponer secretos en el health check.
- Reportar errores con contexto útil, pero sin datos sensibles.
- Documentar cambios operativos en `docs/operations.md`.
- Cualquier cambio de backup debe incluir una prueba de restauración documentada.

## Estilo de trabajo

- Revisar primero el código existente antes de modificarlo.
- Preservar cambios del usuario y no sobrescribir trabajo ajeno.
- Hacer cambios pequeños y verificables.
- Usar `apply_patch` para editar archivos.
- Añadir o actualizar pruebas junto con cada cambio relevante.
- Documentar todo cambio estructural en la documentación técnica correspondiente.
- Si el cambio modifica la forma en que deben trabajar los agentes, actualizar también `AGENTS.md` y `guidelines/Guidelines.md` en el mismo cambio.
- Los cambios estructurales incluyen arquitectura, rutas públicas, migraciones, permisos, ambientes, CI/CD, caché, observabilidad, backups y SEO.
- Explicar en la entrega qué se cambió, qué se probó y qué quedó pendiente.

## Entrega de cambios

Antes de finalizar una tarea, informar:

1. Archivos modificados.
2. Comandos ejecutados.
3. Resultado de las pruebas.
4. Variables o configuraciones externas que el usuario debe completar.
5. Riesgos o pasos pendientes para staging y producción.
