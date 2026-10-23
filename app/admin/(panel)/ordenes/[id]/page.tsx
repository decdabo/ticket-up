import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderActions } from "@/components/admin/OrderActions";
import { AdminCard, PageHeader, TableCard, edgeCells, headRow } from "@/components/admin/ui";
import { StatusBadge } from "@/components/brand/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrder, listOrderIds } from "@/lib/data/orders";
import { getOrderTickets } from "@/lib/data/tickets";
import { eventDate, formatARS, shortDateTime } from "@/lib/format";
import type { OrderEvent } from "@/lib/mock/types";
import { orderStatusMeta, paymentStatusTone, ticketStatusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Detalle de orden" };

export async function generateStaticParams() {
  return (await listOrderIds()).map((id) => ({ id }));
}

const dot: Record<OrderEvent["tone"], string> = {
  neutral: "bg-perf",
  gold: "bg-gold-700",
  ok: "bg-ok",
  err: "bg-err",
};

export default async function AdminOrderPage({ params }: PageProps<"/admin/ordenes/[id]">) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();
  const tickets = await getOrderTickets(order.publicId);
  const meta = orderStatusMeta[order.status];
  const date = eventDate(order.event.startsAt);

  return (
    <>
      <PageHeader
        title={`Orden ${order.publicId}`}
        crumbs={[{ href: "/admin/ordenes", label: "Órdenes" }]}
        actions={<OrderActions email={order.buyerEmail} canRefund={order.status === "paid"} />}
      >
        <StatusBadge label={meta.label} tone={meta.tone} large />
      </PageHeader>

      <div className="flex flex-wrap gap-5 items-start">
        <div className="flex-[999_1_520px] min-w-0 flex flex-col gap-5">
          <AdminCard title={`${order.event.title} · ${date.weekday} ${date.numeric} ${date.time}`} contentClassName="flex flex-col gap-2.5 text-sm">
            {order.items.map((it) => (
              <div key={it.ticketTypeId} className="flex justify-between">
                <span>
                  {it.quantity} × {it.name} · {formatARS(it.unitPriceCents)}
                </span>
                <span>{formatARS(it.quantity * it.unitPriceCents)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatARS(order.totalCents)}</span>
            </div>
          </AdminCard>

          <TableCard title="Pagos">
            {order.payments.length === 0 ? (
              <p className="px-5 pb-5 text-sm text-stone">Sin pagos registrados.</p>
            ) : (
              <Table className={cn("min-w-[620px]", edgeCells)}>
                <TableHeader>
                  <TableRow className={headRow}>
                    <TableHead>ID MERCADO PAGO</TableHead>
                    <TableHead>MEDIO</TableHead>
                    <TableHead>ESTADO</TableHead>
                    <TableHead>FECHA</TableHead>
                    <TableHead className="text-right">MONTO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.payments.map((p) => (
                    <TableRow key={p.providerPaymentId}>
                      <TableCell className="font-mono text-[13px]">{p.providerPaymentId}</TableCell>
                      <TableCell>{p.method}</TableCell>
                      <TableCell>
                        <StatusBadge label={p.status} tone={paymentStatusTone[p.status]} />{" "}
                        <span className="text-xs text-stone">{p.statusDetail}</span>
                      </TableCell>
                      <TableCell>{shortDateTime(p.createdAt)}</TableCell>
                      <TableCell className="text-right">{formatARS(p.amountCents)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableCard>

          <TableCard title="Entradas emitidas">
            {tickets.length === 0 ? (
              <p className="px-5 pb-5 text-sm text-stone">Todavía no se emitieron entradas.</p>
            ) : (
              <Table className={cn("min-w-[560px]", edgeCells)}>
                <TableHeader>
                  <TableRow className={headRow}>
                    <TableHead>CÓDIGO</TableHead>
                    <TableHead>TIPO</TableHead>
                    <TableHead>ESTADO</TableHead>
                    <TableHead>
                      <span className="sr-only">Acciones</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((t) => {
                    const tm = ticketStatusMeta[t.status];
                    return (
                      <TableRow key={t.token}>
                        <TableCell className="font-mono text-[13px]">{t.code}</TableCell>
                        <TableCell>{t.ticketTypeName}</TableCell>
                        <TableCell>
                          <StatusBadge label={tm.label} tone={tm.tone} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/entradas/${t.token}`} className="text-gold-ink underline">
                            Ver
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </TableCard>
        </div>

        <div className="flex-[1_1_300px] min-w-0 flex flex-col gap-5">
          <AdminCard title="Comprador" contentClassName="flex flex-col gap-1.5 text-sm">
            <strong>{order.buyerName}</strong>
            <span>{order.buyerEmail}</span>
            <span>DNI {order.buyerDni}</span>
            <span>{order.buyerPhone}</span>
          </AdminCard>
          <AdminCard title="Historial">
            {order.history.length === 0 ? (
              <p className="text-sm text-stone">Creada el {shortDateTime(order.createdAt)}.</p>
            ) : (
              <ol className="flex flex-col gap-3.5 text-[13px]">
                {order.history.map((e) => (
                  <li key={`${e.at}-${e.title}`} className="flex gap-3">
                    <span className={cn("shrink-0 size-2.5 rounded-full mt-1", dot[e.tone])} aria-hidden />
                    <div className="flex flex-col gap-0.5">
                      <strong className="font-semibold">{e.title}</strong>
                      <span className="text-stone">
                        {e.at} · {e.detail}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </AdminCard>
        </div>
      </div>
    </>
  );
}
