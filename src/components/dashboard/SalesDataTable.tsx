
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      sortable: true,
    },
    {
      accessorKey: "sku",
      header: "SKU",
      sortable: true,
    },
    {
      accessorKey: "salesLocation",
      header: "Location",
      sortable: true,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }: { row: any }) => formatCurrency(row.price),
      className: "text-right",
      sortable: true,
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
      sortable: true,
    },
    {
      accessorKey: "season",
      header: "Season",
      cell: ({ row }: { row: any }) => (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          {row.season}
        </Badge>
      ),
      sortable: true,
    },
    {
      accessorKey: "month",
      header: "Month",
      sortable: true,
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      className: "text-right",
      sortable: true,
    },
    {
      accessorKey: "category",
      header: "Category",
      sortable: true,
    },
    {
      accessorKey: "margin",
      header: "Margin",
      cell: ({ row }: { row: any }) => {
        const trendIcon = row.trend === 'up' ? (
          <TrendingUp className="h-3 w-3 text-green-600 inline mr-1" />
        ) : row.trend === 'down' ? (
          <TrendingDown className="h-3 w-3 text-red-600 inline mr-1" />
        ) : (
          <Minus className="h-3 w-3 text-gray-400 inline mr-1" />
        );
        
        return (
          <div className="text-right">
            {trendIcon}{row.margin}%
          </div>
        );
      },
      className: "text-right",
      sortable: true,
    },
  ];

  // Calculate summary statistics
  const totalProducts = salesData.length;
  const totalQuantity = salesData.reduce((sum, item) => sum + item.quantity, 0);
  const totalRevenue = salesData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const averagePrice = salesData.reduce((sum, item) => sum + item.price, 0) / totalProducts;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averagePrice)}</div>
          </CardContent>
        </Card>
      </div>
      
      <h3 className="text-lg font-medium">Sales Data</h3>
      <DataTable 
        columns={columns}
        data={salesData}
        searchable={true}
        searchKeys={["productName", "salesLocation", "season", "month", "category"]}
      />
    </div>
  );
};
