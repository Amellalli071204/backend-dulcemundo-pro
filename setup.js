const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 16352,
    ssl: { rejectUnauthorized: false }
});

const sql = `
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DECIMAL(10,2),
    descripcion TEXT,
    imagen_url TEXT
);

INSERT INTO productos (nombre, precio, descripcion, imagen_url) 
VALUES 
('Mazapán', 8.50, 'Tradicional', 'https://tu-url.com/mazapan.jpg'),
('Picafresa', 1.00, 'Gomita con chile', 'https://tu-url.com/fresa.jpg')
ON DUPLICATE KEY UPDATE nombre=nombre;`;

db.query(sql, (err) => {
    if (err) console.error("❌ Falló el setup:", err.message);
    else console.log("🍭 Base de datos surtida y lista.");
    db.end();
});