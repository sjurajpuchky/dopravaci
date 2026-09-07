import { requireAdmin } from "@/lib/server/auth";
import { fail, ok, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeUser } from "@/lib/server/serializers";

const APPROVALS = { pending: "PENDING", approved: "APPROVED", rejected: "REJECTED" };

export async function PATCH(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return fail(auth.error, auth.status);
  const { id } = await params;
  const body = await readJson(request);
  if (!(body?.approval_status in APPROVALS)) return fail("Neplatný stav schválení");
  if (id === auth.user.id) return fail("Nelze změnit schválení vlastního administrátorského účtu");
  try {
    const user = await prisma.user.update({ where: { id }, data: { approvalStatus: APPROVALS[body.approval_status] } });
    return ok(serializeUser(user));
  } catch {
    return fail("Uživatel nebyl nalezen", 404);
  }
}
