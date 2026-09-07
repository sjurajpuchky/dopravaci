"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PageNotFound() {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-sand text-brown">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-7xl font-light text-brown-soft">404</h1>
        <div className="h-0.5 w-16 bg-terracotta mx-auto" />
        <h2 className="text-2xl font-display font-bold">Stránka nebyla nalezena</h2>
        <p className="text-brown-soft">Adresa „{pathname}“ v aplikaci neexistuje.</p>
        <Link href="/" className="btn-warm inline-flex">Zpět na úvod</Link>
      </div>
    </div>
  );
}
