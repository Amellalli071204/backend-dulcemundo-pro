const mysql = require('mysql2');
// Comenta la línea de dotenv para que railway run mande sus propias variables
// require('dotenv').config(); 

const connection = mysql.createConnection({
  // Railway CLI inyecta estas variables automáticamente
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME,
  port: process.env.MYSQLPORT || process.env.DB_PORT
});

const sql = `
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    precio DECIMAL(10,2),
    imagen_url TEXT
);
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    rol ENUM('admin', 'cliente') DEFAULT 'cliente'
);
INSERT IGNORE INTO usuarios (nombre, email, password, rol) 
VALUES ('Amellalli Admin', 'admin@dulcemundo.com', 'admin123', 'admin');
`;

connection.connect(err => {
  if (err) throw err;
  console.log("✅ Conectado a Railway exitosamente!");
  
  // Ejecutamos los comandos uno por uno (:
  const queries = sql.split(';').filter(q => q.trim());
  queries.forEach(query => {
    connection.query(query, (err) => {
      if (err) console.log("❌ Error en query:", err.message);
      else console.log("✅ Comando ejecutado.");
    });
  });
});