const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// --- CONEXIÓN A LA BASE DE DATOS (RAILWAY) ---
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

// Prueba de conexión automática al iniciar
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error INTENTANDO conectar a Railway:', err.code);
    console.error('🔍 Detalle:', err.message);
  } else {
    console.log('✅ ¡CONEXIÓN EXITOSA A RAILWAY! 🚀');
    console.log('🍬 Base de datos lista para DulceMundo');
    connection.release();
  }
});

// --- RUTAS ---

// 1. Ruta principal (Para probar en el navegador)
app.get('/', (req, res) => {
  res.send('¡Servidor Backend de DulceMundo funcionando! 🍭🐺');
});

// 2. Ruta para obtener productos
app.get('/api/productos', (req, res) => {
  const query = 'SELECT * FROM productos';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      res.status(500).send('Error al leer la base de datos');
    } else {
      res.json(results);
    }
  });
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
  console.log(`📡 Servidor escuchando en http://localhost:${PORT}`);
});