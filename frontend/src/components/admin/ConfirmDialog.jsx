export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'danger',
  showCancel = true,
  onConfirm,
  onCancel,
}) {
  const colors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-sm p-6">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          {showCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-50 touch-manipulation"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm text-white rounded touch-manipulation ${colors[variant] || colors.danger}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
