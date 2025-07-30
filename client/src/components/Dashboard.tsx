import React, { useMemo, useState } from 'react';
import { ProcessedData } from '../types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  data: ProcessedData[];
}

export const Dashboard: React.FC<Props> = ({ data }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'quantity' | 'stock'>('quantity');

  const filteredData = useMemo(() => {
    return selectedDepartment === 'all' 
      ? data 
      : data.filter(item => item.department === selectedDepartment);
  }, [data, selectedDepartment]);

  const stats = useMemo(() => {
    return {
      totalItems: filteredData.length,
      totalQuantity: filteredData.reduce((sum, item) => sum + item.plannedQty, 0),
      departments: [...new Set(data.map(item => item.department))],
      lowStock: filteredData.filter(item => item.stockPhoto < item.plannedQty).length
    };
  }, [filteredData, data]);

  const chartData = {
    labels: stats.departments,
    datasets: [
      {
        label: 'Quantidade Planejada',
        data: stats.departments.map(dept => 
          data
            .filter(item => item.department === dept)
            .reduce((sum, item) => sum + item.plannedQty, 0)
        ),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ],
  };

  const pieData = {
    labels: ['Estoque Suficiente', 'Estoque Baixo'],
    datasets: [{
      data: [
        data.length - stats.lowStock,
        stats.lowStock
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',
        'rgba(255, 99, 132, 0.5)'
      ]
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-4">
        <select 
          className="form-select rounded-md border-gray-300"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="all">Todos os Departamentos</option>
          {stats.departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select
          className="form-select rounded-md border-gray-300"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'quantity' | 'stock')}
        >
          <option value="quantity">Ordenar por Quantidade</option>
          <option value="stock">Ordenar por Estoque</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total de Itens</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalItems}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Departamentos</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.departments.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Qtd Total</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.totalQuantity.toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Estoque Baixo</h3>
          <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Distribuição por Departamento</h3>
          <Bar data={chartData} />
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Situação do Estoque</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};