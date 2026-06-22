import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** @deprecated Use /admin/products (ProductCatalogPage) instead */
export default function ProductRegistrationPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin/products', { replace: true });
  }, [navigate]);

  return null;
}
