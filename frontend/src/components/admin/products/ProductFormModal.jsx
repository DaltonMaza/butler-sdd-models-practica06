import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const validators = {
  name(value) {
    const trimmed = (value || '').trim();
    if (!trimmed) return 'El nombre es obligatorio';
    if (trimmed.length < 3) return 'El nombre debe tener entre 3 y 50 caracteres';
    if (trimmed.length > 50) return 'El nombre debe tener entre 3 y 50 caracteres';
    return '';
  },
  price(value) {
    const num = parseFloat(value);
    if (isNaN(num) || value === '') return 'El precio debe ser mayor a 0';
    if (num <= 0) return 'El precio debe ser mayor a 0';
    return '';
  },
  stock(value) {
    const num = parseInt(value, 10);
    if (isNaN(num) || value === '') return '';
    if (num < 0) return 'El stock no puede ser negativo';
    return '';
  },
  description(value) {
    if ((value || '').length > 200) return 'La descripción no puede exceder 200 caracteres';
    return '';
  },
  category_id(value) {
    if (!value) return 'Es obligatorio asociar el producto a una categoría existente';
    return '';
  },
};

export function ProductFormModal({ product, categories, onClose, onSave, networkError }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
    category_id: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price != null ? String(product.price) : '',
        stock: product.stock != null ? String(product.stock) : '',
        image_url: product.image_url || '',
        category_id: product.category_id || '',
      });
    }
  }, [product]);

  function handleChange(field, value) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    const err = validators[field] ? validators[field](value) : '';
    setErrors((prev) => ({ ...prev, [field]: err }));
  }

  function validate() {
    const newErrors = {};
    for (const field of ['name', 'price', 'stock', 'description', 'category_id']) {
      const err = validators[field](form[field]);
      if (err) newErrors[field] = err;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate() || saving) return;

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10) || 0,
      image_url: form.image_url.trim(),
      category_id: form.category_id,
    };

    const success = await onSave(payload);
    setSaving(false);
    if (success) onClose();
  }

  const hasErrors = Object.values(errors).some(Boolean);
  const saveDisabled = saving || hasErrors || networkError;

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none touch-manipulation"
            >
              &times;
            </button>
          </div>

          {networkError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {networkError}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="modal-name">Nombre *</label>
            <input
              id="modal-name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              maxLength={50}
              className={`w-full border rounded px-3 py-2 text-sm ${errors.name ? 'border-red-500 bg-red-50' : ''}`}
              autoFocus
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="modal-category">Categoría *</label>
            <select
              id="modal-category"
              value={form.category_id}
              onChange={(e) => handleChange('category_id', e.target.value)}
              className={`w-full border rounded px-3 py-2 text-sm ${errors.category_id ? 'border-red-500 bg-red-50' : ''}`}
            >
              <option value="">-- Seleccionar categoría --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-600 text-xs mt-1">{errors.category_id}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="modal-description">Descripción</label>
            <textarea
              id="modal-description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              maxLength={200}
              className={`w-full border rounded px-3 py-2 text-sm ${errors.description ? 'border-red-500 bg-red-50' : ''}`}
            />
            <div className="flex justify-between mt-1">
              {errors.description && <p className="text-red-600 text-xs">{errors.description}</p>}
              <p className="text-gray-400 text-xs ml-auto">{(form.description || '').length}/200</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="modal-price">Precio *</label>
              <input
                id="modal-price"
                type="number"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                step="0.01"
                min="0.01"
                className={`w-full border rounded px-3 py-2 text-sm ${errors.price ? 'border-red-500 bg-red-50' : ''}`}
              />
              {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="modal-stock">Stock *</label>
              <input
                id="modal-stock"
                type="number"
                value={form.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                step="1"
                min="0"
                className={`w-full border rounded px-3 py-2 text-sm ${errors.stock ? 'border-red-500 bg-red-50' : ''}`}
              />
              {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1" htmlFor="modal-image">Imagen URL</label>
            <input
              id="modal-image"
              type="text"
              value={form.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
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
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saveDisabled}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 touch-manipulation"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
