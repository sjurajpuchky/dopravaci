import { requireAdmin } from "@/lib/server/auth";
import { cleanString, fail, ok, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeInquiry } from "@/lib/server/serializers";

const STATUSES = { new: "NEW", taken: "TAKEN", completed: "COMPLETED" };

export async function PATCH(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return fail(auth.error, auth.status);
  const { id } = await params;
  const body = await readJson(request);
  const data = {};
  if (body?.status in STATUSES) data.status = STATUSES[body.status];
  if ("taken_by_id" in (body || {})) data.takenById = cleanString(body.taken_by_id, 191) || null;
  if ("commission" in (body || {})) data.commission = Number.isFinite(Number(body.commission)) ? Number(body.commission) : null;
  if (!Object.keys(data).length) return fail("Nebyly předány žádné podporované změny");
  try {
    const inquiry = await prisma.inquiry.update({ where: { id }, data, include: { takenBy: true } });
    return ok(serializeInquiry(inquiry));
  } catch {
    return fail("Poptávka nebyla nalezena", 404);
  }
}

export async function DELETE(_request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return fail(auth.error, auth.status);
  const { id } = await params;
  await prisma.inquiry.deleteMany({ where: { id } });
  return ok({ success: true });
}
