"use client";

import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Sin autenticación real: en la Fase 3 el submit es una Server Action con rate limit. */
export function LoginForm() {
  const [showError, setShowError] = useState(false);

  return (
    <Card className="w-full max-w-[420px] bg-transparent ring-0 shadow-none">
      <CardHeader>
        <CardTitle>
          <h2 className="font-display font-semibold text-[32px]">Ingresar</h2>
        </CardTitle>
        <CardDescription>Usá el email y la contraseña de tu cuenta.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-5">
          {showError && (
            <Alert variant="destructive" className="bg-err-bg border-err-bg *:data-[slot=alert-description]:text-[#7a2816]">
              <CircleAlertIcon />
              <AlertDescription>
                Email o contraseña incorrectos. Te quedan 3 intentos antes de un bloqueo temporal.
              </AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="font-semibold">Email</Label>
            <Input id="email" type="email" autoComplete="username" defaultValue="admin@divercity.com.ar" className="h-12" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password" className="font-semibold">Contraseña</Label>
            <Input id="password" type="password" autoComplete="current-password" defaultValue="maqueta123" className="h-12" />
          </div>
          <Button asChild size="xl" className="w-full">
            <Link href="/admin">Ingresar</Link>
          </Button>
          <div className="flex justify-between items-center text-[13px]">
            <a href="#recuperar" className="text-gold-ink underline">
              Olvidé mi contraseña
            </a>
            <Button type="button" variant="link" size="sm" className="text-xs text-stone underline" onClick={() => setShowError((v) => !v)}>
              Maqueta: ver error
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
