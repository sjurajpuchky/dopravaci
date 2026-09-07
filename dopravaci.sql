-- Dopravci.cz — SQL export
-- Vygenerováno: 2026-09-06T08:34:51.860Z

-- ============================================================
-- Poptavka
-- ============================================================
DROP TABLE IF EXISTS `Poptavka`;
CREATE TABLE `Poptavka` (
  `id` TEXT,
  `created_date` TEXT,
  `updated_date` TEXT,
  `created_by_id` TEXT,
  `name` TEXT,
  `phone` TEXT,
  `email` TEXT,
  `from_city` TEXT,
  `to_city` TEXT,
  `distance_km` TEXT,
  `volume` TEXT,
  `floors` TEXT,
  `heavy_items` TEXT,
  `cargo` TEXT,
  `note` TEXT,
  `status` TEXT,
  `taken_by_id` TEXT,
  `taken_by_name` TEXT,
  `commission` TEXT
);

INSERT INTO `Poptavka` (`id`, `created_date`, `updated_date`, `created_by_id`, `name`, `phone`, `email`, `from_city`, `to_city`, `distance_km`, `volume`, `floors`, `heavy_items`, `cargo`, `note`, `status`, `taken_by_id`, `taken_by_name`, `commission`) VALUES
  ('6a9b2a3ed9a2df2221c7a780', '2026-09-04T20:29:50.409000', '2026-09-04T20:31:51.067000', 'service_ef6388bb-4e81-4186-811f-7089e2f29fa7', 'Juraj Puchký', '+420 704 327 509', 'sjurajpuchky@seznam.cz', 'Nedbalova 2330/12, Ostrava', 'U Trojice 4, Praha', 116, 0, 6, 0, 'Byt · Křeslo ×1, Pracovní stůl / PS ×1, Komoda / příborník ×1, Vestavěná skříň ×1, Postel / matrace ×1, Šatní skříň ×1', 'montáž/demontáž · vyklizení', 'taken', '6a90a341d11e4912a5c6b85f', 'juraj.puchky@gmail.com', 500),
  ('6a9b28366930f723d52e7dba', '2026-09-04T20:21:10.397000', '2026-09-04T20:21:10.397000', 'service_ef6388bb-4e81-4186-811f-7089e2f29fa7', 'Test Kalkulace', '+420 123 456 789', 'test@example.com', 'Praha', 'Brno', 200, 0, 3, 1, 'Byt · Obývací pokoj ×1, Piano ×1', 'montáž/demontáž · vyklizení', 'new', NULL, NULL, NULL);



-- ============================================================
-- Clanek
-- ============================================================
DROP TABLE IF EXISTS `Clanek`;
CREATE TABLE `Clanek` (
  `id` TEXT,
  `created_date` TEXT,
  `updated_date` TEXT,
  `created_by_id` TEXT,
  `title` TEXT,
  `slug` TEXT,
  `excerpt` TEXT,
  `content` TEXT,
  `image_url` TEXT,
  `gallery` TEXT,
  `videos` TEXT,
  `tag` TEXT,
  `meta` TEXT,
  `published` TEXT,
  `author_name` TEXT
);

