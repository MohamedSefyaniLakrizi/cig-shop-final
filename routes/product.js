const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');
const bcrypt = require('bcrypt');

router.get('/products', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM products');
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  
  router.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
      if (result.rowCount === 0) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  
  router.post('/products', async (req, res) => {
    const { name, description, price, type } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO products (name, description, price, type) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, description, price, type]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  
  router.put('/products/:id', async (req, res) => {
    const id = req.params.id;
    const { name, description, price, type } = req.body;
    try {
      const result = await pool.query(
        'UPDATE products SET name = $1, description = $2, price = $3, type = $4 WHERE id = $5 RETURNING *',
        [name, description, price, type, id]
      );
      if (result.rowCount === 0) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  
  router.delete('/products/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        res.status(404).json({ message: 'Product not found' });
      } else {
        res.status(204).send();
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  module.exports = router;