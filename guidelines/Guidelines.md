## Flujo de ramas y despliegue

Este proyecto usa dos ramas principales:

- `staging`: integración, pruebas y validación en el ambiente de staging.
- `main`: producción. Solo recibe cambios que ya fueron probados en `staging`.

Reglas obligatorias para los agentes:

1. No trabajar directamente sobre `main` para cambios normales.
2. Crear o usar `staging` para implementar y probar cambios.
3. Antes de confirmar cambios, ejecutar las validaciones disponibles:
   `pnpm typecheck`, `pnpm test:migrations`, `pnpm test:seo` y `pnpm build`.
4. Revisar `git status`, `git diff --check` y confirmar que no haya secretos antes de hacer commit.
5. Subir primero a `staging` con `git push origin staging`.
6. Después de validar staging, pasar a producción con:
   `git switch main`, `git pull`, `git merge --no-ff staging` y `git push origin main`.
7. No usar `git push --force`, `git reset --hard` ni borrar ramas sin autorización explícita.
8. Las migraciones de Supabase deben probarse desde una base limpia antes de llegar a `main`.
9. Todo cambio estructural debe documentarse en la documentación técnica correspondiente. Si cambia las reglas de trabajo de los agentes, también debe actualizar `AGENTS.md` y este archivo en el mismo cambio.

Flujo esperado:

```text
Cambios → staging → pruebas → main → producción
```

La configuración de Netlify asigna deploys de rama y previews a staging, y la rama
`main` a producción. Las variables de entorno y los proyectos Supabase deben estar
separados por ambiente.

**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
