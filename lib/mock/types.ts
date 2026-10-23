// Tipos que espejan el modelo de datos de docs/MAIN_PLAN.md.
// En la Fase 2 se reemplazan por los tipos inferidos del schema de Drizzle.

export type EventCategory = "Fiesta" | "DJ Set" | "En vivo";
export type EventStatus = "draft" | "published" | "finished" | "cancelled";

export type TicketType = {
  id: string;
  name: string;
  note: string;
  priceCents: number;
  currency: "ARS";
  capacity: number;
  sold: number;
  reserved: number;
  salesStart: string;
  salesEnd: string;
  maxPerOrder: number;
};

export type Event = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: EventCategory;
  description: string[];
  venue: string;
  address: string;
  startsAt: string;
  endsAt: string;
  doorsAt: string;
  photo: string;
  facts: string[];
  status: EventStatus;
  publishedAt: string | null;
  ticketTypes: TicketType[];
};

export type OrderStatus =
  | "reserved"
  | "pending_payment"
  | "paid"
  | "expired"
  | "rejected"
  | "refunded"
  | "cancelled";

export type OrderItem = {
  ticketTypeId: string;
  name: string;
  quantity: number;
  unitPriceCents: number;
};

export type PaymentStatus = "approved" | "rejected" | "pending" | "in_process" | "refunded";

export type Payment = {
  providerPaymentId: string;
  method: string;
  status: PaymentStatus;
  statusDetail: string;
  amountCents: number;
  createdAt: string;
};

export type OrderEvent = {
  title: string;
  at: string;
  detail: string;
  tone: "neutral" | "gold" | "ok" | "err";
};

export type Order = {
  publicId: string;
  eventId: string;
  buyerName: string;
  buyerEmail: string;
  buyerDni: string;
  buyerPhone: string;
  totalCents: number;
  status: OrderStatus;
  createdAt: string;
  reservationExpiresAt: string;
  items: OrderItem[];
  payments: Payment[];
  history: OrderEvent[];
};

export type InstagramPost = {
  id: string;
  /** Descripción de la imagen (placeholder hasta conectar la API). */
  image: string;
  caption: string;
  likes: number;
  comments: number;
  postedAt: string;
  kind: "post" | "reel" | "carrusel";
};

export type TicketStatus = "valid" | "used" | "void";

export type Ticket = {
  token: string;
  code: string;
  orderId: string;
  eventId: string;
  ticketTypeName: string;
  attendeeName: string;
  attendeeDni: string;
  status: TicketStatus;
  usedAt: string | null;
};
