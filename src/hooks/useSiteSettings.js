"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/api/client";
import { DEFAULT_SETTINGS } from "@/lib/site-settings-defaults";

export { DEFAULT_SETTINGS } from "@/lib/site-settings-defaults";

let cache = null;

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ initialSettings, children }) {
  const settings = useMemo(
    () => (initialSettings ? { ...DEFAULT_SETTINGS, ...initialSettings } : null),
    [initialSettings]
  );

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const serverSettings = useContext(SiteSettingsContext);
  const [settings, setSettings] = useState(cache || DEFAULT_SETTINGS);

  useEffect(() => {
    if (serverSettings || cache) return;
    let active = true;
    api.settings
      .public()
      .then((row) => {
        if (active && row) {
          cache = { ...DEFAULT_SETTINGS, ...row };
          setSettings(cache);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [serverSettings]);

  return serverSettings || settings;
}
