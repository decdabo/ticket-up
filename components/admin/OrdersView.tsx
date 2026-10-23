"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { OrderStatus } from "@/lib/mock/types";
import { orderStatusMeta } from "@/lib/status";
import { OrdersTable, type OrderRow } from "./OrdersTable";
import { AdminCard } from "./ui";

const FILTERS: (OrderStatus | "all")[] = ["all", "paid", "pending_payment", "reserved", "rejected", "expired", "refunded"];

/** Filtros solo en el cliente sobre los mocks; en la Fase 3 pasan a `searchParams` y a la consulta. */
export function OrdersView({ rows, events }: { rows: OrderRow[]; events: string[] }) {
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [event, setEvent] = useState("all");
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = rows.filter(
    (r) =>
      (status === "all" || r.status === status) &&
      (event === "all" || r.event === event) &&
      (!needle || r.email.toLowerCase().includes(needle) || r.id.toLowerCase().includes(needle) || r.buyer.toLowerCase().includes(needle)),
  );

  return (
    <>
      <AdminCard contentClassName="flex flex-wrap gap-3 items-end">
        <FilterField id="q" label="Email o n.º de orden" className="flex-[1_1_200px]">
          <Input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="lucia@… o DV-…" />
        </FilterField>
        <FilterField id="event" label="Evento">
          <Select value={event} onValueChange={setEvent}>
            <SelectTrigger id="event" className="w-60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los eventos</SelectItem>
              {events.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>
        <FilterField id="from" label="Desde">
          <Input id="from" type="date" defaultValue="2026-10-01" />
        </FilterField>
        <FilterField id="to" label="Hasta">
          <Input id="to" type="date" defaultValue="2026-10-22" />
        </FilterField>
      </AdminCard>

      <ToggleGroup
        type="single"
        value={status}
        onValueChange={(v) => v && setStatus(v as OrderStatus | "all")}
        aria-label="Estado"
        variant="chip"
        className="flex-wrap"
      >
        {FILTERS.map((s) => {
          const label = s === "all" ? "Todas" : orderStatusMeta[s].label;
          const count = s === "all" ? rows.length : rows.filter((r) => r.status === s).length;
          return (
            <ToggleGroupItem key={s} value={s} className="h-[38px] px-3.5 text-[13px] bg-white">
              {label} · {count}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      <AdminCard className="py-0 gap-0" contentClassName="px-0">
        <OrdersTable rows={shown} />
        {shown.length === 0 && <p className="px-5 py-7 text-center text-stone">No hay órdenes con esos filtros.</p>}
        <div className="flex flex-wrap justify-between items-center gap-3 px-5 py-3 border-t border-line text-[13px] text-stone">
          <span>
            Mostrando {shown.length} de {rows.length} órdenes
          </span>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" aria-disabled tabIndex={-1} size="sm" className="pointer-events-none opacity-50 border border-perf bg-white text-[13px]" />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" aria-disabled tabIndex={-1} size="sm" className="pointer-events-none opacity-50 border border-perf bg-white text-[13px]" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </AdminCard>
    </>
  );
}

function FilterField({ id, label, className, children }: { id: string; label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      <Label htmlFor={id} className="text-xs font-normal text-stone">
        {label}
      </Label>
      {children}
    </div>
  );
}
