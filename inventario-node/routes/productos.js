const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener productos
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT p.*, IFNULL(c.nombre, 'General') as categoria 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Guardar producto
router.post('/', async (req, res) => {
    const { nombre, categoria, precio, stock } = req.body;
    try {
        await db.query("INSERT IGNORE INTO categorias (nombre) VALUES (?)", [categoria || 'General']);
        const [catRows] = await db.query("SELECT id FROM categorias WHERE nombre = ?", [categoria || 'General']);
        const catId = catRows[0].id;

        const [result] = await db.query(
            "INSERT INTO productos (nombre, categoria_id, precio, stock) VALUES (?, ?, ?, ?)",
            [nombre, catId, precio, stock]
        );
        res.json({ id: result.insertId, message: "✅ Producto subido con éxito a yubertec" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Comprar (Transaccional)
router.post('/comprar', async (req, res) => {
    const { carrito } = req.body;
    const total = carrito.reduce((acc, i) => acc + (i.precio * i.quantity), 0);
    
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [pedRes] = await connection.query("INSERT INTO pedidos (total) VALUES (?)", [total]);
        const pedidoId = pedRes.insertId;

        for (const item of carrito) {
            await connection.query(
                "INSERT INTO detalles_pedido (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?,?,?,?)",
                [pedidoId, item.id, item.quantity, item.precio]
            );
            const [updRes] = await connection.query(
                "UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?",
                [item.quantity, item.id, item.quantity]
            );
            if (updRes.affectedRows === 0) throw new Error(`Stock insuficiente para ${item.nombre}`);
        }

        await connection.commit();
        res.json({ message: "¡Compra exitosa en yubertec!" });
    } catch (err) {
        await connection.rollback();
        res.status(400).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// Actualizar
router.put('/:id', async (req, res) => {
    const { nombre, categoria, precio, stock } = req.body;
    try {
        await db.query("INSERT IGNORE INTO categorias (nombre) VALUES (?)", [categoria || 'General']);
        const [catRows] = await db.query("SELECT id FROM categorias WHERE nombre = ?", [categoria || 'General']);
        const catId = catRows[0].id;

        await db.query(
            "UPDATE productos SET nombre=?, categoria_id=?, precio=?, stock=? WHERE id=?",
            [nombre, catId, precio, stock, req.params.id]
        );
        res.json({ message: "Actualizado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar
router.delete('/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM productos WHERE id = ?", [req.params.id]);
        res.json({ message: "Eliminado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
