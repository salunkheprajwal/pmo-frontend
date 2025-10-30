'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  actions?: boolean;
}

export default function DataTable<T>({
  data,
  columns,
  onEdit,
  onDelete,
  actions = true
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key.toString()}
                className="text-left py-3 px-4 font-medium text-muted-foreground"
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
            {actions && (onEdit || onDelete) && (
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-muted/50 transition-colors"
            >
              {columns.map((column) => (
                <td key={column.key.toString()} className="py-3 px-4">
                  {column.render
                    ? column.render(item)
                    : item[column.key as keyof T]?.toString() || '-'}
                </td>
              ))}
              {actions && (onEdit || onDelete) && (
                <td className="py-3 px-4">
                  <div className="flex justify-end space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No data available
        </div>
      )}
    </div>
  );
}