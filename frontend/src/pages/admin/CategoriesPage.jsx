import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, deleteCategory, archiveCategory } from '../../api/client.js';
import { CategoryForm } from '../../components/admin/CategoryForm.jsx';
import { ConfirmDialog } from '../../components/admin/ConfirmDialog.jsx';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const fetchCategories = useCallback(async () => {
    const data = await getCategories(showArchived);
    setCategories(data);
  }, [showArchived]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(cat) {
    setEditing(cat);
    setFormOpen(true);
  }

  function handleDelete(cat) {
    setConfirm({
      title: 'Delete category',
      message: `Are you sure you want to delete "${cat.name}"?`,
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await deleteCategory(cat.id);
          setConfirm(null);
          fetchCategories();
        } catch (err) {
          if (err.status === 409) {
            setConfirm({
              title: 'Cannot delete',
              message: err.message,
              confirmLabel: 'Archive instead',
              variant: 'warning',
              showCancel: true,
              onConfirm: async () => {
                await archiveCategory(cat.id);
                setConfirm(null);
                fetchCategories();
              },
              onCancel: () => setConfirm(null),
            });
          }
        }
      },
    });
  }

  function handleArchive(cat) {
    setConfirm({
      title: 'Archive category',
      message: `Archive "${cat.name}"? It will be hidden from the kiosk.`,
      confirmLabel: 'Archive',
      variant: 'warning',
      onConfirm: async () => {
        await archiveCategory(cat.id);
        setConfirm(null);
        fetchCategories();
      },
    });
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Category Management</h1>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="rounded"
              />
              Show archived
            </label>
            <Link
              to="/admin/products"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 touch-manipulation text-sm"
            >
              Products
            </Link>
            <button
              onClick={openCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 touch-manipulation"
            >
              + New Category
            </button>
          </div>
        </div>

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 font-semibold text-sm">Name</th>
                <th className="p-3 font-semibold text-sm">Description</th>
                <th className="p-3 font-semibold text-sm">Status</th>
                <th className="p-3 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-3">{cat.name}</td>
                  <td className="p-3 text-gray-600 text-sm">{cat.description}</td>
                  <td className="p-3">
                    {cat.is_active ? (
                      <span className="text-green-600 text-sm font-medium">Active</span>
                    ) : (
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded font-medium">
                        Archived
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="text-blue-600 hover:underline text-sm touch-manipulation"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleArchive(cat)}
                        className="text-yellow-600 hover:underline text-sm touch-manipulation"
                        disabled={!cat.is_active}
                      >
                        Archive
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="text-red-600 hover:underline text-sm touch-manipulation"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">
                    No categories yet. Create your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <CategoryForm
          category={editing}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => { setFormOpen(false); setEditing(null); fetchCategories(); }}
        />
      )}

      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          variant={confirm.variant}
          showCancel={confirm.showCancel}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
