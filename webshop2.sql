-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Máy chủ: mysql:3306
-- Thời gian đã tạo: Th10 23, 2025 lúc 01:25 PM
-- Phiên bản máy phục vụ: 8.0.43
-- Phiên bản PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `webshop2`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitiethoadon`
--

CREATE TABLE `chitiethoadon` (
  `cthd_id` varchar(50) NOT NULL,
  `hoadon_id` varchar(50) NOT NULL,
  `sanpham_id` varchar(50) NOT NULL,
  `so_luong` int NOT NULL,
  `giam_gia_percent` int DEFAULT '0',
  `thanh_tien` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `chitiethoadon`
--

INSERT INTO `chitiethoadon` (`cthd_id`, `hoadon_id`, `sanpham_id`, `so_luong`, `giam_gia_percent`, `thanh_tien`) VALUES
('CTHD_37094a6d-9991-4fe5-83f7-3df5addac82e', 'HD_3fa7ba1a-49f2-4491-8abb-560f5026058b', 'SP_6697c5c7-88f4-4f2d-91ee-45ad2e4f2098', 1, 0, 100000),
('CTHD_6ogqhbrm', 'HD_42cwl2y5', 'SP_6697c5c7-88f4-4f2d-91ee-45ad2e4f2098', 1, 0, 100000),
('CTHD_74bf9f39-b868-41d3-b900-c4dd460108d3', 'HD_886781f2-056a-40af-b93d-ebf7231b7c49', 'SP_64f55de1-3085-40a0-bca7-55d3f23f341a', 1, 0, 120000),
('CTHD_8c5c237e-551c-405c-90c1-76b4142fd7fa', 'HD_fe154fbb-0d95-4c47-988b-a654edd10279', 'SP_6697c5c7-88f4-4f2d-91ee-45ad2e4f2098', 1, 0, 100000),
('CTHD_ax38swhj', 'HD_3l1k3e6x', 'SP_64f55de1-3085-40a0-bca7-55d3f23f341a', 1, 0, 120000),
('CTHD_bc947ea5-498c-4b0f-87e9-0b3a3914e1bc', 'HD_886781f2-056a-40af-b93d-ebf7231b7c49', 'SP_6697c5c7-88f4-4f2d-91ee-45ad2e4f2098', 1, 0, 100000),
('CTHD_ewtslyqp', 'HD_3l1k3e6x', 'SP_6697c5c7-88f4-4f2d-91ee-45ad2e4f2098', 1, 0, 100000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dia_chi_giao_hang`
--

