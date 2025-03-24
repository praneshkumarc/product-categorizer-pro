import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle, Check, FileWarning, Database, Upload, File } from "lucide-react";
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

interface SalesDataPreprocessorProps {
  salesData: SalesDataItem[];
  onDataChange?: (newData: SalesDataItem[]) => void;
}

export const SalesDataPreprocessor: React.FC<SalesDataPreprocessorProps> = ({ 
  salesData, 
  onDataChange 
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleanedData, setCleanedData] = useState<SalesDataItem[]>([]);
  const [showCleanedData, setShowCleanedData] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

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

  // Calculate statistics about data quality
  const dataStats = useMemo(() => {
    const totalRecords = normalizedData.length;
    let missingValues = 0;
    let anomalies = 0;
    
    normalizedData.forEach(item => {
      // Check for missing values in important fields
      ['product', 'category', 'quantity', 'unit_price', 'region', 'date'].forEach(field => {
        if (item[field] === undefined || item[field] === null || item[field] === '') {
          missingValues++;
        }
      });
      
      // Check for anomalies (e.g., negative prices, zero quantities)
      if ((item.unit_price !== undefined && item.unit_price < 0) || 
          (item.quantity !== undefined && item.quantity <= 0)) {
        anomalies++;
      }
    });
    
    return {
      totalRecords,
      missingValues,
      anomalies,
      dataQualityScore: Math.round(100 * (1 - (missingValues + anomalies) / (totalRecords * 6))),
    };
  }, [normalizedData]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setUploadedFileName(file.name);
    
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const result = e.target?.result;
        if (typeof result !== 'string') {
          throw new Error('Invalid file format');
        }
        
        const parsedData = JSON.parse(result);
        
        // Validate the data structure
        if (!Array.isArray(parsedData)) {
          throw new Error('Uploaded file must contain an array of sales data');
        }
        
        // Generate IDs if they don't exist
        const processedData = parsedData.map((item, index) => ({
          id: item.id || `upload-${index}`,
          ...item
        }));
        
        // Notify parent component about the new data
        if (onDataChange) {
          onDataChange(processedData);
        }
        
        toast({
          title: "File uploaded successfully",
          description: `${processedData.length} records loaded from ${file.name}`,
          duration: 3000,
        });
        
        // Set cleaned data to empty since we have new data
        setCleanedData([]);
        setShowCleanedData(false);
      } catch (error) {
        toast({
          title: "Error uploading file",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "There was an error reading the uploaded file",
        variant: "destructive",
        duration: 5000,
      });
      setIsUploading(false);
    };
    
    reader.readAsText(file);
  };

  // Function to clean and preprocess the data
  const cleanAndPreprocessData = async () => {
    setIsProcessing(true);
    setProcessingStep(1);
    
    // Simulate processing delay for UX purposes
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 1: Identify missing values and anomalies
    setProcessingStep(2);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 2: Clean the data (fill missing values, correct anomalies)
    const cleaned = [...normalizedData].map(item => {
      const newItem = { ...item };
      
      // Fill missing categories
      if (!newItem.category || newItem.category === '') {
        newItem.category = 'Uncategorized';
      }
      
      // Fill missing regions
      if (!newItem.region || newItem.region === '') {
        newItem.region = 'Unknown';
      }
      
      // Fill missing customer types
      if (!newItem.customer_type || newItem.customer_type === '') {
        newItem.customer_type = 'Regular';
      }
      
      // Correct negative prices
      if (newItem.unit_price !== undefined && newItem.unit_price < 0) {
        newItem.unit_price = Math.abs(newItem.unit_price);
      }
      
      // Correct zero or negative quantities
      if (newItem.quantity !== undefined && newItem.quantity <= 0) {
        newItem.quantity = 1;
      }
      
      // Recalculate total sales
      if (newItem.unit_price !== undefined && newItem.quantity !== undefined) {
        newItem.total_sales = newItem.unit_price * newItem.quantity;
      }
      
      return newItem;
    });
    
    setProcessingStep(3);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 3: Format dates consistently
    const fullyCleaned = cleaned.map(item => {
      const newItem = { ...item };
      
      // Ensure date is in ISO format
      if (newItem.date) {
        try {
          const dateObj = new Date(newItem.date);
          newItem.date = dateObj.toISOString().split('T')[0];
        } catch (e) {
          // If date parsing fails, use a default date
          newItem.date = '2023-01-01';
        }
      } else {
        newItem.date = '2023-01-01';
      }
      
      return newItem;
    });
    
    setProcessingStep(4);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCleanedData(fullyCleaned);
    setIsProcessing(false);
    setShowCleanedData(true);
    
    // Update parent component with cleaned data
    if (onDataChange) {
      onDataChange(fullyCleaned);
    }
    
    toast({
      title: "Data preprocessing complete",
      description: `${fullyCleaned.length} records cleaned and processed successfully.`,
      duration: 3000,
    });
  };

  // Function to export the cleaned data
  const exportCleanedData = () => {
    // Create a CSV string from the cleaned data
    const headers = ['id', 'product', 'category', 'quantity', 'unit_price', 'total_sales', 'region', 'date', 'customer_type'];
    const csvContent = [
      headers.join(','),
      ...cleanedData.map(item => 
        headers.map(header => 
          item[header] !== undefined && item[header] !== null ? item[header] : ''
        ).join(',')
      )
    ].join('\n');
    
    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'cleaned_sales_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Data exported",
      description: "Cleaned data has been exported as CSV.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Database className="h-4 w-4 mr-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{dataStats.totalRecords}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Data Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{dataStats.dataQualityScore}%</div>
              <Progress value={dataStats.dataQualityScore} max={100} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Issues Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Missing Values</span>
                <Badge variant="outline">{dataStats.missingValues}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Anomalies</span>
                <Badge variant="outline">{dataStats.anomalies}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Data Preprocessing</AlertTitle>
        <AlertDescription>
          Preprocessing the sales data involves cleaning missing values, correcting anomalies, 
          and formatting the data for analysis. This ensures accurate insights and reliable results.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Preparation</CardTitle>
            <CardDescription>
              Clean and preprocess the sales data for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
                <input
                  type="file"
                  id="fileUpload"
                  className="hidden"
                  accept=".json"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <label
                  htmlFor="fileUpload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm font-medium mb-1">
                    {isUploading ? 'Uploading...' : 'Upload JSON data file'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Drag and drop or click to browse
                  </span>
                </label>
                
                {uploadedFileName && (
                  <div className="mt-3 flex items-center justify-center text-sm">
                    <File className="h-4 w-4 mr-1 text-blue-500" />
                    <span>{uploadedFileName}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="font-medium">Preprocessing Steps:</div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${processingStep >= 1 ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                    {processingStep >= 1 ? <Check className="h-4 w-4" /> : '1'}
                  </div>
                  <span>Load and normalize data from all sources</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${processingStep >= 2 ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                    {processingStep >= 2 ? <Check className="h-4 w-4" /> : '2'}
                  </div>
                  <span>Identify missing values and anomalies</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${processingStep >= 3 ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                    {processingStep >= 3 ? <Check className="h-4 w-4" /> : '3'}
                  </div>
                  <span>Clean and correct data issues</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${processingStep >= 4 ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                    {processingStep >= 4 ? <Check className="h-4 w-4" /> : '4'}
                  </div>
                  <span>Format data for analysis</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={cleanAndPreprocessData} 
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Preprocess Data'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={exportCleanedData} 
                  disabled={!showCleanedData || isProcessing}
                >
                  Export Clean Data
                </Button>
              </div>
              
              {isProcessing && (
                <div className="pt-2">
                  <Progress value={(processingStep / 4) * 100} max={100} className="h-2" />
                  <p className="text-sm text-muted-foreground pt-1">
                    Step {processingStep} of 4: {
                      processingStep === 1 ? 'Loading data...' :
                      processingStep === 2 ? 'Identifying issues...' :
                      processingStep === 3 ? 'Cleaning data...' :
                      'Formatting data...'
                    }
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Quality Report</CardTitle>
            <CardDescription>
              Analysis of data quality and identified issues
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-auto">
            {dataStats.missingValues > 0 || dataStats.anomalies > 0 ? (
              <div className="space-y-4">
                {dataStats.missingValues > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Missing Values Detected</AlertTitle>
                    <AlertDescription>
                      {dataStats.missingValues} missing values found across {dataStats.totalRecords} records.
                      These will be filled with appropriate defaults during preprocessing.
                    </AlertDescription>
                  </Alert>
                )}
                
                {dataStats.anomalies > 0 && (
                  <Alert variant="destructive">
                    <FileWarning className="h-4 w-4" />
                    <AlertTitle>Data Anomalies Detected</AlertTitle>
                    <AlertDescription>
                      {dataStats.anomalies} anomalies found (negative prices or zero quantities).
                      These will be corrected during preprocessing.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <Check className="h-4 w-4" />
                <AlertTitle>Data Looks Good</AlertTitle>
                <AlertDescription>
                  No significant data quality issues detected in the sales data.
                </AlertDescription>
              </Alert>
            )}
            
            {showCleanedData && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Cleaned Data Preview (First 5 Records)</h3>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Region</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cleanedData.slice(0, 5).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unit_price?.toFixed(2)}</TableCell>
                          <TableCell>{item.region}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
