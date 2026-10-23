"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/brand/StatusBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TicketStatus } from "@/lib/mock/types";
import { ticketStatusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";
import { AdminCard, edgeCells, headRow } from "./ui";

export type AttendeeRow = {
  token: string;
  name: string;
  email: string;
  dni: string;
  type: string;
  code: string;
  order: string;
  orderLinked: boolean;
  status: TicketStatus;
};

/** Selector de evento y búsqueda solo en cliente; en la Fase 3 van por `searchParams`. */
export function AttendeesView({
  rows,
  events,
  stats,
}: {
  rows: AttendeeRow[];
  events: { id: string; label: string }[];
  /** Stat cards: en el canvas van entre los filtros y la tabla. */
  stats?: React.ReactNode;
}) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = needle ? rows.filter((r) => `${r.name} ${r.email} ${r.dni} ${r.code}`.toLowerCase().includes(needle)) : rows;

  return (
    <>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1 min-w-0 w-full sm:w-auto">
          <Label htmlFor="event" className="text-xs font-normal text-stone">Evento</Label>
          <Select defaultValue={events[0]?.id}>
            <SelectTrigger id="event" className="w-full max-w-full sm:w-auto sm:min-w-[300px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {events.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1 flex-[1_1_240px]">
          <Label htmlFor="q" className="text-xs font-normal text-stone">Buscar por nombre, email, DNI o código</Label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone" aria-hidden />
            <Input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ej.: Fernández" className="pl-9" />
          </div>
        </div>
      </div>

      {stats}

      <AdminCard className="py-0" contentClassName="px-0">
        <Table className={cn("min-w-[900px]", edgeCells)}>
          <TableHeader>
            <TableRow className={headRow}>
              <TableHead>TITULAR</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>TIPO</TableHead>
              <TableHead>CÓDIGO</TableHead>
              <TableHead>ORDEN</TableHead>
              <TableHead>ESTADO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((r) => {
              const meta = ticketStatusMeta[r.status];
              return (
                <TableRow key={r.token}>
                  <TableCell className="font-semibold">{r.name}</TableCell>
                  <TableCell className="text-soft">{r.email}</TableCell>
                  <TableCell className="tabular-nums">{r.dni}</TableCell>
                  <TableCell>{r.type}</TableCell>
                  <TableCell className="font-mono text-[13px]">{r.code}</TableCell>
                  <TableCell>
                    {r.orderLinked ? (
                      <Link href={`/admin/ordenes/${r.order}`} className="font-mono text-[13px] text-gold-ink underline">
                        {r.order}
                      </Link>
                    ) : (
                      <span className="font-mono text-[13px]">{r.order}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge label={meta.label} tone={meta.tone} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {shown.length === 0 && <p className="px-5 py-7 text-center text-stone">No hay asistentes que coincidan con la búsqueda.</p>}
      </AdminCard>
    </>
  );
}
