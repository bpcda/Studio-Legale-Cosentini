import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const STUDIO_EMAIL = "avvocato@cosentini.it";

const modeLabels: Record<string, string> = {
  webcall: "Videochiamata (da concordare)",
  persona: "Di persona presso lo Studio",
};

const serviceLabels: Record<string, string> = {
  generico: "Consulenza Generica",
  civile: "Diritto Civile",
  amministrativo: "Diritto Amministrativo",
  patrimoniale: "Patrimoniale & Wealth Management",
  trust: "Trust",
  "231": "Responsabilità 231/01",
  "recupero-crediti": "Recupero Crediti",
  custodia: "Custodia e Amministrazione Giudiziaria",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { full_name, email, phone, service_type, message, consultation_mode } =
      await req.json();

    // Validate required fields
    if (!full_name || !email || !phone || !service_type || !message || !consultation_mode) {
      return new Response(
        JSON.stringify({ error: "Tutti i campi sono obbligatori" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured — skipping email send");
      return new Response(
        JSON.stringify({ success: false, error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const serviceName = serviceLabels[service_type] || service_type;
    const modeName = modeLabels[consultation_mode] || consultation_mode;

    // 1) Email to the studio
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

    // 2) Confirmation email to the requester
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

    // Send both emails
    const sendEmail = async (to: string[], subject: string, html: string, replyTo?: string) => {
      const body: Record<string, unknown> = {
        from: "Studio Legale Cosentini <noreply@cosentini.it>",
        to,
        subject,
        html,
      };
      if (replyTo) body.reply_to = replyTo;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Resend API error:", JSON.stringify(data));
      }
      return { ok: res.ok, data };
    };

    const [studioResult, confirmResult] = await Promise.all([
      sendEmail(
        [STUDIO_EMAIL],
        `Richiesta consulenza: ${serviceName} — ${full_name}`,
        studioHtml,
        email
      ),
      sendEmail(
        [email],
        `Conferma richiesta di consulenza — Studio Legale Cosentini`,
        confirmHtml,
        STUDIO_EMAIL
      ),
    ]);

    if (!studioResult.ok && !confirmResult.ok) {
      return new Response(
        JSON.stringify({ success: false, error: "Failed to send emails" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
