"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/AuthContext";
import { queryClientInstance } from "@/lib/query-client";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";
import CookieBanner from "@/components/CookieBanner";
import { SiteSettingsProvider } from "@/hooks/useSiteSettings";

export default function Providers({ children, initialSettings }) {
  return (
    <SiteSettingsProvider initialSettings={initialSettings}>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <ScrollToTop />
          {children}
          <Toaster />
          <CookieBanner />
        </QueryClientProvider>
      </AuthProvider>
    </SiteSettingsProvider>
  );
}
