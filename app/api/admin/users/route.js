import { requireAdmin } from "@/lib/server/auth";
import { fail, ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeUser } from "@/lib/server/serializers";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return fail(auth.error, auth.status);
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return ok(users.map(serializeUser));
}
