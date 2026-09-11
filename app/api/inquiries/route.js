import { getCurrentUser, requireApprovedUser } from "@/lib/server/auth";
import { cleanString, fail, ok, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeInquiry } from "@/lib/server/serializers";
import { sendInquiryMail } from "@/lib/server/mail";
import { consumeInquiryRateLimit, inspectInquirySubmission } from "@/lib/server/inquiry-abuse";
import { verifyRecaptcha } from "@/lib/server/recaptcha";

const INQUIRY_SOURCES = new Set(["calculator", "contact"]);
const CAPTCHA_ACTIONS = {
  calculator: "inquiry_calculator",
  contact: "inquiry_contact",
};

async function notifyAdmins(inquiry, source) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { email: true },
    });
    let recipients = admins.map((admin) => admin.email);

    if (recipients.length === 0) {
      const settings = await prisma.siteSettings.findFirst({
        orderBy: { updatedAt: "desc" },
        select: { email: true },
      });
      recipients = [settings?.email];
    }

    await sendInquiryMail(recipients, inquiry, source);
  } catch (error) {
    console.error("Odeslání poptávky administrátorům selhalo", error);
  }
}

export async function POST(request) {
  const body = await readJson(request);
  const name = cleanString(body?.name, 191);
  const phone = cleanString(body?.phone, 64);
  const source = cleanString(body?.source, 32);
  if (!name || !phone) return fail("Jméno a telefon jsou povinné");
  if (!INQUIRY_SOURCES.has(source)) return fail("Neplatný zdroj poptávky");

  const submission = inspectInquirySubmission(body);
  if (!submission.ok) {
    if (submission.silent) return ok({ accepted: true }, { status: 201 });
    return fail("Formulář vypršel. Obnovte stránku a zkuste to znovu.", 400);
  }

  const captcha = await verifyRecaptcha(
    cleanString(body?.captcha_token, 4096),
    CAPTCHA_ACTIONS[source],
  );
  if (!captcha.ok) {
    if (captcha.reason === "not-configured") {
      console.error("Google reCAPTCHA v3 není nakonfigurovaná");
      return fail("Odeslání formuláře není momentálně dostupné", 503);
    }
    console.warn("Google reCAPTCHA v3 odmítla poptávku", {
      source,
      reason: captcha.reason,
      score: captcha.score,
    });
    return fail("Ověření proti spamu se nezdařilo. Zkuste to prosím znovu.", 400);
  }

  const rateLimit = consumeInquiryRateLimit(request);
  if (!rateLimit.ok) {
    return fail("Odeslali jste příliš mnoho poptávek. Zkuste to prosím později.", 429, {
      retry_after_seconds: rateLimit.retryAfterSeconds,
    });
  }

  const user = await getCurrentUser();
  const inquiry = await prisma.inquiry.create({
    data: {
      name,
      phone,
      email: cleanString(body?.email, 191) || null,
      fromCity: cleanString(body?.from_city, 191) || null,
      toCity: cleanString(body?.to_city, 191) || null,
      distanceKm: Number.isFinite(Number(body?.distance_km)) ? Number(body.distance_km) : null,
      volume: Number.isFinite(Number(body?.volume)) ? Number(body.volume) : null,
      floors: Number.isInteger(Number(body?.floors)) ? Number(body.floors) : null,
      heavyItems: Boolean(body?.heavy_items),
      cargo: cleanString(body?.cargo, 10000) || null,
      note: cleanString(body?.note, 10000) || null,
      createdById: user?.id || null,
    },
    include: { takenBy: true },
  });
  await notifyAdmins(inquiry, source);
  return ok(serializeInquiry(inquiry), { status: 201 });
}

export async function GET() {
  const auth = await requireApprovedUser();
  if (auth.error) return fail(auth.error, auth.status);
  const where = auth.user.role === "ADMIN" ? {} : { takenById: auth.user.id };
  const inquiries = await prisma.inquiry.findMany({ where, include: { takenBy: true }, orderBy: { createdAt: "desc" }, take: 200 });
  return ok(inquiries.map(serializeInquiry));
}
