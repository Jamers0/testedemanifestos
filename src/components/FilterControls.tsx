import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('pt-BR', ptBR);

interface Props {
  selectedDate: Date;
  excludedClients: string[];
  onDateChange: (date: Date) => void;
  onClientExclude: (client: string) => void;
}

const FilterControls: React.FC<Props> = ({
  selectedDate,
  excludedClients,
  onDateChange,
  onClientExclude
}) => {
  return (
    <div className="mb-4 flex gap-4 items-center">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data de Planejamento
        </label>
        <DatePicker
          selected={selectedDate}
          onChange={onDateChange}
          locale="pt-BR"
          dateFormat="dd/MM/yyyy"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Excluir Cliente
        </label>
        <input
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onClientExclude(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {excludedClients.map(client => (
          <span
            key={client}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100"
          >
            {client}
            <button
              onClick={() => onClientExclude(client)}
              className="ml-1 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default FilterControls;