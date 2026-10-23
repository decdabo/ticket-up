import type { Metadata } from "next";
import { AttendeesView } from "@/components/admin/AttendeesView";
import { PageHeader, StatCard } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { eventTotals, getPublishedEvents } from "@/lib/data/events";
import { listOrderIds } from "@/lib/data/orders";
import { listAttendees } from "@/lib/data/tickets";
import { eventDate } from "@/lib/format";

export const metadata: Metadata = { title: "Asistentes" };

export default async function AttendeesPage() {
  const events = await getPublishedEvents();
  const current = events[0];
  const attendees = await listAttendees(current.id);
  const totals = eventTotals(current);
  const knownOrders = new Set(await listOrderIds());
  const orderCount = new Set(attendees.map((a) => a.orderId)).size;

  return (
    <>
      <PageHeader
        title="Asistentes"
        actions={
          // En la Fase 3 descarga el CSV desde un Route Handler.
          <Button variant="outline" className="border-ink">
            <DownloadIcon /> Exportar CSV
          </Button>
        }
      />
      <AttendeesView
        stats={
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
            <StatCard label="Entradas vendidas" value={String(totals.sold)} />
            <StatCard label="Ingresaron" value={String(attendees.filter((a) => a.status === "used").length)} />
            <StatCard label="Órdenes (en la muestra)" value={String(orderCount)} />
          </div>
        }
        events={events.map((e) => {
          const d = eventDate(e.startsAt);
          return { id: e.id, label: `${e.title} · ${d.weekday} ${d.day}/${d.numeric.slice(3, 5)} ${d.time}` };
        })}
        rows={attendees.map((a) => ({
          token: a.token,
          name: a.attendeeName,
          email: a.email,
          dni: a.attendeeDni,
          type: a.ticketTypeName,
          code: a.code,
          order: a.orderId,
          orderLinked: knownOrders.has(a.orderId),
          status: a.status,
        }))}
      />
    </>
  );
}
