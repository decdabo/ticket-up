// Datos de ejemplo de la maqueta (Fase 0). No hay lógica: solo valores fijos.
// En la Fase 2 sirven de base para el seed de la base de datos.

import type { Event, InstagramPost, Order, Ticket, TicketType } from "./types";

/** "Hoy" de la maqueta, para que los datos sean coherentes entre pantallas. */
export const MOCK_TODAY = "2026-10-22T15:00:00-03:00";

const tt = (
  id: string,
  name: string,
  note: string,
  price: number,
  capacity: number,
  sold: number,
  reserved = 0,
  maxPerOrder = 6,
): TicketType => ({
  id,
  name,
  note,
  priceCents: price * 100,
  currency: "ARS",
  capacity,
  sold,
  reserved,
  salesStart: "2026-09-15",
  salesEnd: "2026-11-13",
  maxPerOrder,
});

const DESCRIPTION = [
  "[Descripción de la noche provista por el cliente: temática, line-up y qué música va a sonar en cada pista.]",
  "[Segundo párrafo opcional: horarios de cada DJ o banda, promos de barra y beneficios de la anticipada.]",
];

const FACTS = ["Edad: +18", "Dress code: [elegante sport]", "Ingreso con DNI físico"];

export const events: Event[] = [
  {
    id: "ev_01",
    slug: "noche-dorada-opening",
    title: "Noche Dorada — Opening de temporada",
    subtitle: "Apertura de verano · Dress code dorado",
    category: "Fiesta",
    description: DESCRIPTION,
    venue: "Divercity · Pista principal",
    address: "Sarmiento 892, Concordia, Entre Ríos",
    startsAt: "2026-11-13T23:30:00-03:00",
    endsAt: "2026-11-14T06:00:00-03:00",
    doorsAt: "23:30",
    photo: "Pista llena con luces doradas",
    facts: FACTS,
    status: "published",
    publishedAt: "2026-10-01T10:00:00-03:00",
    ticketTypes: [
      tt("tt_01a", "General", "Ingreso a todas las pistas", 18000, 409, 263, 4),
      tt("tt_01b", "VIP", "Acceso al lounge VIP + 1 trago", 26000, 120, 109, 2),
      tt("tt_01c", "Mesa VIP", "Mesa para 6 en el lounge + botella", 180000, 12, 12, 0, 1),
    ],
  },
  {
    id: "ev_02",
    slug: "tech-house-session",
    title: "Tech House Session: [DJ invitado]",
    subtitle: "Set extendido de 4 horas",
    category: "DJ Set",
    description: DESCRIPTION,
    venue: "Divercity · Pista principal",
    address: "Sarmiento 892, Concordia, Entre Ríos",
    startsAt: "2026-11-14T23:59:00-03:00",
    endsAt: "2026-11-15T06:30:00-03:00",
    doorsAt: "23:59",
    photo: "DJ en la cabina",
    facts: FACTS,
    status: "published",
    publishedAt: "2026-09-20T10:00:00-03:00",
    ticketTypes: [
      tt("tt_02a", "General", "Ingreso a todas las pistas", 24000, 420, 380),
      tt("tt_02b", "VIP", "Acceso al lounge VIP + 1 trago", 32000, 140, 118),
    ],
  },
  {
    id: "ev_03",
    slug: "reggaeton-y-cachengue",
    title: "Reggaetón & Cachengue",
    subtitle: "Lo más sonado, toda la noche",
    category: "Fiesta",
    description: DESCRIPTION,
    venue: "Divercity · Pista principal",
    address: "Sarmiento 892, Concordia, Entre Ríos",
    startsAt: "2026-11-20T23:30:00-03:00",
    endsAt: "2026-11-21T06:00:00-03:00",
    doorsAt: "23:30",
    photo: "Público con las manos arriba",
    facts: FACTS,
    status: "published",
    publishedAt: "2026-09-25T10:00:00-03:00",
    ticketTypes: [tt("tt_03a", "General", "Ingreso a todas las pistas", 20000, 320, 154)],
  },
  {
    id: "ev_04",
    slug: "cumbia-en-vivo",
    title: "Cumbia en vivo: [Banda]",
    subtitle: "Show en vivo + after con DJ",
    category: "En vivo",
    description: DESCRIPTION,
    venue: "Divercity · Escenario",
    address: "Sarmiento 892, Concordia, Entre Ríos",
    startsAt: "2026-11-21T23:00:00-03:00",
    endsAt: "2026-11-22T05:30:00-03:00",
    doorsAt: "23:00",
    photo: "Banda en el escenario",
    facts: FACTS,
    status: "published",
    publishedAt: "2026-10-05T10:00:00-03:00",
    ticketTypes: [tt("tt_04a", "General", "Ingreso a todas las pistas", 15000, 180, 96)],
  },
  {
    id: "ev_05",
    slug: "retro-2000s",
    title: "Retro 2000s",
    subtitle: "Los hits que bailabas en el colegio",
    category: "Fiesta",
    description: DESCRIPTION,
    venue: "Divercity · Pista principal",
    address: "Sarmiento 892, Concordia, Entre Ríos",
    startsAt: "2026-11-27T23:30:00-03:00",
    endsAt: "2026-11-28T06:00:00-03:00",
    doorsAt: "23:30",
    photo: "Bola de espejos",
    facts: FACTS,
    status: "published",
    publishedAt: "2026-10-08T10:00:00-03:00",
    ticketTypes: [
      tt("tt_05a", "General", "Ingreso a todas las pistas", 22000, 240, 60),
      tt("tt_05b", "VIP", "Acceso al lounge VIP + 1 trago", 30000, 80, 28),
    ],
  },
  {
    id: "ev_06",
    slug: "sunset-to-night-b2b",
    title: "Sunset → Night: B2B [DJs]",
    subtitle: "Arranca en la terraza, termina en la pista",
    category: "DJ Set",
    description: DESCRIPTION,
    venue: "Divercity · Terraza",
    address: "Sarmiento 892, Concordia, Entre Ríos",
    startsAt: "2026-11-28T20:00:00-03:00",
    endsAt: "2026-11-29T06:00:00-03:00",
    doorsAt: "20:00",
    photo: "Terraza al atardecer",
    facts: FACTS,
    status: "published",
    publishedAt: "2026-09-30T10:00:00-03:00",
    ticketTypes: [
      tt("tt_06a", "General", "Terraza + pista principal", 12000, 400, 290),
      tt("tt_06b", "VIP", "Acceso al lounge VIP + 1 trago", 16000, 160, 81),
    ],
  },
  {
    id: "ev_07",
    slug: "fiesta-de-fin-de-ano",
    title: "Fiesta de fin de año",
    subtitle: "DJ invitado",
    category: "Fiesta",
    description: DESCRIPTION,
    venue: "Divercity · Pista principal",
    address: "Sarmiento 892, Concordia, Entre Ríos",
    startsAt: "2026-12-19T23:30:00-03:00",
    endsAt: "2026-12-20T06:00:00-03:00",
    doorsAt: "23:30",
    photo: "Afiche de la fiesta",
    facts: [],
    status: "draft",
    publishedAt: null,
    ticketTypes: [],
  },
  {
    id: "ev_08",
    slug: "halloween-party",
    title: "Halloween Party",
    subtitle: "Concurso de disfraces",
    category: "Fiesta",
    description: DESCRIPTION,
    venue: "Divercity · Pista principal",
    address: "Sarmiento 892, Concordia, Entre Ríos",
    startsAt: "2026-10-10T23:30:00-03:00",
    endsAt: "2026-10-11T06:00:00-03:00",
    doorsAt: "23:30",
    photo: "Público disfrazado",
    facts: [],
    status: "finished",
    publishedAt: "2026-08-20T10:00:00-03:00",
    ticketTypes: [tt("tt_08a", "General", "Ingreso a todas las pistas", 20000, 320, 304)],
  },
];

