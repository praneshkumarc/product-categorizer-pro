
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag, PlusCircle, X, Save } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface Category {
  id: string;
  name: string;
  description: string;
  rules: Rule[];
  attributes: string[];
  color?: string;
}

export interface Rule {
  id: string;
  attribute: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string | number | [number, number];
}

interface CategoryFormProps {
  onSubmit: (category: Omit<Category, 'id'>) => void;
  initialCategory?: Category;
}

export const CategoryForm = ({ onSubmit, initialCategory }: CategoryFormProps) => {
  const [name, setName] = useState(initialCategory?.name || '');
  const [description, setDescription] = useState(initialCategory?.description || '');
  const [attributes, setAttributes] = useState<string[]>(initialCategory?.attributes || []);
  const [attributeInput, setAttributeInput] = useState('');
  const [rules, setRules] = useState<Omit<Rule, 'id'>[]>(
    initialCategory?.rules.map(r => ({
      attribute: r.attribute,
      operator: r.operator,
      value: r.value
    })) || []
  );
  const [color, setColor] = useState<string>(initialCategory?.color || '#e2e8f0');
  
  const colorOptions = [
    { label: 'Gray', value: '#e2e8f0' },
    { label: 'Red', value: '#fecaca' },
    { label: 'Orange', value: '#fed7aa' },
    { label: 'Amber', value: '#fef3c7' },
    { label: 'Green', value: '#dcfce7' },
    { label: 'Blue', value: '#dbeafe' },
    { label: 'Indigo', value: '#e0e7ff' },
    { label: 'Purple', value: '#ede9fe' },
    { label: 'Pink', value: '#fce7f3' },
  ];
  
  const handleAddAttribute = () => {
    if (attributeInput && !attributes.includes(attributeInput)) {
      setAttributes([...attributes, attributeInput]);
      setAttributeInput('');
    }
  };
  
  const handleRemoveAttribute = (attribute: string) => {
    setAttributes(attributes.filter(a => a !== attribute));
    setRules(rules.filter(r => r.attribute !== attribute));
  };
  
  const handleAddRule = () => {
    if (attributes.length > 0) {
      setRules([
        ...rules,
        {
          attribute: attributes[0],
          operator: 'equals',
          value: ''
        }
      ]);
    }
  };
  
  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };
  
  const handleRuleChange = (index: number, field: keyof Omit<Rule, 'id'>, value: any) => {
    const updatedRules = [...rules];
    updatedRules[index] = {
      ...updatedRules[index],
      [field]: value
    };
    setRules(updatedRules);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description,
      attributes,
      rules: rules.map((rule, index) => ({
        id: `rule-${index}`,
        ...rule
      })),
      color
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Premium Products"
              required
              className="transition-all focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label>Category Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption.value}
                  type="button"
                  className={cn(
                    "w-6 h-6 rounded-full transition-all",
                    color === colorOption.value && "ring-2 ring-primary ring-offset-2"
                  )}
                  style={{ backgroundColor: colorOption.value }}
                  onClick={() => setColor(colorOption.value)}
                  aria-label={`Select ${colorOption.label} color`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this category represents..."
            className="min-h-[100px] resize-none transition-all focus-visible:ring-primary"
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Category Attributes</Label>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {attributes.length} attributes
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Input
              value={attributeInput}
              onChange={(e) => setAttributeInput(e.target.value)}
              placeholder="Add attribute (e.g., margin, demand)"
              className="transition-all focus-visible:ring-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAttribute();
                }
              }}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={handleAddAttribute}
              disabled={!attributeInput}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          
          {attributes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 min-h-[40px] p-2 rounded-md bg-muted/40">
              {attributes.map((attribute) => (
                <Badge 
                  key={attribute} 
                  variant="secondary"
                  className="px-2 py-1 gap-1"
                >
                  <Tag className="h-3 w-3" />
                  {attribute}
                  <button
                    type="button"
                    onClick={() => handleRemoveAttribute(attribute)}
                    className="ml-1 rounded-full hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {attribute}</span>
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Categorization Rules</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRule}
            disabled={attributes.length === 0}
            className="text-xs"
          >
            <PlusCircle className="h-3 w-3 mr-1" />
            Add Rule
          </Button>
        </div>
        
        {rules.length === 0 ? (
          <div className="text-center p-6 border border-dashed rounded-md">
            <p className="text-muted-foreground text-sm">No rules defined yet. Add attributes and then create rules.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-muted/40 rounded-md animate-fade-in">
                <Select
                  value={rule.attribute}
                  onValueChange={(value) => handleRuleChange(index, 'attribute', value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Attribute" />
                  </SelectTrigger>
                  <SelectContent>
                    {attributes.map((attr) => (
                      <SelectItem key={attr} value={attr}>
                        {attr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={rule.operator}
                  onValueChange={(value) => handleRuleChange(
                    index, 
                    'operator', 
                    value as Rule['operator']
                  )}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">equals</SelectItem>
                    <SelectItem value="contains">contains</SelectItem>
                    <SelectItem value="greater_than">greater than</SelectItem>
                    <SelectItem value="less_than">less than</SelectItem>
                    <SelectItem value="between">between</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  value={
                    typeof rule.value === 'object' 
                      ? `${rule.value[0]}-${rule.value[1]}` 
                      : rule.value
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (rule.operator === 'between') {
                      const [min, max] = value.split('-').map(Number);
                      handleRuleChange(index, 'value', [min || 0, max || 0]);
                    } else {
                      handleRuleChange(index, 'value', value);
                    }
                  }}
                  placeholder={rule.operator === 'between' ? 'min-max' : 'value'}
                  className="flex-1"
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRule(index)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={!name || attributes.length === 0}>
          <Save className="h-4 w-4 mr-2" />
          {initialCategory ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};
