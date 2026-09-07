CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `phone` VARCHAR(64) NULL,
    `note` TEXT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `approval_status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `auth_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `token_hash` CHAR(64) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NOT NULL,
    UNIQUE INDEX `auth_sessions_token_hash_key`(`token_hash`),
    INDEX `auth_sessions_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `auth_tokens` (
    `id` VARCHAR(191) NOT NULL,
    `token_hash` CHAR(64) NOT NULL,
    `type` ENUM('VERIFY_EMAIL', 'RESET_PASSWORD') NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NOT NULL,
    UNIQUE INDEX `auth_tokens_token_hash_key`(`token_hash`),
    INDEX `auth_tokens_user_id_type_idx`(`user_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `inquiries` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(64) NOT NULL,
    `email` VARCHAR(191) NULL,
    `from_city` VARCHAR(191) NULL,
    `to_city` VARCHAR(191) NULL,
    `distance_km` DOUBLE NULL,
    `volume` DOUBLE NULL,
    `floors` INTEGER NULL,
    `heavy_items` BOOLEAN NOT NULL DEFAULT false,
    `cargo` TEXT NULL,
    `note` TEXT NULL,
    `status` ENUM('NEW', 'TAKEN', 'COMPLETED') NOT NULL DEFAULT 'NEW',
    `commission` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by_id` VARCHAR(191) NULL,
    `taken_by_id` VARCHAR(191) NULL,
    INDEX `inquiries_status_created_at_idx`(`status`, `created_at`),
    INDEX `inquiries_taken_by_id_created_at_idx`(`taken_by_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `articles` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NOT NULL,
    `image_url` TEXT NULL,
    `gallery` JSON NULL,
    `videos` JSON NULL,
    `tag` VARCHAR(100) NULL,
    `meta` TEXT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `author_name` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    UNIQUE INDEX `articles_slug_key`(`slug`),
    INDEX `articles_published_created_at_idx`(`published`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `site_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logo_url` TEXT NULL,
    `brand_name` VARCHAR(191) NULL,
    `brand_suffix` VARCHAR(50) NULL,
    `brand_tagline` VARCHAR(255) NULL,
    `phone` VARCHAR(64) NULL,
    `phone_href` VARCHAR(100) NULL,
    `email` VARCHAR(191) NULL,
    `address` VARCHAR(255) NULL,
    `ic` VARCHAR(64) NULL,
    `owner_name` VARCHAR(191) NULL,
    `hero_eyebrow` TEXT NULL,
    `hero_title` TEXT NULL,
    `hero_paragraph` TEXT NULL,
    `hero_image_url` TEXT NULL,
    `hero_cta_primary` VARCHAR(191) NULL,
    `hero_cta_secondary` VARCHAR(191) NULL,
    `stat1_value` VARCHAR(64) NULL,
    `stat1_label` VARCHAR(191) NULL,
    `stat2_value` VARCHAR(64) NULL,
    `stat2_label` VARCHAR(191) NULL,
    `stat3_value` VARCHAR(64) NULL,
    `stat3_label` VARCHAR(191) NULL,
    `stat4_value` VARCHAR(64) NULL,
    `stat4_label` VARCHAR(191) NULL,
    `about_eyebrow` TEXT NULL,
    `about_title` TEXT NULL,
    `about_paragraph_1` TEXT NULL,
    `about_paragraph_2` TEXT NULL,
    `about_image_url` TEXT NULL,
    `map_lat` DOUBLE NULL,
    `map_lng` DOUBLE NULL,
    `gallery` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `gallery_items` (
    `id` VARCHAR(191) NOT NULL,
    `src` TEXT NOT NULL,
    `alt` VARCHAR(255) NULL,
    `tag` VARCHAR(100) NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    INDEX `gallery_items_sort_order_idx`(`sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `auth_sessions` ADD CONSTRAINT `auth_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `auth_tokens` ADD CONSTRAINT `auth_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `inquiries` ADD CONSTRAINT `inquiries_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `inquiries` ADD CONSTRAINT `inquiries_taken_by_id_fkey` FOREIGN KEY (`taken_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
