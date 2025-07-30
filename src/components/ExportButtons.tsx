import React from 'react';
import { ProcessedData, FilterOptions } from '../types';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ExportButtonsProps {
  data: ProcessedData[];
  filters: FilterOptions;
  title: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  data,
  filters,
  title
}) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Configuração para suporte a caracteres especiais
    doc.setFont('helvetica');
    
    // Título
    doc.setFontSize(16);
    doc.text(title, doc.internal.pageSize.width / 2, 20, {
      align: 'center'
    });
    
    // Agrupar por departamento
    const groupedByDepartment = data.reduce((acc, item) => {
      if (!acc[item.department]) acc[item.department] = [];
      acc[item.department].push(item);
      return acc;
    }, {} as Record<string, ProcessedData[]>);

    let yPosition = 30;
    
    Object.entries(groupedByDepartment).forEach(([department, items]) => {
      // Título do departamento
      doc.setFontSize(14);
      doc.text(`${department}`, 14, yPosition);
      yPosition += 10;
      
      // Tabela do departamento
      autoTable(doc, {
        startY: yPosition,
        head: [[
          'Código',
          'Material',
          'Qtd Plan.',
          'Qtd Ex.',
          'UoM',
          'Cliente',
          'Hora',
          'Estoque'
        ]],
        body: items.map(item => [
          item.code,
          item.material.substring(0, 30) + (item.material.length > 30 ? '...' : ''),
          item.plannedQty.toFixed(3),
          '',
          item.uom,
          item.client,
          item.plannedHour + (item.isNextDay ? ' D+1' : ''),
          item.stockPhoto.toFixed(3)
        ]),
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: 'bold'
        },
        margin: { left: 14, right: 14 }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 15;
      
      // Total do departamento
      const totalQty = items.reduce((sum, item) => sum + item.plannedQty, 0);
      doc.setFontSize(10);
      doc.text(`Total ${department}: ${totalQty.toFixed(3)}`, 14, yPosition);
      yPosition += 10;
      
      // Nova página se necessário
      if (yPosition > doc.internal.pageSize.height - 30) {
        doc.addPage();
        yPosition = 20;
      }
    });
    
    // Salvar arquivo
    const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    doc.save(fileName);
  };

  const exportToExcel = () => {
    // Agrupar por departamento e criar abas
    const groupedByDepartment = data.reduce((acc, item) => {
      if (!acc[item.department]) acc[item.department] = [];
      acc[item.department].push(item);
      return acc;
    }, {} as Record<string, ProcessedData[]>);

    // Criar workbook
    const wb = XLSX.utils.book_new();

    Object.entries(groupedByDepartment).forEach(([department, items]) => {
      const departmentData = items.map(item => ({
        'Código': item.code,
        'Material': item.material,
        'Qtd Plan.': item.plannedQty,
        'Qtd Ex.': '',
        'UoM': item.uom,
        'Cliente': item.client,
        'Hora': item.plannedHour,
        'D+1': item.isNextDay ? 'Sim' : 'Não',
        'Estoque': item.stockPhoto
      }));

      // Adicionar linha de total
      const totalQty = items.reduce((sum, item) => sum + item.plannedQty, 0);
      departmentData.push({
        'Código': 'TOTAL',
        'Material': '',
        'Qtd Plan.': totalQty,
        'Qtd Ex.': '',
        'UoM': '',
        'Cliente': '',
        'Hora': '',
        'D+1': '',
        'Estoque': 0
      });

      const ws = XLSX.utils.json_to_sheet(departmentData);
      
      // Ajustar largura das colunas
      const colWidths = [
        { wch: 10 }, // Código
        { wch: 40 }, // Material
        { wch: 12 }, // Qtd Plan.
        { wch: 12 }, // Qtd Ex.
        { wch: 8 },  // UoM
        { wch: 10 }, // Cliente
        { wch: 8 },  // Hora
        { wch: 8 },  // D+1
        { wch: 12 }  // Estoque
      ];
      ws['!cols'] = colWidths;
      
      // Nome da aba (máximo 31 caracteres)
      const sheetName = department.substring(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    // Criar aba de resumo geral
    const summaryData = [
      { 'Informação': 'Título', 'Valor': title },
      { 'Informação': 'Data Geração', 'Valor': format(new Date(), 'dd/MM/yyyy HH:mm') },
      { 'Informação': 'Total Itens', 'Valor': data.length },
      { 'Informação': 'Total Quantidade', 'Valor': data.reduce((sum, item) => sum + item.plannedQty, 0) },
      { 'Informação': 'Departamentos', 'Valor': Object.keys(groupedByDepartment).length },
      ...Object.entries(groupedByDepartment).map(([dept, items]) => ({
        'Informação': `${dept} - Itens`,
        'Valor': items.length
      })),
      ...Object.entries(groupedByDepartment).map(([dept, items]) => ({
        'Informação': `${dept} - Quantidade`,
        'Valor': items.reduce((sum, item) => sum + item.plannedQty, 0)
      }))
    ];

    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    summaryWs['!cols'] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Resumo');

    // Salvar arquivo
    const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="flex gap-3 print:hidden">
      <button
        onClick={exportToPDF}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Exportar PDF
      </button>
      
      <button
        onClick={exportToExcel}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Exportar Excel
      </button>
    </div>
  );
};

export default ExportButtons;
