-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 24, 2025 at 05:22 PM
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
(24, 'Diesel fuel', 'Malaysia', NULL, 1, '2024-09-08 16:47:56'),
(31, 'Seliver', 'Malaysia', NULL, 1, '2024-11-29 01:13:29'),
(32, 'Gold', 'Malaysia', NULL, 1, '2024-11-29 01:13:48');

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
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `name`, `tel`, `email`, `address`, `type`, `create_by`, `create_at`) VALUES
(1, 'John Doe', '+123456789', 'john.doe@example.com', '123 Elm Street, City', 'Retail', 'Admin', '2025-01-13 01:30:11'),
(2, 'Jane Smith', '+987654321', 'jane.smith@example.com', '456 Oak Avenue, Town', 'Wholesale', 'Admin', '2025-01-13 01:30:11'),
(3, 'Alice Johnson', '+112233445', 'alice.johnson@example.com', '789 Pine Boulevard, Metro', 'Corporate', 'Admin', '2025-01-13 01:30:11'),
(4, 'Bob Brown', '+998877665', 'bob.brown@example.com', '321 Maple Lane, Village', 'Retail', 'Admin', '2025-01-13 01:30:11'),
(5, 'Emma Davis', '+556677889', 'emma.davis@example.com', '654 Birch Road, Suburb', 'Wholesale', 'Admin', '2025-01-13 01:30:11'),
(6, 'Charlie Wilson', '+445566778', 'charlie.wilson@example.com', '987 Cedar Park, District', 'Corporate', 'Admin', '2025-01-13 01:30:11'),
(7, 'Olivia Martinez', '+334455667', 'olivia.martinez@example.com', '123 Palm Court, City', 'Retail', 'Admin', '2025-01-13 01:30:11'),
(8, 'Liam Anderson', '+223344556', 'liam.anderson@example.com', '456 Cherry Drive, Town', 'Wholesale', 'Admin', '2025-01-13 01:30:11'),
(9, 'Sophia Thomas', '+667788990', 'sophia.thomas@example.com', '789 Willow Walk, Metro', 'Corporate', 'Admin', '2025-01-13 01:30:11'),
(10, 'Mason White', '+112244335', 'mason.white@example.com', '321 Poplar Circle, Village', 'Retail', 'Admin', '2025-01-13 01:30:11'),
(11, 'Isabella Harris', '+998844332', 'isabella.harris@example.com', '654 Fir Way, Suburb', 'Wholesale', 'Admin', '2025-01-13 01:30:11'),
(12, 'Ethan Clark', '+556633221', 'ethan.clark@example.com', '987 Ash Loop, District', 'Corporate', 'Admin', '2025-01-13 01:30:11'),
(13, 'Mia Lewis', '+334422556', 'mia.lewis@example.com', '123 Aspen Ridge, City', 'Retail', 'Admin', '2025-01-13 01:30:11'),
(14, 'Lucas Hall', '+223311445', 'lucas.hall@example.com', '456 Redwood Terrace, Town', 'Wholesale', 'Admin', '2025-01-13 01:30:11'),
(15, 'Amelia Scott', '+667700112', 'amelia.scott@example.com', '789 Spruce Cove, Metro', 'Corporate', 'Admin', '2025-01-13 01:30:11'),
(16, 'Aiden King', '+112277665', 'aiden.king@example.com', '321 Sycamore Yard, Village', 'Retail', 'Admin', '2025-01-13 01:30:11'),
(17, 'Harper Young', '+998800443', 'harper.young@example.com', '654 Walnut Hill, Suburb', 'Wholesale', 'Admin', '2025-01-13 01:30:11'),
(18, 'Ella Wright', '+556644778', 'ella.wright@example.com', '987 Hickory Lane, District', 'Corporate', 'Admin', '2025-01-13 01:30:11'),
(41, 'John Doe', '123456789', 'johndoe@example.com', '123 Main St', 'regular', NULL, '2024-12-03 03:28:25'),
(42, 'Alice Johnson', '987654321', 'alicej@example.com', '456 Oak St', 'premium', NULL, '2024-12-03 03:28:25'),
(43, 'Bob Smith', '555123456', 'bobsmith@example.com', '789 Pine St', 'regular', NULL, '2024-12-03 03:28:25'),
(44, 'Emily Davis', '666789123', 'emilyd@example.com', '101 Maple Ave', 'premium', NULL, '2024-12-03 03:28:25'),
(45, 'Chris Brown', '444555666', 'chrisb@example.com', '202 Cedar Rd', 'regular', NULL, '2024-12-03 03:28:25'),
(46, 'Laura Wilson', '111222333', 'lauraw@example.com', '303 Birch Blvd', 'regular', NULL, '2024-12-03 03:28:25'),
(47, 'Michael Lee', '999888777', 'michaell@example.com', '404 Elm Ln', 'premium', NULL, '2024-12-03 03:28:25'),
(48, 'Sarah White', '333444555', 'sarahw@example.com', '505 Spruce Ct', 'regular', NULL, '2024-12-03 03:28:25'),
(49, 'David Clark', '222111000', 'davidc@example.com', '606 Fir St', 'premium', NULL, '2024-12-03 03:28:25'),
(50, 'Sophia Taylor', '777666555', 'sophiat@example.com', '707 Poplar Pl', 'regular', NULL, '2024-12-03 03:28:25'),
(51, 'Liam Harris', '888999000', 'liamh@example.com', '808 Walnut Way', 'premium', NULL, '2024-12-03 03:28:25'),
(52, 'Olivia Martinez', '000999888', 'oliviam@example.com', '909 Ash Dr', 'regular', NULL, '2024-12-03 03:28:25'),
(53, 'Noah Lewis', '111333222', 'noahl@example.com', '1010 Cypress Ln', 'regular', NULL, '2024-12-03 03:28:25'),
(54, 'Emma Robinson', '222444333', 'emmar@example.com', '1111 Willow Rd', 'premium', NULL, '2024-12-03 03:28:25'),
(55, 'Mason Walker', '444666555', 'masonw@example.com', '1212 Hickory Ct', 'regular', NULL, '2024-12-03 03:28:25'),
(56, 'Isabella Young', '555777888', 'isabellay@example.com', '1313 Alder Ln', 'premium', NULL, '2024-12-03 03:28:25'),
(57, 'James Hall', '666888777', 'jamesh@example.com', '1414 Holly St', 'regular', NULL, '2024-12-03 03:28:25'),
(58, 'Ava King', '999000111', 'avak@example.com', '1515 Laurel Pl', 'regular', NULL, '2024-12-03 03:28:25'),
(59, 'Benjamin Wright', '333222444', 'benjaminw@example.com', '1616 Pine Ct', 'premium', NULL, '2024-12-03 03:28:25'),
(63, 'phearun', '09772969715', 'phearun@gmail.com', '#123 pp', 'VIP2', NULL, '2024-12-03 04:35:01');

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `code` varchar(20) NOT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `create_by` varchar(50) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`id`, `name`, `position`, `code`, `tel`, `email`, `address`, `website`, `note`, `create_by`, `create_at`) VALUES
(1, 'John Doe', 'Team Lead', 'EMP001', '1234567890', 'john.doe@example.com', '123 Main St, NY', 'www.johndoe.com', 'Team Lead', 'admin', '2025-01-08 03:52:24'),
(2, 'Jane Smith', 'HR Manager', 'EMP002', '0987654321', 'jane.smith@example.com', '456 Elm St, LA', 'www.janesmith.com', 'HR Manager', 'admin', '2025-01-08 03:52:24'),
(3, 'Alice Johnson', 'Software Engineer', 'EMP003', '1122334455', 'alice.johnson@example.com', '789 Oak St, SF', 'www.alicejohnson.com', 'Software Engineer', 'admin', '2025-01-08 03:52:24'),
(4, 'Bob Williams', 'Accountant', 'EMP004', '6677889900', 'bob.williams@example.com', '101 Pine St, TX', 'www.bobwilliams.com', 'Accountant', 'admin', '2025-01-08 03:52:24'),
(5, 'Charlie Brown', 'Marketing Head', 'EMP005', '2233445566', 'charlie.brown@example.com', '202 Maple St, FL', 'www.charliebrown.com', 'Marketing Head', 'admin', '2025-01-08 03:52:24'),
(6, 'David Clark', 'Sales Manager', 'EMP006', '3344556677', 'david.clark@example.com', '303 Birch St, IL', 'www.davidclark.com', 'Sales Manager', 'admin', '2025-01-08 03:52:24'),
(7, 'Emma White', 'Business Analyst', 'EMP007', '4455667788', 'emma.white@example.com', '404 Cedar St, WA', 'www.emmawhite.com', 'Business Analyst', 'admin', '2025-01-08 03:52:24'),
(8, 'Frank Harris', 'Product Manager', 'EMP008', '5566778899', 'frank.harris@example.com', '505 Redwood St, NV', 'www.frankharris.com', 'Product Manager', 'admin', '2025-01-08 03:52:24'),
(9, 'Grace Lee', 'UX Designer', 'EMP009', '6677889900', 'grace.lee@example.com', '606 Sequoia St, CO', 'www.gracelee.com', 'UX Designer', 'admin', '2025-01-08 03:52:24'),
(10, 'Henry Adams', 'Project Manager', 'EMP010', '7788990011', 'henry.adams@example.com', '707 Aspen St, OR', 'www.henryadams.com', 'Project Manager', 'admin', '2025-01-08 03:52:24');

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
(1, 1, 'REF001', 'Office Supplies', 150.00, 'Purchased stationery items', '2025-01-01 00:00:00', 'admin', '2025-12-03 06:25:33'),
(2, 2, 'REF002', 'Travel Expenses', 500.00, 'Business trip to client site', '2025-09-02 00:00:00', 'manager', '2025-11-03 06:25:33'),
(3, 3, 'REF003', 'Utility Bills', 300.00, 'Electricity bill for office', '2025-12-01 00:00:00', 'accountant', '2025-10-03 06:25:33'),
(4, 4, 'REF004', 'Employee Salaries', 2000.00, 'Monthly salaries', '2025-12-01 00:00:00', 'hr', '2025-08-03 06:25:33'),
(5, 5, 'REF005', 'Marketing Costs', 800.00, 'Online advertising campaign', '2025-11-30 00:00:00', 'marketing', '2025-07-03 06:25:33'),
(6, 1, 'REF006', 'Office Supplies', 120.00, 'Printer ink cartridges', '2025-12-01 00:00:00', 'admin', '2025-06-03 06:25:33'),
(7, 2, 'REF007', 'Travel Expenses', 250.00, 'Taxi fare for client meeting', '2025-12-02 00:00:00', 'manager', '2024-12-03 06:25:33'),
(8, 6, 'REF008', 'Maintenance', 400.00, 'AC repair service', '2025-11-29 00:00:00', 'maintenance', '2025-05-03 06:25:33'),
(9, 7, 'REF009', 'Training Programs', 600.00, 'Employee skill development program', '2025-11-28 00:00:00', 'trainer', '2025-04-03 06:25:33'),
(10, 8, 'REF010', 'Subscriptions', 100.00, 'Annual software subscription', '2025-11-27 00:00:00', 'it', '2025-03-03 06:25:33'),
(11, 1, 'EXP001', 'Electricity Bill', 150.75, 'Paid for September', '2025-12-08 00:00:00', 'admin', '2025-01-08 16:06:22'),
(12, 2, 'EXP002', 'Printer Ink', 45.00, 'Bought black and color ink', '2025-10-08 00:00:00', 'admin', '2025-01-08 16:06:22'),
(13, 3, 'EXP003', 'Taxi Fare', 30.50, 'Client meeting transportation', '2025-09-08 00:00:00', 'user1', '2025-01-08 16:06:22'),
(14, 4, 'EXP004', 'Team Dinner', 120.00, 'Monthly team bonding', '2025-08-08 00:00:00', 'admin', '2025-01-08 16:06:22'),
(15, 5, 'EXP005', 'Lunch Meeting', 80.25, 'Client lunch', '2025-07-08 00:00:00', 'user2', '2025-01-08 16:06:22'),
(16, 6, 'EXP006', 'Social Media Ads', 200.00, 'October campaign', '2025-06-08 00:00:00', 'admin', '2025-01-08 16:06:22'),
(17, 7, 'EXP007', 'Employee Salary', 2500.00, 'October payout', '2025-05-08 00:00:00', 'hr_manager', '2025-01-08 16:06:22'),
(18, 8, 'EXP008', 'Office Rent', 1000.00, 'Paid for October', '2025-04-08 00:00:00', 'finance', '2025-01-08 16:06:22'),
(19, 9, 'EXP009', 'Property Insurance', 350.00, 'Office coverage', '2025-03-08 00:00:00', 'finance', '2025-01-08 16:06:22'),
(20, 10, 'EXP010', 'AC Maintenance', 75.00, 'Quarterly service', '2025-02-08 00:00:00', 'admin', '2025-01-08 16:06:22');

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
(1, 'INV001', 43, 1, 877, 1000.00, 'Wing', 'ok', 'Chiva', '2025-12-30 01:46:39', 0.00, 'Unpaid'),
(2, 'INV002', 48, 1, 1061, 990.00, 'ABA', 'OK', 'Chiva', '2024-11-10 06:16:19', 0.00, 'Unpaid'),
(3, 'INV003', 48, 1, 949, 0.00, 'ABA', 'OK', 'Chiva', '2024-12-30 06:17:02', 0.00, 'Unpaid'),
(4, 'INV004', 48, 1, 89, 10.00, 'Wing', 'PP', 'Chiva', '2025-02-03 14:22:29', 0.00, 'Unpaid'),
(5, 'INV005', 48, 1, 89, 89.00, 'Cash', NULL, 'Chiva', '2025-03-05 14:05:47', 0.00, 'Unpaid'),
(6, 'INV006', 63, 1, 1678, 1678.43, 'Cash', NULL, 'Chiva', '2025-04-07 11:25:53', 0.00, 'Partial'),
(7, 'INV007', 63, 1, 2560, 2560.43, 'ABA', NULL, 'Chiva', '2025-05-07 16:16:24', 0.00, 'Unpaid'),
(8, 'INV008', 63, 1, 2560, 2560.43, 'ABA', NULL, 'Chiva', '2024-06-07 16:18:05', 0.00, 'Unpaid'),
(9, 'INV009', 41, 1, 112, 112.39, 'AC', NULL, 'Chiva', '2025-01-08 02:26:31', 0.00, 'Unpaid'),
(10, 'INV010', 63, 1, 2409, 2408.67, 'ABA', NULL, 'Chiva', '2025-07-08 02:36:58', 0.00, 'Unpaid'),
(11, 'INV011', 63, 1, 2409, 2408.67, 'ABA', NULL, 'Chiva', '2025-01-08 02:36:58', 0.00, 'Paid'),
(12, 'INV012', 63, 3, 882, 882.00, 'ABA', NULL, 'PHearun', '2025-03-08 10:51:06', 0.00, 'Unpaid'),
(13, 'INV013', 48, 3, 882, 882.00, 'AC', NULL, 'PHearun', '2025-02-11 02:17:17', 0.00, 'Unpaid'),
(14, 'INV014', 45, 3, 966, 966.39, 'Wing', NULL, 'PHearun', '2025-01-11 11:11:04', 0.00, 'Unpaid'),
(15, 'INV015', 48, 3, 882, 882.00, 'AC', NULL, 'PHearun', '2025-01-11 14:23:55', 0.00, 'Partial'),
(16, 'INV016', 42, 3, 6356, 6355.57, 'Wing', NULL, 'PHearun', '2024-01-11 14:29:55', 0.00, 'Unpaid'),
(17, 'INV017', 41, 3, 709, 709.28, 'ABA', NULL, 'PHearun', '2024-01-11 14:30:46', 0.00, 'Unpaid'),
(18, 'INV018', 48, 3, 882, 882.00, 'AC', NULL, 'PHearun', '2024-01-11 15:37:00', 0.00, 'Unpaid'),
(19, 'INV019', 48, 1, 1678, 1678.43, 'Cash', NULL, 'Chiva', '2025-01-12 13:10:09', 0.00, 'Unpaid'),
(20, 'INV020', 45, 1, 8941, 8940.50, 'ABA', NULL, 'Chiva', '2025-01-12 14:47:31', 0.00, 'Unpaid'),
(21, 'INV021', 1, 14, 799, 799.00, 'Cash', NULL, 'Koka', '2025-01-14 15:44:42', 0.00, 'Unpaid'),
(22, 'INV022', 1, 17, 90, 90.00, 'Cash', NULL, 'Heava', '2025-01-16 00:54:31', 0.00, 'Unpaid'),
(23, 'INV023', 1, 17, 889, 889.00, 'Cash', NULL, 'Heava', '2025-01-16 01:37:33', 0.00, 'Unpaid'),
(24, 'INV024', 8, 17, 771, 771.27, 'Cash', NULL, 'Heava', '2025-01-16 02:33:29', 0.00, 'Unpaid'),
(25, 'INV025', 1, 1, 100, 80.00, 'Cash', 'Test order', 'Chiva001', '2025-02-21 18:11:53', 20.00, ''),
(26, 'INV026', 1, 1, 100, 80.00, 'Cash', 'Test order', 'Chiva001', '2025-02-21 18:13:35', 20.00, ''),
(27, 'INV027', NULL, 1, 309, 0.00, '', 'ok', 'Chiva001', '2025-02-23 09:41:04', 0.00, 'Unpaid'),
(28, 'INV028', NULL, 1, 2700, 0.00, '', 'ok', 'Chiva001', '2025-02-23 09:42:59', 0.00, 'Unpaid'),
(29, 'INV029', NULL, 1, 300, 0.00, '', NULL, 'Chiva001', '2025-02-23 09:46:51', 0.00, 'Unpaid'),
(30, 'INV030', NULL, 1, 600, 0.00, '', NULL, 'Chiva001', '2025-02-23 09:47:37', 0.00, 'Unpaid'),
(31, 'INV031', NULL, 1, 300, 0.00, '', 'ok', 'Chiva001', '2025-02-23 09:50:01', 0.00, 'Unpaid'),
(32, 'INV032', NULL, 1, 30300, 0.00, '', 'ok', 'Chiva001', '2025-02-23 09:57:04', 0.00, 'Unpaid'),
(33, 'INV033', 8, 1, 30300, 0.00, '30300.00', 'ok', 'Chiva001', '2025-02-23 10:04:10', 0.00, 'Unpaid'),
(34, 'INV034', 5, 1, 30000, 0.00, '30300.00', 'Paid', 'Chiva001', '2025-02-23 10:05:40', 0.00, 'Unpaid'),
(35, 'INV035', 1, 1, 909, 0.00, '909.00', NULL, 'Chiva001', '2025-02-23 10:37:08', 0.00, 'Unpaid'),
(36, 'INV036', 8, 1, 60600, 60600.00, 'Cash', 'ok', 'Chiva001', '2025-02-23 10:46:54', 0.00, 'Unpaid'),
(37, 'INV037', 8, 1, 300, 300.00, 'Cash', NULL, 'Chiva001', '2025-02-23 10:52:30', 0.00, 'Unpaid'),
(38, 'INV038', 8, 1, 909, 909.00, 'Cash', NULL, 'Chiva001', '2025-02-23 10:54:10', 0.00, 'Unpaid'),
(39, 'INV039', 1, 1, 909, 0.00, '909.00', 'ok', 'Chiva001', '2025-02-23 10:57:12', 0.00, 'Unpaid'),
(40, 'INV040', 1, 1, 300, 0.00, '300.00', 'test ordert ', 'Chiva001', '2025-02-23 11:05:55', 0.00, 'Unpaid'),
(41, '', 1, NULL, 300, 300.00, 'Wing', NULL, NULL, '2025-02-23 11:06:49', 0.00, 'Unpaid'),
(42, '', 1, NULL, 300, 300.00, 'Wing', NULL, NULL, '2025-02-23 11:07:15', 0.00, 'Unpaid'),
(43, '', 1, NULL, 300, 300.00, 'Wing', NULL, NULL, '2025-02-23 11:07:23', 0.00, 'Unpaid'),
(44, '', 1, NULL, 300, 300.00, 'Wing', 'Ok bro', NULL, '2025-02-23 11:08:41', 0.00, 'Unpaid'),
(45, '', 8, 1, 30300, 30300.00, 'Cash', '30300', 'Chiva001', '2025-02-23 11:11:23', 0.00, 'Unpaid'),
(46, 'INV046', 2, 1, 300300, 0.00, '300300.00', NULL, 'Chiva001', '2025-02-23 11:21:19', 0.00, 'Unpaid'),
(47, '', 2, 1, 909, 909.00, 'Wing', 'ok', 'Chiva001', '2025-02-23 11:23:47', 0.00, 'Unpaid'),
(48, 'INV048', 6, 1, 30300, 30300.00, 'Wing', 'ok', 'Chiva001', '2025-02-23 11:30:40', 0.00, 'Unpaid'),
(49, 'INV049', 5, 1, 1854, 1854.00, 'Wing', 'ok', 'Chiva001', '2025-02-23 11:31:46', 0.00, 'Unpaid'),
(50, 'INV050', 2, 1, 60300, 60300.00, 'Wing', NULL, 'Chiva001', '2025-02-23 18:40:58', 0.00, 'Unpaid'),
(51, 'INV051', 4, 1, 30300, 30300.00, 'ABA', NULL, 'Chiva001', '2025-02-23 18:49:02', 0.00, 'Unpaid'),
(52, 'INV052', 2, 1, 30300, 30300.00, 'Wing', NULL, 'Chiva001', '2025-02-24 02:08:53', 0.00, 'Unpaid'),
(53, 'INV053', 1, 1, 60600, 60600.00, 'Wing', 'OK', 'Chiva001', '2025-02-24 02:46:09', 0.00, 'Unpaid'),
(54, 'INV054', 7, 1, 300, 300.00, 'Wing', 'ok', 'Chiva001', '2025-02-24 03:11:29', 0.00, 'Unpaid'),
(55, 'INV055', 3, 1, 300, 300.00, 'Cash', 'ok', 'Chiva001', '2025-02-24 03:15:41', 0.00, 'Unpaid'),
(56, 'INV056', 3, 1, 300, 300.00, 'Cash', 'ok', 'Chiva001', '2025-02-24 03:16:48', 0.00, 'Unpaid'),
(57, 'INV057', 1, 1, 30600, 30600.00, 'ABA', NULL, 'Chiva001', '2025-02-24 03:37:06', 0.00, 'Unpaid'),
(58, 'INV058', 3, 1, 30300, 30300.00, 'ABA', 'ok', 'Chiva001', '2025-02-24 03:39:20', 0.00, 'Unpaid'),
(59, 'INV059', 2, 1, 300, 300.00, 'Wing', 'ok', 'Chiva001', '2025-02-24 03:57:31', 0.00, 'Unpaid'),
(60, 'INV060', 8, 1, 300, 300.00, 'Wing', NULL, 'Chiva001', '2025-02-24 04:06:04', 0.00, 'Unpaid'),
(61, 'INV061', 1, 1, 300, 300.00, 'Wing', NULL, 'Chiva001', '2025-02-24 04:41:10', 0.00, 'Unpaid'),
(62, 'INV062', 1, 1, 300, 300.00, 'Wing', NULL, 'Chiva001', '2025-02-24 04:41:37', 0.00, 'Unpaid'),
(63, 'INV063', 1, 1, 300, 300.00, 'Wing', NULL, 'Chiva001', '2025-02-24 04:46:12', 0.00, 'Unpaid'),
(64, 'INV064', 8, 1, 309, 309.00, 'Wing', NULL, 'Chiva001', '2025-02-24 05:44:14', 0.00, 'Unpaid'),
(65, 'INV065', 3, 1, 300, 300.00, 'Wing', NULL, 'Chiva001', '2025-02-24 05:51:21', 0.00, 'Unpaid'),
(66, 'INV066', 8, 1, 300, 300.00, 'Wing', NULL, 'Chiva001', '2025-02-24 06:39:52', 0.00, 'Unpaid'),
(67, 'INV067', 2, 1, 300, 300.00, 'Wing', NULL, 'Chiva001', '2025-02-24 06:42:29', 0.00, 'Unpaid'),
(68, 'INV068', 7, 1, 300, 300.00, 'Wing', NULL, 'Chiva001', '2025-02-24 06:58:55', 0.00, 'Unpaid'),
(69, 'INV069', 1, 1, 309, 930.00, 'Wing', NULL, 'Chiva001', '2025-02-24 07:18:27', 0.00, 'Unpaid'),
(70, 'INV070', 58, 1, 211809, 99999.99, 'Wing', NULL, 'Chiva001', '2025-02-24 13:29:48', 0.00, 'Unpaid');

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
  `total` decimal(7,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `order_detail`
--

INSERT INTO `order_detail` (`id`, `order_id`, `product_id`, `qty`, `price`, `discount`, `total`) VALUES
(45, 27, 43, 1, 300.00, 0.00, 300.00),
(46, 27, 54, 1, 10.00, 9.99, 9.00),
(47, 28, 43, 9, 300.00, 0.00, 2700.00),
(48, 29, 43, 1, 300.00, 0.00, 300.00),
(49, 30, 43, 2, 300.00, 0.00, 600.00),
(50, 31, 43, 1, 300.00, 0.00, 300.00),
(51, 32, 43, 101, 300.00, 0.00, 30300.00),
(52, 33, 43, 101, 300.00, 0.00, 30300.00),
(53, 34, 43, 101, 300.00, 0.00, 30300.00),
(54, 36, NULL, 202, 300.00, 0.00, 60600.00),
(55, 37, NULL, 1, 300.00, 0.00, 300.00),
(56, 38, NULL, 101, 10.00, 9.99, 909.10),
(57, 39, 54, 101, 10.00, 9.99, 909.10),
(58, 40, NULL, 1, 300.00, 0.00, 300.00),
(59, 41, 43, 1, 300.00, 0.00, 300.00),
(60, 42, 43, 1, 300.00, 0.00, 300.00),
(61, 43, 43, 1, 300.00, 0.00, 300.00),
(62, 44, 43, 1, 300.00, 0.00, 300.00),
(63, 45, 43, 101, 300.00, 0.00, 30300.00),
(64, 46, NULL, 1001, 300.00, 0.00, 99999.99),
(65, 47, 54, 101, 10.00, 9.99, 909.10),
(66, 48, 43, 101, 300.00, 0.00, 30300.00),
(67, 49, 54, 206, 10.00, 9.99, 1854.21),
(68, 50, 43, 201, 300.00, 0.00, 60300.00),
(69, 51, 43, 101, 300.00, 0.00, 30300.00),
(70, 52, 43, 101, 300.00, 0.00, 30300.00),
(71, 53, 43, 202, 300.00, 0.00, 60600.00),
(72, 54, 43, 1, 300.00, 0.00, 300.00),
(73, 55, 43, 1, 300.00, 0.00, 300.00),
(74, 56, 43, 1, 300.00, 0.00, 300.00),
(75, 57, 43, 102, 300.00, 0.00, 30600.00),
(76, 58, 43, 101, 300.00, 0.00, 30300.00),
(77, 59, 43, 1, 300.00, 0.00, 300.00),
(78, 60, 43, 1, 300.00, 0.00, 300.00),
(79, 61, 43, 1, 300.00, 0.00, 300.00),
(80, 62, 43, 1, 300.00, 0.00, 300.00),
(81, 63, 43, 1, 300.00, 0.00, 300.00),
(82, 64, 43, 1, 300.00, 0.00, 300.00),
(83, 64, 54, 1, 10.00, 9.99, 9.00),
(84, 65, 43, 1, 300.00, 0.00, 300.00),
(85, 66, 43, 1, 300.00, 0.00, 300.00),
(86, 67, 43, 1, 300.00, 0.00, 300.00),
(87, 68, 43, 1, 300.00, 0.00, 300.00),
(88, 69, 43, 1, 300.00, 0.00, 300.00),
(89, 69, 54, 1, 10.00, 9.99, 9.00),
(90, 70, 43, 703, 300.00, 0.00, 99999.99),
(91, 70, 54, 101, 10.00, 9.99, 909.10);

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
(58, 'dashboard.getlist', 'dashboard', '1', '/'),
(59, 'pos.getlist', 'pos', '1', '/pos'),
(60, 'customer.getlist', 'customer', '1', '/customer'),
(61, 'customer.getone', 'customer', NULL, NULL),
(62, 'customer.create', 'customer', NULL, NULL),
(63, 'customer.update', 'customer', NULL, NULL),
(64, 'customer.remove', 'customer', NULL, NULL),
(65, 'category.getlist', 'category', '1', '/category'),
(66, 'category.getone', 'category', NULL, NULL),
(67, 'category.create', 'category', NULL, NULL),
(68, 'category.update', 'category', NULL, NULL),
(69, 'category.remove', 'category', NULL, NULL),
(70, 'order.getlist', 'order', '1', '/order'),
(71, 'order.getone', 'order', NULL, NULL),
(72, 'order.create', 'order', NULL, NULL),
(73, 'order.update', 'order', NULL, NULL),
(74, 'order.remove', 'order', NULL, NULL),
(75, 'product.getlist', 'product', '1', '/product'),
(76, 'product.getone', 'product', NULL, NULL),
(77, 'product.create', 'product', NULL, NULL),
(78, 'product.update', 'product', NULL, NULL),
(79, 'product.remove', 'product', NULL, NULL),
(80, 'user.getlist', 'user', '1', '/user'),
(81, 'user.getone', 'user', NULL, NULL),
(82, 'user.create', 'user', NULL, NULL),
(83, 'user.update', 'user', NULL, NULL),
(84, 'user.remove', 'user', NULL, NULL),
(85, 'role.getlist', 'role', '1', '/role'),
(86, 'role.getone', 'role', NULL, NULL),
(87, 'role.create', 'role', NULL, NULL),
(88, 'role.update', 'role', NULL, NULL),
(89, 'role.remove', 'role', NULL, NULL),
(90, 'supplier.getlist', 'supplier', '1', '/supplier'),
(91, 'supplier.getone', 'supplier', NULL, NULL),
(92, 'supplier.create', 'supplier', NULL, NULL),
(93, 'supplier.update', 'supplier', NULL, NULL),
(94, 'supplier.remove', 'supplier', NULL, NULL),
(95, 'expanse_type.getlist', 'expanse_type', '1', '/expanse_type'),
(96, 'expanse_type.getone', 'expanse_type', NULL, NULL),
(97, 'expanse_type.create', 'expanse_type', NULL, NULL),
(98, 'expanse_type.update', 'expanse_type', NULL, NULL),
(99, 'expanse_type.remove', 'expanse_type', NULL, NULL),
(100, 'expanse.getlist', 'expanse', '1', '/expanse'),
(101, 'expanse.getone', 'expanse', NULL, NULL),
(102, 'expanse.create', 'expanse', NULL, NULL),
(103, 'expanse.update', 'expanse', NULL, NULL),
(104, 'expanse.remove', 'expanse', NULL, NULL),
(105, 'report_Sale_Summary.getlist', 'report_Sale_Summary', '1', '/report_Sale_Summary'),
(106, 'report_Sale_Summary.getone', 'report_Sale_Summary', NULL, NULL),
(107, 'report_Sale_Summary.create', 'report_Sale_Summary', NULL, NULL),
(108, 'report_Sale_Summary.update', 'report_Sale_Summary', NULL, NULL),
(109, 'report_Sale_Summary.remove', 'report_Sale_Summary', NULL, NULL),
(110, 'purchase_product.getlist', 'purchase_product', '1', '/purchase_product'),
(111, 'purchase_product.getone', 'purchase_product', NULL, NULL),
(112, 'purchase_product.create', 'purchase_product', NULL, NULL),
(113, 'purchase_product.update', 'purchase_product', NULL, NULL),
(114, 'purchase_product.remove', 'purchase_product', NULL, NULL),
(115, 'purchase.getlist', 'purchase', '1', '/purchase'),
(116, 'purchase.getone', 'purchase', NULL, NULL),
(117, 'purchase.create', 'purchase', NULL, NULL),
(118, 'purchase.update', 'purchase', NULL, NULL),
(119, 'purchase.remove', 'purchase', NULL, NULL),
(120, 'employee.getlist', 'employee', '1', '/employee'),
(121, 'employee.getone', 'employee', NULL, NULL),
(122, 'employee.create', 'employee', NULL, NULL),
(123, 'employee.update', 'employee', NULL, NULL),
(124, 'employee.remove', 'employee', NULL, NULL),
(125, 'payroll.getlist', 'payroll', '1', '/payroll'),
(126, 'payroll.getone', 'payroll', NULL, NULL),
(127, 'payroll.create', 'payroll', NULL, NULL),
(128, 'payroll.update', 'payroll', NULL, NULL),
(129, 'payroll.remove', 'payroll', NULL, NULL),
(130, 'role_permission.getlist', 'role_permission', '1', '/role_permission'),
(131, 'role_permission.getone', 'role_permission', NULL, NULL),
(132, 'role_permission.create', 'role_permission', NULL, NULL),
(133, 'role_permission.update', 'role_permission', NULL, NULL),
(134, 'role_permission.remove', 'role_permission', NULL, NULL),
(135, 'report_Expense_Summary.getlist', 'report_Expense_Summary', '1', '/report_Expense_Summary'),
(136, 'report_Expense_Summary.getone', 'report_Expense_Summary', NULL, NULL),
(137, 'report_Expense_Summary.create', 'report_Expense_Summary', NULL, NULL),
(138, 'report_Expense_Summary.update', 'report_Expense_Summary', NULL, NULL),
(139, 'report_Expense_Summary.remove', 'report_Expense_Summary', NULL, NULL),
(140, 'purchase_Summary.getlist', 'purchase_Summary', '1', '/purchase_Summary'),
(141, 'purchase_Summary.getone', 'purchase_Summary', NULL, NULL),
(142, 'purchase_Summary.create', 'purchase_Summary', NULL, NULL),
(143, 'purchase_Summary.update', 'purchase_Summary', NULL, NULL),
(144, 'purchase_Summary.remove', 'purchase_Summary', NULL, NULL),
(145, 'report_Customer.getlist', 'report_Customer', '1', '/report_Customer'),
(146, 'report_Customer.getone', 'report_Customer', NULL, NULL),
(147, 'report_Customer.create', 'report_Customer', NULL, NULL),
(148, 'report_Customer.update', 'report_Customer', NULL, NULL),
(149, 'report_Customer.remove', 'report_Customer', NULL, NULL),
(150, 'Top_Sale.getlist', 'Top_Sale', '1', '/Top_Sale'),
(151, 'Top_Sale.getone', 'Top_Sale', NULL, NULL),
(152, 'Top_Sale.create', 'Top_Sale', NULL, NULL),
(153, 'Top_Sale.update', 'Top_Sale', NULL, NULL),
(154, 'Top_Sale.remove', 'Top_Sale', NULL, NULL),
(155, 'Currency.getlist', 'Currency', '1', '/Currency'),
(156, 'Currency.getone', 'Currency', NULL, NULL),
(157, 'Currency.create', 'Currency', NULL, NULL),
(158, 'Currency.update', 'Currency', NULL, NULL),
(159, 'Currency.remove', 'Currency', NULL, NULL),
(160, 'language.getlist', 'language', '1', '/language'),
(161, 'language.getone', 'language', NULL, NULL),
(162, 'language.create', 'language', NULL, NULL),
(163, 'language.update', 'language', NULL, NULL),
(164, 'language.remove', 'language', NULL, NULL);

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
(3, 58),
(11, 58),
(3, 59),
(11, 59),
(3, 60),
(3, 61),
(3, 62),
(3, 63),
(3, 64),
(3, 65),
(3, 66),
(3, 67),
(3, 68),
(3, 69),
(3, 70),
(3, 71),
(3, 72),
(3, 73),
(3, 74),
(3, 75),
(11, 75),
(3, 76),
(11, 76),
(3, 77),
(11, 77),
(3, 78),
(11, 78),
(3, 79),
(3, 80),
(3, 81),
(3, 82),
(3, 83),
(3, 84),
(3, 85),
(3, 86),
(3, 87),
(3, 88),
(3, 89),
(3, 90),
(3, 91),
(3, 92),
(3, 93),
(3, 94),
(3, 95),
(3, 96),
(3, 97),
(3, 98),
(3, 99),
(3, 100),
(3, 101),
(3, 102),
(3, 103),
(3, 104),
(3, 105),
(3, 106),
(3, 107),
(3, 108),
(3, 109),
(3, 110),
(3, 111),
(3, 112),
(3, 113),
(3, 114),
(3, 115),
(3, 116),
(3, 117),
(3, 118),
(3, 119),
(3, 120),
(3, 121),
(3, 122),
(3, 123),
(3, 124),
(3, 125),
(3, 126),
(3, 127),
(3, 128),
(3, 129),
(3, 130),
(3, 131),
(3, 132),
(3, 133),
(3, 134),
(3, 135),
(3, 136),
(3, 137),
(3, 138),
(3, 139),
(3, 140),
(3, 141),
(3, 142),
(3, 143),
(3, 144),
(3, 145),
(3, 146),
(3, 147),
(3, 148),
(3, 149),
(3, 150),
(3, 151),
(3, 152),
(3, 153),
(3, 154),
(3, 155),
(3, 156),
(3, 157),
(3, 158),
(3, 159),
(3, 160),
(3, 161),
(3, 162),
(3, 163),
(3, 164);

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
  `discount` decimal(3,2) NOT NULL DEFAULT 0.00,
  `status` tinyint(1) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `create_by` varchar(120) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `unit` varchar(50) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `category_id`, `barcode`, `name`, `brand`, `description`, `qty`, `price`, `discount`, `status`, `image`, `create_by`, `create_at`, `unit`, `unit_price`) VALUES
