"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const excelController_1 = require("../controllers/excelController");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // limite de 10MB
    }
});
const excelController = new excelController_1.ExcelController();
// Configuração para upload de múltiplos arquivos
const uploadFiles = upload.fields([
    { name: 'orders', maxCount: 1 },
    { name: 'stock', maxCount: 1 }
]);
// Rota para processar os arquivos Excel
router.post('/process', uploadFiles, (req, res) => {
    // Fazemos o cast da requisição para o tipo correto
    excelController.processFiles(req, res);
});
exports.default = router;
