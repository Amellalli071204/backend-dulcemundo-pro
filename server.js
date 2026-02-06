const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- CONFIGURACIÓN DE CORS DEFINITIVA ---
// Esto permite que Vercel hable con Railway sin que el navegador los bloquee
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));

// Responder a peticiones preflight (el error rojo que ves en consola)
app.options('*', cors());

app.use(express.json());

// --- CONEXIÓN A LA BASE DE DATOS (CABOOSE) ---
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
    console.log('✅ CONEXIÓN EXITOSA A RAILWAY');
});

// --- TUS RUTAS (Verificadas con tus tablas en DBeaver) ---
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT id, nombre, rol FROM usuarios WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) res.json({ success: true, user: result[0] });
        else res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Dulce Mundo activo en puerto ${PORT}`));