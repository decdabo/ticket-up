# MAIN_PLAN — Plataforma de venta de entradas (monolito fullstack autoadministrado)

## Contexto

El repo `diver` es un Next.js **16.4.2** recién creado (App Router, React 19.3, Tailwind v4, TypeScript, pnpm), sin código propio todavía. El cliente necesita una plataforma propia para vender entradas a sus eventos:

- un sitio público: landing, catálogo, detalle de evento y compra de varias entradas,
- una pasarela de pago con **Mercado Pago**,
- emisión de entradas con QR,
- un **panel de administración** para que el propio cliente gestione eventos, precios, cupos, órdenes y asistentes.

Se despliega en **Hostinger**. Lo primero es una **maqueta navegable** para presentarle al cliente antes de escribir código de negocio.

**Decisiones tomadas con el usuario**
- Pagos: Mercado Pago (Checkout Pro y webhooks).
- "Check in / check out" se refiere a la **pasarela de pago**: inicio de la compra (datos y reserva) → pago → confirmación.
- Maqueta: **Artifact de tipo Design** en claude.ai, con un link privado para compartir con el cliente.
- Hosting: Hostinger. Se recomienda un **VPS KVM** (Ubuntu + Docker), porque el monolito necesita Node persistente, PostgreSQL, cron y almacenamiento para imágenes.

**Supuestos (a confirmar con el cliente)**
- La UI está en español.
- La moneda es ARS; es configurable por evento.
- La marca del cliente es "Divercity". El nombre comercial queda como placeholder.

**Notas de Next 16 a respetar** (los docs están en `node_modules/.pnpm/next@16.4.2*/node_modules/next/dist/docs/`)
- `middleware` ahora se llama **`proxy.ts`**. Solo se usa para chequeos optimistas, no como autorización real (ver `01-app/01-getting-started/16-proxy.md`).
- La autenticación sigue el patrón **DAL + DTO** de `01-app/02-guides/authentication.md`.
- Para el despliegue se usa `output: "standalone"` y se lee `01-app/02-guides/self-hosting.md` (proxy reverso, caché, `after`, apagado ordenado).
- Antes de cada fase se lee la guía relevante de esos docs.

---

## Identidad visual (a partir de `docs/colors-example.png` y `docs/example.jpg`)

**Paleta.** Sale del logo: dorado metálico sobre negro.

| Token | Hex | Uso |
|---|---|---|
| `--ink` | `#0D0C0A` | fondos oscuros: hero, header, footer, panel |
| `--ink-soft` | `#1A1814` | tarjetas sobre oscuro |
| `--gold-700` | `#8C6A2B` | sombras del gradiente, hover |
| `--gold-500` | `#C9A44C` | color primario: CTA, bordes de ticket |
| `--gold-300` | `#E9CF83` | brillos y realces |
| `--ivory` | `#F7F3EA` | fondos claros de secciones (como en la referencia) |
| `--stone` | `#6E675C` | texto secundario |
| `--gold-ink` | `#6E5220` | texto dorado sobre fondos claros (`--gold-500` sobre ivory no alcanza 4.5:1) |
| `--paper` | `#FFFDF8` | tarjetas y tickets sobre ivory |
| `--line` | `#E4DCC8` | bordes; perforación de ticket `#CDBF9C` |

- Estados: ok `#2F6B3A`, aviso `#7A5A12`, error `#A1361F` (siempre con texto, nunca solo color).
- CTA "Comprar entradas": gradiente `--gold-700 → --gold-500 → --gold-300`, que replica el brillo del logo.

**Tipografía**
- Display serif para títulos de eventos (Playfair Display / DM Serif Display), como en la referencia.
- **DM Sans** para el texto corrido.

**Patrones tomados de la referencia**
- Hero oscuro con rango de fechas y un carrusel de "ticket cards" con borde troquelado: muescas semicirculares y una línea perforada entre la info y la foto.
- Listado "Próximos eventos" con un bloque de fecha (día grande, mes y año) y una píldora con la hora.
- Categoría en versalitas, título serif, botón primario más el link "Ver detalle".
- Calendario de eventos.
- En móvil, ticket card a pantalla completa con navegación Prev/Next.

