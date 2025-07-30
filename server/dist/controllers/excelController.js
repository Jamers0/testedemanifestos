"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelController = void 0;
const excelService_1 = require("../services/excelService");
class ExcelController {
    constructor() {
        this.excelService = new excelService_1.ExcelService();
    }
    processFiles(req, res) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!((_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.orders) === null || _b === void 0 ? void 0 : _b[0]) || !((_d = (_c = req.files) === null || _c === void 0 ? void 0 : _c.stock) === null || _d === void 0 ? void 0 : _d[0])) {
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
                const processedData = this.excelService.processFiles(orderFile.buffer, stockFile.buffer);
                // Agrupar por setor para facilitar a visualização
                const groupedBySector = processedData.reduce((acc, item) => {
                    if (!acc[item.sector]) {
                        acc[item.sector] = [];
                    }
                    acc[item.sector].push(item);
                    return acc;
                }, {});
                // Agrupar por departamento
                const groupedByDepartment = processedData.reduce((acc, item) => {
                    if (!acc[item.department])
                        acc[item.department] = [];
                    acc[item.department].push(item);
                    return acc;
                }, {});
                // Agrupar por cliente
                const groupedByClient = processedData.reduce((acc, item) => {
                    if (!acc[item.client])
                        acc[item.client] = [];
                    acc[item.client].push(item);
                    return acc;
                }, {});
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
            }
            catch (error) {
                console.error('Erro no processamento:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao processar arquivos Excel'
                });
            }
        });
    }
}
exports.ExcelController = ExcelController;
