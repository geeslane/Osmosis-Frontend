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
};

export function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="relative w-full min-h-[200px] overflow-x-auto">
      {/* Scroll container */}
      <div className="min-w-full">
        <table className="min-w-max w-full text-sm">
          <thead className="bg-[#DCFFAD91] text-left">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="whitespace-nowrap px-3 py-2 text-xs text-[#667085] font-medium"
                >
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
                className={onRowClick ? 'border-t cursor-pointer' : 'border-t'}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`whitespace-nowrap px-3 py-3 ${col.className ?? ''}`}
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
