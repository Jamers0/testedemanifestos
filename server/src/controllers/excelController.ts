import { Response } from 'express';
import { ExcelService } from '../services/excelService';
import { RequestWithFiles } from '../types';

export class ExcelController {
  private excelService: ExcelService;

  constructor() {
    this.excelService = new ExcelService();
  }

  public async processFiles(req: RequestWithFiles, res: Response) {
    try {
      if (!req.files?.orders?.[0] || !req.files?.stock?.[0]) {
        return res.status(400).json({ 
          success: false, 
          error: 'Por favor, envie os arquivos de pedidos e estoque' 
        });
      }

      const orderFile = req.files.orders[0];
      const stockFile = req.files.stock[0];

      console.log('Processando arquivos:', {
        pedidos: orderFile.originalname,
        estoque: stockFile.originalname
      });

      const processedData = this.excelService.processFiles(
        orderFile.buffer,
        stockFile.buffer
      );

      // Agrupar por setor para facilitar a visualização
      const groupedBySector = processedData.reduce((acc, item) => {
        if (!acc[item.sector]) {
          acc[item.sector] = [];
        }
        acc[item.sector].push(item);
        return acc;
      }, {} as Record<string, typeof processedData>);

      // Agrupar por departamento
      const groupedByDepartment = processedData.reduce((acc, item) => {
        if (!acc[item.department]) acc[item.department] = [];
        acc[item.department].push(item);
        return acc;
      }, {} as Record<string, typeof processedData>);

      // Agrupar por cliente
      const groupedByClient = processedData.reduce((acc, item) => {
        if (!acc[item.client]) acc[item.client] = [];
        acc[item.client].push(item);
        return acc;
      }, {} as Record<string, typeof processedData>);

      // Obter dados adicionais
      const clients = this.excelService.getAvailableClients();
      const departments = [...new Set(processedData.map(item => item.department))];
      const sectors = [...new Set(processedData.map(item => item.sector))];

      return res.json({
        success: true,
        data: processedData,
        groupedBySector,
        groupedByDepartment,
        groupedByClient,
        clients,
        departments,
        sectors,
        summary: {
          totalItems: processedData.length,
          sectorsCount: Object.keys(groupedBySector).length,
          stockItems: processedData.filter(item => item.stockPhoto > 0).length,
          clientsCount: Object.keys(groupedByClient).length,
          departmentsCount: Object.keys(groupedByDepartment).length
        }
      });

    } catch (error) {
      console.error('Erro no processamento:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Erro ao processar arquivos Excel' 
      });
    }
  }
}