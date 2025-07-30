import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ExcelController } from '../controllers/excelController';
import { RequestWithFiles } from '../types';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limite
  }
});

const controller = new ExcelController();

// Middleware para processar os arquivos
const processFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const typedReq = req as RequestWithFiles;
    return await controller.processFiles(typedReq, res);
  } catch (error) {
    next(error);
  }
};

router.post('/process', 
  upload.fields([
    { name: 'orders', maxCount: 1 },
    { name: 'stock', maxCount: 1 }
  ]),
  processFiles
);

export default router;