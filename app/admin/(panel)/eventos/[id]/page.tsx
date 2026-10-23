import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { PageHeader } from "@/components/admin/ui";
import { getCurrentAdmin } from "@/lib/data/admin";
import { eventTotals, getEventById, listAllEvents } from "@/lib/data/events";
import { eventDate, formatARS } from "@/lib/format";

export const metadata: Metadata = { title: "Editar evento" };

export async function generateStaticParams() {
  return (await listAllEvents()).map((e) => ({ id: e.id }));
}

/** "2026-11-13T21:00:00-03:00" → "2026-11-13T21:00" para inputs datetime-local. */
const toLocalInput = (iso: string) => iso.slice(0, 16);

export default async function EditEventPage({ params }: PageProps<"/admin/eventos/[id]">) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();
  const totals = eventTotals(event);
  const admin = await getCurrentAdmin();

  return (
    <>
      <PageHeader title={event.title} crumbs={[{ href: "/admin/eventos", label: "Eventos" }]} />
      <EventForm
        initial={{
          title: event.title,
          slug: event.slug,
          category: event.category,
          description: [event.subtitle, ...event.description].join("\n\n"),
          startsAt: toLocalInput(event.startsAt),
          endsAt: toLocalInput(event.endsAt),
          venue: event.venue,
          address: event.address,
          status: event.status,
          publishedInfo: event.publishedAt
            ? `Publicado el ${eventDate(event.publishedAt).numeric} por ${admin.name}`
            : null,
          previewHref: event.status === "published" ? `/eventos/${event.slug}` : null,
          ticketTypes: event.ticketTypes.map((t) => ({
            key: t.id,
            name: t.name,
            price: String(t.priceCents / 100),
            capacity: String(t.capacity),
            sold: t.sold,
            reserved: t.reserved,
            salesStart: t.salesStart,
            salesEnd: t.salesEnd,
            maxPerOrder: String(t.maxPerOrder),
          })),
          summary: totals.capacity
            ? { sold: totals.sold, reserved: totals.reserved, revenue: formatARS(totals.revenueCents) }
            : null,
        }}
      />
    </>
  );
}
