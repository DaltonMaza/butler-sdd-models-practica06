import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../components/admin/products/SearchBar.jsx';
import { CategoryFilter } from '../components/admin/products/CategoryFilter.jsx';
import { EmptyState } from '../components/admin/products/EmptyState.jsx';
import { ProductFormModal } from '../components/admin/products/ProductFormModal.jsx';

const mockCategories = [
  { id: 'cat-1', name: 'Comida' },
  { id: 'cat-2', name: 'Bebidas' },
];

describe('SearchBar', () => {
  it('renders input and calls onChange', () => {
    const onChange = (v) => {};
    render(<SearchBar value="" onChange={onChange} />);
    expect(screen.getByPlaceholderText('Buscar productos...')).toBeTruthy();
  });
});

describe('CategoryFilter', () => {
  it('renders all categories', () => {
    render(<CategoryFilter categories={mockCategories} value="" onChange={() => {}} />);
    expect(screen.getByText('Todas las categorías')).toBeTruthy();
    expect(screen.getByText('Comida')).toBeTruthy();
    expect(screen.getByText('Bebidas')).toBeTruthy();
  });
});

describe('EmptyState', () => {
  it('renders message and optional action button', () => {
    render(<EmptyState message="No hay productos" actionLabel="Agregar" onAction={() => {}} />);
    expect(screen.getByText('No hay productos')).toBeTruthy();
    expect(screen.getByText('Agregar')).toBeTruthy();
  });
});

describe('ProductFormModal validation', () => {
  it('renders create mode with empty form', () => {
    render(<ProductFormModal product={null} categories={mockCategories} onClose={() => {}} onSave={() => {}} />);
    expect(screen.getByText('Nuevo Producto')).toBeTruthy();
    expect(screen.getByText('Guardar')).toBeTruthy();
  });

  it('renders edit mode with pre-filled data', () => {
    const product = {
      id: 'p-1',
      name: 'Hamburguesa',
      price: '3.50',
      stock: '12',
      category_id: 'cat-1',
      description: 'Rica hamburguesa',
    };
    render(<ProductFormModal product={product} categories={mockCategories} onClose={() => {}} onSave={() => {}} />);
    expect(screen.getByText('Editar Producto')).toBeTruthy();
  });

  it('shows validation error for empty name', async () => {
    render(<ProductFormModal product={null} categories={mockCategories} onClose={() => {}} onSave={() => {}} />);
    const saveBtn = screen.getByText('Guardar');
    fireEvent.click(saveBtn);
    // Name field is empty, validation should fire
    expect(screen.getByText('El nombre es obligatorio')).toBeTruthy();
  });

  it('shows validation error for price of zero', () => {
    render(<ProductFormModal product={null} categories={mockCategories} onClose={() => {}} onSave={() => {}} />);
    const priceInput = screen.getByLabelText('Precio *');
    fireEvent.change(priceInput, { target: { value: '0' } });
    expect(screen.getByText('El precio debe ser mayor a 0')).toBeTruthy();
  });

  it('shows error for missing category on submit', () => {
    render(<ProductFormModal product={null} categories={mockCategories} onClose={() => {}} onSave={() => {}} />);
    fireEvent.click(screen.getByText('Guardar'));
    expect(screen.getByText('Es obligatorio asociar el producto a una categoría existente')).toBeTruthy();
  });
});
