const express = require('express');
const router = express.Router();

// Cart is stored in frontend localStorage.
// Checkout sends items to POST /api/orders

router.get('/', (req, res) => {
  res.json({ items: [], total: 0, message: 'Cart is managed on frontend' });
});

module.exports = router;