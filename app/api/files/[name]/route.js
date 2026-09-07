import path from "node:path";
import { readFile } from "node:fs/promises";
import { fail } from "@/lib/server/http";

const CONTENT_TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml", ".mp4": "video/mp4", ".webm": "video/webm" };

export async function GET(_request, { params }) {
  const { name } = await params;
  if (!/^[a-zA-Z0-9._-]+$/.test(name)) return fail("Soubor nebyl nalezen", 404);
  const uploadDir = path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.UPLOAD_DIR || "public/uploads");
  try {
    const data = await readFile(path.join(/* turbopackIgnore: true */ uploadDir, name));
    return new Response(data, { headers: { "Content-Type": CONTENT_TYPES[path.extname(name).toLowerCase()] || "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return fail("Soubor nebyl nalezen", 404);
  }
}
