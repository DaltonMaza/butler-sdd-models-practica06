import { useState } from 'react';
import { createCategory, updateCategory } from '../../api/client.js';

export function CategoryForm({ category, onClose, onSaved }) {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [imageUrl, setImageUrl] = useState(category?.image_url || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function validate() {
    const trimmed = name.trim();
    if (trimmed.length < 3 || trimmed.length > 30) {
      return 'Category name must be between 3 and 30 characters';
    }
    if (!/^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(trimmed)) {
      return 'Category name contains invalid characters';
    }
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await updateCategory(category.id, { name: name.trim(), description, image_url: imageUrl });
      } else {
        await createCategory({ name: name.trim(), description, image_url: imageUrl });
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const hasNameError = error && error.toLowerCase().includes('already registered');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-md">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-lg font-bold mb-4">
            {isEdit ? 'Edit Category' : 'New Category'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              required
              className={`w-full border rounded px-3 py-2 text-sm ${hasNameError ? 'border-red-500 bg-red-50' : ''}`}
              autoFocus
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="imageUrl">Image URL</label>
            <input
              id="imageUrl"
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-50 touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 touch-manipulation"
            >
              {saving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
