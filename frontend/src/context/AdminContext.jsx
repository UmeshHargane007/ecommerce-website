import { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();
const KEY = 'masale_admin_key';

export function AdminProvider({ children }) {
  const [adminKey, setAdminKeyState] = useState(() => sessionStorage.getItem(KEY) || '');
  const [isAdmin, setIsAdmin] = useState(!!sessionStorage.getItem(KEY));

  const login = (key) => {
    sessionStorage.setItem(KEY, key);
    setAdminKeyState(key);
    setIsAdmin(true);
  };

  const logout = () => {
    sessionStorage.removeItem(KEY);
    setAdminKeyState('');
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ adminKey, isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);