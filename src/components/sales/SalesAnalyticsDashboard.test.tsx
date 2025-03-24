
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/utils';
import { SalesAnalyticsDashboard } from './SalesAnalyticsDashboard';
import { SalesDataItem } from '../../types/sales';

// Mock recharts to avoid rendering issues in tests
vi.mock('recharts', () => {
  const OriginalModule = vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    LineChart: () => <div data-testid="line-chart" />,
    BarChart: () => <div data-testid="bar-chart" />,
    PieChart: () => <div data-testid="pie-chart" />,
  };
});

describe('SalesAnalyticsDashboard', () => {
  const mockSalesData: SalesDataItem[] = [
    {
      id: '1',
      productName: 'Product 1',
      price: 100,
      quantity: 5,
      category: 'Category 1',
      margin: 20,
      month: 'Jan'
    },
    {
      id: '2',
      productName: 'Product 2',
      price: 200,
      quantity: 3,
      category: 'Category 2',
      margin: 30,
      month: 'Feb'
    }
  ];

  it('renders with sales data', () => {
    render(<SalesAnalyticsDashboard salesData={mockSalesData} />);
    
    // Check stats are rendered
    expect(screen.getByText('Total Products')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Average Margin')).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    
    // Check titles of charts
    expect(screen.getByText('Revenue & Profit Overview')).toBeInTheDocument();
    expect(screen.getByText('Products by Category')).toBeInTheDocument();
    expect(screen.getByText('Category Performance')).toBeInTheDocument();
    expect(screen.getByText('Detailed Analysis')).toBeInTheDocument();
  });

  it('shows empty state when no data is provided', () => {
    render(<SalesAnalyticsDashboard salesData={[]} />);
    expect(screen.getByText(/No sales data available/i)).toBeInTheDocument();
  });
});
