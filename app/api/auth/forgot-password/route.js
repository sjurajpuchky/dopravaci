import { hashToken, randomToken } from "@/lib/server/auth";
import { cleanString, ok, readJson } from "@/lib/server/http";
import { sendResetMail } from "@/lib/server/mail";
import { prisma } from "@/lib/server/prisma";

export async function POST(request) {
  const body = await readJson(request);
  const email = cleanString(body?.email, 191).toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = randomToken();
    await prisma.authToken.deleteMany({ where: { userId: user.id, type: "RESET_PASSWORD" } });
    await prisma.authToken.create({ data: { userId: user.id, type: "RESET_PASSWORD", tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 60 * 60 * 1000) } });
    await sendResetMail(email, token);
  }
  return ok({ success: true });
}
