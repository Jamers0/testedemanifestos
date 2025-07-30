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
        fileSize: 10 * 1024 * 1024 // 10MB limite
    }
});
const controller = new excelController_1.ExcelController();
// Middleware para processar os arquivos
const processFiles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const typedReq = req;
        return yield controller.processFiles(typedReq, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/process', upload.fields([
    { name: 'orders', maxCount: 1 },
    { name: 'stock', maxCount: 1 }
]), processFiles);
exports.default = router;
