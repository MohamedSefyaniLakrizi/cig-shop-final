const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');
router.get("/", authorization, async (req, res) => {
    try {
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
        const participants = await pool.query("SELECT * FROM participants WHERE id = $1", [req.user.id]);
        console.log(req.user.id);
        console.log(participants.rows[0]);
        res.json(user.rows[0], participants.rows[0]); 
    } catch (error) {
        console.log(error.message);
        res.status(500).json("Server Error");
    }
});


module.exports = router;