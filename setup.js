const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 16352,
    ssl: { rejectUnauthorized: false } // SSL ACTIVADO
});

const crearTabla = `
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DECIMAL(10,2),
    descripcion TEXT,
    imagen_url TEXT
);`;

// INSERTAMOS DULCES DE PRUEBA
const insertarDulces = `
INSERT INTO productos (nombre, precio, descripcion, imagen_url) 
VALUES 
('Mazapán', 8.50, 'Dulce tradicional de cacahuate', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Mazapan.jpg/250px-Mazapan.jpg'),
('Picafresa', 1.50, 'Gomita con chilito', 'https://m.media-amazon.com/images/I/71YySsq8L8L._SL1500_.jpg'),
('Paleta Payaso', 18.00, 'Malvavisco con chocolate', 'https://m.media-amazon.com/images/I/61M6Y3+87yL._SL1000_.jpg')
ON DUPLICATE KEY UPDATE nombre=nombre;`;

db.query(crearTabla, (err) => {
    if (err) {
        console.error("❌ Error en el setup:", err.message);
        process.exit(1);
    }
    console.log("✅ Tabla productos lista.");
    
    db.query(insertarDulces, (err) => {
        if (err) console.error("❌ Error al insertar dulces:", err.message);
        else console.log("🍭 Dulces cargados correctamente.");
        db.end();
    });
});