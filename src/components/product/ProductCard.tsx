
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Tag, Trash2 } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category?: string;
  demand?: string;
  seasonality?: string;
  margin?: number;
  trend?: string;
  imageUrl?: string;
  image_url?: string; // For Supabase compatibility
}

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onCategorize?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export const ProductCard = ({ product, onEdit, onCategorize, onDelete }: ProductCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // For Supabase compatibility
  const imageUrl = product.imageUrl || product.image_url;

  return (
    <Card className="product-card overflow-hidden transition-all hover:shadow-md animate-scale-in">
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
            No Image
          </div>
        )}
        
        {product.category && (
          <Badge 
            className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-black font-medium"
            variant="outline"
          >
            {product.category}
          </Badge>
        )}
        
        {product.trend && (
          <Badge 
            className={`absolute top-3 right-3 ${
              product.trend === 'up' 
                ? 'bg-green-500' 
                : product.trend === 'down' 
                  ? 'bg-red-500' 
                  : 'bg-gray-500'
            }`}
          >
            {product.trend.toUpperCase()}
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">
          SKU: {product.sku}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="text-xl font-semibold">
              {formatCurrency(product.price)}
            </p>
            {product.margin && (
              <p className="text-xs text-muted-foreground">
                Margin: {product.margin}%
              </p>
            )}
          </div>
          
          <div className="space-x-1">
            {product.demand && (
              <Badge 
                variant={
                  product.demand === 'high' 
                    ? 'default' 
                    : product.demand === 'medium' 
                      ? 'secondary' 
                      : 'outline'
                }
                className="text-xs"
              >
                {product.demand}
              </Badge>
            )}
            
            {product.seasonality && (
              <Badge variant="outline" className="text-xs">
                {product.seasonality}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex space-x-2">
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => onEdit(product)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
        
        {onCategorize && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={() => onCategorize(product)}
          >
            <Tag className="h-4 w-4 mr-1" />
            Categorize
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
