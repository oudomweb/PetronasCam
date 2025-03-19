-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 19, 2025 at 03:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `invoices-project`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_stock_transfer`
--

CREATE TABLE `admin_stock_transfer` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `qty_transferred` int(11) NOT NULL,
  `date_transferred` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `parentId` int(20) DEFAULT NULL,
  `status` tinyint(1) NOT NULL,
  `CreateAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `description`, `parentId`, `status`, `CreateAt`) VALUES
(24, 'ប្រេងម៉ាស៊ូត(Do)', 'Cambodia', NULL, 1, '2024-09-08 16:47:56'),
(31, 'ប្រេងសាំងស៊ុបពែរ(Super)', 'Cambodia', NULL, 1, '2024-11-29 01:13:29'),
(32, 'ប្រេងសាំងធម្មតា(EA)', 'Cambodia', NULL, 1, '2024-11-29 01:13:48'),
(40, 'ហ្កាស(LPG)', 'Cambodia', NULL, 1, '2025-03-09 16:37:51');

-- --------------------------------------------------------

--
-- Table structure for table `currency`
--

CREATE TABLE `currency` (
  `id` int(11) NOT NULL,
  `code` varchar(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `symbol` varchar(10) DEFAULT NULL,
  `exchange_rate` decimal(10,4) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_default` tinyint(1) DEFAULT 0,
  `country_code` varchar(5) DEFAULT NULL,
  `decimal_places` int(11) DEFAULT 2
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `currency`
--

INSERT INTO `currency` (`id`, `code`, `name`, `symbol`, `exchange_rate`, `is_active`, `created_by`, `created_at`, `updated_at`, `is_default`, `country_code`, `decimal_places`) VALUES
(1, 'USD', 'United States Dollar', '$', 1.0000, 1, NULL, '2025-01-13 10:49:55', '2025-01-13 10:49:55', 1, 'US', 2),
(2, 'EUR', 'Euro', '€', 0.9200, 1, NULL, '2025-01-13 10:49:55', '2025-01-13 10:49:55', 0, 'EU', 2),
(3, 'JPY', 'Japanese Yen', '¥', 110.0000, 1, NULL, '2025-01-13 10:49:55', '2025-01-13 10:49:55', 0, 'JP', 0),
(4, 'GBP', 'British Pound', '£', 0.7800, 1, NULL, '2025-01-13 10:49:55', '2025-01-13 10:49:55', 0, 'GB', 2),
(5, 'AUD', 'Australian Dollar', 'A$', 1.3000, 1, NULL, '2025-01-13 10:49:55', '2025-01-13 10:49:55', 0, 'AU', 2),
(6, 'CAD', 'Canadian Dollar', 'C$', 1.2000, 1, NULL, '2025-01-13 10:49:55', '2025-01-13 10:49:55', 0, 'CA', 2),
(7, 'CHF', 'Swiss Franc', 'CHF', 1.0100, 1, NULL, '2025-01-13 10:49:55', '2025-01-13 10:49:55', 0, 'CH', 2),
(8, 'CNY', 'Chinese Yuan', '¥', 6.7000, 1, NULL, '2025-01-13 10:49:55', '2025-01-13 10:49:55', 0, 'CN', 2),
(9, 'INR', 'Indian Rupee', '₹', 74.0000, 1, NULL, '2025-01-13 10:49:55', '2025-01-13 10:49:55', 0, 'IN', 2),
(10, 'SGD', 'Singapore Dollar', 'S$', 1.3600, 1, NULL, '2025-01-13 10:49:55', '2025-01-13 10:49:55', 0, 'SG', 2),
(11, 'KHR', 'Cambodian Riel', '៛', 4100.0000, 1, NULL, '2025-01-13 10:52:24', '2025-01-13 10:52:24', 0, 'KH', 0);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `tel` varchar(18) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `type` varchar(120) DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(120) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `name`, `tel`, `email`, `address`, `type`, `create_by`, `create_at`, `user_id`) VALUES
(47, 'Michael Lee', '999888777', 'michaell@example.com', '404 Elm Ln', 'premium', NULL, '2024-12-03 03:28:25', NULL),
(48, 'Sarah White', '333444555', 'sarahw@example.com', '505 Spruce Ct', 'regular', NULL, '2024-12-03 03:28:25', NULL),
(49, 'David Clark', '222111000', 'davidc@example.com', '606 Fir St', 'premium', NULL, '2024-12-03 03:28:25', NULL),
(50, 'Sophia Taylor', '777666555', 'sophiat@example.com', '707 Poplar Pl', 'regular', NULL, '2024-12-03 03:28:25', NULL),
(51, 'Liam Harris', '888999000', 'liamh@example.com', '808 Walnut Way', 'premium', NULL, '2024-12-03 03:28:25', NULL),
(52, 'Olivia Martinez', '000999888', 'oliviam@example.com', '909 Ash Dr', 'regular', NULL, '2024-12-03 03:28:25', NULL),
(54, 'Emma Robinson', '222444333', 'emmar@example.com', '1111 Willow Rd', 'premium', NULL, '2024-12-03 03:28:25', NULL),
(55, 'Mason Walker', '444666555', 'masonw@example.com', '1212 Hickory Ct', 'regular', NULL, '2024-12-03 03:28:25', NULL),
(56, 'Isabella Young', '555777888', 'isabellay@example.com', '1313 Alder Ln', 'premium', NULL, '2024-12-03 03:28:25', NULL),
(57, 'James Hall', '666888777', 'jamesh@example.com', '1414 Holly St', 'regular', NULL, '2024-12-03 03:28:25', NULL),
(58, 'Ava King', '999000111', 'avak@example.com', '1515 Laurel Pl', 'regular', NULL, '2024-12-03 03:28:25', NULL),
(59, 'Benjamin Wright', '333222444', 'benjaminw@example.com', '1616 Pine Ct', 'premium', NULL, '2024-12-03 03:28:25', NULL),
(63, 'phearun', '09772969715', 'phearun@gmail.com', '#123 pp', 'VIP2', NULL, '2024-12-03 04:35:01', NULL),
(77, 'test', '00000001', 'testcustomer@gmail.com', '#123 pp', 'VIP', 'Phearun', '2025-03-01 11:34:07', 60),
(82, 'UserSystem', '0977296972', 'usersystem@gmail.com', '#123 st bt kpl', 'VIP', 'UserSystem', '2025-03-02 06:25:30', 60),
(83, 'Ah run ', '9086521212345', 'heng56724613451@gmail.com', '#123 st bt', 'VIP', 'AdminSystem', '2025-03-05 01:30:46', 60),
(84, 'Customer', '000000000099999', 'heng000098777@gmail.com', '#123 st bt kpl', 'VIP', 'AdminSystem', '2025-03-05 01:33:16', 60),
(85, 'Bro Run', '123123122323', 'hen232g@gmail.com', '#123 st bt kpl', 'VIP1', 'AdminSystem', '2025-03-06 00:37:36', 3),
(86, 'Send to User', '09772969750', 'heng544@gmail.com', '#123 st bt kpl', 'VIP', 'AdminSystem', '2025-03-06 15:01:04', 60),
(87, 'សាឋា', '093 822 282', 'kampongthombranch@gmail.com', 'ខេត្តកំពង់ធំ', 'សាខាចែកចាយ', 'AdminSystem', '2025-03-10 00:40:29', 3),
(94, 'Macbook Air M2', '0977296975', 'johndoe@example.com', 'ភូមិកំពង់ស្រឡៅ ឃុំកំពង់ស្រឡៅមួយ ស្រុកឆែប ខេត្តព្រះវិហារ1', 'VIP', 'AdminSystem', '2025-03-19 14:40:26', 3);

-- --------------------------------------------------------

--
-- Table structure for table `customer_seller`
--

CREATE TABLE `customer_seller` (
  `customer_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `customer_address` text DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `salary` varchar(255) NOT NULL,
  `code` varchar(20) DEFAULT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `create_by` varchar(50) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `gender` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `name`, `position`, `salary`, `code`, `tel`, `email`, `address`, `website`, `note`, `create_by`, `create_at`, `gender`) VALUES
(17, 'Chiva', 'HR', '790', NULL, '0977296971', 'henqg@gmail.com', '#123 PP', NULL, NULL, 'AdminSystem', '2025-03-19 12:10:45', 1);

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `expense_type_id` int(11) DEFAULT NULL,
  `ref_no` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `amount` decimal(7,2) DEFAULT 0.00,
  `remark` text DEFAULT NULL,
  `expense_date` datetime DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `expense`
--

INSERT INTO `expense` (`id`, `expense_type_id`, `ref_no`, `name`, `amount`, `remark`, `expense_date`, `create_by`, `create_at`) VALUES
(20, 10, 'EXP010', 'AC Maintenance', 75.00, 'Quarterly service', '2025-02-08 00:00:00', 'admin', '2025-01-08 16:06:22'),
(23, 1, 'REF00333', 'Macbook Air M2', 1000.00, NULL, '2025-02-18 00:00:00', 'AdminSystem', '2025-02-18 02:24:45'),
(24, 1, 'REF00333', 'Printer', 2000.00, NULL, '2025-01-18 00:00:00', 'AdminSystem', '2025-03-18 07:22:04'),
(26, 4, 'REF00333', 'Chiva', 1800.00, NULL, '2025-01-18 00:00:00', 'AdminSystem', '2025-03-18 15:49:30'),
(27, 1, 'REF00333', 'Macbook Air M2', 8900.00, NULL, '2025-03-18 00:00:00', 'AdminSystem', '2025-03-18 16:03:12');

-- --------------------------------------------------------

--
-- Table structure for table `expense_type`
--

CREATE TABLE `expense_type` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `expense_type`
--

INSERT INTO `expense_type` (`id`, `name`, `code`) VALUES
(1, 'Office Supplies', 'ET001'),
(2, 'Travel Expenses', 'ET002'),
(3, 'Utility Bills', 'ET003'),
(4, 'Employee Salaries', 'ET004'),
(5, 'Marketing Costs', 'ET005'),
(6, 'Maintenance', 'ET006'),
(7, 'Training Programs', 'ET007'),
(8, 'Subscriptions', 'ET008'),
(9, 'Insurance', 'ET009'),
(10, 'Miscellaneous', 'ET010');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_name`, `unit_price`, `quantity`, `subtotal`) VALUES
(1, 1, 'Diesel', 16.00, 1000, 16000.00),
(2, 1, 'EA32', 12.00, 1000, 12000.00);

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `order_no` varchar(120) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_amount` decimal(6,0) NOT NULL DEFAULT 0,
  `paid_amount` decimal(7,2) NOT NULL DEFAULT 0.00,
  `payment_method` varchar(120) NOT NULL,
  `remark` text DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_due` decimal(10,2) DEFAULT 0.00,
  `payment_status` enum('Paid','Unpaid','Partial') DEFAULT 'Unpaid'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `order_no`, `customer_id`, `user_id`, `total_amount`, `paid_amount`, `payment_method`, `remark`, `create_by`, `create_at`, `total_due`, `payment_status`) VALUES
(143, 'INV001', 82, 60, 174, 173.72, 'Wing', NULL, 'UserSystem', '2025-01-02 06:25:45', 0.00, 'Unpaid'),
(144, 'INV144', 82, 60, 1, 0.89, 'Wing', NULL, 'UserSystem', '2025-01-04 04:29:54', 0.00, 'Unpaid'),
(145, 'INV145', 84, 60, 177, 176.75, 'Wing', NULL, 'UserSystem', '2025-01-05 01:53:21', 0.00, 'Unpaid'),
(146, 'INV146', 84, 60, 1666, 1665.75, 'Cash', NULL, 'UserSystem', '2025-01-05 02:32:23', 0.00, 'Unpaid'),
(147, 'INV147', 84, 60, 91, 90.75, 'Wing', NULL, 'UserSystem', '2025-01-06 00:36:29', 0.00, 'Unpaid'),
(148, 'INV148', 85, 3, 182, 181.80, 'Wing', NULL, 'AdminSystem', '2025-01-06 00:37:58', 0.00, 'Unpaid'),
(149, 'INV149', 83, 60, 91, 90.75, 'ABA', NULL, 'UserSystem', '2025-01-06 01:02:52', 0.00, 'Unpaid'),
(150, 'INV150', 85, 3, 455, 455.40, 'Wing', NULL, 'AdminSystem', '2025-02-06 02:58:07', 0.00, 'Unpaid'),
(151, 'INV151', 85, 3, 722, 721.80, 'Wing', NULL, 'AdminSystem', '2025-02-06 15:00:32', 0.00, 'Unpaid'),
(152, 'INV152', 86, 60, 10, 9.58, 'Wing', NULL, 'UserSystem', '2025-02-06 15:01:50', 0.00, 'Unpaid'),
(153, 'INV153', 85, 3, 166, 165.64, 'Wing', NULL, 'AdminSystem', '2025-02-09 14:17:26', 0.00, 'Unpaid'),
(154, 'INV154', 85, 3, 445890, 99999.99, 'Wing', NULL, 'AdminSystem', '2025-02-10 03:24:52', 0.00, 'Unpaid'),
(155, 'INV155', 85, 3, 890, 890.00, 'Cash', NULL, 'AdminSystem', '2025-02-11 14:45:56', 0.00, 'Unpaid'),
(156, 'INV156', 85, 3, 8227, 8226.89, 'Wing', NULL, 'AdminSystem', '2025-02-11 16:08:39', 0.00, 'Unpaid'),
(157, 'INV157', 85, 3, 8227, 8227.00, 'Wing', NULL, 'AdminSystem', '2025-02-12 01:35:21', 0.00, 'Unpaid'),
(158, 'INV158', 87, 3, 24830, 24830.00, 'Wing', NULL, 'AdminSystem', '2025-01-12 02:14:42', 0.00, 'Unpaid'),
(159, 'INV159', 87, 3, 74491, 74491.00, 'Wing', NULL, 'AdminSystem', '2025-01-12 03:11:29', 0.00, 'Unpaid'),
(160, 'INV160', 87, 3, 7405, 7405.00, 'Wing', NULL, 'AdminSystem', '2025-01-12 03:50:00', 0.00, 'Unpaid'),
(161, 'INV161', 87, 3, 7569, 7569.00, 'Wing', NULL, 'AdminSystem', '2025-03-12 03:59:42', 0.00, 'Unpaid'),
(162, 'INV162', 85, 3, 14224, 14889.00, 'Wing', NULL, 'AdminSystem', '2025-03-12 04:12:50', 0.00, 'Unpaid'),
(163, 'INV163', 87, 3, 21464, 21464.00, 'ABA', NULL, 'AdminSystem', '2025-03-12 04:24:50', 0.00, 'Unpaid'),
(164, 'INV164', 87, 3, 21464, 21464.00, 'Wing', NULL, 'AdminSystem', '2025-03-12 04:28:03', 0.00, 'Unpaid'),
(165, 'INV165', 87, 3, 21464, 21464.00, 'ABA', NULL, 'AdminSystem', '2025-03-12 04:32:12', 0.00, 'Unpaid'),
(166, 'INV166', 77, 60, 82269, 82269.00, 'Cash', NULL, 'UserSystem', '2025-03-12 13:11:08', 0.00, 'Unpaid'),
(167, 'INV167', 86, 60, 8227, 8227.00, 'Wing', NULL, 'UserSystem', '2025-03-12 14:01:16', 0.00, 'Unpaid'),
(168, 'INV168', 82, 60, 748, 748.00, 'Wing', NULL, 'UserSystem', '2025-03-12 14:12:52', 0.00, 'Unpaid'),
(169, 'INV169', 77, 60, 246807, 99999.99, 'Wing', NULL, 'UserSystem', '2025-03-12 14:34:49', 0.00, 'Unpaid'),
(170, 'INV170', 85, 3, 1, 1.00, 'Wing', 'No remark', 'AdminSystem', '2025-03-13 15:35:45', 0.00, 'Unpaid'),
(171, 'INV171', 87, 3, 8227, 8227.00, 'Wing', 'No remark', 'AdminSystem', '2025-03-13 15:36:20', 0.00, 'Unpaid'),
(172, 'INV172', 85, 3, 13468, 13468.00, 'ABA', 'No remark', 'AdminSystem', '2025-03-13 15:36:47', 0.00, 'Unpaid'),
(173, 'INV173', 87, 3, 21464, 21464.00, 'Wing', 'No remark', 'AdminSystem', '2025-03-13 15:37:43', 0.00, 'Unpaid'),
(174, 'INV174', 85, 3, 21464, 21464.00, 'Wing', 'No remark', 'AdminSystem', '2024-03-13 15:47:12', 0.00, 'Unpaid'),
(175, 'INV175', 85, 3, 8227, 8227.00, 'Wing', 'No remark', 'AdminSystem', '2024-03-14 06:18:41', 0.00, 'Unpaid'),
(176, 'INV176', 85, 3, 8302, 8302.00, 'Wing', 'No remark', 'AdminSystem', '2024-03-14 14:46:20', 0.00, 'Unpaid'),
(177, 'INV177', 85, 3, 83, 83.00, 'Wing', 'No remark', 'AdminSystem', '2024-03-14 14:55:41', 0.00, 'Unpaid'),
(178, 'INV178', 85, 3, 823, 823.00, 'Wing', 'No remark', 'AdminSystem', '2024-03-15 03:35:43', 0.00, 'Unpaid'),
(179, 'INV179', 87, 3, 8227, 8227.00, 'Wing', 'No remark', 'AdminSystem', '2025-03-18 17:35:14', 0.00, 'Unpaid'),
(180, 'INV180', 85, 3, 8227, 8227.00, 'ABA', 'No remark', 'AdminSystem', '2025-03-19 11:16:00', 0.00, 'Unpaid'),
(181, 'INV181', 85, 3, 82, 10.00, 'Wing', 'No remark', 'AdminSystem', '2025-03-19 14:03:49', 0.00, 'Unpaid'),
(182, 'INV182', 85, 3, 8, 34566.00, 'Wing', 'No remark', 'AdminSystem', '2025-03-19 14:06:22', 0.00, 'Unpaid'),
(183, 'INV183', 94, 3, 748, 48.00, 'Wing', 'No remark', 'AdminSystem', '2025-03-19 14:40:58', 0.00, 'Unpaid'),
(184, 'INV184', 94, 3, 257, 25.00, 'Wing', 'No remark', 'AdminSystem', '2025-03-19 14:45:53', 0.00, 'Unpaid');

-- --------------------------------------------------------

--
-- Table structure for table `order_detail`
--

CREATE TABLE `order_detail` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `qty` int(6) DEFAULT 0,
  `price` decimal(7,2) DEFAULT 0.00,
  `discount` decimal(7,2) DEFAULT 0.00,
  `total` decimal(30,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `order_detail`
--

INSERT INTO `order_detail` (`id`, `order_id`, `product_id`, `qty`, `price`, `discount`, `total`) VALUES
(228, 167, 98, 11000, 890.00, 0.00, 99999.99),
(229, 168, 98, 1000, 890.00, 0.00, 99999.99),
(230, 169, 97, 330000, 890.00, 0.00, 99999.99),
(238, 174, 100, 16000, 1150.00, 0.00, 18400000.00),
(244, 179, 102, 11000, 890.00, 0.00, 9790000.00),
(246, 181, 102, 110, 890.00, 0.00, 97900.00),
(247, 182, 102, 11, 890.00, 0.00, 9790.00),
(248, 183, 102, 1000, 890.00, 0.00, 890000.00),
(249, 184, 102, 344, 890.00, 0.00, 306160.00);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `group` varchar(255) NOT NULL,
  `is_menu_web` varchar(255) DEFAULT NULL,
  `web_route_key` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `group`, `is_menu_web`, `web_route_key`) VALUES
(165, 'dashboard.getlist', 'dashboard', '1', '/'),
(166, 'invoices.getlist', 'invoices', '1', '/invoices'),
(167, 'customer.getlist', 'customer', '1', '/customer'),
(168, 'customer.getone', 'customer', NULL, NULL),
(169, 'customer.create', 'customer', NULL, NULL),
(170, 'customer.update', 'customer', NULL, NULL),
(171, 'customer.remove', 'customer', NULL, NULL),
(172, 'category.getlist', 'category', '1', '/category'),
(173, 'category.getone', 'category', NULL, NULL),
(174, 'category.create', 'category', NULL, NULL),
(175, 'category.update', 'category', NULL, NULL),
(176, 'category.remove', 'category', NULL, NULL),
(177, 'order.getlist', 'order', '1', '/order'),
(178, 'order.getone', 'order', NULL, NULL),
(179, 'order.create', 'order', NULL, NULL),
(180, 'order.update', 'order', NULL, NULL),
(181, 'order.remove', 'order', NULL, NULL),
(182, 'total_due.getlist', 'total_due', '1', '/total_due'),
(183, 'total_due.getone', 'total_due', NULL, NULL),
(184, 'total_due.create', 'total_due', NULL, NULL),
(185, 'total_due.update', 'total_due', NULL, NULL),
(186, 'total_due.remove', 'total_due', NULL, NULL),
(187, 'product.getlist', 'product', '1', '/product'),
(188, 'product.getone', 'product', NULL, NULL),
(189, 'product.create', 'product', NULL, NULL),
(190, 'product.update', 'product', NULL, NULL),
(191, 'product.remove', 'product', NULL, NULL),
(192, 'user.getlist', 'user', '1', '/user'),
(193, 'user.getone', 'user', NULL, NULL),
(194, 'user.create', 'user', NULL, NULL),
(195, 'user.update', 'user', NULL, NULL),
(196, 'user.remove', 'user', NULL, NULL),
(197, 'role.getlist', 'role', '1', '/role'),
(198, 'role.getone', 'role', NULL, NULL),
(199, 'role.create', 'role', NULL, NULL),
(200, 'role.update', 'role', NULL, NULL),
(201, 'role.remove', 'role', NULL, NULL),
(202, 'supplier.getlist', 'supplier', '1', '/supplier'),
(203, 'supplier.getone', 'supplier', NULL, NULL),
(204, 'supplier.create', 'supplier', NULL, NULL),
(205, 'supplier.update', 'supplier', NULL, NULL),
(206, 'supplier.remove', 'supplier', NULL, NULL),
(207, 'employee.getlist', 'employee', '1', '/employee'),
(208, 'employee.getone', 'employee', NULL, NULL),
(209, 'employee.create', 'employee', NULL, NULL),
(210, 'employee.update', 'employee', NULL, NULL),
(211, 'employee.remove', 'employee', NULL, NULL),
(212, 'expanse_type.getlist', 'expanse_type', '1', '/expanse_type'),
(213, 'expanse_type.getone', 'expanse_type', NULL, NULL),
(214, 'expanse_type.create', 'expanse_type', NULL, NULL),
(215, 'expanse_type.update', 'expanse_type', NULL, NULL),
(216, 'expanse_type.remove', 'expanse_type', NULL, NULL),
(217, 'expanse.getlist', 'expanse', '1', '/expanse'),
(218, 'expanse.getone', 'expanse', NULL, NULL),
(219, 'expanse.create', 'expanse', NULL, NULL),
(220, 'expanse.update', 'expanse', NULL, NULL),
(221, 'expanse.remove', 'expanse', NULL, NULL),
(222, 'report_Sale_Summary.getlist', 'report_Sale_Summary', '1', '/report_Sale_Summary'),
(223, 'report_Sale_Summary.getone', 'report_Sale_Summary', NULL, NULL),
(224, 'report_Sale_Summary.create', 'report_Sale_Summary', NULL, NULL),
(225, 'report_Sale_Summary.update', 'report_Sale_Summary', NULL, NULL),
(226, 'report_Sale_Summary.remove', 'report_Sale_Summary', NULL, NULL),
(227, 'report_Expense_Summary.getlist', 'report_Expense_Summary', '1', '/report_Expense_Summary'),
(228, 'report_Expense_Summary.getone', 'report_Expense_Summary', NULL, NULL),
(229, 'report_Expense_Summary.create', 'report_Expense_Summary', NULL, NULL),
(230, 'report_Expense_Summary.update', 'report_Expense_Summary', NULL, NULL),
(231, 'report_Expense_Summary.remove', 'report_Expense_Summary', NULL, NULL),
(232, 'purchase_Summary.getlist', 'purchase_Summary', '1', '/purchase_Summary'),
(233, 'purchase_Summary.getone', 'purchase_Summary', NULL, NULL),
(234, 'purchase_Summary.create', 'purchase_Summary', NULL, NULL),
(235, 'purchase_Summary.update', 'purchase_Summary', NULL, NULL),
(236, 'purchase_Summary.remove', 'purchase_Summary', NULL, NULL),
(237, 'report_Customer.getlist', 'report_Customer', '1', '/report_Customer'),
(238, 'report_Customer.getone', 'report_Customer', NULL, NULL),
(239, 'report_Customer.create', 'report_Customer', NULL, NULL),
(240, 'report_Customer.update', 'report_Customer', NULL, NULL),
(241, 'report_Customer.remove', 'report_Customer', NULL, NULL),
(242, 'Top_Sale.getlist', 'Top_Sale', '1', '/Top_Sale'),
(243, 'Top_Sale.getone', 'Top_Sale', NULL, NULL),
(244, 'Top_Sale.create', 'Top_Sale', NULL, NULL),
(245, 'Top_Sale.update', 'Top_Sale', NULL, NULL),
(246, 'Top_Sale.remove', 'Top_Sale', NULL, NULL),
(247, 'user.profile.get', 'user', '1', '/profile'),
(248, 'user.profile.update', 'user', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permission_roles`
--

CREATE TABLE `permission_roles` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `permission_roles`
--

INSERT INTO `permission_roles` (`role_id`, `permission_id`) VALUES
(1, 165),
(1, 166),
(25, 166),
(1, 167),
(25, 167),
(1, 168),
(1, 169),
(1, 170),
(1, 171),
(1, 172),
(1, 173),
(1, 174),
(1, 175),
(1, 176),
(1, 177),
(25, 177),
(1, 178),
(1, 179),
(1, 180),
(1, 181),
(1, 182),
(1, 183),
(1, 184),
(1, 185),
(1, 186),
(1, 187),
(25, 187),
(1, 188),
(1, 189),
(1, 190),
(1, 191),
(1, 192),
(1, 193),
(1, 194),
(1, 195),
(1, 196),
(1, 197),
(1, 198),
(1, 199),
(1, 200),
(1, 201),
(1, 202),
(1, 203),
(1, 204),
(1, 205),
(1, 206),
(1, 207),
(1, 208),
(1, 209),
(1, 210),
(1, 211),
(1, 212),
(1, 213),
(1, 214),
(1, 215),
(1, 216),
(1, 217),
(1, 218),
(1, 219),
(1, 220),
(1, 221),
(1, 222),
(1, 223),
(1, 224),
(1, 225),
(1, 226),
(1, 227),
(1, 228),
(1, 229),
(1, 230),
(1, 231),
(1, 232),
(1, 233),
(1, 234),
(1, 235),
(1, 236),
(1, 237),
(1, 238),
(1, 239),
(1, 240),
(1, 241),
(1, 242),
(1, 243),
(1, 244),
(1, 245),
(1, 246),
(1, 247),
(25, 247),
(1, 248),
(25, 248);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `barcode` varchar(120) NOT NULL,
  `name` varchar(120) NOT NULL,
  `brand` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `qty` int(6) NOT NULL DEFAULT 0,
  `price` decimal(7,2) NOT NULL DEFAULT 0.00,
  `actual_price` int(255) DEFAULT NULL,
  `discount` decimal(3,2) DEFAULT 0.00,
  `status` tinyint(1) DEFAULT 0,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `unit` varchar(50) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `company_name` varchar(250) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `category_id`, `barcode`, `name`, `brand`, `description`, `qty`, `price`, `actual_price`, `discount`, `status`, `create_by`, `create_at`, `unit`, `unit_price`, `company_name`, `user_id`) VALUES
