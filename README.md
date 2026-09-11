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
Pro lokální poštovní server bez autorizace a TLS použijte `SMTP_HOST=localhost`,
`SMTP_PORT=25`, `SMTP_SECURE=false`, `SMTP_AUTH=false` a
`SMTP_IGNORE_TLS=true`. Režim bez TLS aplikace z bezpečnostních důvodů povolí
pouze pro `localhost`, `127.0.0.1` nebo `::1`. U vzdáleného SMTP musí
`SMTP_HOST` odpovídat názvu uvedenému v TLS certifikátu.
Nová poptávka z kalkulačky i kontaktního formuláře se odešle skrytě všem
uživatelům s rolí `ADMIN`; pokud žádný administrátor neexistuje, použije se
kontaktní e-mail z nastavení webu.

## Google reCAPTCHA v3

Kalkulačka i kontaktní formulář jsou chráněné Google reCAPTCHA v3. V Google
reCAPTCHA administraci založte v3 klíč pro produkční domény a nastavte
`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` a serverový `RECAPTCHA_SECRET_KEY`. Volitelně
lze upravit hranici pomocí `RECAPTCHA_MIN_SCORE` (výchozí `0.7`) a povolit
konkrétní domény přes čárkou oddělené `RECAPTCHA_ALLOWED_HOSTNAMES`.

Backend vždy ověřuje úspěch, skóre a správnou akci (`inquiry_calculator` nebo
`inquiry_contact`); při nastaveném seznamu domén kontroluje také hostname.
Bez serverového klíče se formuláře z bezpečnostních důvodů neodešlou.
Ochranu doplňuje skryté honeypot pole, kontrola doby vyplnění a serverový limit
pěti přijatých poptávek z jedné IP adresy během 15 minut.

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
   SMTP, reCAPTCHA klíče a trvalý `UPLOAD_DIR`.
2. Spusťte `npm ci`, `npm run db:deploy` a `npm run build`.
3. Aplikaci spusťte přes `npm start`.