INSERT INTO `Clanek` (`id`, `created_date`, `updated_date`, `created_by_id`, `title`, `slug`, `excerpt`, `content`, `image_url`, `gallery`, `videos`, `tag`, `meta`, `published`, `author_name`) VALUES
  ('6a96a9d40e202788c5a0bc51', '2026-09-01T10:32:52.482000', '2026-09-01T10:32:52.482000', '6a909a966bc48d91a31aad9e', 'Přeprava těžkých a nestandardních předmětů — co je potřeba vědět', 'preprava-tezkych-predmetu', 'Bojler 400 kg, piano nebo prádelnická linka. Jak bezpečně přepravit to, co se do běžného auta nevejde.', '<h2>Těžké předměty nejsou problém</h2><p>Bojler o váze 400 kilogramů. Piano. Stará prádelnická linka. To vše jsme už přepravili. Těžké a nestandardní předměty vyžadují jiný přístup než běžný nábytek.</p><h3>Odhad hmotnosti a rozměrů</h3><p>Předem si rozmyslete, kolik váží a jaké má rozměry. To určuje, zda postačí dodávka, nebo je potřeba speciální technika. My poradíme hned při první komunikaci.</p><h3>Přístup k místu</h3><p>Omezující faktor bývá šířka dveří, úhel schodiště a výška stropu. Změřte si průchod v nejvyšším bodě — to je místo, kde se nejčastěji zasekne.</p><h3>Bezpečnost nad zlato</h3><p>Těžký předmět nesmí ohrozit zdraví. Vždy pracujeme minimálně ve dvou, často ve třech lidech. Kde je potřeba, použijeme pásy, kloubové vozíky nebo zvedák.</p><blockquote>Bojler 400 kg bez zvedáku? Ano, jde to — s dobrou technikou a správným počtem rukou.</blockquote><h2>Kdy si objednat přepravu</h2><p>Čím dříve nás kontaktujete, tím lépe. Těžké předměty plánujeme s předstihem, abychom měli k dispozici správné lidi i techniku.</p>', 'https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000034-8f48a8f48c/IMG_2972.jpeg?ph=9b5be8ccee', NULL, NULL, 'PŘEPRAVA', 'Těžké předměty · 4 min čtení', 1, 'Milan Rousek'),
  ('6a96a9d40e202788c5a0bc52', '2026-09-01T10:32:52.482000', '2026-09-01T10:32:52.482000', '6a909a966bc48d91a31aad9e', 'Rozvoz nábytku po Praze a okolí — jak to funguje u nás', 'rozvoz-nabytku-praha', 'Vyzvedneme z obchodu i bytu a dovezeme až do nového domova. Vše o našem rozvozu sedaček, skříní a objemného zboží.', '<h2>Rozvoz, který ušetří váš čas</h2><p>Koupili jste novou sedačku a e-shop ji doveze jen k chodbičce? Nebo potřebujete přesunout skříň z jednoho bytu do druhého? To je přesně náš obor.</p><h3>Vyzvedneme kdekoliv</h3><p>Vyzvedneme nábytek v obchodě, skladu i přímo v bytě. Stačí říct adresu a čas — o zbytek se postaráme.</p><h3>Dovezeme až na místo</h3><p>Nábytek nenecháme ve dveřích. Doneseme ho až do pokoje, a po domluvě ho i smontujeme a umístíme přesně tam, kde ho chcete mít.</p><h3>Po Praze i do okolí</h3><p>Působíme v Praze a širokém okolí. Vzdálenost není překážkou — cena se odvíjí od kilometrů a objemu nákladu.</p><blockquote>Sedačka, skříň, pračka — vše dovezeme v jednom turnusu. Ušetříte si vícero cest.</blockquote><h2>Jak objednat rozvoz</h2><p>Nejrychlejší cesta je telefon. Zavolejte, popište co a kam, a my spočítáme orientační cenu hned na místě. Pro přesnou nabídku využijte i kalkulačku na našem webu.</p>', 'https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000010-5795457957/dodavka%20%201-5.jpeg?ph=9b5be8ccee', NULL, NULL, 'ROZVOZ', 'Praha & okolí · 3 min čtení', 1, 'Milan Rousek'),
  ('6a96a9d40e202788c5a0bc50', '2026-09-01T10:32:52.482000', '2026-09-01T10:32:52.482000', '6a909a966bc48d91a31aad9e', 'Jak správně připravit nábytek na přepravu', 'jak-pripravit-nabytek-na-prepravu', 'Praktický návod, jak demontovat, zabalit a chránit nábytek, aby přepravu přežil bez poškození.', '<h2>Příprava nábytku před přepravou</h2><p>Přeprava nábytku začíná dlouho předtím, než dorazí dodávka. Správná příprava ušetří čas, peníze a především nervy. V tomto článku vás provedeme krok za krokem.</p><h3>1. Demontáž</h3><p>Co lze rozebrat, rozeberte. Skříně, postele a regály se přepravují snáze v rozloženém stavu. Šroubky a malé díly uložte do sáčku a připevněte k příslušnému kusu.</p><h3>2. Ochrana hran a rohů</h3><p>Náchylné hrany zabalte do bublinkové fólie nebo kartonu. Stačí vrstva nebo dvě — cílem je zabránit odření při manipulaci.</p><h3>3. Fixní předměty</h3><p>Zásuvky a dveře skříně zajistěte páskou, aby se při přepravě neotevřely. Skleněné plochy vždy balte zvlášť.</p><blockquote>Pokud si nejste jistí, nechte demontáž na profesionálech. My ji zvládneme rychle a bezpečně.</blockquote><h2>Co dělat po přepravě</h2><p>Při vykládání kontrolujte každý kus. Poškození reklamujte okamžitě. Montáž provádějte v opačném pořadí a šroubky dotahujte až po srovnání celého kusu.</p>', 'https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000024-6ae996ae9b/IMG_0233.jpeg?ph=9b5be8ccee', NULL, NULL, 'NÁVODY', 'Přeprava · 5 min čtení', 1, 'Milan Rousek');



