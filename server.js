const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./')); // Serve frontend files

// --- API ENDPOINTS ---

// 1. Get All Aspirations
app.get('/api/aspirations', (req, res) => {
    db.all("SELECT * FROM aspirations ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. Submit New Aspiration
app.post('/api/aspirations', (req, res) => {
    const { tiket, nama, nik, email, kategori, kabupaten, judul, isi, tanggal } = req.body;
    const sql = `INSERT INTO aspirations (tiket, nama, nik, email, kategori, kabupaten, judul, isi, tanggal, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Baru')`;
    const params = [tiket, nama, nik, email, kategori, kabupaten, judul, isi, tanggal];
    
    db.run(sql, params, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, message: "Aspirasi berhasil disimpan ke database." });
    });
});

// 3. Update Aspiration Status
app.put('/api/aspirations/:tiket/status', (req, res) => {
    const { status } = req.body;
    const { tiket } = req.params;
    const sql = "UPDATE aspirations SET status = ? WHERE tiket = ?";
    
    db.run(sql, [status, tiket], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Status updated." });
    });
});

// 4. Delete Aspiration
app.delete('/api/aspirations/:tiket', (req, res) => {
    const { tiket } = req.params;
    db.run("DELETE FROM aspirations WHERE tiket = ?", tiket, function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Aspirasi deleted." });
    });
});

// 5. User Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            res.json({ success: true, user: row });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials." });
        }
    });
});

// 6. Get/Create Users (Admin only usually, simplified here)
app.get('/api/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/users', (req, res) => {
    const { name, username, email, password, role } = req.body;
    db.run("INSERT INTO users (name, username, email, password, role, lastLogin) VALUES (?, ?, ?, ?, ?, 'Belum login')",
        [name, username, email, password, role], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// 7. Activity Logs
app.get('/api/activity', (req, res) => {
    db.all("SELECT * FROM activity_logs ORDER BY id DESC LIMIT 50", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/activity', (req, res) => {
    const { user, action, time, icon, color } = req.body;
    db.run("INSERT INTO activity_logs (user, action, time, icon, color) VALUES (?, ?, ?, ?, ?)",
        [user, action, time, icon, color], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
