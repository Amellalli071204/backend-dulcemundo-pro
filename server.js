const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- CONFIGURACIÓN DE CORS DEFINITIVA ---
// Esto elimina el error de "blocked by CORS policy" que se ve en tu video
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));

app.use(express.json());

// --- CONEXIÓN A LA BASE DE DATOS (CABOOSE) ---
// Usamos las variables que ya tienes en Railway
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
    console.log('✅ Conexión exitosa a la base de datos');
});

// --- ENDPOINTS ---
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

// USAMOS EL PUERTO DINÁMICO DE RAILWAY
const PORT = process.env.PORT || 4000;
// Agregamos '0.0.0.0' para que Railway pueda "ver" tu servidor desde afuera
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor de Dulce Mundo despertó en el puerto ${PORT}`);
});