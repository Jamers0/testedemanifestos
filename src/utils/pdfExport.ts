import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProcessedData } from '../types';

export const generatePDF = async (
  data: ProcessedData[],
  sector: string,
  date: Date
): Promise<void> => {
  try {
    const doc = new jsPDF();
    
    // Configuração para suporte a caracteres especiais
    doc.setFont('helvetica');
    
    // Formatação da data para string
    const formattedDate = date.toLocaleDateString('pt-BR');
    
    // Título
    doc.setFontSize(16);
    doc.text(`${sector} ${formattedDate}`, doc.internal.pageSize.width / 2, 20, {
      align: 'center'
    });
    
    // Tabela
    autoTable(doc, {
      startY: 30,
      head: [[
        'Código',
        'Material',
        'Qtd Plan.',
        'Qtd Ex.',
        'UoM',
        'Dep',
        'Fotostck'
      ]],
      body: data.map(item => [
        item.code,
        item.material,
        item.plannedQty.toFixed(3),
        '',
        item.uom,
        item.department,
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
      }
    });
    
    // Download do PDF
    doc.save(`relatorio_${sector}_${formattedDate.replace(/\//g, '-')}.pdf`);
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw error;
  }
};