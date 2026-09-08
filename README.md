# Dopravaci.cz

Web a administrační portál postavený na Next.js App Routeru. Data, přihlášení,
schvalování uživatelů, poptávky, články, nastavení i galerie jsou uloženy v
MySQL přes Prisma ORM.

## Lokální spuštění

Požadavky: Node.js 20+ a MySQL 8+.

```bash
cp .env.example .env
npm install
npm run db:deploy
npm run db:seed
npm run dev
```

Aplikace poběží na `http://localhost:3000`.

## První administrátor

Před `npm run db:seed` vyplňte v `.env` hodnoty `SEED_ADMIN_EMAIL` a
`SEED_ADMIN_PASSWORD`. Heslo musí mít alespoň 12 znaků. Seed je opakovatelný:
existující účet pouze povýší na administrátora a nesmaže žádná data.

## E-mail

SMTP je volitelné. Bez něj funguje web i administrace, ale neodesílají se
notifikace a resetovací e-maily. Pro povinné ověření registrací nastavte
`EMAIL_VERIFICATION_REQUIRED=true` a doplňte všechny `SMTP_*` proměnné.
Nová poptávka z kalkulačky i kontaktního formuláře se odešle skrytě všem
uživatelům s rolí `ADMIN`; pokud žádný administrátor neexistuje, použije se
kontaktní e-mail z nastavení webu.

## Uploady

Administrace ukládá obrázky a videa do `UPLOAD_DIR` a servíruje je přes
`/api/files/:name`. V produkci musí být tento adresář připojený jako trvalý
volume; výchozí hodnota je `public/uploads`.

## Databáze

- Schéma: `prisma/schema.prisma`
- Produkční migrace: `npm run db:deploy`
- Vývojová migrace: `npm run db:migrate`
- Prisma Studio: `npm run db:studio`
- Výchozí obsah a první admin: `npm run db:seed`

## SEO

Canonical URL, Open Graph, sitemap a robots používají `APP_URL`. V produkci
proto nastavte veřejnou HTTPS adresu bez cesty. Volitelné ověřovací kódy pro
Google Search Console a Seznam Webmaster patří do `GOOGLE_SITE_VERIFICATION`
a `SEZNAM_SITE_VERIFICATION`. Sitemap včetně publikovaných článků je dostupná
na `/sitemap.xml`, pravidla crawlerů na `/robots.txt` a metadata webové
aplikace na `/manifest.webmanifest`.

## Google Analytics

Google tag používá GA4 měření nastavené v `GOOGLE_TAG_ID`. Integrace načítá
`gtag.js`, inicializuje `dataLayer` a zaznamenává také klientské přechody mezi
stránkami v Next.js bez dvojího pageview při prvním načtení.

Původní SQL exporty jsou ponechány jako zdroj pro jednorázový převod
produkčních dat. Neimportujte je přímo do nového schématu: mají původní názvy
tabulek a uživatelské účty neobsahují hesla. Účty je nutné založit nebo obnovit
v nové autentizaci a data převést do tabulek definovaných Prismou.

## Kontroly

```bash
npm run lint
npm run typecheck
npm run build
```

## Produkce

1. Nastavte produkční `DATABASE_URL`, `APP_URL`, `SESSION_COOKIE_SECURE=true`,
   SMTP a trvalý `UPLOAD_DIR`.
2. Spusťte `npm ci`, `npm run db:deploy` a `npm run build`.
3. Aplikaci spusťte přes `npm start`.
