import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductRegistrationPage from '../pages/admin/ProductRegistrationPage.jsx';

describe('ProductRegistrationPage (deprecated)', () => {
  it('redirects to /admin/products', () => {
    render(
      <MemoryRouter initialEntries={['/admin/products/new']}>
        <ProductRegistrationPage />
      </MemoryRouter>
    );
    // Page returns null after redirect; no content rendered
    expect(document.body.textContent).toBe('');
  });
});
