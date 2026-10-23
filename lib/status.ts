import type { EventStatus, OrderStatus, PaymentStatus, TicketStatus } from "@/lib/mock/types";

/** Variantes de `Badge` (components/ui/badge.tsx) que representan un estado. */
export type StatusTone = "ok" | "warn" | "neutral" | "err" | "muted" | "info";

export const orderStatusMeta: Record<OrderStatus, { label: string; tone: StatusTone }> = {
  paid: { label: "Pagada", tone: "ok" },
  pending_payment: { label: "Pendiente", tone: "warn" },
  reserved: { label: "Reservada", tone: "neutral" },
  rejected: { label: "Rechazada", tone: "err" },
  expired: { label: "Expirada", tone: "muted" },
  refunded: { label: "Reembolsada", tone: "info" },
  cancelled: { label: "Cancelada", tone: "muted" },
};

export const eventStatusMeta: Record<EventStatus, { label: string; tone: StatusTone }> = {
  published: { label: "Publicado", tone: "ok" },
  draft: { label: "Borrador", tone: "warn" },
  finished: { label: "Finalizado", tone: "neutral" },
  cancelled: { label: "Cancelado", tone: "err" },
};

export const ticketStatusMeta: Record<TicketStatus, { label: string; tone: StatusTone }> = {
  valid: { label: "Válida", tone: "ok" },
  used: { label: "Usada", tone: "neutral" },
  void: { label: "Anulada", tone: "err" },
};

export const paymentStatusTone: Record<PaymentStatus, StatusTone> = {
  approved: "ok",
  rejected: "err",
  pending: "warn",
  in_process: "warn",
  refunded: "info",
};
