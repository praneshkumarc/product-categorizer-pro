
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Column<T> {
  accessorKey: keyof T | string;
  header: string;
  cell?: (info: { row: T }) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey.toString()} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => {
                const accessorKey = column.accessorKey.toString();
                
                // Handle nested properties with dot notation
                const value = accessorKey.split('.').reduce((obj, key) => 
                  obj && typeof obj === 'object' ? (obj as any)[key] : undefined, 
                  row
                );

                return (
                  <TableCell key={accessorKey} className={column.className}>
                    {column.cell 
                      ? column.cell({ row }) 
                      : value !== undefined 
                        ? String(value) 
                        : ""}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
