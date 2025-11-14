-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th10 14, 2025 lúc 09:21 AM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `chamvan`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bug_reports`
--

CREATE TABLE `bug_reports` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'open',
  `pageUrl` varchar(255) DEFAULT NULL,
  `userAgent` varchar(255) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `userEmail` varchar(255) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bug_reports`
--

INSERT INTO `bug_reports` (`id`, `title`, `description`, `status`, `pageUrl`, `userAgent`, `userId`, `userEmail`, `createdAt`, `updatedAt`) VALUES
(1, 'Giỏ hàng không cập nhật', 'Thêm sản phẩm A trên iPhone 13 - Safari không vào cart.', 'open', 'http://localhost:3000/bao-cao-loi', 'PostmanRuntime/7.49.1', NULL, NULL, '2025-11-03 17:55:46.000000', '2025-11-03 17:55:46.000000'),
(2, 'giỏ hàng', 'không có ảnh', 'open', 'http://localhost:3000/bao-cao-loi', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', NULL, 'khachhang2@gmail.com', '2025-11-03 17:59:58.000000', '2025-11-03 17:59:58.000000'),
(3, 'không đăng nhập được', 'lỗi đăng nhập', 'open', 'http://localhost:3000/bao-cao-loi', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', NULL, NULL, '2025-11-03 18:00:46.000000', '2025-11-03 18:00:46.000000'),
(4, 'web bi loi dang nhap', 'web bi loi dang nhap', 'open', 'http://localhost:3000/bao-cao-loi', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', NULL, 'admin@gmail.com', '2025-11-11 18:03:31.000000', '2025-11-11 18:03:31.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
(1, 1761895037344, 'Auto1761895037344');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customerName` varchar(255) NOT NULL,
  `customerEmail` varchar(255) NOT NULL,
  `customerPhone` varchar(20) DEFAULT NULL,
  `customerDob` varchar(20) DEFAULT NULL,
  `shippingAddress` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `subtotal` decimal(12,0) NOT NULL DEFAULT 0,
  `shippingFee` decimal(12,0) NOT NULL DEFAULT 0,
  `total` decimal(12,0) NOT NULL DEFAULT 0,
  `status` varchar(50) NOT NULL DEFAULT 'chờ duyệt',
  `eta` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `customerName`, `customerEmail`, `customerPhone`, `customerDob`, `shippingAddress`, `notes`, `subtotal`, `shippingFee`, `total`, `status`, `eta`, `userId`, `createdAt`, `updatedAt`) VALUES
(1, 'Nguyen Van A', 'a@example.com', '0900000000', NULL, '123 Nguyen Trai, Q1', NULL, 0, 0, 0, 'confirmed', NULL, NULL, '2025-11-03 11:52:40.021369', '2025-11-03 11:53:31.000000'),
(2, 'Anh Đẹp Trai', 'guest@example.com', '0988675443', NULL, '26 sơn la, Xã Má Lé, Huyện Đồng Văn, Tỉnh Hà Giang', 'Đóng gói cẩn thận giúp mình | Lên đơn ngay nhé', 0, 0, 0, 'chờ duyệt', NULL, NULL, '2025-11-03 12:17:58.472142', '2025-11-03 12:17:58.472142'),
(3, 'Ấda ádasd', 'guest@example.com', '08080898787', NULL, '2453, Phường Tứ Liên, Quận Tây Hồ, Thành phố Hà Nội', 'giao nhanh ok | Đóng gói cẩn thận giúp mình | Giao giờ hành chính', 0, 0, 0, 'chờ duyệt', NULL, NULL, '2025-11-03 15:10:10.898274', '2025-11-03 15:10:10.898274'),
(5, 'âdsasad', 'khachhang2@gmail.com', '089898989', NULL, 'ádad, Xã Thượng Hà, Huyện Bảo Lạc, Tỉnh Cao Bằng', 'Đóng gói cẩn thận giúp mình | Lên đơn ngay nhé | Giao giờ hành chính', 0, 0, 0, 'chờ duyệt', NULL, NULL, '2025-11-03 17:05:01.047135', '2025-11-03 17:05:01.047135'),
(6, 'Nguyen Van A', 'admin@gmail.com', '02342324243', NULL, 'Ngo 901, Xã Đa Thông, Huyện Thông Nông, Tỉnh Cao Bằng', 'Giao vao buoi sang | Đóng gói cẩn thận giúp mình | Lên đơn ngay nhé | Giao giờ hành chính', 13500000, 0, 13500000, 'duyệt', '2025-11-20 12:01:00', NULL, '2025-11-11 18:00:55.173875', '2025-11-11 18:01:44.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `unitPrice` decimal(12,0) NOT NULL,
  `lineTotal` decimal(12,0) NOT NULL,
  `orderId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `productId`, `qty`, `unitPrice`, `lineTotal`, `orderId`) VALUES
(1, 1, 2, 0, 0, 1),
(2, 3, 1, 0, 0, 1),
(3, 1, 1, 0, 0, 2),
(4, 1, 4, 0, 0, 3),
(6, 1, 4, 0, 0, 5),
(7, 1, 1, 13500000, 13500000, 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `sku` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `status` enum('open','closed') NOT NULL DEFAULT 'open',
  `sold` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `sku`, `description`, `stock`, `status`, `sold`, `image`, `created_at`, `updated_at`) VALUES
(1, 'Bàn ghế gỗ hương', 13500000.00, NULL, NULL, 7, 'open', 1, 'https://noithatdangkhoa.com/wp-content/uploads/2024/06/bo-ban-ghe-phong-khach-sofa-dui-ga-2-vang-sfdk102-1.jpg', '2025-11-03 12:04:57.675184', '2025-11-11 17:09:34.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_categories`
--

CREATE TABLE `product_categories` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_colors`
--

CREATE TABLE `product_colors` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `hex` varchar(16) DEFAULT NULL,
  `productId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `url` text NOT NULL,
  `productId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_specs`
--

CREATE TABLE `product_specs` (
  `id` int(11) NOT NULL,
  `label` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `productId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `return_requests`
--

CREATE TABLE `return_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_code` varchar(50) NOT NULL,
  `reason` text NOT NULL,
  `status` enum('pending','in_review','approved','rejected','refunded') NOT NULL DEFAULT 'pending',
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `telegram_config`
--

CREATE TABLE `telegram_config` (
  `id` int(11) NOT NULL,
  `bot_token` varchar(128) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `telegram_config`
--

INSERT INTO `telegram_config` (`id`, `bot_token`, `created_at`, `updated_at`) VALUES
(1, '8278078866:AAGYdYpdiGQRIoOa64BAoxo-QiScH4hUFO8', '2025-11-03 17:43:49.431002', '2025-11-03 17:43:49.445305');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `telegram_recipients`
--

CREATE TABLE `telegram_recipients` (
  `id` int(11) NOT NULL,
  `chat_id` bigint(20) NOT NULL,
  `display_name` varchar(128) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `telegram_recipients`
--

INSERT INTO `telegram_recipients` (`id`, `chat_id`, `display_name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 6064669684, 'Phap', 1, '2025-11-03 17:43:49.490022', '2025-11-03 17:43:49.500332');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `telegram_templates`
--

CREATE TABLE `telegram_templates` (
  `id` int(11) NOT NULL,
  `key` varchar(64) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `telegram_templates`
--

INSERT INTO `telegram_templates` (`id`, `key`, `content`, `created_at`, `updated_at`) VALUES
(1, 'ORDER_SUCCESS', '🛒 ĐƠN HÀNG MỚI — CHỜ DUYỆT\n• Mã: {{code}}\n• Khách: {{customer}}\n• Tổng: {{total}}₫\n• Sản phẩm: {{items}}\n• Thời gian: {{time}}\n• Link: {{link}}', '2025-11-03 17:43:49.521714', '2025-11-03 17:43:49.534186');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `token_version` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `phone`, `dob`, `role`, `created_at`, `updated_at`, `token_version`) VALUES
('17900835-3bd7-4943-8693-9c67aa4ff9fa', 'hà văn a', 'khachhang2@gmail.com', '$2b$10$d2fmnHMwVvi45a.S1PWnv.JiFNLQX8pqxjuvjV.F6rFpilP6rHHBK', NULL, NULL, 'user', '2025-11-03 15:08:48.191160', '2025-11-03 15:40:56.000000', 1),
('4b306c24-06fa-493e-b6aa-51f35c62b0a2', 'test', 'phap.lv1106@gmail.com', '$2b$10$xB447ZZOiJGqxfpRBtO3i.pgseRL4dZu1U4dVk18FkWboLSUDFrCa', NULL, NULL, 'user', '2025-11-05 14:20:40.830263', '2025-11-11 18:07:50.000000', 0),
('87aa851f-56fd-4e18-9162-d44579efb801', 'admin', 'admin@gmail.com', '$2b$10$UBhdryptje.XCjdJ.F4MEuaFWMOf6lKG2UhV9Y.b9s3twLvtVngYK', NULL, NULL, 'admin', '2025-10-31 14:20:44.505269', '2025-10-31 14:21:11.973725', 0),
('9ca2ad1d-b0b4-4d26-9b04-48550726b297', 'Cao Huy', 'khachhang1@gmail.com', '$2b$10$L/sLkIwlPBjot49Q8VZQne8RWWY3H6SqDYYBtZ4Jq6hQJLOxavLyG', '0898988765', NULL, 'user', '2025-10-31 14:19:48.748840', '2025-10-31 14:19:48.748840', 0);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bug_reports`
--
ALTER TABLE `bug_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_bug_reports_title` (`title`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_420d9f679d41281f282f5bc7d0` (`slug`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_f1d359a55923bb45b057fbdab0d` (`orderId`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`product_id`,`category_id`),
  ADD KEY `IDX_8748b4a0e8de6d266f2bbc877f` (`product_id`),
  ADD KEY `IDX_9148da8f26fc248e77a387e311` (`category_id`);

--
-- Chỉ mục cho bảng `product_colors`
--
ALTER TABLE `product_colors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_66a3196a2a20a95674f00cf1ec3` (`productId`);

--
-- Chỉ mục cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_b367708bf720c8dd62fc6833161` (`productId`);

--
-- Chỉ mục cho bảng `product_specs`
--
ALTER TABLE `product_specs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_2831fa1ffe991b72d1e38f2f625` (`productId`);

--
-- Chỉ mục cho bảng `return_requests`
--
ALTER TABLE `return_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_return_user` (`user_id`),
  ADD KEY `idx_return_order` (`order_code`),
  ADD KEY `idx_return_status` (`status`);

--
-- Chỉ mục cho bảng `telegram_config`
--
ALTER TABLE `telegram_config`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `telegram_recipients`
--
ALTER TABLE `telegram_recipients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_a12980352de0bf87cf1396ef54` (`chat_id`);

--
-- Chỉ mục cho bảng `telegram_templates`
--
ALTER TABLE `telegram_templates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_f72036d9f628dcdd0f31d94f7f` (`key`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bug_reports`
--
ALTER TABLE `bug_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `product_colors`
--
ALTER TABLE `product_colors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `product_specs`
--
ALTER TABLE `product_specs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `return_requests`
--
ALTER TABLE `return_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `telegram_config`
--
ALTER TABLE `telegram_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `telegram_recipients`
--
ALTER TABLE `telegram_recipients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `telegram_templates`
--
ALTER TABLE `telegram_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FK_f1d359a55923bb45b057fbdab0d` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `product_categories`
--
ALTER TABLE `product_categories`
  ADD CONSTRAINT `FK_8748b4a0e8de6d266f2bbc877f6` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_9148da8f26fc248e77a387e3112` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `product_colors`
--
ALTER TABLE `product_colors`
  ADD CONSTRAINT `FK_66a3196a2a20a95674f00cf1ec3` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `FK_b367708bf720c8dd62fc6833161` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Các ràng buộc cho bảng `product_specs`
--
ALTER TABLE `product_specs`
  ADD CONSTRAINT `FK_2831fa1ffe991b72d1e38f2f625` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
