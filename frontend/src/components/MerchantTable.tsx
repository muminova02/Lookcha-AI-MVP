import type { ReactNode } from "react";

interface MerchantTableProps {
  headers: string[];
  rows: ReactNode[][];
}

/** Simple horizontally-scrollable SaaS-style table. */
export default function MerchantTable({ headers, rows }: MerchantTableProps) {
  return (
    <div className="no-scrollbar overflow-x-auto rounded-card-lg border border-border/40 bg-surface soft-shadow">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border/40">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-border/20 last:border-0 hover:bg-surface-container/40"
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-ink">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
