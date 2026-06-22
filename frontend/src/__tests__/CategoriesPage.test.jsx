import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CategoriesPage from '../pages/admin/CategoriesPage.jsx';

const mockCategories = [
  { id: '1', name: 'Bebidas', description: 'Drinks', image_url: '', is_active: true },
  { id: '2', name: 'Snacks', description: '', image_url: '', is_active: false },
];

beforeEach(() => {
  vi.resetAllMocks();
});

describe('CategoriesPage', () => {
  it('renders loading then displays categories', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCategories),
    });

    render(
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Bebidas')).toBeDefined();
    });

    expect(screen.getByText('Snacks')).toBeDefined();
    expect(screen.getByText('Category Management')).toBeDefined();
  });

  it('shows empty state when no categories', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(
      <MemoryRouter>
        <CategoriesPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No categories yet. Create your first one.')).toBeDefined();
    });
  });
});
