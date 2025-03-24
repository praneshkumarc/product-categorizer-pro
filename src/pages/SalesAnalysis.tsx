
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { SalesAnalyticsDashboard } from '@/components/sales/SalesAnalyticsDashboard';
import { SalesDataPreprocessor } from '@/components/sales/SalesDataPreprocessor';
import { SalesPatternAnalysis } from '@/components/sales/SalesPatternAnalysis';
import { SalesPricingStrategies } from '@/components/sales/SalesPricingStrategies';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define a consistent interface for sales data
export interface SalesDataItem {
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

const SalesAnalysis = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [salesData, setSalesData] = useState<SalesDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      setIsLoading(true);
      
      try {
        // First try to fetch from Supabase if available
        const { data, error } = await supabase
          .from('sales')
          .select('*')
          .order('date', { ascending: false });
          
        if (error) {
          console.error('Error fetching sales data from Supabase:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          setSalesData(data);
        } else {
          // Fallback to local data if no data in Supabase
          const localData = await import('@/data/product_sales_data.json');
          
          // Transform local data to match the SalesDataItem interface
          const transformedData: SalesDataItem[] = localData.default.map((item: any) => ({
            id: item.id,
            product: item.productName,
            category: item.category || '',
            quantity: item.quantity || 0,
            unit_price: item.price || 0,
            total_sales: (item.price || 0) * (item.quantity || 0),
            region: item.salesLocation || '',
            date: `2023-${item.month === 'April' ? '04' : item.month === 'February' ? '02' : item.month === 'August' ? '08' : item.month === 'June' ? '06' : item.month === 'December' ? '12' : '01'}-01`,
            customer_type: 'Regular',
            // Preserve original fields for backward compatibility
            ...item
          }));
          
          setSalesData(transformedData);
        }
      } catch (error) {
        console.error('Falling back to local data:', error);
        // Fallback to local data
        const localData = await import('@/data/product_sales_data.json');
        
        // Transform local data to match the SalesDataItem interface
        const transformedData: SalesDataItem[] = localData.default.map((item: any) => ({
          id: item.id,
          product: item.productName,
          category: item.category || '',
          quantity: item.quantity || 0,
          unit_price: item.price || 0,
          total_sales: (item.price || 0) * (item.quantity || 0),
          region: item.salesLocation || '',
          date: `2023-${item.month === 'April' ? '04' : item.month === 'February' ? '02' : item.month === 'August' ? '08' : item.month === 'June' ? '06' : item.month === 'December' ? '12' : '01'}-01`,
          customer_type: 'Regular',
          // Preserve original fields for backward compatibility
          ...item
        }));
        
        setSalesData(transformedData);
        
        toast({
          title: "Using local data",
          description: "Could not connect to database, using sample data instead.",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, [toast]);

  // Handle data updates from the SalesDataPreprocessor
  const handleDataChange = (newData: SalesDataItem[]) => {
    setSalesData(newData);
    toast({
      title: "Data updated",
      description: `Dataset updated with ${newData.length} records.`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-background transition-page">
      <Header />
      <Sidebar />
      
      <main className="pt-24 md:pl-64 transition-all duration-300 animate-fade-in">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-medium mb-1">Sales Data Analysis</h1>
            <p className="text-muted-foreground">
              Analyze historical sales data to inform pricing decisions
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white/80 backdrop-blur-sm sticky top-[72px] z-20 p-1 shadow-sm border border-gray-100 rounded-lg">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="data-preparation">Data Preparation</TabsTrigger>
              <TabsTrigger value="pattern-analysis">Pattern Analysis</TabsTrigger>
              <TabsTrigger value="pricing-strategies">Pricing Strategies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="pt-2">
              <Card className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Loading sales data...</p>
                  </div>
                ) : (
                  <SalesAnalyticsDashboard salesData={salesData} />
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="data-preparation" className="pt-2">
              <Card className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Loading sales data...</p>
                  </div>
                ) : (
                  <SalesDataPreprocessor salesData={salesData} onDataChange={handleDataChange} />
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="pattern-analysis" className="pt-2">
              <Card className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Loading sales data...</p>
                  </div>
                ) : (
                  <SalesPatternAnalysis salesData={salesData} />
                )}
              </Card>
            </TabsContent>
            
            <TabsContent value="pricing-strategies" className="pt-2">
              <Card className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Loading sales data...</p>
                  </div>
                ) : (
                  <SalesPricingStrategies salesData={salesData} />
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SalesAnalysis;