---

## Fase 0 — Maqueta para el cliente (primer entregable) ✅

**Estado: completada.** Canvas Design: https://claude.ai/artifact/RNiHv4MTo7Ri9ERF4UavUZ (privado; se comparte desde el menú *Share*).

- 22 artboards en dos páginas:
  - *Sitio público*: 8 desktop (Inicio, Catálogo, Detalle, Checkout datos, Checkout pago, Resultado, Entrada, Email) y 7 móviles (las mismas, sin el email).
  - *Panel de administración*: 7 (Login, Dashboard, Eventos, Alta/edición de evento, Órdenes, Detalle de orden, Asistentes).
- Navegable en modo Play: carrusel, filtros, selector de cantidades, contador de reserva, redirección simulada a MP, estados de resultado, vista staff de la entrada y filtros del admin.
- Decisiones tomadas al diseñar (a validar con el cliente):
  - el monograma "DC" en texto es provisorio hasta tener el logo;
  - fotos y mapa son placeholders;
  - el copy del cliente queda entre `[corchetes]`;
  - el selector de estado en Resultado y el toggle staff en Entrada existen solo para la maqueta;
  - sin cargo por servicio (total = suma de entradas);
  - la pantalla *Usuarios* del admin queda pendiente.

**Herramienta**
- Primero `Artifact` con `action: "quickstart"` e `intent: "design"`.
- Luego se crea el artifact desde el tipo **Design** con la paleta de arriba como sistema de diseño.
- Se usan datos de ejemplo realistas: 5–6 eventos de comedia, concierto y teatro, con imágenes placeholder.

**Pantallas.** Desktop y móvil para las públicas; desktop para el admin.
1. **Home / landing**: hero con carrusel de ticket cards, "Próximos eventos", calendario mensual, bloque institucional y footer.
2. **Catálogo** (`/eventos`): filtros por categoría y fecha, y grilla/listado.
3. **Detalle de evento**: galería, descripción, lugar y mapa, fecha y hora, tipos de entrada con precio y disponibilidad, y selector de cantidad por tipo con un subtotal *sticky* en móvil.
4. **Checkout paso 1 – Datos del comprador**: nombre, email, DNI y teléfono, un resumen y un **contador de reserva** (p. ej. 15:00).
5. **Checkout paso 2 – Pago**: resumen y botón "Pagar con Mercado Pago" (redirección simulada).
6. **Resultado**: aprobado (entradas con QR y opción de descargar/agregar), pendiente, y rechazado o expirado (con reintento).
7. **Entrada individual**: ticket con QR, la vista que se abre desde el email.
8. **Email transaccional**: confirmación de compra con entradas.
9. **Admin – Login**.
10. **Admin – Dashboard**: ventas del día, entradas vendidas por evento, ocupación y órdenes recientes.
11. **Admin – Eventos**: listado con estado (borrador / publicado / finalizado) y formulario de alta y edición con imágenes, fechas y **tipos de entrada (precio, cupo, ventana de venta, máximo por orden)**.
12. **Admin – Órdenes**: tabla con filtros por estado, evento y fecha, y detalle de la orden con sus pagos y entradas.
13. **Admin – Asistentes**: listado por evento con búsqueda y export CSV.

**Entregable**
- El link privado del artifact, para compartir con el cliente.
- Con su feedback se itera sobre el mismo artifact.

---

## Fase 1 — UI mockeada (diseño integrado en la app, sin lógica)

Llevar las 13 pantallas del canvas a Next.js con componentes reales y **datos mock**, sin DB, sin Server Actions y sin pagos.