type OrderSeed = [
  publicId: string,
  createdAt: string,
  buyerName: string,
  buyerEmail: string,
  eventId: string,
  item: [ticketTypeId: string, name: string, quantity: number, unitPrice: number],
  status: Order["status"],
];

const orderSeeds: OrderSeed[] = [
  ["DV-7K3P2", "2026-10-22T14:18:00-03:00", "Tomás Aguirre", "tomas.aguirre@hotmail.com", "ev_02", ["tt_02a", "General", 2, 24000], "pending_payment"],
  ["DV-7K3N8", "2026-10-22T13:55:00-03:00", "Sofía Romero", "sofi.romero@gmail.com", "ev_06", ["tt_06a", "General", 4, 12000], "paid"],
  ["DV-7K3M1", "2026-10-22T13:51:00-03:00", "Diego Paz", "dpaz@outlook.com", "ev_04", ["tt_04a", "General", 2, 15000], "reserved"],
  ["DV-7K3L5", "2026-10-22T13:20:00-03:00", "Valentina Ruiz", "vruiz@gmail.com", "ev_03", ["tt_03a", "General", 1, 20000], "rejected"],
  ["DV-7K3K7", "2026-10-22T12:47:00-03:00", "Martina López", "martina.lopez@yahoo.com", "ev_01", ["tt_01b", "VIP", 2, 26000], "expired"],
  ["DV-7K3J4", "2026-10-22T12:10:00-03:00", "Juan Pérez", "juanperez@gmail.com", "ev_05", ["tt_05a", "General", 2, 22000], "paid"],
  ["DV-7K3H9", "2026-10-22T11:38:00-03:00", "Camila Sosa", "camisosa@gmail.com", "ev_02", ["tt_02a", "General", 1, 24000], "refunded"],
  ["DV-7K3G2", "2026-10-22T11:02:00-03:00", "Nicolás Díaz", "ndiaz@gmail.com", "ev_01", ["tt_01a", "General", 6, 18000], "paid"],
  ["DV-7K3F6", "2026-10-22T10:44:00-03:00", "Agustina Vega", "agus.vega@gmail.com", "ev_02", ["tt_02a", "General", 2, 24000], "pending_payment"],
];

