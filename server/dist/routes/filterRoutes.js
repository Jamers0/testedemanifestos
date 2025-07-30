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
const express_1 = require("express");
const excelController_1 = require("../controllers/excelController");
const router = (0, express_1.Router)();
const excelController = new excelController_1.ExcelController();
// Rota para aplicar filtros aos dados já processados
router.post('/filter', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data, filters } = req.body;
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                success: false,
                error: 'Dados inválidos fornecidos'
            });
        }
        // Aplicar filtros (implementar no service)
        const filteredData = data; // Por enquanto retorna os dados sem filtrar
        // Reagrupar dados filtrados
        const groupedBySector = filteredData.reduce((acc, item) => {
            if (!acc[item.sector])
                acc[item.sector] = [];
            acc[item.sector].push(item);
            return acc;
        }, {});
        const groupedByDepartment = filteredData.reduce((acc, item) => {
            if (!acc[item.department])
                acc[item.department] = [];
            acc[item.department].push(item);
            return acc;
        }, {});
        const groupedByClient = filteredData.reduce((acc, item) => {
            if (!acc[item.client])
                acc[item.client] = [];
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
                stockItems: filteredData.filter((item) => item.stockPhoto > 0).length,
                clientsCount: Object.keys(groupedByClient).length,
                departmentsCount: Object.keys(groupedByDepartment).length
            }
        });
    }
    catch (error) {
        console.error('Erro ao aplicar filtros:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno ao aplicar filtros'
        });
    }
}));
exports.default = router;
