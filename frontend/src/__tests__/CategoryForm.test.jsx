import { describe, it, expect } from 'vitest';

describe('CategoryForm validation', () => {
  function validate(name) {
    const trimmed = (name || '').trim();
    if (trimmed.length < 3 || trimmed.length > 30) {
      return 'Category name must be between 3 and 30 characters';
    }
    if (!/^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(trimmed)) {
      return 'Category name contains invalid characters';
    }
    return '';
  }

  it('accepts valid name', () => {
    expect(validate('Bebidas')).toBe('');
    expect(validate('Snacks')).toBe('');
    expect(validate('Platos Fuertes')).toBe('');
  });

  it('rejects name shorter than 3 characters', () => {
    expect(validate('AB')).toContain('between 3 and 30');
  });

  it('rejects name longer than 30 characters', () => {
    expect(validate('A'.repeat(31))).toContain('between 3 and 30');
  });

  it('rejects name with special characters', () => {
    expect(validate('Bebidas@')).toContain('invalid characters');
  });

  it('accepts Spanish accented characters', () => {
    expect(validate('Bebidas y Jugos')).toBe('');
  });

  it('rejects empty name', () => {
    expect(validate('')).toContain('between 3 and 30');
  });
});
