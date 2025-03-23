
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

// Import the sales data
import salesData from "@/data/product_sales_data.json";

export const SalesDataTable = () => {
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const columns = [
    {
      accessorKey: "productName",
      header: "Product",
    },
    {
      accessorKey: "salesLocation",
      header: "Location",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }: { row: any }) => formatCurrency(row.price),
      className: "text-right",
    },
    {
      accessorKey: "demand",
      header: "Demand",
      cell: ({ row }: { row: any }) => {
        const demandValue = typeof row.demand === 'number' 
          ? row.demand 
          : row.demand === 'high' ? 8 : row.demand === 'medium' ? 5 : 2;
        
        const demandText = typeof row.demand === 'string' 
          ? row.demand 
          : demandValue >= 7 ? 'high' : demandValue >= 4 ? 'medium' : 'low';
        
        const colorClass = 
          demandText === 'high' ? 'bg-green-100 text-green-800 border-green-200' :
          demandText === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
          'bg-rose-100 text-rose-800 border-rose-200';
        
        return (
          <Badge variant="outline" className={colorClass}>
            {demandText}
          </Badge>
        );
      },
    },
    {
      accessorKey: "season",
      header: "Season",
      cell: ({ row }: { row: any }) => (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          {row.season}
        </Badge>
      ),
    },
    {
      accessorKey: "month",
      header: "Month",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      className: "text-right",
    },
    {
      accessorKey: "margin",
      header: "Margin",
      cell: ({ row }: { row: any }) => {
        const trendIcon = row.trend === 'up' ? (
          <TrendingUp className="h-3 w-3 text-green-600 inline mr-1" />
        ) : row.trend === 'down' ? (
          <TrendingDown className="h-3 w-3 text-red-600 inline mr-1" />
        ) : null;
        
        return (
          <div className="text-right">
            {trendIcon}{row.margin}%
          </div>
        );
      },
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sales Data</h3>
      <DataTable 
        columns={columns}
        data={salesData}
      />
    </div>
  );
};
