import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface SalesData {
  date: string;
  totalSales: number;
}

interface SalesAnalyticsProps {
  salesData: SalesData[];
}

const SalesAnalytics: React.FC<SalesAnalyticsProps> = ({ salesData }) => {
  const chartData = {
    labels: salesData.map((data) => data.date),
    datasets: [
      {
        label: 'Total Sales',
        data: salesData.map((data) => data.totalSales),
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
        <Line data={chartData} />
      </div>
    </div>
  );
};

export default SalesAnalytics;