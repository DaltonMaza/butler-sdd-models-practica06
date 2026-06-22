const BASE_URL = '/api';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw { status: res.status, message: error.error };
  }
  return res.json();
}

export function getCategories(includeArchived = false) {
  const params = includeArchived ? '?includeArchived=true' : '';
  return request(`/categories${params}`);
}

export function getCategory(id) {
  return request(`/categories/${id}`);
}

export function createCategory(data) {
  return request('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateCategory(id, data) {
  return request(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteCategory(id) {
  return request(`/categories/${id}`, {
    method: 'DELETE',
  });
}

export function archiveCategory(id) {
  return request(`/categories/${id}/archive`, {
    method: 'PATCH',
  });
}
