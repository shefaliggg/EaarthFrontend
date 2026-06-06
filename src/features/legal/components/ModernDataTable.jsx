import React from "react";

function ModernDataTable({ cols, rows }) {
  return (
    <div className="overflow-x-auto my-5 rounded-lg border bg-card">
      <table className="w-full border-collapse text-[13.5px]">
        <thead>
          <tr>
            {cols.map((h) => (
              <th
                key={h}
                className="bg-muted/30 font-medium text-[11px] tracking-[0.08em] uppercase text-muted-foreground px-4 py-3 text-left border-b"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 leading-snug ${i < rows.length - 1 ? "border-b" : ""}`}
                >
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

export default ModernDataTable;
