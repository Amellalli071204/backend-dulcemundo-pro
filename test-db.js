// backend/test-db.js
const mysql = require('mysql2');

console.log("🐺 Intentando conectar a Railway...");

const connection = mysql.createConnection({
  host: 'autorack.proxy.rlwy.net',
  user: 'root',
  database: 'railway',
  password: 'PON_AQUI_TU_CONTRASEÑA_REAL', // <--- Escríbela tú misma
  port: 42301,                            // <--- Verifica si sigue siendo este número
  ssl: {
    rejectUnauthorized: false
  }
});

connection.connect((err) => {
  if (err) {
    console.error('❌ ERROR FATAL:', err.code);
    console.error('📝 Mensaje:', err.message);
  } else {
    console.log('✅ ¡EXITO! La conexión funciona perfectamente.');
    connection.end();
  }
});