export const orders: Order[] = [
  {
    publicId: "DV-7K3Q9",
    eventId: "ev_01",
    buyerName: "Lucía Fernández",
    buyerEmail: "lucia.fernandez@gmail.com",
    buyerDni: "34.567.890",
    buyerPhone: "+54 9 11 5555-1234",
    totalCents: 6200000,
    status: "paid",
    createdAt: "2026-10-22T14:27:12-03:00",
    reservationExpiresAt: "2026-10-22T14:42:12-03:00",
    items: [
      { ticketTypeId: "tt_01a", name: "General", quantity: 2, unitPriceCents: 1800000 },
      { ticketTypeId: "tt_01b", name: "VIP", quantity: 1, unitPriceCents: 2600000 },
    ],
    payments: [
      {
        providerPaymentId: "[1325478890]",
        method: "Visa débito ···· 4821",
        status: "approved",
        statusDetail: "accredited",
        amountCents: 6200000,
        createdAt: "2026-10-22T14:33:02-03:00",
      },
      {
        providerPaymentId: "[1325478102]",
        method: "Mastercard ···· 1190",
        status: "rejected",
        statusDetail: "insufficient_amount",
        amountCents: 6200000,
        createdAt: "2026-10-22T14:30:41-03:00",
      },
    ],
    history: [
      { title: "Email de confirmación enviado", at: "14:33:09", detail: "job issue-email", tone: "gold" },
      { title: "3 entradas emitidas", at: "14:33:05", detail: "sistema", tone: "gold" },
      { title: "Orden pagada", at: "14:33:04", detail: "pago [1325478890] approved", tone: "ok" },
      { title: "Webhook recibido", at: "14:33:02", detail: "payment · firma válida", tone: "neutral" },
      { title: "Pago rechazado", at: "14:30:41", detail: "[1325478102] insufficient_amount", tone: "err" },
      { title: "Redirigida a Mercado Pago", at: "14:29:57", detail: "pending_payment", tone: "neutral" },
      { title: "Reserva creada", at: "14:27:12", detail: "vence 14:42:12", tone: "neutral" },
    ],
  },
  ...orderSeeds.map(([publicId, createdAt, buyerName, buyerEmail, eventId, [ticketTypeId, name, quantity, unitPrice], status]): Order => ({
    publicId,
    eventId,
    buyerName,
    buyerEmail,
    buyerDni: "[DNI]",
    buyerPhone: "[Teléfono]",
    totalCents: quantity * unitPrice * 100,
    status,
    createdAt,
    reservationExpiresAt: createdAt,
    items: [{ ticketTypeId, name, quantity, unitPriceCents: unitPrice * 100 }],
    payments: [],
    history: [],
  })),
];

const ticket = (
  token: string,
  code: string,
  orderId: string,
  eventId: string,
  ticketTypeName: string,
  attendeeName: string,
  attendeeDni: string,
): Ticket => ({
  token,
  code,
  orderId,
  eventId,
  ticketTypeName,
  attendeeName,
  attendeeDni,
  status: "valid",
  usedAt: null,
});

