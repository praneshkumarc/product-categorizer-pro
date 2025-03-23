
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const productSchema = z.object({
  name: z.string().min(2, { message: 'Product name must be at least 2 characters' }),
  sku: z.string().min(3, { message: 'SKU must be at least 3 characters' }),
  price: z.coerce.number().positive({ message: 'Price must be positive' }),
  category: z.string().optional(),
  demand: z.string().optional(),
  seasonality: z.string().optional(),
  margin: z.coerce.number().positive({ message: 'Margin must be positive' }).optional(),
  trend: z.string().optional(),
  image_url: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      price: 0,
      category: '',
      demand: '',
      seasonality: '',
      margin: 0,
      trend: '',
      image_url: '',
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to add products',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from('products').insert({
        user_id: user.id,
        name: data.name,
        sku: data.sku,
        price: data.price,
        category: data.category || null,
        demand: data.demand || null,
        seasonality: data.seasonality || null,
        margin: data.margin || null,
        trend: data.trend || null,
        image_url: data.image_url || null,
      });

      if (error) {
        console.error('Error adding product:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to add product',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Product added successfully',
        });
        form.reset();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Premium Wireless Headphones" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="WH-PRO-001" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.01" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="margin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margin (%)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" step="0.1" min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Premium Products">Premium Products</SelectItem>
                        <SelectItem value="High Demand">High Demand</SelectItem>
                        <SelectItem value="Seasonal">Seasonal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="demand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demand</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select demand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seasonality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seasonality</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Summer">Summer</SelectItem>
                        <SelectItem value="Winter">Winter</SelectItem>
                        <SelectItem value="Holiday">Holiday</SelectItem>
                        <SelectItem value="All Year">All Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trend</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trend" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="up">Up</SelectItem>
                        <SelectItem value="stable">Stable</SelectItem>
                        <SelectItem value="down">Down</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com/image.jpg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CardFooter className="px-0 pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Adding Product...' : 'Add Product'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
