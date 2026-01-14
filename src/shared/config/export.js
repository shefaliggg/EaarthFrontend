export function exportToCSV (
  data,
  columns,
  filename = 'export.csv'
) {
  // Create CSV header
  const headers = columns.map(col => `"${col.label}"`).join(',');
  
  // Create CSV rows
  const rows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key];
      const formatted = col.format ? col.format(value) : value;
      // Escape quotes and wrap in quotes
      const escaped = String(formatted ?? '').replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',');
  });
  
  // Combine header and rows
  const csv = [headers, ...rows].join('\n');
  
  // Create download
  downloadCSV(csv, filename);
}

export function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export multiple sheets as separate CSV files
 */
export function exportMultipleToCSV ( sheets ) {
  sheets.forEach(sheet => {
    exportToCSV(sheet.data, sheet.columns, sheet.filename);
  });
}
