export function CategorySection({ category, children }) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
        {category.description && (
          <span className="text-sm text-gray-400">— {category.description}</span>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {children}
      </div>
    </section>
  );
}
