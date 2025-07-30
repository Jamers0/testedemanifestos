import { Router } from 'express';
import multer from 'multer';
import { ExcelController } from '../controllers/excelController';
import { RequestWithFiles } from '../types';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // limite de 10MB
  }
});

const excelController = new ExcelController();

// Configuração para upload de múltiplos arquivos
const uploadFiles = upload.fields([
  { name: 'orders', maxCount: 1 },
  { name: 'stock', maxCount: 1 }
]);

// Rota para processar os arquivos Excel
router.post('/process', uploadFiles, (req, res) => {
  // Fazemos o cast da requisição para o tipo correto
  excelController.processFiles(req as RequestWithFiles, res);
});

export default router;