- **Tokens y fuentes**: paleta en `@theme` (`app/globals.css`), Playfair Display + DM Sans con `next/font/google` en `app/layout.tsx`.
- **Componentes**: toda la UI está construida sobre **shadcn/ui** (Button, Card, Badge, Input, Select, Checkbox, Switch, Table, Tabs, ToggleGroup, Dialog, Sheet, Sidebar, Carousel, Calendar, Chart, Progress, Collapsible, Breadcrumb, Pagination, Alert, Tooltip, Sonner). Lo único propio es lo de marca en `components/brand/` (ticket troquelado, QR de maqueta, logo) y el email, que usa estilos inline.
- **Datos**: `lib/mock/` (tipos que espejan el modelo de datos y los mismos datos de la maqueta) detrás de `lib/data/` con funciones `async` (`getPublishedEvents`, `getEventBySlug`, `getOrder`, `getTicketByToken`, `getDashboardStats`, `listOrders`, `listAttendees`…). En las fases siguientes solo cambia la implementación de `lib/data/`, no las páginas.
- **Responsive**: una ruta por pantalla; los artboards móviles son los breakpoints, no rutas aparte.
- **Interacción solo de UI** (estado local en componentes cliente): carrusel, filtros, selector de cantidades, contador, modal de redirección a MP, estados de resultado (`?estado=`), toggle staff, filtros del admin. Los botones que en el futuro mutan datos quedan sin acción.
- **Cache Components** (`cacheComponents: true`): cada `[param]` tiene `generateStaticParams` con ids mock (nunca `[]`) y `useSearchParams` va dentro de `<Suspense>`.
- **Email**: `components/email/OrderConfirmation.tsx` con estilos inline, visible en `/preview/email`; se porta a `@react-email/components` en la fase de emails.

---

## Arquitectura

**Monolito Next.js 16** (App Router), un solo deploy:
- **Server Components** para las lecturas.
- **Server Actions** para las mutaciones del admin y del checkout.
- **Route Handlers** para webhooks, cron y descargas.

| Capa | Elección |
|---|---|
| UI | **shadcn/ui** (estilo Nova sobre Radix) + Tailwind v4 + `lucide-react`. Tokens de marca y variables de shadcn en `app/globals.css`; variantes propias en `components/ui` (Button `gold`/`outline-light`/`xl`, Badge de estados, Toggle `chip`). Gráficos con recharts (Chart), calendario con react-day-picker (Calendar), carruseles con embla (Carousel), toasts con sonner |
| DB | PostgreSQL 16 |
| ORM / migraciones | Drizzle ORM + drizzle-kit (SQL explícito para bloqueos y `UPDATE … RETURNING`) |
| Validación | Zod (compartida entre form y server) |
| Auth admin | Propia, según la guía de Next: hash con argon2id, **sesiones en DB** en una cookie `httpOnly; Secure; SameSite=Lax`, `proxy.ts` con chequeo optimista y `verifySession()` en la DAL |
| Pagos | SDK `mercadopago` (Checkout Pro / Preferences, Payments, Refunds) |
| QR | `qrcode` (SVG/PNG) con un token aleatorio de 128 bits por entrada |
| Emails | `nodemailer` con el SMTP de Hostinger y plantillas `@react-email/components` |
| Jobs | Tabla `jobs` (outbox) y un endpoint `/api/cron/*` protegido por secreto, llamado por cron del sistema cada minuto |
| Imágenes | Volumen local `/data/uploads` servido por la app (incluido en backups) |
| Logs | `pino` en JSON a stdout, con rotación de logs de Docker |
| Tests | Vitest (unit e integración con Postgres real vía docker compose) y Playwright (e2e en móviles emulados) |

