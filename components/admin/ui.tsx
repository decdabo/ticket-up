import { Crumbs } from "@/components/brand/Crumbs";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Piezas compartidas del panel sobre los componentes de shadcn. */

export function PageHeader({
  title,
  crumbs,
  actions,
  children,
}: {
  title: string;
  crumbs?: { href: string; label: string }[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {crumbs && <Crumbs items={crumbs} current={title} />}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-3.5">
          <h1 className="font-display font-semibold text-[28px] md:text-[34px]">{title}</h1>
          {children}
        </div>
        {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
      </div>
    </div>
  );
}

/** Card del admin: fondo blanco sobre el gris cálido del panel. */
export function AdminCard({
  title,
  action,
  className,
  contentClassName,
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={cn("bg-white rounded-lg ring-line [--card-spacing:--spacing(5)] md:[--card-spacing:--spacing(5.5)]", className)}>
      {(title || action) && (
        <CardHeader>
          {title && (
            <CardTitle>
              <h2 className="text-[17px] font-bold">{title}</h2>
            </CardTitle>
          )}
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
      )}
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: React.ReactNode }) {
  return (
    <Card className="bg-white rounded-lg ring-line gap-1.5 px-(--card-spacing) [--card-spacing:--spacing(5)]">
      <span className="text-[13px] text-stone">{label}</span>
      <strong className="text-[26px] md:text-3xl tabular-nums">{value}</strong>
      {hint && <span className="text-[13px] text-stone">{hint}</span>}
    </Card>
  );
}

/** Card con tabla a todo el ancho (la tabla de shadcn ya trae scroll horizontal). */
export function TableCard({ title, action, children }: { title?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <AdminCard title={title} action={action} className="pb-0 gap-2" contentClassName="px-0">
      {children}
    </AdminCard>
  );
}

/** Padding de primera/última columna alineado con el de la card. */
export const edgeCells = "[&_th]:px-2.5 [&_th]:py-3 [&_td]:px-2.5 [&_td]:py-3 [&_tr]:border-secondary [&_th:first-child]:pl-5 [&_td:first-child]:pl-5 [&_th:last-child]:pr-5 [&_td:last-child]:pr-5 md:[&_th:first-child]:pl-[22px] md:[&_td:first-child]:pl-[22px] md:[&_th:last-child]:pr-[22px] md:[&_td:last-child]:pr-[22px]";
export const headRow = "bg-ivory hover:bg-ivory [&_th]:text-xs [&_th]:tracking-[1px] [&_th]:text-stone [&_th]:font-semibold";
