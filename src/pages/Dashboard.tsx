
import React from "react";
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { SalesDataTable } from '@/components/dashboard/SalesDataTable';
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Import data types
import type { Category } from '@/components/category/CategoryForm';
import type { Product } from '@/components/product/ProductCard';
import type { PricingRule } from '@/components/pricing/PricingRules';

// Import data
import salesData from '@/data/product_sales_data.json';

const Dashboard: React.FC = () => {
  // Transform sales data to match Product interface
  const products: Product[] = salesData.map(item => ({
    id: item.id,
    name: item.productName,
    sku: item.sku,
    price: item.price,
    category: item.category,
    demand: item.demand as any,
    seasonality: item.season,
    margin: item.margin,
    trend: item.trend as any,
    imageUrl: item.imageUrl
  }));

  // Sample categories based on the product data
  const categories: Category[] = [
    {
      id: 'cat-1',
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      attributes: ['margin', 'demand'],
      rules: [
        { id: 'rule-1', attribute: 'margin', operator: 'greater_than', value: 25 }
      ],
      color: '#dbeafe'
    },
    {
      id: 'cat-2',
      name: 'Audio',
      description: 'Audio equipment and accessories',
      attributes: ['demand', 'seasonality'],
      rules: [
        { id: 'rule-2', attribute: 'demand', operator: 'equals', value: 'high' }
      ],
      color: '#fed7aa'
    },
    {
      id: 'cat-3',
      name: 'Wearables',
      description: 'Wearable technology devices',
      attributes: ['demand', 'margin'],
      rules: [
        { id: 'rule-3', attribute: 'margin', operator: 'greater_than', value: 40 }
      ],
      color: '#dcfce7'
    },
    {
      id: 'cat-4',
      name: 'Apparel',
      description: 'Clothing and accessories',
      attributes: ['seasonality'],
      rules: [
        { id: 'rule-4', attribute: 'seasonality', operator: 'equals', value: 'Winter' }
      ],
      color: '#e9d5ff'
    }
  ];

  // Sample pricing rules
  const pricingRules: PricingRule[] = [
    {
      id: 'pr-1',
      name: 'Electronics Markup',
      categoryId: 'cat-1',
      type: 'percentage',
      value: 10,
      priority: 1,
      active: true
    },
    {
      id: 'pr-2',
      name: 'Audio Promotion',
      categoryId: 'cat-2',
      type: 'percentage',
      value: -15,
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      priority: 2,
      active: true
    },
    {
      id: 'pr-3',
      name: 'Wearables Premium',
      categoryId: 'cat-3',
      type: 'fixed',
      value: 25,
      priority: 3,
      active: true
    }
  ];

  return (
    <div className="min-h-screen bg-background transition-page">
      <Header />
      <Sidebar />
      
      <main className="pt-24 md:pl-64 transition-all duration-300 animate-fade-in">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-medium mb-1">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of products, categories, and pricing analytics
            </p>
          </div>
          
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="sales-data">Sales Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics">
              <AnalyticsDashboard 
                categories={categories} 
                products={products} 
                pricingRules={pricingRules} 
              />
            </TabsContent>
            
            <TabsContent value="sales-data">
              <Card className="p-6">
                <SalesDataTable />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
