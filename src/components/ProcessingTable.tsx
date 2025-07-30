import React, { useMemo, useState } from 'react';
import { 
  Column, 
  useTable, 
  usePagination, 
  useSortBy,
  Row,
  Cell
} from 'react-table';
import { ProcessedData } from '../types';
import { TableInstance, SortableColumn, TableOptions } from '../types/table';

interface Props {
  data: ProcessedData[];
  sector: string;
  date: string;
}

const ProcessingTable: React.FC<Props> = ({ data, sector, date }) => {
  const [pageSize, setPageSize] = useState(25);

  const columns = useMemo<Column<ProcessedData>[]>(() => [
    {
      Header: 'Código',
      accessor: 'code',
    },
    {
      Header: 'Material',
      accessor: 'material',
    },
    {
      Header: 'Qtd Plan.',
      accessor: 'plannedQty',
      Cell: ({ value }: { value: number }) => (
        <span>{value.toFixed(3)}</span>
      ),
    },
    {
      Header: 'Qtd Ex.',
      accessor: 'executedQty',
    },
    {
      Header: 'UoM',
      accessor: 'uom',
    },
    {
      Header: 'Dep',
      accessor: 'department',
    },
    {
      Header: 'Fotostck',
      accessor: 'stockPhoto',
      Cell: ({ value }: { value: number }) => (
        <span>{value.toFixed(3)}</span>
      ),
    },
  ], []);

  const tableOptions: TableOptions = {
    columns,
    data,
    initialState: {
      pageIndex: 0,
      pageSize
    }
  };

  const tableInstance = useTable(
    tableOptions,
    useSortBy,
    usePagination
  ) as unknown as TableInstance;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize: setTablePageSize,
    state: { pageIndex }
  } = tableInstance;

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setTablePageSize(size);
  };

  return (
    <div className="print-container">
      <h2 className="text-center text-xl font-bold mb-4">
        {sector} {date}
      </h2>
      
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => {
                  const sortableColumn = column as unknown as SortableColumn;
                  return (
                    <th
                      {...column.getHeaderProps(sortableColumn.getSortByToggleProps?.())}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.render('Header')}
                      <span>
                        {sortableColumn.isSorted
                          ? sortableColumn.isSortedDesc
                            ? ' ▼'
                            : ' ▲'
                          : ''}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map((row: Row<ProcessedData>) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell: Cell<ProcessedData>) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Anterior
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Próximo
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2">
            <span className="text-sm text-gray-700">
              Página <span className="font-medium">{pageIndex + 1}</span> de{' '}
              <span className="font-medium">{pageCount}</span>
            </span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="text-sm border-gray-300 rounded-md"
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>
                  Mostrar {size}
                </option>
              ))}
            </select>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                {'<<'}
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                {'<'}
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                {'>'}
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                {'>>'}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

ProcessingTable.displayName = 'ProcessingTable';

export default React.memo(ProcessingTable);