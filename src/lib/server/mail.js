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

function uniqueRecipients(recipients) {
  const values = Array.isArray(recipients) ? recipients : [recipients];
  const unique = new Map();

  for (const value of values) {
    if (typeof value !== "string") continue;
    const email = value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) continue;
    unique.set(email.toLowerCase(), email);
  }

  return [...unique.values()];
}

export async function sendInquiryMail(recipients, inquiry, source = "web") {
  const emails = uniqueRecipients(recipients);
  if (emails.length === 0) return false;

  const sourceLabels = {
    calculator: "kalkulačky",
    contact: "kontaktního formuláře",
    web: "webu",
  };
  const sourceLabel = sourceLabels[source] || sourceLabels.web;
  const adminUrl = `${(process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "")}/admin`;

  return sendMail({
    bcc: emails,
    subject: `Nová poptávka z ${sourceLabel} — ${inquiry.name}`,
    text: [
      `Zdroj: ${sourceLabel}`,
      `Jméno: ${inquiry.name}`,
      `Telefon: ${inquiry.phone}`,
      inquiry.email ? `E-mail: ${inquiry.email}` : null,
      inquiry.fromCity || inquiry.toCity ? `Trasa: ${inquiry.fromCity || "—"} → ${inquiry.toCity || "—"}` : null,
      Number.isFinite(inquiry.distanceKm) ? `Vzdálenost: ${inquiry.distanceKm} km` : null,
      Number.isFinite(inquiry.volume) ? `Objem: ${inquiry.volume} m³` : null,
      Number.isInteger(inquiry.floors) ? `Patra celkem: ${inquiry.floors}` : null,
      inquiry.heavyItems ? "Obsahuje těžké předměty: ano" : null,
      inquiry.cargo ? `Náklad: ${inquiry.cargo}` : null,
      inquiry.note ? `Poznámka: ${inquiry.note}` : null,
      "",
      `Poptávku otevřete v administraci: ${adminUrl}`,
    ].filter(Boolean).join("\n"),
  });
}
