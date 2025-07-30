import * as fs from 'fs';
import * as path from 'path';
import { ClientMapping } from '../types';

export class ClientMappingService {
  private clientMappings: ClientMapping[] = [];
  
  constructor() {
    this.loadClientMappings();
  }

  private loadClientMappings(): void {
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
      } else if (fs.existsSync(fallbackSiglasPath)) {
        siglasContent = fs.readFileSync(fallbackSiglasPath, 'utf-8');
      }

      // Tentar carregar códigos
      if (fs.existsSync(codigosPath)) {
        codigosContent = fs.readFileSync(codigosPath, 'utf-8');
      } else if (fs.existsSync(fallbackCodigosPath)) {
        codigosContent = fs.readFileSync(fallbackCodigosPath, 'utf-8');
      }

      // Processar siglas
      const siglas = new Map<string, string>();
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
      const codigos = new Map<string, { nome: string; codigo: string }>();
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
          codigo: codigoInfo?.codigo || `C${sigla}`
        });
      });

      console.log(`Carregados ${this.clientMappings.length} mapeamentos de clientes`);
      
    } catch (error) {
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

  public getClientBySigla(sigla: string): ClientMapping | undefined {
    return this.clientMappings.find(c => c.sigla === sigla);
  }

  public getClientByCode(codigo: string): ClientMapping | undefined {
    return this.clientMappings.find(c => c.codigo === codigo);
  }

  public getClientByName(nome: string): ClientMapping | undefined {
    return this.clientMappings.find(c => c.nome.toLowerCase().includes(nome.toLowerCase()));
  }

  public getAllClients(): ClientMapping[] {
    return this.clientMappings;
  }

  public getClientName(sigla: string): string {
    const client = this.getClientBySigla(sigla);
    return client?.nome || sigla;
  }

  public getClientCode(sigla: string): string {
    const client = this.getClientBySigla(sigla);
    return client?.codigo || `C${sigla}`;
  }

  // Mapear departamentos baseados na classe de armazenamento
  public mapDepartment(storageClass: string): string {
    const classMap: Record<string, string> = {
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
