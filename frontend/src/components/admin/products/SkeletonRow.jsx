export function SkeletonRow({ cols }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-3">
          <div className="h-4 bg-gray-200 rounded" style={{ width: i === 0 ? '48px' : `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
    </tr>
  );
}
