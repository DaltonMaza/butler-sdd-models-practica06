import { useState } from 'react';
import { useProducts } from '../../components/admin/products/useProducts.js';
import { SearchBar } from '../../components/admin/products/SearchBar.jsx';
import { CategoryFilter } from '../../components/admin/products/CategoryFilter.jsx';
import { ProductTable } from '../../components/admin/products/ProductTable.jsx';
import { ProductFormModal } from '../../components/admin/products/ProductFormModal.jsx';
import { Toast } from '../../components/admin/products/Toast.jsx';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.jsx';

export default function ProductCatalogPage() {
  const {
    products, categories, search, setSearch,
    categoryFilter, setCategoryFilter,
    loading, error, toast, handleCreate, handleUpdate, handleDelete, clearError,
  } = useProducts();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  function openCreate() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  function promptDelete(product) {
    setConfirmDelete(product);
  }

  async function handleSave(data) {
    if (editingProduct) {
      return handleUpdate(editingProduct.id, data);
    }
    return handleCreate(data);
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    await handleDelete(confirmDelete.id);
    setConfirmDelete(null);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gestión de Catálogo</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-500 hover:text-red-700 ml-2 touch-manipulation">&times;</button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
          <div className="flex-1 w-full sm:w-auto">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <CategoryFilter categories={categories} value={categoryFilter} onChange={setCategoryFilter} />
          <button
            onClick={openCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 whitespace-nowrap touch-manipulation"
          >
            + Nuevo Producto
          </button>
        </div>

        <ProductTable
          products={products}
          loading={loading}
          onEdit={openEdit}
          onDelete={promptDelete}
          emptyMessage="No se encontraron productos disponibles. Comienza agregando uno nuevo."
          newProductLabel="+ Nuevo Producto"
          onNewProduct={openCreate}
        />
      </div>

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => { setModalOpen(false); setEditingProduct(null); }}
          onSave={handleSave}
          networkError={error}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Eliminar Producto"
          message={`¿Está seguro de que desea eliminar ${confirmDelete.name}? Esta acción no se puede deshacer.`}
          confirmLabel="Confirmar"
          variant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
