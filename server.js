const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();

/**
 * ============================
 * CORS (NO es el problema, pero correcto)
 * ============================
 */
app.use(cors({
  origin: true, // permite cualquier origen válido (Vercel incluido)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

/**
 * ============================
 * MYSQL POOL (CRÍTICO)
 * ============================
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

/**
 * ============================
 * HEALTH CHECK (MUY IMPORTANTE)
 * ============================
 */
app.get('/', (req, res) => {
  res.send('🚀 Dulce Mundo API viva');
});

/**
 * ============================
 * ENDPOINT PRODUCTOS
 * ============================
 */
app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (err) {
    console.error('❌ DB error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * ============================
 * START SERVER (OBLIGATORIO)
 * ============================
 */
const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Dulce Mundo API escuchando en ${PORT}`);
});
