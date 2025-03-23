
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
import { Category } from '../category/CategoryForm';
import { Product } from '../product/ProductCard';
import { PricingRule } from '../pricing/PricingRules';

interface AnalyticsDashboardProps {
  categories: Category[];
  products: Product[];
  pricingRules: PricingRule[];
}

export const AnalyticsDashboard = ({ 
  categories, 
  products, 
  pricingRules 
}: AnalyticsDashboardProps) => {
  // Prepare data for charts
  const productsByCategory = categories.map(category => {
    const count = products.filter(p => p.category === category.name).length;
    return {
      name: category.name,
      value: count,
      color: category.color || '#e2e8f0'
    };
  });
  
  const monthlyRevenue = [
    { month: 'Jan', revenue: 12400, profit: 3100 },
    { month: 'Feb', revenue: 15600, profit: 3900 },
    { month: 'Mar', revenue: 18900, profit: 4700 },
    { month: 'Apr', revenue: 16500, profit: 4125 },
    { month: 'May', revenue: 21000, profit: 5250 },
    { month: 'Jun', revenue: 22400, profit: 5600 },
    { month: 'Jul', revenue: 25700, profit: 6425 },
    { month: 'Aug', revenue: 27300, profit: 6825 },
    { month: 'Sep', revenue: 29100, profit: 7275 },
    { month: 'Oct', revenue: 31500, profit: 7875 },
    { month: 'Nov', revenue: 34200, profit: 8550 },
    { month: 'Dec', revenue: 38600, profit: 9650 },
  ];
  
  const categoryPerformance = categories.map(category => {
    return {
      name: category.name,
      sales: Math.floor(Math.random() * 5000) + 1000,
      margin: Math.floor(Math.random() * 30) + 10,
      color: category.color || '#e2e8f0'
    };
  });
  
  // Calculate stats
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalRules = pricingRules.length;
  const averageMargin = products.length > 0 
    ? products.reduce((acc, p) => acc + p.margin, 0) / products.length 
    : 0;
  
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
        <Card className="stats-card animate-slide-up" style={{ animationDelay: '0ms' }}>
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
        </Card>
        
        <Card className="stats-card animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-md">
              <Tag className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-3xl font-semibold">{totalCategories}</h2>
            <Badge variant="outline" className="text-xs">
              {totalRules} pricing rules
            </Badge>
          </div>
        </Card>
        
        <Card className="stats-card animate-slide-up" style={{ animationDelay: '200ms' }}>
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
        </Card>
        
        <Card className="stats-card animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-md">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">Avg. Update Time</h3>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-3xl font-semibold">1.4h</h2>
            <div className="flex items-center text-xs font-medium text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              0.3h slower
            </div>
          </div>
        </Card>
      </div>
      
      {/* Revenue chart */}
      <Card className="border border-gray-200/80 animate-slide-up" style={{ animationDelay: '400ms' }}>
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
        <Card className="border border-gray-200/80 animate-slide-up" style={{ animationDelay: '500ms' }}>
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
        
        <Card className="border border-gray-200/80 animate-slide-up" style={{ animationDelay: '600ms' }}>
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
      <Card className="border border-gray-200/80 animate-slide-up" style={{ animationDelay: '700ms' }}>
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
