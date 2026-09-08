# Operación de la plataforma

## Página de Tecnología

`/tecnologia` adapta editorialmente el contenido de la portada de
https://web3wasi.platohedro.org/ consultada el 5 de septiembre de 2026.
La extracción se hizo leyendo su HTML público; no hay scraping en ejecución.
Los textos ES/EN están en `src/i18n/locales/`, bajo `technologyPage`.
Conserva enlaces de origen a Web3 EsCool, infraestructura, glosario, bitácora,
Spaces, RadioCypher y GitHub. No se importaron cifras históricas como métricas
actuales ni imágenes con textos alternativos genéricos de la plantilla original.
Usa ISR de una hora, metadata y canonical propios; está incluida en el sitemap
y permitida por la regla pública `/` de robots. El JSON-LD de organización se
hereda del layout. No requiere nuevas variables, tablas ni migraciones.
Validar navegación, idiomas y enlaces externos en staging antes de producción.

## Imágenes y video institucionales

El 8 de septiembre de 2026 se verificó que `backup.platohedro.org` entregaba
un certificado HTTPS autofirmado. Los archivos seguían disponibles, pero el
navegador rechazaba las imágenes referenciadas desde ese dominio.

Las 59 imágenes y el video institucional se recuperaron sin transformar y se
incluyen en `public/media/`, conservando las carpetas por año y mes. Portada,
D-Formación, Acerca y residencias ahora usan `/media/` con el HTTPS del sitio.
`docs/media-manifest.json` registra origen, tamaño y SHA-256 de cada archivo.
Las imágenes de catálogo, eventos, noticias y residentes que conservan una URL
del archivo se resuelven a la copia local únicamente si figura en ese inventario.
Los registros de Supabase permanecen intactos.
El inventario incluye las portadas de eventos y las galerías de productos
encontradas al recorrer 25 páginas y endpoints públicos de producción.
La excepción TLS se usó solo en la recuperación puntual de archivos públicos;
la aplicación y el despliegue no desactivan la validación de certificados.

Ejecutar `pnpm test:media` para detectar pérdidas, modificaciones o referencias
al servidor histórico. Al reemplazar un archivo, actualizar también su registro.
El CI valida estos recursos y las pruebas de horarios de eventos.
Comprobar las imágenes en staging y producción tras cada despliegue.
No requiere variables nuevas ni migraciones. Los enlaces a perfiles históricos
siguen dependiendo del archivo; su administrador debe reparar el certificado.

## Observabilidad

- Usar `GET /api/health` como health check externo.
- Configurar una alerta si responde con HTTP 503 o deja de responder.
- Monitorizar errores de Netlify, consultas de Supabase y logs del webhook.
- No registrar secretos, cookies, tokens ni payloads completos de usuarios.

## Agenda e historial de eventos

`/eventos` muestra únicamente eventos publicados, separados en próximos/en curso
e historial. La clasificación usa `ends_at` y, cuando no existe, `starts_at`;
una fecha igual a la hora de consulta permanece en la agenda. Los próximos se
ordenan por inicio ascendente y los pasados por inicio descendente, con un límite
de 100 por sección. Las tarjetas del historial conservan el enlace al detalle y
ocultan la inscripción. La página conserva ISR de 300 segundos y la invalidación
al guardar desde administración. No requiere migraciones ni variables nuevas.
La portada mantiene su consulta independiente en `/api/events`.

Validar en staging eventos futuros, en curso, finalizados y sin fecha de fin,
además de borradores y estados vacíos, antes de promover a producción.

## Hora de los eventos

El panel interpreta inicio y finalización como hora de Colombia
(`America/Bogota`, UTC-05:00) y guarda instantes UTC en Supabase. Al editar,
convierte nuevamente a hora de Colombia. Portada, agenda, detalle e historial
administrativo muestran esa misma zona, independientemente del servidor o navegador.
Validar con `pnpm test:events` y crear/editar un evento a las 10:00 en staging.
No requiere variables ni migraciones nuevas.

Los eventos guardados antes de esta corrección pueden tener horas desplazadas.
Revisar cada horario contra la programación original y corregir inicio y fin
desde el panel después del despliegue. No sumar cinco horas de forma masiva:
puede haber registros que ya tengan el instante correcto.

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
