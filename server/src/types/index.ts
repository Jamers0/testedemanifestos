import { Request } from 'express';

export interface RequestWithFiles extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

export interface ExcelOrderRow {
  codigo: string;
  material: string;
  quantidade: number;
  unidade: string;
  setor: string;
  cliente: string;
  dataPlanejada: string;
  observacoes?: string;
}

export interface ExcelStockRow {
  codigo: string | number;
  estoque: string | number;
  classe?: string;
}

export interface OrderData {
  code: string;
  material: string;
  quantity: number;
  uom: string;
  sector: string;
  client: string;
  plannedDate: string;
  observations: string;
  isNextDay: boolean;
}

export interface StockData {
  code: string;
  description: string;
  inventory: number;
  storageClass: string;
}

export interface ProcessedData {
  code: string;
  material: string;
  plannedQty: number;
  executedQty: string;
  uom: string;
  department: string;
  stockPhoto: number;
  sector: string;
  client: string;
  clientCode: string;
  clientName: string;
  plannedDate: string;
  plannedHour: string;
  isNextDay: boolean;
}

export interface ClientMapping {
  sigla: string;
  nome: string;
  codigo: string;
}

export interface FilterOptions {
  date?: Date;
  hour?: string;
  clients?: string[];
  excludedClients?: string[];
  departments?: string[];
  sectors?: string[];
  isNextDay?: boolean;
}

export interface ProcessedReport {
  sectors: Map<string, ProcessedData[]>;
  totalItems: number;
  stockItems: number;
  clients: ClientMapping[];
  departments: string[];
  availableSectors: string[];
}