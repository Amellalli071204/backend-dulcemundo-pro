const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ SOLUCIÓN CORS PARA EXPRESS 5
app.use(cors({
  origin: [
    'https://frontend-dulcemundo.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// ✅ IMPORTANTE: Responder a las peticiones Preflight (OPTIONS)
app.options('*', cors());

app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 16352,
    ssl: { rejectUnauthorized: false } // SSL Requerido por Railway
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error de conexión:', err.message);
        return;
    }
    console.log('✅ Backend conectado con SSL y CORS configurado');
});

// Endpoints (Login, Productos, Registro...)
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Dulce Mundo volando en puerto ${PORT}`);
});