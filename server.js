const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- CONFIGURACIÓN DE CORS ---
// Permite que Vercel entre sin que el navegador bloquee la petición
app.use(cors({
    origin: '*', // En producción podrías poner tu URL de Vercel aquí
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true
}));

app.use(express.json());

// --- CONEXIÓN A LA BASE DE DATOS (CABOOSE) ---
// Usamos las variables que ya tienes configuradas en Railway
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 16352 // El puerto público de tu MySQL
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión a la BD:', err.message);
        return;
    }
    console.log('✅ Conexión establecida exitosamente con la base de datos');
});

// --- ENDPOINTS ---

// Login de administrador
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT id, nombre, rol FROM usuarios WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json({ error: "Error en el servidor" });
        if (result.length > 0) {
            res.json({ success: true, user: result[0] });
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    });
});

// Obtener productos para el catálogo
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
        if (err) return res.status(500).json({ error: "Error al obtener productos" });
        res.json(result);
    });
});

// --- EL PUERTO DINÁMICO ---
// Eliminamos el '4000' fijo para que Railway asigne el puerto que necesite
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Dulce Mundo corriendo en puerto ${PORT}`);
});