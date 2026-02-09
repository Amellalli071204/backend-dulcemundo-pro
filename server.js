const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

/**
 * ============================
 * CORS — EXPRESS 5 COMPATIBLE
 * ============================
 * NO usar app.options('*')
 * Express 5 maneja OPTIONS solo
 */
app.use(cors({
  origin: [
    'https://frontend-dulcemundo.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

/**
 * ============================
 * CONEXIÓN MYSQL (RAILWAY)
 * ============================
 */
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }
});

db.connect(err => {
  if (err) {
    console.error('❌ Error conectando a MySQL:', err.message);
    process.exit(1); // 🚨 si no conecta, que el server NO levante
  }
  console.log('✅ MySQL conectado correctamente');
});

/**
 * ============================
 * ENDPOINTS
 * ============================
 */

// Obtener productos
app.get('/api/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, rows) => {
    if (err) {
      console.error('❌ Error al obtener productos:', err.message);
      return res.status(500).json({ message: 'Error al obtener productos' });
    }
    res.json(rows);
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT id, nombre, rol 
    FROM usuarios 
    WHERE email = ? AND password = ?
  `;

  db.query(sql, [email, password], (err, rows) => {
    if (err) {
      console.error('❌ Error en login:', err.message);
      return res.status(500).json({ message: 'Error en login' });
    }

    if (rows.length === 0) {
      return res.status(401).json({ success: false });
    }

    res.json({
      success: true,
      user: rows[0]
    });
  });
});

// Registro
app.post('/api/registro', (req, res) => {
  const { nombre, email, password } = req.body;

  const sql = `
    INSERT INTO usuarios (nombre, email, password)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [nombre, email, password], err => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'El correo ya existe' });
      }
      console.error('❌ Error en registro:', err.message);
      return res.status(500).json({ message: 'Error al registrar usuario' });
    }

    res.json({ success: true });
  });
});

/**
 * ============================
 * START SERVER
 * ============================
 */
const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Dulce Mundo API corriendo en puerto ${PORT}`);
});
