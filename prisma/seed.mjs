import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { articles } from "./seed-data/articles.mjs";

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
        brandName: "DOPRAVACI", brandSuffix: ".CZ", brandTagline: "Dopravní společnost",
        phone: "+420 732 530 802", phoneHref: "tel:+420732530802", email: "ivekodopravci@seznam.cz",
        address: "Jiránkova 1137/1, Praha-Řepy 163 00", ic: "76651282", ownerName: "Milan Rousek",
        heroEyebrow: "// Doprava & přeprava nestandardních předmětů",
        heroTitle: "Dopravíme vše, co je pro ostatní těžké.",
        heroParagraph: "Rozvoz sedaček, skříní a objemného zboží. Přeprava těžkých a nestandardních předmětů — bojler 400 kg? Žádný problém.",
        heroCtaPrimary: "Spočítat cenu přepravy", heroCtaSecondary: "Zavolat Milanovi",
        stat1Value: "400 kg", stat1Label: "nejtěžší předmět", stat2Value: "17 m³", stat2Label: "objem dodávky",
        stat3Value: "8 palet", stat3Label: "kapacita", stat4Value: "100%", stat4Label: "včas",
        aboutEyebrow: "// 01 — O nás", aboutTitle: "Co je pro ostatní těžké, je pro nás rutina.",
        mapLat: 50.0765, mapLng: 14.298,
        gallery: gallery.map(([src, alt, tag]) => ({ src, alt, tag })),
      },
    });
  }

  if ((await prisma.galleryItem.count()) === 0) {
    await prisma.galleryItem.createMany({ data: gallery.map(([src, alt, tag], index) => ({ src, alt, tag, sortOrder: index + 1 })) });
  }

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 12) throw new Error("SEED_ADMIN_PASSWORD musí mít alespoň 12 znaků");
    await prisma.user.upsert({
      where: { email },
      update: { role: "ADMIN", approvalStatus: "APPROVED", emailVerified: true },
      create: { email, passwordHash: await bcrypt.hash(password, 12), role: "ADMIN", approvalStatus: "APPROVED", emailVerified: true },
    });
  }
}

main().finally(() => prisma.$disconnect());
