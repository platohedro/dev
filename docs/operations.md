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
# Pagos Wompi

La integración usa Wompi Web Checkout. El servidor crea una orden interna, genera la firma de integridad y redirige a Checkout. La confirmación real ocurre mediante el webhook firmado en `/api/wompi/webhook`; la URL de retorno nunca debe considerarse evidencia suficiente de aprobación.

Variables requeridas por ambiente:

```env
WOMPI_PUBLIC_KEY=pub_test_...
WOMPI_PRIVATE_KEY=prv_test_...
WOMPI_INTEGRITY_SECRET=test_integrity_...
WOMPI_EVENTS_SECRET=test_events_...
WOMPI_API_BASE_URL=https://sandbox.wompi.co/v1
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://staging.example.net
```

En Wompi Sandbox configura como URL de Eventos la URL pública del ambiente correspondiente:

```text
https://staging.example.net/api/wompi/webhook
```

En producción debe usarse el dominio real y las llaves `prod_`:

```text
https://platohedro.org/api/wompi/webhook
```

`SUPABASE_SECRET_KEY` (preferida; también se acepta `SUPABASE_SERVICE_ROLE_KEY` legacy), `WOMPI_PRIVATE_KEY`, `WOMPI_INTEGRITY_SECRET` y `WOMPI_EVENTS_SECRET` son secretos server-only. No deben usar el prefijo `NEXT_PUBLIC_`, entrar al repositorio ni aparecer en logs.

El flujo de órdenes utiliza las tablas `orders`, `order_items` y `payment_transactions`. El webhook valida el checksum y llama a `finalize_wompi_order`, que verifica referencia, monto y moneda, registra la transacción y descuenta stock una sola vez cuando el estado pasa a `APPROVED`.

Antes de activar producción se deben probar en Sandbox pagos aprobados, pendientes, rechazados, con error, eventos duplicados, checksum inválido y competencia por la última unidad de inventario.
