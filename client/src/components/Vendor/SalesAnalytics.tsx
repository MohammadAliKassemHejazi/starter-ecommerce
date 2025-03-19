import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface MonthlySalesItem {
  month: string;
  totalAmount: number;
}

interface SalesData {
  totalSales: number;
  monthlySales: MonthlySalesItem[];
}

interface SalesAnalyticsProps {
  salesData?: SalesData;
}

const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ salesData }) => {
  // Provide complete default values
  const safeData: SalesData = {
    totalSales: salesData?.totalSales || 0,
    monthlySales: salesData?.monthlySales || [],
  };

  const chartData = {
    labels: safeData.monthlySales.map(data => data.month),
    datasets: [
      {
        label: 'Monthly Sales',
        data: safeData.monthlySales.map(data => data.totalAmount),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">Sales Analytics</div>
      <div className="card-body">
        <div className="mb-3">
          Total Sales: ${safeData.totalSales.toFixed(2)}
        </div>
        
        {safeData.monthlySales.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <div className="text-center">
            {salesData ? "No sales data available" : "Loading sales data..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesAnalytics;