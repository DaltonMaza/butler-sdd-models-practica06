const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="#e5e7eb"/><text x="24" y="28" text-anchor="middle" fill="#9ca3af" font-size="20">📦</text></svg>'
);

export function ProductTable({ products, loading, onEdit, onDelete, emptyMessage, newProductLabel, onNewProduct }) {
  if (loading) {
    return (
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 font-semibold text-sm">Imagen</th>
              <th className="p-3 font-semibold text-sm">Nombre</th>
              <th className="p-3 font-semibold text-sm">Categoría</th>
              <th className="p-3 font-semibold text-sm">Precio</th>
              <th className="p-3 font-semibold text-sm">Stock</th>
              <th className="p-3 font-semibold text-sm">Alerta</th>
              <th className="p-3 font-semibold text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse border-b last:border-0">
                {Array.from({ length: 7 }).map((_, j) => (
                  <td key={j} className="p-3">
                    <div className={`h-4 bg-gray-200 rounded ${j === 0 ? 'w-12 h-12' : ''}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded shadow">
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm mb-4">{emptyMessage || 'No se encontraron productos disponibles.'}</p>
          {onNewProduct && (
            <button
              onClick={onNewProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 touch-manipulation"
            >
              {newProductLabel || '+ Nuevo Producto'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3 font-semibold text-sm">Imagen</th>
            <th className="p-3 font-semibold text-sm">Nombre</th>
            <th className="p-3 font-semibold text-sm">Categoría</th>
            <th className="p-3 font-semibold text-sm">Precio</th>
            <th className="p-3 font-semibold text-sm">Stock</th>
            <th className="p-3 font-semibold text-sm">Alerta</th>
            <th className="p-3 font-semibold text-sm">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="p-3">
                <img
                  src={product.image_url || PLACEHOLDER_IMG}
                  alt={product.name}
                  className="w-12 h-12 rounded object-cover"
                  onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                />
              </td>
              <td className="p-3 font-medium">{product.name}</td>
              <td className="p-3 text-gray-600 text-sm">{product.category_name}</td>
              <td className="p-3">${parseFloat(product.price).toFixed(2)}</td>
              <td className="p-3">{product.stock} u</td>
              <td className="p-3">
                {product.stock_alert === 'agotado' && (
                  <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">Agotado</span>
                )}
                {product.stock_alert === 'bajo' && (
                  <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded">Bajo Stock</span>
                )}
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:underline text-sm touch-manipulation"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(product)}
                    className="text-red-600 hover:underline text-sm touch-manipulation"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
