# AGENTS.md

## Projekt

Next.js 16 aplikace s App Routerem, Prisma ORM a MySQL. Původní externí
backend byl odstraněn; nové funkce musí používat vlastní route handlers v
`app/api` a modely v `prisma/schema.prisma`.

## Důležité cesty

- `app/` — stránky a REST API route handlers
- `src/screens/` — obrazovky používané App Routerem
- `src/components/` — UI a sekce webu
- `src/api/client.js` — klient vlastního API
- `src/lib/server/` — Prisma, autentizace, serializace a e-mail
- `prisma/` — schéma, migrace a seed

## Pravidla

- Do klienta neposílat Prisma modely přímo; zachovat serializaci v
  `src/lib/server/serializers.js`.
- Administrační zápisy chránit `requireAdmin()`, portál dopravce
  `requireApprovedUser()`.
- Uploady ukládat pouze přes `/api/upload`, kontrolovat MIME a velikost.
- Nikdy necommitovat `.env`, hesla ani SMTP údaje.
- Po změně databázového modelu vytvořit novou Prisma migraci.

## Kontroly

Před dokončením spusťte `npm run lint`, `npm run typecheck` a `npm run build`.
