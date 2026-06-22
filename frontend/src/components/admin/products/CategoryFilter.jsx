export function CategoryFilter({ categories, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 text-sm touch-manipulation"
    >
      <option value="">Todas las categorías</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </select>
  );
}
