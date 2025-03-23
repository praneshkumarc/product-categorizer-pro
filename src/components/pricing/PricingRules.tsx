
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DollarSign, Percent, Calendar, Tag, PlusCircle, Trash2, Save } from 'lucide-react';
import { Category } from '../category/CategoryForm';
import { cn } from "@/lib/utils";

export interface PricingRule {
  id: string;
  name: string;
  categoryId: string;
  type: 'fixed' | 'percentage' | 'margin-based';
  value: number;
  startDate?: string;
  endDate?: string;
  priority: number;
  active: boolean;
}

interface PricingRulesProps {
  categories: Category[];
  onSaveRule: (rule: Omit<PricingRule, 'id'>) => void;
  existingRules?: PricingRule[];
  onDeleteRule?: (ruleId: string) => void;
  onUpdateRule?: (rule: PricingRule) => void;
}

export const PricingRules = ({ 
  categories,
  onSaveRule,
  existingRules = [],
  onDeleteRule,
  onUpdateRule
}: PricingRulesProps) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState<PricingRule['type']>('percentage');
  const [value, setValue] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState(1);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const ruleData = {
      name,
      categoryId,
      type,
      value,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      priority,
      active: true
    };
    
    if (editingRuleId) {
      onUpdateRule?.({
        id: editingRuleId,
        ...ruleData
      });
    } else {
      onSaveRule(ruleData);
    }
    
    resetForm();
  };
  
  const resetForm = () => {
    setName('');
    setCategoryId('');
    setType('percentage');
    setValue(0);
    setStartDate('');
    setEndDate('');
    setPriority(1);
    setEditingRuleId(null);
  };
  
  const handleEditRule = (rule: PricingRule) => {
    setName(rule.name);
    setCategoryId(rule.categoryId);
    setType(rule.type);
    setValue(rule.value);
    setStartDate(rule.startDate || '');
    setEndDate(rule.endDate || '');
    setPriority(rule.priority);
    setEditingRuleId(rule.id);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#e2e8f0';
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };
  
  const renderRuleValue = (rule: PricingRule) => {
    switch (rule.type) {
      case 'fixed':
        return (
          <div className="flex items-center text-primary">
            <DollarSign className="h-3 w-3 mr-0.5" />
            {rule.value.toFixed(2)}
          </div>
        );
      case 'percentage':
        return (
          <div className="flex items-center text-emerald-600">
            <Percent className="h-3 w-3 mr-0.5" />
            {rule.value}
          </div>
        );
      case 'margin-based':
        return (
          <div className="flex items-center text-blue-600">
            <span className="mr-0.5">×</span>
            {rule.value.toFixed(2)}
          </div>
        );
      default:
        return rule.value;
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border shadow-sm">
        <CardHeader className="px-6 py-5">
          <CardTitle className="text-xl flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-primary" />
            {editingRuleId ? 'Update Pricing Rule' : 'Create Pricing Rule'}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name">Rule Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Summer Sale"
                  required
                  className="transition-all focus-visible:ring-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={categoryId} 
                  onValueChange={setCategoryId}
                  required
                >
                  <SelectTrigger id="category" className="transition-all focus-visible:ring-primary">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <div 
                            className="w-2 h-2 rounded-full mr-2" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="type">Adjustment Type</Label>
                <Select 
                  value={type} 
                  onValueChange={(v) => setType(v as PricingRule['type'])}
                >
                  <SelectTrigger id="type" className="transition-all focus-visible:ring-primary">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="margin-based">Margin Multiplier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="value">
                  {type === 'fixed' ? 'Amount' : 
                   type === 'percentage' ? 'Percentage' : 'Multiplier'}
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    {type === 'fixed' ? (
                      <DollarSign className="h-4 w-4" />
                    ) : type === 'percentage' ? (
                      <Percent className="h-4 w-4" />
                    ) : (
                      <span className="text-base font-medium">×</span>
                    )}
                  </div>
                  <Input
                    id="value"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    step={type === 'percentage' ? 1 : 0.01}
                    min={type === 'percentage' ? 0 : type === 'fixed' ? 0 : 0.01}
                    max={type === 'percentage' ? 100 : undefined}
                    required
                    className="pl-10 transition-all focus-visible:ring-primary"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date (Optional)</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 transition-all focus-visible:ring-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (Optional)</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 transition-all focus-visible:ring-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority (1-10)</Label>
                <Input
                  id="priority"
                  type="number"
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  min={1}
                  max={10}
                  required
                  className="transition-all focus-visible:ring-primary"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {editingRuleId ? 'Update Rule' : 'Create Rule'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {existingRules.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Existing Rules</h2>
            <Badge variant="outline" className="text-muted-foreground">
              {existingRules.length} rules
            </Badge>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {existingRules.map((rule) => (
              <AccordionItem 
                key={rule.id} 
                value={rule.id}
                className="border border-border rounded-md mb-3 overflow-hidden animate-fade-in"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-secondary/50 transition-all">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Badge 
                        className="capitalize"
                        style={{ 
                          backgroundColor: getCategoryColor(rule.categoryId),
                          color: 'rgba(0, 0, 0, 0.7)'
                        }}
                      >
                        <Tag className="h-3 w-3 mr-1 opacity-70" />
                        {getCategoryName(rule.categoryId)}
                      </Badge>
                      <span className={cn(
                        "font-medium",
                        !rule.active && "text-muted-foreground line-through"
                      )}>
                        {rule.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {renderRuleValue(rule)}
                      {(rule.startDate || rule.endDate) && (
                        <Badge variant="outline" className="text-xs">
                          {formatDate(rule.startDate)} - {formatDate(rule.endDate)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-4 py-3 bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Priority: <span className="font-medium text-foreground">{rule.priority}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Status: 
                          <Badge 
                            variant={rule.active ? "default" : "outline"} 
                            className="ml-2 text-xs"
                          >
                            {rule.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRule(rule)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                          onClick={() => onDeleteRule?.(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};
