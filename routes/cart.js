const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');


router.post('/', authorization, async function (req, res) {
    try {
        const productId = req.body.product_id;
        const quantity = req.body.quantity;

            // Check if the item already exists in the cart
        const existingCartItem = await pool.query('SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2', [req.user.id, productId]);
        if (existingCartItem.rowCount === 0) {
        // If the item doesn't exist in the cart, add a new row
        await pool.query('INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)', [req.user.id, productId, quantity]);
        } else {
        // If the item already exists in the cart, increment the quantity
        const updatedQuantity = existingCartItem.rows[0].quantity + quantity;
        await pool.query('UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3', [updatedQuantity, req.user.id, productId]);
        }
    
        // Return success response
        res.status(200).json({ message: 'Item added to cart' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

router.get('/cart/', authorization,  async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT cart_items.id, products.name, products.description, products.price, products.type, products.image_url, cart_items.quantity
        FROM cart_items
        INNER JOIN products ON cart_items.product_id = products.id
        WHERE cart_items.user_id = $1;
      `, [req.user.id]);
      const cartItems = result.rows;
      res.json({ success: true, cartItems });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'An error occurred while retrieving the cart items.' });
    } 
  });

  router.put('/cart/:product_id', authorization, async (req, res) => {
    try {
      const product_id = parseInt(req.params.product_id);
      const user_id = req.user.id; // assuming you have user authentication implemented
  
      // check if the cart item exists for the specified product and user
      const { rows } = await pool.query('SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2', [user_id, product_id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      // update the cart item by reducing the quantity by 1
      const updatedCartItem = await pool.query('UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *', [rows[0].quantity - 1, user_id, product_id]);
  
      // return the updated cart item
      return res.status(200).json(updatedCartItem.rows[0]);
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });


module.exports = router;