
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProductCard, Product } from '@/components/product/ProductCard';
import { CategoryForm, Category } from '@/components/category/CategoryForm';
import { PricingRules, PricingRule } from '@/components/pricing/PricingRules';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PlusCircle, Layers, LayoutGrid } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'cat-1',
      name: 'Premium Products',
      description: 'High-margin luxury items with premium pricing',
      attributes: ['margin', 'demand'],
      rules: [
        { id: 'rule-1', attribute: 'margin', operator: 'greater_than', value: 30 }
      ],
      color: '#dbeafe'
    },
    {
      id: 'cat-2',
      name: 'Seasonal',
      description: 'Products with seasonal demand patterns',
      attributes: ['seasonality'],
      rules: [
        { id: 'rule-2', attribute: 'seasonality', operator: 'equals', value: 'summer' }
      ],
      color: '#fed7aa'
    },
    {
      id: 'cat-3',
      name: 'High Demand',
      description: 'Products with consistently high customer demand',
      attributes: ['demand'],
      rules: [
        { id: 'rule-3', attribute: 'demand', operator: 'equals', value: 'high' }
      ],
      color: '#dcfce7'
    }
  ]);
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'prod-1',
      name: 'Premium Wireless Headphones',
      sku: 'WH-PRO-001',
      price: 299.99,
      category: 'Premium Products',
      demand: 'high',
      seasonality: 'Holiday',
      margin: 35.5,
      trend: 'up',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop'
    },
    {
      id: 'prod-2',
      name: 'Summer Beach Sandals',
      sku: 'SBS-001',
      price: 49.99,
      category: 'Seasonal',
      demand: 'medium',
      seasonality: 'Summer',
      margin: 22.8,
      trend: 'up',
      imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=500&auto=format&fit=crop'
    },
    {
      id: 'prod-3',
      name: 'Smartphone Holder',
      sku: 'SH-001',
      price: 19.99,
      category: 'High Demand',
      demand: 'high',
      margin: 45.2,
      trend: 'stable',
      imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=500&auto=format&fit=crop'
    },
    {
      id: 'prod-4',
      name: 'Winter Thermal Jacket',
      sku: 'WTJ-001',
      price: 189.99,
      category: 'Seasonal',
      demand: 'medium',
      seasonality: 'Winter',
      margin: 28.7,
      trend: 'down',
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500&auto=format&fit=crop'
    },
    {
      id: 'prod-5',
      name: 'Smart Watch Pro',
      sku: 'SWP-001',
      price: 349.99,
      category: 'Premium Products',
      demand: 'high',
      margin: 38.2,
      trend: 'up',
      imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=500&auto=format&fit=crop'
    },
    {
      id: 'prod-6',
      name: 'Mini Portable Speaker',
      sku: 'MPS-001',
      price: 79.99,
      category: 'High Demand',
      demand: 'high',
      margin: 32.5,
      trend: 'up',
      imageUrl: 'https://images.unsplash.com/photo-1564424224827-cd24b8915874?q=80&w=500&auto=format&fit=crop'
    }
  ]);
  
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([
    {
      id: 'pr-1',
      name: 'Premium Product Markup',
      categoryId: 'cat-1',
      type: 'percentage',
      value: 15,
      priority: 1,
      active: true
    },
    {
      id: 'pr-2',
      name: 'Summer Sale',
      categoryId: 'cat-2',
      type: 'percentage',
      value: -10,
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      priority: 2,
      active: true
    },
    {
      id: 'pr-3',
      name: 'High Demand Fixed Price Increase',
      categoryId: 'cat-3',
      type: 'fixed',
      value: 5,
      priority: 3,
      active: true
    }
  ]);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [categorizeProductDialogOpen, setCategorizeProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categoryView, setCategoryView] = useState<'grid' | 'list'>('grid');
  
  // Handle route changes
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['dashboard', 'products', 'categories', 'pricing', 'analytics'].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);
  
  // Update URL when tab changes
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);
  
  // Handle category creation
  const handleCreateCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory = {
      id: `cat-${categories.length + 1}`,
      ...categoryData
    };
    
    setCategories([...categories, newCategory]);
    setIsAddCategoryOpen(false);
    
    toast({
      title: "Category Created",
      description: `${categoryData.name} has been created successfully`,
      duration: 3000,
    });
  };
  
  // Handle product categorization
  const handleCategorizeProduct = (product: Product) => {
    setSelectedProduct(product);
    setCategorizeProductDialogOpen(true);
  };
  
  const applyCategory = (categoryId: string) => {
    if (selectedProduct) {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        const updatedProducts = products.map(p => 
          p.id === selectedProduct.id ? { ...p, category: category.name } : p
        );
        
        setProducts(updatedProducts);
        setCategorizeProductDialogOpen(false);
        
        toast({
          title: "Product Categorized",
          description: `${selectedProduct.name} has been added to ${category.name}`,
          duration: 3000,
        });
      }
    }
  };
  
  // Handle pricing rule creation
  const handleCreatePricingRule = (rule: Omit<PricingRule, 'id'>) => {
    const newRule = {
      id: `pr-${pricingRules.length + 1}`,
      ...rule
    };
    
    setPricingRules([...pricingRules, newRule]);
    
    toast({
      title: "Pricing Rule Created",
      description: `${rule.name} has been created successfully`,
      duration: 3000,
    });
  };
  
  // Handle pricing rule deletion
  const handleDeletePricingRule = (ruleId: string) => {
    setPricingRules(pricingRules.filter(rule => rule.id !== ruleId));
    
    toast({
      title: "Pricing Rule Deleted",
      description: "The pricing rule has been deleted",
      duration: 3000,
    });
  };
  
  // Handle pricing rule updates
  const handleUpdatePricingRule = (updatedRule: PricingRule) => {
    setPricingRules(pricingRules.map(rule => 
      rule.id === updatedRule.id ? updatedRule : rule
    ));
    
    toast({
      title: "Pricing Rule Updated",
      description: `${updatedRule.name} has been updated successfully`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-background transition-page">
      <Header />
      <Sidebar />
      
      <main className="pt-24 md:pl-64 transition-all duration-300 animate-fade-in">
        <div className="max-w-7xl mx-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-white/80 backdrop-blur-sm sticky top-[72px] z-20 p-1 shadow-sm border border-gray-100 rounded-lg">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="pricing">Pricing Rules</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="pt-2">
              <AnalyticsDashboard 
                categories={categories} 
                products={products} 
                pricingRules={pricingRules} 
              />
            </TabsContent>
            
            <TabsContent value="products" className="pt-2">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-medium">Products</h1>
                <div className="flex items-center space-x-3">
                  <div className="flex p-1 bg-muted rounded-md">
                    <Button
                      variant={categoryView === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => setCategoryView('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      <span className="sr-only">Grid view</span>
                    </Button>
                    <Button
                      variant={categoryView === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={() => setCategoryView('list')}
                    >
                      <Layers className="h-4 w-4" />
                      <span className="sr-only">List view</span>
                    </Button>
                  </div>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>
              
              <div className={
                categoryView === 'grid' 
                  ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                  : "space-y-4"
              }>
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onEdit={setEditingProduct}
                    onCategorize={handleCategorizeProduct}
                  />
                ))}
              </div>
              
              {/* Categorize Product Dialog */}
              <Dialog 
                open={categorizeProductDialogOpen} 
                onOpenChange={setCategorizeProductDialogOpen}
              >
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Assign to Category</DialogTitle>
                    <DialogDescription>
                      Select a category to assign this product to.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant="outline"
                        className="justify-start h-auto py-3 px-4"
                        onClick={() => applyCategory(category.id)}
                      >
                        <div 
                          className="w-3 h-3 rounded-full mr-3" 
                          style={{ backgroundColor: category.color }} 
                        />
                        <div className="text-left">
                          <p className="font-medium">{category.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {category.description}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>
            
            <TabsContent value="categories" className="pt-2">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-medium">Categories</h1>
                <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle>Create New Category</DialogTitle>
                      <DialogDescription>
                        Define a new product category and its rules.
                      </DialogDescription>
                    </DialogHeader>
                    <CategoryForm onSubmit={handleCreateCategory} />
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {categories.map((category) => (
                  <div 
                    key={category.id} 
                    className="relative border border-gray-200/80 rounded-lg overflow-hidden shadow-sm animate-scale-in"
                  >
                    <div 
                      className="h-3" 
                      style={{ backgroundColor: category.color }} 
                    />
                    <div className="p-5">
                      <h3 className="text-xl font-medium mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {category.description}
                      </p>
                      
                      {category.attributes.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {category.attributes.map((attr) => (
                            <span 
                              key={attr} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                            >
                              {attr}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <p className="text-xs uppercase font-semibold text-muted-foreground">Rules:</p>
                        {category.rules.map((rule) => (
                          <div 
                            key={rule.id} 
                            className="text-sm bg-muted/40 p-2 rounded-md"
                          >
                            <span className="font-medium">{rule.attribute}</span>
                            {' '}
                            <span className="text-muted-foreground">{rule.operator.replace('_', ' ')}</span>
                            {' '}
                            <span className="font-medium">
                              {typeof rule.value === 'object' 
                                ? `${rule.value[0]} - ${rule.value[1]}` 
                                : rule.value}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm">
                          Edit Category
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pricing" className="pt-2">
              <div className="mb-6">
                <h1 className="text-2xl font-medium mb-1">Pricing Rules</h1>
                <p className="text-muted-foreground">
                  Define pricing rules for product categories
                </p>
              </div>
              
              <PricingRules 
                categories={categories}
                onSaveRule={handleCreatePricingRule}
                existingRules={pricingRules}
                onDeleteRule={handleDeletePricingRule}
                onUpdateRule={handleUpdatePricingRule}
              />
            </TabsContent>
            
            <TabsContent value="analytics" className="pt-2">
              <div className="mb-6">
                <h1 className="text-2xl font-medium mb-1">Analytics Dashboard</h1>
                <p className="text-muted-foreground">
                  Monitor category performance and pricing impacts
                </p>
              </div>
              
              <AnalyticsDashboard 
                categories={categories} 
                products={products} 
                pricingRules={pricingRules} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Index;
