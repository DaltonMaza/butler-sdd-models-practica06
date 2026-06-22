import { Routes, Route, Navigate } from 'react-router-dom';
import CategoriesPage from './pages/admin/CategoriesPage.jsx';
import ProductRegistrationPage from './pages/admin/ProductRegistrationPage.jsx';
import KioskMenu from './pages/KioskMenu.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/admin/categories" element={<CategoriesPage />} />
      <Route path="/admin/products/new" element={<ProductRegistrationPage />} />
      <Route path="/kiosk" element={<KioskMenu />} />
      <Route path="*" element={<Navigate to="/kiosk" replace />} />
    </Routes>
  );
}
