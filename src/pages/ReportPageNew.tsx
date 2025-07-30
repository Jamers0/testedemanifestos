import React, { useState } from 'react';
import { ProcessedData, ApiResponse, FilterOptions, ClientMapping } from '../types';
import { FileUpload } from '../components/FileUpload';
import { Dashboard } from '../components/Dashboard';
import AdvancedFilters from '../components/AdvancedFilters';
import FilteredReportViewer from '../components/FilteredReportViewer';

const ReportPage: React.FC = () => {
  const [processedData, setProcessedData] = useState<ProcessedData[]>([]);
  const [filteredData, setFilteredData] = useState<ProcessedData[]>([]);
  const [clients, setClients] = useState<ClientMapping[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    date: new Date(),
    excludedClients: []
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleUploadSuccess = (data: ApiResponse) => {
    setProcessedData(data.data || []);
    setFilteredData(data.data || []);
    setClients(data.clients || []);
    setDepartments(data.departments || []);
    setSectors(data.sectors || []);
    setError(null);
    setShowFilters(true);
    console.log('Dados processados:', data);
  };

  const handleUploadError = (error: string) => {
    setError(error);
    setProcessedData([]);
    setFilteredData([]);
    setClients([]);
    setDepartments([]);
    setSectors([]);
    setShowFilters(false);
  };

  const handleFiltersChange = (newFilteredData: ProcessedData[], filters: FilterOptions) => {
    setFilteredData(newFilteredData);
    setCurrentFilters(filters);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Sistema de Processamento de Requisições
        </h1>

        {/* Upload de Arquivos */}
        {!processedData.length && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <FileUpload
              onSuccess={handleUploadSuccess}
              onError={handleUploadError}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        )}

        {/* Mensagens de Status */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
            <strong>Erro:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-8">
            <strong>Info:</strong> Processando arquivos...
          </div>
        )}

        {/* Dashboard */}
        {processedData.length > 0 && (
          <div className="mb-6">
            <Dashboard data={filteredData} />
          </div>
        )}

        {/* Filtros Avançados */}
        {showFilters && (
          <AdvancedFilters
            data={processedData}
            clients={clients}
            departments={departments}
            sectors={sectors}
            onFiltersChange={handleFiltersChange}
          />
        )}

        {/* Visualizador de Relatório Filtrado */}
        {filteredData.length > 0 && (
          <FilteredReportViewer
            data={filteredData}
            filters={currentFilters}
            onPrint={handlePrint}
          />
        )}

        {/* Botão para Novo Upload */}
        {processedData.length > 0 && (
          <div className="mt-6 text-center print:hidden">
            <button
              onClick={() => {
                setProcessedData([]);
                setFilteredData([]);
                setClients([]);
                setDepartments([]);
                setSectors([]);
                setShowFilters(false);
                setError(null);
              }}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Processar Novos Arquivos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
