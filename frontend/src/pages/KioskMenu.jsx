import { useState, useEffect } from 'react';
import { getCategories } from '../api/client.js';
import { CategorySection } from '../components/kiosk/CategorySection.jsx';

export default function KioskMenu() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Menú Butler
      </h1>

      {categories.length === 0 && (
        <p className="text-center text-gray-400">No categories available.</p>
      )}

      <div className="max-w-6xl mx-auto">
        {categories.map((cat) => (
          <CategorySection key={cat.id} category={cat}>
            <p className="text-gray-400 text-sm col-span-full">
              Products coming soon
            </p>
          </CategorySection>
        ))}
      </div>
    </div>
  );
}
