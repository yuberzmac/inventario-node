const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener productos (con JOIN para traer el nombre de categoría)
router.get('/', (req, res) => {
    const sql = `
        SELECT p.*, IFNULL(c.nombre, 'General') as categoria 
        FROM productos p 
        LEFT JOIN categorias c ON p.categoria_id = c.id
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Error al leer productos", details: err });
        res.json(results);
    });
});

// GUARDAR PRODUCTO (Corregido)
router.post('/', (req, res) => {
    const { nombre, categoria, precio, stock } = req.body;
    
    // 1. Asegurar que la categoría existe (o crearla)
    const sqlCat = "INSERT IGNORE INTO categorias (nombre) VALUES (?)";
    db.query(sqlCat, [categoria || 'General'], (err) => {
        if (err) return res.status(500).json({ error: "Error en categoría", details: err });

        // 2. Obtener el ID de esa categoría
        db.query("SELECT id FROM categorias WHERE nombre = ?", [categoria || 'General'], (err, rows) => {
            if (err || rows.length === 0) return res.status(500).json({ error: "No se halló categoría" });
            
            const catId = rows[0].id;

            // 3. Insertar el producto con el ID de categoría (Llave Foránea)
            const sqlProd = "INSERT INTO productos (nombre, categoria_id, precio, stock) VALUES (?, ?, ?, ?)";
            db.query(sqlProd, [nombre, catId, precio, stock], (err, result) => {
                if (err) {
                    console.error("Error al insertar producto:", err);
                    return res.status(500).json({ error: "No se pudo guardar el producto", details: err });
                }
                res.json({ id: result.insertId, message: "Producto guardado con éxito" });
            });
        });
    });
});

// ACTUALIZAR PRODUCTO
router.put('/:id', (req, res) => {
    const { nombre, categoria, precio, stock } = req.body;
    const id = req.params.id;

    db.query("INSERT IGNORE INTO categorias (nombre) VALUES (?)", [categoria || 'General'], () => {
        db.query("SELECT id FROM categorias WHERE nombre = ?", [categoria || 'General'], (err, rows) => {
            const catId = rows[0].id;
            const sql = "UPDATE productos SET nombre=?, categoria_id=?, precio=?, stock=? WHERE id=?";
            db.query(sql, [nombre, catId, precio, stock, id], (err) => {
                if (err) return res.status(500).json({ error: err });
                res.json({ message: "Actualizado" });
            });
        });
    });
});

// COMPRAR (Transaccional)
router.post('/comprar', (req, res) => {
    const { carrito } = req.body;
    const total = carrito.reduce((acc, i) => acc + (i.precio * i.quantity), 0);

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: err });

        db.query("INSERT INTO pedidos (total) VALUES (?)", [total], (err, resPed) => {
            if (err) return db.rollback(() => res.status(500).json({ error: err }));
            
            const pedidoId = resPed.insertId;
            const promises = carrito.map(item => {
                return new Promise((resolve, reject) => {
                    db.query("INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?,?,?,?)", 
                    [pedidoId, item.id, item.quantity, item.precio], (err) => {
                        if (err) return reject(err);
                        db.query("UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?", 
                        [item.quantity, item.id, item.quantity], (err, resUpd) => {
                            if (err || resUpd.affectedRows === 0) reject(new Error("Stock insuficiente"));
                            else resolve();
                        });
                    });
                });
            });

            Promise.all(promises)
                .then(() => db.commit(() => res.json({ message: "Compra exitosa" })))
                .catch(err => db.rollback(() => res.status(400).json({ error: err.message })));
        });
    });
});

router.delete('/:id', (req, res) => {
    db.query("DELETE FROM productos WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Eliminado" });
    });
});

module.exports = router;
