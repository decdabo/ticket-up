"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Formulario del comprador. Sin envío: en la Fase 4 se valida con Zod y pasa la
 * orden a `pending_payment` con una Server Action.
 */
export function BuyerForm({ backHref, nextHref }: { backHref: string; nextHref: string }) {
  const [email, setEmail] = useState("lucia.fernandez@gmail.com");
  const [repeat, setRepeat] = useState("lucia.fernandez@gmail.com");
  const [touched, setTouched] = useState(false);
  const mismatch = touched && email !== repeat;

  return (
    <Card className="max-md:bg-transparent max-md:ring-0 max-md:py-0 md:p-8 rounded-[10px] gap-[18px] md:gap-[22px]">
      <form className="contents">
        <div>
          <h1 className="font-display font-semibold text-[28px] md:text-[32px] mb-1">Datos del comprador</h1>
          <p className="text-stone text-sm">Te enviamos las entradas a este email.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
          <Field id="name" label="Nombre y apellido" className="md:col-span-2">
            <Input className="h-12" id="name" name="name" autoComplete="name" defaultValue="Lucía Fernández" />
          </Field>
          <Field id="email" label="Email">
            <Input className="h-12" id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field id="emailConfirm" label="Repetí tu email">
            <Input
              className="h-12"
              id="emailConfirm"
              name="emailConfirm"
              type="email"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={mismatch}
              aria-describedby={mismatch ? "err-email" : undefined}
            />
            {mismatch && (
              <span id="err-email" className="text-[13px] font-medium text-destructive">
                Los emails no coinciden.
              </span>
            )}
          </Field>
          <Field id="dni" label="DNI">
            <Input className="h-12" id="dni" name="dni" inputMode="numeric" defaultValue="34.567.890" />
          </Field>
          <Field id="phone" label="Teléfono">
            <Input className="h-12" id="phone" name="phone" type="tel" autoComplete="tel" defaultValue="+54 9 11 5555-1234" />
          </Field>
        </div>
        <div className="flex gap-3 items-start text-sm leading-normal text-soft">
          <Checkbox id="terms" defaultChecked className="size-5 mt-0.5 data-checked:bg-gold-700 data-checked:border-gold-700 data-checked:text-white" />
          <Label htmlFor="terms" className="font-normal leading-normal block">
            Acepto los <a href="#terminos" className="text-gold-ink underline">términos y condiciones</a> y la{" "}
            <a href="#privacidad" className="text-gold-ink underline">política de privacidad</a>.
          </Label>
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-4 md:items-center justify-between md:border-t md:border-line md:pt-[22px]">
          <Link href={backHref} className="hidden md:inline text-sm underline">
            ← Volver al evento
          </Link>
          <Button asChild variant="gold" size="xl" className="w-full md:w-auto">
            <Link href={nextHref}>Continuar al pago</Link>
          </Button>
        </div>
      </form>
    </Card>
  );
}

function Field({ id, label, className, children }: { id: string; label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      {children}
    </div>
  );
}
