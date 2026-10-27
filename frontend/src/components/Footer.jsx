import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>Kalyani masale</h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 280 }}>
              Premium quality Indian spices & masalas inspired by traditional recipes.
              Pure, aromatic and FSSAI certified products for your kitchen.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <Link to="/category/blended-spices">Blended Spices</Link>
            <Link to="/category/quick-fry">Quick Fry</Link>
            <Link to="/category/whole-spices">Whole Spices</Link>
            <Link to="/category/shahi-hing">Shahi Hing</Link>
            <Link to="/category/combos">Combos</Link>
          </div>
          <div>
            <h4>Help</h4>
            <a href="#">Track Order</a>
            <a href="#">Shipping Info</a>
            <a href="#">Returns</a>
            <a href="#">FAQs</a>
          </div>
          <div>
            <h4>Contact</h4>
            <p style={{ fontSize: '0.9rem' }}>support@masaleonline.com</p>
            <p style={{ fontSize: '0.9rem', marginTop: 8 }}>+91 98765 43210</p>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Kalyani masale. All rights reserved. | Inspired by traditional Indian spices.
        </div>
      </div>
    </footer>
  );
}