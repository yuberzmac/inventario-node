const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los productos
router.get('/', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Crear un producto
router.post('/', (req, res) => {
  const { nombre, categoria, precio, stock } = req.body;
  db.query('INSERT INTO productos (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)', 
  [nombre, categoria, precio, stock], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ id: results.insertId, nombre, categoria, precio, stock });
  });
});

// Actualizar un producto
router.put('/:id', (req, res) => {
  const { nombre, categoria, precio, stock } = req.body;
  db.query('UPDATE productos SET nombre = ?, categoria = ?, precio = ?, stock = ? WHERE id = ?', 
  [nombre, categoria, precio, stock, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Producto actualizado' });
  });
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM productos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Producto eliminado' });
  });
});

module.exports = router;
