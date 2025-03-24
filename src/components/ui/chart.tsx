
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

// LineChart component
export const LineChart = ({ 
  data, 
  height = 300, 
  xKey = 'name', 
  series,
  grid = true
}: { 
  data: any[]; 
  height?: number;
  xKey?: string;
  series: {name: string; key: string; color: string}[];
  grid?: boolean;
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {grid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {series.map((s, index) => (
          <Line 
            key={index} 
            type="monotone" 
            dataKey={s.key} 
            name={s.name} 
            stroke={s.color} 
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
  xKey = 'name', 
  series,
  layout = 'vertical'
}: { 
  data: any[]; 
  height?: number;
  xKey?: string;
  series: {name: string; key: string; color: string}[];
  layout?: 'vertical' | 'horizontal';
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={layout === 'horizontal' ? xKey : undefined} type={layout === 'horizontal' ? 'category' : 'number'} />
        <YAxis dataKey={layout === 'vertical' ? xKey : undefined} type={layout === 'vertical' ? 'category' : 'number'} />
        <Tooltip />
        <Legend />
        {series.map((s, index) => (
          <Bar key={index} dataKey={s.key} name={s.name} fill={s.color} />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

// PieChart component
export const PieChart = ({ 
  data, 
  height = 300, 
  nameKey = 'name',
  dataKey = 'value',
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4DE6C']
}: { 
  data: any[]; 
  height?: number;
  nameKey?: string;
  dataKey?: string;
  colors?: string[];
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

// RadialBarChart component
export const RadialBarChart = ({ 
  data, 
  height = 300,
  nameKey = 'name',
  dataKey = 'value', 
  colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
}: { 
  data: any[]; 
  height?: number;
  nameKey?: string;
  dataKey?: string;
  colors?: string[];
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
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
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </RadialBar>
        <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={{ lineHeight: '24px' }} />
        <Tooltip />
      </RechartsRadialBarChart>
    </ResponsiveContainer>
  );
};

// HeatMapChart component (using Treemap as alternative)
export const HeatMapChart = ({ 
  data, 
  height = 300,
  nameKey = 'name',
  dataKey = 'value',
  colors = ['#8889DD', '#9597E4', '#8DC77B', '#A5D297', '#E2CF45', '#F8C12D']
}: { 
  data: any[]; 
  height?: number;
  nameKey?: string;
  dataKey?: string;
  colors?: string[];
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <Treemap
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        ratio={4/3}
        stroke="#fff"
        fill="#8884d8"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Treemap>
    </ResponsiveContainer>
  );
};
