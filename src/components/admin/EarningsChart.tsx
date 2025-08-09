
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EarningsChartProps {
    chartData: {
        labels: string[];
        data: number[];
    };
}

const EarningsChart: React.FC<EarningsChartProps> = ({ chartData }) => {
    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Revenue (USD)',
                data: chartData.data,
                fill: true,
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderColor: 'rgb(99, 102, 241)',
                tension: 0.3,
                pointBackgroundColor: 'rgb(99, 102, 241)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#94a3b8', // text-slate-400
                    callback: function(value: any) {
                        return '$' + value;
                    }
                },
                grid: {
                    color: 'rgba(100, 116, 139, 0.2)', // slate-600 with opacity
                }
            },
            x: {
                 ticks: {
                    color: '#94a3b8', // text-slate-400
                 },
                 grid: {
                    display: false,
                 }
            }
        },
        plugins: {
            legend: {
                display: false,
            },
             tooltip: {
                backgroundColor: '#1e293b', // bg-slate-800
                titleColor: '#f1f5f9', // text-slate-100
                bodyColor: '#cbd5e1', // text-slate-300
                borderColor: '#334155', // border-slate-700
                borderWidth: 1,
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 h-96">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Revenue (Last 30 Days)</h2>
            <div className="h-full relative pb-8">
                 <Line options={options} data={data} />
            </div>
        </div>
    );
};

export default EarningsChart;
