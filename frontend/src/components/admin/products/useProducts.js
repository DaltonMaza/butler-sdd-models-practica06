import { useState, useEffect, useCallback } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../../api/products.js';
import { getCategories } from '../../../api/client.js';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchProducts = useCallback(async (searchTerm, categoryId) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (categoryId) params.categoryId = categoryId;
      const data = await getProducts(params);
      setProducts(data);
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      // silent fail for categories
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(search, categoryFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, categoryFilter, fetchProducts]);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleCreate(data) {
    setError(null);
    try {
      await createProduct(data);
      showToast('Producto guardado exitosamente');
      fetchProducts(search, categoryFilter);
      return true;
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor.');
      return false;
    }
  }

  async function handleUpdate(id, data) {
    setError(null);
    try {
      await updateProduct(id, data);
      showToast('Producto guardado exitosamente');
      fetchProducts(search, categoryFilter);
      return true;
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor.');
      return false;
    }
  }

  async function handleDelete(id) {
    setError(null);
    try {
      await deleteProduct(id);
      showToast('Producto eliminado exitosamente');
      fetchProducts(search, categoryFilter);
      return true;
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor.');
      return false;
    }
  }

  return {
    products,
    categories,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    loading,
    error,
    toast,
    handleCreate,
    handleUpdate,
    handleDelete,
    fetchProducts,
    clearError: () => setError(null),
  };
}
