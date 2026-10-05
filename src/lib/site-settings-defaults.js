export const DEFAULT_HOMEPAGE_CONTENT = {
  navigation: {
    services: "Služby",
    process: "Jak pracujeme",
    contact: "Kontakt",
  },
  highlights: [
    { title: "Trasa na míru", text: "Plánování každého průjezdu" },
    { title: "Bezpečný průběh", text: "Koordinace celé realizace" },
    { title: "Průmyslové náklady", text: "Dlouhé, těžké i atypické" },
  ],
  services: {
    eyebrow: "Naše specializace",
    title: "Když běžná doprava nestačí.",
    intro:
      "Každou zakázku posuzujeme samostatně. Navrhneme vhodný způsob přepravy, prověříme kritická místa a sladíme techniku, trasu i asistenci.",
    items: [
      {
        title: "Lopatky větrných elektráren",
        text: "Přeprava mimořádně dlouhých komponent s důrazem na plánování trasy, průjezdnost a přesnou koordinaci.",
      },
      {
        title: "Roury a potrubní díly",
        text: "Doprava dlouhých rour, trubek, potrubních celků a dalších rozměrných dílů pro průmysl a energetiku.",
      },
      {
        title: "Velkotonážní náklady",
        text: "Individuální řešení pro těžké stroje, technologické celky a náklady, které vyžadují speciální techniku.",
      },
      {
        title: "Asistovaná přeprava",
        text: "Doprovod, koordinace průjezdu a součinnost při realizaci náročných přeprav od nakládky až po předání.",
      },
    ],
  },
  process: {
    eyebrow: "Od zadání po předání",
    title: "Připraveno do posledního kilometru.",
    steps: [
      { title: "Posouzení nákladu", text: "Rozměry, hmotnost, těžiště, nakládka, vykládka a požadovaný termín." },
      { title: "Návrh trasy", text: "Prověření průjezdnosti, omezení, manipulačních míst a potřebné asistence." },
      { title: "Koordinovaná realizace", text: "Přeprava s průběžnou komunikací a dohledem nad bezpečným průběhem zakázky." },
    ],
  },
  contact: {
    eyebrow: "Kontakt",
    title: "Máte nestandardní náklad? Proberme trasu.",
    directLabel: "Přímý kontakt",
  },
  recommendation: {
    eyebrow: "Stěhování domácností a firem",
    title: "Hledáte spolehlivé stěhování?",
    text: "Pro stěhování bytů, rodinných domů, kanceláří a firem doporučujeme specializovaný tým Stehuj.eu.",
    cta: "Navštívit Stehuj.eu",
    url: "https://www.stehuj.eu",
  },
  footer: {
    text: "Nadrozměrná a velkotonážní přeprava",
  },
};

export function mergeHomepageContent(value) {
  const content = value && typeof value === "object" ? value : {};
  return {
    navigation: { ...DEFAULT_HOMEPAGE_CONTENT.navigation, ...(content.navigation || {}) },
    highlights: Array.isArray(content.highlights) ? content.highlights : DEFAULT_HOMEPAGE_CONTENT.highlights,
    services: {
      ...DEFAULT_HOMEPAGE_CONTENT.services,
      ...(content.services || {}),
      items: Array.isArray(content.services?.items) ? content.services.items : DEFAULT_HOMEPAGE_CONTENT.services.items,
    },
    process: {
      ...DEFAULT_HOMEPAGE_CONTENT.process,
      ...(content.process || {}),
      steps: Array.isArray(content.process?.steps) ? content.process.steps : DEFAULT_HOMEPAGE_CONTENT.process.steps,
    },
    contact: { ...DEFAULT_HOMEPAGE_CONTENT.contact, ...(content.contact || {}) },
    recommendation: { ...DEFAULT_HOMEPAGE_CONTENT.recommendation, ...(content.recommendation || {}) },
    footer: { ...DEFAULT_HOMEPAGE_CONTENT.footer, ...(content.footer || {}) },
  };
}

export const DEFAULT_SETTINGS = {
  logo_url: "",
  brand_name: "DOPRAVACI",
  brand_suffix: ".CZ",
  brand_tagline: "Nadrozměrná přeprava",
  phone: "+420 732 530 802",
  phone_href: "tel:+420732530802",
  email: "info@dopravaci.cz",
  address: "Jiránkova 1137/1, Praha-Řepy 163 00",
  ic: "76651282",
  owner_name: "Milan Rousek",
  hero_eyebrow: "Česká republika · Evropa",
  hero_title: "Přeprava, která přesahuje běžné rozměry.",
  hero_paragraph:
    "Specializovaná doprava nestandardních, nadrozměrných a velkotonážních nákladů. Od lopatek větrných elektráren přes potrubní díly až po těžké technologické celky.",
  hero_image_url: "/images/oversize-transport-hero.webp",
  hero_cta_primary: "Konzultovat přepravu",
  hero_cta_secondary: "Napsat e-mail",
  homepage_content: DEFAULT_HOMEPAGE_CONTENT,
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