(62, 32, 'P062', 'ប្រេងឥន្ធនះ', 'petronas-malaysia', NULL, 9788, 0.00, NULL, 0.00, 1, 'Koka', '2025-02-26 15:22:03', 'lite', 0.86, 'sok-kong-imp-exp', 0),
(67, 24, 'P067', 'ប្រេងឥន្ធនះ', 'petronas-cambodia', NULL, 9878, 0.00, NULL, 0.00, 1, 'Chiva001', '2025-02-28 18:52:36', 'lite', 999.00, 'lhr-asean-investment', NULL),
(71, 31, 'P071', 'ប្រេងឥន្ធនះ', 'petronas-cambodia', 'OK', 88597, 0.00, NULL, 0.00, 1, 'Heava', '2025-03-01 02:50:29', 'lite', 0.90, 'petronas-cambodia-ltd', 17),
(72, 24, 'P072', 'ប្រេងឥន្ធនះ', 'petronas-malaysia', 'ok', 896665, 0.00, NULL, 9.99, 1, 'Heava', '2025-03-01 02:51:04', 'lite', 0.88, 'lim-long', 17),
(73, 31, 'P073', 'ប្រេងឥន្ធនះ', 'petronas-cambodia', NULL, 6178, 0.00, NULL, 9.99, 1, 'Chiva001', '2025-03-01 03:19:21', 'lite', 0.90, 'kampuchea-tela-ltd', 1),
(74, 31, 'P074', 'ប្រេងឥន្ធនះ', 'petronas-cambodia', NULL, 88998, 0.00, NULL, 0.00, 1, 'Ah run ', '2025-03-01 17:54:00', 'lite', 0.90, 'petronas-cambodia-ltd', 52),
(75, 32, 'P075', 'ប្រេងឥន្ធនះ', 'petronas-cambodia', 'rtyi', 599, 0.00, NULL, NULL, 1, 'Ah run ', '2025-03-01 21:14:26', 'lite', 0.95, 'kampuchea-tela-ltd', 52),
(95, 24, 'P089', 'oil', '', NULL, 11000, 0.00, 1190, NULL, 1, 'UserSystem', '2025-03-12 13:24:54', 'liter', 890.00, 'petronas-cambodia', 60),
(96, 24, 'P096', 'oil', '', NULL, 11000, 0.00, 1190, NULL, NULL, 'UserSystem', '2025-03-12 13:25:30', 'liter', 890.00, 'kampuchea-tela-ltd', 60),
(97, 24, 'P097', 'oil', '', NULL, 319000, 0.00, 1190, NULL, 1, 'UserSystem', '2025-03-12 13:43:22', 'liter', 890.00, 'petronas-cambodia', 60),
(98, 40, 'P098', 'oil', '', NULL, 0, 0.00, 1190, NULL, 1, 'UserSystem', '2025-03-12 13:53:29', 'liter', 890.00, 'kampuchea-tela-ltd', 60),
(100, 24, 'P100', 'oil', '', NULL, 100, 0.00, 1390, 0.00, 1, 'AdminSystem', '2025-03-13 15:40:24', 'liter', 1150.00, 'lim-long', 3),
(102, 24, 'P102', 'oil', '', NULL, 9535, 0.00, 1190, 0.00, NULL, 'AdminSystem', '2025-03-15 09:41:45', 'liter', 890.00, 'kampuchea-tela-ltd', 3);