### Estructura de carpetas (propuesta)
```
app/
  (public)/(site)/layout.tsx              # header + footer del sitio
  (public)/(site)/page.tsx                # landing
  (public)/(site)/eventos/page.tsx        # catálogo
  (public)/(site)/eventos/[slug]/page.tsx # detalle + selector de cantidades
  (public)/checkout/[orderId]/page.tsx    # datos del comprador + contador de reserva
  (public)/checkout/[orderId]/pago/page.tsx
  (public)/checkout/[orderId]/resultado/page.tsx
  (public)/entradas/[token]/page.tsx      # entrada con QR
  preview/email/page.tsx                  # vista previa del email de confirmación
  admin/login/page.tsx
  admin/(panel)/layout.tsx                # verifySession()
  admin/(panel)/page.tsx                  # dashboard
  admin/(panel)/eventos/ (page, nuevo/, [id]/)
  admin/(panel)/ordenes/ (page, [id]/)
  admin/(panel)/asistentes/  usuarios/
  api/webhooks/mercadopago/route.ts
  api/cron/[job]/route.ts                 # expire-reservations, process-jobs, reconcile-payments
  api/health/route.ts
proxy.ts
lib/
  mock/ (types.ts, data.ts)                       # datos de la maqueta (Fase 1)
  data/ (events.ts, orders.ts, tickets.ts, admin.ts)  # capa de lectura: mock → Drizzle
  format.ts, status.ts (estados → variantes de Badge), utils.ts (cn de shadcn)
  db/schema.ts, db/client.ts
  auth/ (session.ts, dal.ts, password.ts)
  domain/ (inventory.ts, orders.ts, tickets.ts)   # lógica de negocio pura y testeable
  payments/mercadopago.ts                         # detrás de una interfaz PaymentProvider
  email/ (send.ts, templates/*)
  jobs/ (queue.ts, handlers/*)
components/
  ui/       # shadcn/ui (generado con `pnpm dlx shadcn add`, con variantes de marca)
  brand/    # piezas propias: Logo, Ticket (perforación/foto), QrCode, StatusBadge, Crumbs
  public/ admin/ email/
hooks/ (use-mobile.ts)
tests/ (unit/, integration/, e2e/)
```

### Modelo de datos (resumen)
- `admin_users` (email, password_hash, role: `owner|staff`, last_login_at) y `admin_sessions`.
- `events` (slug, title, category, description, venue, address, starts_at, ends_at, cover_image, status: `draft|published|finished|cancelled`, published_at).
- `ticket_types` (event_id, name, price_cents, currency, capacity, **sold**, **reserved**, sales_start/end, max_per_order, sort). Restricción `CHECK (sold + reserved <= capacity)`.
- `orders` (public_id, event_id, buyer_name/email/dni/phone, total_cents, status: `reserved|pending_payment|paid|expired|rejected|refunded|cancelled`, **reservation_expires_at**, mp_preference_id, idempotency_key UNIQUE).
- `order_items` (order_id, ticket_type_id, quantity, unit_price_cents).
- `payments` (order_id, provider, provider_payment_id UNIQUE, status, status_detail, amount_cents, raw jsonb).
- `webhook_events` (provider, provider_event_id, topic, received_at, processed_at). `UNIQUE (provider, provider_event_id)` aporta la **idempotencia**.
- `tickets` (order_id, ticket_type_id, attendee_name, **token UNIQUE**, status: `valid|used|void`, issued_at, used_at).
- `jobs` (type, payload jsonb, run_at, attempts, max_attempts, last_error, status, `UNIQUE dedupe_key`).
- `audit_log` (actor, action, entity, diff), para los cambios del admin.

---

## Flujos críticos

### Reserva temporal de inventario
1. En el detalle del evento el usuario elige cantidades. La Server Action `createReservation` hace, en **una transacción**, un update por tipo:
   `UPDATE ticket_types SET reserved = reserved + $q WHERE id = $id AND sold + reserved + $q <= capacity RETURNING id`.
   Si algún update no devuelve fila, se hace rollback y se responde "sin cupo".
2. Se crea la orden `reserved` con `reservation_expires_at = now() + 15 min` y una `idempotency_key` derivada del form, para que un doble click no cree dos órdenes.
3. **Expiración**: el cron `expire-reservations` (cada minuto) pasa a `expired` las órdenes vencidas y no pagadas, y devuelve `reserved`. Las lecturas también tratan como libres las reservas vencidas (expiración perezosa).

### Checkout con Mercado Pago
1. El comprador carga sus datos (Zod) y la orden pasa a `pending_payment`.
2. Se crea una Preference con:
   - `external_reference = order.public_id`,
   - `notification_url` (webhook) y `back_urls`,
   - `expiration_date_to` alineada a la reserva,
   - un idempotency header.
