export type Column<T> = {
  key: keyof T | 'actions';
  label: React.ReactNode;
  render?: (row: T, index?: number) => React.ReactNode;
  className?: string;
  onRowClick?: (row: T) => void;
};
type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  /** Tighter spacing for a finer, more compact table */
  compact?: boolean;
};

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  compact = false,
}: DataTableProps<T>) {
  const thClass = compact
    ? 'whitespace-nowrap px-4 py-2 text-[11px] text-[#667085] font-medium uppercase tracking-wider'
    : 'whitespace-nowrap px-3 py-2 text-xs text-[#667085] font-medium';
  const tdBaseClass = compact
    ? 'whitespace-nowrap px-4 py-2.5 text-sm'
    : 'whitespace-nowrap px-3 py-3';

  return (
    <div className="relative w-full min-h-[200px] overflow-x-auto">
      <div className="min-w-full">
        <table className="min-w-max w-full text-sm">
          <thead className="bg-[#DCFFAD]/40 text-left">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} className={thClass}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={
                  onRowClick
                    ? 'border-t border-[#EAECF0] cursor-pointer hover:bg-green-50/40 transition-colors'
                    : 'border-t border-[#EAECF0]'
                }
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`${tdBaseClass} ${col.className ?? ''}`}
                  >
                    {col.render
                      ? col.render(row, rowIndex)
                      : col.key !== 'actions'
                        ? String(row[col.key as keyof T])
                        : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
