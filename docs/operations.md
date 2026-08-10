# Operación de la plataforma

## Observabilidad

- Usar `GET /api/health` como health check externo.
- Configurar una alerta si responde con HTTP 503 o deja de responder.
- Monitorizar errores de Netlify, consultas de Supabase y logs del webhook.
- No registrar secretos, cookies, tokens ni payloads completos de usuarios.

## Backups

Los backups no se configuran desde el código. En cada proyecto Supabase:

1. Activar el mecanismo de backup disponible para el plan contratado.
2. Confirmar la retención y el horario de backup.
3. Mantener staging y producción en proyectos separados.
4. Ejecutar una restauración de prueba en un proyecto temporal antes de producción.
5. Documentar responsable, fecha de última prueba y procedimiento de recuperación.

Antes de aplicar una migración en producción, ejecutar en staging:

```bash
supabase db reset --yes
supabase db lint
```

El despliegue de producción debe conservar el historial de migraciones y contar
con un backup verificado previo.

## Importación del directorio histórico

La migración `20260809100000_import_historical_residents.sql` importa 83 entradas
de 2014 a 2025 recuperadas del directorio y del mapa público de Platohedro. Es
idempotente por nombre y año, por lo que conserva los registros existentes y
puede ejecutarse tanto en una base limpia como en un ambiente que ya tenga parte
del directorio. Cada entrada conserva su enlace al perfil histórico. Los
registros históricos tienen `created_by` nulo porque no
pertenecen a una cuenta administrativa actual.

Antes de promoverla a producción, comprobar en staging el total, los nombres
compuestos y los países. La fuente histórica agrupaba algunos colectivos en una
sola entrada aunque su contador visual contabilizaba a sus integrantes.
