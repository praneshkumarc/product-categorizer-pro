
import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadialBarChart as RechartsRadialBarChart,
  RadialBar,
  Treemap,
} from 'recharts';

// Define common props
type CommonChartProps = {
  data: any[];
  height?: number;
  className?: string;
  valueFormatter?: (value: any) => string;
};

// LineChart component
export const LineChart = ({ 
  data, 
  height = 300,
  categories,
  index,
  valueFormatter,
  showLegend = true,
  showGridLines = true,
  startEndOnly = false,
  className = ""
}: CommonChartProps & { 
  categories: string[];
  index: string;
  showLegend?: boolean;
  showGridLines?: boolean;
  startEndOnly?: boolean;
}) => {
  // Create series from categories
  const series = categories.map((category, i) => ({
    name: category,
    key: category,
    color: getColorForIndex(i)
  }));

  // Format ticks if using startEndOnly
  // Fix for the type error: Update the function signature to match XAxis tickFormatter
  const formatTick = (tickItem: any, index: number) => {
    if (startEndOnly) {
      // We need to get the ticks array from the component's render context
      // Since we can't access it directly, we'll use a workaround
      const ticks = data.map(item => item[index]);
      return index === 0 || index === ticks.length - 1 ? tickItem : '';
    }
    return tickItem;
  };

  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis 
          dataKey={index} 
          tickFormatter={startEndOnly ? formatTick : undefined}
        />
        <YAxis tickFormatter={valueFormatter} />
        <Tooltip formatter={valueFormatter} />
        {showLegend && <Legend />}
        {categories.map((category, idx) => (
          <Line 
            key={idx} 
            type="monotone" 
            dataKey={category} 
            name={category} 
            stroke={getColorForIndex(idx)} 
            activeDot={{ r: 8 }} 
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

// BarChart component
export const BarChart = ({ 
  data, 
  height = 300,
  categories,
  index,
  valueFormatter,
  showLegend = true,
  showGridLines = true,
  layout = 'horizontal',
  className = ""
}: CommonChartProps & { 
  categories: string[];
  index: string;
  showLegend?: boolean;
  showGridLines?: boolean;
  layout?: 'vertical' | 'horizontal';
}) => {
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        {showGridLines && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis 
          dataKey={layout === 'horizontal' ? index : undefined} 
          type={layout === 'horizontal' ? 'category' : 'number'} 
          tickFormatter={layout === 'horizontal' ? undefined : valueFormatter}
        />
        <YAxis 
          dataKey={layout === 'vertical' ? index : undefined} 
          type={layout === 'vertical' ? 'category' : 'number'}
          tickFormatter={layout === 'vertical' ? undefined : valueFormatter}
        />
        <Tooltip formatter={valueFormatter} />
        {showLegend && <Legend />}
        {categories.map((category, idx) => (
          <Bar 
            key={idx} 
            dataKey={category} 
            name={category} 
            fill={getColorForIndex(idx)} 
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

// PieChart component
export const PieChart = ({ 
  data, 
  height = 300,
  category,
  index,
  valueFormatter,
  className = "",
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C']
}: CommonChartProps & { 
  category: string;
  index: string;
  colors?: string[];
}) => {
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={category}
          nameKey={index}
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={valueFormatter} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

// RadialBarChart component
export const RadialBarChart = ({ 
  data, 
  height = 300,
  category,
  index,
  valueFormatter,
  className = "",
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
}: CommonChartProps & { 
  category: string;
  index: string;
  colors?: string[];
}) => {
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <RechartsRadialBarChart 
        cx="50%" 
        cy="50%" 
        innerRadius="10%" 
        outerRadius="80%" 
        barSize={10} 
        data={data}
      >
        <RadialBar
          label={{ position: 'insideStart', fill: '#fff' }}
          background
          dataKey={category}
          // Use name instead of nameKey for RadialBar
          name={index}
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
          ))}
        </RadialBar>
        <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ lineHeight: '24px' }} />
        <Tooltip formatter={valueFormatter} />
      </RechartsRadialBarChart>
    </ResponsiveContainer>
  );
};

// HeatMapChart component (using Treemap as alternative)
export const HeatMapChart = ({ 
  data, 
  height = 300,
  category,
  index,
  valueFormatter,
  className = "",
  colors = ['#8889DD', '#9597E4', '#8DC77B', '#A5D297', '#E2CF45', '#F8C12D']
}: CommonChartProps & { 
  category: string;
  index: string | string[];
  colors?: string[];
}) => {
  // For index as array, we need to transform the data to use properly with Treemap
  const transformedData = React.useMemo(() => {
    if (Array.isArray(index)) {
      // Create a unique identifier for each data point using the index fields
      return data.map(item => ({
        ...item,
        id: index.map(key => item[key]).join('-'),
        name: index.map(key => item[key]).join(', ')
      }));
    }
    return data;
  }, [data, index]);

  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      <Treemap
        data={transformedData}
        dataKey={category}
        nameKey={Array.isArray(index) ? 'name' : index}
        // Use aspectRatio instead of ratio
        aspectRatio={4/3}
        stroke="#fff"
        fill="#8884d8"
      >
        {transformedData.map((entry, idx) => (
          <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
        ))}
      </Treemap>
    </ResponsiveContainer>
  );
};

// Helper function to get chart colors
function getColorForIndex(index: number): string {
  const colors = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C', 
    '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#ffc658'
  ];
  return colors[index % colors.length];
}
