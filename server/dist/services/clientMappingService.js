"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientMappingService = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ClientMappingService {
    constructor() {
        this.clientMappings = [];
        this.loadClientMappings();
    }
    loadClientMappings() {
        try {
            // Carregar siglas
            const siglasPath = path.join(__dirname, '../../data/sigla de clientes.csv');
            const codigosPath = path.join(__dirname, '../../data/codigo de clientes.csv');
            // Primeiro, vamos tentar carregar dos CSVs na pasta v6 se os dados não existirem na pasta local
            const fallbackSiglasPath = path.join(__dirname, '../../../Nova pasta/v6/s/sigla de clientes.csv');
            const fallbackCodigosPath = path.join(__dirname, '../../../Nova pasta/v6/s/codigo de clientes.csv');
            let siglasContent = '';
            let codigosContent = '';
            // Tentar carregar siglas
            if (fs.existsSync(siglasPath)) {
                siglasContent = fs.readFileSync(siglasPath, 'utf-8');
            }
            else if (fs.existsSync(fallbackSiglasPath)) {
                siglasContent = fs.readFileSync(fallbackSiglasPath, 'utf-8');
            }
            // Tentar carregar códigos
            if (fs.existsSync(codigosPath)) {
                codigosContent = fs.readFileSync(codigosPath, 'utf-8');
            }
            else if (fs.existsSync(fallbackCodigosPath)) {
                codigosContent = fs.readFileSync(fallbackCodigosPath, 'utf-8');
            }
            // Processar siglas
            const siglas = new Map();
            if (siglasContent) {
                const siglasLines = siglasContent.split('\n').slice(1); // Pular cabeçalho
                siglasLines.forEach(line => {
                    const [codigo, nome] = line.split(',').map(s => s.trim().replace(/"/g, ''));
                    if (codigo && nome) {
                        siglas.set(codigo, nome);
                    }
                });
            }
            // Processar códigos
            const codigos = new Map();
            if (codigosContent) {
                const codigosLines = codigosContent.split('\n').slice(1); // Pular cabeçalho
                codigosLines.forEach(line => {
                    const parts = line.split(',');
                    if (parts.length >= 2) {
                        const codigo = parts[0].trim();
                        const nome = parts[1].trim().replace(/"/g, '');
                        if (codigo && nome) {
                            codigos.set(nome, { nome, codigo });
                        }
                    }
                });
            }
            // Combinar dados
            this.clientMappings = [];
            // Adicionar mapeamentos diretos das siglas
            siglas.forEach((nome, sigla) => {
                const codigoInfo = codigos.get(nome);
                this.clientMappings.push({
                    sigla,
                    nome,
                    codigo: (codigoInfo === null || codigoInfo === void 0 ? void 0 : codigoInfo.codigo) || `C${sigla}`
                });
            });
            console.log(`Carregados ${this.clientMappings.length} mapeamentos de clientes`);
        }
        catch (error) {
            console.error('Erro ao carregar mapeamentos de clientes:', error);
            // Adicionar alguns mapeamentos padrão
            this.clientMappings = [
                { sigla: 'EK', nome: 'Emirates Airlines', codigo: 'C000011' },
                { sigla: 'TP', nome: 'TAP Air Portugal', codigo: 'C000020' },
                { sigla: 'DL', nome: 'Delta Airlines', codigo: 'C000010' },
                { sigla: 'KE', nome: 'Korean Air', codigo: 'C000021' },
                { sigla: 'S4', nome: 'SATA', codigo: 'C000022' },
                { sigla: 'DT', nome: 'TAAG', codigo: 'C000023' }
            ];
        }
    }
    getClientBySigla(sigla) {
        return this.clientMappings.find(c => c.sigla === sigla);
    }
    getClientByCode(codigo) {
        return this.clientMappings.find(c => c.codigo === codigo);
    }
    getClientByName(nome) {
        return this.clientMappings.find(c => c.nome.toLowerCase().includes(nome.toLowerCase()));
    }
    getAllClients() {
        return this.clientMappings;
    }
    getClientName(sigla) {
        const client = this.getClientBySigla(sigla);
        return (client === null || client === void 0 ? void 0 : client.nome) || sigla;
    }
    getClientCode(sigla) {
        const client = this.getClientBySigla(sigla);
        return (client === null || client === void 0 ? void 0 : client.codigo) || `C${sigla}`;
    }
    // Mapear departamentos baseados na classe de armazenamento
    mapDepartment(storageClass) {
        const classMap = {
            'CF': 'Congelados',
            'RF': 'Refrigerados',
            'SC': 'Secos',
            'PR': 'PRAÇA',
            'CN': 'Consumíveis',
            'CQ': 'Cozinha Quente',
            'CF GERAL': 'Congelados',
            'RF GERAL': 'Refrigerados',
            'SC GERAL': 'Secos'
        };
        // Verificar se a classe termina com o nome de um cliente
        for (const [key, dept] of Object.entries(classMap)) {
            if (storageClass.startsWith(key)) {
                return dept;
            }
        }
        return storageClass || 'Outros';
    }
}
exports.ClientMappingService = ClientMappingService;
