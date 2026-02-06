const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- 1. CONFIGURACIÓN DE CORS ---
// La librería cors ya maneja las peticiones OPTIONS automáticamente.
// No necesitamos agregar app.options('*') manualmente.
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));

app.use(express.json());

// --- 2. CONEXIÓN A LA BASE DE DATOS (Caboose) ---
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
    console.log('✅ Conexión establecida con la base de datos de Dulce Mundo');
});

// --- 3. RUTAS (ENDPOINTS) ---

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT id, nombre, rol FROM usuarios WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            res.json({ success: true, user: result[0] });
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    });
});

app.post('/api/registro', (req, res) => {
    const { nombre, email, password } = req.body;
    const sql = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'cliente')";
    db.query(sql, [nombre, email, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Usuario creado exitosamente 🍭" });
    });
});

app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// --- 4. ENCENDER SERVIDOR ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Motor de Dulce Mundo encendido en el puerto ${PORT}`);
});
db.connect((err) => {
    if (err) {
        // Esto aparecerá en los logs de Railway y nos dirá el error REAL
        console.error('❌ ERROR REAL DE BD:', err.code, err.message);
        return;
    }
    console.log('✅ CONEXIÓN EXITOSA A LA BASE DE DATOS');
});