CREATE TABLE `dia_chi_giao_hang` (
  `diachi_id` varchar(50) NOT NULL,
  `khachhang_id` varchar(50) DEFAULT NULL,
  `dia_chi` text,
  `mo_ta_dia_chi` text,
  `district` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `ward` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `dia_chi_giao_hang`
--

INSERT INTO `dia_chi_giao_hang` (`diachi_id`, `khachhang_id`, `dia_chi`, `mo_ta_dia_chi`, `district`, `province`, `ward`) VALUES
('DC_26ybrati', 'KH1760518421231', 'á', 'ads', 'Huyện Mường Tè', 'Tỉnh Lai Châu', 'Xã Tá Bạ'),
('DC_acc93c7e-93ce-44ec-b00d-60ecb29d2aad', 'KH1760326562021', 'ăde', 'waê', 'Huyện Pác Nặm', 'Tỉnh Bắc Kạn', 'Xã Bộc Bố');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedback`
--

CREATE TABLE `feedback` (
  `feedback_id` varchar(50) NOT NULL,
  `mota` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `sanpham_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `hoadon_id` varchar(50) DEFAULT NULL,
  `rating` tinyint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `feedback`
--

INSERT INTO `feedback` (`feedback_id`, `mota`, `user_id`, `sanpham_id`, `hoadon_id`, `rating`, `created_at`) VALUES
('FB_43svqhko', ' sản phẩm rất tốt ', 'id4', 'SP_64f55de1-3085-40a0-bca7-55d3f23f341a', 'HD_3fa7ba1a-49f2-4491-8abb-560f5026058b', 2, '2025-10-18 03:04:14'),
('FB_5aqagixd', ' sản phẩm rất tốt ', 'id4', 'SP_64f55de1-3085-40a0-bca7-55d3f23f341a', 'HD_3fa7ba1a-49f2-4491-8abb-560f5026058b', 2, '2025-10-17 03:00:06'),
('FB_7lpow838', ' sản phẩm rất tốt ', 'id4', 'SP_64f55de1-3085-40a0-bca7-55d3f23f341a', 'HD_3fa7ba1a-49f2-4491-8abb-560f5026058b', 4, '2025-10-17 00:22:23'),
('FB_7txrm6er', ' sản phẩm rất tốt ', 'id4', 'SP_64f55de1-3085-40a0-bca7-55d3f23f341a', 'HD_3fa7ba1a-49f2-4491-8abb-560f5026058b', 2, '2025-10-17 00:57:26'),
('FB_8mwa29au', ' sản phẩm rất tốt ', 'id4', 'SP_64f55de1-3085-40a0-bca7-55d3f23f341a', 'HD_3fa7ba1a-49f2-4491-8abb-560f5026058b', 5, '2025-10-17 00:25:16'),
('FB_du9ypc4f', ' sản phẩm rất tốt ', 'id4', 'SP_64f55de1-3085-40a0-bca7-55d3f23f341a', 'HD_3fa7ba1a-49f2-4491-8abb-560f5026058b', 2, '2025-10-18 07:42:51'),
('FB_f25ndoe4', ' sản phẩm rất tốt ', 'id4', 'SP_64f55de1-3085-40a0-bca7-55d3f23f341a', 'HD_3fa7ba1a-49f2-4491-8abb-560f5026058b', 0, '2025-10-16 15:18:53');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `feedback_images`
--

CREATE TABLE `feedback_images` (
  `feedback_images_id` varchar(50) NOT NULL,
  `feedback_id` varchar(50) NOT NULL,
  `image_url` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `feedback_images`
--

INSERT INTO `feedback_images` (`feedback_images_id`, `feedback_id`, `image_url`) VALUES
('FBimg_67ycyooh', 'FB_f25ndoe4', '1760626425945.avif'),
('FBimg_5lysilp9', 'FB_f25ndoe4', '1760626425948.avif'),
('FBimg_6am1kg4e', 'FB_7lpow838', '1760660542866.avif'),
('FBimg_d0371jwz', 'FB_7lpow838', '1760660542875.avif'),
('FBimg_e6jgjxri', 'FB_8mwa29au', '1760660716142.avif'),
('FBimg_9q4b0o5o', 'FB_8mwa29au', '1760660716145.avif'),
('FBimg_a5gqyv7y', 'FB_7txrm6er', '1760662645764.avif'),
('FBimg_bw7s5c3x', 'FB_7txrm6er', '1760662645793.avif'),
('FBimg_7lah4ouz', 'FB_5aqagixd', '1760670006310.avif'),
('FBimg_d9sxu6ji', 'FB_5aqagixd', '1760670006348.avif'),
('FBimg_didfxdmm', 'FB_43svqhko', '1760756654000.avif'),
('FBimg_d82pg9u4', 'FB_43svqhko', '1760756654017.avif'),
('FBimg_54d7wy58', 'FB_du9ypc4f', '1760748171771.avif'),
('FBimg_77k92e9e', 'FB_du9ypc4f', '1760748171781.avif');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoadon`
--

CREATE TABLE `hoadon` (
  `hoadon_id` varchar(50) NOT NULL,
  `khachhang_id` varchar(50) NOT NULL,
  `shop_id` varchar(50) NOT NULL,
  `ngay_lap` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tong_tien` int DEFAULT '0',
  `hinh_thuc_thanh_toan` varchar(50) DEFAULT NULL,
  `trang_thai` enum('chờ xử lý','đang xử lý','đang vận chuyển','đã giao','đã hủy','trả hàng/hoàn tiền') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'chờ xử lý',
  `giam_gia_tong_hd` int DEFAULT '0',
  `ghi_chu` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `hoadon`
--

INSERT INTO `hoadon` (`hoadon_id`, `khachhang_id`, `shop_id`, `ngay_lap`, `tong_tien`, `hinh_thuc_thanh_toan`, `trang_thai`, `giam_gia_tong_hd`, `ghi_chu`) VALUES
('HD_3fa7ba1a-49f2-4491-8abb-560f5026058b', 'KH1760326562021', 'shop57e68012-716a-429d-8923-35f821055490', '2025-10-13 04:28:31', 100000, 'cod', 'chờ xử lý', 0, ''),
('HD_3l1k3e6x', 'KH1760518421231', 'shop57e68012-716a-429d-8923-35f821055490', '2025-10-15 09:47:19', 220000, 'bank', 'chờ xử lý', 0, ''),
('HD_42cwl2y5', 'KH1760518421231', 'shop57e68012-716a-429d-8923-35f821055490', '2025-10-15 09:05:24', 100000, 'cod', 'chờ xử lý', 0, 'có'),
('HD_454qmw41', 'KH1760518421231', 'shop90a2da9e-2bfd-4d79-a381-1e6a4371c08a', '2025-10-15 09:05:24', 120000, 'cod', 'đã giao', 0, 'có'),
('HD_886781f2-056a-40af-b93d-ebf7231b7c49', 'KH1760326562021', 'shop57e68012-716a-429d-8923-35f821055490', '2025-10-13 04:57:04', 220000, 'cod', 'đang xử lý', 0, 'q'),
('HD_b6lw7zm3', 'KH1760326562021', 'shop90a2da9e-2bfd-4d79-a381-1e6a4371c08a', '2025-10-15 08:58:11', 120000, 'cod', 'chờ xử lý', 0, 'a'),
('HD_e0044ff7-91ae-4c76-a280-f112948e5913', 'KH1760326562021', 'shop90a2da9e-2bfd-4d79-a381-1e6a4371c08a', '2025-10-13 04:53:32', 120000, 'cod', 'trả hàng/hoàn tiền', 0, 'ewq'),
('HD_e1hmoqdj', 'KH1760518421231', 'shop90a2da9e-2bfd-4d79-a381-1e6a4371c08a', '2025-10-15 09:47:19', 120000, 'bank', 'trả hàng/hoàn tiền', 0, ''),
('HD_f24d274f-e02e-4218-ac7e-79c60408e3d9', 'KH1760326562021', 'shop90a2da9e-2bfd-4d79-a381-1e6a4371c08a', '2025-10-13 04:28:31', 120000, 'cod', 'đã giao', 0, ''),
('HD_fe154fbb-0d95-4c47-988b-a654edd10279', 'KH1760326562021', 'shop57e68012-716a-429d-8923-35f821055490', '2025-10-13 04:53:32', 100000, 'cod', 'chờ xử lý', 0, 'ewq');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khachhang`
--

CREATE TABLE `khachhang` (
  `khachhang_id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `ten_khachhang` varchar(150) NOT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `default_KH` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `khachhang`
--

INSERT INTO `khachhang` (`khachhang_id`, `user_id`, `ten_khachhang`, `so_dien_thoai`, `default_KH`, `active`) VALUES
('KH1760326562021', 'id4', 'Nguyễn văn tuấn', '0979326005', 0, 1),
('KH1760518421231', 'id4', 'Nguyễn văn tuấn', '0979326005', 0, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `kho`
--

CREATE TABLE `kho` (
  `kho_id` varchar(50) NOT NULL,
  `shop_id` varchar(50) NOT NULL,
  `ten_kho` varchar(255) DEFAULT NULL,
  `dia_chi` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `kho`
--

INSERT INTO `kho` (`kho_id`, `shop_id`, `ten_kho`, `dia_chi`) VALUES
('KHO_e0ab6c9a-5bb6-46f6-a004-9974545faed3', 'shop57e68012-716a-429d-8923-35f821055490', 'kho thủ  dầu', 'thủ dầumột'),
('KHO_ff4e3e9e-810d-485d-9c05-5143c30b1088', 'shop90a2da9e-2bfd-4d79-a381-1e6a4371c08a', 'kho cỏ', 'cỏ tmd');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `kho_sanpham`
--

CREATE TABLE `kho_sanpham` (
  `kho_sanpham_id` varchar(50) NOT NULL,
  `kho_id` varchar(50) NOT NULL,
  `sanpham_id` varchar(50) NOT NULL,
  `so_luong_ton` int NOT NULL,
  `ngay_nhap` datetime DEFAULT NULL,
  `nha_cung_cap` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `kho_sanpham`
--

INSERT INTO `kho_sanpham` (`kho_sanpham_id`, `kho_id`, `sanpham_id`, `so_luong_ton`, `ngay_nhap`, `nha_cung_cap`) VALUES
('SPkho_525ced7a-ad28-4637-8acd-cff698a047af', 'KHO_e0ab6c9a-5bb6-46f6-a004-9974545faed3', 'SP_64f55de1-3085-40a0-bca7-55d3f23f341a', 10, '2025-10-11 03:30:09', 'tuấn'),
('SPkho_77lqvqfd', 'KHO_ff4e3e9e-810d-485d-9c05-5143c30b1088', 'SP_cdpest4x', 23, '2025-10-22 16:16:11', 'tuấn'),
('SPkho_7e46cf1c-50f8-4f83-9063-aebac08c13cd', 'KHO_e0ab6c9a-5bb6-46f6-a004-9974545faed3', 'SP_6697c5c7-88f4-4f2d-91ee-45ad2e4f2098', 9, '2025-10-11 03:33:32', '978');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sanpham`
--

CREATE TABLE `sanpham` (
  `sanpham_id` varchar(50) NOT NULL,
  `ten_sanpham` varchar(150) NOT NULL,
  `gia_ban` int NOT NULL,
  `mo_ta` text,
  `url_sanpham` varchar(255) DEFAULT NULL,
  `shop_id` varchar(50) NOT NULL,
  `loai_sanpham` varchar(100) DEFAULT NULL,
  `giam_gia_SP` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `sanpham`
--

INSERT INTO `sanpham` (`sanpham_id`, `ten_sanpham`, `gia_ban`, `mo_ta`, `url_sanpham`, `shop_id`, `loai_sanpham`, `giam_gia_SP`) VALUES
('SP_64f55de1-3085-40a0-bca7-55d3f23f341a', 'hoa hồng đỏ', 120000, 'hoa hồng', '/1760153409153.jpg', 'shop57e68012-716a-429d-8923-35f821055490', 'thoi_trang', NULL),
('SP_6697c5c7-88f4-4f2d-91ee-45ad2e4f2098', 'hoa hồng xanh', 100000, 'hoa hồng', '/1760153611774.jpg', 'shop57e68012-716a-429d-8923-35f821055490', 'thoi_trang', NULL),
('SP_cdpest4x', 'cỏ văn mền', 120000, 'cs', '/1761124570920.avif', 'shop90a2da9e-2bfd-4d79-a381-1e6a4371c08a', 'dien_thoai', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shop`
--

CREATE TABLE `shop` (
  `shop_id` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `ten_shop` varchar(150) NOT NULL,
  `mo_ta` text,
  `the_loai` varchar(100) DEFAULT NULL,
  `ngay_tao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `url_shop` varchar(50) DEFAULT NULL,
  `dia_chi_shop` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `shop`
--

INSERT INTO `shop` (`shop_id`, `user_id`, `ten_shop`, `mo_ta`, `the_loai`, `ngay_tao`, `url_shop`, `dia_chi_shop`) VALUES
('shop57e68012-716a-429d-8923-35f821055490', 'id2', 'shop bán hoa', 'shop chuyên về hoa', 'hoa', '2025-10-11 03:26:12', '/1760153172837.jpg', 'xom 6'),
('shop90a2da9e-2bfd-4d79-a381-1e6a4371c08a', 'id3', 'nhà cỏ dại', 'nhà cỏ', 'bán cỏ cho bò ăn', '2025-10-11 03:42:29', '/1760154149457.jpg', 'xom9');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` varchar(50) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `email`, `phone`, `user_name`, `password`, `role`, `avatar_url`, `date_of_birth`, `status`, `last_login`, `created_at`, `updated_at`) VALUES
('id2', 'Nguyen', 'Van A', 'ngqewd112đáada@exampádle.com', '0123d1ưqa219', '11', '$2b$10$GPkD4m16xowUHymOziPoC.cOUSQ1Jb3ECgoGLYXVwx.LkLyLKbSTO', 'admin', NULL, '2000-01-01', 'active', NULL, '2025-09-29 15:29:27', '2025-09-29 15:29:27'),
('id3', 'Nguyen', 'Van A', 'ngqewưqd112đ3áada@exampádle.com', '01323d1qa219', '12', '$2b$10$BMffxt1V4CN88Ukzd7BJVOEkRItfeNKOXSOfbZZCLxGfsbLi3Unva', 'admin', NULL, '2000-01-01', 'active', NULL, '2025-10-11 03:25:20', '2025-10-11 03:25:20'),
('id4', 'Nguyen', 'Van A', 'ngqewưqd1122đ3áada@exampádle.com', '01323d1q2a219', '13', '$2b$10$awdaNVRES89gLBBr/44PmuI4.QwT03Ly7jk6lVZvJVBUeM5XpGNqC', 'user', NULL, '2000-01-01', 'active', NULL, '2025-10-11 03:25:28', '2025-10-11 03:25:28');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `chitiethoadon`
--
ALTER TABLE `chitiethoadon`
  ADD PRIMARY KEY (`cthd_id`),
  ADD KEY `hoadon_id` (`hoadon_id`),
  ADD KEY `sanpham_id` (`sanpham_id`);

--
-- Chỉ mục cho bảng `dia_chi_giao_hang`
--
ALTER TABLE `dia_chi_giao_hang`
  ADD PRIMARY KEY (`diachi_id`),
  ADD KEY `khachhang_id` (`khachhang_id`);

--
-- Chỉ mục cho bảng `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `fk_feedback_user` (`user_id`),
  ADD KEY `fk_feedback_sanpham` (`sanpham_id`),
  ADD KEY `fk_feedback_hoadon` (`hoadon_id`);

--
-- Chỉ mục cho bảng `feedback_images`
--
ALTER TABLE `feedback_images`
  ADD KEY `fk_image_feedback` (`feedback_id`);

--
-- Chỉ mục cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD PRIMARY KEY (`hoadon_id`),
  ADD KEY `khachhang_id` (`khachhang_id`),
  ADD KEY `shop_id` (`shop_id`);

--
-- Chỉ mục cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  ADD PRIMARY KEY (`khachhang_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `kho`
--
ALTER TABLE `kho`
  ADD PRIMARY KEY (`kho_id`),
  ADD KEY `shop_id` (`shop_id`);

--
-- Chỉ mục cho bảng `kho_sanpham`
--
ALTER TABLE `kho_sanpham`
  ADD PRIMARY KEY (`kho_sanpham_id`),
  ADD KEY `kho_id` (`kho_id`),
  ADD KEY `sanpham_id` (`sanpham_id`);

--
-- Chỉ mục cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD PRIMARY KEY (`sanpham_id`),
  ADD KEY `shop_id` (`shop_id`);

--
-- Chỉ mục cho bảng `shop`
--
ALTER TABLE `shop`
  ADD PRIMARY KEY (`shop_id`),
  ADD UNIQUE KEY `unique_user_shop` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `chitiethoadon`
--
ALTER TABLE `chitiethoadon`
  ADD CONSTRAINT `fk_cthd_hoadon` FOREIGN KEY (`hoadon_id`) REFERENCES `hoadon` (`hoadon_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cthd_sanpham` FOREIGN KEY (`sanpham_id`) REFERENCES `sanpham` (`sanpham_id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `dia_chi_giao_hang`
--
ALTER TABLE `dia_chi_giao_hang`
  ADD CONSTRAINT `dia_chi_giao_hang_ibfk_1` FOREIGN KEY (`khachhang_id`) REFERENCES `khachhang` (`khachhang_id`);

--
-- Ràng buộc cho bảng `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `fk_feedback_hoadon` FOREIGN KEY (`hoadon_id`) REFERENCES `hoadon` (`hoadon_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_feedback_sanpham` FOREIGN KEY (`sanpham_id`) REFERENCES `sanpham` (`sanpham_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `feedback_images`
--
ALTER TABLE `feedback_images`
  ADD CONSTRAINT `fk_image_feedback` FOREIGN KEY (`feedback_id`) REFERENCES `feedback` (`feedback_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `hoadon`
--
ALTER TABLE `hoadon`
  ADD CONSTRAINT `fk_hoadon_khachhang` FOREIGN KEY (`khachhang_id`) REFERENCES `khachhang` (`khachhang_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_hoadon_shop` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`shop_id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `khachhang`
--
ALTER TABLE `khachhang`
  ADD CONSTRAINT `fk_khachhang_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `kho`
--
ALTER TABLE `kho`
  ADD CONSTRAINT `fk_kho_shop` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`shop_id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `kho_sanpham`
--
ALTER TABLE `kho_sanpham`
  ADD CONSTRAINT `fk_kho_sanpham_kho` FOREIGN KEY (`kho_id`) REFERENCES `kho` (`kho_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_kho_sanpham_sanpham` FOREIGN KEY (`sanpham_id`) REFERENCES `sanpham` (`sanpham_id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `fk_sanpham_shop` FOREIGN KEY (`shop_id`) REFERENCES `shop` (`shop_id`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `shop`
--
ALTER TABLE `shop`
  ADD CONSTRAINT `fk_shop_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
