const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// --- CONFIGURACIÓN DE SEGURIDAD (CORS) ---
// Esto permite que tu web en Vercel hable con este servidor en Railway
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// --- CONEXIÓN DIRECTA A LA BASE DE DATOS (CABOOSE) ---
// REEMPLAZA 'TU_PASSWORD' con la que aparece en tu link de Railway
const db = mysql.createConnection({
    host: 'caboose.proxy.rlwy.net',
    user: 'root',
    password: 'PnFGuaOByRrEdjcojTNFgJzOFpFmaMHe', 
    database: 'railway',
    port: 16352
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.message);
        return;
    }
    console.log('✅ ¡CONECTADO EXITOSAMENTE A LA BD CABOOSE EN EL PUERTO 16352!');
});

// --- RUTAS DEL SISTEMA ---

// Login: Para que admin@dulcemundo.com pueda entrar
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

// Registro: Para que clientes como "Juan" puedan crearse
app.post('/api/registro', (req, res) => {
    const { nombre, email, password } = req.body;
    const sql = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'cliente')";
    db.query(sql, [nombre, email, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Usuario creado exitosamente 🍭" });
    });
});

// Catálogo: Para que los dulces aparezcan en pantalla
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor de Dulce Mundo corriendo en puerto ${PORT}`);
});