import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();
const CART_KEY = 'masale_cart';
const SESSION_KEY = 'masale_session';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [sessionId] = useState(() => getSessionId());

  useEffect(() => {
    saveCart(items);
  }, [items]);

  // addItem(product, variant, quantity)
  const addItem = useCallback((product, variant, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => String(i.variant_id) === String(variant.id)
      );
      if (existing) {
        return prev.map((i) =>
          String(i.variant_id) === String(variant.id)
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          id: `${product.id}-${variant.id}-${Date.now()}`,
          product_id: product.id,
          variant_id: variant.id,
          quantity,
          name: product.name,
          slug: product.slug,
          image_url: product.image_url,
          weight: variant.weight,
          price: Number(variant.price),
          compare_at_price: variant.compare_at_price
            ? Number(variant.compare_at_price)
            : null,
        },
      ];
    });
  }, []);

  const updateItem = useCallback((itemId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.id !== itemId);
      return prev.map((i) => (i.id === itemId ? { ...i, quantity } : i));
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        sessionId,
        itemCount,
        loading: false,
        addItem,
        updateItem,
        removeItem,
        clear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);