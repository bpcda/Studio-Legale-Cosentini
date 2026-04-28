/**
 * Appwrite Function — send-status-email
 * Runtime: node-20
 * Trigger: HTTP (called from the admin Dashboard when a request status changes)
 * Execute access: configure in Appwrite console as label `admin`
 *
 * Env vars (set in Coolify / Appwrite function env):
 *   - RESEND_API_KEY   (required)
 */

const STUDIO_EMAIL = "avvocato@cosentini.it";

const serviceLabels = {
  generico: "Consulenza Generica",
  civile: "Diritto Civile",
  amministrativo: "Diritto Amministrativo",
  patrimoniale: "Patrimoniale & Wealth Management",
  trust: "Trust",
  "231": "Responsabilità 231/01",
  "recupero-crediti": "Recupero Crediti",
  custodia: "Custodia e Amministrazione Giudiziaria",
};

const statusMessages = {
  accepted: {
    subject: "La Sua richiesta di consulenza è stata accettata",
    heading: "Richiesta Accettata",
    body: "Siamo lieti di informarLa che la Sua richiesta di consulenza è stata <strong>accettata</strong>. Lo Studio La contatterà al più presto per concordare data, orario e modalità dell'incontro.",
  },
  rejected: {
    subject: "Aggiornamento sulla Sua richiesta di consulenza",
    heading: "Richiesta Non Accolta",
    body: "La informiamo che, dopo attenta valutazione, non ci è possibile accogliere la Sua richiesta di consulenza al momento. La invitiamo a contattarci telefonicamente per eventuali chiarimenti o per valutare soluzioni alternative.",
  },
  completed: {
    subject: "Consulenza completata — Studio Legale Cosentini",
    heading: "Consulenza Completata",
    body: `La informiamo che la Sua pratica di consulenza è stata <strong>completata</strong>. La ringraziamo per la fiducia accordata al nostro Studio. Per qualsiasi ulteriore necessità, non esiti a contattarci.
        </p>
        <div style="margin-top:28px;margin-bottom:28px;text-align:center;">
          <p style="color:#555;font-size:14px;margin-bottom:12px;">La Sua opinione è importante per noi. Se è soddisfatto del servizio ricevuto, Le saremmo grati se potesse dedicare un momento per lasciarci una recensione su Google:</p>
          <a href="https://g.page/r/CQTJq4z92TOTEBM/review" target="_blank" style="display:inline-block;background-color:#b8860b;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:bold;font-size:15px;">Lascia una recensione ⭐</a>
        </div>
        <p style="line-height:1.6;">`,
  },
};

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default async ({ req, res, log, error }) => {
  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { full_name, email, service_type, new_status } = payload;

    if (!full_name || !email || !new_status) {
      return res.json({ success: false, error: "Campi obbligatori mancanti" }, 400);
    }

    const statusInfo = statusMessages[new_status];
    if (!statusInfo) {
      return res.json({ success: false, error: "Stato non valido per l'invio email" }, 400);
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      error("RESEND_API_KEY not configured");
      return res.json({ success: false, error: "Email service not configured" }, 500);
    }

    const serviceName = serviceLabels[service_type] || service_type || "";

    const html = `
      <div style="font-family:Georgia,'Times New Roman',serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
        <h2 style="color:#1a1a1a;border-bottom:2px solid #b8860b;padding-bottom:12px;">Studio Legale Cosentini</h2>
        <p>Gentile <strong>${escapeHtml(full_name)}</strong>,</p>
        <h3 style="color:#1a1a1a;margin-top:24px;">${statusInfo.heading}</h3>
        ${serviceName ? `<p style="color:#555;font-size:14px;">Servizio richiesto: <strong>${escapeHtml(serviceName)}</strong></p>` : ""}
        <p style="line-height:1.6;">${statusInfo.body}</p>
        <p style="margin-top:32px;">Cordiali saluti,<br/><strong>Studio Legale Cosentini</strong></p>
        <hr style="border:none;border-top:1px solid #eee;margin-top:32px;"/>
        <p style="font-size:12px;color:#888;">Per qualsiasi necessità, risponda a questa email o ci contatti ai numeri dello Studio.</p>
      </div>
    `;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Studio Legale Cosentini <noreply@cosentini.it>",
        to: [email],
        subject: `${statusInfo.subject} — Studio Legale Cosentini`,
        html,
        reply_to: STUDIO_EMAIL,
      }),
    });

    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      error("Resend API error: " + JSON.stringify(data));
      return res.json({ success: false, error: "Failed to send email" }, 500);
    }

    log(`Status email sent to ${email} (${new_status})`);
    return res.json({ success: true });
  } catch (err) {
    error("Function error: " + (err?.message || String(err)));
    return res.json({ success: false, error: "Internal server error" }, 500);
  }
};