-- --------------------------------------------------------

--
-- Table structure for table `product_delivery_notes`
--

CREATE TABLE `product_delivery_notes` (
  `id` int(11) NOT NULL,
  `depot` varchar(255) DEFAULT NULL,
  `pdn_no` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `release_order_no` varchar(50) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `customer_address` text DEFAULT NULL,
  `delivery_address` text DEFAULT NULL,
  `product_code` varchar(50) DEFAULT NULL,
  `product_description` varchar(255) DEFAULT NULL,
  `pack` varchar(50) DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `payment_mode` varchar(50) DEFAULT NULL,
  `prepared_by` varchar(255) DEFAULT NULL,
  `delivered_by` varchar(255) DEFAULT NULL,
  `filled_by` varchar(255) DEFAULT NULL,
  `security_checked` varchar(255) DEFAULT NULL,
  `approved_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `product_delivery_notes`
--

INSERT INTO `product_delivery_notes` (`id`, `depot`, `pdn_no`, `date`, `release_order_no`, `phone`, `customer_address`, `delivery_address`, `product_code`, `product_description`, `pack`, `unit`, `quantity`, `total_amount`, `payment_mode`, `prepared_by`, `delivered_by`, `filled_by`, `security_checked`, `approved_by`, `created_at`) VALUES
(1, 'Depot A', 'PDN12345', '2025-03-02', 'RO67890', '0123456789', '123 Customer St', '456 Delivery St', 'PROD001', 'Sample Product', 'Pack A', 'Unit B', 100, 500.00, 'Cash', 'John Doe', 'Jane Doe', 'Alice', 'Bob', 'Charlie', '2025-03-02 08:20:00');

-- --------------------------------------------------------

--
-- Table structure for table `purchase`
--

CREATE TABLE `purchase` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `ref` varchar(255) NOT NULL,
  `shipp_company` varchar(255) DEFAULT NULL,
  `shipp_cost` decimal(7,2) DEFAULT 0.00,
  `paid_amount` decimal(7,2) DEFAULT 0.00,
  `paid_date` datetime DEFAULT NULL,
  `status` varchar(120) DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `purchase`
--

INSERT INTO `purchase` (`id`, `supplier_id`, `ref`, `shipp_company`, `shipp_cost`, `paid_amount`, `paid_date`, `status`, `create_by`, `create_at`) VALUES
(3, 101, 'REF001', 'DHL', 25.00, 500.00, '2025-01-10 00:00:00', 'Completed', 'Admin', '2025-01-13 00:53:22'),
(4, 102, 'REF002', 'FedEx', 30.00, 750.00, '2025-01-11 00:00:00', 'Pending', 'Admin', '2025-01-13 00:53:22'),
(5, 101, 'REF001', 'DHL', 25.00, 500.00, '2025-01-10 00:00:00', 'Completed', 'Admin', '2025-01-10 03:00:00'),
(6, 102, 'REF002', 'FedEx', 30.00, 750.00, '2025-01-11 00:00:00', 'Pending', 'Admin', '2025-01-11 04:00:00'),
(7, 103, 'REF003', 'UPS', 20.00, 600.00, '2025-01-12 00:00:00', 'Completed', 'Admin', '2025-01-12 05:00:00'),
(8, 104, 'REF004', 'DHL', 25.00, 450.00, '2025-01-13 00:00:00', 'Completed', 'Admin', '2025-01-13 06:00:00'),
(9, 105, 'REF005', 'FedEx', 35.00, 800.00, '2025-01-14 00:00:00', 'Pending', 'Admin', '2025-01-14 07:00:00'),
(10, 106, 'REF006', 'UPS', 28.00, 700.00, '2025-01-15 00:00:00', 'Cancelled', 'Admin', '2025-01-15 08:00:00'),
(11, 101, 'REF007', 'DHL', 22.00, 400.00, '2025-01-16 00:00:00', 'Completed', 'Admin', '2025-01-16 09:00:00'),
(12, 102, 'REF008', 'FedEx', 27.00, 900.00, '2025-01-17 00:00:00', 'Completed', 'Admin', '2025-01-17 10:00:00'),
(13, 103, 'REF009', 'UPS', 24.00, 650.00, '2025-01-18 00:00:00', 'Pending', 'Admin', '2025-01-18 11:00:00'),
(14, 104, 'REF010', 'DHL', 30.00, 550.00, '2025-01-19 00:00:00', 'Completed', 'Admin', '2025-01-19 12:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_product`
--

CREATE TABLE `purchase_product` (
  `id` int(11) NOT NULL,
  `purchase_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT 0,
  `cost` decimal(7,2) DEFAULT 0.00,
  `discount` decimal(7,2) DEFAULT 0.00,
  `amount` decimal(7,2) DEFAULT 0.00,
  `retail_price` decimal(7,2) DEFAULT 0.00,
  `remark` text DEFAULT NULL,
  `status` varchar(120) DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `code` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `code`) VALUES
(1, 'Admin', 'admin'),
(25, 'User', 'user'),
(27, 'Chashei', 'Ch001');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `qty_sold` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `sale_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stock`
--

CREATE TABLE `stock` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_name` varchar(250) NOT NULL,
  `category_id` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(5,2) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `create_by` varchar(255) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `unit` varchar(50) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `stock`
--

INSERT INTO `stock` (`id`, `user_id`, `product_name`, `category_id`, `qty`, `barcode`, `brand`, `description`, `price`, `discount`, `status`, `create_by`, `create_at`, `unit`, `unit_price`, `last_updated`) VALUES
(6, 3, 'OIL', 31, 897, 'P063', 'petronas-cambodia', 'ok', 807.30, 0.00, 1, 'Phearun', '2025-02-28 18:26:16', 'lite', 0.90, '2025-02-28 18:26:16');

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `id` int(11) NOT NULL,
  `name` varchar(18) NOT NULL,
  `code` varchar(18) NOT NULL,
  `tel` varchar(18) NOT NULL,
  `email` varchar(120) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `website` varchar(120) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`id`, `name`, `code`, `tel`, `email`, `address`, `website`, `note`, `create_by`, `create_at`) VALUES
(101, 'Supplier A', 'SUP101', '+123456789', 'supplierA@example.com', '123 Street, City', 'https://supplierA.com', 'Preferred supplier for electronics', 'Admin', '2025-01-13 00:52:58'),
(102, 'Supplier B', 'SUP102', '+987654321', 'supplierB@example.com', '456 Avenue, City', 'https://supplierB.com', 'Frequent orders for office supplies', 'Admin', '2025-01-13 00:52:58'),
(103, 'Supplier C', 'SUP103', '+112233445', 'supplierC@example.com', '789 Boulevard, City', 'https://supplierC.com', 'Specializes in industrial equipment', 'Admin', '2025-01-13 00:52:58'),
(104, 'Supplier D', 'SUP104', '+998877665', 'supplierD@example.com', '321 Lane, City', 'https://supplierD.com', 'Reliable delivery for raw materials', 'Admin', '2025-01-13 00:57:34'),
(105, 'Supplier E', 'SUP105', '+556677889', 'supplierE@example.com', '654 Road, City', 'https://supplierE.com', 'Handles custom manufacturing', 'Admin', '2025-01-13 00:57:34'),
(106, 'Supplier F', 'SUP106', '+445566778', 'supplierF@example.com', '987 Park, City', 'https://supplierF.com', 'Bulk supplier for consumables', 'Admin', '2025-01-13 00:57:34');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `name` varchar(120) DEFAULT NULL,
  `username` varchar(225) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `address` varchar(220) DEFAULT NULL,
  `tel` varchar(255) NOT NULL,
  `branch_name` varchar(100) DEFAULT NULL,
  `barcode` int(250) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `role_id`, `name`, `username`, `password`, `is_active`, `create_by`, `create_at`, `address`, `tel`, `branch_name`, `barcode`, `profile_image`) VALUES
