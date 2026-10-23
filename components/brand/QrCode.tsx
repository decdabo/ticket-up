// QR de maqueta: patrón determinístico derivado del token, con los tres
// "finder patterns". No es escaneable. En la Fase 6 se reemplaza por `qrcode`.

const N = 25;

function seedFrom(token: string): number {
  let h = 7;
  for (const ch of token) h = (h * 31 + ch.charCodeAt(0)) % 2147483647;
  return h || 1;
}

function qrPath(token: string): string {
  let s = seedFrom(token);
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const finder = (x: number, y: number) =>
    `M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z M${x + 2} ${y + 2}h3v3h-3z `;
  let d = finder(0, 0) + finder(N - 7, 0) + finder(0, N - 7);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const inFinder = (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
      if (!inFinder && rnd() > 0.52) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return d;
}

export function QrCode({
  token,
  size = 128,
  label,
  className = "",
}: {
  token: string;
  size?: number;
  label: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-1 -1 27 27"
      fillRule="evenodd"
      shapeRendering="crispEdges"
      role="img"
      aria-label={label}
      className={className}
    >
      <rect x="-1" y="-1" width="27" height="27" fill="#fff" />
      <path d={qrPath(token)} fill="#0d0c0a" />
    </svg>
  );
}
