-- ==========================================================
-- SKEMA DATABASE LAYANAN ASPIRASI DIGITAL DPRD JATIM
-- SIAP UNTUK DIIMPOR KE MYSQL / PHPMYADMIN
-- ==========================================================

-- 1. Buat Database
-- CREATE DATABASE IF NOT EXISTS db_aspirasi;
-- USE db_aspirasi;

-- 2. Tabel Aspirasi (Penyimpanan laporan masyarakat)
DROP TABLE IF EXISTS aspirations;
CREATE TABLE aspirations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tiket VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    nik VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    kabupaten VARCHAR(100) NOT NULL,
    judul VARCHAR(255) NOT NULL,
    isi TEXT NOT NULL,
    tanggal VARCHAR(50) NOT NULL,
    status ENUM('Baru', 'Validasi', 'Diproses', 'Selesai') DEFAULT 'Baru'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Users (Manajemen administrator dan petugas)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Super Admin', 'Petugas Validasi', 'Petugas Progres') NOT NULL,
    lastLogin VARCHAR(50) DEFAULT 'Belum login'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabel Activity Logs (Catatan aktivitas panel admin)
DROP TABLE IF EXISTS activity_logs;
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(100) NOT NULL,
    action VARCHAR(255) NOT NULL,
    time VARCHAR(50) NOT NULL,
    icon VARCHAR(50) DEFAULT 'fa-info-circle',
    color VARCHAR(30) DEFAULT 'text-info'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Tabel Web Settings (Penyimpanan konfigurasi tampilan website secara dinamis)
DROP TABLE IF EXISTS web_settings;
CREATE TABLE web_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(50) UNIQUE NOT NULL,
    config_value TEXT,
    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================================
-- PENGISIAN DATA AWAL (DEFAULT DATA)
-- ==========================================================

-- Pengisian Data User Default
INSERT INTO users (name, username, email, password, role, lastLogin) VALUES 
('Admin Pusat', 'admin', 'admin@dprd.jt', '123', 'Super Admin', 'Baru saja'),
('Petugas Validasi 1', 'petugas1', 'val1@dprd.jt', '123', 'Petugas Validasi', '10 menit yang lalu'),
('Petugas Progres Jatim', 'petugas2', 'prog@dprd.jt', '123', 'Petugas Progres', '3 jam yang lalu');

-- Pengisian Contoh Aspirasi
INSERT INTO aspirations (tiket, nama, nik, email, kategori, kabupaten, judul, isi, tanggal, status) VALUES 
('#JTM-5962', 'Dwi insan pinayungan', '5125253412421524', 'ayongfams31@gmail.com', 'Pendidikan', 'Bojonegoro', 'Bantuan Beasiswa', 'Memohon bantuan beasiswa untuk mahasiswa berprestasi.', '11 Mar 2026, 11.15', 'Selesai'),
('#JTM-6750', 'Ahmad Ridwan', '3512345678901234', 'ahmad@mail.com', 'Infrastruktur', 'Surabaya', 'Perbaikan Jalan', 'Jalan di wilayah kami berlubang dan membahayakan.', '11 Mar 2026, 08.46', 'Diproses');

-- Pengisian Konfigurasi Web Utama
INSERT INTO web_settings (config_key, config_value, description) VALUES 
('site_title', 'DPRD JATIM - Provinsi Jawa Timur', 'Judul utama website'),
('hero_url', 'https://beritajatim.com/wp-content/uploads/2024/03/DPRD-Jatim.webp', 'URL background hero section'),
('hero_subtitle', 'Wadah penyampaian aspirasi, saran, dan keluhan masyarakat untuk Jawa Timur yang lebih baik.', 'Sub-judul di halaman depan'),
('contact_email', 'setwan@dprd.jatimprov.go.id', 'Email kontak resmi'),
('contact_phone', '(031) 3524001', 'Nomor telepon resmi'),
('logo_header', 'https://static.atnmedia.id/2025/04/23/dprd-jatim-FfhO8.png', 'URL Logo navigasi atas'),
('logo_footer', 'https://static.atnmedia.id/2025/04/23/dprd-jatim-FfhO8.png', 'URL Logo di bagian footer'),
('primary_color', '#d32f2f', 'Warna dasar tema website'),
('about_us', 'Dewan Perwakilan Rakyat Daerah Provinsi Jawa Timur adalah lembaga perwakilan rakyat daerah tingkat provinsi yang berkedudukan sebagai unsur penyelenggara pemerintahan daerah provinsi Jawa Timur.', 'Keterangan tentang instansi'),
('office_address', 'Jl. Indrapura No.1, Krembangan Sel., Kec. Krembangan, Surabaya, Jawa Timur 60175', 'Alamat kantor lengkap'),
('social_facebook', 'https://www.facebook.com/dprdjatim/?locale=id_ID', 'Link Facebook resmi'),
('social_twitter', 'https://x.com/dprdprovjatim', 'Link Twitter/X resmi'),
('social_instagram', 'https://www.instagram.com/dprdjatim/', 'Link Instagram resmi'),
('social_youtube', 'https://www.youtube.com/@DPRDProvinsiJawaTimur', 'Link YouTube resmi'),
('meta_title', 'Layanan Aspirasi Rakyat - DPRD Jawa Timur', 'Judul untuk SEO/Tab Browser'),
('meta_description', 'Wadah penyampaian aspirasi, saran, dan pengaduan masyarakat secara online kepada DPRD Provinsi Jawa Timur.', 'Deskripsi untuk SEO/Google');
