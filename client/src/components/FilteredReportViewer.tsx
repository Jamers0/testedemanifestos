import React from 'react';
import { ProcessedData, FilterOptions } from '../types';
import { format } from 'date-fns';
import ExportButtons from './ExportButtons';

interface FilteredReportViewerProps {
  data: ProcessedData[];
  filters: FilterOptions;
  onPrint: () => void;
}

export const FilteredReportViewer: React.FC<FilteredReportViewerProps> = ({
  data,
  filters,
  onPrint
}) => {
  // Agrupar dados por departamento
  const groupedByDepartment = data.reduce((acc, item) => {
    if (!acc[item.department]) acc[item.department] = [];
    acc[item.department].push(item);
    return acc;
  }, {} as Record<string, ProcessedData[]>);

  // Gerar título do relatório
  const generateTitle = (): string => {
    const dateStr = filters.date ? format(filters.date, 'dd/MM/yyyy') : '';
    const hourStr = filters.hour ? ` ${filters.hour}` : '';
    
    let sectorStr = 'Todos os Setores';
    if (filters.sectors && filters.sectors.length === 1) {
      sectorStr = filters.sectors[0];
    } else if (filters.sectors && filters.sectors.length > 1) {
      sectorStr = 'Múltiplos Setores';
    }
    
    let clientStr = 'Geral';
    if (filters.clients && filters.clients.length === 1) {
      clientStr = filters.clients[0];
    } else if (filters.clients && filters.clients.length > 1) {
      clientStr = 'Geral';
    }
    
    return `${sectorStr} ${clientStr} ${dateStr}${hourStr}`;
  };

  const calculateTotals = (items: ProcessedData[]) => {
    return {
      totalItems: items.length,
      totalQuantity: items.reduce((sum, item) => sum + item.plannedQty, 0),
      lowStockItems: items.filter(item => item.stockPhoto < item.plannedQty * 0.2).length
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Cabeçalho do Relatório */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {generateTitle()}
            </h2>
            <p className="text-gray-600 mt-1">
              {data.length} itens encontrados
            </p>
          </div>
          <div className="flex gap-3">
            <ExportButtons
              data={data}
              filters={filters}
              title={generateTitle()}
            />
            <button
              onClick={onPrint}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 print:hidden flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimir
            </button>
          </div>
        </div>
      </div>

      {/* Relatório por Departamento */}
      <div className="p-6">
        {Object.entries(groupedByDepartment).map(([department, items]) => {
          const totals = calculateTotals(items);
          
          return (
            <div key={department} className="mb-8 sector-report">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {department}
                </h3>
                <div className="text-sm text-gray-600">
                  {totals.totalItems} itens | {totals.totalQuantity.toFixed(3)} total
                  {totals.lowStockItems > 0 && (
                    <span className="ml-2 text-red-600">
                      ({totals.lowStockItems} com estoque baixo)
                    </span>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Material
                      </th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qtd Plan.
                      </th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qtd Ex.
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        UoM
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Setor
                      </th>
                      <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estoque
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hora
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr 
                        key={index} 
                        className={`${
                          item.stockPhoto < item.plannedQty * 0.2 ? 'bg-red-50' : ''
                        } ${item.isNextDay ? 'bg-yellow-50' : ''}`}
                      >
                        <td className="px-3 py-2 whitespace-nowrap text-sm font-mono text-gray-900">
                          {item.code}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900 max-w-xs truncate">
                          {item.material}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right number">
                          {item.plannedQty.toFixed(3)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                          {item.executedQty || '-'}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                          {item.uom}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                          {item.client}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                          {item.sector}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right number">
                          {item.stockPhoto.toFixed(3)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                          <div className="flex flex-col">
                            <span>{item.plannedHour}</span>
                            {item.isNextDay && (
                              <span className="text-xs text-yellow-600 font-semibold">D+1</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totais por Departamento */}
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">
                    Total {department}: {totals.totalItems} itens
                  </span>
                  <span className="font-medium">
                    Quantidade Total: {totals.totalQuantity.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumo Geral */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Resumo Geral</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{data.length}</div>
            <div className="text-sm text-gray-600">Total de Itens</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data.reduce((sum, item) => sum + item.plannedQty, 0).toFixed(3)}
            </div>
            <div className="text-sm text-gray-600">Quantidade Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(groupedByDepartment).length}
            </div>
            <div className="text-sm text-gray-600">Departamentos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {data.filter(item => item.stockPhoto < item.plannedQty * 0.2).length}
            </div>
            <div className="text-sm text-gray-600">Estoque Baixo</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilteredReportViewer;
