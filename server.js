const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 16352
});

// ✅ REAL: Endpoint de Registro (Ya no marcará 404)
app.post('/api/registro', (req, res) => {
    const { nombre, email, password } = req.body;
    const sql = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, 'cliente')";
    db.query(sql, [nombre, email, password], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Usuario registrado con éxito" });
    });
});

// ✅ REAL: Login que SI devuelve al usuario para guardarlo en el Front
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT id, nombre, rol FROM usuarios WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            // Mandamos los datos para que el Front los guarde en localStorage
            res.json({ success: true, user: result[0] }); 
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    });
});

app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Dulce Mundo API en puerto ${PORT}`);
});