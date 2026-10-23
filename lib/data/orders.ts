import { formatARS, shortDateTime } from "@/lib/format";
import { events, orders } from "@/lib/mock/data";
import type { Event, Order } from "@/lib/mock/types";

export type OrderWithEvent = Order & { event: Event };

function withEvent(order: Order): OrderWithEvent {
  const event = events.find((e) => e.id === order.eventId);
  if (!event) throw new Error(`Evento ${order.eventId} inexistente en los mocks`);
  return { ...order, event };
}

export async function getOrder(publicId: string): Promise<OrderWithEvent | null> {
  const order = orders.find((o) => o.publicId === publicId);
  return order ? withEvent(order) : null;
}

export async function listOrders(): Promise<OrderWithEvent[]> {
  return orders.map(withEvent).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function orderTicketCount(order: Order): number {
  return order.items.reduce((s, i) => s + i.quantity, 0);
}

/** Fila serializable para las tablas del admin. */
export function toOrderRow(o: OrderWithEvent) {
  return {
    id: o.publicId,
    date: shortDateTime(o.createdAt),
    buyer: o.buyerName,
    email: o.buyerEmail,
    event: o.event.title,
    qty: orderTicketCount(o),
    total: formatARS(o.totalCents),
    status: o.status,
  };
}

/** Ids de órdenes que se pueden abrir en checkout y admin (prerender). */
export async function listOrderIds(): Promise<string[]> {
  return orders.map((o) => o.publicId);
}
