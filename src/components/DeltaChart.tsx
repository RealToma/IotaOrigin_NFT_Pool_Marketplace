import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = Array.from({ length: 21 }, (x, i) => i * 5);

export function DeltaChart({
  curve,
  delta,
}: {
  curve: 'exponential' | 'linear';
  delta: number;
}) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Spot Price',
        data: labels.map(i =>
          curve === 'exponential' ? Math.pow(1 + delta / 100, i) : 1 + delta * i
        ),
        borderColor: '#8888FF',
        backgroundColor: 'rgba(127, 127, 255, 0.5)',
      },
    ],
  };

  return <Line options={options} data={data} />;
}
