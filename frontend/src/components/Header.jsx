import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="top-bar">
        Free Delivery Available | Shop ₹499+ for Free Shipping
      </div>
      <div className="container header-main">
        <Link to="/" className="logo">
          <div className="logo-icon">M</div>
          <span>Kalyani masale</span>
        </Link>

        <nav id="main-navigation" className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/products" onClick={closeMenu}>Products</NavLink>
          <NavLink to="/category/blended-spices" onClick={closeMenu}>Blended Spices</NavLink>
          <NavLink to="/category/quick-fry" onClick={closeMenu}>Quick Fry</NavLink>
          <NavLink to="/category/whole-spices" onClick={closeMenu}>Whole Spices</NavLink>
          <NavLink to="/category/combos" onClick={closeMenu}>Combos</NavLink>
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-btn">
            🛒 Cart
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}