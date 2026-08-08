import { Resend } from "resend";

interface ReservationMailData {
  clientName: string;
  clientPhone: string;
  productName: string;
  comment?: string | null;
  reservationId: string;
}

/**
 * Envoie la notification email à l'admin à chaque nouvelle réservation.
 * Sans RESEND_API_KEY configurée, bascule en mode log (développement local).
 */
export async function notifyAdminReservation(data: ReservationMailData) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_NOTIF_EMAIL;
  const from = process.env.EMAIL_FROM || "PCStore <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(
      "[MAIL:LOG] nouvelle réservation " +
        data.reservationId +
        " — " +
        data.clientName +
        " (" +
        data.clientPhone +
        ") → " +
        data.productName +
        (data.comment ? " | commentaire: " + data.comment : "")
    );
    return { ok: true, mode: "log" as const };
  }

  if (!adminEmail) {
    console.warn("[MAIL] ADMIN_NOTIF_EMAIL non définie, envoi ignoré.");
    return { ok: false, mode: "error" as const };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to: [adminEmail],
      subject: `[PCStore] Nouvelle réservation — ${data.clientName}`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;background:#0a0e14;color:#e7ecf3;padding:32px;border-radius:12px">
          <h2 style="color:#4fe3ff;font-family:monospace;letter-spacing:1px">Nouvelle réservation #${data.reservationId.slice(-6)}</h2>
          <table style="margin-top:16px;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 16px 6px 0;color:#7d8aa0">Client</td><td><b>${data.clientName}</b></td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#7d8aa0">Téléphone</td><td><b>${data.clientPhone}</b></td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#7d8aa0">Produit</td><td><b>${data.productName}</b></td></tr>
            ${data.comment ? `<tr><td style="padding:6px 16px 6px 0;color:#7d8aa0">Commentaire</td><td>${data.comment}</td></tr>` : ""}
          </table>
          <p style="margin-top:20px;font-size:13px;color:#7d8aa0">
            La demande est en statut <b style="color:#ffb454">EN ATTENTE</b> — à traiter dans le panneau admin.
          </p>
        </div>
      `,
    });
    return { ok: true, mode: "email" as const };
  } catch (err) {
    console.error("[MAIL] échec d'envoi:", err);
    return { ok: false, mode: "error" as const };
  }
}
