const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  try {
    const { featured, is_new, category, search, sort = 'featured', limit = 50 } = req.query;

    let query = supabase
      .from('products')
      .select('*, categories(name, slug), product_variants(*)');

    if (featured === 'true') query = query.eq('is_featured', true);
    if (is_new === 'true') query = query.eq('is_new', true);
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (category) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();
      if (cat) query = query.eq('category_id', cat.id);
    }

    if (sort === 'rating') query = query.order('rating', { ascending: false });
    else if (sort === 'newest') query = query.order('created_at', { ascending: false });
    else if (sort === 'name') query = query.order('name', { ascending: true });
    else {
      query = query
        .order('is_featured', { ascending: false })
        .order('sold_count', { ascending: false });
    }

    const { data, error } = await query.limit(parseInt(limit) || 50);
    if (error) throw error;

    res.json(
      (data || []).map((p) => {
        const variants = p.product_variants || [];
        return {
          ...p,
          category_name: p.categories?.name,
          category_slug: p.categories?.slug,
          variants,
          min_price:
            variants.length > 0
              ? Math.min(...variants.map((v) => Number(v.price)))
              : 0,
        };
      })
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug), product_variants(*)')
      .eq('slug', req.params.slug)
      .single();
    if (error || !data) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({
      ...data,
      category_name: data.categories?.name,
      category_slug: data.categories?.slug,
      variants: data.product_variants || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;