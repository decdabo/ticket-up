import Link from "next/link";
import { StatusBadge } from "@/components/brand/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { OrderStatus } from "@/lib/mock/types";
import { orderStatusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";
import { edgeCells, headRow } from "./ui";

export type OrderRow = {
  id: string;
  date: string;
  buyer: string;
  email: string;
  event: string;
  qty: number;
  total: string;
  status: OrderStatus;
};

/** Tabla de órdenes. Sin hooks: se usa desde páginas server y desde el filtro cliente. */
export function OrdersTable({ rows, showDate = true, showEmail = true }: { rows: OrderRow[]; showDate?: boolean; showEmail?: boolean }) {
  return (
    <Table className={cn("min-w-[760px]", edgeCells)}>
      <TableHeader>
        <TableRow className={headRow}>
          <TableHead>ORDEN</TableHead>
          {showDate && <TableHead>FECHA</TableHead>}
          <TableHead>COMPRADOR</TableHead>
          <TableHead>EVENTO</TableHead>
          <TableHead>CANT.</TableHead>
          <TableHead className="text-right">TOTAL</TableHead>
          <TableHead>ESTADO</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => {
          const meta = orderStatusMeta[r.status];
          return (
            <TableRow key={r.id}>
              <TableCell>
                <Link href={`/admin/ordenes/${r.id}`} className="font-mono text-[13px] text-gold-ink underline">
                  {r.id}
                </Link>
              </TableCell>
              {showDate && <TableCell className="text-soft">{r.date}</TableCell>}
              <TableCell>
                <div>{r.buyer}</div>
                {showEmail && <div className="text-xs text-stone">{r.email}</div>}
              </TableCell>
              <TableCell>{r.event}</TableCell>
              <TableCell>{r.qty}</TableCell>
              <TableCell className="text-right tabular-nums">{r.total}</TableCell>
              <TableCell>
                <StatusBadge label={meta.label} tone={meta.tone} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