-- ============================================================
-- SiteSettings
-- ============================================================
DROP TABLE IF EXISTS `SiteSettings`;
CREATE TABLE `SiteSettings` (
  `id` TEXT,
  `created_date` TEXT,
  `updated_date` TEXT,
  `created_by_id` TEXT,
  `logo_url` TEXT,
  `brand_name` TEXT,
  `brand_suffix` TEXT,
  `brand_tagline` TEXT,
  `phone` TEXT,
  `phone_href` TEXT,
  `email` TEXT,
  `address` TEXT,
  `ic` TEXT,
  `owner_name` TEXT,
  `hero_eyebrow` TEXT,
  `hero_title` TEXT,
  `hero_paragraph` TEXT,
  `hero_image_url` TEXT,
  `hero_cta_primary` TEXT,
  `hero_cta_secondary` TEXT,
  `stat1_value` TEXT,
  `stat1_label` TEXT,
  `stat2_value` TEXT,
  `stat2_label` TEXT,
  `stat3_value` TEXT,
  `stat3_label` TEXT,
  `stat4_value` TEXT,
  `stat4_label` TEXT,
  `about_eyebrow` TEXT,
  `about_title` TEXT,
  `about_paragraph_1` TEXT,
  `about_paragraph_2` TEXT,
  `about_image_url` TEXT,
  `map_lat` TEXT,
  `map_lng` TEXT,
  `gallery` TEXT
);

INSERT INTO `SiteSettings` (`id`, `created_date`, `updated_date`, `created_by_id`, `logo_url`, `brand_name`, `brand_suffix`, `brand_tagline`, `phone`, `phone_href`, `email`, `address`, `ic`, `owner_name`, `hero_eyebrow`, `hero_title`, `hero_paragraph`, `hero_image_url`, `hero_cta_primary`, `hero_cta_secondary`, `stat1_value`, `stat1_label`, `stat2_value`, `stat2_label`, `stat3_value`, `stat3_label`, `stat4_value`, `stat4_label`, `about_eyebrow`, `about_title`, `about_paragraph_1`, `about_paragraph_2`, `about_image_url`, `map_lat`, `map_lng`, `gallery`) VALUES
  ('6a9d24ed946536746040e337', '2026-09-06T08:31:41.018000', '2026-09-06T08:31:41.018000', '6a909a966bc48d91a31aad9e', '', 'DOPRAVACI', '.CZ', 'Dopravní společnost', '+420 732 530 802', 'tel:+420732530802', 'ivekodopravci@seznam.cz', 'Jiránkova 1137/1, Praha-Řepy 163 00', '76651282', 'Milan Rousek', '// Doprava & přeprava nestandardních předmětů', 'Dopravíme vše, co je pro ostatní těžké.', 'Rozvoz sedaček, skříní a objemného zboží. Přeprava těžkých a nestandardních předmětů — bojler 400 kg? Žádný problém. Vyzvedneme a dovezeme napříč Prahou a okolím.', 'https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000000-bb95ebb960/1.jpeg?ph=9b5be8ccee', 'Spočítat cenu přepravy', 'Zavolat Milanovi', '400 kg', 'nejtěžší předmět', '17 m³', 'objem dodávky', '8 palet', 'kapacita', '100%', 'včas', '// 01 — O nás', 'Co je pro ostatní těžké, je pro nás rutina.', 'Dopravci.cz je pražská dopravní společnost Milana Rouska zaměřená na rozvoz nábytku a přepravu nestandardních předmětů. Vozíme sedačky, skříně, těžké bojlery i celé palety zboží po Praze, Řepích a okolí.', 'Přepravujeme s ohledem na každý kus — od první palety po poslední krabici. Montáž, demontáž i odvoz starého nábytku zařídíme v jednom turnusu.', 'https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000034-8f48a8f48c/IMG_2972.jpeg?ph=9b5be8ccee', 50.0765, 14.298, '[{"alt":"Montáž nábytku po rozvozu","src":"https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000024-6ae996ae9b/IMG_0233.jpeg?ph=9b5be8ccee","tag":"MONTÁŽ"},{"alt":"Demontáž a odvoz starého nábytku","src":"https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000026-7bfdb7bfdd/IMG_0232.jpeg?ph=9b5be8ccee","tag":"DEMONTÁŽ"},{"alt":"Přeprava palet a objemného zboží","src":"https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000028-7a1f07a1f2/IMG_0468.jpeg?ph=9b5be8ccee","tag":"PALETY"},{"alt":"Těžký bojler 400 kg","src":"https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000034-8f48a8f48c/IMG_2972.jpeg?ph=9b5be8ccee","tag":"BOJLER"},{"alt":"Drobné zámečnické práce","src":"https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000030-e3335e3336/IMG_0835.jpeg?ph=9b5be8ccee","tag":"ZÁMEČNICTVÍ"},{"alt":"Rozvoz dodávkou po Praze","src":"https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000010-5795457957/dodavka%20%201-5.jpeg?ph=9b5be8ccee","tag":"ROZVOZ"}]');