(3, 1, 'AdminSystem', 'pongchiva257@gmail.com', '$2b$10$QfVXPkO4l3M.s2zN9cAgwubuTBtDsMSG3xlbgqPOq4v0jPpoUfxme', 1, 'AdminSystem', '2025-03-19 03:13:48', 'ភូមិកំពង់ស្រឡៅ ឃុំកំពង់ស្រឡៅមួយ ស្រុកឆែប ខេត្តព្រះវិហារ', '0977296971', 'ស្នាក់ការកណ្តាល', NULL, NULL),
(60, 25, 'UserSystem', 'UserSystem@gmail.com', '$2b$10$NbScfeMAdp9nCx7vFDx6meBxEQSUeUKCeem291NMj2WKis9cfstcC', 1, 'AdminSystem', '2025-03-19 03:13:21', 'Chroy Chong pp', '0977296972', 'ស្នាក់ការកណ្តាល', NULL, 'upload_image-1742354001177-370416002'),
(66, 27, 'Macbook Air', 'chiva224000@gmail.com', '$2b$10$bH9w4gaGt/dUuPPrAeItNe/y2iX5n3wxE93.fK8bNeDEDwQW62RKa', NULL, 'AdminSystem', '2025-03-19 03:18:58', '#123 st bt kpl', '097729697111', 'Takeo', NULL, 'upload_image-1742354338772-174560519');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(3, 1),
(60, 25),
(66, 27);

