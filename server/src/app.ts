import express from 'express';
import cors from 'cors';
import processRoutes from './routes/processRoutes';
import filterRoutes from './routes/filterRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', processRoutes);
app.use('/api', filterRoutes);

// Middleware de erro
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erro interno no servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;