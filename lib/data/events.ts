// Capa de lectura de eventos. Hoy devuelve mocks; en la Fase 2 consulta la DB
// con las mismas firmas, así las páginas no cambian.

import { eventDate, formatARS } from "@/lib/format";
import { events, MOCK_TODAY } from "@/lib/mock/data";
import type { Event, TicketType } from "@/lib/mock/types";

/** Datos serializables que usan las tarjetas y listados (también en componentes cliente). */
export type EventCard = {
  slug: string;
  title: string;
  subtitle: string;
  category: Event["category"];
  venue: string;
  photo: string;
  date: ReturnType<typeof eventDate>;
  fromLabel: string;
};

export function toEventCard(e: Event): EventCard {
  const min = minPriceCents(e);
  return {
    slug: e.slug,
    title: e.title,
    subtitle: e.subtitle,
    category: e.category,
    venue: e.venue,
    photo: e.photo,
    date: eventDate(e.startsAt),
    fromLabel: min === null ? "—" : formatARS(min),
  };
}

export function available(t: TicketType): number {
  return Math.max(0, t.capacity - t.sold - t.reserved);
}

export function minPriceCents(event: Event): number | null {
  const prices = event.ticketTypes.map((t) => t.priceCents);
  return prices.length ? Math.min(...prices) : null;
}

export function eventTotals(event: Event) {
  return event.ticketTypes.reduce(
    (acc, t) => ({
      capacity: acc.capacity + t.capacity,
      sold: acc.sold + t.sold,
      reserved: acc.reserved + t.reserved,
      revenueCents: acc.revenueCents + t.sold * t.priceCents,
    }),
    { capacity: 0, sold: 0, reserved: 0, revenueCents: 0 },
  );
}

export async function getPublishedEvents(): Promise<Event[]> {
  return events
    .filter((e) => e.status === "published")
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

/** El próximo evento publicado a partir de "hoy" (MOCK_TODAY en la maqueta). */
export async function getNextEvent(): Promise<Event | null> {
  const now = new Date(MOCK_TODAY).getTime();
  return (await getPublishedEvents()).find((e) => new Date(e.startsAt).getTime() >= now) ?? null;
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  return events.find((e) => e.slug === slug && e.status === "published") ?? null;
}

export async function getEventById(id: string): Promise<Event | null> {
  return events.find((e) => e.id === id) ?? null;
}

export async function listAllEvents(): Promise<Event[]> {
  return [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
