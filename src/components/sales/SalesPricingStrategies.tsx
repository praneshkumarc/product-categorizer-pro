
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown, BarChart2, TrendingUp, TrendingDown, Percent, DollarSign, Users, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface PricingStrategy {
  id: string;
  name: string;
  description: string;
  targetCategory: string;
  targetRegion: string | null;
  priceChange: number;
  changeType: 'percentage' | 'fixed';
  expectedImpact: number;
  implementationDate: string;
  collaborators: string[];
  status: 'proposed' | 'approved' | 'implemented' | 'rejected';
}

interface SalesPricingStrategiesProps {
  salesData: SalesDataItem[];
}

export const SalesPricingStrategies: React.FC<SalesPricingStrategiesProps> = ({ salesData }) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [strategies, setStrategies] = useState<PricingStrategy[]>([
    {
      id: 'strategy-1',
      name: 'Premium Products Markup',
      description: 'Increase prices for high-margin products to maximize profitability',
      targetCategory: 'Electronics',
      targetRegion: null,
      priceChange: 10,
      changeType: 'percentage',
      expectedImpact: 15,
      implementationDate: '2023-11-01',
      collaborators: ['Product Manager', 'Sales Director', 'Marketing Manager'],
      status: 'implemented'
    },
    {
      id: 'strategy-2',
      name: 'Seasonal Sales Promotion',
      description: 'Temporary discount for seasonal products to boost volume',
      targetCategory: 'Apparel',
      targetRegion: 'Minnesota',
      priceChange: -15,
      changeType: 'percentage',
      expectedImpact: 25,
      implementationDate: '2023-12-01',
      collaborators: ['Marketing Manager', 'Regional Manager', 'Pricing Analyst'],
      status: 'approved'
    },
    {
      id: 'strategy-3',
      name: 'Regional Price Adjustment',
      description: 'Adjust prices in high-demand regions to optimize margins',
      targetCategory: 'Audio',
      targetRegion: 'California',
      priceChange: 5.99,
      changeType: 'fixed',
      expectedImpact: 8,
      implementationDate: '2024-01-15',
      collaborators: ['Regional Sales Manager', 'Pricing Analyst'],
      status: 'proposed'
    }
  ]);
  
  const [newStrategy, setNewStrategy] = useState<Omit<PricingStrategy, 'id'>>({
    name: '',
    description: '',
    targetCategory: '',
    targetRegion: null,
    priceChange: 0,
    changeType: 'percentage',
    expectedImpact: 0,
    implementationDate: '',
    collaborators: [],
    status: 'proposed'
  });
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeStrategyId, setActiveStrategyId] = useState<string | null>(null);
  
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
  
  // Get unique categories and regions for filtering
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    normalizedData.forEach(item => {
      if (item.category) categorySet.add(item.category);
    });
    return ['all', ...Array.from(categorySet)];
  }, [normalizedData]);
  
  const regions = useMemo(() => {
    const regionSet = new Set<string>();
    normalizedData.forEach(item => {
      if (item.region) regionSet.add(item.region);
    });
    return ['all', ...Array.from(regionSet)];
  }, [normalizedData]);
  
  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return normalizedData.filter(item => {
      let include = true;
      
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        include = false;
      }
      
      if (selectedRegion !== 'all' && item.region !== selectedRegion) {
        include = false;
      }
      
      return include;
    });
  }, [normalizedData, selectedCategory, selectedRegion]);
  
  // Calculate price elasticity simulation
  const elasticitySimulation = useMemo(() => {
    // Define price elasticity for different categories (simplified)
    const elasticityMap: Record<string, number> = {
      'Electronics': -0.8,   // Less elastic (less sensitive to price changes)
      'Audio': -1.2,         // Moderately elastic
      'Wearables': -1.0,     // Moderately elastic
      'Apparel': -1.5        // More elastic (more sensitive to price changes)
    };
    
    // Default elasticity if category is not mapped
    const defaultElasticity = -1.0;
    
    // Price change percentages to simulate
    const priceChanges = [-20, -15, -10, -5, 0, 5, 10, 15, 20];
    
    // Calculate the simulations
    if (selectedCategory === 'all') {
      // Calculate average across all categories
      return priceChanges.map(priceChange => {
        let totalQuantity = 0;
        let totalRevenue = 0;
        
        filteredData.forEach(item => {
          const elasticity = item.category && elasticityMap[item.category] ? 
            elasticityMap[item.category] : defaultElasticity;
          
          const quantityChange = elasticity * priceChange / 100;
          const newQuantity = (item.quantity || 0) * (1 + quantityChange);
          const newRevenue = ((item.unit_price || 0) * (1 + priceChange / 100)) * newQuantity;
          
          totalQuantity += newQuantity;
          totalRevenue += newRevenue;
        });
        
        return {
          priceChange,
          quantity: totalQuantity,
          revenue: totalRevenue
        };
      });
    } else {
      // Calculate for specific category
      const elasticity = elasticityMap[selectedCategory] || defaultElasticity;
      
      return priceChanges.map(priceChange => {
        let totalQuantity = 0;
        let totalRevenue = 0;
        
        filteredData.forEach(item => {
          const quantityChange = elasticity * priceChange / 100;
          const newQuantity = (item.quantity || 0) * (1 + quantityChange);
          const newRevenue = ((item.unit_price || 0) * (1 + priceChange / 100)) * newQuantity;
          
          totalQuantity += newQuantity;
          totalRevenue += newRevenue;
        });
        
        return {
          priceChange,
          quantity: totalQuantity,
          revenue: totalRevenue
        };
      });
    }
  }, [filteredData, selectedCategory]);
  
  // Calculate optimal price change for revenue maximization
  const optimalPriceChange = useMemo(() => {
    if (elasticitySimulation.length === 0) return 0;
    
    // Find the price change that maximizes revenue
    const maxRevenueSimulation = elasticitySimulation.reduce((max, current) => 
      current.revenue > max.revenue ? current : max
    );
    
    return maxRevenueSimulation.priceChange;
  }, [elasticitySimulation]);
  
  // Format revenue change for display
  const formatRevenueChange = (currentRevenue: number) => {
    const baseRevenue = elasticitySimulation.find(s => s.priceChange === 0)?.revenue || 0;
    const percentChange = ((currentRevenue - baseRevenue) / baseRevenue) * 100;
    
    return {
      absolute: currentRevenue - baseRevenue,
      percent: percentChange
    };
  };
  
  // Calculate current metrics
  const currentMetrics = useMemo(() => {
    const totalUnits = filteredData.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalRevenue = filteredData.reduce((sum, item) => sum + (item.total_sales || 0), 0);
    const avgPrice = totalRevenue / totalUnits;
    
    return {
      totalUnits,
      totalRevenue,
      avgPrice
    };
  }, [filteredData]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle creating a new strategy
  const handleCreateStrategy = () => {
    if (!newStrategy.name || !newStrategy.targetCategory || !newStrategy.implementationDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to create a pricing strategy.",
        variant: "destructive",
      });
      return;
    }
    
    const newStrategyWithId: PricingStrategy = {
      ...newStrategy,
      id: `strategy-${strategies.length + 1}`
    };
    
    setStrategies([...strategies, newStrategyWithId]);
    setShowCreateForm(false);
    setNewStrategy({
      name: '',
      description: '',
      targetCategory: '',
      targetRegion: null,
      priceChange: 0,
      changeType: 'percentage',
      expectedImpact: 0,
      implementationDate: '',
      collaborators: [],
      status: 'proposed'
    });
    
    toast({
      title: "Strategy Created",
      description: `${newStrategy.name} has been added to your pricing strategies.`,
      duration: 3000,
    });
  };
  
  // Handle updating a strategy status
  const handleUpdateStatus = (strategyId: string, newStatus: PricingStrategy['status']) => {
    setStrategies(strategies.map(strategy => 
      strategy.id === strategyId ? { ...strategy, status: newStatus } : strategy
    ));
    
    toast({
      title: "Status Updated",
      description: `Strategy status has been updated to ${newStatus}.`,
      duration: 3000,
    });
  };
  
  // Filter strategies by status
  const filterStrategiesByStatus = (status: PricingStrategy['status']) => {
    return strategies.filter(strategy => strategy.status === status);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Pricing Strategy Development</h2>
          <p className="text-muted-foreground text-sm">
            Develop and manage pricing strategies based on historical sales data
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
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
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Avg. Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">
                {formatCurrency(currentMetrics.avgPrice)}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Optimal Price Change
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Percent className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold flex items-center">
                {optimalPriceChange > 0 ? (
                  <ChevronUp className="h-4 w-4 text-green-500" />
                ) : optimalPriceChange < 0 ? (
                  <ChevronDown className="h-4 w-4 text-red-500" />
                ) : (
                  <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                )}
                {Math.abs(optimalPriceChange)}%
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            {elasticitySimulation.length > 0 && (
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 text-muted-foreground mr-2" />
                <div className="text-2xl font-bold">
                  {formatCurrency(formatRevenueChange(
                    elasticitySimulation.find(s => s.priceChange === optimalPriceChange)?.revenue || 0
                  ).absolute)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Price Elasticity Simulation</CardTitle>
            <CardDescription>
              Impact of price changes on revenue and demand
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <LineChart 
              data={elasticitySimulation}
              categories={['revenue']}
              index="priceChange"
              valueFormatter={(value) => formatCurrency(value)}
              showLegend={false}
              showGridLines={true}
              className="h-full"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quantity Impact</CardTitle>
            <CardDescription>
              Effect of price changes on sales volume
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart 
              data={elasticitySimulation}
              categories={['quantity']}
              index="priceChange"
              valueFormatter={(value) => Math.round(value).toLocaleString()}
              showLegend={false}
              showGridLines={true}
              className="h-full"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Pricing Strategies</h3>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : 'Create New Strategy'}
          </Button>
        </div>
        
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Pricing Strategy</CardTitle>
              <CardDescription>
                Define a pricing strategy based on data insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Strategy Name *</label>
                  <Input 
                    value={newStrategy.name}
                    onChange={(e) => setNewStrategy({...newStrategy, name: e.target.value})}
                    placeholder="e.g., Summer Promotion"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Category *</label>
                  <Select 
                    value={newStrategy.targetCategory} 
                    onValueChange={(value) => setNewStrategy({...newStrategy, targetCategory: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== 'all').map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Region (Optional)</label>
                  <Select 
                    value={newStrategy.targetRegion || ''} 
                    onValueChange={(value) => setNewStrategy({...newStrategy, targetRegion: value || null})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All regions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All regions</SelectItem>
                      {regions.filter(r => r !== 'all').map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Change Type</label>
                  <Select 
                    value={newStrategy.changeType} 
                    onValueChange={(value: 'percentage' | 'fixed') => setNewStrategy({...newStrategy, changeType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Change</SelectItem>
                      <SelectItem value="fixed">Fixed Amount Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Change *</label>
                  <div className="flex items-center">
                    {newStrategy.changeType === 'percentage' && <span className="mr-2">%</span>}
                    {newStrategy.changeType === 'fixed' && <span className="mr-2">$</span>}
                    <Input 
                      type="number"
                      value={newStrategy.priceChange}
                      onChange={(e) => setNewStrategy({...newStrategy, priceChange: parseFloat(e.target.value)})}
                      placeholder="e.g., 10 for increase, -10 for decrease"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Impact (%)</label>
                  <Input 
                    type="number"
                    value={newStrategy.expectedImpact}
                    onChange={(e) => setNewStrategy({...newStrategy, expectedImpact: parseFloat(e.target.value)})}
                    placeholder="Expected revenue impact (%)"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Implementation Date *</label>
                  <Input 
                    type="date"
                    value={newStrategy.implementationDate}
                    onChange={(e) => setNewStrategy({...newStrategy, implementationDate: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input 
                    value={newStrategy.description}
                    onChange={(e) => setNewStrategy({...newStrategy, description: e.target.value})}
                    placeholder="Describe the strategy and its goals"
                  />
                </div>
                
                <div className="sm:col-span-2 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateStrategy}>
                    Create Strategy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Strategies</TabsTrigger>
            <TabsTrigger value="proposed">Proposed</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="implemented">Implemented</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Strategy Name</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Price Change</TableHead>
                  <TableHead>Expected Impact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {strategies.map((strategy) => (
                  <TableRow key={strategy.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setActiveStrategyId(activeStrategyId === strategy.id ? null : strategy.id)}>
                    <TableCell className="font-medium">{strategy.name}</TableCell>
                    <TableCell>
                      {strategy.targetCategory}
                      {strategy.targetRegion && <span className="text-muted-foreground"> ({strategy.targetRegion})</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {strategy.priceChange > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : strategy.priceChange < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        ) : null}
                        
                        {strategy.changeType === 'percentage' ? (
                          <span>{strategy.priceChange}%</span>
                        ) : (
                          <span>${Math.abs(strategy.priceChange).toFixed(2)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{strategy.expectedImpact}%</TableCell>
                    <TableCell>
                      <Badge variant={
                        strategy.status === 'implemented' ? 'default' :
                        strategy.status === 'approved' ? 'outline' :
                        strategy.status === 'proposed' ? 'secondary' :
                        'destructive'
                      }>
                        {strategy.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {strategy.status === 'proposed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(strategy.id, 'approved');
                            }}
                          >
                            Approve
                          </Button>
                        )}
                        {strategy.status === 'approved' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(strategy.id, 'implemented');
                            }}
                          >
                            Implement
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {strategies.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No pricing strategies defined yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="proposed">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Strategy Name</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Price Change</TableHead>
                  <TableHead>Expected Impact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterStrategiesByStatus('proposed').map((strategy) => (
                  <TableRow key={strategy.id}>
                    <TableCell className="font-medium">{strategy.name}</TableCell>
                    <TableCell>
                      {strategy.targetCategory}
                      {strategy.targetRegion && <span className="text-muted-foreground"> ({strategy.targetRegion})</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {strategy.priceChange > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : strategy.priceChange < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        ) : null}
                        
                        {strategy.changeType === 'percentage' ? (
                          <span>{strategy.priceChange}%</span>
                        ) : (
                          <span>${Math.abs(strategy.priceChange).toFixed(2)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{strategy.expectedImpact}%</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateStatus(strategy.id, 'approved')}
                      >
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filterStrategiesByStatus('proposed').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No proposed strategies found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="approved">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Strategy Name</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Price Change</TableHead>
                  <TableHead>Expected Impact</TableHead>
                  <TableHead>Implementation Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterStrategiesByStatus('approved').map((strategy) => (
                  <TableRow key={strategy.id}>
                    <TableCell className="font-medium">{strategy.name}</TableCell>
                    <TableCell>
                      {strategy.targetCategory}
                      {strategy.targetRegion && <span className="text-muted-foreground"> ({strategy.targetRegion})</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {strategy.priceChange > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : strategy.priceChange < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        ) : null}
                        
                        {strategy.changeType === 'percentage' ? (
                          <span>{strategy.priceChange}%</span>
                        ) : (
                          <span>${Math.abs(strategy.priceChange).toFixed(2)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{strategy.expectedImpact}%</TableCell>
                    <TableCell>{new Date(strategy.implementationDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateStatus(strategy.id, 'implemented')}
                      >
                        Implement
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filterStrategiesByStatus('approved').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No approved strategies found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="implemented">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Strategy Name</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Price Change</TableHead>
                  <TableHead>Expected Impact</TableHead>
                  <TableHead>Implementation Date</TableHead>
                  <TableHead>Collaborators</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filterStrategiesByStatus('implemented').map((strategy) => (
                  <TableRow key={strategy.id}>
                    <TableCell className="font-medium">{strategy.name}</TableCell>
                    <TableCell>
                      {strategy.targetCategory}
                      {strategy.targetRegion && <span className="text-muted-foreground"> ({strategy.targetRegion})</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {strategy.priceChange > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : strategy.priceChange < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        ) : null}
                        
                        {strategy.changeType === 'percentage' ? (
                          <span>{strategy.priceChange}%</span>
                        ) : (
                          <span>${Math.abs(strategy.priceChange).toFixed(2)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{strategy.expectedImpact}%</TableCell>
                    <TableCell>{new Date(strategy.implementationDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{strategy.collaborators.length}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filterStrategiesByStatus('implemented').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No implemented strategies found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
        
        {activeStrategyId && (
          <Card>
            <CardHeader>
              <CardTitle>
                {strategies.find(s => s.id === activeStrategyId)?.name || 'Strategy Details'}
              </CardTitle>
              <CardDescription>
                Detailed information and collaborators
              </CardDescription>
            </CardHeader>
            <CardContent>
              {strategies.find(s => s.id === activeStrategyId) && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Description</h4>
                    <p className="text-muted-foreground">
                      {strategies.find(s => s.id === activeStrategyId)?.description || 'No description provided.'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Collaborators</h4>
                    <div className="flex flex-wrap gap-2">
                      {strategies.find(s => s.id === activeStrategyId)?.collaborators.map((collaborator, index) => (
                        <div key={index} className="flex items-center bg-muted px-2 py-1 rounded text-sm">
                          <UserCheck className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {collaborator}
                        </div>
                      ))}
                      {strategies.find(s => s.id === activeStrategyId)?.collaborators.length === 0 && (
                        <p className="text-muted-foreground">No collaborators assigned.</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Target Category</h4>
                      <p>{strategies.find(s => s.id === activeStrategyId)?.targetCategory}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Target Region</h4>
                      <p>{strategies.find(s => s.id === activeStrategyId)?.targetRegion || 'All Regions'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Implementation Date</h4>
                      <p>{new Date(strategies.find(s => s.id === activeStrategyId)?.implementationDate || '').toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
