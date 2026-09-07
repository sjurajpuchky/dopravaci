import crypto from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/server/prisma";

const COOKIE_NAME = "dopravaci_session";
const SESSION_DAYS = 30;

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

export const randomOtp = () => String(crypto.randomInt(0, 1000000)).padStart(6, "0");

export async function createSession(userId) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.authSession.create({
    data: { tokenHash: hashToken(token), expiresAt, userId },
  });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.SESSION_COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await prisma.authSession.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await prisma.authSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt <= new Date()) {
    if (session) await prisma.authSession.delete({ where: { id: session.id } });
    cookieStore.delete(COOKIE_NAME);
    return null;
  }
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) return { error: "Přihlášení je vyžadováno", status: 401 };
  return { user };
}

export async function requireApprovedUser() {
  const result = await requireUser();
  if (result.error) return result;
  if (result.user.role !== "ADMIN" && result.user.approvalStatus !== "APPROVED") {
    return { error: "Účet ještě není schválen", status: 403 };
  }
  return result;
}

export async function requireAdmin() {
  const result = await requireUser();
  if (result.error) return result;
  if (result.user.role !== "ADMIN") return { error: "Přístup pouze pro administrátora", status: 403 };
  return result;
}
