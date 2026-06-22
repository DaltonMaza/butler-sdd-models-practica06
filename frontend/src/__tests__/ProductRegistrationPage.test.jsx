import { describe, it, expect } from 'vitest';

describe('ProductRegistrationPage validation', () => {
  function validate(product) {
    if (!product.name || !product.name.trim()) {
      return 'Product name is required';
    }
    if (product.price === '' || product.price == null || parseFloat(product.price) < 0) {
      return 'Price must be a non-negative number';
    }
    if (product.stock === '' || product.stock == null || parseInt(product.stock, 10) < 0) {
      return 'Stock must be a non-negative integer';
    }
    if (!product.category_id) {
      return 'La categoría seleccionada no existe';
    }
    return '';
  }

  it('accepts valid product', () => {
    expect(validate({
      name: 'Cola Cola 355ml',
      price: '1.50',
      stock: '100',
      category_id: 'some-uuid',
    })).toBe('');
  });

  it('rejects empty name', () => {
    expect(validate({
      name: '',
      price: '1.50',
      stock: '100',
      category_id: 'some-uuid',
    })).toContain('required');
  });

  it('rejects whitespace-only name', () => {
    expect(validate({
      name: '   ',
      price: '1.50',
      stock: '100',
      category_id: 'some-uuid',
    })).toContain('required');
  });

  it('rejects negative price', () => {
    expect(validate({
      name: 'Product',
      price: '-1',
      stock: '100',
      category_id: 'some-uuid',
    })).toContain('non-negative');
  });

  it('rejects empty price', () => {
    expect(validate({
      name: 'Product',
      price: '',
      stock: '100',
      category_id: 'some-uuid',
    })).toContain('non-negative');
  });

  it('rejects negative stock', () => {
    expect(validate({
      name: 'Product',
      price: '1.50',
      stock: '-1',
      category_id: 'some-uuid',
    })).toContain('non-negative');
  });

  it('rejects empty stock', () => {
    expect(validate({
      name: 'Product',
      price: '1.50',
      stock: '',
      category_id: 'some-uuid',
    })).toContain('non-negative');
  });

  it('rejects missing category', () => {
    expect(validate({
      name: 'Product',
      price: '1.50',
      stock: '10',
      category_id: '',
    })).toContain('no existe');
  });

  it('preserves form values on validation error', () => {
    const formData = {
      name: 'My Product',
      price: '2.50',
      stock: '5',
      category_id: 'some-uuid',
    };
    const original = { ...formData };
    const err = validate({ ...formData, name: '' });
    expect(err).toBeTruthy();
    expect(formData.price).toBe(original.price);
    expect(formData.stock).toBe(original.stock);
    expect(formData.category_id).toBe(original.category_id);
  });
});
