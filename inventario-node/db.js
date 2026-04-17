const mysql = require('mysql2/promise');

const dbConfig = {
  host: '136.248.247.250',
  port: 8080,
  user: 'mysql',
  password: '123456',
  database: 'inventario',
  multipleStatements: true
};

async function initDB() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión exitosa a VPS (Modo Promesas)');

    const sql = `
      CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        categoria_id INT,
        precio DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        total DECIMAL(10,2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS detalles_pedido (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pedido_id INT,
        producto_id INT,
        cantidad INT NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
      );

      INSERT IGNORE INTO categorias (nombre) VALUES ('Laptops'), ('Teclados'), ('Pantallas'), ('Baterías'), ('Cargadores'), ('General');
    `;

    await connection.query(sql);
    console.log('✅ Estructura "yubertec" sincronizada.');
    await connection.end();
  } catch (err) {
    console.error("❌ Error inicializando BD:", err);
  }
}

initDB();

// Exportamos un pool para manejar múltiples conexiones eficientemente
const pool = mysql.createPool(dbConfig);
module.exports = pool;
