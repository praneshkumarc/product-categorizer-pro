
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, RadialBarChart } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SalesDataItem {
  id: string;
  product: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_sales: number;
  region: string;
  date: string;
  customer_type: string;
  [key: string]: any;
}

interface SalesAnalyticsDashboardProps {
  salesData: SalesDataItem[];
}

export const SalesAnalyticsDashboard: React.FC<SalesAnalyticsDashboardProps> = ({ salesData }) => {
  const processedData = useMemo(() => {
    // Handle both Supabase and local data formats
    const normalizedData = salesData.map(item => {
      // For local data, map the fields to match our expected format
      if ('productName' in item) {
        return {
          id: item.id,
          product: item.productName,
          category: item.category || '',
          quantity: item.quantity || 0,
          unit_price: item.price || 0,
          total_sales: (item.price || 0) * (item.quantity || 0),
          region: item.salesLocation || '',
          date: `2023-${item.month === 'April' ? '04' : item.month === 'February' ? '02' : item.month === 'August' ? '08' : item.month === 'June' ? '06' : item.month === 'December' ? '12' : '01'}-01`,
          customer_type: 'Regular',
        };
      }
      return item;
    });

    return normalizedData;
  }, [salesData]);

  // Calculate total revenue
  const totalRevenue = useMemo(() => {
    return processedData.reduce((sum, item) => sum + item.total_sales, 0);
  }, [processedData]);

  // Calculate total quantity sold
  const totalQuantity = useMemo(() => {
    return processedData.reduce((sum, item) => sum + item.quantity, 0);
  }, [processedData]);

  // Calculate average order value
  const averageOrderValue = useMemo(() => {
    if (processedData.length === 0) return 0;
    return totalRevenue / processedData.length;
  }, [processedData, totalRevenue]);

  // Calculate sales by category
  const salesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    processedData.forEach(item => {
      const category = item.category || 'Uncategorized';
      const currentTotal = categoryMap.get(category) || 0;
      categoryMap.set(category, currentTotal + item.total_sales);
    });
    
    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }, [processedData]);

  // Calculate sales by region
  const salesByRegion = useMemo(() => {
    const regionMap = new Map<string, number>();
    
    processedData.forEach(item => {
      const region = item.region || 'Unknown';
      const currentTotal = regionMap.get(region) || 0;
      regionMap.set(region, currentTotal + item.total_sales);
    });
    
    return Array.from(regionMap.entries()).map(([name, value]) => ({ name, value }));
  }, [processedData]);

  // Calculate sales by customer type
  const salesByCustomerType = useMemo(() => {
    const customerTypeMap = new Map<string, number>();
    
    processedData.forEach(item => {
      const customerType = item.customer_type || 'Unknown';
      const currentTotal = customerTypeMap.get(customerType) || 0;
      customerTypeMap.set(customerType, currentTotal + item.total_sales);
    });
    
    return Array.from(customerTypeMap.entries()).map(([name, value]) => ({ name, value }));
  }, [processedData]);

  // Prepare data for sales trend over time
  const salesTrend = useMemo(() => {
    const monthlyMap = new Map<string, number>();
    
    processedData.forEach(item => {
      const date = new Date(item.date);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const currentTotal = monthlyMap.get(monthYear) || 0;
      monthlyMap.set(monthYear, currentTotal + item.total_sales);
    });
    
    return Array.from(monthlyMap.entries())
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, sales]) => ({ date, sales }));
  }, [processedData]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Units Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedData.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Trend Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <LineChart 
              data={salesTrend}
              categories={['sales']}
              index="date"
              valueFormatter={(value) => formatCurrency(value)}
              showLegend={false}
              showGridLines={true}
              startEndOnly={false}
              className="h-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <PieChart 
              data={salesByCategory}
              category="value"
              index="name"
              valueFormatter={(value) => formatCurrency(value)}
              className="h-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Region</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart 
              data={salesByRegion}
              categories={['value']}
              index="name"
              valueFormatter={(value) => formatCurrency(value)}
              showLegend={false}
              showGridLines={true}
              layout="vertical"
              className="h-full"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="by-category" className="space-y-4">
        <TabsList>
          <TabsTrigger value="by-category">By Category</TabsTrigger>
          <TabsTrigger value="by-region">By Region</TabsTrigger>
          <TabsTrigger value="by-customer">By Customer Type</TabsTrigger>
        </TabsList>
        
        <TabsContent value="by-category">
          <Card>
            <CardHeader>
              <CardTitle>Sales Distribution by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <RadialBarChart 
                data={salesByCategory}
                category="value"
                index="name"
                valueFormatter={(value) => formatCurrency(value)}
                className="h-full"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="by-region">
          <Card>
            <CardHeader>
              <CardTitle>Sales Distribution by Region</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <PieChart 
                data={salesByRegion}
                category="value"
                index="name"
                valueFormatter={(value) => formatCurrency(value)}
                className="h-full"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="by-customer">
          <Card>
            <CardHeader>
              <CardTitle>Sales Distribution by Customer Type</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <BarChart 
                data={salesByCustomerType}
                categories={['value']}
                index="name"
                valueFormatter={(value) => formatCurrency(value)}
                showLegend={false}
                className="h-full"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
