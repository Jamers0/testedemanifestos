import React from 'react';
import { ProcessedData } from '../types';

interface Props {
  data: ProcessedData[];
  threshold?: number;
}

export const StockAlerts: React.FC<Props> = ({ data, threshold = 0.2 }) => {
  const criticalItems = data.filter(item => 
    item.stockPhoto < item.plannedQty * threshold
  );

  if (criticalItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-red-700 mb-2">
        Alertas de Estoque Crítico
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-red-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Código</th>
              <th className="px-4 py-2 text-left">Material</th>
              <th className="px-4 py-2 text-right">Estoque</th>
              <th className="px-4 py-2 text-right">Necessário</th>
            </tr>
          </thead>
          <tbody>
            {criticalItems.map(item => (
              <tr key={item.code} className="hover:bg-red-100">
                <td className="px-4 py-2">{item.code}</td>
                <td className="px-4 py-2">{item.material}</td>
                <td className="px-4 py-2 text-right text-red-600">{item.stockPhoto}</td>
                <td className="px-4 py-2 text-right">{item.plannedQty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};