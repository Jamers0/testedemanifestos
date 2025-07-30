import React, { useState, useEffect, useMemo } from 'react';
import { ProcessedData, FilterOptions, ClientMapping } from '../types';
import DatePicker from 'react-datepicker';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

interface AdvancedFiltersProps {
  data: ProcessedData[];
  clients: ClientMapping[];
  departments: string[];
  sectors: string[];
  onFiltersChange: (filteredData: ProcessedData[], filters: FilterOptions) => void;
}

type DeliveryType = 'all' | 'today' | 'nextDay';

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  data,
  clients,
  departments,
  sectors,
  onFiltersChange
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    date: new Date(),
    excludedClients: []
  });
  
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [excludedClients, setExcludedClients] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('all');
  const [selectedHour, setSelectedHour] = useState<string>('');
  
  // Estados para as barras de busca
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [excludeSearchTerm, setExcludeSearchTerm] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showExcludeDropdown, setShowExcludeDropdown] = useState(false);

  // Inicializar com todos os clientes selecionados
  useEffect(() => {
    if (clients.length > 0 && selectedClients.length === 0) {
      setSelectedClients(['ALL']);
    }
  }, [clients, selectedClients.length]);

  // Filtrar clientes para busca
  const filteredClientsForSearch = useMemo(() => {
    if (!clientSearchTerm) return clients;
    return clients.filter(client => 
      client.sigla.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
      client.nome.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
      client.codigo.toLowerCase().includes(clientSearchTerm.toLowerCase())
    );
  }, [clients, clientSearchTerm]);

  const filteredClientsForExclude = useMemo(() => {
    if (!excludeSearchTerm) return clients;
    return clients.filter(client => 
      client.sigla.toLowerCase().includes(excludeSearchTerm.toLowerCase()) ||
      client.nome.toLowerCase().includes(excludeSearchTerm.toLowerCase()) ||
      client.codigo.toLowerCase().includes(excludeSearchTerm.toLowerCase())
    );
  }, [clients, excludeSearchTerm]);

  const applyFilters = React.useCallback(() => {
    let filteredData = [...data];
    let currentDate = new Date(filters.date || new Date());

    // Ajustar data para D+1
    if (deliveryType === 'nextDay') {
      currentDate = addDays(filters.date || new Date(), 1);
      setFilters(prev => ({ ...prev, date: currentDate }));
    }

    // Filtro por data
    const filterDate = format(currentDate, 'yyyy-MM-dd');
    filteredData = filteredData.filter(item => {
      const itemDate = item.plannedDate.split(' ')[0];
      return itemDate === filterDate;
    });

    // Filtro por tipo de entrega
    if (deliveryType === 'nextDay') {
      filteredData = filteredData.filter(item => item.isNextDay);
      // Para D+1, definir horário padrão como 08:00 se não especificado
      filteredData = filteredData.map(item => ({
        ...item,
        plannedHour: item.plannedHour || '08:00'
      }));
    } else if (deliveryType === 'today') {
      filteredData = filteredData.filter(item => !item.isNextDay);
    }

    // Filtro por horário
    if (selectedHour) {
      filteredData = filteredData.filter(item => 
        item.plannedHour.includes(selectedHour)
      );
    }

    // Filtro por clientes incluídos
    if (!selectedClients.includes('ALL') && selectedClients.length > 0) {
      filteredData = filteredData.filter(item => 
        selectedClients.includes(item.client)
      );
    }

    // Filtro por clientes excluídos
    if (excludedClients.length > 0) {
      filteredData = filteredData.filter(item => 
        !excludedClients.includes(item.client)
      );
    }

    // Filtro por departamentos
    if (selectedDepartments.length > 0) {
      filteredData = filteredData.filter(item => 
        selectedDepartments.includes(item.department)
      );
    }

    // Filtro por setores
    if (selectedSectors.length > 0) {
      filteredData = filteredData.filter(item => 
        selectedSectors.includes(item.sector)
      );
    }

    // Agrupar e somar quantidades por código único
    const groupedData = filteredData.reduce((acc, item) => {
      const key = `${item.code}_${item.sector}_${item.department}`;
      if (!acc[key]) {
        acc[key] = { ...item, plannedQty: 0 };
      }
      acc[key].plannedQty += item.plannedQty;
      return acc;
    }, {} as Record<string, ProcessedData>);

    const finalData = Object.values(groupedData);

    onFiltersChange(finalData, {
      ...filters,
      date: currentDate,
      hour: selectedHour,
      clients: selectedClients.includes('ALL') ? [] : selectedClients,
      excludedClients,
      departments: selectedDepartments,
      sectors: selectedSectors,
      isNextDay: deliveryType === 'nextDay'
    });
  }, [data, filters, deliveryType, selectedHour, selectedClients, excludedClients, selectedDepartments, selectedSectors, onFiltersChange]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleClientSelect = (clientSigla: string) => {
    if (clientSigla === 'ALL') {
      setSelectedClients(['ALL']);
    } else {
      setSelectedClients(prev => {
        const filtered = prev.filter(c => c !== 'ALL');
        if (filtered.includes(clientSigla)) {
          const newSelection = filtered.filter(c => c !== clientSigla);
          return newSelection.length === 0 ? ['ALL'] : newSelection;
        } else {
          return [...filtered, clientSigla];
        }
      });
    }
    setShowClientDropdown(false);
    setClientSearchTerm('');
  };

  const handleExcludeSelect = (clientSigla: string) => {
    if (clientSigla === 'NONE') {
      setExcludedClients([]);
    } else {
      setExcludedClients(prev => {
        if (prev.includes(clientSigla)) {
          return prev.filter(c => c !== clientSigla);
        } else {
          return [...prev, clientSigla];
        }
      });
    }
    setShowExcludeDropdown(false);
    setExcludeSearchTerm('');
  };

  const clearAllFilters = () => {
    setFilters({ date: new Date(), excludedClients: [] });
    setSelectedClients(['ALL']);
    setExcludedClients([]);
    setSelectedDepartments([]);
    setSelectedSectors([]);
    setDeliveryType('all');
    setSelectedHour('');
  };

  const getSelectedClientsDisplay = () => {
    if (selectedClients.includes('ALL')) return 'Todos';
    if (selectedClients.length === 0) return 'Nenhum';
    if (selectedClients.length <= 3) {
      return selectedClients.map(sigla => {
        const client = clients.find(c => c.sigla === sigla);
        return client?.sigla || sigla;
      }).join(', ');
    }
    return `${selectedClients.length} selecionados`;
  };

  const getExcludedClientsDisplay = () => {
    if (excludedClients.length === 0) return 'Nenhum';
    if (excludedClients.length <= 3) {
      return excludedClients.map(sigla => {
        const client = clients.find(c => c.sigla === sigla);
        return client?.sigla || sigla;
      }).join(', ');
    }
    return `${excludedClients.length} excluídos`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Filtros Avançados</h2>
        <button
          onClick={clearAllFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
        >
          Limpar Filtros
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data e Hora */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Planejamento
            </label>
            <DatePicker
              selected={filters.date}
              onChange={(date) => setFilters(prev => ({ ...prev, date: date || new Date() }))}
              locale={ptBR}
              dateFormat="dd/MM/yyyy"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horário
            </label>
            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os horários</option>
              <option value="08:00">08:00</option>
              <option value="10:00">10:00</option>
              <option value="12:00">12:00</option>
              <option value="14:00">14:00</option>
              <option value="16:00">16:00</option>
              <option value="18:00">18:00</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vencimento
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deliveryType"
                  value="all"
                  checked={deliveryType === 'all'}
                  onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}
                  className="mr-2"
                />
                Todas as entregas
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deliveryType"
                  value="today"
                  checked={deliveryType === 'today'}
                  onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}
                  className="mr-2"
                />
                Apenas hoje
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="deliveryType"
                  value="nextDay"
                  checked={deliveryType === 'nextDay'}
                  onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}
                  className="mr-2"
                />
                Apenas D+1 (Amanhã 08:00)
              </label>
            </div>
          </div>
        </div>

        {/* Filtros de Clientes */}
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incluir Clientes
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar cliente (código, sigla ou nome)..."
                value={clientSearchTerm}
                onChange={(e) => setClientSearchTerm(e.target.value)}
                onFocus={() => setShowClientDropdown(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Selecionados:</strong> {getSelectedClientsDisplay()}
              </div>
              
              {showClientDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div
                    onClick={() => handleClientSelect('ALL')}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      selectedClients.includes('ALL') ? 'bg-blue-100 text-blue-800' : ''
                    }`}
                  >
                    <div className="font-semibold">Todos</div>
                  </div>
                  {filteredClientsForSearch.map(client => (
                    <div
                      key={client.sigla}
                      onClick={() => handleClientSelect(client.sigla)}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 border-t ${
                        selectedClients.includes(client.sigla) ? 'bg-blue-100 text-blue-800' : ''
                      }`}
                    >
                      <div className="font-semibold">{client.sigla}</div>
                      <div className="text-sm text-gray-600">{client.nome}</div>
                      <div className="text-xs text-gray-500">{client.codigo}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excluir Clientes
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar cliente para excluir..."
                value={excludeSearchTerm}
                onChange={(e) => setExcludeSearchTerm(e.target.value)}
                onFocus={() => setShowExcludeDropdown(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <strong>Excluídos:</strong> {getExcludedClientsDisplay()}
              </div>
              
              {showExcludeDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div
                    onClick={() => handleExcludeSelect('NONE')}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      excludedClients.length === 0 ? 'bg-red-100 text-red-800' : ''
                    }`}
                  >
                    <div className="font-semibold">Nenhum</div>
                  </div>
                  {filteredClientsForExclude.map(client => (
                    <div
                      key={client.sigla}
                      onClick={() => handleExcludeSelect(client.sigla)}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 border-t ${
                        excludedClients.includes(client.sigla) ? 'bg-red-100 text-red-800' : ''
                      }`}
                    >
                      <div className="font-semibold">{client.sigla}</div>
                      <div className="text-sm text-gray-600">{client.nome}</div>
                      <div className="text-xs text-gray-500">{client.codigo}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filtros de Departamento e Setor */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departamentos
            </label>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {departments.map(dept => (
                <label key={dept} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(dept)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDepartments(prev => [...prev, dept]);
                      } else {
                        setSelectedDepartments(prev => prev.filter(d => d !== dept));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{dept}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Setores
            </label>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {sectors.map(sector => (
                <label key={sector} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSectors.includes(sector)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSectors(prev => [...prev, sector]);
                      } else {
                        setSelectedSectors(prev => prev.filter(s => s !== sector));
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{sector}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resumo dos Filtros Ativos */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Filtros Ativos:</h3>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded">
            Data: {format(filters.date || new Date(), 'dd/MM/yyyy')}
          </span>
          {selectedHour && (
            <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded">
              Horário: {selectedHour}
            </span>
          )}
          {deliveryType !== 'all' && (
            <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded">
              Vencimento: {deliveryType === 'nextDay' ? 'D+1' : 'Hoje'}
            </span>
          )}
          {!selectedClients.includes('ALL') && selectedClients.length > 0 && (
            <span className="px-2 py-1 bg-green-200 text-green-800 rounded">
              Clientes: {selectedClients.length}
            </span>
          )}
          {excludedClients.length > 0 && (
            <span className="px-2 py-1 bg-red-200 text-red-800 rounded">
              Excluídos: {excludedClients.length}
            </span>
          )}
          {selectedDepartments.length > 0 && (
            <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded">
              Departamentos: {selectedDepartments.length}
            </span>
          )}
          {selectedSectors.length > 0 && (
            <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded">
              Setores: {selectedSectors.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
