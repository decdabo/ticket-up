"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/eventos", label: "Eventos" },
  { href: "/#calendario", label: "Calendario" },
  { href: "/#instagram", label: "Instagram" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#contacto", label: "Contacto" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  return (
    <header className="bg-ink border-b border-ink-line">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-2 md:py-4 flex items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Principal" className="hidden md:flex items-center gap-7 text-[15px]">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "hover:text-gold-300",
                isActive(item.href) ? "text-gold-300 border-b-2 border-gold-500 pb-1" : "text-ivory",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button asChild variant="outline-light" size="sm">
            <Link href="/eventos">Comprar entradas</Link>
          </Button>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-ivory hover:bg-ink-soft hover:text-gold-300" aria-label="Abrir menú">
              <MenuIcon className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" showCloseButton={false} aria-describedby={undefined} className="bg-ink text-ivory border-ink-line">
            <SheetHeader className="flex-row items-center justify-between">
              <SheetTitle className="font-display text-xl text-ivory">Divercity</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="text-ivory hover:bg-ink-soft hover:text-gold-300" aria-label="Cerrar menú">
                  <XIcon className="size-6" />
                </Button>
              </SheetClose>
            </SheetHeader>
            <nav aria-label="Principal" className="flex flex-col px-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "flex items-center min-h-12 text-base border-b border-ink-line",
                    isActive(item.href) ? "text-gold-300" : "text-ivory",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
