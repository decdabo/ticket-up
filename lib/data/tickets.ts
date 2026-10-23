import { attendeeEmails, events, tickets } from "@/lib/mock/data";
import type { Event, Ticket } from "@/lib/mock/types";

export type TicketWithEvent = Ticket & { event: Event };

function withEvent(ticket: Ticket): TicketWithEvent {
  const event = events.find((e) => e.id === ticket.eventId);
  if (!event) throw new Error(`Evento ${ticket.eventId} inexistente en los mocks`);
  return { ...ticket, event };
}

export async function getTicketByToken(token: string): Promise<TicketWithEvent | null> {
  const ticket = tickets.find((t) => t.token === token);
  return ticket ? withEvent(ticket) : null;
}

export async function getOrderTickets(orderId: string): Promise<TicketWithEvent[]> {
  return tickets.filter((t) => t.orderId === orderId).map(withEvent);
}

export async function listAttendees(eventId: string) {
  return tickets
    .filter((t) => t.eventId === eventId)
    .map((t) => ({ ...t, email: attendeeEmails[t.orderId] ?? "" }));
}

export async function listTicketTokens(): Promise<string[]> {
  return tickets.map((t) => t.token);
}
