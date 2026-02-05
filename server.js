const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- 1. CONFIGURACIÓN DE SEGURIDAD (CORS) ---
// Esto arregla el error de "blocked by CORS policy" que viste en la consola
app.use(cors({
    origin: '*', // En producción, puedes cambiar '*' por tu URL de Vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// --- 2. CONEXIÓN A LA BASE DE DATOS ---
// Usamos las variables que configuraste en Railway
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'caboose.proxy.rlwy.net',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'railway',
    port: process.env.DB_PORT || 16352
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la BD de Railway:', err);
        return;
    }
    console.log('✅ Conexión exitosa a la base de datos de Dulce Mundo');
});

// --- 3. RUTAS DEL SISTEMA ---

// Obtener productos para el Catálogo
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Registro de Clientes
app.post('/api/registro', (req, res) => {
    const { nombre, email, password } = req.body;
    const sql = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'cliente')";
    
    db.query(sql, [nombre, email, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "Este correo ya está registrado 🍭" });
            }
            return res.status(500).json(err);
        }
        res.json({ success: true, message: "¡Usuario creado con éxito!" });
    });
});

// Login de Usuarios (Admin y Clientes)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT id, nombre, rol FROM usuarios WHERE email = ? AND password = ?";
    
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            res.json({ success: true, user: result[0] });
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas ❌" });
        }
    });
});

// --- 4. ENCENDER SERVIDOR ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Dulce Mundo corriendo en puerto ${PORT}`);
});