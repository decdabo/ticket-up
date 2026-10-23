"use client";

import { PlusIcon, Trash2Icon, UploadIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { StatusBadge } from "@/components/brand/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { EventCategory, EventStatus } from "@/lib/mock/types";
import { eventStatusMeta } from "@/lib/status";
import { AdminCard } from "./ui";

export type EventFormTicketType = {
  key: string;
  name: string;
  price: string;
  capacity: string;
  sold: number;
  reserved: number;
  salesStart: string;
  salesEnd: string;
  maxPerOrder: string;
};

export type EventFormData = {
  title: string;
  slug: string;
  category: EventCategory;
  description: string;
  startsAt: string;
  endsAt: string;
  venue: string;
  address: string;
  status: EventStatus;
  publishedInfo: string | null;
  previewHref: string | null;
  ticketTypes: EventFormTicketType[];
  summary: { sold: number; reserved: number; revenue: string } | null;
};

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Formulario de alta y edición. Solo estado local: en la Fase 3 se valida con
 * Zod y se guarda con Server Actions (con las reglas de cupo y precio del plan).
 */
export function EventForm({ initial, isNew = false }: { initial: EventFormData; isNew?: boolean }) {
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const [types, setTypes] = useState(initial.ticketTypes);
  // Contador propio: `new-${length}` repetía keys al borrar y volver a agregar.
  const nextKey = useRef(0);
  const meta = eventStatusMeta[initial.status];
  const capTotal = types.reduce((s, t) => s + (Number(t.capacity) || 0), 0);

  const addType = () => {
    const key = `new-${nextKey.current++}`;
    setTypes((ts) => [
      ...ts,
      { key, name: "", price: "", capacity: "", sold: 0, reserved: 0, salesStart: "", salesEnd: "", maxPerOrder: "6" },
    ]);
  };

  return (
    <div className="flex flex-wrap gap-6 items-start">
      <form className="flex-[999_1_560px] min-w-0 flex flex-col gap-5">
        <AdminCard title="Información" contentClassName="flex flex-col gap-4">
          <Field id="title" label="Título">
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field id="slug" label="URL (slug)" hint="Se genera desde el título.">
              <div className="flex items-center rounded-lg border border-input bg-ivory h-11 px-3 text-sm focus-within:ring-3 focus-within:ring-ring/50">
                <span className="text-stone">/eventos/</span>
                <input
                  id="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugTouched(true);
                  }}
                  className="bg-transparent flex-1 min-w-0 outline-none"
                />
              </div>
            </Field>
            <Field id="category" label="Categoría">
              <Select defaultValue={initial.category}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fiesta">Fiesta</SelectItem>
                  <SelectItem value="DJ Set">DJ Set</SelectItem>
                  <SelectItem value="En vivo">En vivo</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field id="description" label="Descripción">
            <Textarea id="description" rows={5} defaultValue={initial.description} className="bg-white" />
          </Field>
        </AdminCard>

        <AdminCard title="Fecha y lugar" contentClassName="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field id="startsAt" label="Inicio">
            <Input id="startsAt" type="datetime-local" defaultValue={initial.startsAt} />
          </Field>
          <Field id="endsAt" label="Fin">
            <Input id="endsAt" type="datetime-local" defaultValue={initial.endsAt} />
          </Field>
          <Field id="venue" label="Espacio">
            <Input id="venue" defaultValue={initial.venue} />
          </Field>
          <Field id="address" label="Dirección">
            <Input id="address" defaultValue={initial.address} />
          </Field>
        </AdminCard>

        <AdminCard title="Imágenes" contentClassName="grid grid-cols-2 md:grid-cols-4 gap-3">
          {!isNew && (
            <>
              <div className="col-span-2 flex flex-col gap-1.5">
                <div className="bg-photo h-40 rounded-md relative">
                  <span className="absolute top-2 left-2 bg-gold-500 text-ink text-[11px] font-bold px-2 py-0.5 rounded-sm">Portada</span>
                </div>
                <span className="text-xs text-stone">portada.jpg · 1600×900</span>
              </div>
              <div className="bg-photo h-40 rounded-md" />
            </>
          )}
          <Label
            htmlFor="images"
            className="h-40 border-2 border-dashed border-perf rounded-md flex flex-col items-center justify-center gap-1.5 text-[13px] font-normal text-soft cursor-pointer text-center p-2 hover:bg-ivory"
          >
            <UploadIcon className="size-6 text-gold-700" aria-hidden />
            Subir imágenes
            <span className="text-[11px] text-stone">JPG o PNG, máx. 5 MB</span>
            <input id="images" type="file" accept="image/*" multiple className="sr-only" />
          </Label>
        </AdminCard>

        <AdminCard
          title="Tipos de entrada"
          action={
            <Button type="button" variant="outline" size="sm" className="border-ink" onClick={addType}>
              <PlusIcon /> Agregar tipo
            </Button>
          }
          contentClassName={types.length ? "px-0" : undefined}
        >
          {types.length === 0 ? (
            <p className="text-sm text-stone">Todavía no hay tipos de entrada. Agregá al menos uno para poder publicar el evento.</p>
          ) : (
            <Table className="min-w-[920px] text-[13px] [&_th:first-child]:pl-5 [&_td:first-child]:pl-5 [&_th:last-child]:pr-5 [&_td:last-child]:pr-5">
              <TableHeader>
                <TableRow className="hover:bg-transparent [&_th]:text-[11px] [&_th]:tracking-[1px] [&_th]:text-stone">
                  <TableHead>NOMBRE</TableHead>
                  <TableHead>PRECIO (ARS)</TableHead>
                  <TableHead>CUPO</TableHead>
                  <TableHead>VEND. / RES.</TableHead>
                  <TableHead>VENTA DESDE</TableHead>
                  <TableHead>VENTA HASTA</TableHead>
                  <TableHead>MÁX/ORDEN</TableHead>
                  <TableHead>
                    <span className="sr-only">Acciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {types.map((t) => {
                  const hasSales = t.sold + t.reserved > 0;
                  const removeButton = (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label={`Eliminar tipo ${t.name || "nuevo"}`}
                      disabled={hasSales}
                      onClick={() => setTypes((ts) => ts.filter((x) => x.key !== t.key))}
                    >
                      <Trash2Icon />
                    </Button>
                  );
                  return (
                    <TableRow key={t.key} className="align-top hover:bg-transparent">
                      <TableCell>
                        <Input aria-label="Nombre" defaultValue={t.name} className="h-9 min-w-36" />
                      </TableCell>
                      <TableCell>
                        <Input aria-label="Precio" defaultValue={t.price} inputMode="numeric" className="h-9 w-[100px]" />
                        {hasSales && (
                          <div className="text-[11px] text-warn mt-1 max-w-[120px] whitespace-normal">Tiene ventas: cambiar el precio pide confirmación</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Input aria-label="Cupo" defaultValue={t.capacity} inputMode="numeric" className="h-9 w-[76px]" />
                        {hasSales && <div className="text-[11px] text-stone mt-1">Mín. {t.sold + t.reserved}</div>}
                      </TableCell>
                      <TableCell className="pt-4 tabular-nums">
                        {t.sold} / {t.reserved}
                      </TableCell>
                      <TableCell>
                        <Input type="date" aria-label="Venta desde" defaultValue={t.salesStart} className="h-9" />
                      </TableCell>
                      <TableCell>
                        <Input type="date" aria-label="Venta hasta" defaultValue={t.salesEnd} className="h-9" />
                      </TableCell>
                      <TableCell>
                        <Input aria-label="Máximo por orden" defaultValue={t.maxPerOrder} inputMode="numeric" className="h-9 w-[56px]" />
                      </TableCell>
                      <TableCell>
                        {hasSales ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {/* El span recibe el hover: un botón deshabilitado no dispara eventos. */}
                              <span tabIndex={0} className="inline-flex">
                                {removeButton}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>No se puede eliminar un tipo con ventas</TooltipContent>
                          </Tooltip>
                        ) : (
                          removeButton
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </AdminCard>
      </form>

      <aside className="flex-[1_1_260px] min-w-0 md:sticky md:top-6 flex flex-col gap-4">
        <AdminCard title="Publicación" contentClassName="flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm">Estado</span>
            <StatusBadge label={meta.label} tone={meta.tone} />
          </div>
          {initial.publishedInfo && <span className="text-[13px] text-stone">{initial.publishedInfo}</span>}
          <Button className="w-full">{isNew ? "Guardar borrador" : "Guardar cambios"}</Button>
          {initial.previewHref && (
            <Button asChild variant="outline" className="w-full">
              <Link href={initial.previewHref}>Vista previa</Link>
            </Button>
          )}
          {initial.status === "published" && (
            <Button variant="link" className="text-destructive underline">
              Despublicar
            </Button>
          )}
          {initial.status === "draft" && (
            <Button variant="gold" disabled={types.length === 0} className="w-full">
              Publicar
            </Button>
          )}
        </AdminCard>
        {initial.summary && (
          <AdminCard title="Resumen" contentClassName="flex flex-col gap-2 text-sm">
            <Row label="Cupo total" value={String(capTotal)} />
            <Row label="Vendidas" value={String(initial.summary.sold)} />
            <Row label="En reserva" value={String(initial.summary.reserved)} />
            <Row label="Recaudado" value={initial.summary.revenue} />
          </AdminCard>
        )}
      </aside>
    </div>
  );
}

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="font-semibold">
        {label}
      </Label>
      {children}
      {hint && <span className="text-xs text-stone">{hint}</span>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-stone">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