(43, 31, 'P043', 'OIL', 'Samsung', 'undefined', -636, 0.00, 0.00, 0, NULL, 'Chiva001', '2025-02-22 08:09:25', 'ton', 300.00),
(44, 31, 'P044', 'OIL', 'Apple', 'undefined', 5666, 0.00, 0.00, 1, NULL, 'Chiva001', '2025-02-22 08:35:57', 'ton', 1.00),
(54, 24, 'P054', 'Dell', 'Microsoft', NULL, 2196, 0.00, 9.99, 1, NULL, 'Chiva001', '2025-02-23 00:11:31', 'lite', 10.00),
(55, 32, 'P055', 'TEST PRODUCT ', 'Microsoft', NULL, 300, 0.00, 9.99, 1, NULL, 'Chiva001', '2025-02-23 00:13:11', 'ton', 123.00),
(56, 32, 'P056', 'TEST DES ', 'Microsoft', NULL, 100, 0.00, 9.99, 1, NULL, 'Chiva001', '2025-02-23 00:15:35', 'ton', 140.00),
(57, 31, 'P057', 'Dell', 'Apple', NULL, 1000, 0.00, 9.99, 1, NULL, 'Chiva001', '2025-02-23 00:21:01', 'lite', 10.00),
(58, 24, 'P058', 'Dell', 'Apple', NULL, 324, 0.00, 9.99, NULL, NULL, 'Chiva001', '2025-02-23 04:25:42', 'lite', 1000.00),
(59, 24, 'P059', 'Dell', 'Apple', NULL, 1000, 0.00, 9.99, NULL, NULL, 'Chiva001', '2025-02-24 07:28:40', 'lite', 10.00),
(60, 31, 'P060', 'Dell', 'Apple', NULL, 6000, 0.00, 9.99, 1, NULL, 'Chiva001', '2025-02-24 13:31:38', 'ton', 0.86);

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
(1, 'Banteay Meanchey', 'BM'),
(3, 'Kampong Cham', 'KPC'),
(4, 'Kampong Chhnang', 'KCH'),
(5, 'Kampong Speu', 'KPS'),
(6, 'Kampong Thom', 'KPT'),
(7, 'Kampot', 'KPT'),
(8, 'Kandal', 'KDL'),
(9, 'Koh Kong', 'KKG'),
(10, 'Kratie', 'KRT'),
(11, 'Mondulkiri', 'MDK'),
(12, 'Phnom Penh', 'PP'),
(13, 'Preah Vihear', 'PVH'),
(14, 'Prey Veng', 'PVG'),
(15, 'Pursat', 'PST'),
(16, 'Ratanakiri', 'RTK'),
(17, 'Siem Reap', 'SR'),
(18, 'Preah Sihanouk', 'PSH'),
(19, 'Stung Treng', 'STG'),
(20, 'Svay Rieng', 'SVR'),
(21, 'Takeo', 'TKO'),
(22, 'Oddar Meanchey', 'OMC'),
(23, 'Kep', 'KEP'),
(24, 'Pailin', 'PLN'),
(25, 'Tbong Khmum', 'TBK'),
(26, 'Admin', 'admin');

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
(3, 'KH-101', 'KH-101', '0977296972', 'kh101@gmail.com', '#123 st bt', 'kh101.com', NULL, NULL, '2024-10-16 14:41:34'),
(6, 'VN-102', 'VN-102', '0977296974', 'vn102Ggmail.com', '#123 vn hn', 'nh102cg.com', NULL, NULL, '2024-10-16 15:38:14'),
(7, 'TH-101', 'TH-101', '0977296975', 'thkonkat101@gmail.com', '#123 pp', 'thkonkat.com', NULL, NULL, '2024-10-17 01:14:43'),
(8, 'JP-101', 'JP-101', '0977296976', 'jp101@gmail.com', '#123 st us', 'jpcambodia.com', NULL, NULL, '2024-10-21 06:34:55'),
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
  `tel` varchar(255) DEFAULT NULL,
  `province_name` varchar(100) DEFAULT NULL,
  `province_code` varchar(10) DEFAULT NULL,
  `branch_name` varchar(100) DEFAULT NULL,
  `barcode` int(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `role_id`, `name`, `username`, `password`, `is_active`, `create_by`, `create_at`, `address`, `tel`, `province_name`, `province_code`, `branch_name`, `barcode`) VALUES
