
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, BarChart, HeatMapChart } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Calendar, TrendingUp, LineChart as LineChartIcon, BarChart as BarChartIcon, AreaChart } from "lucide-react";

interface SalesDataItem {
  id: string;
  product: string;
  category?: string;
  quantity?: number;
  unit_price?: number;
  total_sales?: number;
  region?: string;
  date?: string;
  customer_type?: string;
  [key: string]: any;
}

interface SalesPatternAnalysisProps {
  salesData: SalesDataItem[];
}

export const SalesPatternAnalysis: React.FC<SalesPatternAnalysisProps> = ({ salesData }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>("all");
  const [timeFrame, setTimeFrame] = useState<string>("monthly");
  
  // Normalize the data format coming from different sources
  const normalizedData = useMemo(() => {
    return salesData.map(item => {
      // Handle data coming from local JSON file
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
  }, [salesData]);
  
  // Get unique regions and customer types for filtering
  const regions = useMemo(() => {
    const regionSet = new Set<string>();
    normalizedData.forEach(item => {
      if (item.region) regionSet.add(item.region);
    });
    return ['all', ...Array.from(regionSet)];
  }, [normalizedData]);
  
  const customerTypes = useMemo(() => {
    const customerTypeSet = new Set<string>();
    normalizedData.forEach(item => {
      if (item.customer_type) customerTypeSet.add(item.customer_type);
    });
    return ['all', ...Array.from(customerTypeSet)];
  }, [normalizedData]);
  
  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return normalizedData.filter(item => {
      let include = true;
      
      if (selectedRegion !== 'all' && item.region !== selectedRegion) {
        include = false;
      }
      
      if (selectedCustomerType !== 'all' && item.customer_type !== selectedCustomerType) {
        include = false;
      }
      
      return include;
    });
  }, [normalizedData, selectedRegion, selectedCustomerType]);
  
  // Format data for trend analysis
  const trendData = useMemo(() => {
    const timeMap = new Map<string, number>();
    
    filteredData.forEach(item => {
      if (!item.date) return;
      
      let timeKey: string;
      const date = new Date(item.date);
      
      if (timeFrame === 'daily') {
        timeKey = item.date;
      } else if (timeFrame === 'weekly') {
        // Get the week number
        const weekNumber = Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay()) / 7);
        timeKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-W${weekNumber}`;
      } else if (timeFrame === 'monthly') {
        timeKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      } else {
        // Quarterly
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        timeKey = `${date.getFullYear()}-Q${quarter}`;
      }
      
      const currentTotal = timeMap.get(timeKey) || 0;
      timeMap.set(timeKey, currentTotal + (item.total_sales || 0));
    });
    
    // Convert the map to an array and sort by time
    return Array.from(timeMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, sales]) => ({ time, sales }));
  }, [filteredData, timeFrame]);
  
  // Format data for seasonality analysis
  const seasonalityData = useMemo(() => {
    const monthMap = new Map<string, number>();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Initialize with zero values for all months
    months.forEach(month => {
      monthMap.set(month, 0);
    });
    
    filteredData.forEach(item => {
      if (!item.date) return;
      
      const date = new Date(item.date);
      const month = months[date.getMonth()];
      const currentTotal = monthMap.get(month) || 0;
      monthMap.set(month, currentTotal + (item.total_sales || 0));
    });
    
    // Convert the map to an array ordered by month
    return months.map(month => ({ 
      month, 
      sales: monthMap.get(month) || 0 
    }));
  }, [filteredData]);
  
  // Format data for region analysis
  const regionData = useMemo(() => {
    const regionMap = new Map<string, number>();
    
    filteredData.forEach(item => {
      if (!item.region) return;
      
      const currentTotal = regionMap.get(item.region) || 0;
      regionMap.set(item.region, currentTotal + (item.total_sales || 0));
    });
    
    // Convert the map to an array
    return Array.from(regionMap.entries())
      .map(([region, sales]) => ({ region, sales }))
      .sort((a, b) => b.sales - a.sales);
  }, [filteredData]);
  
  // Format data for customer type analysis
  const customerTypeData = useMemo(() => {
    const customerTypeMap = new Map<string, number>();
    
    filteredData.forEach(item => {
      if (!item.customer_type) return;
      
      const currentTotal = customerTypeMap.get(item.customer_type) || 0;
      customerTypeMap.set(item.customer_type, currentTotal + (item.total_sales || 0));
    });
    
    // Convert the map to an array
    return Array.from(customerTypeMap.entries())
      .map(([type, sales]) => ({ type, sales }))
      .sort((a, b) => b.sales - a.sales);
  }, [filteredData]);
  
  // Format data for the heat map (month x region)
  const heatMapData = useMemo(() => {
    const heatMap: { month: string; region: string; sales: number }[] = [];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Get all unique regions
    const uniqueRegions = new Set<string>();
    filteredData.forEach(item => {
      if (item.region) uniqueRegions.add(item.region);
    });
    
    // Initialize the heat map with zero values
    months.forEach(month => {
      uniqueRegions.forEach(region => {
        heatMap.push({ month, region, sales: 0 });
      });
    });
    
    // Fill in the actual values
    filteredData.forEach(item => {
      if (!item.date || !item.region) return;
      
      const date = new Date(item.date);
      const month = months[date.getMonth()];
      
      const heatMapItem = heatMap.find(h => h.month === month && h.region === item.region);
      if (heatMapItem) {
        heatMapItem.sales += (item.total_sales || 0);
      }
    });
    
    return heatMap;
  }, [filteredData]);
  
  // Calculate trend metrics
  const trendMetrics = useMemo(() => {
    if (trendData.length < 2) {
      return { trend: 'neutral', percentage: 0 };
    }
    
    const firstPeriod = trendData[0].sales;
    const lastPeriod = trendData[trendData.length - 1].sales;
    const percentageChange = ((lastPeriod - firstPeriod) / firstPeriod) * 100;
    
    return {
      trend: percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'neutral',
      percentage: Math.abs(percentageChange).toFixed(1)
    };
  }, [trendData]);
  
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Sales Pattern Analysis</h2>
          <p className="text-muted-foreground text-sm">
            Analyze sales trends, seasonality, and customer segments
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region === 'all' ? 'All Regions' : region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedCustomerType} onValueChange={setSelectedCustomerType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Customer Type" />
            </SelectTrigger>
            <SelectContent>
              {customerTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'All Customer Types' : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {trendMetrics.trend === 'up' ? (
                  <ArrowUpRight className="h-5 w-5 text-green-500 mr-2" />
                ) : trendMetrics.trend === 'down' ? (
                  <ArrowDownRight className="h-5 w-5 text-red-500 mr-2" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-gray-500 mr-2" />
                )}
                <div className="text-2xl font-bold">
                  {trendMetrics.percentage}%
                </div>
              </div>
              <Badge variant={trendMetrics.trend === 'up' ? 'default' : trendMetrics.trend === 'down' ? 'destructive' : 'secondary'}>
                {trendMetrics.trend === 'up' ? 'Increasing' : trendMetrics.trend === 'down' ? 'Decreasing' : 'Stable'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peak Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
              {seasonalityData.length > 0 ? (
                <div className="text-lg font-bold">
                  {seasonalityData.reduce((peak, current) => 
                    current.sales > peak.sales ? current : peak
                  ).month}
                </div>
              ) : (
                <div className="text-lg font-bold">
                  No data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Time Frame
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Button 
                variant={timeFrame === 'monthly' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeFrame('monthly')}
                className="text-xs px-2 py-1 h-auto"
              >
                Monthly
              </Button>
              <Button 
                variant={timeFrame === 'quarterly' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeFrame('quarterly')}
                className="text-xs px-2 py-1 h-auto"
              >
                Quarterly
              </Button>
              <Button 
                variant={timeFrame === 'weekly' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setTimeFrame('weekly')}
                className="text-xs px-2 py-1 h-auto"
              >
                Weekly
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Sales Trend Over Time</CardTitle>
                <CardDescription>
                  {timeFrame === 'monthly' ? 'Monthly' : timeFrame === 'quarterly' ? 'Quarterly' : 'Weekly'} sales trend analysis
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <LineChartIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <BarChartIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <AreaChart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-80">
            <LineChart 
              data={trendData}
              categories={['sales']}
              index="time"
              valueFormatter={(value) => formatCurrency(value)}
              showLegend={false}
              showGridLines={true}
              startEndOnly={false}
              className="h-full"
            />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="seasonality" className="space-y-4">
        <TabsList>
          <TabsTrigger value="seasonality">Seasonality</TabsTrigger>
          <TabsTrigger value="regional">Regional Analysis</TabsTrigger>
          <TabsTrigger value="customer">Customer Segments</TabsTrigger>
          <TabsTrigger value="heatmap">Heat Map Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="seasonality">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Distribution</CardTitle>
              <CardDescription>
                Analyzing seasonal patterns in sales throughout the year
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <BarChart 
                data={seasonalityData}
                categories={['sales']}
                index="month"
                valueFormatter={(value) => formatCurrency(value)}
                showLegend={false}
                className="h-full"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="regional">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Region</CardTitle>
              <CardDescription>
                Regional distribution of sales
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <BarChart 
                data={regionData}
                categories={['sales']}
                index="region"
                valueFormatter={(value) => formatCurrency(value)}
                showLegend={false}
                layout="vertical"
                className="h-full"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customer">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Customer Type</CardTitle>
              <CardDescription>
                Analysis of different customer segments
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <BarChart 
                data={customerTypeData}
                categories={['sales']}
                index="type"
                valueFormatter={(value) => formatCurrency(value)}
                showLegend={false}
                className="h-full"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Heat Map Analysis: Month × Region</CardTitle>
              <CardDescription>
                Visualizing sales patterns across months and regions
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <HeatMapChart 
                data={heatMapData}
                category="sales"
                index={["month", "region"]}
                valueFormatter={(value) => formatCurrency(value)}
                className="h-full"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
