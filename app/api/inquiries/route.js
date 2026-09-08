import { getCurrentUser, requireApprovedUser } from "@/lib/server/auth";
import { cleanString, fail, ok, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeInquiry } from "@/lib/server/serializers";
import { sendInquiryMail } from "@/lib/server/mail";

const INQUIRY_SOURCES = new Set(["calculator", "contact"]);

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
  const source = INQUIRY_SOURCES.has(body?.source) ? body.source : "web";
  if (!name || !phone) return fail("Jméno a telefon jsou povinné");
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
