import bcrypt from "bcryptjs";
import { hashToken } from "@/lib/server/auth";
import { cleanString, fail, ok, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";

export async function POST(request) {
  const body = await readJson(request);
  const tokenValue = cleanString(body?.token, 128);
  const password = typeof body?.password === "string" ? body.password : "";
  if (password.length < 8) return fail("Heslo musí mít alespoň 8 znaků");
  const token = await prisma.authToken.findFirst({ where: { tokenHash: hashToken(tokenValue), type: "RESET_PASSWORD", expiresAt: { gt: new Date() } } });
  if (!token) return fail("Neplatný nebo expirovaný odkaz", 400);

  await prisma.$transaction([
    prisma.user.update({ where: { id: token.userId }, data: { passwordHash: await bcrypt.hash(password, 12) } }),
    prisma.authToken.deleteMany({ where: { userId: token.userId, type: "RESET_PASSWORD" } }),
    prisma.authSession.deleteMany({ where: { userId: token.userId } }),
  ]);
  return ok({ success: true });
}