3. Se redirige a `init_point`.
4. Las `back_urls` **solo muestran estado**. La fuente de verdad es el webhook, y la página de resultado consulta el estado con polling corto.

### Webhook e idempotencia
`POST /api/webhooks/mercadopago`:
1. Valida la firma `x-signature` (HMAC con el secreto del panel de MP) y la frescura de `ts`.
2. Inserta en `webhook_events`. Si viola el UNIQUE, es un duplicado: responde `200` sin reprocesar.
3. **No confía en el body**: consulta `GET /v1/payments/{id}` a MP y hace upsert en `payments` por `provider_payment_id`.
4. Aplica la transición de estado con `SELECT … FOR UPDATE` sobre la orden. Las transiciones son monótonas: si la orden ya está `paid`, no hace nada.
   - `approved`: `reserved -= q`, `sold += q`, orden `paid`, crea `tickets` y encola los jobs `issue-email`.
   - `rejected` / `cancelled`: libera la reserva y deja la orden `rejected`, con link de reintento si la reserva sigue vigente.
   - `in_process` / `pending`: la mantiene, extendiendo la reserva hasta un tope.
5. **Pago aprobado tardío** (la orden ya estaba `expired`): intenta reservar de nuevo. Si no hay cupo, emite un **reembolso automático** por la API de MP y envía un email de disculpas.
6. Responde `200` rápido. El trabajo pesado (emails) se hace en `jobs`.
7. El cron `reconcile-payments` consulta en MP las órdenes `pending_payment` de más de X minutos, por si se perdió un webhook.

### Emisión de entradas y emails
- Una entrada por unidad comprada, cada una con un token aleatorio.
- El QR codifica `https://<dominio>/entradas/<token>`.
- Emails, procesados por el job `process-jobs` con backoff exponencial y `max_attempts`, y alerta al admin si fallan:
  - confirmación con las entradas (QR inline y link),
  - pago rechazado o expirado, con link de reintento,
  - reembolso.
- En el admin, el detalle de orden permite **reenviar las entradas**.
- Validación del QR (extra de bajo costo): la página `/entradas/[token]` muestra el estado de la entrada y, para staff logueado, un botón "Marcar como usada".

---

## Panel administrativo
- **Autenticación**: login con rate limit por IP+email. Roles: `owner` (todo, incluida la gestión de usuarios) y `staff` (solo lectura de órdenes y asistentes). Logout y expiración de sesión.
- **Eventos**: alta y edición (con slug automático y subida de imágenes), vista previa y **publicar / despublicar**. No se puede publicar sin al menos un tipo de entrada.
- **Precios y cupos**: CRUD de `ticket_types`. No se permite bajar `capacity` por debajo de `sold + reserved` ni editar el precio de un tipo con ventas, sin una confirmación explícita.
- **Órdenes**: filtros (estado, evento, fechas, email) y detalle con pagos, webhooks recibidos y entradas. Acciones: reenviar email y cancelar/reembolsar.
- **Asistentes**: por evento, con búsqueda y export CSV.
- **Dashboard**: ventas, ocupación por evento y órdenes recientes.

---

## Fases de implementación

| Fase | Entregable |
|---|---|
| **0. Maqueta** ✅ | Artifact Design con las 13 pantallas (22 artboards), a aprobar por el cliente |
| **1. UI mockeada** | Tokens y fuentes, componentes y todas las rutas públicas y de admin con datos de `lib/mock` detrás de `lib/data` (ver Fase 1) |
| **2. Base** | Docker compose con Postgres, Drizzle (schema y migraciones), seed (a partir de `lib/mock`), `lib/` base, lint y Vitest |
| **3. Admin** | Auth (sesiones, `proxy.ts`, DAL), conectar `lib/data` a la DB, Server Actions para CRUD de eventos y tipos de entrada, publicación, subida de imágenes |
| **4. Tienda** | Conectar landing, catálogo y detalle a la DB; reserva temporal real, datos del comprador (Zod) y contador contra `reservation_expires_at` |
| **5. Pagos** | `PaymentProvider` con Mercado Pago, preferencia, webhook firmado e idempotente, transiciones, reconciliación y reembolso tardío |
| **6. Entradas y emails** | Tokens y QR reales (`qrcode`), página de entrada, cola `jobs`, plantillas react-email, reintentos y reenvío desde el admin |
| **7. Pruebas** | Concurrencia, pagos duplicados y e2e móvil (ver Verificación) |
| **8. Infra y publicación** | VPS Hostinger, DNS, HTTPS, backups, logs, restauración y evento piloto |

