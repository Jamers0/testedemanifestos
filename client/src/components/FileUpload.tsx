import React, { useState } from 'react';
import { ApiResponse } from '../types';

interface FileUploadProps {
  onSuccess: (data: ApiResponse) => void;
  onError: (error: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onSuccess,
  onError,
  loading,
  setLoading
}) => {
  const [orderFile, setOrderFile] = useState<File | null>(null);
  const [stockFile, setStockFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderFile || !stockFile) {
      onError('Por favor, selecione ambos os arquivos');
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('orders', orderFile);
      formData.append('stock', stockFile);

      const response = await fetch('http://localhost:5000/api/process', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onSuccess(result);
      } else {
        onError(result.error || 'Erro ao processar arquivos');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      onError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Upload de Arquivos Excel
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo de Pedidos (.xlsx)
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setOrderFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              disabled={loading}
            />
            {orderFile && (
              <p className="mt-1 text-sm text-green-600">
                ✓ {orderFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo de Estoque (.xlsx)
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setStockFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              disabled={loading}
            />
            {stockFile && (
              <p className="mt-1 text-sm text-green-600">
                ✓ {stockFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!orderFile || !stockFile || loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processando...
          </div>
        ) : (
          'Processar Arquivos'
        )}
      </button>
    </form>
  );
};

export default FileUpload;