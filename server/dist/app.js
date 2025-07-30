"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const processRoutes_1 = __importDefault(require("./routes/processRoutes"));
const filterRoutes_1 = __importDefault(require("./routes/filterRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rotas
app.use('/api', processRoutes_1.default);
app.use('/api', filterRoutes_1.default);
// Middleware de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Erro interno no servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
exports.default = app;