(1, 8, 'Chiva001', 'chiva224@gmail.com', '$2b$10$nU2u4kj1LFXwBsOFuXfzp.ZlQ5VCj3PE.tQhFd5LGYSdgfbbeqcsK', 1, NULL, '2025-02-22 15:26:54', NULL, '012345678', NULL, NULL, NULL, NULL),
(3, 1, 'PHearun', 'PHearun321@gmail.com', '$2b$10$tX/nYMQXE3Iw28vFAjUD0Ozk5WXFIy.3X7m8.pQRSsVIO.KyCEBkS', 0, 'Chiva', '2024-09-09 03:09:37', NULL, '0961234567', NULL, NULL, NULL, NULL),
(13, 3, 'Visa', 'visakh@gmail.com', '$2b$10$VRoKjxNGRb6d95UVUQJ76OrQJfVOc8Eg83MGBTfrh3eD5LrgH0vBG', 1, 'Chiva', '2024-09-26 14:08:03', NULL, '099900112', NULL, NULL, NULL, NULL),
(14, 6, 'Koka', 'kokalove@gmail.com', '$2b$10$oUr2lzCn8hIwZmf32myCr.d17x57PEAVcbc2veTG0VbF0KKu5229O', 0, 'Chiva', '2024-10-05 12:12:18', NULL, '067112233', NULL, NULL, NULL, NULL),
(17, 3, 'Heava', 'chiva890@gmail.com', '$2b$10$1luEpmQyrgiY9.iPYg7aMOvfnIbIH6E6uoOMEqd8J0h5pXatL9Fo2', 1, 'Chiva', '2025-01-14 16:07:47', 'Phnom Penh', '092445566', NULL, NULL, NULL, NULL),
(22, 26, 'Pheary', 'pheary12@gmail.com', '$2b$10$linEXpLzCXQkCWH0pBDPq.L.747cCtGVrJhvCPLf4OCJXUaqvSQhy', 1, 'PHearun', '2025-02-11 04:26:01', NULL, '073900112', NULL, NULL, NULL, NULL),
(24, 9, 'Macbook Air M2', 'jongbbjbjn', '$2b$10$wpR./KIQevwNHaO7KoO2oOejcPESmRPmqYLYtQUOt9mnXR9nwvJQ2', 1, NULL, '2025-02-22 15:26:19', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `UserName` varchar(50) NOT NULL,
  `PASSWORD` varchar(11) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

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
(14, 11),
(17, 3);

--
-- Indexes for dumped tables
--

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
  ADD UNIQUE KEY `tel` (`tel`);

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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `currency`
--
ALTER TABLE `currency`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `employee`
--
ALTER TABLE `employee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `order_detail`
--
ALTER TABLE `order_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=165;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Constraints for dumped tables
--

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
