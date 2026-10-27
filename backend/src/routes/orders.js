const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.post('/', async (req, res) => {
  try {
    const {
      sessionId,
      shippingAddress,
      paymentMethod = 'cod',
      name,
      phone,
      email,
      items = [],
      total,
    } = req.body;

    if (!items.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        session_id: sessionId || null,
        status: 'pending',
        total_amount: total,
        shipping_address: shippingAddress || '',
        payment_method: paymentMethod,
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
      })
      .select()
      .single();
    if (orderErr) throw orderErr;

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      name: item.name,
      weight: item.weight,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(orderItems);
    if (itemsErr) throw itemsErr;

    res.status(201).json({
      orderId: order.id,
      total: order.total_amount,
      status: order.status,
      message: 'Order placed successfully!',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', req.params.id)
      .single();
    if (error || !data) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;