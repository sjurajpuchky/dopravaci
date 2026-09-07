import { createSession, hashToken } from "@/lib/server/auth";
import { cleanString, fail, ok, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeUser } from "@/lib/server/serializers";

export async function POST(request) {
  const body = await readJson(request);
  const email = cleanString(body?.email, 191).toLowerCase();
  const code = cleanString(body?.code, 6);
  const tokenHash = hashToken(`${email}:${code}`);
  const token = await prisma.authToken.findFirst({
    where: { tokenHash, type: "VERIFY_EMAIL", expiresAt: { gt: new Date() }, user: { email } },
    include: { user: true },
  });
  if (!token) return fail("Neplatný nebo expirovaný ověřovací kód", 400);

  const user = await prisma.user.update({ where: { id: token.userId }, data: { emailVerified: true } });
  await prisma.authToken.deleteMany({ where: { userId: user.id, type: "VERIFY_EMAIL" } });
  await createSession(user.id);
  return ok({ user: serializeUser(user) });
}
