const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '136.248.247.250',
  port: 8080,
  user: 'mysql',
  password: '123456', // Mantengo la contraseña anterior, cámbiala si es otra
  database: 'inventario'
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos remota: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos MySQL en la VPS (136.248.247.250) por el puerto 8080');

  // Crear la tabla automáticamente si no existe
  const sql = `
    CREATE TABLE IF NOT EXISTS productos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      categoria VARCHAR(50) DEFAULT 'General',
      precio DECIMAL(10,2) NOT NULL,
      stock INT NOT NULL
    )
  `;
  
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log('Tabla "productos" verificada/creada en la VPS.');
  });
});

module.exports = connection;
