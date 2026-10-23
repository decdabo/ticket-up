import type { Metadata } from "next";
import { EventsTable } from "@/components/admin/EventsTable";
import { PageHeader } from "@/components/admin/ui";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { eventTotals, listAllEvents } from "@/lib/data/events";
import { eventDate, formatARS } from "@/lib/format";

export const metadata: Metadata = { title: "Eventos" };

export default async function AdminEventsPage() {
  const events = await listAllEvents();
  const rows = events.map((e) => {
    const t = eventTotals(e);
    const d = eventDate(e.startsAt);
    return {
      id: e.id,
      title: e.title,
      category: e.category,
      venue: e.venue,
      date: `${d.weekday} ${d.numeric} ${d.time}`,
      status: e.status,
      sold: t.capacity ? `${t.sold} / ${t.capacity}` : "Sin tipos de entrada",
      revenue: t.revenueCents ? formatARS(t.revenueCents) : "—",
    };
  });

  return (
    <>
      <PageHeader
        title="Eventos"
        actions={
          <Button asChild>
            <Link href="/admin/eventos/nuevo">+ Nuevo evento</Link>
          </Button>
        }
      />
      <EventsTable rows={rows} />
    </>
  );
}
