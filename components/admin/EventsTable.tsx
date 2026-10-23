"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/brand/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { EventStatus } from "@/lib/mock/types";
import { eventStatusMeta } from "@/lib/status";
import { cn } from "@/lib/utils";
import { AdminCard, edgeCells, headRow } from "./ui";

export type EventRow = {
  id: string;
  title: string;
  category: string;
  venue: string;
  date: string;
  status: EventStatus;
  sold: string;
  revenue: string;
};

const TABS: { value: string; label: string; status: EventStatus | null }[] = [
  { value: "all", label: "Todos", status: null },
  { value: "published", label: "Publicados", status: "published" },
  { value: "draft", label: "Borradores", status: "draft" },
  { value: "finished", label: "Finalizados", status: "finished" },
];

/** Las acciones (publicar/despublicar) se conectan a Server Actions en la Fase 3. */
const actionFor: Record<EventStatus, string> = {
  published: "Despublicar",
  draft: "Publicar",
  finished: "Ver reporte",
  cancelled: "Ver reporte",
};

export function EventsTable({ rows }: { rows: EventRow[] }) {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const status = TABS.find((t) => t.value === tab)?.status ?? null;
  const shown = rows.filter(
    (r) => (status === null || r.status === status) && r.title.toLowerCase().includes(q.trim().toLowerCase()),
  );

  return (
    <>
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="group-data-horizontal/tabs:h-auto flex-wrap gap-1 p-1 rounded-md bg-white ring-1 ring-line">
            {TABS.map((t) => {
              const count = t.status === null ? rows.length : rows.filter((r) => r.status === t.status).length;
              return (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  className="h-[38px] flex-none px-3.5 text-ink data-active:bg-ink data-active:text-gold-300 shadow-none!"
                >
                  {t.label} <span className="opacity-70">{count}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-[260px]">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone" aria-hidden />
          <Input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar evento"
            aria-label="Buscar evento"
            className="pl-9"
          />
        </div>
      </div>

      <AdminCard className="py-0" contentClassName="px-0">
        <Table className={cn("min-w-[860px]", edgeCells)}>
          <TableHeader>
            <TableRow className={headRow}>
              <TableHead>EVENTO</TableHead>
              <TableHead>FECHA</TableHead>
              <TableHead>ESTADO</TableHead>
              <TableHead>VENDIDAS</TableHead>
              <TableHead className="text-right">RECAUDADO</TableHead>
              <TableHead className="text-right">ACCIONES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((r) => {
              const meta = eventStatusMeta[r.status];
              return (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-3.5">
                      <div className="bg-photo w-16 h-11 rounded shrink-0" />
                      <div className="flex flex-col gap-0.5">
                        <Link href={`/admin/eventos/${r.id}`} className="font-semibold hover:underline">
                          {r.title}
                        </Link>
                        <span className="text-xs text-stone">
                          {r.category} · {r.venue}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>
                    <StatusBadge label={meta.label} tone={meta.tone} />
                  </TableCell>
                  <TableCell className="tabular-nums">{r.sold}</TableCell>
                  <TableCell className="text-right tabular-nums">{r.revenue}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/eventos/${r.id}`}>Editar</Link>
                    </Button>
                    <Button variant="link" size="sm" className="text-ink underline">
                      {actionFor[r.status]}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {shown.length === 0 && <p className="px-5 py-7 text-center text-stone">No hay eventos que coincidan.</p>}
      </AdminCard>
      <p className="text-[13px] text-stone">Un evento en borrador solo se puede publicar si tiene al menos un tipo de entrada.</p>
    </>
  );
}
