const express = require('express');
const router = express.Router();
const db = require('../config/database');

// BUSCAR PRODUCTOS POR NOMBRE
router.get('/buscar', async (req, res) => {
    const nombre = req.query.nombre?.trim();

    if (!nombre) {
        return res.status(400).json({
            error: 'El parámetro nombre es obligatorio'
        });
    }

    try {
        const [rows] = await db.query(
            'SELECT * FROM producto WHERE nombre LIKE ?',
            [`%${nombre}%`]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// LISTAR PRODUCTOS
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM producto'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// REGISTRAR PRODUCTO
router.post('/', async (req, res) => {
    try {
        const {
            nombre, estado, precio_compra,
            precio_venta, stock_actual,
            stock_minimo, unidad_medida
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO producto
            (nombre, estado, precio_compra, precio_venta,
             stock_actual, stock_minimo, unidad_medida)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nombre, estado, precio_compra, precio_venta,
             stock_actual, stock_minimo, unidad_medida]
        );

        res.status(201).json({
            mensaje: 'Producto registrado',
            id: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ACTUALIZAR PRODUCTO
router.put('/:id', async (req, res) => {
    try {
        const {
            nombre, estado, precio_compra,
            precio_venta, stock_actual,
            stock_minimo, unidad_medida
        } = req.body;

        const [result] = await db.query(
            `UPDATE producto SET nombre=?, estado=?,
            precio_compra=?, precio_venta=?,
            stock_actual=?, stock_minimo=?,
            unidad_medida=? WHERE id=?`,
            [nombre, estado, precio_compra, precio_venta,
             stock_actual, stock_minimo, unidad_medida,
             req.params.id]
        );

        res.json({ mensaje: 'Producto actualizado',
                   afectados: result.affectedRows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ELIMINAR PRODUCTO
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM producto WHERE id=?',
            [req.params.id]
        );

        res.json({ mensaje: 'Producto eliminado',
                   afectados: result.affectedRows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
