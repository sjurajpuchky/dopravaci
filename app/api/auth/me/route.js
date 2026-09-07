import { getCurrentUser } from "@/lib/server/auth";
import { ok } from "@/lib/server/http";
import { serializeUser } from "@/lib/server/serializers";

export async function GET() {
  return ok({ user: serializeUser(await getCurrentUser()) });
}
