import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

/** Migas sobre `Breadcrumb` de shadcn. `tone="dark"` para encabezados en ink. */
export function Crumbs({
  items,
  current,
  tone = "light",
  className,
}: {
  items: { href: string; label: string }[];
  current: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className={cn("text-[13px]", dark ? "text-on-ink-muted" : "text-stone")}>
        {items.map((it) => (
          <Fragment key={it.href}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className={dark ? "hover:text-gold-300" : "text-gold-ink underline hover:text-ink"}>
                <Link href={it.href}>{it.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage className={dark ? "text-on-ink" : "text-ink"}>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
