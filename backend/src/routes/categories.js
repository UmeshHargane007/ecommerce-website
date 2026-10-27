const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;

    const withCount = await Promise.all(
      (categories || []).map(async (cat) => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', cat.id);
        return { ...cat, product_count: count || 0 };
      })
    );
    res.json(withCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', req.params.slug)
      .single();
    if (error || !category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const { data: products, error: pErr } = await supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('category_id', category.id)
      .order('is_featured', { ascending: false })
      .order('sold_count', { ascending: false });
    if (pErr) throw pErr;

    res.json({
      ...category,
      products: (products || []).map((p) => ({
        ...p,
        variants: p.product_variants || [],
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;