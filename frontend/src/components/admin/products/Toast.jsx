import { useEffect } from 'react';

export function Toast({ toast }) {
  useEffect(() => {
    if (!toast) return;
    const el = document.getElementById('toast-notification');
    if (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
    const timer = setTimeout(() => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-12px)';
      }
    }, 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const bgColor = toast.type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div
      id="toast-notification"
      className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-5 py-3 rounded shadow-lg text-sm transition-all duration-300`}
      style={{ opacity: 1, transform: 'translateY(0)' }}
    >
      {toast.message}
    </div>
  );
}
