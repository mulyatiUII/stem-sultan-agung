import type { ReactNode } from "react";

interface DataTableProps {
  headers: string[];
  rows: ReactNode[][];
  emptyMessage?: string;
}

/** Plain, dense table for the adult dashboards. Scrolls inside its own container. */
export function DataTable({ headers, rows, emptyMessage = "Belum ada data." }: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-md shadow-ink/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink/10">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-inksoft">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-6 text-center text-inksoft">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((cells, i) => (
              <tr key={i} className="border-b border-ink/5 last:border-0">
                {cells.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-ink" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
