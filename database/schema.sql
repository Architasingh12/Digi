-- Digi-Ready Database Schema
-- Version: 1.0
-- Description: Initial schema for Admin (Companies) and Participant management.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------
-- Table structure for `companies`
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `companies` (
    `company_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `firstname` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `company_title` VARCHAR(255) NOT NULL,
    `email_addresses` TEXT COMMENT 'Comma-separated additional emails',
    `license_qty` INT UNSIGNED DEFAULT 0,
    `license_expiry` DATE DEFAULT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL COMMENT 'Hashed password',
    `status` TINYINT(1) DEFAULT 1 COMMENT '0 = inactive, 1 = active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_ip` VARCHAR(45) DEFAULT NULL,
    PRIMARY KEY (`company_id`),
    UNIQUE KEY `uk_company_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for `participants`
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `participants` (
    `participant_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `company_id` INT UNSIGNED NOT NULL,
    `firstname` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL COMMENT 'Hashed password',
    `designation` VARCHAR(150) DEFAULT NULL,
    `level` ENUM(
        'Level 1 - Entry-Level/Associates',
        'Level 2 - Junior Management',
        'Level 3 - Middle Management',
        'Level 4 - Senior Management',
        'Level 5 - Executive/Top Management'
    ) NOT NULL,
    `status` TINYINT(1) DEFAULT 1 COMMENT '0 = inactive, 1 = active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_ip` VARCHAR(45) DEFAULT NULL,
    PRIMARY KEY (`participant_id`),
    UNIQUE KEY `uk_participant_email` (`email`),
    CONSTRAINT `fk_participant_company` 
        FOREIGN KEY (`company_id`) 
        REFERENCES `companies` (`company_id`) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for `assessments`
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `assessments` (
    `assessment_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `participant_id` INT UNSIGNED NOT NULL,
    `session_id` VARCHAR(100) NOT NULL,
    `section` TINYINT UNSIGNED NOT NULL COMMENT '3, 4, or 34',
    `overall_score` DECIMAL(5,2) DEFAULT NULL,
    `confidence` DECIMAL(5,2) DEFAULT NULL,
    `overall_comments` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`assessment_id`),
    KEY `idx_assessment_session` (`session_id`),
    CONSTRAINT `fk_assessment_participant` 
        FOREIGN KEY (`participant_id`) 
        REFERENCES `participants` (`participant_id`) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------
-- Table structure for `competencies`
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `competencies` (
    `competency_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `assessment_id` INT UNSIGNED NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `score` DECIMAL(5,2) NOT NULL,
    `rationale` TEXT,
    `evidence` JSON COMMENT 'Array of evidence strings',
    `type` ENUM('competence', 'mindset') NOT NULL,
    PRIMARY KEY (`competency_id`),
    CONSTRAINT `fk_competency_assessment` 
        FOREIGN KEY (`assessment_id`) 
        REFERENCES `assessments` (`assessment_id`) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------
-- Recommended Indexes for Performance
-- ---------------------------------------------------------
CREATE INDEX `idx_company_status` ON `companies` (`status`);
CREATE INDEX `idx_participant_company` ON `participants` (`company_id`);
CREATE INDEX `idx_participant_status` ON `participants` (`status`);
CREATE INDEX `idx_competency_assessment` ON `competencies` (`assessment_id`);
