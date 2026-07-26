-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 07 juil. 2026 à 02:26
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `pharmacie_benmoussa`
--

-- --------------------------------------------------------

--
-- Structure de la table `banners`
--

CREATE TABLE `banners` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `position` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `banners`
--

INSERT INTO `banners` (`id`, `title`, `subtitle`, `image_url`, `link_url`, `position`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Bienvenue chez Pharmacie Ben Moussa Abbes', 'Votre pharmacie en ligne de confiance', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80', '/products', 0, 1, '2026-06-22 21:11:03', '2026-06-22 21:11:03');

-- --------------------------------------------------------

--
-- Structure de la table `brands`
--

CREATE TABLE `brands` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `brands`
--

INSERT INTO `brands` (`id`, `name`, `slug`, `logo_url`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Bioderma', 'bioderma-483', NULL, 'Produits Bioderma disponibles à la pharmacie.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(2, 'La Roche-Posay', 'la-roche-posay-191', NULL, 'Produits La Roche-Posay disponibles à la pharmacie.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(3, 'Avène', 'avene-390', NULL, 'Produits Avène disponibles à la pharmacie.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(4, 'CeraVe', 'cerave-112', NULL, 'Produits CeraVe disponibles à la pharmacie.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(5, 'Vichy', 'vichy-887', NULL, 'Produits Vichy disponibles à la pharmacie.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(6, 'Nuxe', 'nuxe-294', NULL, 'Produits Nuxe disponibles à la pharmacie.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(7, 'A-Derma', 'a-derma-826', NULL, 'Produits A-Derma disponibles à la pharmacie.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(8, 'Vitarock', 'vitarock-624', NULL, 'Produits Vitarock disponibles à la pharmacie.', '2026-06-22 21:11:03', '2026-06-22 21:11:03');

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 'Médicaments', 'medicaments', 'Médicaments avec ou sans ordonnance.', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(2, 'Soins du visage', 'soins-du-visage', 'Produits dermatologiques pour le visage.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(3, 'Soins du corps', 'soins-du-corps', 'Hydratation, hygiène et soins corporels.', 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=300&q=80', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(4, 'Santé & Bien-être', 'sante-bien-etre', 'Vitamines, compléments alimentaires et bien-être.', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&q=80', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(5, 'Bébé & Maman', 'bebe-maman', 'Produits pédiatriques et de maternité.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(6, 'Hygiène', 'hygiene', 'Produits d\'hygiène quotidienne.', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&q=80', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(7, 'Nature & Bio', 'nature-bio', 'Produits naturels et biologiques.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&q=80', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(8, 'Cheveux', 'cheveux', 'Shampooings, masques et soins capillaires.', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&q=80', '2026-06-22 21:11:03', '2026-06-22 21:11:03');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_06_20_235335_create_personal_access_tokens_table', 1),
(5, '2026_06_21_000001_create_categories_table', 1),
(6, '2026_06_21_000002_create_products_table', 1),
(7, '2026_06_21_000003_create_orders_table', 1),
(8, '2026_06_21_000004_create_order_items_table', 1),
(9, '2026_06_21_000005_create_reviews_table', 1),
(10, '2026_06_22_000001_add_requires_prescription_to_products_table', 1),
(11, '2026_06_22_000002_add_prescription_to_orders_table', 1),
(12, '2026_06_23_000001_create_brands_table', 1),
(13, '2026_06_23_000002_add_brand_id_to_products_table', 1),
(14, '2026_06_23_000003_create_promotions_table', 1),
(15, '2026_06_23_000004_create_banners_table', 1),
(16, '2026_06_23_121644_add_loyalty_points_to_users_table', 2);

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `order_number` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL,
  `shipping_address` varchar(255) NOT NULL,
  `shipping_city` varchar(255) NOT NULL,
  `postal_code` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  `prescription_path` varchar(255) DEFAULT NULL,
  `prescription_status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `order_number`, `status`, `total_amount`, `shipping_address`, `shipping_city`, `postal_code`, `phone_number`, `payment_method`, `payment_status`, `prescription_path`, `prescription_status`, `created_at`, `updated_at`) VALUES
(1, 2, 'CMD202606220001', 'completed', 367.00, '123, Avenue Mohammed V', 'Casablanca', '20000', '0522123456', 'delivery', 'paid', NULL, NULL, '2026-06-20 21:11:03', '2026-06-22 21:11:03'),
(2, 2, 'CMD202606220002', 'pending', 298.00, '456, Boulevard Zerktouni', 'Casablanca', '20100', '0661234567', 'delivery', 'pending', NULL, NULL, '2026-06-22 21:11:03', '2026-06-22 21:11:03');

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 129.00, '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(2, 1, 2, 1, 149.00, '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(3, 1, 3, 1, 89.00, '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(4, 2, 2, 2, 149.00, '2026-06-22 21:11:03', '2026-06-22 21:11:03');

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `brand_id` bigint(20) UNSIGNED DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ingredients` text DEFAULT NULL,
  `usage_instructions` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `requires_prescription` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `products`
--

INSERT INTO `products` (`id`, `category_id`, `brand_id`, `name`, `slug`, `brand`, `description`, `ingredients`, `usage_instructions`, `price`, `discount_price`, `stock`, `image_url`, `is_featured`, `requires_prescription`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 'Bioderma Créaline H2O', 'bioderma-crealine-h2o', 'Bioderma', 'Solution micellaire nettoyante et démaquillante spécifique des peaux sensibles.', 'Aqua/Water/Eau, PEG-6 Caprylic/Capric Glycerides, Fructooligosaccharides, Mannitol, Xylitol, Rhamnose, Cucumis Sativus (Cucumber) Fruit Extract, Propylene Glycol, Cetrimonium Bromide, Disodium EDTA.', 'Matin et/ou soir – 7 jours sur 7. Imbibez un coton de Créaline H2O. Nettoyez et/ou démaquillez votre visage et vos yeux avec douceur.', 129.00, 109.00, 50, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80', 1, 0, '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(2, 2, 2, 'La Roche-Posay Effaclar Gel moussant', 'la-roche-posay-effaclar-gel-moussant', 'La Roche-Posay', 'Nettoie en douceur et purifie la peau. Élimine les impuretés et l\'excès de sébum sans agresser la peau.', 'Aqua/Water, Sodium Laureth Sulfate, PEG-8, Coco-Betaine, Hexylene Glycol, Sodium Chloride, PEG-120 Methyl Glucose Dioleate, Zinc PCA, Sodium Hydroxide, Citric Acid, Sodium Benzoate, Phenoxyethanol, Parfum/Fragrance.', 'Faire mousser dans la main avec un peu d\'eau et appliquer sur le visage en massant doucement. Rincer abondamment.', 149.00, 129.00, 35, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80', 1, 0, '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(3, 2, 3, 'Avène Eau Thermale Spray', 'avene-eau-thermale-spray', 'Avène', 'Apaisante par nature, adoucissante et anti-irritante, l\'Eau Thermale d\'Avène est le soin essentiel de toutes les peaux sensibles.', 'Avene Thermal Spring Water (Avene Aqua), Nitrogen gas.', 'Pulvérisez une fine brume sur la peau. Laissez agir quelques instants avant de sécher délicatement.', 89.00, NULL, 100, 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80', 1, 0, '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(4, 3, 4, 'Cerave Crème Hydratante', 'cerave-creme-hydratante', 'CeraVe', 'Nourrit, hydrate et restaure la barrière protectrice de la peau. Enrichie aux 3 céramides essentiels et acide hyaluronique.', 'Aqua/Water, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Cetyl Alcohol, Ceteareth-20, Petrolatum, Ceramide NP, Ceramide AP, Ceramide EOP, Hyaluronic Acid.', 'Appliquer aussi souvent que nécessaire sur le visage et le corps.', 177.00, NULL, 45, 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&q=80', 1, 0, '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(5, 2, 5, 'Vichy Minéral 89', 'vichy-mineral-89', 'Vichy', 'Booster quotidien fortifiant et repulpant à l\'acide hyaluronique et à l\'eau volcanique de Vichy.', 'Aqua/Water, PEG/PPG/Polybutylene Glycol-8/5/3 Glycerin, Glycerin, Butylene Glycol, Methyl Gluceth-20, Carbomer, Sodium Hyaluronate, Phenoxyethanol, Caprylyl Glycol, Citric Acid.', 'Appliquer 2 gouttes sur une peau propre, matin et soir, comme premier geste de votre routine.', 279.00, 249.00, 20, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80', 1, 0, '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(6, 3, 6, 'Nuxe Huile Prodigieuse', 'nuxe-huile-prodigieuse', 'Nuxe', 'Huile sèche multi-fonctions pour le visage, le corps et les cheveux. Nourrit, répare et sublime.', 'Coco-Caprylate/Caprate, Macadamia Integrifolia Seed Oil, Dicaprylyl Ether, Caprylic/Capric Triglyceride, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Corylus Avellana (Hazel) Seed Oil, Camellia Oleifera Seed Oil, Parfum/Fragrance.', 'S\'utilise toute l\'année sur le visage, le corps et les cheveux.', 180.00, NULL, 30, 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80', 1, 0, '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(7, 2, 2, 'La Roche-Posay Toleriane Crème', 'la-roche-posay-toleriane-creme', 'La Roche-Posay', 'Soin apaisant protecteur pour les peaux intolérantes ou allergiques.', 'Aqua, Isocetyl Stearate, Squalane, Butyrospermum Parkii Butter, Glycerin, Aluminum Starch Octenylsuccinate, Pentylene Glycol, PEG-100 Stearate, Glyceryl Stearate, Cetyl Alcohol, Sodium Hydroxide.', 'Appliquer sur le visage et le cou matin et soir.', 169.00, NULL, 25, 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&q=80', 0, 0, '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(8, 3, 7, 'A-Derma Exomega Lait émolient', 'a-derma-exomega-lait-emolient', 'A-Derma', 'Lait émollient anti-grattage apaise immédiatement et contrôle les irritations liées à la sécheresse de la peau.', 'Water, Glycerin, Caprylic/Capric Triglyceride, Glyceryl Stearate, Niacinamide, Peg-100 Stearate, 10-Hydroxydecenoic Acid, Avena Sativa (Oat) Leaf/Stem Extract, Benzoic Acid, Caprylyl Glycol.', 'Appliquer 1 à 2 fois par jour sur les zones sèches du visage et du corps préalablement nettoyées.', 119.00, NULL, 40, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80', 0, 0, '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(9, 2, 5, 'Vichy Normaderm Soin', 'vichy-normaderm-soin', 'Vichy', 'Soin double-correction quotidien pour peaux à tendance acnéique. Purifie, corrige les imperfections et hydrate.', 'Aqua / Water, Glycerin, Salicylic Acid, Isononyl Isononanoate, Butylene Glycol, Kaolin, Zinc Sulfate, Bifida Ferment Lysate, Sodium Hydroxide, Sodium Polyacrylate, Sodium Hyaluronate.', 'Appliquer matin et soir sur le visage préalablement nettoyé, en évitant le contour des yeux.', 139.00, NULL, 15, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80', 0, 0, '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(10, 4, 8, 'Vitamine C 1000mg Vitarock', 'vitamine-c-1000mg-vitarock', 'Vitarock', 'Complément alimentaire riche en Vitamine C pour booster l\'immunité et réduire la fatigue.', 'Vitamine C (acide ascorbique), cellulose, stéarate de magnésium végétal, silice.', 'Prendre 1 comprimé par jour avec un grand verre d\'eau, de préférence le matin.', 90.00, 79.00, 60, 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80', 1, 0, '2026-06-22 21:11:03', '2026-06-22 21:11:03');

-- --------------------------------------------------------

--
-- Structure de la table `promotions`
--

CREATE TABLE `promotions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `discount_percent` tinyint(3) UNSIGNED NOT NULL,
  `starts_at` date NOT NULL,
  `ends_at` date NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `promotions`
--

INSERT INTO `promotions` (`id`, `title`, `description`, `category_id`, `discount_percent`, `starts_at`, `ends_at`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Soldes Soins du Visage', 'Profitez de -20% sur toute la catégorie Soins du visage.', 2, 20, '2026-07-01', '2026-08-31', 1, '2026-06-22 21:11:03', '2026-06-22 21:11:03');

-- --------------------------------------------------------

--
-- Structure de la table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `reviews`
--

INSERT INTO `reviews` (`id`, `product_id`, `user_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 5, 'Idéal pour ma peau sensible, elle ne tiraille plus après le démaquillage. Je rachète depuis 2 ans.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(2, 1, 2, 4, 'Efficace et douce, mais le flacon se vide vite si on l\'utilise matin et soir.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(3, 2, 2, 4, 'Nettoie bien sans dessécher, ma peau à tendance grasse le supporte très bien.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(4, 2, 2, 5, 'Mes boutons ont clairement diminué après 3 semaines d\'utilisation quotidienne.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(5, 3, 2, 5, 'Un indispensable après le rasage, ça apaise immédiatement les rougeurs.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(6, 3, 2, 4, 'Pratique à emporter partout, même si le format est un peu encombrant en voyage.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(7, 4, 2, 5, 'La meilleure crème que j\'ai essayée pour ma peau atopique, absorption rapide.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(8, 4, 2, 4, 'Hydrate bien toute la journée, texture un peu riche pour l\'été.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(9, 5, 2, 5, 'Ma peau est visiblement plus repulpée depuis que je l\'utilise chaque matin.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(10, 5, 2, 3, 'Bon produit mais le prix reste élevé par rapport à d\'autres sérums similaires.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(11, 6, 2, 5, 'Sent divinement bon et hydrate cheveux, visage et corps en une seule huile.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(12, 6, 2, 4, 'Un peu grasse au toucher au début mais pénètre bien après quelques secondes.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(13, 7, 2, 4, 'Parfaite pour ma peau réactive, aucune irritation depuis que je l\'utilise.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(14, 7, 2, 5, 'Ma dermatologue me l\'a conseillée, résultat au top pour les rougeurs.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(15, 8, 2, 5, 'Apaise vraiment les démangeaisons de mon fils en quelques minutes.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(16, 8, 2, 4, 'Texture agréable et non collante, parfait pour toute la famille.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(17, 9, 2, 4, 'Diminue bien les points noirs, à utiliser en cure de 2 mois pour voir l\'effet.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(18, 9, 2, 3, 'Correct mais moins efficace que prévu sur mon acné hormonale.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(19, 10, 2, 5, 'Je sens vraiment moins de fatigue depuis que j\'en prends chaque matin.', '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(20, 10, 2, 4, 'Comprimés faciles à avaler, bon rapport qualité-prix pour une cure de 3 mois.', '2026-06-22 21:11:03', '2026-06-22 21:11:03');

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'client',
  `loyalty_points` int(11) NOT NULL DEFAULT 0,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `role`, `loyalty_points`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin Pharmacie', 'admin@pharmacie-benmoussaabbes.ma', '0522123456', 'admin', 0, NULL, '$2y$12$Fyv/M/n8pa7vP2qSOXjx2OUb2z892tjMzv/s95.sHhDP5LoZNepAa', NULL, '2026-06-22 21:11:03', '2026-06-22 21:11:03'),
(2, 'Ahmed El Amrani', 'client@example.com', '0522123456', 'client', 0, NULL, '$2y$12$lOnu.VdT5JWN9sO52TN87OnXv5QAMRHvE4NxPYxmAzz/WaOv4ZHou', NULL, '2026-06-22 21:11:03', '2026-06-22 21:11:03');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `brands_slug_unique` (`slug`);

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Index pour la table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_slug_unique` (`slug`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_number_unique` (`order_number`),
  ADD KEY `orders_user_id_foreign` (`user_id`);

--
-- Index pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_slug_unique` (`slug`),
  ADD KEY `products_category_id_foreign` (`category_id`),
  ADD KEY `products_brand_id_foreign` (`brand_id`);

--
-- Index pour la table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `promotions_category_id_foreign` (`category_id`);

--
-- Index pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_product_id_foreign` (`product_id`),
  ADD KEY `reviews_user_id_foreign` (`user_id`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `promotions`
--
ALTER TABLE `promotions`
  ADD CONSTRAINT `promotions_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
