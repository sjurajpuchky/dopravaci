import { hashToken, randomOtp } from "@/lib/server/auth";
import { cleanString, ok, readJson } from "@/lib/server/http";
import { sendVerificationMail } from "@/lib/server/mail";
import { prisma } from "@/lib/server/prisma";

export async function POST(request) {
  const body = await readJson(request);
  const email = cleanString(body?.email, 191).toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && !user.emailVerified) {
    const code = randomOtp();
    await prisma.authToken.deleteMany({ where: { userId: user.id, type: "VERIFY_EMAIL" } });
    await prisma.authToken.create({ data: { userId: user.id, type: "VERIFY_EMAIL", tokenHash: hashToken(`${email}:${code}`), expiresAt: new Date(Date.now() + 30 * 60 * 1000) } });
    await sendVerificationMail(email, code);
  }
  return ok({ success: true });
}
