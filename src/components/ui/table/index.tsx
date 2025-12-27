export type Column<T> = {
  key: keyof T | 'actions';
  label: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  className?: string;
};
type DataTableProps<T> = { columns: Column<T>[]; data: T[] };

export function DataTable<T extends { id: string }>({
  columns,
  data,
}: DataTableProps<T>) {
  return (
    <div className="relative w-full overflow-x-auto">
      {/* Scroll container */}
      <div className="min-w-full">
        <table className="min-w-max w-full text-sm">
          <thead className="bg-[#DCFFAD91] text-left">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="whitespace-nowrap px-4 py-3 text-xs text-[#667085]"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t">
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`whitespace-nowrap px-4 py-5 ${
                      col.className ?? ''
                    }`}
                  >
                    {col.render
                      ? col.render(row)
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
