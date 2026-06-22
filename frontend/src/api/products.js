import { request } from './client.js';

export function getProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.categoryId) query.set('categoryId', params.categoryId);
  const qs = query.toString();
  return request(`/products${qs ? '?' + qs : ''}`);
}

export function getProduct(id) {
  return request(`/products/${id}`);
}

export function createProduct(data) {
  return request('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateProduct(id, data) {
  return request(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id) {
  return request(`/products/${id}`, {
    method: 'DELETE',
  });
}
