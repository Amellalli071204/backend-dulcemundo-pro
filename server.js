const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- CONFIGURACIÓN DE CORS TOTAL (PARA ARREGLAR TU VIDEO) ---
// Esto permite que el navegador pase el "control check" que viste en el video
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));

app.use(express.json());

// --- CONEXIÓN A LA BASE DE DATOS (Usando tus variables de Railway) ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 16352
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión:', err.message);
        return;
    }
    console.log('✅ CONEXIÓN EXITOSA A CABOOSE');
});

// --- TUS ENDPOINTS (Verifica que tu tabla se llame 'usuarios') ---
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT id, nombre, rol FROM usuarios WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) res.json({ success: true, user: result[0] });
        else res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    });
});

app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Dulce Mundo en vivo puerto ${PORT}`));