-- ============================================================
-- Galerie
-- ============================================================
DROP TABLE IF EXISTS `Galerie`;
CREATE TABLE `Galerie` (
  `id` TEXT,
  `created_date` TEXT,
  `updated_date` TEXT,
  `created_by_id` TEXT,
  `src` TEXT,
  `alt` TEXT,
  `tag` TEXT,
  `order` TEXT
);

INSERT INTO `Galerie` (`id`, `created_date`, `updated_date`, `created_by_id`, `src`, `alt`, `tag`, `order`) VALUES
  ('6a9d2534d6145afd69e93722', '2026-09-06T08:32:52.758000', '2026-09-06T08:32:52.758000', '6a909a966bc48d91a31aad9e', 'https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000024-6ae996ae9b/IMG_0233.jpeg?ph=9b5be8ccee', 'Montáž nábytku po rozvozu', 'MONTÁŽ', 1),
  ('6a9d2534d6145afd69e93723', '2026-09-06T08:32:52.758000', '2026-09-06T08:32:52.758000', '6a909a966bc48d91a31aad9e', 'https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000026-7bfdb7bfdd/IMG_0232.jpeg?ph=9b5be8ccee', 'Demontáž a odvoz starého nábytku', 'DEMONTÁŽ', 2),
  ('6a9d2534d6145afd69e93724', '2026-09-06T08:32:52.758000', '2026-09-06T08:32:52.758000', '6a909a966bc48d91a31aad9e', 'https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000028-7a1f07a1f2/IMG_0468.jpeg?ph=9b5be8ccee', 'Přeprava palet a objemného zboží', 'PALETY', 3),
  ('6a9d2534d6145afd69e93725', '2026-09-06T08:32:52.758000', '2026-09-06T08:32:52.758000', '6a909a966bc48d91a31aad9e', 'https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000034-8f48a8f48c/IMG_2972.jpeg?ph=9b5be8ccee', 'Těžký bojler 400 kg', 'BOJLER', 4),
  ('6a9d2534d6145afd69e93726', '2026-09-06T08:32:52.758000', '2026-09-06T08:32:52.758000', '6a909a966bc48d91a31aad9e', 'https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000030-e3335e3336/IMG_0835.jpeg?ph=9b5be8ccee', 'Drobné zámečnické práce', 'ZÁMEČNICTVÍ', 5),
  ('6a9d2534d6145afd69e93727', '2026-09-06T08:32:52.758000', '2026-09-06T08:32:52.758000', '6a909a966bc48d91a31aad9e', 'https://9b5be8ccee.clvaw-cdnwnd.com/c87cac2004e4f81ce02f7a618256653c/200000010-5795457957/dodavka%20%201-5.jpeg?ph=9b5be8ccee', 'Rozvoz dodávkou po Praze', 'ROZVOZ', 6);



-- ============================================================
-- User
-- ============================================================
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` TEXT,
  `created_date` TEXT,
  `full_name` TEXT,
  `email` TEXT,
  `role` TEXT
);

INSERT INTO `User` (`id`, `created_date`, `full_name`, `email`, `role`) VALUES
  ('6a90a341d11e4912a5c6b85f', '2026-08-27T20:51:13.144000Z', 'Juraj Puchky', 'juraj.puchky@gmail.com', 'user'),
  ('6a909a966bc48d91a31aad9e', '2026-08-27T20:14:14.639000Z', 'sjurajpuchky', 'sjurajpuchky@seznam.cz', 'admin');


