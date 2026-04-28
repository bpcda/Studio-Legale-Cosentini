/**
 * Appwrite Function — send-consultation-email
 * Runtime: node-20 (or higher)
 * Trigger: HTTP (called from the public consultation form via the SDK)
 * Execute access: configure in Appwrite console as `users` (anonymous sessions OK)
 *
 * Environment variables (set in Coolify / Appwrite function env):
 *   - RESEND_API_KEY   (required)
 *
 * The function only sends emails via Resend. The document itself is stored
 * by the client into the consultation_requests collection.
 */

const STUDIO_EMAIL = "avvocato@cosentini.it";

const modeLabels = {
  webcall: "Videochiamata (da concordare)",
  persona: "Di persona presso lo Studio",
};

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

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendEmail({ apiKey, to, subject, html, replyTo }) {
  const body = {
    from: "Studio Legale Cosentini <consulenze@cosentini.it>",
    to,
    subject,
    html,
  };
  if (replyTo) body.reply_to = replyTo;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, data: await res.json().catch(() => ({})) };
}

export default async ({ req, res, log, error }) => {
  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { full_name, email, phone, service_type, message, consultation_mode } = payload;

    if (!full_name || !email || !phone || !service_type || !message || !consultation_mode) {
      return res.json({ success: false, error: "Tutti i campi sono obbligatori" }, 400);
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      error("RESEND_API_KEY not configured");
      return res.json({ success: false, error: "Email service not configured" }, 500);
    }

    const serviceName = serviceLabels[service_type] || service_type;
    const modeName = modeLabels[consultation_mode] || consultation_mode;

    const studioHtml = `
      <h2>Nuova Richiesta di Consulenza</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Nome</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(full_name)}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Telefono</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Servizio</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(serviceName)}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Modalità</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(modeName)}</td></tr>
      </table>
      <h3 style="margin-top:24px;">Messaggio</h3>
      <p style="white-space:pre-wrap;background:#f9f9f9;padding:16px;border-radius:8px;">${escapeHtml(message)}</p>
    `;

    const confirmHtml = `
      <div style="font-family:Georgia,'Times New Roman',serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
        <h2 style="color:#1a1a1a;border-bottom:2px solid #b8860b;padding-bottom:12px;">Studio Legale Cosentini</h2>
        <p>Gentile <strong>${escapeHtml(full_name)}</strong>,</p>
        <p>La ringraziamo per averci contattato. Abbiamo ricevuto la Sua richiesta di consulenza con i seguenti dettagli:</p>
        <table style="border-collapse:collapse;width:100%;margin:16px 0;">
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:140px;">Servizio</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(serviceName)}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Modalità</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(modeName)}</td></tr>
        </table>
        <p>Lo Studio La contatterà al più presto per concordare data, orario e modalità della consulenza.</p>
        <p style="margin-top:24px;">Cordiali saluti,<br/><strong>Studio Legale Cosentini</strong></p>
        <hr style="border:none;border-top:1px solid #eee;margin-top:32px;"/>
        <p style="font-size:12px;color:#888;">Questa è un'email automatica. Per qualsiasi necessità, risponda a questa email o ci contatti ai numeri dello Studio.</p>
      </div>
    `;

    const [studioResult, confirmResult] = await Promise.all([
      sendEmail({ apiKey: RESEND_API_KEY, to: [STUDIO_EMAIL], subject: `Richiesta consulenza: ${serviceName} — ${full_name}`, html: studioHtml, replyTo: email }),
      sendEmail({ apiKey: RESEND_API_KEY, to: [email], subject: `Conferma richiesta di consulenza — Studio Legale Cosentini`, html: confirmHtml, replyTo: STUDIO_EMAIL }),
    ]);

    if (!studioResult.ok && !confirmResult.ok) {
      error("Both emails failed: " + JSON.stringify({ studioResult, confirmResult }));
      return res.json({ success: false, error: "Failed to send emails" }, 500);
    }

    log(`Emails sent for ${email}`);
    return res.json({ success: true });
  } catch (err) {
    error("Function error: " + (err?.message || String(err)));
    return res.json({ success: false, error: "Internal server error" }, 500);
  }
};
