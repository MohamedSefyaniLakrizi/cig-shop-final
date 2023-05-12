const router = require('express').Router();
const pool = require('../db');


router.post('/', async function (req, res) {
    try {
        const productId = req.body.product_id;
    

            // Check if the item already exists in the cart
        const existingCartItem = await pool.query('SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2', [req.user.id, productId]);
        if (existingCartItem.rowCount === 0) {
        // If the item doesn't exist in the cart, add a new row
        await pool.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)', [req.user.id, productId, 1]);
        } else {
        // If the item already exists in the cart, increment the quantity
        const updatedQuantity = existingCartItem.rows[0].quantity + 1;
        await pool.query('UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3', [updatedQuantity, req.user.id, productId]);
        }
    
        // Return success response
        res.status(200).json({ message: 'Item added to cart' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

module.exports = router;