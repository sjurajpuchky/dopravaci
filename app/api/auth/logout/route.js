import { destroySession } from "@/lib/server/auth";
import { ok } from "@/lib/server/http";

export async function POST() {
  await destroySession();
  return ok({ success: true });
}
