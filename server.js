const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ MOVEMOS ESTO AL PRINCIPIO: Configuración manual de Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://frontend-dulcemundo.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 16352,
  ssl: { rejectUnauthorized: false } // Obligatorio para Railway
});

// Endpoint de productos con log de verificación
app.get('/api/productos', (req, res) => {
  console.log("📥 Petición de productos recibida");
  db.query('SELECT * FROM productos', (err, rows) => {
    if (err) {
      console.error('❌ Error SQL:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Dulce Mundo API lista en puerto ${PORT}`);
});