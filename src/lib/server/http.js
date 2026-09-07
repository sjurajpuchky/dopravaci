import { NextResponse } from "next/server";

export function ok(data, init) {
  return NextResponse.json(data, init);
}

export function fail(message, status = 400, details) {
  return NextResponse.json({ error: message, details }, { status });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function cleanString(value, maxLength = 10000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function nullableString(value, maxLength = 10000) {
  const text = cleanString(value, maxLength);
  return text || null;
}