-- --------------------------------------------------------

--
-- Table structure for table `user_stock`
--

CREATE TABLE `user_stock` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `qty` int(11) DEFAULT 0,
  `barcode` varchar(255) DEFAULT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT 0.00,
  `discount` decimal(5,2) DEFAULT 0.00,
  `status` enum('active','inactive') DEFAULT 'active',
  `image` varchar(255) DEFAULT NULL,
  `create_by` varchar(255) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `unit` varchar(50) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT 0.00,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_stock_transfer`
--
ALTER TABLE `admin_stock_transfer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `currency`
--
ALTER TABLE `currency`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_currency_code` (`code`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tel` (`tel`),
  ADD KEY `fk_customer_user` (`user_id`);

--
-- Indexes for table `customer_seller`
--
ALTER TABLE `customer_seller`
  ADD PRIMARY KEY (`customer_id`),
  ADD UNIQUE KEY `customer_email` (`customer_email`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expense_type_id` (`expense_type_id`);

--
-- Indexes for table `expense_type`
--
ALTER TABLE `expense_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proudct_id` (`product_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `permission_roles`
--
ALTER TABLE `permission_roles`
  ADD PRIMARY KEY (`permission_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `p_barcode` (`barcode`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `product_delivery_notes`
--
ALTER TABLE `product_delivery_notes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pdn_no` (`pdn_no`);

--
-- Indexes for table `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `purchase_product`
--
ALTER TABLE `purchase_product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_stock_user` (`user_id`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD UNIQUE KEY `tel` (`tel`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `user_stock`
--
ALTER TABLE `user_stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_stock_transfer`
--
ALTER TABLE `admin_stock_transfer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `currency`
--
ALTER TABLE `currency`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT for table `customer_seller`
--
ALTER TABLE `customer_seller`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `expense_type`
--
ALTER TABLE `expense_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=185;

--
-- AUTO_INCREMENT for table `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=250;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=249;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `product_delivery_notes`
--
ALTER TABLE `product_delivery_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `purchase`
--
ALTER TABLE `purchase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `purchase_product`
--
ALTER TABLE `purchase_product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stock`
--
ALTER TABLE `stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `user_stock`
--
ALTER TABLE `user_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_stock_transfer`
--
ALTER TABLE `admin_stock_transfer`
  ADD CONSTRAINT `admin_stock_transfer_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `admin_stock_transfer_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `fk_customer_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `customer_seller`
--
ALTER TABLE `customer_seller`
  ADD CONSTRAINT `customer_seller_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `expense`
--
ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`expense_type_id`) REFERENCES `expense_type` (`id`);

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`);

--
-- Constraints for table `order_detail`
--
ALTER TABLE `order_detail`
  ADD CONSTRAINT `order_detail_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `permission_roles`
--
ALTER TABLE `permission_roles`
  ADD CONSTRAINT `permission_roles_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `permission_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

--
-- Constraints for table `purchase`
--
ALTER TABLE `purchase`
  ADD CONSTRAINT `purchase_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`);

--
-- Constraints for table `purchase_product`
--
ALTER TABLE `purchase_product`
  ADD CONSTRAINT `purchase_product_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchase` (`id`),
  ADD CONSTRAINT `purchase_product_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

--
-- Constraints for table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `fk_stock_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_stock`
--
ALTER TABLE `user_stock`
  ADD CONSTRAINT `user_stock_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_stock_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_stock_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
