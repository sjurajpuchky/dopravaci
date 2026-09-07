const importedAt = new Date("2026-09-07T11:28:22.000Z");

const keywords = `
stěhovací firma praha
stehovaci sluzba
stehovaci sluzba praha
nejlevnější stěhování praha
stěhování praha 4
stěhování praha cena
stěhování praha ceník
stěhování nábytku praha
stehovani praha cena
stěhování po praze
stěhovací firmy praha
stěhovací služba plzeň
stěhování levně
praha stehovani
stěhování praha 1
stěhování brno cena
stěhovací služby ceník
stehovaci firma praha
ceník stěhování
stěhování praha recenze
stěhování mladá boleslav
stěhování praha 5
prestehovani praha
stěhování po čr
stěhování ostrava ceník
stěhovací služba české budějovice
stěhování praha 8
stěhování praha 9
stěhovací služba praha levně
stahovanie praha
stěhování těžkých břemen praha
stěhovací služba cena
nejlevnější stěhování
stěhování plzeň ceník
stehovaci auto
stěhování praha 10
cena stěhování
stěhovací služba ostrava
převoz nábytku praha
stěhovací firma ostrava
stehovaci firma cena
stěhování česká lípa
stěhování ceník
levné stěhování plzeň
kalkulačka stěhování
stěhování liberec ceník
stěhování brno ceník
stěhování praha 3
stěhovací služba olomouc
stehovani usti nad labem
stehovani ceske budejovice
stěhování na klíč
stěhování plzen
drobné stěhování praha
stěhování cena za km
stehovani ostrava cena
drobné stěhování brno
stěhování ostrava levně
stehovaci firmy
stěhování olomouc ceník
levné stěhování ústí nad labem
stěhování české budějovice cena
stehovani do zahranici
stehovaci sluzba brno
levné stěhování kladno
nejlevnější stěhování ostrava
stehujeme levne
stěhování tábor
stěhování praha 2
stehovani nabytku
stěhování brno recenze
stěhování praha brno
stěhování čr
stěhovací služba liberec
stěhování těžkých břemen ostrava
stěhování brno praha
stěhování praha a okolí
stehovani hk
stehovaci cena
stehovak praha
levné stěhování české budějovice
stěhovací služba ústí nad labem
stěhování kanceláří praha
stěhovací služba karlovy vary
pomoc se stěhováním
stěhovací služby ostrava
stehování brno
preprava nabytku praha
stěhujeme levně
stehovani bytu cena
stehovani cenik
likvidace nábytku praha
stehovani mlada boleslav
převoz věcí praha
stěhovací firma české budějovice
stěhování kalkulačka
stěhovací služba plzeň ceník
levne stehovani ostrava
vyklizení bytu ostrava
stehovaci sluzba plzen
přeprava nábytku praha
prevoz nabytku praha
stěhování trezorů praha
stěhovací firma olomouc
stěhování nábytku brno
extra stěhování plzeň
stěhování louny
stěhovací firma plzeň
levné stěhování liberec
krabice na stěhování praha
cenik stehovani
brno stehovani
stěhovací firmy ostrava
stěhování hodonín
převoz nábytku ostrava
vyklízení bytů liberec
vyklízení bytů praha 4
stěhování vyklízení
stěhování ze zahraničí
vyklízení plzeň
přeprava nábytku
pomoc pri stehovani
stehovani vyklizeni
stěhování do prahy
vyklízení pozůstalostí brno
stěhovací firma liberec
stehuji levne recenze
stěhování praha kalkulačka
vyklízení bytů české budějovice
převoz nábytku
přeprava nábytku cena
stehovani ceska lipa
stěhovací auto
stehovani tabor
vyklizeni domu
stěhovací služby olomouc
stěhuji levně ostrava
stehovaci firma liberec
auto na stehovani
stěhování do španělska
stehovaci auto ostrava
stehovani praha ihned
stehovaci vuz
poptávka stěhování
stěhovací vůz
rychle stehovani
vyklizeni pozustalosti
stěhování bytů praha
likvidace bytu
stehovani brno cena
stěhovací společnost
krabice na stěhování brno
stěhovací práce
stěhovací služba ceník
stěhování levně ostrava
stehovani veci
vyklízení ostrava
stěhujeme za vás
stehovaci firma plzen
stehovani brno levne
stěhování česká lípa ceník
vyklizeni plzen
krabice na stehovani praha
stehovaci taxi
k služby olomouc
stěhování olomouc recenze
stehovani rychly
tipy na stěhování
stěhování skříně
stěhovací technika
likvidace nabytku
vyklízení karlovy vary
vyklízení kladno
práce stěhování
montáž nábytku brno
vyklizeni ostrava
výpomoc při stěhování
vyklízení liberec
stěhovací krabice praha
vyklízení hk
dovolena na stehovani
vyklizeni hk
taxi stehovani
stehovací popruhy
stehovaci popruh
popruhy na stěhování nábytku
stěhovací popruh
přeprava nábytku po čr
stehovani cz
stehujeme
`.trim().split("\n");

