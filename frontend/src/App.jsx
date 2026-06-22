import { Routes, Route, Navigate } from 'react-router-dom';
import CategoriesPage from './pages/admin/CategoriesPage.jsx';
import KioskMenu from './pages/KioskMenu.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/admin/categories" element={<CategoriesPage />} />
      <Route path="/kiosk" element={<KioskMenu />} />
      <Route path="*" element={<Navigate to="/kiosk" replace />} />
    </Routes>
  );
}
