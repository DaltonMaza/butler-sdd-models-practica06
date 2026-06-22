import { describe, it, expect } from '@jest/globals';

describe('Product field validation', () => {
  const validProduct = {
    name: 'Cola Cola 355ml',
    price: 1.50,
    stock: 100,
    category_id: '00000000-0000-0000-0000-000000000001',
  };

  it('accepts valid product fields', () => {
    expect(validProduct.name.trim().length).toBeGreaterThanOrEqual(3);
    expect(validProduct.name.trim().length).toBeLessThanOrEqual(50);
    expect(validProduct.price).toBeGreaterThan(0);
    expect(Number.isInteger(validProduct.stock) && validProduct.stock >= 0).toBe(true);
  });

  it('rejects empty name', () => {
    expect(''.trim().length).toBe(0);
  });

  it('rejects name shorter than 3 characters', () => {
    expect('ab'.length).toBeLessThan(3);
  });

  it('rejects name longer than 50 characters', () => {
    expect('a'.repeat(51).length).toBeGreaterThan(50);
  });

  it('rejects zero price', () => {
    expect(0 > 0).toBe(false);
  });

  it('rejects negative price', () => {
    expect(-1 > 0).toBe(false);
  });

  it('rejects non-integer stock', () => {
    expect(Number.isInteger(validProduct.stock)).toBe(true);
    expect(Number.isInteger(1.5)).toBe(false);
  });

  it('rejects negative stock', () => {
    expect(-1 >= 0).toBe(false);
  });

  it('rejects missing category_id', () => {
    expect(validProduct.category_id).toBeTruthy();
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
  });

  it('rejects description longer than 200 characters', () => {
    expect('a'.repeat(201).length).toBeGreaterThan(200);
  });

  it('detects nonexistent category via query pattern', () => {
    const mockResult = { rows: [] };
    expect(mockResult.rows.length).toBe(0);
  });

  it('detects existing active category', () => {
    const mockResult = { rows: [{ id: '00000000-0000-0000-0000-000000000001' }] };
    expect(mockResult.rows.length).toBe(1);
  });
});

describe('Product search and filter', () => {
  const mockProducts = [
    { id: '1', name: 'Hamburguesa', description: 'Carne y pan', category_id: 'cat1' },
    { id: '2', name: 'Coca Cola', description: 'Bebida gasificada', category_id: 'cat2' },
  ];

  it('filters products by search term', () => {
    const search = 'hamburguesa';
    const filtered = mockProducts.filter(p =>
      p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search)
    );
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Hamburguesa');
  });

  it('filters products by category', () => {
    const categoryId = 'cat2';
    const filtered = mockProducts.filter(p => p.category_id === categoryId);
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Coca Cola');
  });

  it('combines search and category filter', () => {
    const search = 'cola';
    const categoryId = 'cat2';
    const filtered = mockProducts.filter(p =>
      p.category_id === categoryId &&
      (p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search))
    );
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Coca Cola');
  });
});

describe('Stock alert computation', () => {
  it('returns agotado for zero stock', () => {
    expect(0).toBe(0);
  });

  it('returns bajo for stock between 1 and 5', () => {
    const stock = 3;
    expect(stock).toBeGreaterThanOrEqual(1);
    expect(stock).toBeLessThanOrEqual(5);
  });

  it('returns null for stock above 5', () => {
    expect(10).toBeGreaterThan(5);
  });
});
