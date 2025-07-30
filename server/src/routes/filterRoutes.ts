import { Router } from 'express';
import { ExcelController } from '../controllers/excelController';
import { FilterOptions } from '../types';

const router = Router();
const excelController = new ExcelController();

// Rota para aplicar filtros aos dados já processados
router.post('/filter', async (req, res) => {
  try {
    const { data, filters }: { data: any[], filters: FilterOptions } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: 'Dados inválidos fornecidos'
      });
    }

    // Aplicar filtros (implementar no service)
    const filteredData = data; // Por enquanto retorna os dados sem filtrar
    
    // Reagrupar dados filtrados
    const groupedBySector = filteredData.reduce((acc: any, item: any) => {
      if (!acc[item.sector]) acc[item.sector] = [];
      acc[item.sector].push(item);
      return acc;
    }, {});

    const groupedByDepartment = filteredData.reduce((acc: any, item: any) => {
      if (!acc[item.department]) acc[item.department] = [];
      acc[item.department].push(item);
      return acc;
    }, {});

    const groupedByClient = filteredData.reduce((acc: any, item: any) => {
      if (!acc[item.client]) acc[item.client] = [];
      acc[item.client].push(item);
      return acc;
    }, {});

    return res.json({
      success: true,
      data: filteredData,
      groupedBySector,
      groupedByDepartment,
      groupedByClient,
      summary: {
        totalItems: filteredData.length,
        sectorsCount: Object.keys(groupedBySector).length,
        stockItems: filteredData.filter((item: any) => item.stockPhoto > 0).length,
        clientsCount: Object.keys(groupedByClient).length,
        departmentsCount: Object.keys(groupedByDepartment).length
      }
    });

  } catch (error) {
    console.error('Erro ao aplicar filtros:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao aplicar filtros'
    });
  }
});

export default router;
