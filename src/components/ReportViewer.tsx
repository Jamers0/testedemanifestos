import React from 'react';
import { ProcessedData } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportViewerProps {
  data: ProcessedData[];
  selectedDate: Date;
  selectedSector: string;
  onDateChange: (date: Date) => void;
  onSectorChange: (sector: string) => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  data,
  selectedDate,
  selectedSector,
  onDateChange,
  onSectorChange
}) => {
  const sectors = [...new Set(data.map(item => item.sector))];
  const filteredData = selectedSector 
    ? data.filter(item => item.sector === selectedSector)
    : data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6">
      {/* Controles */}
      <div className="flex gap-4 mb-6 print:hidden">
        <input
          type="date"
          value={format(selectedDate, 'yyyy-MM-dd')}
          onChange={(e) => onDateChange(new Date(e.target.value))}
          className="px-4 py-2 border rounded"
        />
        
        <select
          value={selectedSector}
          onChange={(e) => onSectorChange(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">Todos os Setores</option>
          {sectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>

        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Imprimir
        </button>
      </div>

      {/* Relatório */}
      <div className="overflow-x-auto">
        <div className="text-xl font-bold mb-4">
          {selectedSector || 'Todos os Setores'} - {
            format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
          }
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2">Código</th>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">Qtd Plan.</th>
              <th className="px-4 py-2">Qtd Ex.</th>
              <th className="px-4 py-2">UoM</th>
              <th className="px-4 py-2">Dep</th>
              <th className="px-4 py-2">Fotostock</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2">{item.code}</td>
                <td className="px-4 py-2">{item.material}</td>
                <td className="px-4 py-2 text-right">{item.plannedQty.toFixed(3)}</td>
                <td className="px-4 py-2 text-right">_______</td>
                <td className="px-4 py-2">{item.uom}</td>
                <td className="px-4 py-2">{item.department}</td>
                <td className="px-4 py-2 text-right">{item.stockPhoto.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