export const tickets: Ticket[] = [
  ticket("9f2c4a7e1b6d8e03a5c71f42d9b0e6a1", "DV-7K3Q9-01", "DV-7K3Q9", "ev_01", "General", "Lucía Fernández", "34.567.890"),
  ticket("3b8e1d5a9c0f4e27b6d2a81c5f9e7d34", "DV-7K3Q9-02", "DV-7K3Q9", "ev_01", "General", "Lucía Fernández", "34.567.890"),
  ticket("c71a0e9d3f5b2846a1e8d7c4b9f03a62", "DV-7K3Q9-03", "DV-7K3Q9", "ev_01", "VIP", "Lucía Fernández", "34.567.890"),
  ticket("5e9d2b7a4c1f8e30d6a9b2c7e4f1a805", "DV-7K3G2-01", "DV-7K3G2", "ev_01", "General", "Nicolás Díaz", "30.112.457"),
  ticket("a4f7c2e9b1d5083e6c9a2f7d4b1e8c53", "DV-7K3G2-02", "DV-7K3G2", "ev_01", "General", "Nicolás Díaz", "30.112.457"),
  ticket("d2b9e6a3f7c1084b5e2d9a6c3f7b1e48", "DV-7J9A1-01", "DV-7J9A1", "ev_01", "Mesa VIP", "Florencia Gómez", "38.904.221"),
  ticket("7c4e1a8d5b2f9036e3c7a1d8b5f2e964", "DV-7J9A1-02", "DV-7J9A1", "ev_01", "Mesa VIP", "Florencia Gómez", "38.904.221"),
  ticket("e8a5d2c9f6b3017d4a8e5c2b9f6d3a71", "DV-7J8Z4-01", "DV-7J8Z4", "ev_01", "VIP", "Matías Herrera", "27.665.013"),
  ticket("1f6c3a9e7d4b0852c1f6a3e9d7b4c086", "DV-7J7Y2-01", "DV-7J7Y2", "ev_01", "General", "Julieta Castro", "41.230.876"),
  ticket("b3d0f7a4e1c8962f5b3d0a7e4c1f8b29", "DV-7J6X8-01", "DV-7J6X8", "ev_01", "General", "Federico Molina", "33.018.649"),
];

/** Emails de los asistentes que no tienen orden completa en los mocks. */
export const attendeeEmails: Record<string, string> = {
  "DV-7K3Q9": "lucia.fernandez@gmail.com",
  "DV-7K3G2": "ndiaz@gmail.com",
  "DV-7J9A1": "flor.gomez@gmail.com",
  "DV-7J8Z4": "mherrera@outlook.com",
  "DV-7J7Y2": "juli.castro@gmail.com",
  "DV-7J6X8": "fmolina@yahoo.com",
};

export const dailySales = [
  { label: "Vie 16", amountCents: 64000000 },
  { label: "Sáb 17", amountCents: 91000000 },
  { label: "Dom 18", amountCents: 52000000 },
  { label: "Lun 19", amountCents: 38000000 },
  { label: "Mar 20", amountCents: 76000000 },
  { label: "Mié 21", amountCents: 105000000 },
  { label: "Hoy", amountCents: 128400000 },
];

export const todayStats = {
  salesCents: 128400000,
  paidOrders: 23,
  ticketsSold: 61,
  eventsWithSales: 5,
  activeReservations: 7,
  reservedTickets: 18,
  pendingPayments: 2,
};

export const adminUser = { name: "Carla Méndez", email: "admin@divercity.com.ar", role: "owner" as const };

/** Cuenta de Instagram del club. */
export const INSTAGRAM_HANDLE = "divercityconcordia";

export const instagramPosts: InstagramPost[] = [
  { id: "ig_01", image: "Flyer Noche Dorada", caption: "13/11 abrimos la temporada ✨ Anticipadas con cupo limitado, link en bio.", likes: 1284, comments: 96, postedAt: "2026-10-21T19:00:00-03:00", kind: "post" },
  { id: "ig_02", image: "Pista llena desde la cabina", caption: "Así se vivió el sábado. Gracias por romperla una vez más 🖤", likes: 2410, comments: 133, postedAt: "2026-10-19T14:30:00-03:00", kind: "carrusel" },
  { id: "ig_03", image: "Reel del DJ en la cabina", caption: "El momento exacto en que sonó ESE tema 🔊", likes: 5873, comments: 241, postedAt: "2026-10-18T03:10:00-03:00", kind: "reel" },
  { id: "ig_04", image: "Line-up de noviembre", caption: "Line-up de noviembre confirmado. ¿Cuál es tu noche?", likes: 1967, comments: 188, postedAt: "2026-10-16T18:00:00-03:00", kind: "post" },
  { id: "ig_05", image: "Mesa VIP con botellas", caption: "¿Cumpleaños? Reservá tu mesa VIP y el festejo corre por nuestra cuenta 🎂", likes: 842, comments: 57, postedAt: "2026-10-14T17:00:00-03:00", kind: "post" },
  { id: "ig_06", image: "Halloween Party: disfraces", caption: "Los ganadores del concurso de disfraces 🎃 ¿Te encontrás en las fotos?", likes: 3120, comments: 402, postedAt: "2026-10-11T16:00:00-03:00", kind: "carrusel" },
];
