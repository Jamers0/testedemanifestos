import { 
  TableInstance as ReactTableInstance,
  UsePaginationInstanceProps,
  UsePaginationState,
  UseSortByInstanceProps,
  TableState as ReactTableState,
  UseTableOptions
} from 'react-table';
import { ProcessedData } from './index';

export interface TableState extends ReactTableState<ProcessedData> {
  pageIndex: number;
  pageSize: number;
}

export interface TableOptions extends UseTableOptions<ProcessedData> {
  initialState?: Partial<TableState>;
}

export interface TableInstance 
  extends ReactTableInstance<ProcessedData>,
    UsePaginationInstanceProps<ProcessedData>,
    UseSortByInstanceProps<ProcessedData> {
  state: TableState;
}

export interface SortableColumn {
  isSorted: boolean;
  isSortedDesc: boolean;
  getSortByToggleProps: () => any;
}