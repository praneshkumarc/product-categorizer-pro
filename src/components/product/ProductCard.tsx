
import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Edit, MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category?: string;
  demand: 'high' | 'medium' | 'low';
  seasonality?: string;
  margin: number;
  trend: 'up' | 'down' | 'stable';
  imageUrl?: string;
}

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onCategorize?: (product: Product) => void;
}

export const ProductCard = ({ product, onEdit, onCategorize }: ProductCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format percentage for display
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  
  // Determine demand color based on level
  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Determine seasonality badge color
  const getSeasonalityColor = (season?: string) => {
    if (!season) return 'bg-gray-100 text-gray-800';
    
    switch (season.toLowerCase()) {
      case 'spring':
        return 'bg-green-100 text-green-800';
      case 'summer':
        return 'bg-amber-100 text-amber-800';
      case 'fall':
      case 'autumn':
        return 'bg-orange-100 text-orange-800';
      case 'winter':
        return 'bg-blue-100 text-blue-800';
      case 'holiday':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden animate-hover hover:shadow-md transition-all duration-300 border border-gray-200/80">
      <div className="relative h-48 overflow-hidden">
        <div className={cn(
          "absolute inset-0 bg-gray-100 image-loading",
          imageLoaded ? "opacity-0" : "opacity-100"
        )} />
        <img
          src={product.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500&auto=format&fit=crop"}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-opacity duration-300"
          style={{ opacity: imageLoaded ? 1 : 0 }}
          onLoad={() => setImageLoaded(true)}
        />
        {product.category && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/80 hover:bg-white/90 text-foreground backdrop-blur-sm border-0">
              {product.category}
            </Badge>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 bg-white/80 hover:bg-white/90 backdrop-blur-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit?.(product)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCategorize?.(product)}>
                <Tag className="mr-2 h-4 w-4" /> Categorize
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-medium text-base line-clamp-1">{product.name}</h3>
            <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(product.price)}</p>
            <div className="flex items-center justify-end gap-1 text-xs">
              <span className={cn(
                "flex items-center",
                product.trend === 'up' ? 'text-green-600' : 
                product.trend === 'down' ? 'text-red-600' : 'text-gray-500'
              )}>
                {product.trend === 'up' ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : product.trend === 'down' ? (
                  <TrendingDown className="h-3 w-3 mr-1" />
                ) : null}
                {formatPercentage(product.margin)}
              </span>
              <span className="text-muted-foreground">margin</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="outline" className={cn("text-xs", getDemandColor(product.demand))}>
            {product.demand} demand
          </Badge>
          {product.seasonality && (
            <Badge variant="outline" className={cn("text-xs", getSeasonalityColor(product.seasonality))}>
              {product.seasonality}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-3 bg-secondary/30 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={() => onEdit?.(product)}
        >
          <Edit className="h-3 w-3 mr-1" /> Edit
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="text-xs"
          onClick={() => onCategorize?.(product)}
        >
          <Tag className="h-3 w-3 mr-1" /> Categorize
        </Button>
      </CardFooter>
    </Card>
  );
};
