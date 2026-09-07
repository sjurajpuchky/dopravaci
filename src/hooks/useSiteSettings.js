import { useEffect, useState } from "react";
import { api } from "@/api/client";

export const DEFAULT_SETTINGS = {
  logo_url: "",
  brand_name: "DOPRAVACI",
  brand_suffix: ".CZ",
  brand_tagline: "Dopravní společnost",
  phone: "+420 732 530 802",
  phone_href: "tel:+420732530802",
  email: "ivekodopravci@seznam.cz",
  address: "Jiránkova 1137/1, Praha-Řepy 163 00",
  ic: "76651282",
  owner_name: "Milan Rousek",
  hero_eyebrow: "// Doprava & přeprava nestandardních předmětů",
  hero_title: "Dopravíme vše, co je pro ostatní těžké.",
  hero_paragraph:
    "Rozvoz sedaček, skříní a objemného zboží. Přeprava těžkých a nestandardních předmětů — bojler 400 kg? Žádný problém. Vyzvedneme a dovezeme napříč Prahou a okolím.",
  hero_image_url:
    "https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000000-bb95ebb960/1.jpeg?ph=9b5be8ccee",
  hero_cta_primary: "Spočítat cenu přepravy",
  hero_cta_secondary: "Zavolat Milanovi",
  stat1_value: "400 kg",
  stat1_label: "nejtěžší předmět",
  stat2_value: "17 m³",
  stat2_label: "objem dodávky",
  stat3_value: "8 palet",
  stat3_label: "kapacita",
  stat4_value: "100%",
  stat4_label: "včas",
  about_eyebrow: "// 01 — O nás",
  about_title: "Co je pro ostatní těžké, je pro nás rutina.",
  about_paragraph_1:
    "Dopravaci.cz je pražská dopravní společnost Milana Rouska zaměřená na rozvoz nábytku a přepravu nestandardních předmětů. Vozíme sedačky, skříně, těžké bojlery i celé palety zboží po Praze, Řepích a okolí.",
  about_paragraph_2:
    "Přepravujeme s ohledem na každý kus — od první palety po poslední krabici. Montáž, demontáž i odvoz starého nábytku zařídíme v jednom turnusu.",
  about_image_url:
    "https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000034-8f48a8f48c/IMG_2972.jpeg?ph=9b5be8ccee",
  map_lat: 50.0765,
  map_lng: 14.298,
  gallery: [
    { src: "https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000024-6ae996ae9b/IMG_0233.jpeg?ph=9b5be8ccee", alt: "Montáž nábytku po rozvozu", tag: "MONTÁŽ" },
    { src: "https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000026-7bfdb7bfdd/IMG_0232.jpeg?ph=9b5be8ccee", alt: "Demontáž a odvoz starého nábytku", tag: "DEMONTÁŽ" },
    { src: "https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000028-7a1f07a1f2/IMG_0468.jpeg?ph=9b5be8ccee", alt: "Přeprava palet a objemného zboží", tag: "PALETY" },
    { src: "https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000034-8f48a8f48c/IMG_2972.jpeg?ph=9b5be8ccee", alt: "Těžký bojler 400 kg", tag: "BOJLER" },
    { src: "https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000030-e3335e3336/IMG_0835.jpeg?ph=9b5be8ccee", alt: "Drobné zámečnické práce", tag: "ZÁMEČNICTVÍ" },
    { src: "https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000010-5795457957/dodavka%20%201-5.jpeg?ph=9b5be8ccee", alt: "Rozvoz dodávkou po Praze", tag: "ROZVOZ" },
  ],
};

let cache = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState(cache || DEFAULT_SETTINGS);

  useEffect(() => {
    if (cache) return;
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
  }, []);

  return settings;
}
