ALTER TABLE `site_settings`
    ADD COLUMN `homepage_content` JSON NULL;

UPDATE `site_settings`
SET
    `brand_tagline` = 'Nadrozměrná přeprava',
    `hero_eyebrow` = 'Česká republika · Evropa',
    `hero_title` = 'Přeprava, která přesahuje běžné rozměry.',
    `hero_paragraph` = 'Specializovaná doprava nestandardních, nadrozměrných a velkotonážních nákladů. Od lopatek větrných elektráren přes potrubní díly až po těžké technologické celky.',
    `hero_image_url` = '/images/oversize-transport-hero.webp',
    `hero_cta_primary` = 'Konzultovat přepravu',
    `hero_cta_secondary` = 'Napsat e-mail',
    `homepage_content` = JSON_OBJECT(
        'navigation', JSON_OBJECT('services', 'Služby', 'process', 'Jak pracujeme', 'contact', 'Kontakt'),
        'highlights', JSON_ARRAY(
            JSON_OBJECT('title', 'Trasa na míru', 'text', 'Plánování každého průjezdu'),
            JSON_OBJECT('title', 'Bezpečný průběh', 'text', 'Koordinace celé realizace'),
            JSON_OBJECT('title', 'Průmyslové náklady', 'text', 'Dlouhé, těžké i atypické')
        ),
        'services', JSON_OBJECT(
            'eyebrow', 'Naše specializace',
            'title', 'Když běžná doprava nestačí.',
            'intro', 'Každou zakázku posuzujeme samostatně. Navrhneme vhodný způsob přepravy, prověříme kritická místa a sladíme techniku, trasu i asistenci.',
            'items', JSON_ARRAY(
                JSON_OBJECT('title', 'Lopatky větrných elektráren', 'text', 'Přeprava mimořádně dlouhých komponent s důrazem na plánování trasy, průjezdnost a přesnou koordinaci.'),
                JSON_OBJECT('title', 'Roury a potrubní díly', 'text', 'Doprava dlouhých rour, trubek, potrubních celků a dalších rozměrných dílů pro průmysl a energetiku.'),
                JSON_OBJECT('title', 'Velkotonážní náklady', 'text', 'Individuální řešení pro těžké stroje, technologické celky a náklady, které vyžadují speciální techniku.'),
                JSON_OBJECT('title', 'Asistovaná přeprava', 'text', 'Doprovod, koordinace průjezdu a součinnost při realizaci náročných přeprav od nakládky až po předání.')
            )
        ),
        'process', JSON_OBJECT(
            'eyebrow', 'Od zadání po předání',
            'title', 'Připraveno do posledního kilometru.',
            'steps', JSON_ARRAY(
                JSON_OBJECT('title', 'Posouzení nákladu', 'text', 'Rozměry, hmotnost, těžiště, nakládka, vykládka a požadovaný termín.'),
                JSON_OBJECT('title', 'Návrh trasy', 'text', 'Prověření průjezdnosti, omezení, manipulačních míst a potřebné asistence.'),
                JSON_OBJECT('title', 'Koordinovaná realizace', 'text', 'Přeprava s průběžnou komunikací a dohledem nad bezpečným průběhem zakázky.')
            )
        ),
        'contact', JSON_OBJECT('eyebrow', 'Kontakt', 'title', 'Máte nestandardní náklad? Proberme trasu.', 'directLabel', 'Přímý kontakt'),
        'footer', JSON_OBJECT('text', 'Nadrozměrná a velkotonážní přeprava')
    );
