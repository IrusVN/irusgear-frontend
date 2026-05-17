/**
 * exportCsv.ts — Client-side CSV export utility.
 * Build a CSV string from items + columns, then trigger browser download.
 *
 * Usage:
 *   exportToCsv({
 *     filename: 'customers',
 *     columns: [
 *       { key: 'id', label: 'ID' },
 *       { key: 'name', label: 'Name' },
 *       { key: 'totalSpent', label: 'Spent', format: (v) => v.toLocaleString() },
 *     ],
 *     items: customers.value,
 *   });
 */

export interface CsvColumn<T = any> {
  /** Object property path or function returning the cell value */
  key: keyof T | string | ((item: T) => any);
  /** Header label (defaults to key) */
  label?: string;
  /** Optional value formatter (applied AFTER value resolution) */
  format?: (value: any, item: T) => string | number | null | undefined;
}

export interface ExportCsvOptions<T = any> {
  filename: string;
  columns: CsvColumn<T>[];
  items: T[];
  /** Append timestamp to filename (default true) */
  includeTimestamp?: boolean;
  /** UTF-8 BOM for Excel compatibility with VN characters (default true) */
  bom?: boolean;
}

const resolveValue = <T>(item: T, col: CsvColumn<T>): any => {
  if (typeof col.key === 'function') {
    return (col.key as (item: T) => any)(item);
  }
  // Support dot-notation: "customer.name"
  const path = String(col.key).split('.');
  let val: any = item;
  for (const p of path) {
    if (val == null) return val;
    val = val[p];
  }
  return val;
};

const escapeCell = (value: any): string => {
  if (value === null || value === undefined) return '';
  const str = typeof value === 'object' ? JSON.stringify(value) : String(value);
  // RFC 4180: wrap in quotes if contains comma, quote, newline, or leading/trailing whitespace
  if (/[",\n\r]/.test(str) || /^\s|\s$/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
};

const buildCsv = <T>(columns: CsvColumn<T>[], items: T[]): string => {
  const header = columns.map((c) => escapeCell(c.label ?? String(c.key))).join(',');
  const rows = items.map((item) =>
    columns
      .map((col) => {
        let val = resolveValue(item, col);
        if (col.format) val = col.format(val, item);
        return escapeCell(val);
      })
      .join(','),
  );
  return [header, ...rows].join('\r\n');
};

const formatTimestamp = (): string => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
};

export const exportToCsv = <T = any>(opts: ExportCsvOptions<T>): void => {
  if (!import.meta.client) return;

  const { filename, columns, items, includeTimestamp = true, bom = true } = opts;

  const csv = buildCsv(columns, items);
  const blob = new Blob([bom ? '\uFEFF' : '', csv], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}${includeTimestamp ? '_' + formatTimestamp() : ''}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
