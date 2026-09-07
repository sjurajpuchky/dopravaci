import bcrypt from "bcryptjs";
import { createSession } from "@/lib/server/auth";
import { cleanString, fail, ok, readJson } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";
import { serializeUser } from "@/lib/server/serializers";

export async function POST(request) {
  const body = await readJson(request);
  const email = cleanString(body?.email, 191).toLowerCase();
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) return fail("Vyplňte e-mail a heslo");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return fail("Neplatný e-mail nebo heslo", 401);
  }
  if (!user.emailVerified) return fail("Nejdříve ověřte svůj e-mail", 403);

  await createSession(user.id);
  return ok({ user: serializeUser(user) });
}
