ALTER TABLE `inquiries`
    ADD COLUMN `source` VARCHAR(32) NOT NULL DEFAULT 'contact',
    ADD COLUMN `details` JSON NULL;

UPDATE `inquiries`
SET `source` = 'calculator'
WHERE `from_city` IS NOT NULL OR `to_city` IS NOT NULL;
