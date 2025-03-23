
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Search } from "lucide-react";

interface Column<T> {
  accessorKey: keyof T | string;
  header: string;
  cell?: (info: { row: T }) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
  searchable?: boolean;
  searchKeys?: (keyof T | string)[];
}

export function DataTable<T>({
  columns,
  data,
  className,
  searchable = false,
  searchKeys = [],
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: 'ascending' | 'descending' | null;
  }>({
    key: null,
    direction: null,
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  
  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        direction = 'descending';
      } else if (sortConfig.direction === 'descending') {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };
  
  // Get sorted items
  const getSortedItems = (items: T[]) => {
    if (!sortConfig.key || !sortConfig.direction) {
      return items;
    }
    
    return [...items].sort((a, b) => {
      // Handle nested properties with dot notation
      const aValue = sortConfig.key.split('.').reduce((obj, key) => 
        obj && typeof obj === 'object' ? (obj as any)[key] : undefined, 
        a
      );
      
      const bValue = sortConfig.key.split('.').reduce((obj, key) => 
        obj && typeof obj === 'object' ? (obj as any)[key] : undefined, 
        b
      );
      
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;
      
      // Compare based on type
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      } else {
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      }
    });
  };
  
  // Handle search filtering
  const getFilteredItems = (items: T[]) => {
    if (!searchTerm || !searchKeys.length) {
      return items;
    }
    
    const lowerCaseTerm = searchTerm.toLowerCase();
    
    return items.filter(item => {
      return searchKeys.some(key => {
        // Handle nested properties with dot notation
        const value = key.toString().split('.').reduce((obj, k) => 
          obj && typeof obj === 'object' ? (obj as any)[k] : undefined, 
          item
        );
        
        if (value === undefined) return false;
        
        return String(value).toLowerCase().includes(lowerCaseTerm);
      });
    });
  };
  
  // Process data with filters and sorting
  const processedData = getSortedItems(getFilteredItems(data));

  return (
    <div className="space-y-4">
      {searchable && searchKeys.length > 0 && (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      )}
      
      <div className={cn("rounded-md border", className)}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.accessorKey.toString()} 
                  className={cn(
                    column.className,
                    column.sortable && "cursor-pointer select-none"
                  )}
                  onClick={column.sortable ? () => requestSort(column.accessorKey.toString()) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortConfig.key === column.accessorKey.toString() && (
                      <span className="inline-block">
                        {sortConfig.direction === 'ascending' && <ChevronUp className="h-4 w-4" />}
                        {sortConfig.direction === 'descending' && <ChevronDown className="h-4 w-4" />}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.length > 0 ? (
              processedData.map((row, rowIndex) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-xs text-muted-foreground">
        Showing {processedData.length} of {data.length} entries
      </div>
    </div>
  );
}
