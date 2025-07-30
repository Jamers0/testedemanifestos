import React from 'react';
import { ProcessedData } from '../types';

export interface PrintReportProps {
  data: ProcessedData[];
  onPrint: () => Promise<void>;
  onDateChange: (date: Date) => void;
  onSectorChange: (sector: string) => void;
  sectors: string[];
  selectedDate: Date;
  selectedSector: string;
}

export const PrintReport: React.FC<PrintReportProps> = ({
  data,
  onPrint,
  onDateChange,
  onSectorChange,
  sectors,
  selectedDate,
  selectedSector
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-container">
      <div className="controls mb-4">
        {/* ...existing code... */}
      </div>
      
      <button onClick={handlePrint}>Imprimir Relatório</button>
      
      <table className="min-w-full divide-y divide-gray-200">
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
              <td>{item.plannedQty}</td>
              <td>{item.executedQty}</td>
              <td>{item.uom}</td>
              <td>{item.department}</td>
              <td>{item.stockPhoto}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintReport;