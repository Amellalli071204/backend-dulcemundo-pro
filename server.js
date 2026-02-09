const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURACIÓN DE CONEXIÓN CON SSL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 16352,
    ssl: {
        rejectUnauthorized: false // REQUERIDO PARA RAILWAY
    }
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión a la BD:', err.message);
        return;
    }
    console.log('✅ Conexión segura establecida con MySQL en Railway');
});

// ENDPOINTS
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

// PUERTO DINÁMICO PARA RAILWAY
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Dulce Mundo API lista en el puerto ${PORT}`);
});