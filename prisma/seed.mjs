import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const gallery = [
  ["https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000024-6ae996ae9b/IMG_0233.jpeg?ph=9b5be8ccee", "Montáž nábytku po rozvozu", "MONTÁŽ"],
  ["https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000026-7bfdb7bfdd/IMG_0232.jpeg?ph=9b5be8ccee", "Demontáž a odvoz starého nábytku", "DEMONTÁŽ"],
  ["https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000028-7a1f07a1f2/IMG_0468.jpeg?ph=9b5be8ccee", "Přeprava palet a objemného zboží", "PALETY"],
  ["https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000034-8f48a8f48c/IMG_2972.jpeg?ph=9b5be8ccee", "Těžký bojler 400 kg", "BOJLER"],
  ["https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000030-e3335e3336/IMG_0835.jpeg?ph=9b5be8ccee", "Drobné zámečnické práce", "ZÁMEČNICTVÍ"],
  ["https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000010-5795457957/dodavka%20%201-5.jpeg?ph=9b5be8ccee", "Rozvoz dodávkou po Praze", "ROZVOZ"],
];

async function main() {
  if (!(await prisma.siteSettings.findFirst())) {
    await prisma.siteSettings.create({
      data: {
        brandName: "DOPRAVACI", brandSuffix: ".CZ", brandTagline: "Nadrozměrná přeprava",
        phone: "+420 732 530 802", phoneHref: "tel:+420732530802", email: "info@dopravaci.cz",
        address: "Jiránkova 1137/1, Praha-Řepy 163 00", ic: "76651282", ownerName: "Milan Rousek",
        heroEyebrow: "Česká republika · Evropa",
        heroTitle: "Přeprava, která přesahuje běžné rozměry.",
        heroParagraph: "Specializovaná doprava nestandardních, nadrozměrných a velkotonážních nákladů. Od lopatek větrných elektráren přes potrubní díly až po těžké technologické celky.",
        heroImageUrl: "/images/oversize-transport-hero.webp",
        heroCtaPrimary: "Konzultovat přepravu", heroCtaSecondary: "Napsat e-mail",
        stat1Value: "400 kg", stat1Label: "nejtěžší předmět", stat2Value: "17 m³", stat2Label: "objem dodávky",
        stat3Value: "8 palet", stat3Label: "kapacita", stat4Value: "100%", stat4Label: "včas",
        aboutEyebrow: "// 01 — O nás", aboutTitle: "Co je pro ostatní těžké, je pro nás rutina.",
        mapLat: 50.0765, mapLng: 14.298,
        gallery: gallery.map(([src, alt, tag]) => ({ src, alt, tag })),
        homepageContent: {
          navigation: { services: "Služby", process: "Jak pracujeme", contact: "Kontakt" },
          highlights: [
            { title: "Trasa na míru", text: "Plánování každého průjezdu" },
            { title: "Bezpečný průběh", text: "Koordinace celé realizace" },
            { title: "Průmyslové náklady", text: "Dlouhé, těžké i atypické" },
          ],
          services: {
            eyebrow: "Naše specializace",
            title: "Když běžná doprava nestačí.",
            intro: "Každou zakázku posuzujeme samostatně. Navrhneme vhodný způsob přepravy, prověříme kritická místa a sladíme techniku, trasu i asistenci.",
            items: [
              { title: "Lopatky větrných elektráren", text: "Přeprava mimořádně dlouhých komponent s důrazem na plánování trasy, průjezdnost a přesnou koordinaci." },
              { title: "Roury a potrubní díly", text: "Doprava dlouhých rour, trubek, potrubních celků a dalších rozměrných dílů pro průmysl a energetiku." },
              { title: "Velkotonážní náklady", text: "Individuální řešení pro těžké stroje, technologické celky a náklady, které vyžadují speciální techniku." },
              { title: "Asistovaná přeprava", text: "Doprovod, koordinace průjezdu a součinnost při realizaci náročných přeprav od nakládky až po předání." },
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
          contact: { eyebrow: "Kontakt", title: "Máte nestandardní náklad? Proberme trasu.", directLabel: "Přímý kontakt" },
          footer: { text: "Nadrozměrná a velkotonážní přeprava" },
        },
      },
    });
  }

  if ((await prisma.galleryItem.count()) === 0) {
    await prisma.galleryItem.createMany({ data: gallery.map(([src, alt, tag], index) => ({ src, alt, tag, sortOrder: index + 1 })) });
  }



  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  await prisma.user.upsert({
      where: { email },
      update: { role: "ADMIN", approvalStatus: "APPROVED", emailVerified: true },
      create: { email, passwordHash: await bcrypt.hash(password, 12), role: "ADMIN", approvalStatus: "APPROVED", emailVerified: true },
  });

}

main().finally(() => prisma.$disconnect());
