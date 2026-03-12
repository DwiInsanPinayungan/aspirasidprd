const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

// ==========================================
// PILIHAN 1: SQLite (NON-AKTIF)
// ==========================================
/*
const sqlite3 = require('sqlite3').verbose();
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);
*/

// ==========================================
// PILIHAN 2: MySQL (AKTIF)
// Konfigurasi menggunakan Environment Variables untuk Keamanan & Deployment
// ==========================================
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_aspirasi',
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi MySQL Gagal: ' + err.stack);
        console.error('TIPS: Cek file .env atau pastikan MySQL XAMPP sudah menyala.');
        return;
    }
    console.log('Koneksi database berhasil.');
});

// Standardisasi Interface agar sama dengan SQLite (Wrapper untuk mysql2)
module.exports = {
    all: (query, params, cb) => {
        db.query(query, params, (err, res) => cb(err, res));
    },
    get: (query, params, cb) => {
        db.query(query, params, (err, res) => {
            cb(err, res && res.length > 0 ? res[0] : null);
        });
    },
    run: (query, params, cb) => {
        db.query(query, params, function(err, res) {
            // Mock context SQLite (this.lastID)
            const context = { lastID: res ? res.insertId : null };
            cb.call(context, err);
        });
    },
    prepare: (query) => {
        return {
            run: (params) => db.query(query, params),
            finalize: () => {}
        };
    },
    serialize: (cb) => cb()
};

