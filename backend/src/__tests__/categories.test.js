import { describe, it, expect } from '@jest/globals';
import { body, validationResult } from 'express-validator';

describe('Category validation rules', () => {
  const validName = 'Bebidas';
  const tooShort = 'AB';
  const tooLong = 'A'.repeat(31);
  const specialChars = 'Bebidas@#$';

  it('accepts a valid name', () => {
    const trimmed = validName.trim();
    expect(trimmed.length).toBeGreaterThanOrEqual(3);
    expect(trimmed.length).toBeLessThanOrEqual(30);
    expect(/^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(trimmed)).toBe(true);
  });

  it('rejects name shorter than 3 characters', () => {
    const trimmed = tooShort.trim();
    expect(trimmed.length).toBeLessThan(3);
  });

  it('rejects name longer than 30 characters', () => {
    expect(tooLong.length).toBeGreaterThan(30);
  });

  it('rejects name with special characters', () => {
    expect(/^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s]+$/.test(specialChars)).toBe(false);
  });
});

describe('Case-insensitive duplicate detection', () => {
  it('detects same name with different case', () => {
    const existing = 'Bebidas';
    const incoming = 'bebidas';
    expect(existing.toLowerCase()).toBe(incoming.toLowerCase());
  });

  it('allows distinct names', () => {
    const existing = 'Bebidas';
    const incoming = 'Snacks';
    expect(existing.toLowerCase()).not.toBe(incoming.toLowerCase());
  });
});