const images = {
  moving: "/images/articles/stehovani.webp",
  furniture: "/images/articles/nabytek.webp",
  heavy: "/images/articles/tezka-bremena.webp",
  clearing: "/images/articles/vyklizeni.webp",
  packing: "/images/articles/baleni.webp",
  international: "/images/articles/zahranici.webp",
  business: "/images/articles/firmy.webp",
  pricing: "/images/articles/cena.webp",
  vehicle: "/images/articles/stehovaci-vuz.webp",
};

const cityNames = [
  "Praha", "Brno", "Ostrava", "Plzeň", "Olomouc", "Liberec", "Ústí nad Labem",
  "České Budějovice", "Mladá Boleslav", "Česká Lípa", "Tábor", "Kladno",
  "Karlovy Vary", "Louny", "Hodonín", "Hradec Králové",
];

function czechize(value) {
  const replacements = [
    [/stahovanie/gi, "stěhování"], [/prestehovani/gi, "přestěhování"],
    [/stehování|stehovani/gi, "stěhování"], [/stehovací|stehovaci/gi, "stěhovací"],
    [/stehujeme|stehuji|stehuju/gi, (match) => ({ stehujeme: "stěhujeme", stehuji: "stěhuji", stehuju: "stěhuji" })[match.toLowerCase()]],
    [/vyklizeni/gi, "vyklízení"], [/pozustalosti/gi, "pozůstalosti"],
    [/preprava/gi, "přeprava"], [/prevoz/gi, "převoz"], [/nabytku/gi, "nábytku"],
    [/sluzba/gi, "služba"], [/sluzby/gi, "služby"], [/tezkych/gi, "těžkých"],
    [/bremen/gi, "břemen"], [/zahranici/gi, "zahraničí"], [/rychly/gi, "rychlé"],
    [/levne/gi, "levně"], [/cenik/gi, "ceník"], [/veci/gi, "věcí"],
    [/ceske/gi, "České"], [/ceska/gi, "Česká"], [/mlada/gi, "Mladá"],
    [/usti nad labem/gi, "Ústí nad Labem"], [/karlovy vary/gi, "Karlovy Vary"],
    [/ceska lipa/gi, "Česká Lípa"], [/plzen/gi, "Plzeň"], [/praha/gi, "Praha"],
    [/brno/gi, "Brno"], [/ostrava/gi, "Ostrava"], [/olomouc/gi, "Olomouc"],
    [/liberec/gi, "Liberec"], [/kladno/gi, "Kladno"], [/tabor/gi, "Tábor"],
    [/hodonín/gi, "Hodonín"], [/louny/gi, "Louny"], [/\bhk\b/gi, "Hradec Králové"],
    [/\bcr\b|\bčr\b/gi, "ČR"],
  ];
  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

function titleFor(keyword) {
  const title = czechize(keyword.trim());
  return title.charAt(0).toLocaleUpperCase("cs-CZ") + title.slice(1);
}

function slugFor(keyword) {
  return keyword
    .trim()
    .toLocaleLowerCase("cs-CZ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function cityFor(keyword) {
  const text = czechize(keyword).toLocaleLowerCase("cs-CZ");
  return cityNames.find((city) => text.includes(city.toLocaleLowerCase("cs-CZ"))) || null;
}

function classify(keyword) {
  const text = czechize(keyword).toLocaleLowerCase("cs-CZ");
  if (/vyklí|likvidace|pozůstal/.test(text)) return "clearing";
  if (/těžk|břemen|trezor/.test(text)) return "heavy";
  if (/nábytk|skříň|montáž/.test(text)) return "furniture";
  if (/krabic|popruh|technik/.test(text)) return "packing";
  if (/zahranič|španěl/.test(text)) return "international";
  if (/kancelář|firem/.test(text)) return "business";
  if (/auto|vůz|taxi/.test(text)) return "vehicle";
  if (/cen|levn|kalkula|nejlevnější/.test(text)) return "pricing";
  return "moving";
}

const categoryData = {
  moving: {
    tag: "STĚHOVÁNÍ", image: images.moving,
    lead: "Dobře naplánované stěhování stojí na přesném rozsahu práce, bezpečné manipulaci a reálném časovém plánu.",
    service: "Profesionální zakázka může zahrnovat přistavení vozu, odnos věcí, ochranu nábytku, nakládku, přepravu, vykládku i rozmístění na nové adrese.",
  },
  pricing: {
    tag: "CENY", image: images.pricing,
    lead: "Cena stěhování se nedá spolehlivě určit jen podle velikosti bytu. Rozhoduje součet času, lidí, trasy a náročnosti manipulace.",
    service: "Přesná nabídka vychází ze seznamu věcí, počtu pater, dostupnosti výtahu, vzdálenosti vozu od vchodu a kilometrů mezi adresami.",
  },
  furniture: {
    tag: "NÁBYTEK", image: images.furniture,
    lead: "Nábytek je při přepravě citlivý na nárazy, tlak i špatné uchopení. Správná demontáž a ochrana hran výrazně snižují riziko poškození.",
    service: "Podle dohody lze zajistit demontáž, zabalení, odnos, převoz, výnos i opětovnou montáž skříní, postelí, stolů nebo sedaček.",
  },
  heavy: {
    tag: "TĚŽKÁ BŘEMENA", image: images.heavy,
    lead: "Přesun těžkého břemene vyžaduje znalost hmotnosti, rozměrů, trasy a nosnosti použitých pomůcek. Improvizace může poškodit majetek i zdraví.",
    service: "Před realizací je potřeba prověřit dveře, schodiště, výtah, podlahy, možnost kotvení a prostor pro bezpečné naložení.",
  },
  clearing: {
    tag: "VYKLÍZENÍ", image: images.clearing,
    lead: "Vyklízení je kombinací třídění, odnosu, dopravy a odpovědného předání věcí k dalšímu využití nebo likvidaci.",
    service: "Rozsah může zahrnovat demontáž nábytku, odnos z bytu či domu, naložení, odvoz a závěrečné uvolnění prostoru.",
  },
  packing: {
    tag: "PŘÍPRAVA", image: images.packing,
    lead: "Kvalitní obalový materiál a správná technika přenášení chrání věci, zrychlují nakládku a omezují zbytečná zranění.",
    service: "Pro přípravu se používají pevné krabice, stretch fólie, bublinková fólie, deky, ochranné rohy, páska a popruhy odpovídající nosnosti.",
  },
  international: {
    tag: "ZAHRANIČÍ", image: images.international,
    lead: "Mezinárodní stěhování vyžaduje přesnější plán trasy, termínu, pojištění a dokumentace než běžný přesun mezi dvěma českými adresami.",
    service: "Před objednáním je důležité potvrdit objem zásilky, cílovou adresu, přístupové podmínky, termín a pravidla pro přepravované věci.",
  },
  business: {
    tag: "FIRMY", image: images.business,
    lead: "Stěhování kanceláře nebo firmy musí minimalizovat odstávku provozu a zachovat přehled o technice, dokumentech i vybavení.",
    service: "Zakázka se obvykle rozděluje na inventarizaci, označení, balení, převoz, rozmístění a kontrolu podle předávacího seznamu.",
  },
  vehicle: {
    tag: "DOPRAVA", image: images.vehicle,
    lead: "Správně zvolený stěhovací vůz šetří počet jízd, ale zároveň musí odpovídat přístupnosti obou adres a typu nákladu.",
    service: "Vedle objemu nákladového prostoru rozhoduje jeho délka, výška, nosnost, možnosti kotvení a vybavení pro bezpečnou manipulaci.",
  },
};

function hash(value) {
  return [...value].reduce((result, char) => (result * 31 + char.codePointAt(0)) >>> 0, 7);
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function buildContent(keyword) {
  const display = titleFor(keyword);
  const category = classify(keyword);
  const data = categoryData[category];
  const city = cityFor(keyword);
  const variant = hash(keyword) % 4;
  const locality = city
    ? `U zakázky pro lokalitu ${city} je důležité uvést obě přesné adresy. Neznamená to automaticky místní pobočku; podle trasy a termínu vám potvrdíme, zda je možné zakázku obsloužit jako místní nebo meziměstskou přepravu.`
    : "Uveďte výchozí i cílovou adresu, protože vzdálenost, parkování a přístup k domu mají přímý vliv na čas i konečnou cenu.";
  const angle = [
    "Nejvíce času se ušetří ještě před příjezdem vozu: soupisem věcí, fotografiemi rozměrných kusů a ověřením přístupové cesty.",
    "Spolehlivá nabídka nevzniká odhadem od stolu. Čím přesnější podklady dodáte, tím menší je riziko změny ceny nebo délky práce.",
    "Nejčastější komplikace nezpůsobuje samotná jízda, ale úzké průchody, chybějící výtah, nemožnost zaparkovat a nezajištěné drobnosti.",
    "Rozdělení přípravy do několika jednoduchých kroků pomůže udržet zakázku přehlednou a umožní zvolit správný počet pracovníků i velikost vozu.",
  ][variant];

  return [
    `<h2>${display}: praktický průvodce objednáním</h2>`,
    `<p>${data.lead} ${angle}</p>`,
    `<p>${locality}</p>`,
    "<h2>Co sdělit před naceněním</h2>",
    "<p>Pro použitelný odhad nestačí jen počet pokojů. Připravte stručný seznam velkých kusů, přibližný počet krabic a informaci o mimořádně těžkých nebo křehkých předmětech. Fotografie pomohou odhalit nutnost demontáže a speciální manipulace.</p>",
    list([
      "adresu nakládky a vykládky včetně podlaží, výtahu a možnosti parkování",
      "seznam nábytku, spotřebičů, krabic a těžkých či křehkých kusů",
      "požadovaný termín a případnou časovou návaznost na předání nemovitosti",
      "požadavek na balení, demontáž, montáž, vyklízení nebo likvidaci",
    ]),
    "<h2>Jak služba obvykle probíhá</h2>",
    `<p>${data.service} Konkrétní rozsah si vždy potvrďte předem, aby bylo jasné, které práce jsou zahrnuté a co si připravujete sami.</p>`,
    "<ol><li><strong>Poptávka:</strong> pošlete adresy, termín, rozsah a fotografie.</li><li><strong>Nabídka:</strong> upřesní se počet pracovníků, vůz, odhad času a způsob účtování.</li><li><strong>Příprava:</strong> věci se roztřídí, označí, zabalí a u rozměrných kusů případně demontují.</li><li><strong>Realizace:</strong> tým provede odnos, bezpečné uložení ve voze, přepravu a vyložení.</li><li><strong>Kontrola:</strong> na cílové adrese zkontrolujete počet kusů a jejich stav.</li></ol>",
    "<h2>Co ovlivňuje cenu</h2>",
    "<p>Výslednou cenu nejčastěji tvoří počet lidí a odpracovaný čas, doprava a kilometry, velikost vozu, patro bez výtahu, delší odnosová vzdálenost a práce navíc. Těžká břemena, čekání, montáž nebo obalový materiál je vhodné uvést už v poptávce. Ptejte se, zda je nabídka hodinová, pevná, nebo kombinuje sazbu za práci a dopravu.</p>",
    "<h2>Jak se připravit na den realizace</h2>",
    list([
      "uvolněte chodby, schodiště a místo kolem velkých kusů",
      "zajistěte parkování co nejblíže ke vchodu na obou adresách",
      "odpojte spotřebiče, vyprázdněte nábytek a označte křehké krabice",
      "doklady, klíče, léky a cennosti přepravujte odděleně u sebe",
      "domluvte osobu, která bude dostupná při nakládce i předání",
    ]),
    "<h2>Jak poznat spolehlivou nabídku</h2>",
    "<p>Seriózní dodavatel se ptá na podrobnosti, upozorní na možná rizika a jasně popíše způsob výpočtu ceny. Ověřte si identifikaci podnikatele, rozsah odpovědnosti za škodu a podmínky změny nebo zrušení termínu. Samotná nejnižší sazba bez vymezeného rozsahu nemusí znamenat nejlevnější výsledek.</p>",
    `<h2>Časté otázky k tématu ${display.toLocaleLowerCase("cs-CZ")}</h2>`,
    "<h3>Jak dlouho předem službu objednat?</h3><p>U běžné zakázky je vhodné poptat termín alespoň několik dnů předem. Konce měsíců, víkendy, velké objemy a meziměstské trasy plánujte s větším předstihem.</p>",
    "<h3>Lze cenu určit po telefonu?</h3><p>Orientační odhad ano, pokud známe adresy, podlaží, rozsah a fotografie. U složitější zakázky je přesnější videoprohlídka nebo osobní obhlídka.</p>",
    "<h3>Musím mít vlastní obalový materiál?</h3><p>Záleží na objednaném rozsahu. Můžete si věci připravit sami, nebo předem požádat o dodání materiálu a kompletní balení.</p>",
    "<h2>Nezávazná poptávka</h2>",
    `<p>Pokud řešíte <strong>${display.toLocaleLowerCase("cs-CZ")}</strong>, pošlete nám popis zakázky, obě adresy, termín a několik fotografií. Ověříme dostupnost, doporučíme vhodný postup a připravíme srozumitelnou nabídku bez skrytého rozsahu práce.</p>`,
  ].join("");
}

const uniqueKeywords = [...new Map(keywords.map((keyword) => [slugFor(keyword), keyword])).values()];

export const kgrArticles = uniqueKeywords.map((keyword) => {
  const title = titleFor(keyword);
  const category = classify(keyword);
  const data = categoryData[category];
  const city = cityFor(keyword);
  return {
    title,
    slug: slugFor(keyword),
    excerpt: `${title}: co ovlivňuje cenu, jak službu naplánovat, co připravit a na co se zeptat před objednáním${city ? ` v lokalitě ${city}` : ""}.`,
    content: buildContent(keyword),
    imageUrl: data.image,
    gallery: [],
    videos: [],
    tag: data.tag,
    meta: `${city || "Česká republika"} · 7 min čtení`,
    published: true,
    authorName: "Milan Rousek",
    createdAt: importedAt,
    updatedAt: importedAt,
  };
});

if (new Set(kgrArticles.map(({ slug }) => slug)).size !== kgrArticles.length) {
  throw new Error("KGR články obsahují duplicitní slug");
}
