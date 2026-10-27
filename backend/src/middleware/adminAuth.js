// Simple admin auth via secret key in header
// Set ADMIN_SECRET in backend/.env

function adminAuth(req, res, next) {
  const secret = process.env.ADMIN_SECRET;
  const key = req.headers['x-admin-key'] || req.query.admin_key;

  if (!secret) {
    return res.status(500).json({ error: 'Admin authentication is not configured.' });
  }

  if (!key || key !== secret) {
    return res.status(401).json({ error: 'Unauthorized. Invalid admin key.' });
  }
  next();
}

module.exports = adminAuth;