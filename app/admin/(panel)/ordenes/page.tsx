import type { Metadata } from "next";
import { OrdersView } from "@/components/admin/OrdersView";
import { PageHeader } from "@/components/admin/ui";
import { getPublishedEvents } from "@/lib/data/events";
import { listOrders, toOrderRow } from "@/lib/data/orders";

export const metadata: Metadata = { title: "Órdenes" };

export default async function AdminOrdersPage() {
  const rows = (await listOrders()).map(toOrderRow);
  const events = (await getPublishedEvents()).map((e) => e.title);
  return (
    <>
      <PageHeader title="Órdenes" />
      <OrdersView rows={rows} events={events} />
    </>
  );
}
