export function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Buscar productos..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded px-3 py-2 text-sm touch-manipulation"
    />
  );
}
