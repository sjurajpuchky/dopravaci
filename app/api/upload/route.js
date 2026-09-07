import crypto from "node:crypto";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { requireAdmin } from "@/lib/server/auth";
import { fail, ok } from "@/lib/server/http";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"]);
const EXTENSIONS = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "video/mp4": ".mp4", "video/webm": ".webm" };

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return fail(auth.error, auth.status);
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return fail("Soubor nebyl předán");
  if (!ALLOWED.has(file.type)) return fail("Nepodporovaný typ souboru");
  if (file.size > 50 * 1024 * 1024) return fail("Soubor je větší než 50 MB");

  const fileName = `${Date.now()}-${crypto.randomBytes(12).toString("hex")}${EXTENSIONS[file.type]}`;
  const uploadDir = path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.UPLOAD_DIR || "public/uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), Buffer.from(await file.arrayBuffer()), { flag: "wx" });
  return ok({ file_url: `/api/files/${fileName}` }, { status: 201 });
}
