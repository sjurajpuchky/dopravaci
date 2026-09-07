import nodemailer from "nodemailer";

function transport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });
}

export async function sendMail(message) {
  const client = transport();
  if (!client) {
    if (process.env.NODE_ENV !== "production") console.info("SMTP není nastaveno; e-mail nebyl odeslán.");
    return false;
  }
  await client.sendMail({ from: process.env.MAIL_FROM, ...message });
  return true;
}

export async function sendVerificationMail(email, code) {
  return sendMail({
    to: email,
    subject: "Ověření registrace Dopravaci.cz",
    text: `Váš ověřovací kód je ${code}. Platí 30 minut.`,
  });
}

export async function sendResetMail(email, token) {
  const baseUrl = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
  const url = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  return sendMail({
    to: email,
    subject: "Obnova hesla Dopravaci.cz",
    text: `Nové heslo nastavíte na ${url}. Odkaz platí jednu hodinu.`,
  });
}

export async function sendInquiryMail(email, inquiry) {
  if (!email) return false;
  return sendMail({
    to: email,
    subject: `Nová poptávka — ${inquiry.name}`,
    text: [
      `Jméno: ${inquiry.name}`,
      `Telefon: ${inquiry.phone}`,
      inquiry.email ? `E-mail: ${inquiry.email}` : null,
      inquiry.fromCity || inquiry.toCity ? `Trasa: ${inquiry.fromCity || "—"} → ${inquiry.toCity || "—"}` : null,
      inquiry.cargo ? `Náklad: ${inquiry.cargo}` : null,
      inquiry.note ? `Poznámka: ${inquiry.note}` : null,
    ].filter(Boolean).join("\n"),
  });
}
