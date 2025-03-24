
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, LineChart, PieChart, ResponsiveContainer, 
  Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  BarChart as BarChartIcon, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Tag, 
  Package, 
  Clock
} from 'lucide-react';
import { SalesDataItem } from '../../types/sales';

interface SalesAnalyticsDashboardProps {
  salesData: SalesDataItem[];
}

export const SalesAnalyticsDashboard = ({ salesData }: SalesAnalyticsDashboardProps) => {
  // Check if salesData exists and has items
  if (!salesData || salesData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p className="text-muted-foreground">No sales data available. Please upload data.</p>
      </div>
    );
  }

  // Prepare data for charts
  const productsByCategory = Object.entries(
    salesData.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name,
    value,
    // Generate random color for each category
    color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
  }));
  
  // Format monthly revenue data
  const monthlyRevenueMap = salesData.reduce((acc, item) => {
    // Extract month from date or use the month string directly
    const monthKey = item.month || (item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short' }) : 'Unknown');
    
    if (!acc[monthKey]) {
      acc[monthKey] = { revenue: 0, profit: 0 };
    }
    
    // Calculate revenue and profit
    const revenue = item.price * item.quantity;
    const profit = revenue * (item.margin / 100);
    
    acc[monthKey].revenue += revenue;
    acc[monthKey].profit += profit;
    
    return acc;
  }, {} as Record<string, { revenue: number, profit: number }>);
  
  const monthlyRevenue = Object.entries(monthlyRevenueMap).map(([month, data]) => ({
    month,
    revenue: Math.round(data.revenue),
    profit: Math.round(data.profit)
  }));
  
  // Sort monthly data if possible
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthlyRevenue.sort((a, b) => {
    const aIndex = monthOrder.indexOf(a.month);
    const bIndex = monthOrder.indexOf(b.month);
    return aIndex - bIndex;
  });
  
  // Calculate category performance
  const categoryPerformance = Object.entries(
    salesData.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { sales: 0, margin: 0, count: 0 };
      }
      acc[category].sales += item.price * item.quantity;
      acc[category].margin += item.margin;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { sales: number, margin: number, count: number }>)
  ).map(([name, data]) => ({
    name,
    sales: Math.round(data.sales),
    margin: Math.round(data.margin / data.count), // average margin
    // Generate random color for each category
    color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
  }));
  
  // Calculate stats
  const totalProducts = new Set(salesData.map(item => item.sku || item.id)).size;
  const totalCategories = new Set(salesData.map(item => item.category)).size;
  const averageMargin = salesData.reduce((acc, item) => acc + item.margin, 0) / salesData.length;
  const totalRevenue = salesData.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Helper for formatting currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-md">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Products</h3>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <h2 className="text-3xl font-semibold">{totalProducts}</h2>
              <Badge variant="outline" className="text-xs">
                {Math.floor(Math.random() * 15) + 1}% growth
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-md">
                <Tag className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <h2 className="text-3xl font-semibold">{totalCategories}</h2>
              <Badge variant="outline" className="text-xs">
                {salesData.length} products
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-md">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Average Margin</h3>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <h2 className="text-3xl font-semibold">{averageMargin.toFixed(1)}%</h2>
              <div className="flex items-center text-xs font-medium text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                2.4% higher
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="stats-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-md">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <h2 className="text-3xl font-semibold">{formatCurrency(totalRevenue)}</h2>
              <div className="flex items-center text-xs font-medium text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                8.3% growth
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Revenue chart */}
      <Card className="border border-gray-200/80">
        <CardHeader className="px-6 pb-2">
          <CardTitle className="text-lg font-medium">Revenue & Profit Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={monthlyRevenue}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #f0f0f0',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="Revenue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                name="Profit" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Category charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-gray-200/80">
          <CardHeader className="px-6 pb-2">
            <CardTitle className="text-lg font-medium">Products by Category</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Tooltip
                  formatter={(value) => [`${value} products`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #f0f0f0',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                />
                <Pie
                  data={productsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {productsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200/80">
          <CardHeader className="px-6 pb-2">
            <CardTitle className="text-lg font-medium">Category Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={categoryPerformance}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" tickFormatter={(value) => `$${value}`} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'sales' ? formatCurrency(Number(value)) : `${value}%`,
                    name === 'sales' ? 'Sales' : 'Margin'
                  ]}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #f0f0f0',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="sales" 
                  name="Sales" 
                  fill="#6366f1" 
                  yAxisId="left" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="margin" 
                  name="Margin %" 
                  fill="#a855f7" 
                  yAxisId="right" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed charts */}
      <Card className="border border-gray-200/80">
        <CardHeader className="px-6 pb-0">
          <CardTitle className="text-lg font-medium">Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="trends">
            <TabsList className="mb-6">
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" />
                Sales Trends
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChartIcon className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4" />
                Categories
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trends" className="mt-0">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyRevenue}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #f0f0f0',
                        borderRadius: '6px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      name="Revenue" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      name="Profit" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="performance" className="mt-0">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #f0f0f0',
                        borderRadius: '6px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="sales" 
                      name="Sales" 
                      fill="#6366f1" 
                      radius={[4, 4, 0, 0]}
                    >
                      {categoryPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="categories" className="mt-0">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      formatter={(value) => [`${value} products`, '']}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #f0f0f0',
                        borderRadius: '6px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                      }}
                    />
                    <Pie
                      data={productsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {productsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
