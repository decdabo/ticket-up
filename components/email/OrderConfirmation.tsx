// Email de confirmación con estilos inline (compatibles con clientes de correo).
// En la Fase 6 se porta a @react-email/components y se envía desde la cola `jobs`.
// El QR acá es el de maqueta; en el email real va como imagen inline (CID).

import { QrCode } from "@/components/brand/QrCode";
import type { OrderWithEvent } from "@/lib/data/orders";
import type { TicketWithEvent } from "@/lib/data/tickets";
import { eventDate, formatARS } from "@/lib/format";

const font = "'DM Sans', Arial, sans-serif";
const serif = "'Playfair Display', Georgia, serif";

export function OrderConfirmation({
  order,
  tickets,
  baseUrl,
}: {
  order: OrderWithEvent;
  tickets: TicketWithEvent[];
  baseUrl: string;
}) {
  const date = eventDate(order.event.startsAt);
  const approved = order.payments.find((p) => p.status === "approved");

  return (
    <div style={{ background: "#ECE6D8", padding: "24px 12px", fontFamily: font, color: "#0D0C0A" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", background: "#FFFDF8", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ background: "#0D0C0A", padding: "28px 32px" }}>
          <span
            style={{
              fontFamily: serif,
              fontWeight: 700,
              fontSize: 24,
              color: "#C9A44C",
              border: "1px solid #8C6A2B",
              padding: "2px 8px",
              marginRight: 12,
            }}
          >
            DC
          </span>
          <span style={{ fontFamily: serif, fontWeight: 600, fontSize: 22, color: "#F7F3EA" }}>Divercity</span>
        </div>

        <div style={{ padding: 32 }}>
          <h1 style={{ margin: "0 0 16px", fontFamily: serif, fontWeight: 600, fontSize: 28, lineHeight: 1.2 }}>
            ¡Gracias por tu compra, {order.buyerName.split(" ")[0]}!
          </h1>
          <p style={{ margin: "0 0 16px", lineHeight: 1.6, color: "#3A362F" }}>
            Tu pago fue aprobado. Abajo están tus {tickets.length} entradas: cada una tiene su propio código QR.
            Podés mostrarlas desde el celular o impresas.
          </p>

          <div style={{ border: "1px solid #E4DCC8", borderRadius: 6, padding: "18px 20px", fontSize: 14 }}>
            <strong style={{ fontFamily: serif, fontSize: 20, fontWeight: 600, display: "block", marginBottom: 8 }}>
              {order.event.title}
            </strong>
            <div style={{ color: "#3A362F", marginBottom: 4 }}>
              {date.long} · {date.time} h (puertas {order.event.doorsAt})
            </div>
            <div style={{ color: "#3A362F" }}>
              {order.event.venue} · {order.event.address}
            </div>
            <table style={{ width: "100%", borderTop: "1px solid #E4DCC8", marginTop: 12, paddingTop: 8, fontSize: 14 }}>
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.ticketTypeId}>
                    <td style={{ padding: "3px 0" }}>
                      {it.quantity} × {it.name}
                    </td>
                    <td style={{ textAlign: "right" }}>{formatARS(it.quantity * it.unitPriceCents)}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ padding: "3px 0", fontWeight: 700 }}>Total pagado</td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>{formatARS(order.totalCents)}</td>
                </tr>
              </tbody>
            </table>
            {approved && (
              <div style={{ fontSize: 12, color: "#6E675C", marginTop: 6 }}>
                Mercado Pago · Operación #{approved.providerPaymentId}
              </div>
            )}
          </div>

          <div style={{ textAlign: "center", margin: "24px 0" }}>
            <a
              href={`${baseUrl}/entradas/${tickets[0]?.token ?? ""}`}
              style={{
                display: "inline-block",
                padding: "14px 28px",
                borderRadius: 4,
                background: "#C9A44C",
                color: "#0D0C0A",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Ver mis entradas
            </a>
          </div>

          {tickets.map((t, n) => (
            <table
              key={t.token}
              style={{ width: "100%", border: "1px solid #E4DCC8", borderRadius: 8, marginBottom: 16, borderSpacing: 0 }}
            >
              <tbody>
                <tr>
                  <td style={{ padding: "18px 20px", fontSize: 14, verticalAlign: "top" }}>
                    <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 600, color: "#6E5220" }}>
                      ENTRADA {n + 1} DE {tickets.length}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, margin: "4px 0" }}>{t.ticketTypeName}</div>
                    <div style={{ color: "#6E675C" }}>Titular: {t.attendeeName}</div>
                    <div style={{ color: "#6E675C", fontFamily: "monospace", fontSize: 12 }}>{t.code}</div>
                    <a
                      href={`${baseUrl}/entradas/${t.token}`}
                      style={{ display: "inline-block", marginTop: 8, fontSize: 13, fontWeight: 600, color: "#6E5220" }}
                    >
                      Abrir esta entrada
                    </a>
                  </td>
                  <td style={{ width: 150, padding: 14, borderLeft: "2px dashed #CDBF9C", textAlign: "center" }}>
                    <QrCode token={t.token} size={120} label={`QR de la entrada ${n + 1}`} />
                  </td>
                </tr>
              </tbody>
            </table>
          ))}

          <div style={{ background: "#F7F3EA", borderRadius: 6, padding: "18px 20px", fontSize: 14, lineHeight: 1.6, color: "#3A362F" }}>
            <strong style={{ color: "#0D0C0A" }}>Antes de ir</strong>
            <br />
            Cada código se puede usar una sola vez. Te recomendamos llegar 30 minutos antes. Si reenviás una entrada a
            otra persona, cuidá que no circule el mismo QR.
          </div>
        </div>

        <div style={{ background: "#0D0C0A", color: "#B8AE9C", padding: "22px 32px", fontSize: 12, lineHeight: 1.6 }}>
          Divercity · Sarmiento 892, Concordia, Entre Ríos · divercityconcordia@gmail.com
          <br />
          Recibiste este email porque compraste entradas en Divercity.{" "}
          <a href={`${baseUrl}/#contacto`} style={{ color: "#E9CF83" }}>
            Centro de ayuda
          </a>
        </div>
      </div>
    </div>
  );
}
