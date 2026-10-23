import Link from "next/link";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { SalesChart } from "@/components/admin/SalesChart";
import { AdminCard, PageHeader, StatCard, TableCard } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getDashboardStats } from "@/lib/data/admin";
import { listOrders, toOrderRow } from "@/lib/data/orders";
import { eventDate, formatARS } from "@/lib/format";
import { MOCK_TODAY } from "@/lib/mock/data";

export default async function DashboardPage() {
  const { today, dailySales, occupancy } = await getDashboardStats();
  const recent = (await listOrders()).slice(0, 6).map(toOrderRow);

  return (
    <>
      <PageHeader
        title="Dashboard"
        actions={
          <Button asChild>
            <Link href="/admin/eventos/nuevo">+ Nuevo evento</Link>
          </Button>
        }
      />
      <span className="-mt-3 text-sm text-stone">{eventDate(MOCK_TODAY).long}</span>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <StatCard label="Ventas de hoy" value={formatARS(today.salesCents)} hint={`${today.paidOrders} órdenes pagadas`} />
        <StatCard label="Entradas vendidas hoy" value={String(today.ticketsSold)} hint={`en ${today.eventsWithSales} eventos`} />
        <StatCard label="Reservas activas" value={String(today.activeReservations)} hint={`${today.reservedTickets} entradas retenidas`} />
        <StatCard
          label="Pagos pendientes"
          value={String(today.pendingPayments)}
          hint={
            <Link href="/admin/ordenes" className="text-gold-ink underline">
              Ver órdenes
            </Link>
          }
        />
      </div>

      <div className="flex flex-wrap gap-5">
        <SalesChart data={dailySales} />
        <AdminCard title="Ocupación por evento" className="flex-[1_1_420px] min-w-0" contentClassName="flex flex-col gap-4">
          {occupancy.map((o) => {
            const pct = Math.round((o.sold / o.capacity) * 100);
            return (
              <div key={o.id} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm gap-3">
                  <span className="min-w-0 truncate">{o.title}</span>
                  <span className="text-soft tabular-nums shrink-0">
                    {o.sold} / {o.capacity} · <strong>{pct}%</strong>
                  </span>
                </div>
                <Progress value={pct} aria-label={`Ocupación de ${o.title}: ${pct}%`} className="h-2.5 bg-secondary [&>div]:bg-gold-700" />
              </div>
            );
          })}
        </AdminCard>
      </div>

      <TableCard
        title="Órdenes recientes"
        action={
          <Link href="/admin/ordenes" className="text-sm text-gold-ink underline">
            Ver todas
          </Link>
        }
      >
        <OrdersTable rows={recent} showDate={false} showEmail={false} />
      </TableCard>
    </>
  );
}
