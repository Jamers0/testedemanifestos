import React from 'react';
import { ProcessedData } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SectorReportProps {
  sector: string;
  data: ProcessedData[];
  selectedDate: Date;
}

export const SectorReport: React.FC<SectorReportProps> = ({ 
  sector, 
  data, 
  selectedDate 
}) => {
  const handlePrint = () => {
    const printContent = document.getElementById(`sector-${sector}`);
    if (printContent) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${sector} - ${format(selectedDate, 'dd/MM/yyyy')}</title>
              <style>
                body { font-family: Arial, sans-serif; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #000; padding: 4px; text-align: left; }
                th { background-color: #f0f0f0; font-weight: bold; }
                .title { text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 10px; }
                .number { text-align: right; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        newWindow.document.close();
        newWindow.print();
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4 print:hidden">
        <h2 className="text-xl font-bold text-gray-800">{sector}</h2>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Imprimir {sector}
        </button>
      </div>

      <div id={`sector-${sector}`}>
        <div className="title">
          {sector} - {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Material</th>
              <th>Qtd Plan.</th>
              <th>Qtd Ex.</th>
              <th>UoM</th>
              <th>Dep</th>
              <th>Fotostock</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.code}</td>
                <td>{item.material}</td>
                <td className="number">{item.plannedQty.toFixed(3)}</td>
                <td className="number">_______</td>
                <td>{item.uom}</td>
                <td>{item.department}</td>
                <td className="number">{item.stockPhoto.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};