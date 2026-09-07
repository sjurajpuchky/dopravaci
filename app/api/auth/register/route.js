import bcrypt from "bcryptjs";
import { createSession, hashToken, randomOtp } from "@/lib/server/auth";
import { cleanString, fail, ok, readJson } from "@/lib/server/http";
import { sendVerificationMail } from "@/lib/server/mail";
import { prisma } from "@/lib/server/prisma";
import { serializeUser } from "@/lib/server/serializers";

export async function POST(request) {
  const body = await readJson(request);
  const email = cleanString(body?.email, 191).toLowerCase();
  const password = typeof body?.password === "string" ? body.password : "";
  if (!/^\S+@\S+\.\S+$/.test(email)) return fail("Zadejte platný e-mail");
  if (password.length < 8) return fail("Heslo musí mít alespoň 8 znaků");
  if (await prisma.user.findUnique({ where: { email } })) return fail("Účet s tímto e-mailem již existuje", 409);

  const verificationRequired = process.env.EMAIL_VERIFICATION_REQUIRED === "true";
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 12),
      emailVerified: !verificationRequired,
    },
  });

  if (!verificationRequired) {
    await createSession(user.id);
    return ok({ requiresVerification: false, user: serializeUser(user) }, { status: 201 });
  }

  const code = randomOtp();
  await prisma.authToken.create({
    data: {
      userId: user.id,
      type: "VERIFY_EMAIL",
      tokenHash: hashToken(`${email}:${code}`),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    },
  });
  await sendVerificationMail(email, code);
  return ok({ requiresVerification: true }, { status: 201 });
}