## Publicación en Hostinger (Fase 8)
- **VPS KVM** (Ubuntu 24.04) con Docker y un compose de tres servicios: `app` (Next standalone), `postgres` y `caddy`.
  - Caddy actúa de proxy reverso y obtiene **HTTPS automático con Let's Encrypt**.
  - Hay un healthcheck en `/api/health`.
- **DNS** (hPanel): registro `A` (y `AAAA`) de `@` y `www` hacia la IP del VPS, y `www` redirigido al dominio raíz.
- **Email**: SPF, DKIM y DMARC configurados para el dominio de envío.
- **Cron del sistema**: `curl` con secreto a `/api/cron/expire-reservations`, `process-jobs` y `reconcile-payments`.
- **Secretos** en `.env` en el servidor (fuera del repo): `DATABASE_URL`, `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `SESSION_SECRET`, `SMTP_*`, `CRON_SECRET`, `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`.
- **Backups**:
  - `pg_dump` diario comprimido más un tar del volumen de uploads,
  - retención de 7 diarios y 4 semanales,
  - copia **offsite** (Backblaze B2 / S3 con `rclone`),
  - además, snapshots semanales del VPS de Hostinger.
- **Logs**: pino en JSON con `docker logs` y rotación (`max-size`), más alertas por email en fallos de jobs o webhooks.
- **Prueba de restauración** documentada en `docs/RUNBOOK.md`: levantar un Postgres limpio, restaurar el último dump, verificar conteos y hacer login. Se repite una vez al mes.
- **Evento piloto**:
  - credenciales de producción de MP y un evento real de bajo cupo,
  - compras reales de bajo monto desde iOS y Android,
  - verificar webhook, emails y QR, y hacer un reembolso de prueba,
  - recién después, apertura general.

> Si el plan de Hostinger es hosting compartido o "Business" (sin Docker ni Postgres), la alternativa es la app Node.js de hPanel con **MySQL**: Drizzle soporta MySQL y la lógica de bloqueo (`FOR UPDATE`, update condicional) sigue igual. El VPS sigue siendo lo recomendado.

---

## Verificación
- **Unit** (Vitest): transiciones de estado de órdenes, cálculo de totales, validaciones Zod y verificación de firma del webhook.
- **Concurrencia** (integración con Postgres real): tipo de entrada con `capacity = 10` y 50 reservas en paralelo (`Promise.all`). Se espera exactamente 10 exitosas, `sold + reserved <= capacity` y ninguna sobreventa. También se prueba que la expiración libera el cupo.
- **Pagos duplicados**:
  - el mismo webhook entregado 5 veces en paralelo produce una sola transición, un set de entradas y un email,
  - dos `payment_id` distintos aprobados para la misma orden: se reembolsa el segundo,
  - pago aprobado después de expirar, con y sin cupo,
  - firma inválida responde `401`.
- **E2E móvil** (Playwright con `devices['iPhone 15']` y `devices['Pixel 7']`): landing → detalle → elegir 3 entradas → datos → pago (MP mockeado con un servidor fake y, en staging, el **sandbox de MP** con usuarios de prueba) → resultado → abrir la entrada con QR. Se repite con el escenario de rechazo y reintento.
- **Manual**: Lighthouse móvil ≥ 90 en landing y detalle, revisión de accesibilidad (contraste del dorado sobre ivory, foco y tamaños táctiles) y prueba en dispositivos reales durante el piloto.
- **Infra**: `curl -I https://dominio` (HTTPS y redirect de www), un webhook de prueba desde el panel de MP y un simulacro de restauración de backup.

---

