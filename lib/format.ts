const TZ = "America/Argentina/Buenos_Aires";

const money = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/** 1800000 → "$ 18.000" */
export function formatARS(cents: number): string {
  return `$ ${money.format(Math.round(cents / 100))}`;
}

function parts(iso: string) {
  const d = new Date(iso);
  const get = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("es-AR", { timeZone: TZ, ...opts }).format(d);
  return {
    day: get({ day: "numeric" }),
    month: get({ month: "short" }).replace(".", ""),
    monthLong: get({ month: "long" }),
    year: get({ year: "numeric" }),
    weekday: get({ weekday: "short" }).replace(".", ""),
    weekdayLong: get({ weekday: "long" }),
    time: get({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
  };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Partes de fecha listas para el bloque de fecha y los tickets. */
export function eventDate(iso: string) {
  const p = parts(iso);
  return {
    day: p.day,
    month: p.month,
    monthUpper: p.month.toUpperCase(),
    year: p.year,
    weekday: cap(p.weekday),
    time: p.time,
    /** "Vie 13 nov" */
    short: `${cap(p.weekday)} ${p.day} ${p.month}`,
    /** "Vie 13 nov 2026" */
    medium: `${cap(p.weekday)} ${p.day} ${p.month} ${p.year}`,
    /** "Viernes 13 de noviembre de 2026" */
    long: `${cap(p.weekdayLong)} ${p.day} de ${p.monthLong} de ${p.year}`,
    /** "13/11/2026" */
    numeric: new Intl.DateTimeFormat("es-AR", {
      timeZone: TZ,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(iso)),
  };
}

/** "22/10 14:32" */
export function shortDateTime(iso: string): string {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("es-AR", { timeZone: TZ, day: "2-digit", month: "2-digit" }).format(d);
  const time = new Intl.DateTimeFormat("es-AR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(d);
  return `${date} ${time}`;
}

export function percent(part: number, total: number): string {
  return total ? `${Math.round((part / total) * 100)}%` : "0%";
}

const compact = new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 });

/** 5873 → "5,9 K" */
export function formatCompact(n: number): string {
  return compact.format(n);
}
